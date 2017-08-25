'use strict';

const webpack = require('webpack');
const path = require('path');
const pify = require('pify');
const fs = require('fs');
const del = require('del');
const cpy = require('cpy');
const _ = require('lodash');
const pTry = require('p-try');
const EventEmitter = require('events');
const UglifyJs = require('uglify-js');
const createWebpackConfigClient = require('./create-webpack-config-client');
const createWebpackConfigStatic = require('./create-webpack-config-static');
const validateConfig = require('./validate-config');
const inlineCss = require('./inline-css');
const generateSitemap = require('./generate-sitemap');
const compileStylesheets = require('./compile-stylesheets');
const joinUrlParts = require('./join-url-parts');
const constants = require('./constants');
const errorTypes = require('./error-types');
const wrapError = require('./wrap-error');
const createWebpackStatsError = require('./create-webpack-stats-error');

function webpackCompile(webpackConfig) {
  return new Promise((resolve, reject) => {
    let compiler;
    try {
      compiler = webpack(webpackConfig);
    } catch (initializationError) {
      return reject(
        wrapError(errorTypes.WebpackFatalError, initializationError)
      );
    }
    compiler.run((fatalError, stats) => {
      if (fatalError) {
        return reject(wrapError(errorTypes.WebpackFatalError, fatalError));
      }
      if (stats.hasErrors()) {
        return reject(createWebpackStatsError(stats));
      }
      resolve(stats);
    });
  });
}

/**
 * Build static pages and assets, ready for deployment.
 *
 * @param {Object} [rawConfig={}]
 * @param {string} projectDirectory
 * @return {Promise<void>} - Resolves when the build is complete.
 */
function build(rawConfig, projectDirectory) {
  rawConfig = Object.assign(
    {
      production: true
    },
    rawConfig
  );
  const emitter = new EventEmitter();
  const emitError = error => {
    emitter.emit('error', error);
  };
  const emitNotification = message => {
    emitter.emit('notification', message);
  };

  let batfishConfig;
  try {
    batfishConfig = validateConfig(rawConfig, projectDirectory);
  } catch (ConfigValidationErrors) {
    // setImmediate allows us to return the emitter before emitting the error.
    setImmediate(() => {
      emitError(ConfigValidationErrors);
    });
    return emitter;
  }

  const stylesheetsIsEmpty = _.isEmpty(batfishConfig.stylesheets);
  const outputDirectory = batfishConfig.outputDirectory;
  const assetsDirectory = path.join(
    outputDirectory,
    constants.PUBLIC_PATH_ASSETS
  );

  // Get the absolute path to an asset referenced by a relative path in
  // assets.json.
  const getAssetFilePath = assetPath => {
    const pathWithoutBase = assetPath.replace(
      new RegExp(`^${batfishConfig.siteBasePath}`),
      ''
    );
    return path.join(outputDirectory, pathWithoutBase);
  };

  // For the static build, put everything Webpack makes in an assets/ subdirectory.
  const configOptions = Object.assign({}, batfishConfig, {
    outputDirectory: assetsDirectory
  });

  const copyNonPages = () => {
    // Don't copy .js, .md, and .css files, which are already incorporated into
    // the build in other ways.
    let copyGlob = ['**/*.!(js|md|css)'];
    // Copy unprocessed page files directly.
    if (batfishConfig.unprocessedPageFiles !== undefined) {
      copyGlob = copyGlob.concat(batfishConfig.unprocessedPageFiles);
    }
    return cpy(copyGlob, batfishConfig.outputDirectory, {
      cwd: batfishConfig.pagesDirectory,
      parents: true
    });
  };

  const buildClient = () => {
    return createWebpackConfigClient(configOptions)
      .then(webpackCompile)
      .then(stats => {
        // For bundle debugging, write stats.json.
        pify(fs.writeFile)(
          path.join(outputDirectory, constants.STATS_BASENAME),
          JSON.stringify(stats.toJson())
        );
      });
  };

  const buildStatic = () => {
    return createWebpackConfigStatic(configOptions).then(webpackCompile);
  };

  // The compiled CSS filename will differ depending on whether this is a
  // production build or not.
  let cssFilename;
  const renderHtml = () => {
    return pTry(() => {
      // This file reading is synced to make scoping easier, and with so few
      // files doesn't matter for performance.
      const rawAssets = fs.readFileSync(
        path.join(assetsDirectory, 'assets.json'),
        'utf8'
      );
      const assets = JSON.parse(rawAssets);
      const manifestJs = fs.readFileSync(
        getAssetFilePath(assets.manifest.js),
        'utf8'
      );

      const uglifiedManifestJs = UglifyJs.minify(manifestJs, {
        fromString: true
      }).code;

      const cssUrl = stylesheetsIsEmpty
        ? undefined
        : joinUrlParts(
            batfishConfig.siteBasePath,
            constants.PUBLIC_PATH_ASSETS,
            path.basename(cssFilename)
          );

      let staticRenderPages;
      try {
        staticRenderPages = require(path.join(
          assetsDirectory,
          'static-render-pages.js'
        )).default;
      } catch (requireError) {
        throw wrapError(requireError, errorTypes.WebpackNodeParseError);
      }

      return staticRenderPages(
        batfishConfig,
        assets,
        uglifiedManifestJs,
        cssUrl
      ).catch(error => {
        throw wrapError(error, errorTypes.WebpackNodeExecutionError);
      });
    });
  };

  Promise.resolve()
    .then(() => {
      if (batfishConfig.clearOutputDirectory) {
        return del(outputDirectory, { force: true });
      }
    })
    .then(() => {
      if (stylesheetsIsEmpty) return;
      emitNotification('Compiling CSS.');
      return compileStylesheets(
        batfishConfig,
        assetsDirectory
      ).then(filename => {
        cssFilename = filename;
      });
    })
    .then(() => {
      emitNotification('Starting the Webpack bundling.');
      emitNotification('Creating the client bundle.');
      return buildClient();
    })
    .then(() => {
      emitNotification('Creating the static-page-rendering Node bundle.');
      return buildStatic();
    })
    .then(() => {
      emitNotification('Copying unprocessed files.');
      return Promise.all([copyNonPages()]);
    })
    .then(() => {
      emitNotification('Building HTML.');
      return renderHtml();
    })
    .then(() => {
      if (!batfishConfig.production || stylesheetsIsEmpty) return;
      return new Promise((resolve, reject) => {
        const inlineCssEmitter = inlineCss(outputDirectory, cssFilename, {
          verbose: batfishConfig.verbose
        });
        inlineCssEmitter.on('notification', emitNotification);
        inlineCssEmitter.on('error', reject);
        inlineCssEmitter.on('done', resolve);
      });
    })
    .then(() => {
      if (batfishConfig.siteOrigin) {
        emitNotification('Building the sitemap.');
        return generateSitemap(batfishConfig);
      } else {
        emitNotification(
          'siteOrigin is not specified; unable to generate sitemap.'
        );
      }
    })
    .then(() => {
      emitter.emit('done');
    })
    .catch(emitError);

  return emitter;
}

module.exports = build;
