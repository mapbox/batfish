'use strict';

// Used as a worker process.

const fs = require('fs');
const pify = require('pify');
const cheerioUncss = require('./cheerio-uncss');
const constants = require('./constants');

// Received from the parent process
const htmlPaths = process.argv[2].split(',');
const cssPath = process.argv[3];

const allCss = fs.readFileSync(cssPath, 'utf8');

function inlineCss(htmlPath) {
  return pify(fs.readFile)(htmlPath, 'utf8')
    .then(html => {
      return cheerioUncss(html, allCss).then(cleanedCss => {
        return html.replace(
          constants.INLINE_CSS_MARKER,
          `<style>${cleanedCss}</style>`
        );
      });
    })
    .then(html => {
      return pify(fs.writeFile)(htmlPath, html);
    });
}

Promise.all(htmlPaths.map(inlineCss)).catch(error =>
  console.error(error.stack)
);
