// @flow
'use strict';

const _ = require('lodash');
const path = require('path');
const EventEmitter = require('events');
const createWebpackConfigClient = require('./create-webpack-config-client');
const createWebpackConfigStatic = require('./create-webpack-config-static');
const validateConfig = require('./validate-config');
const appendTaskTime = require('./append-task-time');
const inlineCss = require('./inline-css');
const generateSitemap = require('./generate-sitemap');
const compileStylesheets = require('./compile-stylesheets');
const constants = require('./constants');
const maybeClearOutputDirectory = require('./maybe-clear-output-directory');
const nonPageFiles = require('./non-page-files');
const writeWebpackStats = require('./write-webpack-stats');
const buildHtml = require('./build-html');
const webpackCompilePromise = require('./webpack-compile-promise');
const now = require('./now');

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
    emitNotification('Bundling files for the browser ...');
    return createWebpackConfigClient(tailoredBatfishConfig)
      .then(webpackCompilePromise)
      .then((stats) => {
        emitNotification(
          appendTaskTime(
            'Finished bundling files for the browser',
            stats.startTime,
            stats.endTime
          )
        );
        return writeWebpackStats(outputDirectory, stats);
      });
  };

  const buildStatic = (): Promise<void> => {
    emitNotification('Processing files for static HTML ...');
    return createWebpackConfigStatic(tailoredBatfishConfig)
      .then(webpackCompilePromise)
      .then((stats) => {
        emitNotification(
          appendTaskTime(
            'Finished processing files for static HTML',
            stats.startTime,
            stats.endTime
          )
        );
      });
  };

  // The compiled CSS filename will differ depending on whether this is a
  // production build or not. So it needs to be a variable.
  let cssFilename;

  const inlineCssInHtml = (): Promise<void> => {
    if (!cssFilename) {
      return Promise.resolve();
    }
    return inlineCss(outputDirectory, cssFilename, {
      verbose: batfishConfig.verbose,
      onNotification: emitNotification
    });
  };

  const logTask = (
    description: string,
    task: () => Promise<void>
  ): Promise<void> => {
    emitNotification(`${_.capitalize(description)} ...`);
    const startTime = now();
    return task().then(() => {
      emitNotification(appendTaskTime(`Finished ${description}`, startTime));
    });
  };

  const buildCss = (): Promise<void> => {
    return compileStylesheets(batfishConfig, assetsDirectory).then(
      (filename) => {
        cssFilename = filename;
      }
    );
  };

  const buildStartTime = now();
  setImmediate(() => {
    emitNotification('Starting build ...');
  });

  maybeClearOutputDirectory(batfishConfig)
    .then(() => {
      if (stylesheetsIsEmpty) return;
      return logTask('compiling css', buildCss);
    })
    .then(() => buildClient())
    .then(() => buildStatic())
    .then(() => {
      return logTask('copying non-page files', () => {
        return nonPageFiles.copy(batfishConfig);
      });
    })
    .then(() => {
      return logTask('writing static HTML', () => {
        return buildHtml(batfishConfig, cssFilename);
      });
    })
    .then(() => {
      if (
        !batfishConfig.production ||
        !batfishConfig.staticHtmlInlineDeferCss ||
        stylesheetsIsEmpty
      ) {
        return;
      }
      return logTask('inlining CSS in static HTML', () => {
        return inlineCssInHtml();
      });
    })
    .then(() => {
      if (!batfishConfig.sitemap || !batfishConfig.siteOrigin) return;
      return logTask('building sitemap', () => {
        return generateSitemap(batfishConfig);
      });
    })
    .then(() => {
      emitNotification(appendTaskTime('Finished build', buildStartTime));
      emitter.emit(constants.EVENT_DONE);
    })
    .catch(emitError);

  return emitter;
}

module.exports = build;
