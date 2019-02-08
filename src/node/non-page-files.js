// @flow
'use strict';

const cpy = require('cpy');
const del = require('del');
const chokidar = require('chokidar');
const appendTaskTime = require('./append-task-time');
const now = require('./now');

function getNonPageFileGlob(
  batfishConfig: BatfishConfiguration
): Array<string> {
  // Don't copy pages files, which are already incorporated into
  // the build in other ways.
  let glob = ['**/*.*', '!*.js', '!*.md'];
  // Copy unprocessed page files directly, unless they are ignored.
  if (batfishConfig.unprocessedPageFiles !== undefined) {
    glob = glob.concat(batfishConfig.unprocessedPageFiles);
  }
  const ignoreGlob = !batfishConfig.ignoreWithinPagesDirectory
    ? []
    : batfishConfig.ignoreWithinPagesDirectory.map((g) => `!${g}`);
  glob = glob.concat(ignoreGlob);
  return glob;
}

function copy(batfishConfig: BatfishConfiguration): Promise<void> {
  const nonPageFileGlob = getNonPageFileGlob(batfishConfig);
  return cpy(nonPageFileGlob, batfishConfig.outputDirectory, {
    cwd: batfishConfig.pagesDirectory,
    parents: true
  });
}

function watch(
  batfishConfig: BatfishConfiguration,
  options: {
    onError: (Error) => void,
    onNotification?: (string) => void
  }
): void {
  const { onError, onNotification } = options;

  const nonPageFileGlob = getNonPageFileGlob(batfishConfig);

  const watcher = chokidar.watch(nonPageFileGlob, {
    ignoreInitial: true,
    cwd: batfishConfig.pagesDirectory
  });

  const handleChangeAdd = (filename) => {
    const startTime = now();
    cpy(filename, batfishConfig.outputDirectory, {
      parents: true,
      cwd: batfishConfig.pagesDirectory
    }).then(() => {
      if (onNotification !== undefined) {
        onNotification(appendTaskTime(`${filename} copied`, startTime));
      }
    }, onError);
  };

  const handleUnlink = (filename) => {
    const startTime = now();
    del(filename, { cwd: batfishConfig.outputDirectory }).then(() => {
      if (onNotification !== undefined) {
        onNotification(appendTaskTime(`${filename} deleted`, startTime));
      }
    }, onError);
  };

  watcher.on('change', handleChangeAdd);
  watcher.on('add', handleChangeAdd);
  watcher.on('unlink', handleUnlink);
  watcher.on('error', onError);
}

module.exports = { copy, watch };
