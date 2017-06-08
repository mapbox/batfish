'use strict';

const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const createWebpackConfigBase = require('./create-webpack-config-base');

/**
 * Create two Webpack configurations: the regular client config for assets, and another
 * that compiles static-render-pages.js to create a Node module that will build HTML pages.
 *
 * @param {Object} options
 * @param {String} options.entry
 * @param {string} options.sourceDirectory
 * @param {string} options.outputDirectory
 * @param {boolean} [options.debug]
 * @param {boolean} [options.verbose]
 * @param {Array<string>} [options.vendor]
 * @return {Object}
 */
function createWebpackConfigStatic(options) {
  const baseConfig = createWebpackConfigBase(
    _.pick(options, ['sourceDirectory', 'outputDirectory', 'debug', 'verbose'])
  );

  const staticConfig = {
    entry: {
      static: path.join(__dirname, '../src/static-render-pages.js')
    },
    output: {
      filename: './static-render-pages.js',
      libraryTarget: 'commonjs2'
    },
    target: 'node',
    // Ignore all modules in node_modules: the compiled static-render-pages.js
    // can require them in without Webpack assistance.
    externals: [nodeExternals()],
    plugins: [
      // Ensure that all files will be grouped into one file,
      // even if they would otherwise be split into separate chunks.
      // Separate chunks serve no purpose in the static build: we need all
      // the information at once.
      new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
    ],
    node: {
      console: false,
      global: false,
      process: false,
      __filename: false,
      __dirname: false,
      Buffer: false,
      setImmediate: false
    }
  };

  return webpackMerge(baseConfig, staticConfig);
}

module.exports = createWebpackConfigStatic;
