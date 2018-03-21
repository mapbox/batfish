// @flow
'use strict';

const EventEmitter = require('events');
const connect = require('connect');
const http = require('http');
const getPort = require('get-port');
const validateConfig = require('./validate-config');
const getPagesData = require('./get-pages-data');
const constants = require('./constants');
const staticServerMiddleware = require('./server-middleware/static-server-middleware');
const serverInitMessage = require('./server-init-message');

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

  Promise.all([getPagesData(batfishConfig), getPort(batfishConfig.port)])
    .then(([pagesData, actualPort]) => {
      const app = connect();
      staticServerMiddleware(batfishConfig, pagesData).forEach(middleware => {
        app.use(middleware);
      });
      http.createServer(app).listen(actualPort);
      emitNotification(serverInitMessage(batfishConfig, actualPort));
    })
    .catch(emitError);

  return emitter;
}

module.exports = serveStatic;
