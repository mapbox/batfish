'use strict';

const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const WebpackChunkHash = require('webpack-chunk-hash');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const createBatfishContext = require('./create-batfish-context');

// Cache it to ensure we don't do unnecessary work within one process.
let cachedConfig;

/**
 * Create the base Webpack configuration, shared by both client and static builds.
 *
 * @param {BatfishConfig} batfishConfig
 * @return {Promise<Object>} - Resolves with the Webpack config.
 */
function createWebpackConfigBase(batfishConfig) {
  if (cachedConfig) return Promise.resolve(cachedConfig);
  const isExample = path
    .dirname(batfishConfig.pagesDirectory)
    .startsWith(path.join(__dirname, '../examples'));

  return createBatfishContext(batfishConfig).then(batfishContextPath => {
    // Plugins
    const jsxtremeMarkdownOptions = _.clone(
      batfishConfig.jsxtremeMarkdownOptions
    );
    if (!jsxtremeMarkdownOptions.modules) jsxtremeMarkdownOptions.modules = [];
    jsxtremeMarkdownOptions.modules.push(
      `import { prefixUrl, prefixUrlAbsolute } from '@mapbox/batfish/modules/prefix-url';`
    );
    jsxtremeMarkdownOptions.modules.push(
      `import { routeTo, routeToPrefixed } from '@mapbox/batfish/modules/route-to';`
    );

    const babelPresets = ['es2015', 'react'].concat(
      batfishConfig.babelPresets || []
    );

    const babelPlugins = [
      'syntax-dynamic-import',
      [
        '@mapbox/babel-plugin-transform-jsxtreme-markdown',
        {
          packageName: '@mapbox/batfish/modules/md',
          remarkPlugins: jsxtremeMarkdownOptions.remarkPlugins,
          rehypePlugins: jsxtremeMarkdownOptions.rehypePlugins
        }
      ]
    ].concat(batfishConfig.babelPlugins || []);
    if (batfishConfig.production) {
      babelPlugins.push('transform-react-remove-prop-types');
    } else {
      babelPlugins.push('transform-react-jsx-source');
      babelPlugins.push('transform-react-jsx-self');
    }

    const fileLoaderTest = new RegExp(
      `\\.(${batfishConfig.fileLoaderExtensions.join('|')})$`
    );

    // Configs
    const babelLoaderConfig = {
      loader: 'babel-loader',
      options: {
        cacheDirectory: !batfishConfig.production
          ? path.join(__dirname, '../babel-cache')
          : false,
        presets: babelPresets,
        plugins: babelPlugins,
        babelrc: false,
        compact: true
      }
    };

    const cssLoaderConfig = {
      loader: 'css-loader',
      options: {
        minimize: batfishConfig.production,
        sourceMap: !batfishConfig.production
      }
    };

    const postcssLoaderConfig = {
      loader: 'postcss-loader',
      options: {
        plugins() {
          return batfishConfig.postcssPlugins;
        }
      }
    };

    const aliases = {
      'batfish-internal/context': batfishContextPath,
      'batfish-internal/application-wrapper':
        batfishConfig.applicationWrapperPath
    };
    if (isExample) {
      // Not necessary for dependents, but necessary for examples
      aliases['@mapbox/batfish/modules'] = path.join(
        __dirname,
        '../src/public'
      );
    }

    const config = {
      output: {
        path: batfishConfig.outputDirectory,
        publicPath: `${batfishConfig.siteBasePath}/assets/`,
        pathinfo: batfishConfig.verbose,
        filename: '[name].js'
      },
      performance: {
        hints: batfishConfig.verbose ? 'warning' : false
      },
      // Register local loaders
      resolveLoader: {
        // Loader names need to be strings, and to allow them to be looked
        // up within batfish's module dependencies, not just the project's,
        // we need this.
        modules: [path.join(__dirname, '../node_modules'), 'node_modules']
      },
      resolve: {
        alias: aliases
      },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            enforce: 'pre',
            exclude: batfishConfig.babelExclude,
            use: [babelLoaderConfig]
          },
          {
            test: new RegExp(
              _.escapeRegExp(batfishConfig.pagesDirectory) + '.*.md$'
            ),
            enforce: 'pre',
            use: [
              babelLoaderConfig,
              {
                loader: '@mapbox/jsxtreme-markdown-loader',
                options: jsxtremeMarkdownOptions
              }
            ]
          },
          // style-loader breaks server-rendering. So instead we
          // extract the CSS text into a file, styles.css, which gets
          // loaded in the document head. Works in tandem with the plugin below.
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [cssLoaderConfig, postcssLoaderConfig]
            })
          },
          // Static assets are copied into assets/ with an added hash,
          // and when you require() them you'll get the proper
          // filename (with hash).
          {
            test: fileLoaderTest,
            loader: 'file-loader',
            enforce: 'post',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: '[name]-[hash].[ext]'
            }
          },
          // JSON!
          {
            test: /\.json$/,
            use: 'json-loader'
          }
        ].concat(batfishConfig.webpackLoaders || [])
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
        // Extract imported CSS into one file to be cached. Works in tandem with the loader above.
        new ExtractTextPlugin({
          filename: !batfishConfig.production
            ? 'styles.css'
            : 'styles-[chunkhash].css',
          allChunks: true
        }),
        // Determine hashes with file content, not random strings. This allows for long-term caching.
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

module.exports = createWebpackConfigBase;
