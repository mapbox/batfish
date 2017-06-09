'use strict';

const url = require('url');
const postcss = require('postcss');
const postcssTransformUrls = require('./postcss-transform-urls');

function postcssAbsoluteUrls(options) {
  const transformUrl = originalUrl => {
    if (/^data:/.test(originalUrl)) return originalUrl;
    return url.resolve(options.stylesheetUrl, originalUrl);
  };

  return postcssTransformUrls({ transform: transformUrl });
}

module.exports = postcss.plugin('postcss-absolute-urls', postcssAbsoluteUrls);
