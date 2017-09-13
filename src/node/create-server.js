// @flow
'use strict';

const browserSync = require('browser-sync');
const getPort = require('get-port');

function createServer(options: {
  browserSyncOptions: Object,
  onError: Error => any
}): BatfishServer {
  const browserSyncInstance = browserSync.create();
  browserSyncInstance.emitter.on('error', options.onError);

  const start = () => {
    getPort(options.browserSyncOptions.port)
      .then(availablePort => {
        browserSyncInstance.init(
          Object.assign({}, options.browserSyncOptions, {
            port: availablePort
          })
        );
      })
      .catch(options.onError);
  };

  const reload = (filename?: string) => {
    browserSyncInstance.reload(filename);
  };

  const server = {
    start,
    reload,
    browserSyncInstance
  };

  return server;
}

module.exports = createServer;
