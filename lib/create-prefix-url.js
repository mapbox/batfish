'use strict';

const fs = require('fs');
const pify = require('pify');
const path = require('path');

/**
 * Generate a JS module that exports functions for prefixing URLs according to
 * the config.
 *
 * @param {BatfishConfig} batfishConfig
 * @return {Promise<string>} - Resolves with the absolute path to the written
 *   module file.
 */
function createPrefixUrl(batfishConfig) {
  const filePath = path.join(batfishConfig.temporaryDirectory, 'prefix-url.js');

  const content = `
    function prefixUrl(url) {
      if (!/^\\//.test(url)) url = '/' + url;
      return '${batfishConfig.siteBasePath || ''}' + url;
    }
    prefixUrl.absolute = url => {
      if (${!batfishConfig.siteOrigin}) {
        throw new Error('siteOrigin is not specified. Unable to prefix with absolute path.');
      }
      if (!/^\\//.test(url)) url = '/' + url;
      return '${batfishConfig.siteOrigin}' +
        '${batfishConfig.siteBasePath || ''}' +
        url;
    };
    module.exports = prefixUrl;
  `;

  return pify(fs.writeFile)(filePath, content).then(() => filePath);
}

module.exports = createPrefixUrl;
