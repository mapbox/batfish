'use strict';

const getPort = require('get-port');
const browserSync = require('browser-sync');
const validateConfig = require('./validate-config');

/**
 * Serve the directory of static files.
 *
 * @param {Object} rawConfig
 */
function serveStatic(rawConfig) {
  const batfishConfig = validateConfig(rawConfig);

  const bsServer = browserSync.create();
  getPort(batfishConfig.port).then(availablePort => {
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
