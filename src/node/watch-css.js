// @flow
'use strict';

const _ = require('lodash');
const chokidar = require('chokidar');
const appendTaskTime = require('./append-task-time');
const compileStylesheets = require('./compile-stylesheets');
const now = require('./now');

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
    let startTime = now();
    compileStylesheets(batfishConfig).then(() => {
      if (onNotification !== undefined) {
        onNotification(appendTaskTime('CSS compiled', startTime));
      }
    }, onError);
  });
  cssWatcher.on('error', onError);
}

module.exports = watchCss;
