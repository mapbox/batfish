'use strict';

const fs = require('fs');
const path = require('path');
const pify = require('pify');
const globby = require('globby');
const grayMatter = require('gray-matter');

// Only allow this to run once per process.
let cache;

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
  if (cache !== undefined) return Promise.resolve(cache);

  const pagesGlob = [path.join(batfishConfig.pagesDirectory, '**/*.{js,md}')];
  const base = batfishConfig.siteBasePath;

  // Convert a page's file path to its URL path.
  const pageFilePathToUrlPath = filePath => {
    const relativePath = path.relative(batfishConfig.pagesDirectory, filePath);
    if (/^index\.(js|md)$/.test(relativePath)) {
      if (base === '/') return base;
      return base + '/';
    }
    if (/\/index\.(js|md)$/.test(relativePath)) {
      return `${base}/${path.dirname(relativePath)}/`;
    }
    return `${base}/${relativePath.replace(/\.(js|md)$/, '')}/`;
  };

  let pagesData = {};
  // Returns a data object about a page.
  const registerPage = filePath => {
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
    .then(() => {
      cache = pagesData;
      return pagesData;
    });
}

module.exports = getPagesData;
