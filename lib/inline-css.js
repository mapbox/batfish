'use strict';

const spawn = require('child_process').spawn;
const path = require('path');
const globby = require('globby');
const os = require('os');
const _ = require('lodash');
const timelog = require('./timelog');

const cpuCount = os.cpus().length;
const workerPath = path.join(__dirname, '../lib/css-inlining-worker.js');

/**
 * Inline CSS in static HTML pages.
 *
 * The pages are divided up according to the number of cpus available,
 * then each group of pages is processed by a child process.
 *
 * @param {string} htmlRoot
 * @param {string} cssPath
 * @return {Promise<void>} - Resolves when all the inlining is complete.
 */
function inlineCss(htmlRoot, cssPath) {
  const processPagesGroup = htmlPaths => {
    return new Promise((resolve, reject) => {
      const worker = spawn('node', [workerPath, htmlPaths, cssPath]);
      worker.stdout.on('data', data => console.log(data.toString().trim()));
      worker.stderr.on('data', data => {
        reject(new Error(data.toString()));
      });
      worker.on('close', () => resolve());
    });
  };

  const pagesGlob = path.join(htmlRoot, '**/*.html');
  return globby(pagesGlob)
    .then(htmlPaths => {
      const chunkSize = Math.ceil(htmlPaths.length / cpuCount);
      const chunks = _.chunk(htmlPaths, chunkSize);
      timelog(
        `Inlining CSS in ${htmlPaths.length} files, with ${chunks.length} processes`
      );
      return Promise.all(chunks.map(processPagesGroup));
    })
    .then(() => timelog('Done inlining CSS'));
}

module.exports = inlineCss;
