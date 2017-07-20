'use strict';

const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const AssetsPlugin = require('assets-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const createWebpackConfigBase = require('./create-webpack-config-base');

/**
 * Create a Webpack configuration for all the assets that will be loaded by the client.
 *
 * @param {BatfishConfig} batfishConfig
 * @param {Object} [options]
 * @param {boolean} [options.devServer] - Whether or not this build is for the
 *   development server.
 * @return {Promise<Object>} - Resolves with the Webpack config.
 */
function createWebpackConfigClient(batfishConfig, options) {
  return createWebpackConfigBase(batfishConfig).then(baseConfig => {
    let vendorModules = [
      'es6-promise/auto',
      'react',
      'react-dom',
      'react-helmet'
    ];
    if (batfishConfig.vendorModules !== undefined) {
      vendorModules = vendorModules.concat(batfishConfig.vendorModules);
    }

    const clientPlugins = [
      // Emit a file with assets' paths.
      // This is used in build processes to grab built files, whose names
      // include hashes so cannot be known without this dictionary.
      new AssetsPlugin({
        path: path.resolve(batfishConfig.outputDirectory),
        filename: 'assets.json',
        processOutput: x => JSON.stringify(x, null, 2)
      }),
      // Extract universal vendor files (defined above) from everything else.
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'
      }),
      // Bundle together any other modules from anywhere imported more than 3 times.
      new webpack.optimize.CommonsChunkPlugin({
        children: true,
        minChunks: 3
      }),
      // Trying to follow advice for long-term caching described here:
      // https://jeremygayed.com/dynamic-vendor-bundling-in-webpack-528993e48aab#.hjgai17ap
      new webpack.optimize.CommonsChunkPlugin('manifest'),
      // Define an environment variable for special cases
      new webpack.DefinePlugin({
        'process.env.DEV_SERVER': options && options.devServer
      })
    ].concat(batfishConfig.webpackPlugins || []);
    const uglifyPlugin = new ParallelUglifyPlugin({
      // sourceMap: true,
      uglifyJS: {
        compress: {
          screw_ie8: true, // React doesn't support IE8, neither do we
          warnings: batfishConfig.verbose
        },
        mangle: {
          screw_ie8: true
        },
        output: {
          comments: false,
          screw_ie8: true
        }
      }
    });
    if (batfishConfig.production) {
      clientPlugins.push(uglifyPlugin);
    }

    const appEntry = [];
    if (!batfishConfig.production && batfishConfig.inlineJs) {
      batfishConfig.inlineJs.forEach(jsData => {
        appEntry.push(jsData.filename);
      });
    }
    appEntry.push(path.join(__dirname, '../src/batfish-app.js'));

    const clientConfig = {
      entry: {
        app: appEntry,
        vendor: vendorModules
      },
      output: {
        filename: !batfishConfig.production
          ? '[name].js'
          : '[name]-[chunkhash].js',
        chunkFilename: !batfishConfig.production
          ? '[name].chunk.js'
          : '[name]-[chunkhash].chunk.js'
      },
      target: 'web',
      plugins: clientPlugins
    };

    let config = webpackMerge(baseConfig, clientConfig);
    if (batfishConfig.webpackConfigClientTransform) {
      config = batfishConfig.webpackConfigClientTransform(config);
    }
    return config;
  });
}

module.exports = createWebpackConfigClient;
