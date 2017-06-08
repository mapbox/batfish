'use strict';

const path = require('path');
const globby = require('globby');

/**
 * Get data about the pages.
 *
 * @param {Object} options
 * @param {string} options.sourceDirectory - The root pages directory.
 * @param {Array<string>} [options.exclude] - Exclude paths (e.g. "/about/")
 * @return {Array<{ filePath: string, route: string, data: Object }>}
 */
function getPageData(options) {
  // Page files will need to be compiled by Babel
  require('babel-register')({
    ignore(filePath) {
      return !filePath.startsWith(options.sourceDirectory);
    }
  });
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

  // Returns a data object about a page.
  const pageFilePathToData = filePath => {
    const pageModule = require(filePath);
    return {
      filePath,
      route: pageFilePathToUrlPath(filePath),
      data: pageModule.data || {}
    };
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

  const pageFilePaths = globby.sync(pagesGlob);
  return pageFilePaths.map(pageFilePathToData);
}

module.exports = getPageData;
