// @flow
'use strict';

const _ = require('lodash');
const chokidar = require('chokidar');
const prettyMs = require('pretty-ms');
const compileStylesheets = require('./compile-stylesheets');

function watchCss(
  batfishConfig: BatfishConfiguration,
  options: {
    onError: Error => void,
    onNotification?: string => void
  }
) {
  const { onError, onNotification } = options;
  if (_.isEmpty(batfishConfig.stylesheets)) return;

  const cssWatcher = chokidar.watch(batfishConfig.stylesheets);
  cssWatcher.on('change', () => {
    let startTime = Date.now();
    compileStylesheets(batfishConfig).then(() => {
      if (onNotification !== undefined) {
        onNotification(`CSS compiled in ${prettyMs(Date.now() - startTime)}.`);
      }
    }, onError);
  });
  cssWatcher.on('error', onError);
}

module.exports = watchCss;
