// @flow
'use strict';

const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const WebpackChunkHash = require('webpack-chunk-hash');
const writeContextModule = require('./write-context-module');
const joinUrlParts = require('./join-url-parts');
const constants = require('./constants');
const getPostcssPlugins = require('./get-postcss-plugins');
const createBabelConfig = require('./create-babel-config');

// Cache it to ensure we don't do unnecessary work within one process.
let cachedConfig;

// Create the base Webpack configuration, shared by both client and static builds.
function createWebpackConfigBase(
  batfishConfig: BatfishConfiguration,
  options: { target?: 'browser' | 'node' } = {}
): Promise<webpack$Configuration> {
  if (cachedConfig) return Promise.resolve(cachedConfig);
  const isExample = path
    .dirname(batfishConfig.pagesDirectory)
    .startsWith(path.join(__dirname, '../../examples'));

  return writeContextModule(batfishConfig).then(batfishContextPath => {
    const jsxtremeMarkdownOptions = _.clone(
      batfishConfig.jsxtremeMarkdownOptions
    );
    const prependJs = jsxtremeMarkdownOptions.prependJs || [];
    prependJs.push(
      `import { prefixUrl, prefixUrlAbsolute } from '@mapbox/batfish/modules/prefix-url';`
    );
    prependJs.push(
      `import { routeTo, routeToPrefixed } from '@mapbox/batfish/modules/route-to';`
    );
    jsxtremeMarkdownOptions.prependJs = prependJs;

    const fileLoaderTest = new RegExp(
      `\\.(${batfishConfig.fileLoaderExtensions.join('|')})$`
    );

    // Configs
    const babelConfig = createBabelConfig(batfishConfig, {
      target: options.target
    });
    const babelLoaderConfig = {
      loader: 'babel-loader',
      options: {
        cacheDirectory: !batfishConfig.production,
        presets: babelConfig.presets,
        plugins: babelConfig.plugins,
        babelrc: false,
        compact: true
      }
    };

    // Create a `resource` to determine what gets compiled by Babel.
    // See https://webpack.js.org/configuration/module/#condition.
    const babelOrConditions = [
      { include: /@mapbox\/batfish\/(?!\/node_modules).*/ }
    ];
    if (batfishConfig.babelInclude) {
      batfishConfig.babelInclude.forEach(condition => {
        if (typeof condition === 'string' && !path.isAbsolute(condition)) {
          babelOrConditions.push({
            include: new RegExp(`${condition}(?!/node_modules).*`)
          });
        } else {
          // Any condition other than a node_module name should be a
          // direct Webpack condition.
          babelOrConditions.push({ include: condition });
        }
      });
    }
    const babelResource = {
      or: [
        { test: /\.jsx?$/, exclude: batfishConfig.babelExclude },
        { and: [{ test: /\.jsx?$/ }, { or: babelOrConditions }] }
      ]
    };

    const aliases = {};
    aliases['batfish-internal/context'] = batfishContextPath;
    aliases['batfish-internal/application-wrapper'] =
      batfishConfig.applicationWrapperPath;
    aliases['@mapbox/batfish/data'] = path.join(
      batfishConfig.temporaryDirectory,
      constants.DATA_DIRECTORY
    );
    if (isExample) {
      // Not necessary for dependents, but necessary for examples
      aliases['@mapbox/batfish/modules'] = path.join(
        __dirname,
        '../webpack/public'
      );
    }

    let moduleRules = [
      {
        resource: babelResource,
        use: [babelLoaderConfig]
      },
      {
        test: new RegExp(
          _.escapeRegExp(batfishConfig.pagesDirectory) + '.*\\.md$'
        ),
        use: [
          babelLoaderConfig,
          {
            loader: '@mapbox/jsxtreme-markdown-loader',
            options: jsxtremeMarkdownOptions
          }
        ]
      },
      // Static assets are copied into assets/ with an added hash,
      // and when you require() them you'll get the proper
      // filename (with hash).
      {
        test: fileLoaderTest,
        loader: 'file-loader',
        options: {
          hash: 'sha512',
          digest: 'hex',
          name: batfishConfig.production
            ? '[name]-[hash].[ext]'
            : '[name].[ext]'
        }
      }
    ];
    if (batfishConfig.pageSpecificCss) {
      moduleRules.push({
        test: new RegExp(
          _.escapeRegExp(batfishConfig.pagesDirectory) + '.*\\.css$'
        ),
        use: [
          babelLoaderConfig,
          {
            loader: 'react-helmet-postcss-loader',
            options: { postcssPlugins: getPostcssPlugins(batfishConfig) }
          }
        ]
      });
    }
    if (batfishConfig.webpackLoaders) {
      moduleRules = moduleRules.concat(batfishConfig.webpackLoaders);
    }

    const config: webpack$Configuration = {
      output: {
        path: batfishConfig.outputDirectory,
        publicPath: joinUrlParts(
          batfishConfig.siteBasePath,
          batfishConfig.publicAssetsPath,
          ''
        ),
        pathinfo: !batfishConfig.production,
        filename: '[name].js'
      },
      performance: {
        hints: batfishConfig.verbose ? 'warning' : false
      },
      resolveLoader: {
        // Register local loaders.
        alias: {
          'react-helmet-postcss-loader': path.join(
            __dirname,
            './react-helmet-postcss-loader.js'
          )
        },
        // Loader names need to be strings, and to allow them to be looked
        // up within Batfish's module dependencies, not just the project's,
        // we need this.
        modules: [path.join(__dirname, '../../node_modules'), 'node_modules']
      },
      resolve: {
        alias: aliases
      },
      module: {
        rules: moduleRules
      },
      plugins: [
        // Define global variables available in source JS.
        new webpack.DefinePlugin({
          // NODE_ENV is used by React (and maybe other libs) to conditionally
          // eliminate helpful debugging code.
          'process.env.NODE_ENV': !batfishConfig.production
            ? '"development"'
            : '"production"'
        }),
        // Determine hashes with file content, not random strings. This allows
        // for long-term caching.
        new WebpackChunkHash()
      ],
      // Designate sourcemap type.
      devtool: !batfishConfig.production
        ? batfishConfig.developmentDevtool
        : batfishConfig.productionDevtool,
      cache: !batfishConfig.production,
      // Don't attempt to continue if there are any errors during
      // production build.
      bail: batfishConfig.production
    };

    cachedConfig = config;
    return config;
  });
}

// For tests.
createWebpackConfigBase._clearCache = () => {
  cachedConfig = null;
};

module.exports = createWebpackConfigBase;
