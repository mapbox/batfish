'use strict';

const del = require('del');
const path = require('path');
const mkdirp = require('mkdirp');

/**
 * Add defaults to a Batish config object, and validate it.
 *
 * @param {Object} config
 * @param {string} config.pagesDirectory - Path to your project pages directory.
 * @param {string} config.outputDirectory - Path to a directory where static site files should be written.
 * @param {string} [config.siteBasePath='/'] - Root-relative path to the base directory on the domain
 *   where the site will be deployed. Used by prefixUrl and prefixAbsoluteUrl.
 * @param {string} [config.siteOrigin] - Origin where the site will be deployed. Required is using
 *   prefixAbsoluteUrl.
 * @param {string} [config.wrapperPath] - Path to a module exporting a React component that wraps
 * @param {string} [config.notFoundPath='{pagesDirectory}/404.js'] - Path to your 404 page.
 * @param {string} [config.temporaryDirectory] - Path to a directory where temporary files should be written.
 * @param {Array<string>} [config.externalStylesheets] - URLs to external stylesheets.
 * @param {Object} [config.data] - Data that can be selected for injection into pages.
 * @param {Object} [config.dataSelectors] - Keys are selector names, values are data filter functions returning
 *   objects.
 * @param {boolean} [config.production=false] - Whether or not to build for production.
 * @param {boolean} [config.verbose=false] - Whether or not to log extra build stats.
 * @param {number} [config.port=8080] - Port for development servers.
 * @param {Array<string>} [config.vendor] - An array of strings identifying npm modules you want
 *   bundled into the vendor bundle.
 * @return {Object} - Config with defaults.
 */
function validateConfig(config) {
  const defaults = {
    production: false,
    verbose: false,
    port: 8080,
    temporaryDirectory: path.join(__dirname, '../tmp'),
    wrapperPath: path.join(__dirname, '../src/empty-wrapper.js'),
    notFoundPath: path.join(config.pagesDirectory, '404.js'),
    externalStylesheets: []
  };

  if (!config) {
    throw new Error('You must provide a configuration object');
  }

  const configWithDefaults = Object.assign({}, defaults, config);

  if (!isAbsolutePath(config.pagesDirectory)) {
    throw new Error('pagesDirectory is required and must be an absolute path');
  }
  if (!isAbsolutePath(config.outputDirectory)) {
    throw new Error('outputDirectory is required and must be an absolute path');
  }
  if (config.wrapperPath && !isAbsolutePath(config.wrapperPath)) {
    throw new Error('wrapperPath must be an absolute path');
  }
  if (config.temporaryDirectory && !isAbsolutePath(config.temporaryDirectory)) {
    throw new Error('temporaryDirectory must be an absolute path');
  }

  // Normalize URL parts
  if (config.siteOrigin) {
    configWithDefaults.siteOrigin = config.siteOrigin.replace(/\/$/, '');
  }
  if (config.siteBasePath !== '/') {
    configWithDefaults.siteBasePath = config.siteBasePath.replace(/\/$/, '');
  }

  mkdirp.sync(configWithDefaults.temporaryDirectory);
  del.sync(path.join(configWithDefaults.temporaryDirectory, '{*.*,.*}'), {
    force: true
  });

  return configWithDefaults;
}

module.exports = validateConfig;

function isAbsolutePath(filePath) {
  if (typeof filePath !== 'string') return false;
  return path.isAbsolute(filePath);
}