'use strict';

const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const AssetsPlugin = require('assets-webpack-plugin');
const createWebpackConfigBase = require('./create-webpack-config-base');

/**
 * Create a Webpack configuration for all the assets that will load in the client.
 *
 * @param {BatfishConfig} batfishConfig

 * @return {Object}
 */
function createWebpackConfigClient(batfishConfig) {
  const baseConfig = createWebpackConfigBase(batfishConfig);

  let vendorModules = ['es6-promise', 'react', 'react-dom', 'react-helmet'];
  if (batfishConfig.vendor) {
    vendorModules = vendorModules.concat(batfishConfig.vendor);
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
    new webpack.optimize.CommonsChunkPlugin('manifest')
  ];
  const uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
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
  });
  if (batfishConfig.production) {
    clientPlugins.push(uglifyPlugin);
  }

  const clientConfig = {
    entry: {
      app: [batfishConfig.entry],
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

  return webpackMerge(baseConfig, clientConfig);
}

module.exports = createWebpackConfigClient;
