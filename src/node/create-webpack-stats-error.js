// @flow
'use strict';

const errorTypes = require('./error-types');

function createWebpackStatsError(
  stats: webpack$Stats
): WebpackCompilationError {
  const error = new errorTypes.WebpackCompilationError();
  error.stats = stats;
  return error;
}

module.exports = createWebpackStatsError;
