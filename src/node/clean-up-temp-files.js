// @flow
'use strict';

const path = require('path');
const del = require('del');
const pTry = require('p-try');

const cleanUpTempFiles = (
  batfishConfig: BatfishConfiguration
): Promise<void> => {
  const assetsDirectory = path.join(
    batfishConfig.outputDirectory,
    batfishConfig.publicAssetsPath
  );

  const assetsJsonPath = path.join(assetsDirectory, 'assets.json');
  const renderStaticPagesPath = path.join(
    assetsDirectory,
    'static-render-pages.js'
  );
  const renderStaticPagesMapPath = path.join(
    assetsDirectory,
    'static-render-pages.js.map'
  );

  return pTry(() => {
    return del(
      [assetsJsonPath, renderStaticPagesPath, renderStaticPagesMapPath],
      { force: true }
    );
  });
};

module.exports = cleanUpTempFiles;
