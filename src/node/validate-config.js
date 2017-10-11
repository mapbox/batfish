// @flow
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
// you'll need to add it to this schema.
const configSchema = {
  siteBasePath: {
    validator: _.isString,
    description: 'string'
  },
  siteOrigin: {
    validator: _.isString,
    description: 'string'
  },
  publicAssetsPath: {
    validator: _.isString,
    description: 'string'
  },
  applicationWrapperPath: {
    validator: isAbsolutePath,
    description: 'absolute path'
  },
  stylesheets: {
    validator: isArrayOf(isValidStylesheetItem),
    description:
      'array of absolute file paths or globs, absolute URLs, or arrays of these things'
  },
  browserslist: {
    validator: x => _.isString(x) || isArrayOf(_.isString)(x),
    description: 'string or array of strings'
  },
  pagesDirectory: {
    validator: isAbsolutePath,
    description: 'absolute path'
  },
  outputDirectory: {
    validator: isAbsolutePath,
    description: 'absolute path'
  },
  temporaryDirectory: {
    validator: isAbsolutePath,
    description: 'absolute path'
  },
  dataSelectors: {
    validator: x => _.isPlainObject(x) && _.every(x, _.isFunction),
    description: 'object whose values are functions'
  },
  vendorModules: {
    validator: isArrayOf(_.isString),
    description: 'array of strings'
  },
  hijackLinks: {
    validator: _.isBoolean,
    description: 'boolean'
  },
  webpackLoaders: {
    validator: isArrayOf(_.isPlainObject),
    description: 'array of Webpack Rule objects'
  },
  webpackPlugins: {
    validator: isArrayOf(_.isObject),
    description: 'array of Webpack plugins'
  },
  // No good way to validate webpackStaticIgnore, which is a Webpack Condition
  // so might be almost any type:
  // https://webpack.js.org/configuration/module/#condition
  webpackStaticIgnore: {
    validator: () => true
  },
  babelPlugins: {
    validator: isArrayOf(_.isFunction),
    description:
      'array of functions (require your plugins, do not reference them with a string)'
  },
  babelPresets: {
    validator: isArrayOf(_.isFunction),
    description:
      'array of functions (require your presets, do not reference them with a string)'
  },
  babelPresetEnvOptions: {
    validator: _.isPlainObject,
    description: 'object'
  },
  // No good way to validate babelExclude, which is a Webpack Condition
  // (see above).
  babelExclude: {
    validator: () => true
  },
  postcssPlugins: {
    validator: x => _.isFunction(x) || isArrayOf(_.isFunction)(x),
    description: 'function or array of functions'
  },
  fileLoaderExtensions: {
    validator: x => isArrayOf(_.isString)(x) || _.isFunction(x),
    description: 'array of strings or a function'
  },
  jsxtremeMarkdownOptions: {
    validator: _.isPlainObject,
    description: 'object'
  },
  pageSpecificCss: {
    validator: _.isBoolean,
    description: 'boolean'
  },
  includePromisePolyfill: {
    validator: _.isBoolean,
    description: 'boolean'
  },
  inlineJs: {
    validator: isArrayOf(x => isAbsolutePath(x.filename) || _.isBoolean(x)),
    description:
      'array of objects with an absolute path for the "filename" prop, and an optional "boolean" uglify prop'
  },
  production: {
    validator: _.isBoolean,
    description: 'boolean'
  },
  developmentDevtool: {
    validator: x => _.isString(x) || x === false,
    description: 'string or the boolean value false'
  },
  productionDevtool: {
    validator: x => _.isString(x) || x === false,
    description: 'string or the boolean value false'
  },
  clearOutputDirectory: {
    validator: _.isBoolean,
    description: 'boolean'
  },
  unprocessedPageFiles: {
    validator: isArrayOf(x => !isAbsolutePath(x)),
    description: 'globs relative to the pagesDirectory, not absolute paths'
  },
  webpackConfigClientTransform: {
    validator: _.isFunction,
    description: 'function'
  },
  webpackConfigStaticTransform: {
    validator: _.isFunction,
    description: 'function'
  },
  port: {
    validator: _.isNumber,
    description: 'number'
  },
  verbose: {
    validator: _.isBoolean,
    description: 'boolean'
  }
};

// Add defaults to a raw config object, and validate it.
// All options and defaults are documented in the README.
function validateConfig(
  rawConfig?: Object,
  projectDirectory?: string
): BatfishConfiguration {
  rawConfig = rawConfig || {};
  projectDirectory = projectDirectory || process.cwd();
  const configErrors = [];
  if (!_.isPlainObject(rawConfig)) {
    throw new errorTypes.ConfigFatalError(
      'Your Batfish configuration module must export a function the returns a configuration object.'
    );
  }

  // !!!
  // Any changes to these defaults require corresponding
  // changes to the documentation.
  const defaults = {
    production: false,
    verbose: false,
    port: 8080,
    publicAssetsPath: 'assets',
    pagesDirectory: path.join(projectDirectory, 'src/pages'),
    outputDirectory: path.join(projectDirectory, '_batfish_site'),
    temporaryDirectory: path.join(projectDirectory, '_batfish_tmp'),
    applicationWrapperPath: path.join(
      __dirname,
      '../webpack/empty-application-wrapper.js'
    ),
    stylesheets: [],
    hijackLinks: true,
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
    pageSpecificCss: true,
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

  const validatePropertyType = (
    propertyName: string,
    predicate: any => boolean,
    typeDescription: string
  ) => {
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

  Object.keys(config).forEach(propertyName => {
    const optionSchema = configSchema[propertyName];
    if (!optionSchema) {
      configErrors.push(
        `${chalk.yellow(propertyName)} is not a valid configuration property.`
      );
      return;
    }
    validatePropertyType(
      propertyName,
      optionSchema.validator,
      optionSchema.description
    );
  });

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

  // Throw config errors.
  if (configErrors.length) {
    const error = new errorTypes.ConfigValidationError();
    error.messages = configErrors;
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

function isAbsolutePath(value: *): boolean {
  if (!_.isString(value)) {
    return false;
  }
  return path.isAbsolute(value);
}

function isArrayOf(itemCheck: (*) => boolean): (*) => boolean {
  return (value: *) => Array.isArray(value) && value.every(itemCheck);
}

function isExistingFile(value: *): boolean {
  if (!_.isString(value)) {
    return false;
  }
  return fs.existsSync(value);
}

function isValidStylesheetItem(value: *): boolean {
  if (Array.isArray(value)) {
    return value.every(isValidStylesheetItem);
  }
  if (!_.isString(value)) return false;
  return isAbsoluteUrl(value) || isAbsolutePath(value);
}
