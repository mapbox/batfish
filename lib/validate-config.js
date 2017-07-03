'use strict';

const _ = require('lodash');
const del = require('del');
const path = require('path');
const mkdirp = require('mkdirp');

/**
 * Add defaults to a raw config object, and validate it.
 * All options and defaults are documented in the README.
 *
 * @param {Object} config
 * @param {string} [configPath=process.cwd()] - This is used to established
 *   defaults for directories.
 * @return {BatfishConfig} - A new object with defaults applied. A fully
 *   valid Batfish config object.
 */
function validateConfig(config, configPath) {
  config = config || {};

  const projectDirectory =
    configPath === undefined ? process.cwd() : configPath;

  const defaults = {
    production: false,
    verbose: false,
    port: 8080,
    pagesDirectory: path.join(projectDirectory, 'src/pages'),
    outputDirectory: path.join(projectDirectory, '_site'),
    temporaryDirectory: path.join(projectDirectory, '_tmp'),
    wrapperPath: path.join(__dirname, '../src/empty-wrapper.js'),
    externalStylesheets: [],
    babelExclude: /node_modules/,
    siteBasePath: '',
    autoprefixerBrowsers: ['last 4 versions', 'not ie < 10'],
    fileLoaderExtensions: [
      'jpeg',
      'jpg',
      'png',
      'gif',
      'webp',
      'mp4',
      'webm',
      'woff',
      'woff2'
    ],
    jsxtremeMarkdownOptions: {}
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
