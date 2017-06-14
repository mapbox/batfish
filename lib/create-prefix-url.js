'use strict';

const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

/**
 * Generate a JS module that exports functions for prefixing URLs according to the config.
 *
 * @param {BatfishConfig} batfishConfig
 * @return {string} - The absolute path to the written module file.
 */
function createPrefixUrl(batfishConfig) {
  const filePath = path.join(batfishConfig.temporaryDirectory, 'prefix-url.js');

  const content = `
    function prefixUrl(url) {
      if (!/^\\//.test(url)) url = '/' + url;
      return '${batfishConfig.siteBasePath}' + url;
    }
    prefixUrl.absolute = url => {
      return '${batfishConfig.siteOrigin}' + '${batfishConfig.siteBasePath}' + url;
    };
    module.exports = prefixUrl;
  `;

  const prettyContent = prettier.format(content, { singleQuote: true });
  fs.writeFileSync(filePath, prettyContent);
  return filePath;
}

module.exports = createPrefixUrl;
