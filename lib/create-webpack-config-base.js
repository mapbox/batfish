'use strict';

const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const WebpackChunkHash = require('webpack-chunk-hash');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const createBatfishContext = require('./create-batfish-context');
const createPrefixUrl = require('./create-prefix-url');

// Cache it to ensure we don't do unnecessary work within one process.
let cachedConfig;

/**
 * Create the base Webpack configuration, shared by both client and static builds.
 *
 * @param {BatfishConfig} batfishConfig
 * @return {Promise<Object>} Resolves with the Webpack config.
 */
function createWebpackConfigBase(batfishConfig) {
  if (cachedConfig) return Promise.resolve(cachedConfig);

  const prefixUrlModulePath = createPrefixUrl(batfishConfig);

  return createBatfishContext(batfishConfig).then(batfishContextPath => {
    const babelPresets = ['es2015', 'react'];
    if (batfishConfig.production) babelPresets.push('react-optimize');

    const babelPlugins = [
      'transform-class-properties',
      'syntax-dynamic-import',
      [
        'transform-runtime',
        {
          helpers: true,
          polyfill: false,
          regenerator: false
        }
      ]
    ].concat(batfishConfig.babelPlugins || []);
    if (!batfishConfig.production) {
      babelPlugins.push('transform-react-jsx-source');
      babelPlugins.push('transform-react-jsx-self');
    }

    const babelLoaderConfig = {
      loader: 'babel-loader',
      options: {
        cacheDirectory: !batfishConfig.production
          ? path.join(__dirname, '../babel-cache')
          : false,
        presets: babelPresets,
        plugins: babelPlugins,
        babelrc: false
      }
    };

    const cssLoaderConfig = {
      loader: 'css-loader',
      options: {
        minimize: batfishConfig.production,
        sourceMap: !batfishConfig.production
      }
    };

    let postcssPlugins = [
      autoprefixer({ browsers: batfishConfig.autoprefixerBrowsers })
    ];
    if (batfishConfig.postcssPlugins) {
      postcssPlugins = postcssPlugins.concat(batfishConfig.postcssPlugins);
    }
    const postcssLoaderConfig = {
      loader: 'postcss-loader',
      options: {
        plugins() {
          return postcssPlugins;
        }
      }
    };

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
        alias: {
          'helmet-style-loader': path.join(
            __dirname,
            './helmet-style-loader.js'
          )
        }
      },
      resolve: {
        alias: {
          'batfish/context': batfishContextPath,
          'batfish/wrapper': batfishConfig.wrapperPath,
          'batfish/prefix-url': prefixUrlModulePath,
          'batfish/scroll-restoration': path.join(
            __dirname,
            '../src/scroll-restoration.js'
          ),
          'batfish/route-to': path.join(__dirname, '../src/route-to.js')
        }
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            enforce: 'pre',
            exclude: batfishConfig.babelExclude,
            use: [babelLoaderConfig]
          },
          {
            test: new RegExp(_.escapeRegExp(batfishConfig.pagesDirectory) + '.*\.md$'),
            enforce: 'pre',
            use: [
              babelLoaderConfig,
              { loader: '@mapbox/md-react-transformer-loader' }
            ]
          },
          // style-loader breaks server-rendering. So instead we
          // extract the CSS text into a file, styles.css, which gets
          // loaded in the document head. Works in tandem with the plugin below.
          {
            test: /\.css$/,
            exclude: new RegExp(_.escapeRegExp(batfishConfig.pagesDirectory)),
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [cssLoaderConfig, postcssLoaderConfig]
            })
          },
          {
            test: new RegExp(_.escapeRegExp(batfishConfig.pagesDirectory) + '.*\.css'),
            enforce: 'pre',
            use: [
              babelLoaderConfig,
              { loader: 'helmet-style-loader' },
              postcssLoaderConfig
            ]
          },
          // Static assets are copied into assets/ with an added hash,
          // and when you require() them you'll get the proper
          // filename (with hash).
          {
            test: /\.(jpe?g|png|gif|webp|mp4|webm|woff|woff2)$/i,
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
            : 'styles-[chunkhash].css'
        }),
        // Determine hashes with file content, not random strings. This allows for long-term caching.
        new WebpackChunkHash()
      ],
      // Designate sourcemap type.
      devtool: !batfishConfig.production
        ? 'cheap-module-source-map'
        : 'source-map',
      cache: !batfishConfig.production,
      stats: batfishConfig.verbose ? true : 'errors-only',
      // Don't attempt to continue if there are any errors during
      // production build.
      bail: batfishConfig.production
    };

    cachedConfig = config;
    return config;
  });
}

module.exports = createWebpackConfigBase;
