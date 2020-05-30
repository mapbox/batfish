// @flow
'use strict';

const path = require('path');
const browserSync = require('browser-sync');
const startMiddleware = require('./server-middleware/start-middleware');

module.exports = function startServer(
  batfishConfig: BatfishConfiguration,
  actualPort: number
): Promise<Object> {
  return new Promise((resolve, reject) => {
    const bs = browserSync.create();
    const server = bs.init(
      {
        port: actualPort,
        server: {
          baseDir: batfishConfig.outputDirectory,
        },
        files: [path.join(batfishConfig.outputDirectory, '**/*.*')],
        middleware: startMiddleware(batfishConfig),
        logLevel: 'silent',
        open: false,
        notify: false,
        offline: true,
        reloadDebounce: 500,
        injectChanges: true,
      },
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(server);
        }
      }
    );
  });
};
