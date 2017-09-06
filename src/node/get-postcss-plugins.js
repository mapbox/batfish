// @flow
'use strict';

const postcssUrl = require('postcss-url');
const postcssCsso = require('postcss-csso');
const url = require('url');
const joinUrlParts = require('./join-url-parts');
const constants = require('./constants');

function getPostcssPlugins(
  batfishConfig: BatfishConfiguration
): Array<Function> {
  let list = [
    // Copy all url-referenced assets to the outputDirectory.
    postcssUrl({
      url: 'copy',
      assetsPath: './',
      useHash: true
    }),
    // Rewrite urls so they are root-relative. This way they'll work both from
    // inlined CSS (in the static build) and the stylesheet itself.
    postcssUrl({
      url: asset => {
        const parsedUrl = url.parse(asset.url);
        if (parsedUrl.protocol) {
          return asset.url;
        }
        return joinUrlParts(
          batfishConfig.siteBasePath,
          constants.PUBLIC_PATH_ASSETS,
          asset.url
        );
      }
    })
  ];

  if (batfishConfig.postcssPlugins) {
    list = batfishConfig.postcssPlugins.concat(list);
  }

  if (batfishConfig.production) {
    list.push(postcssCsso());
  }

  return list;
}

module.exports = getPostcssPlugins;
