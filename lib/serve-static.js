'use strict';

const getPort = require('get-port');
const browserSync = require('browser-sync');
const EventEmitter = require('eventemitter3');
const validateConfig = require('./validate-config');
const serverInitMessage = require('./server-init-message');

/**
 * Serve the directory of HTML files.
 *
 * @param {Object} [rawConfig={}]
 * @param {string} [projectDirectory]
 */
function serveStatic(rawConfig, projectDirectory) {
  rawConfig = rawConfig || {};
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

  const server = browserSync.create();
  server.emitter.on('error', emitError);

  const realUrlMiddleware = (req, res, next) => {
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
