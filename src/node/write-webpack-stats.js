// @flow
'use strict';

const fs = require('fs');
const pify = require('pify');
const path = require('path');
const constants = require('./constants');

function writeWebpackStats(
  outputDirectory: string,
  stats: webpack$Stats
): Promise<void> {
  return pify(fs.writeFile)(
    path.join(outputDirectory, constants.STATS_BASENAME),
    JSON.stringify(stats.toJson())
  );
}

module.exports = writeWebpackStats;
