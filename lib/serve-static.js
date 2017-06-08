'use strict';

const getPort = require('get-port');
const browserSync = require('browser-sync');

/**
 * Serve the directory of statically built files.
 *
 * @param {BatfishConfig} batfishConfig
 */
function serveStatic(batfishConfig) {
  const bsServer = browserSync.create();
  getPort(batfishConfig.port || 8080).then(availablePort => {
    bsServer.init({
      port: availablePort,
      server: {
        baseDir: batfishConfig.outputDirectory
      },
      open: false,
      notify: false
    });

    process.on('SIGINT', () => {
      bsServer.exit();
      process.exit();
    });
  });
}

module.exports = serveStatic;
