// @flow
'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const pify = require('pify');
const slugg = require('slugg');
const micromatch = require('micromatch');
const getPagesData = require('./get-pages-data');
const writePageModule = require('./write-page-module');
const writeDataModules = require('./write-data-modules');

// Create a JS module that can be used during Webpack compilation,
// exposing important things. See the type definition for BatfishContext.
//
// The file is written to the temporaryDirectory and made available with a
// Webpack alias. **Intended for internal use only.**
//
// Looking at a generated batfish-context.js file will help a lot if you're
// trying to understand how this works.
//
// Returned Promise resolves with the absolute path to the written module file.
function writeContextModule(
  batfishConfig: BatfishConfiguration
): Promise<string> {
  const filePath = path.join(
    batfishConfig.temporaryDirectory,
    'batfish-context.js'
  );

  return getPagesData(batfishConfig).then((pagesData) => {
    // Construct a data object for the entire site.
    // Pages can load this data with siteData front-matter
    const siteData: BatfishSiteData = {
      pages: _.values(pagesData)
    };
    const isSpa = batfishConfig.spa || pagesData.length === 1;

    // This will be overridden if the user has defined a 404 file.
    let notFoundStringifiedRouteData = `{
      path: '',
      getPage: () => { throw new Error('No matching route.'); },
      is404: true
    }`;

    // Our aim is to write a file, not create a JS data structure.
    // So we stringify each item as we build it. We'll accumulate
    // this array asynchronously (order doesn't matter), then
    // join the items to create the fully stringified list, ready
    // to be written.
    const stringifiedRoutes = [];
    // index is used to keep these routes in the original order
    const stringifyPageRoute = (
      pagePath: string,
      index: number
    ): Promise<void> => {
      const pageData = pagesData[pagePath];

      const pageAllowlist = batfishConfig.includePages;
      if (pageAllowlist && !micromatch.any(pageData.path, pageAllowlist)) {
        return Promise.resolve();
      }

      return writePageModule(batfishConfig, pageData).then(
        (pageModuleFilePath) => {
          const chunkName = pageData.is404
            ? 'not-found'
            : slugg(pagePath) || 'home';
          const is404Property = pageData.is404 ? 'is404: true,' : '';
          // "eager" mode (as opposed to the default "lazy" mode) means the import
          // will not create a separate async chunk, but will be bundled up with
          // its parent.
          const webpackMode = isSpa ? '/* webpackMode: "eager" */\n' : '';
          const internalRoutingProperty = pageData.frontMatter.internalRouting
            ? 'internalRouting: true,'
            : '';

          const stringifiedRouteData = `{
            path: '${pagePath}',
            getPage: () => import(
              /* webpackChunkName: "${chunkName}" */
              ${webpackMode}'${pageModuleFilePath}'
            ),
            ${internalRoutingProperty}
            ${is404Property}
          }`;

          if (pageData.is404) {
            notFoundStringifiedRouteData = stringifiedRouteData;
          }

          // Maintain order to avoid unnecessary cache busting.
          stringifiedRoutes[index] = stringifiedRouteData;
        }
      );
    };

    return writeDataModules(batfishConfig, siteData)
      .then(() => {
        // Sort before mapping to get the paths in a deterministic order.
        // (There cannot be duplicate paths, so no need to worry about unstable
        // sorts.)
        return Promise.all(
          Object.keys(pagesData).sort().map(stringifyPageRoute)
        );
      })
      .then(() => {
        const stringifiedRoutesArray = `[${_.compact(stringifiedRoutes).join(
          ','
        )}]`;
        // Webpack fills it with ansi colors so it's hard
        // to read in the devtools console. Strip those colors.
        const content = `
          export const batfishContext = {
            selectedConfig: {
              siteBasePath: '${batfishConfig.siteBasePath || ''}',
              siteOrigin: '${batfishConfig.siteOrigin || ''}',
              hijackLinks: ${String(batfishConfig.hijackLinks)},
              manageScrollRestoration: ${String(
                batfishConfig.manageScrollRestoration
              )}
            },
            routes: ${stringifiedRoutesArray},
            notFoundRoute: ${notFoundStringifiedRouteData}
          };`;
        return pify(fs.writeFile)(filePath, content);
      })
      .then(() => filePath);
  });
}

module.exports = writeContextModule;
