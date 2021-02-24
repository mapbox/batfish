// @flow
'use strict';

const _ = require('lodash');
const del = require('del');
const path = require('path');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const a = require('indefinite');
const isGlob = require('is-glob');
const isAbsoluteUrl = require('is-absolute-url');
const pathType = require('path-type');
const autoprefixer = require('autoprefixer');
const errorTypes = require('./error-types');
const joinUrlParts = require('./join-url-parts');
const getEnvBrowserslist = require('./get-env-browserslist');

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
    validator: isAbsolutePathToExistingFile,
    description: 'absolute path to an existing file'
  },
  stylesheets: {
    validator: isArrayOf(isValidStylesheetItem),
    description:
      'array of absolute file paths or globs, absolute URLs, or arrays of these things'
  },
  browserslist: {
    validator: (x) => _.isString(x) || isArrayOf(_.isString)(x),
    description: 'string or array of strings'
  },
  devBrowserslist: {
    validator: (x) => _.isString(x) || isArrayOf(_.isString)(x) || x === false,
    description: 'string, array of strings, or false'
  },
  pagesDirectory: {
    validator: isAbsolutePathToExistingDirectory,
    description: 'absolute path to an existing directory'
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
    validator: (x) => _.isPlainObject(x) && _.every(x, _.isFunction),
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
  manageScrollRestoration: {
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
  // No good way to validate this, which is a Webpack Condition
  // so might be almost any type:
  // https://webpack.js.org/configuration/module/#condition
  webpackStaticIgnore: {
    validator: () => true
  },
  webpackStaticStubReactComponent: {
    validator: isArrayOf(isAbsolutePath),
    description: 'array of absolute paths'
  },
  babelPlugins: {
    validator: isArrayOf(isBabelSetting),
    description: 'array of absolute paths (require.resolve your plugins)'
  },
  babelPresets: {
    validator: isArrayOf(isBabelSetting),
    description: 'array of absolute paths (require.resolve your presets)'
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
  babelInclude: {
    validator: _.isArray
  },
  postcssPlugins: {
    validator: (x) => _.isFunction(x) || isArrayOf(_.isFunction)(x),
    description: 'function or array of functions'
  },
  fileLoaderExtensions: {
    validator: (x) => isArrayOf(_.isString)(x) || _.isFunction(x),
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
  staticHtmlInlineDeferCss: {
    validator: _.isBoolean,
    description: 'boolean'
  },
  includePromisePolyfill: {
    validator: _.isBoolean,
    description: 'boolean'
  },
  inlineJs: {
    validator: isArrayOf((x) => {
      return (
        isAbsolutePathToExistingFile(x.filename) &&
        (x.uglify === undefined || _.isBoolean(x))
      );
    }),
    description:
      'array of objects with an absolute path for the "filename" prop, and an optional "boolean" uglify prop'
  },
  production: {
    validator: _.isBoolean,
    description: 'boolean'
  },
  developmentDevtool: {
    validator: (x) => _.isString(x) || x === false,
    description: 'string or the boolean value false'
  },
  productionDevtool: {
    validator: (x) => _.isString(x) || x === false,
    description: 'string or the boolean value false'
  },
  clearOutputDirectory: {
    validator: _.isBoolean,
    description: 'boolean'
  },
  unprocessedPageFiles: {
    validator: isArrayOf((x) => !isAbsolutePath(x)),
    description: 'globs relative to the pagesDirectory, not absolute paths'
  },
  ignoreWithinPagesDirectory: {
    validator: isArrayOf((x) => !isAbsolutePath(x)),
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
  },
  spa: {
    validator: _.isBoolean,
    description: 'boolean'
  },
  sitemap: {
    validator: (x) => _.isBoolean(x) || _.isPlainObject(x),
    description: 'boolean or object'
  },
  webpackStats: {
    validator: _.isBoolean,
    description: 'boolean'
  },
  includePages: {
    validator: isArrayOf(_.isString),
    description: 'globs relative to the pagesDirectory, not absolute paths'
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
    babelPlugins: [],
    babelPresets: [],
    hijackLinks: true,
    manageScrollRestoration: true,
    // cf. https://github.com/facebook/create-react-app/pull/3741/files#r162787793
    babelExclude: /[/\\\\]node_modules[/\\\\]/,
    babelInclude: [],
    siteBasePath: '',
    browserslist: ['> 5%', 'last 2 versions'],
    devBrowserslist: [
      // Recent browsers supporting a lot of ES2015.
      'Edge >= 14',
      'Firefox >= 52',
      'Chrome >= 58',
      'Safari >= 10',
      'iOS >= 10.2'
    ],
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
    staticHtmlInlineDeferCss: true,
    developmentDevtool: 'source-map',
    productionDevtool: false,
    clearOutputDirectory: true,
    spa: false,
    webpackStaticStubReactComponent: [],
    sitemap: true,
    webpackStats: false
  };

  const config = Object.assign({}, defaults, rawConfig);

  const envBrowserslist = getEnvBrowserslist(
    config.browserslist,
    config.devBrowserslist,
    config.production
  );
  const defaultPostcssPlugins = [
    autoprefixer({ overrideBrowserslist: envBrowserslist })
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
    predicate: (any) => boolean,
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

  Object.keys(config).forEach((propertyName) => {
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
    _.flatten(config.stylesheets).forEach((item) => {
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
  if (config.publicAssetsPath[0] !== '/') {
    config.publicAssetsPath = '/' + config.publicAssetsPath;
  }

  if (config.includePages) {
    config.includePages = config.includePages
      .map((p) => {
        // Ensure all includePages paths start with / or the siteBasePath.
        if (config.siteBasePath && !p.startsWith(config.siteBasePath)) {
          return joinUrlParts(config.siteBasePath, p);
        }
        if (p[0] === '/') return p;
        return `/${p}`;
      })
      .map((p) => {
        // Ensure all includePages paths that do not end in wildcards
        // or extensions end with /
        if (path.extname(p)) return p;
        if (/\*$/.test(p)) return p;
        return `${p}/`;
      });
  }

  if (config.spa) {
    // eslint-disable-next-line
    console.warn(
      'The SPA mode is being deprecated in favour of Underreact. Please visit https://github.com/mapbox/underreact for more information.'
    );
    config.hijackLinks = false;
    config.manageScrollRestoration = false;
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
  return pathType.isFileSync(value);
}

function isExistingDirectory(value: *): boolean {
  if (!_.isString(value)) {
    return false;
  }
  return pathType.isDirectorySync(value);
}

function isValidStylesheetItem(value: *): boolean {
  if (Array.isArray(value)) {
    return value.every(isValidStylesheetItem);
  }
  if (!_.isString(value)) return false;
  return isAbsoluteUrl(value) || isAbsolutePath(value);
}

function isAbsolutePathToExistingFile(value: *): boolean {
  return isAbsolutePath(value) && isExistingFile(value);
}

function isAbsolutePathToExistingDirectory(value: *): boolean {
  return isAbsolutePath(value) && isExistingDirectory(value);
}

function isBabelSetting(value: *): boolean {
  return isAbsolutePath(value) || _.isFunction(value);
}
