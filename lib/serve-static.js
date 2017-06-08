'use strict';

const _ = require('lodash');
const getPort = require('get-port');
const browserSync = require('browser-sync');

/**
 * Serve the directory of statically built files.
 *
 * @param {Object} options
 * @param {string} options.directory
 * @param {number} [options.port=8080]
 */
function serveStatic(options) {
  _.defaults(options, {
    port: 8080
  });

  const bsServer = browserSync.create();
  getPort(options.port).then(availablePort => {
    bsServer.init({
      port: availablePort,
      server: {
        baseDir: options.directory
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
