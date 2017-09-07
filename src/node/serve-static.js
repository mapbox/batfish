// @flow
'use strict';

const EventEmitter = require('events');
const validateConfig = require('./validate-config');
const serverInitMessage = require('./server-init-message');
const constants = require('./constants');
const createServer = require('./create-server');

function serveStatic(
  rawConfig?: Object,
  projectDirectory?: string
): EventEmitter {
  rawConfig = rawConfig || {};
  const emitter = new EventEmitter();
  const emitError = error => {
    emitter.emit(constants.EVENT_ERROR, error);
  };
  const emitNotification = message => {
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

  const realUrlMiddleware = (req: { url: string }, res, next: Function) => {
    if (req.url.startsWith(batfishConfig.siteBasePath)) {
      req.url = req.url.replace(batfishConfig.siteBasePath, '') || '/';
    }
    next();
  };

  const server = createServer({
    onError: emitError,
    browserSyncOptions: {
      port: batfishConfig.port,
      server: {
        baseDir: batfishConfig.outputDirectory,
        middleware: [realUrlMiddleware]
      },
      notify: false,
      open: false,
      logLevel: 'silent',
      offline: true
    }
  });
  server.browserSyncInstance.emitter.on('init', () => {
    emitNotification(
      serverInitMessage(server.browserSyncInstance, batfishConfig)
    );
  });
  server.start();

  return emitter;
}

module.exports = serveStatic;
