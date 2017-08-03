'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const pify = require('pify');
const slugg = require('slugg');
const prettier = require('prettier');
const getPagesData = require('./get-pages-data');
const createPageModule = require('./create-page-module');
const createDataModules = require('./create-data-modules');

/**
 * Create a JS module that can be used during Webpack compilation,
 * exposing important things. Here's what it exposes:
 *
 * - routes: An array of objects representing routes. Each object has the
 *   following properties:
 *   - path: The URL path to that route.
 *   - getPage: A function returning a dynamic import that gets the page
 *     module. Because of the dynamic import, Webpack will create an async
 *     bundle for the page module.
 *   - internalRouting: Whether or not the page is flagged for internal routing.
 * - getNotFoundPage: A function returning a dynamic import of the not-found
 *   page (404).
 *
 * The file is written to the temporaryDirectory and made available with a
 * Webpack alias. **Intended for internal use only.**
 *
 * Looking at a generated batfish-context.js file will help a lot if you're
 * trying to understand how this works.
 *
 * @param {BatfishConfig} batfishConfig
 * @return {Promise<string>} - Resolves with the absolute path to the written
 *   module file.
 */
function createBatfishContext(batfishConfig) {
  const filePath = path.join(
    batfishConfig.temporaryDirectory,
    'batfish-context.js'
  );

  return getPagesData(batfishConfig).then(pagesData => {
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
      return createPageModule(
        batfishConfig,
        pageData
      ).then(pageModuleFilePath => {
        const is404 =
          pageData.filePath.replace(/\.(js|md)$/, '') ===
          path.join(batfishConfig.pagesDirectory, '404');
        stringifiedRoutes.push(`{
            path: '${pagePath}',
            getPage: () => import(
              /* webpackChunkName: "${slugg(pagePath) || 'home'}" */
              '${pageModuleFilePath}'
            ),
            internalRouting: ${pageData.frontMatter.internalRouting || false},
            ${is404 ? 'is404: true' : ''}
          }`);
        if (is404) {
          getNotFoundPage = `() => import(
              /* webpackChunkName: "not-found" */
              '${pageModuleFilePath}'
            )`;
        }
      });
    };

    return createDataModules(batfishConfig, siteData)
      .then(() => {
        return Promise.all(Object.keys(pagesData).map(stringifyPageRoute));
      })
      .then(() => {
        const stringifiedRoutesArray = `[${stringifiedRoutes.join(',')}]`;
        const content = `
          export const batfishContext = {
            selectedConfig: {
              siteBasePath: '${batfishConfig.siteBasePath}',
              siteOrigin: '${batfishConfig.siteOrigin}'
            },
            routes: ${stringifiedRoutesArray},
            getNotFoundPage: ${getNotFoundPage}
          };`;
        const prettyContent = prettier.format(content);
        return pify(fs.writeFile)(filePath, prettyContent);
      })
      .then(() => filePath);
  });
}

module.exports = createBatfishContext;
