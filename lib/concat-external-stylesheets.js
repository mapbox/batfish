'use strict';

const got = require('got');
const path = require('path');
const fs = require('fs');
const pify = require('pify');
const postcss = require('postcss');
const postcssAbsoluteUrls = require('./postcss-absolute-urls');

/**
 * Fetch and concatenate external stylesheets.
 *
 * @param {BatfishConfig} batfishConfig
 * @return {Promise<string>} - Resolves with the absolute path to the written file.
 */
function concatExternalStylesheets(batfishConfig) {
  const filePath = path.join(
    batfishConfig.temporaryDirectory,
    'external-stylesheets.css'
  );

  const getStylesheet = url => {
    return got(url)
      .then(response => {
        const css = response.body;
        return postcss()
          .use(postcssAbsoluteUrls({ stylesheetUrl: url }))
          .process(css);
      })
      .then(result => result.css);
  };

  // Ensure the stylesheets are concatenated in the order specified.
  const stylesheetContents = [];
  return Promise.all(
    batfishConfig.externalStylesheets.map((url, i) => {
      return getStylesheet(url).then(css => (stylesheetContents[i] = css));
    })
  )
    .then(() => pify(fs.writeFile)(filePath, stylesheetContents.join('\n')))
    .then(() => filePath);
}

module.exports = concatExternalStylesheets;
