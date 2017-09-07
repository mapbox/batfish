// @flow
'use strict';

const _ = require('lodash');
const webpack = require('webpack');
const path = require('path');
const pify = require('pify');
const fs = require('fs');
const cpy = require('cpy');
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
const maybeClearOutputDirectory = require('./maybe-clear-output-directory');

// We need to define this type because Flow can't understand the non-literal
// require that pulls in static-render-pages.js below.
declare type StaticRenderPagesFunction = (
  BatfishConfiguration,
  {
    +vendor: { +js: string },
    +app: { +js: string }
  },
  string,
  cssUrl?: string
) => Promise<void>;

function webpackCompile(
  webpackConfig: webpack$Configuration
): Promise<webpack$Stats> {
  return new Promise((resolve, reject) => {
    let compiler;
    try {
      compiler = webpack(webpackConfig);
    } catch (initializationError) {
      return reject(
        wrapError(initializationError, errorTypes.WebpackFatalError)
      );
    }
    compiler.run((fatalError, stats) => {
      if (fatalError) {
        return reject(wrapError(fatalError, errorTypes.WebpackFatalError));
      }
      if (stats.hasErrors()) {
        return reject(createWebpackStatsError(stats));
      }
      resolve(stats);
    });
  });
}

function build(rawConfig?: Object, projectDirectory?: string): EventEmitter {
  // Default production to true when building.
  rawConfig = Object.assign({ production: true }, rawConfig);
  const emitter = new EventEmitter();
  const emitError = (error: Error) => {
    emitter.emit(constants.EVENT_ERROR, error);
  };
  const emitNotification = (message: string) => {
    emitter.emit(constants.EVENT_NOTIFICATION, message);
  };

  let batfishConfig;
  try {
    batfishConfig = validateConfig(rawConfig, projectDirectory);
  } catch (configValidationError) {
    // setImmediate allows us to return the emitter before emitting the error.
    setImmediate(() => {
      emitError(configValidationError);
    });
    return emitter;
  }

  const stylesheetsIsEmpty = _.isEmpty(batfishConfig.stylesheets);
  const outputDirectory = batfishConfig.outputDirectory;
  const assetsDirectory = path.join(
    outputDirectory,
    constants.PUBLIC_PATH_ASSETS
  );

  // For the static build, put everything Webpack makes in an assets/ subdirectory.
  const tailoredBatfishConfig = Object.assign({}, batfishConfig, {
    outputDirectory: assetsDirectory
  });

  // Get the absolute path to an asset referenced by a relative path in
  // assets.json.
  const getAssetFilePath = (assetPath: string): string => {
    let pathWithoutBase = assetPath;
    if (batfishConfig.siteBasePath) {
      pathWithoutBase = assetPath.replace(
        new RegExp(`^${batfishConfig.siteBasePath}`),
        ''
      );
    }
    return path.join(outputDirectory, pathWithoutBase);
  };

  const copyNonPages = (): Promise<void> => {
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

  const buildClient = (): Promise<void> => {
    return createWebpackConfigClient(tailoredBatfishConfig)
      .then(webpackCompile)
      .then(stats => {
        // For bundle debugging, write stats.json.
        return pify(fs.writeFile)(
          path.join(outputDirectory, constants.STATS_BASENAME),
          JSON.stringify(stats.toJson())
        );
      });
  };

  const buildStatic = (): Promise<webpack$Stats> => {
    return createWebpackConfigStatic(tailoredBatfishConfig).then(
      webpackCompile
    );
  };

  // The compiled CSS filename will differ depending on whether this is a
  // production build or not.
  let cssFilename;
  const renderHtml = (): Promise<void> => {
    return pTry(() => {
      // This file reading is synced to make scoping easier, and with so few
      // files doesn't matter for performance.
      const rawAssets = fs.readFileSync(
        path.join(assetsDirectory, 'assets.json'),
        'utf8'
      );
      const assets: {
        manifest: { js: string },
        app: { js: string },
        vendor: { js: string }
      } = Object.freeze(JSON.parse(rawAssets));
      const manifestJs = fs.readFileSync(
        getAssetFilePath(assets.manifest.js),
        'utf8'
      );

      const uglified = UglifyJs.minify(manifestJs);
      if (uglified.error) throw uglified.error;
      const uglifiedManifestJs: string = uglified.code;

      let cssUrl;
      if (!stylesheetsIsEmpty && cssFilename) {
        cssUrl = joinUrlParts(
          batfishConfig.siteBasePath,
          constants.PUBLIC_PATH_ASSETS,
          path.basename(cssFilename)
        );
      }

      try {
        const staticRenderPages: StaticRenderPagesFunction = require(path.join(
          assetsDirectory,
          'static-render-pages.js'
        )).default;
        return staticRenderPages(
          batfishConfig,
          assets,
          uglifiedManifestJs,
          cssUrl
        ).catch(error => {
          throw wrapError(error, errorTypes.WebpackNodeExecutionError);
        });
      } catch (requireError) {
        throw wrapError(requireError, errorTypes.WebpackNodeParseError);
      }
    });
  };

  maybeClearOutputDirectory(batfishConfig)
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
      if (!batfishConfig.production) return;
      return new Promise((resolve, reject) => {
        if (stylesheetsIsEmpty || !cssFilename) return resolve();
        const inlineCssEmitter = inlineCss(outputDirectory, cssFilename, {
          verbose: batfishConfig.verbose
        });
        inlineCssEmitter.on(constants.EVENT_NOTIFICATION, emitNotification);
        inlineCssEmitter.on(constants.EVENT_ERROR, reject);
        inlineCssEmitter.on(constants.EVENT_DONE, resolve);
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
      emitter.emit(constants.EVENT_DONE);
    })
    .catch(emitError);

  return emitter;
}

module.exports = build;
