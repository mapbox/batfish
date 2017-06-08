'use strict';

const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const AssetsPlugin = require('assets-webpack-plugin');
const createWebpackConfigBase = require('./create-webpack-config-base');

/**
 * Create a Webpack configuration for all the assets that will load in the client.
 *
 * @param {Object} options
 * @param {string} options.entry
 * @param {string} options.sourceDirectory
 * @param {string} options.outputDirectory
 * @param {boolean} [options.debug=true]
 * @param {boolean} [options.verbose=false]
 * @param {Array<string>} [options.vendor]
 * @return {Object}
 */
function createWebpackConfigClient(options) {
  _.defaults(options, {
    debug: true,
    verbose: false
  });

  const baseConfig = createWebpackConfigBase(
    _.pick(options, ['sourceDirectory', 'outputDirectory', 'debug', 'verbose'])
  );

  let vendorModules = ['es6-promise', 'react', 'react-dom', 'react-helmet'];
  if (options.vendor) {
    vendorModules = vendorModules.concat(options.vendor);
  }

  const clientPlugins = [
    // Emit a file with assets' paths.
    // This is used in build processes to grab built files, whose names
    // include hashes so cannot be known without this dictionary.
    new AssetsPlugin({
      path: path.resolve(options.outputDirectory),
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
      warnings: options.verbose
    },
    mangle: {
      screw_ie8: true
    },
    output: {
      comments: false,
      screw_ie8: true
    }
  });
  if (!options.debug) {
    clientPlugins.push(uglifyPlugin);
  }

  const clientConfig = {
    entry: {
      app: [options.entry],
      vendor: vendorModules
    },
    output: {
      filename: options.debug ? '[name].js' : '[name]-[chunkhash].js',
      chunkFilename: options.debug
        ? '[name].chunk.js'
        : '[name]-[chunkhash].chunk.js'
    },
    target: 'web',
    plugins: clientPlugins
  };

  return webpackMerge(baseConfig, clientConfig);
}

module.exports = createWebpackConfigClient;
