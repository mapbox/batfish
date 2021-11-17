// @flow
'use strict';

const url = require('url');
const postcss = require('postcss');
const postcssUrl = require('postcss-url');

// PostCSS plugin that transforms all the URLs in some CSS to absolute URLs.
function postcssAbsoluteUrls(options: { stylesheetUrl: string }): Function {
  const transformUrl = (originalUrl: string): string => {
    if (/^data:|^%23clip/.test(originalUrl)) return originalUrl;
    return url.resolve(options.stylesheetUrl, originalUrl);
  };

  return postcssUrl({
    url: (asset) => transformUrl(asset.url)
  });
}

module.exports = postcss.plugin('postcss-absolute-urls', postcssAbsoluteUrls);
