// @flow
'use strict';

const postcssUrl = require('postcss-url');
const postcssCsso = require('postcss-csso');

function getPostcssPlugins(
  batfishConfig: BatfishConfiguration
): Array<Function> {
  let list = [
    // Copy all url-referenced assets to the outputDirectory.
    postcssUrl({
      url: 'copy',
      assetsPath: './',
      useHash: true,
      hashOptions: {
        append: true
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
