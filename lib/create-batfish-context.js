'use strict';

const fs = require('fs');
const path = require('path');
const pify = require('pify');
const prettier = require('prettier');
const getPagesData = require('./get-pages-data');
const createPageModule = require('./create-page-module');

/**
 * Generate a JS module that can be used during Webpack compilation,
 * exposing important things.
 *
 * The file is written to the temporaryDirectory and made available with a Webpack alias.
 *
 * @param {BatfishConfig} batfishConfig
 * @return {Promise<string>} - Resolves with the absolute path to the written module file.
 */
function createBatfishContext(batfishConfig) {
  const filePath = path.join(
    batfishConfig.temporaryDirectory,
    'batfish-context.js'
  );

  return getPagesData({ pagesDirectory: batfishConfig.pagesDirectory })
    .then(pagesData => {
      // Our aim is to write a file, not create a JS data structure.
      // So we stringify each item as we build it. We'll accumulate
      // this array asynchronously (order doesn't matter), then
      // join the items to create the fully stringified list, ready
      // to be written.
      const stringifiedRoutes = [];
      const stringifyPageRoute = pagePath => {
        return createPageModule(
          batfishConfig,
          pagesData,
          pagePath
        ).then(pageModuleFilePath => {
          stringifiedRoutes.push(`{
            path: '${pagePath}',
            getPage: () => import('${pageModuleFilePath}')
          }`);
        });
      };

      return Promise.all(
        Object.keys(pagesData).map(stringifyPageRoute)
      ).then(() => {
        const stringifiedRoutesArray = `[${stringifiedRoutes.join(',')}]`;
        const content = `module.exports = {
          routes: ${stringifiedRoutesArray}
        };`;
        const prettyContent = prettier.format(content, { singleQuote: true });
        return pify(fs.writeFile)(filePath, prettyContent);
      });
    })
    .then(() => filePath);
}

module.exports = createBatfishContext;
