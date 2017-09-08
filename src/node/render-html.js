// @flow
'use strict';

const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const pTry = require('p-try');
const joinUrlParts = require('./join-url-parts');
const constants = require('./constants');
const errorTypes = require('./error-types');
const wrapError = require('./wrap-error');
const UglifyJs = require('uglify-js');
const getWebpackAssetAbsolutePath = require('./get-webpack-asset-absolute-path');

// We need to define this type because Flow can't understand the non-literal
// require that pulls in static-render-pages.js below.
declare type StaticRenderPagesFunction = (
  BatfishConfiguration,
  {
    +vendor: { +js: string },
    +app: { +js: string }
  },
  string,
  cssUrl?: string
) => Promise<void>;

function renderHtml(
  batfishConfig: BatfishConfiguration,
  cssFilename?: string
): Promise<void> {
  return pTry(() => {
    const assetsDirectory = path.join(
      batfishConfig.outputDirectory,
      constants.PUBLIC_PATH_ASSETS
    );

    // This file reading is synced to make scoping easier, and with so few
    // files doesn't matter for performance.
    const rawAssets = fs.readFileSync(
      path.join(assetsDirectory, 'assets.json'),
      'utf8'
    );
    const assets: {
      manifest: { js: string },
      app: { js: string },
      vendor: { js: string }
    } = Object.freeze(JSON.parse(rawAssets));
    const manifestJs = fs.readFileSync(
      getWebpackAssetAbsolutePath(batfishConfig, assets.manifest.js),
      'utf8'
    );

    const uglified = UglifyJs.minify(manifestJs);
    if (uglified.error) throw uglified.error;
    const uglifiedManifestJs: string = uglified.code;

    let cssUrl;
    if (!_.isEmpty(batfishConfig.stylesheets) && cssFilename) {
      cssUrl = joinUrlParts(
        batfishConfig.siteBasePath,
        constants.PUBLIC_PATH_ASSETS,
        path.basename(cssFilename)
      );
    }

    try {
      const staticRenderPages: StaticRenderPagesFunction = require(path.join(
        assetsDirectory,
        'static-render-pages.js'
      )).default;
      return staticRenderPages(
        batfishConfig,
        assets,
        uglifiedManifestJs,
        cssUrl
      ).catch(error => {
        throw wrapError(error, errorTypes.WebpackNodeExecutionError);
      });
    } catch (requireError) {
      throw wrapError(requireError, errorTypes.WebpackNodeParseError);
    }
  });
}

module.exports = renderHtml;
