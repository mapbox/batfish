'use strict';

const path = require('path');
const webpack = require('webpack');
const WebpackChunkHash = require('webpack-chunk-hash');
const createBatfishContext = require('./create-batfish-context');

/**
 * Create a Webpack configuration with some standardized settings.
 *
 * @param {BatfishConfig} batfishConfig
 * @return {Object}
 */
function createWebpackConfigBase(batfishConfig) {
  const batfishContextPath = createBatfishContext(batfishConfig);

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
  ];
  if (!batfishConfig.production) {
    babelPlugins.push('transform-react-jsx-source');
    babelPlugins.push('transform-react-jsx-self');
  }

  const babelLoaderConfig = {
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
    options: {
      cacheDirectory: !batfishConfig.production
        ? path.join(__dirname, '../babel-cache')
        : false,
      presets: babelPresets,
      plugins: babelPlugins,
      babelrc: false
    }
  };

  const config = {
    output: {
      path: batfishConfig.outputDirectory,
      publicPath: '/assets/',
      pathinfo: batfishConfig.verbose,
      filename: '[name].js'
    },
    performance: {
      hints: batfishConfig.verbose ? 'warning' : false
    },
    resolve: {
      alias: {
        'batfish/context': batfishContextPath,
        'batfish/wrapper': batfishConfig.wrapperPath
      }
    },
    module: {
      rules: [
        babelLoaderConfig,
        // Static assets are copied into assets/ with an added hash,
        // and when you require() them you'll get the proper
        // filename (with hash).
        {
          test: /\.(jpe?g|png|webp|mp4|webm|woff|woff2)$/i,
          loader: 'file-loader',
          options: {
            hash: 'sha512',
            digest: 'hex',
            name: '[name]-[hash].[ext]'
          }
        }
      ]
    },
    plugins: [
      // Define global variables available in source JS.
      new webpack.DefinePlugin({
        // NODE_ENV is used by React (and maybe other libs) to conditionally
        // eliminate helpful debugging code.
        'process.env.NODE_ENV': !batfishConfig.production
          ? '"development"'
          : '"production"',
        // DEPLOY_ENV is used in config to pick between staging/production.
        'process.env.DEPLOY_ENV': `"${process.env.DEPLOY_ENV}"`,
        'process.env.TESTING': !!process.env.TESTING
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

  return config;
}

module.exports = createWebpackConfigBase;