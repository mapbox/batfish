// @flow
'use strict';

const path = require('path');
const del = require('del');

const cleanUpTempFiles = (
  batfishConfig: BatfishConfiguration
): Promise<any> => {
  return del(
    ['assets.json', 'static-render-pages.js', 'static-render-pages.js.map'],
    {
      force: true,
      cwd: path.join(
        batfishConfig.outputDirectory,
        batfishConfig.publicAssetsPath
      )
    }
  );
};

module.exports = cleanUpTempFiles;
