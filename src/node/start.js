// @flow
'use strict';

const chalk = require('chalk');
const EventEmitter = require('events');
const historyApiFallback = require('connect-history-api-fallback');
const constants = require('./constants');
const validateConfig = require('./validate-config');
const compileStylesheets = require('./compile-stylesheets');
const joinUrlParts = require('./join-url-parts');
const watchCss = require('./watch-css');
const watchWebpack = require('./watch-webpack');
const createServer = require('./create-server');
const maybeClearOutputDirectory = require('./maybe-clear-output-directory');

function start(rawConfig?: Object, projectDirectory?: string): EventEmitter {
  rawConfig = rawConfig || {};
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
  } catch (configError) {
    // setImmediate allows us to return the emitter before emitting the error.
    setImmediate(() => {
      emitError(configError);
    });
    return emitter;
  }

  const serveAssetsDir = joinUrlParts(
    batfishConfig.siteBasePath,
    batfishConfig.publicAssetsPath
  );
  // This allows us to serve static files within the pages directory.
  const servePagesDir = batfishConfig.siteBasePath;

  const server = createServer({
    onError: emitError,
    browserSyncOptions: {
      port: batfishConfig.port,
      server: {
        baseDir: batfishConfig.outputDirectory,
        routes: {
          [serveAssetsDir]: batfishConfig.outputDirectory,
          [servePagesDir]: batfishConfig.pagesDirectory
        },
        middleware: [historyApiFallback()]
      },
      notify: false,
      open: false,
      logLevel: 'silent',
      reloadDebounce: 500,
      offline: true,
      injectChanges: true
    }
  });

  maybeClearOutputDirectory(batfishConfig)
    .then(() => {
      emitNotification('Starting the development server.');
      emitNotification(chalk.yellow.bold('Wait ...'));
    })
    .then(() => compileStylesheets(batfishConfig).catch(emitError))
    .then(() => {
      server.start();
      watchCss(batfishConfig, {
        onError: emitError,
        afterCompilation: compiledFilename => {
          emitNotification('CSS finished compiling.');
          server.reload(compiledFilename);
        }
      });
      const webpackWatcher = watchWebpack(batfishConfig, server);
      webpackWatcher.on(constants.EVENT_NOTIFICATION, emitNotification);
      webpackWatcher.on(constants.EVENT_ERROR, emitError);
    })
    .catch(emitError);

  return emitter;
}

module.exports = start;
