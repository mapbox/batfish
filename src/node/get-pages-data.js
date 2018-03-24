// @flow
'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const pify = require('pify');
const globby = require('globby');
const micromatch = require('micromatch');
const grayMatter = require('gray-matter');
const joinUrlParts = require('./join-url-parts');
const constants = require('./constants');
const errorTypes = require('./error-types');
const wrapError = require('./wrap-error');

// Get data about pages. Reads the pagesDirectory, figures out URL paths, parses
// front matter.
//
// Return Promise resolves with an object whose keys are page paths and values
// are page data. See type definition for BatfishPageData.
function getPagesData(
  batfishConfig: BatfishConfiguration
): Promise<{ [string]: BatfishPageData }> {
  // Convert a page's file path to its URL path.
  const pageFilePathToUrlPath = (filePath: string): string => {
    const relativePath = path.relative(batfishConfig.pagesDirectory, filePath);
    if (/^index\.(js|md)$/.test(relativePath)) {
      if (base === '/') return base;
      return base + '/';
    }
    if (/\/index\.(js|md)$/.test(relativePath)) {
      return joinUrlParts(base, path.dirname(relativePath), '');
    }
    return joinUrlParts(base, relativePath.replace(/\.(js|md)$/, ''), '');
  };

  let pagesData = {};
  const registerPage = (filePath: string): Promise<void> => {
    const is404 =
      filePath.replace(/\.(js|md)$/, '') ===
      path.join(batfishConfig.pagesDirectory, '404');

    return pify(fs.readFile)(filePath, 'utf8').then((content: string) => {
      const isMarkdown = path.extname(filePath) === '.md';
      const grayMatterOptions = isMarkdown
        ? { delims: ['---', '---'] }
        : { delims: ['/*---', '---*/'] };
      let parsedFrontMatter;
      try {
        parsedFrontMatter = grayMatter(content, grayMatterOptions);
      } catch (parseError) {
        throw wrapError(parseError, errorTypes.FrontMatterError, {
          filePath
        });
      }
      const published = parsedFrontMatter.data.published !== false;
      if (!published && batfishConfig.production) return;

      const pagePath = pageFilePathToUrlPath(filePath);
      const pageData: BatfishPageData = {
        filePath,
        path: pagePath,
        frontMatter: parsedFrontMatter.data
      };
      if (is404) {
        pageData.is404 = true;
        pageData.path = '/404/';
      }
      pagesData[pagePath] = pageData;
    });
  };

  const base = batfishConfig.siteBasePath;
  const pagesGlob = [
    path.join(batfishConfig.pagesDirectory, `**/*.${constants.PAGE_EXT_GLOB}`)
  ];

  return globby(pagesGlob)
    .then(pageFilePaths => {
      // Filter out any unprocessedPageFiles
      if (batfishConfig.unprocessedPageFiles) {
        const unprocessed = micromatch(
          pageFilePaths,
          batfishConfig.unprocessedPageFiles
        );
        return _.difference(pageFilePaths, unprocessed);
      } else {
        return pageFilePaths;
      }
    })
    .then(pageFilePaths => {
      if (batfishConfig.spa && pageFilePaths.length > 1) {
        throw new errorTypes.ConfigFatalError(
          'In your Batfish config you set `spa: true`, but you have more than one page. SPA mode only allows one Batfish page.'
        );
      }
      return Promise.all(pageFilePaths.map(registerPage));
    })
    .then(() => {
      if (!pagesData['/404/'] && !batfishConfig.production) {
        pagesData['/404/'] = {
          filePath: path.join(__dirname, '../webpack/default-not-found.js'),
          path: '/404/',
          is404: true,
          frontMatter: {}
        };
      }

      return pagesData;
    });
}

module.exports = getPagesData;
