'use strict';

const _ = require('lodash');
const dedent = require('dedent');
const fs = require('fs');
const pify = require('pify');
const csso = require('csso');
const postcss = require('postcss');
const postcssHtmlFilter = require('@mapbox/postcss-html-filter');
const constants = require('./constants');

/**
 * A worker script invoked by inline-css.js
 *
 * @param {string} htmlPath
 * @param {string} cssPath
 * @param {Function} callback
 */
function cssInliningWorker(htmlPath, cssPath, callback) {
  function createHelpfulCssoErrorMessage(cssoError) {
    return dedent`
      Error while minifying CSS for ${htmlPath}.
      Check the following:

      ${cssoError.source.slice(cssoError.offset - 20, cssoError.offset + 20)}
      ${_.repeat(' ', 19)}^

    `;
  }

  pify(fs.readFile)(cssPath, 'utf8')
    .then(css => {
      return pify(fs.readFile)(htmlPath, 'utf8').then(html => {
        return postcss()
          .use(postcssHtmlFilter({ html }))
          .process(css, {
            from: cssPath,
            to: cssPath
          })
          .then(result => {
            let optimizedCss;
            try {
              optimizedCss = csso.minify(result.css).css;
            } catch (cssoError) {
              if (cssoError.name === 'CssSyntaxError') {
                cssoError.message = createHelpfulCssoErrorMessage(cssoError);
              }
              throw cssoError;
            }
            return html.replace(
              constants.INLINE_CSS_MARKER,
              `<style>${optimizedCss}</style>`
            );
          });
      });
    })
    .then(html => pify(fs.writeFile)(htmlPath, html))
    .then(() => callback(), callback);
}

module.exports = cssInliningWorker;
