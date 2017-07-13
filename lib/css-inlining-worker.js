'use strict';

// Used as a worker process.

const fs = require('fs');
const pify = require('pify');
const csso = require('csso');
const postcss = require('postcss');
const postcssHtmlFilter = require('@mapbox/postcss-html-filter');
const constants = require('./constants');

// Received from the parent process
const htmlPaths = process.argv[2].split(',');
const cssPaths = JSON.parse(process.argv[3]);

function concatCss() {
  const mainCss = fs.readFileSync(cssPaths[0], 'utf8');
  return Promise.all(
    cssPaths.map(cssPath => {
      return pify(fs.readFile)(cssPath, 'utf8');
    })
  ).then(pageSpecificCsses => {
    return [mainCss].concat(pageSpecificCsses).join('\n');
  });
}

function inlineCss(htmlPath) {
  return concatCss()
    .then(allCss => {
      return pify(fs.readFile)(htmlPath, 'utf8').then(html => {
        return postcss()
          .use(postcssHtmlFilter({ html }))
          .process(allCss)
          .then(result => result.css)
          .then(cleanedCss => {
            const optimizedCss = csso.minify(cleanedCss).css;
            return html.replace(
              constants.INLINE_CSS_MARKER,
              `<style>${optimizedCss}</style>`
            );
          });
      });
    })
    .then(html => {
      return pify(fs.writeFile)(htmlPath, html);
    });
}

Promise.all(htmlPaths.map(inlineCss)).catch(error =>
  console.error(error.stack)
);
