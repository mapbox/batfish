// @flow
'use strict';

const path = require('path');
const globby = require('globby');
const EventEmitter = require('events');
const workerFarm = require('worker-farm');
const workers = workerFarm(require.resolve('./inline-css-worker'));
const wrapError = require('./wrap-error');
const errorTypes = require('./error-types');
const constants = require('./constants');

// When errors emerge from the worker farm, they retain their name but lose
// their type.
function reTypeError(error: *): Error {
  if (error.name === 'CssCompilationError') {
    return wrapError(error, errorTypes.CssCompilationError, {
      originalError: error.originalError
    });
  }
  return error;
}

// Inline CSS in static HTML pages.
//
// The pages are divided up according to the number of cpus available,
// then each group of pages is processed by a child process.
//
// Returned Promise resolves when all the inlining is complete.
function inlineCss(
  htmlRoot: string,
  cssPath: string,
  options?: { verbose?: boolean }
): EventEmitter {
  const defaultedOptions = Object.assign(
    {
      verbose: false
    },
    options
  );
  const emitter = new EventEmitter();
  const emitNotification = message => {
    emitter.emit(constants.EVENT_NOTIFICATION, message);
  };

  // This number is determined below, after the glob is analyzed.
  let totalHtmlFiles;
  let processesStarted = 0;
  // Accumulate errors and log them all at the end.
  const processPage = (htmlPath: string): Promise<void> => {
    processesStarted += 1;
    const isLastChunk = processesStarted === totalHtmlFiles;
    return new Promise((resolve, reject) => {
      if (defaultedOptions.verbose) {
        emitNotification(`Inline CSS for ${htmlPath}.`);
      }
      workers(htmlPath, cssPath, (error: Error, output: string) => {
        if (isLastChunk) {
          workerFarm.end(workers);
        }
        if (error) {
          return reject(error);
        }
        if (output && defaultedOptions.verbose) {
          emitNotification(output);
        }
        resolve();
      });
    });
  };

  const pagesGlob = path.join(htmlRoot, '**/*.html');
  globby(pagesGlob)
    .then(htmlPaths => {
      totalHtmlFiles = htmlPaths.length;
      emitNotification(`Inlining CSS in ${htmlPaths.length} files.`);
      return Promise.all(htmlPaths.map(processPage));
    })
    .then(() => {
      emitter.emit('done');
    })
    .catch(error => {
      emitter.emit('error', reTypeError(error));
    });

  return emitter;
}

module.exports = inlineCss;
