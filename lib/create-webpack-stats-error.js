'use strict';

const errorTypes = require('./error-types');

function createWebpackStatsError(stats) {
  const error = new errorTypes.WebpackCompilationError();
  error.stats = stats;
  return error;
}

module.exports = createWebpackStatsError;
