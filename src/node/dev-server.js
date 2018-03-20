// @flow
'use strict';

const liveServer = require('live-server');
const startMiddleware = require('./server-middleware/start-middleware');

module.exports = function startServer(
  batfishConfig: BatfishConfiguration,
  actualPort: number
): Object {
  const server = liveServer.start({
    port: actualPort,
    root: batfishConfig.outputDirectory,
    logLevel: 0,
    open: false,
    wait: 300,
    middleware: startMiddleware(batfishConfig)
  });
  return server;
};
