'use strict';

const _ = require('lodash');
const del = require('del');
const path = require('path');
const mkdirp = require('mkdirp');
const autoprefixer = require('autoprefixer');

// !!! Whenever you add a new configuration property,
// you'll need to add it to the following list
const validConfigProperties = [
  'siteBasePath',
  'siteOrigin',
  'wrapperPath',
  'externalStylesheets',
  'browserslist',
  'pagesDirectory',
  'staticDirectory',
  'outputDirectory',
  'temporaryDirectory',
  'dataSelectors',
  'vendorModules',
  'webpackLoaders',
  'webpackPlugins',
  'webpackStaticIgnore',
  'babelPlugins',
  'babelPresets',
  'babelExclude',
  'postcssPlugins',
  'fileLoaderExtensions',
  'jsxtremeMarkdownOptions',
  'inlineJs',
  'production',
  'developmentDevtool',
  'productionDevtool',
  'clearOutputDirectory',
  'webpackConfigClientTransform',
  'webpackConfigStaticTransform',
  'port',
  'verbose'
];

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

  // !!! Any changes to these defaults require corresponding
  // changes to the documentation.
  const defaults = {
    production: false,
    verbose: false,
    port: 8080,
    pagesDirectory: path.join(projectDirectory, 'src/pages'),
    staticDirectory: path.join(projectDirectory, 'src/static'),
    outputDirectory: path.join(projectDirectory, '_batfish_site'),
    temporaryDirectory: path.join(projectDirectory, '_batfish_tmp'),
    wrapperPath: path.join(__dirname, '../src/empty-wrapper.js'),
    externalStylesheets: [],
    babelExclude: /node_modules\/!(@mapbox\/batfish\/)/,
    siteBasePath: '',
    browserslist: ['> 5%', 'last 2 versions'],
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
    jsxtremeMarkdownOptions: {},
    developmentDevtool: 'source-map',
    productionDevtool: false,
    clearOutputDirectory: true
  };

  const configWithDefaults = Object.assign({}, defaults, config);

  const defaultPostcssPlugins = [
    autoprefixer({ browsers: configWithDefaults.browserslist })
  ];

  // Invoke transform function properties
  if (typeof config.fileLoaderExtensions === 'function') {
    configWithDefaults.fileLoaderExtensions = config.fileLoaderExtensions(
      defaults.fileLoaderExtensions
    );
  }

  // Apply postcssPlugins default. This depends on browserslist,
  if (typeof config.postcssPlugins === 'function') {
    configWithDefaults.postcssPlugins = config.postcssPlugins(
      defaultPostcssPlugins
    );
  } else if (!configWithDefaults.postcssPlugins) {
    configWithDefaults.postcssPlugins = defaultPostcssPlugins;
  }

  const configWithDefaultsProperties = Object.keys(configWithDefaults);

  const invalidProperties = _.pullAll(
    configWithDefaultsProperties,
    validConfigProperties
  );

  if (invalidProperties.length > 0) {
    if (invalidProperties.length === 1) {
      throw new Error(
        invalidProperties.toString() + ' is an invalid config property'
      );
    }
    throw new Error(
      invalidProperties.join(', ') + ' are invalid config properties'
    );
  }

  if (!isAbsolutePath(configWithDefaults.pagesDirectory)) {
    throw new Error('pagesDirectory must be an absolute path');
  }
  if (!isAbsolutePath(configWithDefaults.outputDirectory)) {
    throw new Error('outputDirectory must be an absolute path');
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
    if (configWithDefaults.siteBasePath[0] !== '/') {
      configWithDefaults.siteBasePath = '/' + configWithDefaults.siteBasePath;
    }
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
