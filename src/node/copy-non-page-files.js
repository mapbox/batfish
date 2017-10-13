// @flow
'use strict';

const cpy = require('cpy');

function copyNonPageFiles(batfishConfig: BatfishConfiguration): Promise<void> {
  const ignoreGlob = !batfishConfig.ignoreWithinPagesDirectory
    ? []
    : batfishConfig.ignoreWithinPagesDirectory.map(g => `!${g}`);
  // Don't copy .js, .md, and .css files, which are already incorporated into
  // the build in other ways.
  let copyGlob = ['**/*.!(js|md|css)'].concat(ignoreGlob);
  // Copy unprocessed page files directly.
  if (batfishConfig.unprocessedPageFiles !== undefined) {
    copyGlob = copyGlob.concat(batfishConfig.unprocessedPageFiles);
  }
  return cpy(copyGlob, batfishConfig.outputDirectory, {
    cwd: batfishConfig.pagesDirectory,
    parents: true
  });
}

module.exports = copyNonPageFiles;
