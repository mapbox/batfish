// @flow
'use strict';

const _ = require('lodash');
const path = require('path');
const EventEmitter = require('events');
const createWebpackConfigClient = require('./create-webpack-config-client');
const createWebpackConfigStatic = require('./create-webpack-config-static');
const validateConfig = require('./validate-config');
const inlineCss = require('./inline-css');
const generateSitemap = require('./generate-sitemap');
const compileStylesheets = require('./compile-stylesheets');
const constants = require('./constants');
const maybeClearOutputDirectory = require('./maybe-clear-output-directory');
const nonPageFiles = require('./non-page-files');
const writeWebpackStats = require('./write-webpack-stats');
const buildHtml = require('./build-html');
const webpackCompilePromise = require('./webpack-compile-promise');

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
    batfishConfig.publicAssetsPath
  );

  // For the static build, put everything Webpack makes in an assets/ subdirectory.
  const tailoredBatfishConfig = Object.assign({}, batfishConfig, {
    outputDirectory: assetsDirectory
  });

  const buildClient = (): Promise<void> => {
    return createWebpackConfigClient(tailoredBatfishConfig)
      .then(webpackCompilePromise)
      .then(stats => {
        return writeWebpackStats(outputDirectory, stats);
      });
  };

  const buildStatic = (): Promise<webpack$Stats> => {
    return createWebpackConfigStatic(tailoredBatfishConfig).then(
      webpackCompilePromise
    );
  };

  // The compiled CSS filename will differ depending on whether this is a
  // production build or not. So it needs to be a variable.
  let cssFilename;
  maybeClearOutputDirectory(batfishConfig)
    .then(() => {
      if (stylesheetsIsEmpty) return;
      emitNotification('Compiling CSS.');
      return compileStylesheets(batfishConfig, assetsDirectory).then(
        filename => {
          cssFilename = filename;
        }
      );
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
      return nonPageFiles.copy(batfishConfig);
    })
    .then(() => {
      emitNotification('Building HTML.');
      return buildHtml(batfishConfig, cssFilename);
    })
    .then(() => {
      if (!batfishConfig.production || !batfishConfig.staticHtmlInlineDeferCss)
        return;
      return new Promise((resolve, reject) => {
        // This line within the callback function scope to please Flow about
        // the cssFilename variable.
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
      if (!batfishConfig.sitemap) return;
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
