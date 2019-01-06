// @flow
'use strict';

const chalk = require('chalk');
const EventEmitter = require('events');
const constants = require('./constants');
const validateConfig = require('./validate-config');
const compileStylesheets = require('./compile-stylesheets');
const watchCss = require('./watch-css');
const watchWebpack = require('./watch-webpack');
const maybeClearOutputDirectory = require('./maybe-clear-output-directory');
const serverInitMessage = require('./server-init-message');
const devServer = require('./dev-server');
const nonPageFiles = require('./non-page-files');
const { getPort, portInUsageMessages } = require('./get-port');

function start(rawConfig?: Object, projectDirectory?: string): EventEmitter {
  rawConfig = rawConfig || {};
  const emitter = new EventEmitter();
  const emitError = (error: Error) => {
    emitter.emit(constants.EVENT_ERROR, error);
  };
  const emitNotification = (...messages: string[]) => {
    messages.forEach((message) =>
      emitter.emit(constants.EVENT_NOTIFICATION, message)
    );
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

  const checkPort = getPort(batfishConfig.port).then((actualPort) => {
    if (actualPort === batfishConfig.port) {
      return actualPort;
    }
    return portInUsageMessages(batfishConfig.port).then((messages) => {
      emitNotification(...messages);
      return actualPort;
    });
  });

  maybeClearOutputDirectory(batfishConfig)
    .then(() => {
      emitNotification('Starting the development server.');
      emitNotification(chalk.yellow.bold('Wait ...'));

      return Promise.all([
        checkPort,
        compileStylesheets(batfishConfig).catch(emitError),
        nonPageFiles.copy(batfishConfig)
      ]);
    })
    .then(([actualPort]) => {
      devServer(batfishConfig, actualPort);

      watchCss(batfishConfig, {
        onError: emitError,
        onNotification: emitNotification
      });

      nonPageFiles.watch(batfishConfig, {
        onError: emitError,
        onNotification: emitNotification
      });

      watchWebpack(batfishConfig, {
        onFirstCompile: () => {
          emitNotification(serverInitMessage(batfishConfig, actualPort));
        },
        onNotification: emitNotification,
        onError: emitError
      });
    })
    .catch(emitError);

  return emitter;
}

module.exports = start;
