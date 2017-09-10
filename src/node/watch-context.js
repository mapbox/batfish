// @flow
'use strict';

const path = require('path');
const chokidar = require('chokidar');
const writeContextModule = require('./write-context-module');

// Rebuild the context module when there are changes that would require that.
function watchContext(
  batfishConfig: BatfishConfiguration,
  options: {
    onError: Error => any,
    afterCompilation: () => any
  }
) {
  const pageGlob = path.join(batfishConfig.pagesDirectory, './**/*.{js,md}');
  const pageWatcher = chokidar.watch(pageGlob);
  const rebuildPages = () => {
    writeContextModule(batfishConfig)
      .then(() => {
        options.afterCompilation();
      })
      .catch(options.onError);
  };
  pageWatcher.on('change', rebuildPages);
  pageWatcher.on('unlink', rebuildPages);
  pageWatcher.on('error', options.onError);
}

module.exports = watchContext;
