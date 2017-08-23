'use strict';

const path = require('path');
const globby = require('globby');
const workerFarm = require('worker-farm');
const batfishLog = require('./batfish-log');
const workers = workerFarm(require.resolve('./css-inlining-worker'));
const handlePostcssError = require('./handle-postcss-error');

/**
 * Inline CSS in static HTML pages.
 *
 * The pages are divided up according to the number of cpus available,
 * then each group of pages is processed by a child process.
 *
 * @param {string} htmlRoot
 * @param {string} cssPath
 * @param {Object} [options]
 * @param {boolean} [verbose=false]
 * @return {Promise<void>} - Resolves when all the inlining is complete.
 */
function inlineCss(htmlRoot, cssPath, options) {
  options = Object.assign(
    {
      verbose: false
    },
    options
  );

  let totalHtmlFiles = 1;
  let processesStarted = 0;
  // Accumulate errors and log them all at the end.
  const errors = [];
  const processPage = htmlPath => {
    processesStarted += 1;
    const isLastChunk = processesStarted === totalHtmlFiles;
    return new Promise(resolve => {
      if (options.verbose) {
        batfishLog.log(`Starting to inline CSS for ${htmlPath}`);
      }
      workers(htmlPath, cssPath, (error, output) => {
        if (isLastChunk) {
          workerFarm.end(workers);
        }
        if (error) {
          errors.push(error);
        }
        if (output && options.verbose) {
          console.log(output);
        }
        if (options.verbose) {
          batfishLog.log(`Successfully inlined CSS for ${htmlPath}`);
        }
        resolve();
      });
    });
  };

  const pagesGlob = path.join(htmlRoot, '**/*.html');
  return globby(pagesGlob)
    .then(htmlPaths => {
      totalHtmlFiles = htmlPaths.length;
      batfishLog.log(`Inlining CSS in ${htmlPaths.length} files`);
      return Promise.all(htmlPaths.map(processPage));
    })
    .then(() => {
      if (errors.length) {
        errors.forEach(error => {
          if (error.name === 'CssSyntaxError') {
            handlePostcssError(error);
          } else {
            console.error(error.message);
          }
        });
        throw new Error('Errors while inlining CSS');
      } else {
        batfishLog.log('Done inlining CSS');
      }
    });
}

module.exports = inlineCss;
