'use strict';

const getPort = require('get-port');
const browserSync = require('browser-sync');
const validateConfig = require('./validate-config');
const logServerInit = require('./log-server-init');

/**
 * Serve the directory of static files.
 *
 * @param {Object} rawConfig
 */
function serveStatic(rawConfig) {
  const batfishConfig = validateConfig(rawConfig);
  const server = browserSync.create();

  const realUrlMiddleware = (req, res, next) => {
    if (req.url.startsWith(batfishConfig.siteBasePath)) {
      req.url = req.url.replace(batfishConfig.siteBasePath, '') || '/';
    }
    next();
  };

  getPort(batfishConfig.port).then(availablePort => {
    server.emitter.on('init', instance => {
      logServerInit(instance, batfishConfig);
    });
    server.init({
      port: availablePort,
      server: {
        baseDir: batfishConfig.outputDirectory,
        middleware: [realUrlMiddleware]
      },
      notify: false,
      open: false,
      logLevel: 'silent'
    });

    process.on('SIGINT', () => {
      server.exit();
      process.exit();
    });
  });
}

module.exports = serveStatic;
