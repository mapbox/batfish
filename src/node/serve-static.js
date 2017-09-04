// @flow
'use strict';

const getPort = require('get-port');
const browserSync = require('browser-sync');
const EventEmitter = require('events');
const validateConfig = require('./validate-config');
const serverInitMessage = require('./server-init-message');
const constants = require('./constants');

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

  const server = browserSync.create();
  server.emitter.on('error', emitError);

  const realUrlMiddleware = (req: { url: string }, res, next: Function) => {
    if (req.url.startsWith(batfishConfig.siteBasePath)) {
      req.url = req.url.replace(batfishConfig.siteBasePath, '') || '/';
    }
    next();
  };

  getPort(batfishConfig.port)
    .then(availablePort => {
      server.emitter.on('init', instance => {
        emitNotification(serverInitMessage(instance, batfishConfig));
      });
      server.init({
        port: availablePort,
        server: {
          baseDir: batfishConfig.outputDirectory,
          middleware: [realUrlMiddleware]
        },
        notify: false,
        open: false,
        logLevel: 'silent',
        offline: true
      });
    })
    .catch(emitError);

  return emitter;
}

module.exports = serveStatic;
