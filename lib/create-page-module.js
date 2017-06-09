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
 * @param {BatfishConfig} batfishConfig
 * @param {Object} pagesData
 * @param {string} pagePath
 * @return {Promise<string>} - Resolves with the absolute path to the
 *   written module.
 */
function createPageModule(batfishConfig, pagesData, pagePath) {
  const pageFileName = pagePath === '/'
    ? '_.js'
    : pagePath.slice(0, -1).replace(/\//g, '_') + '.js';
  const filePath = path.join(batfishConfig.temporaryDirectory, pageFileName);

  const pagesDataArray = _.values(pagesData);
  const page = pagesData[pagePath];
  const data = Object.assign({}, page.data);
  const dataInjector = _.get(batfishConfig, ['injectData', page.path]);
  if (dataInjector) {
    Object.assign(data, dataInjector({ pages: pagesDataArray }));
  }

  const content = `module.exports = {
    component: require('${page.filePath}'),
    data: ${JSON.stringify(data)}
  }`;
  const prettyContent = prettier.format(content, { singleQuote: true });

  return pify(fs.writeFile)(filePath, prettyContent).then(() => filePath);
}

module.exports = createPageModule;
