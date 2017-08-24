'use strict';

const fs = require('fs');
const pify = require('pify');
const postcss = require('postcss');
const postcssCsso = require('postcss-csso');
const postcssHtmlFilter = require('@mapbox/postcss-html-filter');
const constants = require('./constants');
const rethrowPostcssError = require('./rethrow-postcss-error');

/**
 * A worker script invoked by inline-css.js
 *
 * @param {string} htmlPath
 * @param {string} cssPath
 * @param {Function} callback
 */
function inlineCssWorker(htmlPath, cssPath, callback) {
  return Promise.all([
    pify(fs.readFile)(cssPath, 'utf8'),
    pify(fs.readFile)(htmlPath, 'utf8')
  ])
    .then(data => {
      const css = data[0];
      const html = data[1];
      return postcss()
        .use(postcssHtmlFilter({ html }))
        .use(postcssCsso())
        .process(css, { from: cssPath, to: cssPath })
        .catch(rethrowPostcssError)
        .then(result => {
          return html.replace(
            constants.INLINE_CSS_MARKER,
            `<style>${result.css}</style>`
          );
        });
    })
    .then(htmlWithCss => pify(fs.writeFile)(htmlPath, htmlWithCss))
    .then(() => callback(), error => callback(error));
}

module.exports = inlineCssWorker;
