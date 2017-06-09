'use strict';

const fs = require('fs');
const path = require('path');
const pify = require('pify');
const prettier = require('prettier');
const getPageData = require('./get-page-data');

/**
 * Create a module that can be used during Webpack compilation,
 * exposing important things about pages.
 *
 * **This code should be synchronous.** It will run once before Webpack begins work.
 *
 * @param {BatfishConfig} batfishConfig
 * @return {Promise<string>} - Resolves with the absolute path to the written module file.
 */
function createBatfishContext(batfishConfig) {
  const filePath = path.join(__dirname, '../tmp/batfish-context.js');

  return getPageData({
    sourceDirectory: batfishConfig.sourceDirectory
  })
    .then(pageData => {
      const stringifiedData = JSON.stringify(pageData);

      const stringifiedRoutes = Object.keys(pageData).map(path => {
        const page = pageData[path];
        return `{
          path: '${path}',
          pathRegExp: /^${path.replace(/\//g, '[\\/]')}?$/,
          getPage: () => import('${page.filePath}')
        }`;
      });
      const stringifiedRoutesArray = `[${stringifiedRoutes.join(',')}]`;

      const content = `module.exports = {
        pageData: ${stringifiedData},
        routes: ${stringifiedRoutesArray}
      };`;
      const prettyContent = prettier.format(content, {
        singleQuote: true
      });

      return pify(fs.writeFile)(filePath, prettyContent);
    })
    .then(() => filePath);
}

module.exports = createBatfishContext;
