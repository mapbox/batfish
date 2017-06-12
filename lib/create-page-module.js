'use strict';

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const pify = require('pify');
const prettier = require('prettier');

/**
 * Create a module for a page, which will be written to the file system.
 * It requires the page's component and includes the page's injected data.
 * This is the module that will by built into an async bundle by Webpack,
 * loaded when the page is requested by Router.
 *
 * @param {Object} options
 * @param {BatfishConfig} options.batfishConfig
 * @param {Object} options.siteData
 * @param {{ filePath: string, path: string, data: Object }} options.pageData
 * @return {Promise<string>} - Resolves with the absolute path to the
 *   written module.
 */
function createPageModule(options) {
  const pageFileName = options.pageData.path === '/'
    ? '_.js'
    : options.pageData.path.slice(0, -1).replace(/\//g, '_') + '.js';
  const filePath = path.join(
    options.batfishConfig.temporaryDirectory,
    pageFileName
  );

  const pageFrontMatter = options.pageData.data;
  const props = _.omit(pageFrontMatter, ['siteData']);

  if (pageFrontMatter.siteData) {
    props.siteData = {};
    pageFrontMatter.siteData.forEach(selectorName => {
      // If the selector name corresponds directly with a site data property,
      // simply provide the value.
      if (options.siteData[selectorName]) {
        props.siteData[selectorName] = options.siteData[selectorName];
        return;
      }

      // Otherwise, it must be a function that selects data.
      const selector = _.get(options.batfishConfig, [
        'dataSelectors',
        selectorName
      ]);
      if (!selector) {
        throw new Error(
          `There is no data or data selector named "${selectorName}"`
        );
      }
      props.siteData[selectorName] = selector(options.siteData);
    });
  }

  const content = `module.exports = {
    component: require('${options.pageData.filePath}'),
    props: ${JSON.stringify(props)}
  }`;
  const prettyContent = prettier.format(content, { singleQuote: true });

  return pify(fs.writeFile)(filePath, prettyContent).then(() => filePath);
}

module.exports = createPageModule;
