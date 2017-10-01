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

// We need to define this type because Flow can't understand the non-literal
// require that pulls in static-render-pages.js below.
declare type StaticRenderPagesFunction = (
  BatfishConfiguration,
  options: {
    assets: AssetsJson,
    modernAssets?: AssetsJson,
    cssUrl?: string
  }
) => Promise<void>;

function buildHtml(
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
    const assets: AssetsJson = Object.freeze(JSON.parse(rawAssets));
    let modernAssets: AssetsJson | void;
    if (batfishConfig.createModernBuild) {
      const modernRawAssets = fs.readFileSync(
        path.join(assetsDirectory, 'm-assets.json'),
        'utf8'
      );
      modernAssets = Object.freeze(JSON.parse(modernRawAssets));
    }
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
      return staticRenderPages(batfishConfig, {
        assets,
        modernAssets,
        cssUrl
      }).catch(error => {
        throw wrapError(error, errorTypes.WebpackNodeExecutionError);
      });
    } catch (requireError) {
      throw wrapError(requireError, errorTypes.WebpackNodeParseError);
    }
  });
}

module.exports = buildHtml;
