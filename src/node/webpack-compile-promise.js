// @flow
'use strict';

const webpack = require('webpack');
const createWebpackStatsError = require('./create-webpack-stats-error');
const wrapError = require('./wrap-error');
const errorTypes = require('./error-types');

function webpackCompilePromise(
  webpackConfig: webpack$Configuration
): Promise<webpack$Stats> {
  return new Promise((resolve, reject) => {
    let compiler;
    try {
      compiler = webpack(webpackConfig);
    } catch (initializationError) {
      return reject(
        wrapError(initializationError, errorTypes.WebpackFatalError)
      );
    }
    compiler.run((fatalError, stats) => {
      if (fatalError) {
        return reject(wrapError(fatalError, errorTypes.WebpackFatalError));
      }
      if (stats.hasErrors()) {
        return reject(createWebpackStatsError(stats));
      }
      resolve(stats);
    });
  });
}

module.exports = webpackCompilePromise;
