'use strict';

const _ = require('lodash');
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
 * @param {Array<string | Object>} [config.babelPlugins] - Additional plugin configuration to pass to Babel.
 * @param {RegExp} [config.babelExclude=/node_modules/] - A value for the `exclude` property of the babel-loader
 *   configuration.
 * @param {Array<Object>} [config.webpackLoaders] - Additional loader configuration to pass to Webpack during all
 *   Webpack builds.
 * @param {Array<Object>} [config.webpackPlugins] - Additional plugin configuration to pass to Webpack during
 *   the client bundle task.
 * @param {Array<string>} [config.vendorModules] - An array of strings identifying npm modules you want
 *   bundled into the vendor bundle.
 * @return {Object} - Config with defaults.
 */
function validateConfig(config, configPath) {
  config = config || {};

  const projectDirectory = configPath === undefined
    ? process.cwd()
    : configPath;

  const defaults = {
    production: false,
    verbose: false,
    port: 8080,
    pagesDirectory: path.join(projectDirectory, 'src/pages'),
    outputDirectory: path.join(projectDirectory, '_site'),
    temporaryDirectory: path.join(projectDirectory, '_tmp'),
    wrapperPath: path.join(__dirname, '../src/empty-wrapper.js'),
    externalStylesheets: [],
    babelExclude: /node_modules/
  };

  if (_.get(config, 'pagesDirectory')) {
    defaults.notFoundPath = path.join(config.pagesDirectory, '404.js');
  } else {
    defaults.notFoundPath = path.join(defaults.pagesDirectory, '404.js');
  }

  const configWithDefaults = Object.assign({}, defaults, config);

  if (!isAbsolutePath(configWithDefaults.pagesDirectory)) {
    throw new Error('pagesDirectory is required and must be an absolute path');
  }
  if (!isAbsolutePath(configWithDefaults.outputDirectory)) {
    throw new Error('outputDirectory is required and must be an absolute path');
  }
  if (
    configWithDefaults.wrapperPath &&
    !isAbsolutePath(configWithDefaults.wrapperPath)
  ) {
    throw new Error('wrapperPath must be an absolute path');
  }
  if (
    configWithDefaults.temporaryDirectory &&
    !isAbsolutePath(configWithDefaults.temporaryDirectory)
  ) {
    throw new Error('temporaryDirectory must be an absolute path');
  }

  // Normalize URL parts
  if (config.siteOrigin) {
    configWithDefaults.siteOrigin = config.siteOrigin.replace(/\/$/, '');
  }
  if (typeof config.siteBasePath === 'string' && config.siteBasePath !== '/') {
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
