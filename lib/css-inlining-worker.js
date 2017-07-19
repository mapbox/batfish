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
const cssPath = process.argv[3];

function inlineCss(htmlPath) {
  return pify(fs.readFile)(cssPath, 'utf8')
    .then(css => {
      return pify(fs.readFile)(htmlPath, 'utf8').then(html => {
        return postcss()
          .use(postcssHtmlFilter({ html }))
          .process(css)
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
