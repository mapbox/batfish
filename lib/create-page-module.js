'use strict';

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const pify = require('pify');
const prettier = require('prettier');

/**
 * Create a JS module for a page, which will be written to the file system.
 * It requires the page's component and includes the page's injected data.
 * This is the module that will by built into an async bundle by Webpack,
 * loaded when the page is requested by Router.
 *
 * @param {Object} options
 * @param {BatfishConfig} options.batfishConfig
 * @param {Object} options.siteData - Build-time data, e.g. all pages' front matter.
 * @param {Object} options.pageData
 * @return {Promise<string>} - Resolves with the absolute path to the
 *   written module.
 */
function createPageModule(options) {
  const pageFileName =
    options.pageData.path === '/'
      ? '_.js'
      : options.pageData.path.slice(0, -1).replace(/\//g, '_') + '.js';
  const filePath = path.join(
    options.batfishConfig.temporaryDirectory,
    pageFileName
  );

  const pageFrontMatter = options.pageData.frontMatter;
  const props = {
    frontMatter: _.omit(pageFrontMatter, ['injectedData'])
  };

  if (pageFrontMatter && pageFrontMatter.injectedData) {
    props.injectedData = {};
    pageFrontMatter.injectedData.forEach(selectorName => {
      const selector = _.get(options.batfishConfig, [
        'dataSelectors',
        selectorName
      ]);
      if (!selector) {
        throw new Error(`There is no data selector named "${selectorName}"`);
      }
      props.injectedData[selectorName] = selector(options.siteData);
    });
  }

  const content = `
    let Page = require('${options.pageData.filePath}');
    Page = Page.default || Page;
    module.exports = {
      component: Page,
      props: ${JSON.stringify(props, null, 2)}
    };
  `;
  // Make it easier to read the files for debugging.
  const prettyContent = prettier.format(content);

  return pify(fs.writeFile)(filePath, prettyContent).then(() => filePath);
}

module.exports = createPageModule;
