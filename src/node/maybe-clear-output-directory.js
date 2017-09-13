// @flow
'use strict';

const del = require('del');
const pTry = require('p-try');

function maybeClearOutputDirectory(
  batfishConfig: BatfishConfiguration
): Promise<void | Array<string>> {
  return pTry(() => {
    if (!batfishConfig.clearOutputDirectory) return;
    return del(batfishConfig.outputDirectory, { force: true });
  });
}

module.exports = maybeClearOutputDirectory;
