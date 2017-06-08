'use strict';

const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
const getPageData = require('./get-page-data');

/**
 * Create a module that can be used during Webpack compilation,
 * exposing important things about pages.
 *
 * **This code should be synchronous.** It will run once before Webpack begins work.
 *
 * @param {BatfishConfig} batfishConfig
 * @return {string} - The absolute path to the written module file.
 */
function createBatfishContext(batfishConfig) {
  const pageData = getPageData({
    sourceDirectory: batfishConfig.sourceDirectory
  });

  const stringifiedData = JSON.stringify(pageData);

  const stringifiedRoutesData = pageData.map(page => {
    return `{
      path: '${page.route}',
      pathRegExp: /^${page.route.replace(/\//g, '[\\/]')}?$/,
      getModule: () => import('${page.filePath}')
    }`;
  });
  const stringifiedRoutes = `[${stringifiedRoutesData.join(',')}]`;

  const filePath = path.join(__dirname, '../tmp/batfish-context.js');
  const content = `module.exports = {
    pageData: ${stringifiedData},
    routesData: ${stringifiedRoutes}
  };`;
  const prettyContent = prettier.format(content, {
    singleQuote: true
  });
  fs.writeFileSync(filePath, prettyContent);
  return filePath;
}

module.exports = createBatfishContext;
