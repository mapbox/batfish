'use strict';

const path = require('path');
const globby = require('globby');
const EventEmitter = require('events');
const workerFarm = require('worker-farm');
const workers = workerFarm(require.resolve('./inline-css-worker'));
const wrapError = require('./wrap-error');
const errorTypes = require('./error-types');

// When errors emerge from the worker farm, they retain their name but lose
// their type.
function reTypeError(error) {
  if (error.name === 'CssMinificationError') {
    return wrapError(error, errorTypes.CssMinificationError, {
      originalError: error.originalError,
      source: error.source
    });
  }
  if (error.name === 'CssCompilationError') {
    return wrapError(error, errorTypes.CssCompilationError, {
      originalError: error.originalError
    });
  }
  return error;
}

/**
 * Inline CSS in static HTML pages.
 *
 * The pages are divided up according to the number of cpus available,
 * then each group of pages is processed by a child process.
 *
 * @param {string} htmlRoot
 * @param {string} cssPath
 * @param {Object} [options]
 * @param {boolean} [options.verbose=false]
 * @return {Promise<void>} - Resolves when all the inlining is complete.
 */
function inlineCss(htmlRoot, cssPath, options) {
  options = Object.assign(
    {
      verbose: false
    },
    options
  );
  const emitter = new EventEmitter();
  const emitNotification = message => {
    emitter.emit('notification', message);
  };

  // This number is determined below, after the glob is analyzed.
  let totalHtmlFiles;
  let processesStarted = 0;
  // Accumulate errors and log them all at the end.
  const processPage = htmlPath => {
    processesStarted += 1;
    const isLastChunk = processesStarted === totalHtmlFiles;
    return new Promise((resolve, reject) => {
      if (options.verbose) {
        emitNotification(`Inline CSS for ${htmlPath}.`);
      }
      workers(htmlPath, cssPath, (error, output) => {
        if (isLastChunk) {
          workerFarm.end(workers);
        }
        if (error) {
          return reject(error);
        }
        if (output && options.verbose) {
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
