// @flow
'use strict';

const chokidar = require('chokidar');
const writeContextModule = require('./write-context-module');
const constants = require('./constants');

// Rebuild the context module when there are changes that would require that.
function watchContext(
  batfishConfig: BatfishConfiguration,
  options: {
    onError: Error => any,
    afterCompilation: () => any
  }
) {
  const pageWatcher = chokidar.watch(`**/*.${constants.PAGE_EXT_GLOB}`, {
    ignoreInitial: true,
    cwd: batfishConfig.pagesDirectory
  });
  const rebuildPages = () => {
    writeContextModule(batfishConfig).then(() => {
      options.afterCompilation();
    }, options.onError);
  };
  pageWatcher.on('change', rebuildPages);
  pageWatcher.on('unlink', rebuildPages);
  pageWatcher.on('add', rebuildPages);
  pageWatcher.on('error', options.onError);
}

module.exports = watchContext;
