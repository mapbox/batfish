'use strict';

const fs = require('fs');
const path = require('path');
const pify = require('pify');
const pTry = require('p-try');
const globby = require('globby');
const minimatch = require('minimatch');
const grayMatter = require('gray-matter');
const joinUrlParts = require('./join-url-parts');

/**
 * Get data about pages. Reads the pagesDirectory, figures out URL paths, parses
 * front matter.
 *
 * @param {BatfishConfig} batfishConfig
 * @return {Promise<Object>} - Resolves with an object whose keys are page paths
 *   and values are page data. Data for each page includes:
 *   - filePath: Absolute path to the page's file.
 *   - path: The page's URL path.
 *   - frontMatter: Parsed front matter from the page's file.
 */
function getPagesData(batfishConfig) {
  return pTry(() => {
    const pagesGlob = [path.join(batfishConfig.pagesDirectory, '**/*.{js,md}')];
    const base = batfishConfig.siteBasePath;

    const isUnprocessed = filePath => {
      if (batfishConfig.unprocessedPageFiles === undefined) {
        return false;
      }
      return batfishConfig.unprocessedPageFiles.some(pattern => {
        return minimatch(
          filePath,
          path.join(batfishConfig.pagesDirectory, pattern)
        );
      });
    };

    // Convert a page's file path to its URL path.
    const pageFilePathToUrlPath = filePath => {
      const relativePath = path.relative(
        batfishConfig.pagesDirectory,
        filePath
      );
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
    // Returns a data object about a page.
    const registerPage = filePath => {
      if (isUnprocessed(filePath)) {
        return;
      }
      return pify(fs.readFile)(filePath, 'utf8').then(content => {
        const isMarkdown = path.extname(filePath) === '.md';
        const grayMatterOptions = isMarkdown
          ? { delims: ['---', '---'] }
          : { delims: ['/*---', '---*/'] };
        const parsedFrontMatter = grayMatter(content, grayMatterOptions);
        const published = parsedFrontMatter.data.published !== false;
        if (!published && batfishConfig.production) return;

        const pagePath = pageFilePathToUrlPath(filePath);
        const pageData = {
          filePath,
          path: pagePath,
          frontMatter: parsedFrontMatter.data
        };
        pagesData[pagePath] = pageData;
      });
    };

    return globby(pagesGlob)
      .then(pageFilePaths => Promise.all(pageFilePaths.map(registerPage)))
      .then(() => pagesData);
  });
}

module.exports = getPagesData;
