'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const pify = require('pify');
const prettier = require('prettier');
const getPagesData = require('./get-pages-data');
const createPageModule = require('./create-page-module');
const concatExternalStylesheets = require('./concat-external-stylesheets');

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

  return Promise.all([
    getPagesData(batfishConfig),
    concatExternalStylesheets(batfishConfig)
  ])
    .then(results => {
      const pagesData = results[0];
      const externalStylesheetsPath = results[1];

      // Construct a data object for the entire site.
      // Pages can load this data with siteData front-matter
      const siteData = Object.assign({}, batfishConfig.data, {
        pages: _.values(pagesData)
      });

      // Our aim is to write a file, not create a JS data structure.
      // So we stringify each item as we build it. We'll accumulate
      // this array asynchronously (order doesn't matter), then
      // join the items to create the fully stringified list, ready
      // to be written.
      const stringifiedRoutes = [];
      let getNotFoundPage = `() => { throw new Error('No matching route.'); }`;
      const stringifyPageRoute = pagePath => {
        const pageData = pagesData[pagePath];
        return createPageModule({
          batfishConfig,
          siteData,
          pageData
        }).then(pageModuleFilePath => {
          stringifiedRoutes.push(`{
            path: '${pagePath}',
            getPage: () => import('${pageModuleFilePath}'),
          }`);
          if (pageData.filePath === batfishConfig.notFoundPath) {
            getNotFoundPage = `() => import('${pageModuleFilePath}')`;
          }
        });
      };

      return Promise.all(
        Object.keys(pagesData).map(stringifyPageRoute)
      ).then(() => {
        const stringifiedRoutesArray = `[${stringifiedRoutes.join(',')}]`;
        // Import the CSS here, so it's processed by the text extract plugin.
        const content = `
          require('${externalStylesheetsPath}');
          module.exports = {
            routes: ${stringifiedRoutesArray},
            getNotFoundPage: ${getNotFoundPage}
          };`;
        const prettyContent = prettier.format(content, { singleQuote: true });
        return pify(fs.writeFile)(filePath, prettyContent);
      });
    })
    .then(() => filePath);
}

module.exports = createBatfishContext;
