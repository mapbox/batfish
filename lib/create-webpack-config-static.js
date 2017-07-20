'use strict';

const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const createWebpackConfigBase = require('./create-webpack-config-base');

/**
 * Create a Webpack configuration that compiles static-render-pages.js,
 * a Node module that will build HTML pages.
 *
 * @param {BatfishConfig} batfishConfig
 * @return {Promise<Object>} - Resolves with the Webpack config.
 */
function createWebpackConfigStatic(batfishConfig) {
  return createWebpackConfigBase(batfishConfig).then(baseConfig => {
    const staticConfig = {
      entry: {
        static: path.join(__dirname, '../src/static-render-pages.js')
      },
      output: {
        filename: './static-render-pages.js',
        libraryTarget: 'commonjs2'
      },
      target: 'node',
      externals: {
        // These modules are required by static-render-pages and don't play
        // nice when Webpack tries to compile them, or we know they can be
        // loaded in Node.
        'uglify-js': 'uglify-js',
        mkdirp: 'mkdirp',
        react: 'react',
        'react-dom': 'react-dom'
      },
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
  });
}

module.exports = createWebpackConfigStatic;
