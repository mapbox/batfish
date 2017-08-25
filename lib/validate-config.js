'use strict';

const _ = require('lodash');
const del = require('del');
const path = require('path');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const fs = require('fs');
const a = require('indefinite');
const isGlob = require('is-glob');
const isAbsoluteUrl = require('is-absolute-url');
const autoprefixer = require('autoprefixer');
const errorTypes = require('./error-types');

// !!!
// Whenever you add a new configuration property,
// you'll need to add it to the following list.
const validConfigProperties = new Set([
  'siteBasePath',
  'siteOrigin',
  'applicationWrapperPath',
  'stylesheets',
  'browserslist',
  'pagesDirectory',
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
  'includePromisePolyfill',
  'inlineJs',
  'production',
  'developmentDevtool',
  'productionDevtool',
  'clearOutputDirectory',
  'unprocessedPageFiles',
  'webpackConfigClientTransform',
  'webpackConfigStaticTransform',
  'port',
  'verbose'
]);

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
function validateConfig(rawConfig, configPath) {
  rawConfig = rawConfig || {};
  const configErrors = [];
  if (!_.isPlainObject(rawConfig)) {
    throw new errorTypes.ConfigFatalError(
      'Your Batfish configuration module must export a function the returns a configuration object.'
    );
  }

  const projectDirectory =
    configPath === undefined ? process.cwd() : configPath;

  // !!!
  // Any changes to these defaults require corresponding
  // changes to the documentation.
  const defaults = {
    production: false,
    verbose: false,
    port: 8080,
    pagesDirectory: path.join(projectDirectory, 'src/pages'),
    outputDirectory: path.join(projectDirectory, '_batfish_site'),
    temporaryDirectory: path.join(projectDirectory, '_batfish_tmp'),
    applicationWrapperPath: path.join(
      __dirname,
      '../src/empty-application-wrapper.js'
    ),
    stylesheets: [],
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
    includePromisePolyfill: true,
    developmentDevtool: 'source-map',
    productionDevtool: false,
    clearOutputDirectory: true
  };

  const config = Object.assign({}, defaults, rawConfig);

  const defaultPostcssPlugins = [
    autoprefixer({ browsers: config.browserslist })
  ];

  // Invoke transform function properties
  if (typeof config.fileLoaderExtensions === 'function') {
    config.fileLoaderExtensions = config.fileLoaderExtensions(
      defaults.fileLoaderExtensions
    );
  }

  // Apply postcssPlugins default. This depends on browserslist.
  if (typeof config.postcssPlugins === 'function') {
    config.postcssPlugins = config.postcssPlugins(defaultPostcssPlugins);
  } else if (!config.postcssPlugins) {
    config.postcssPlugins = defaultPostcssPlugins;
  }

  Object.keys(config).forEach(propertyName => {
    if (!validConfigProperties.has(propertyName)) {
      configErrors.push(
        `${chalk.yellow(propertyName)} is not a valid configuration property.`
      );
    }
  });

  const validatePropertyType = (propertyName, predicate, typeDescription) => {
    const value = config[propertyName];
    if (value === undefined) {
      return;
    }
    if (!predicate(value)) {
      configErrors.push(
        `${chalk.yellow(propertyName)} must be ${a(typeDescription)}.`
      );
    }
  };

  // !!!
  // Any changes to the acceptable values for a config property need to be
  // accounted for in these validation functions.

  validatePropertyType('siteBasePath', _.isString, 'string');

  validatePropertyType('siteOrigin', _.isString, 'string');

  validatePropertyType(
    'applicationWrapperPath',
    isAbsolutePath,
    'absolute path'
  );
  validatePropertyType(
    'applicationWrapperPath',
    isExistingFile,
    'file that exists'
  );

  validatePropertyType(
    'stylesheets',
    isArrayOf(isValidStylesheetItem),
    'array of absolute file paths or globs, absolute URLs, or arrays of these things'
  );

  // Validate every stylesheet entry. URLs will be checked when they actually
  // are called. And it's ok if globs don't point to existing files yet.
  // So just check if absolute paths point to existing files.
  if (Array.isArray(config.stylesheets)) {
    _.flatten(config.stylesheets).forEach(item => {
      if (isAbsoluteUrl(item)) return;
      if (isGlob(item)) return;
      if (isExistingFile(item)) return;
      configErrors.push(
        `Stylesheet entry ${chalk.yellow(
          item
        )} does not point to an existing file.`
      );
    });
  }

  validatePropertyType(
    'browserslist',
    x => {
      return _.isString(x) || isArrayOf(_.isString)(x);
    },
    'string or array of strings'
  );

  validatePropertyType('pagesDirectory', isAbsolutePath, 'absolute path');
  validatePropertyType(
    'pagesDirectory',
    isExistingFile,
    'directory that exists'
  );

  validatePropertyType('outputDirectory', isAbsolutePath, 'absolute path');

  validatePropertyType('temporaryDirectory', isAbsolutePath, 'absolute path');

  validatePropertyType(
    'dataSelectors',
    x => {
      return _.isPlainObject(x) && _.every(x, _.isFunction);
    },
    'object whose property values are functions.'
  );

  validatePropertyType(
    'vendorModules',
    isArrayOf(_.isString),
    'array of strings'
  );

  validatePropertyType(
    'webpackLoaders',
    isArrayOf(_.isPlainObject),
    'array of Webpack Rule objects'
  );

  validatePropertyType(
    'webpackPlugins',
    isArrayOf(_.isObject),
    'array of Webpack plugins'
  );
  // No good way to validate webpackStaticIgnore, which is a Webpack Condition
  // so might be almost any type:
  // https://webpack.js.org/configuration/module/#condition

  validatePropertyType(
    'babelPlugins',
    isArrayOf(_.isFunction),
    'array of functions (require your plugins, do not reference them with a string)'
  );

  validatePropertyType(
    'babelPresets',
    isArrayOf(_.isFunction),
    'array of functions (require your presets, do not reference them with a string)'
  );
  // No good way to validate babelExclude, which is a Webpack Condition
  // (see above).

  validatePropertyType(
    'postcssPlugins',
    x => {
      return _.isFunction(x) || isArrayOf(_.isFunction)(x);
    },
    'function or array of functions'
  );

  validatePropertyType(
    'fileLoaderExtensions',
    x => {
      return isArrayOf(_.isString)(x) || _.isFunction(x);
    },
    'array of strings or function'
  );

  validatePropertyType('jsxtremeMarkdownOptions', _.isPlainObject, 'object');

  validatePropertyType('includePromisePolyfill', _.isBoolean, 'boolean');

  validatePropertyType(
    'inlineJs',
    isArrayOf(x => {
      return isAbsolutePath(x.filename) || _.isBoolean(x);
    }),
    'array of objects with an absolute path for the "filename" prop, and an optional "boolean" uglify prop'
  );

  validatePropertyType('production', _.isBoolean, 'boolean');

  validatePropertyType(
    'developmentDevtool',
    x => {
      return _.isString(x) || x === false;
    },
    'string or the boolean value false'
  );

  validatePropertyType(
    'productionDevtool',
    x => {
      return _.isString(x) || x === false;
    },
    'string or the boolean value false'
  );

  validatePropertyType('clearOutputDirectory', _.isBoolean, 'boolean');

  validatePropertyType(
    'unprocessedPageFiles',
    isArrayOf(x => !isAbsolutePath(x)),
    'globs relative to the pagesDirectory, not absolute paths'
  );

  validatePropertyType(
    'webpackConfigClientTransform',
    _.isFunction,
    'function'
  );

  validatePropertyType(
    'webpackConfigStaticTransform',
    _.isFunction,
    'function'
  );

  validatePropertyType('port', _.isNumber, 'number');

  validatePropertyType('verbose', _.isBoolean, 'boolean');

  // Throw config errors.
  if (configErrors.length) {
    const error = new errorTypes.ConfigValidationErrors();
    error.validationErrors = configErrors;
    throw error;
  }

  // Normalize URL parts.
  if (config.siteOrigin) {
    config.siteOrigin = config.siteOrigin.replace(/\/$/, '');
  }
  if (config.siteBasePath && config.siteBasePath !== '/') {
    config.siteBasePath = config.siteBasePath.replace(/\/$/, '');
    if (config.siteBasePath[0] !== '/') {
      config.siteBasePath = '/' + config.siteBasePath;
    }
  }

  mkdirp.sync(config.temporaryDirectory);
  del.sync(path.join(config.temporaryDirectory, '{*.*,.*}'), {
    force: true
  });

  return config;
}

module.exports = validateConfig;

function isAbsolutePath(filePath) {
  if (!_.isString(filePath)) {
    return false;
  }
  return path.isAbsolute(filePath);
}

function isArrayOf(itemCheck) {
  return value => _.isArray(value) && value.every(itemCheck);
}

function isExistingFile(value) {
  return fs.existsSync(value);
}

function isValidStylesheetItem(value) {
  if (Array.isArray(value)) {
    return value.every(isValidStylesheetItem);
  }
  if (!_.isString(value)) return false;
  return isAbsoluteUrl(value) || isAbsolutePath(value);
}
