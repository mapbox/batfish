// @flow
'use strict';

const _ = require('lodash');
const chokidar = require('chokidar');
const compileStylesheets = require('./compile-stylesheets');

function watchCss(
  batfishConfig: BatfishConfiguration,
  options: {
    onError: (error: Error) => any,
    afterCompilation?: (string | void) => any
  }
) {
  if (_.isEmpty(batfishConfig.stylesheets)) return;

  const cssWatcher = chokidar.watch(batfishConfig.stylesheets);
  cssWatcher.on('change', () => {
    compileStylesheets(batfishConfig)
      .then(compiledFilename => {
        if (options.afterCompilation) {
          options.afterCompilation(compiledFilename);
        }
      })
      .catch(options.onError);
  });
  cssWatcher.on('error', options.onError);
}

module.exports = watchCss;
