'use strict';

const fs = require('fs');
const path = require('path');
const pify = require('pify');
const globby = require('globby');
const grayMatter = require('gray-matter');

/**
 * Get data about the pages.
 *
 * @param {Object} options
 * @param {string} options.sourceDirectory - The root pages directory.
 * @param {Array<string>} [options.exclude] - Exclude paths (e.g. "/about/")
 * @return {Promise<Object>}
 */
function getPageData(options) {
  const pagesDirectory = path.join(options.sourceDirectory, 'pages');

  // Convert a page's file path to its URL path.
  const pageFilePathToUrlPath = filePath => {
    const relativePath = path.relative(pagesDirectory, filePath);
    if (/^index\.js$/.test(relativePath)) {
      return '/';
    } else if (/\/index\.js$/.test(relativePath)) {
      return `/${path.dirname(relativePath)}/`;
    }
    return `/${relativePath.replace(/\.js$/, '')}/`;
  };

  let pageData = {};
  // Returns a data object about a page.
  const pageFilePathToData = filePath => {
    return pify(fs.readFile)(filePath, 'utf8').then(content => {
      const parsedFrontMatter = grayMatter(content, {
        delims: ['/*---', '---*/']
      });
      const pagePath = pageFilePathToUrlPath(filePath);
      pageData[pagePath] = {
        filePath,
        path: pagePath,
        data: parsedFrontMatter.data
      };
    });
  };

  let pagesGlob = [path.join(pagesDirectory, '**/*.js')];
  if (options.exclude !== undefined && options.exclude.length !== 0) {
    // For each exclusion, add a negative glob that will make the path, whether the path corresponds to
    // a specific JS file or to a directory's index.js file.
    pagesGlob = pagesGlob.concat(
      options.exclude.map(exclusion => {
        const fileOrDirectory = exclusion.replace(/\/$/, '{.js,/index.js}');
        return `!${path.join(pagesDirectory, fileOrDirectory)}`;
      })
    );
  }

  return globby(pagesGlob)
    .then(pageFilePaths => Promise.all(pageFilePaths.map(pageFilePathToData)))
    .then(() => pageData);
}

module.exports = getPageData;
