'use strict';

const fs = require('fs');
const path = require('path');
const pify = require('pify');
const globby = require('globby');
const grayMatter = require('gray-matter');

const grayMatterOptions = {
  delims: ['/*---', '---*/']
};

// Only allow this to run once per process.
let cache;

/**
 * Get data about pages.
 *
 * @param {Object} options
 * @param {string} options.pagesDirectory - The root pages directory.
 * @param {Array<string>} [options.exclude] - Exclude paths (e.g. "/about/")
 * @return {Promise<Object>} - Resolves with an object whose keys are page paths
 *   and values are page data. Data for each page includes:
 *   - filePath: Absolute path to the page's component file.
 *   - path: Page path in the client.
 *   - data: Parsed front matter from the page's compnent file.
 */
function getPagesData(options) {
  if (cache !== undefined) return Promise.resolve(cache);

  // Convert a page's file path to its URL path.
  const pageFilePathToUrlPath = filePath => {
    const relativePath = path.relative(options.pagesDirectory, filePath);
    if (/^index\.js$/.test(relativePath)) {
      return '/';
    } else if (/\/index\.js$/.test(relativePath)) {
      return `/${path.dirname(relativePath)}/`;
    }
    return `/${relativePath.replace(/\.js$/, '')}/`;
  };

  let pagesData = {};
  // Returns a data object about a page.
  const pageFilePathToData = filePath => {
    return pify(fs.readFile)(filePath, 'utf8').then(content => {
      const parsedFrontMatter = grayMatter(content, grayMatterOptions);
      const pagePath = pageFilePathToUrlPath(filePath);
      pagesData[pagePath] = {
        filePath,
        path: pagePath,
        data: parsedFrontMatter.data
      };
    });
  };

  let pagesGlob = [path.join(options.pagesDirectory, '**/*.js')];
  if (options.exclude !== undefined && options.exclude.length !== 0) {
    // For each exclusion, add a negative glob that will make the path, whether the path corresponds to
    // a specific JS file or to a directory's index.js file.
    pagesGlob = pagesGlob.concat(
      options.exclude.map(exclusion => {
        const fileOrDirectory = exclusion.replace(/\/$/, '{.js,/index.js}');
        return `!${path.join(options.pagesDirectory, fileOrDirectory)}`;
      })
    );
  }

  return globby(pagesGlob)
    .then(pageFilePaths => Promise.all(pageFilePaths.map(pageFilePathToData)))
    .then(() => {
      cache = pagesData;
      return pagesData;
    });
}

module.exports = getPagesData;
