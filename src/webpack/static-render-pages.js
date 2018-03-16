// @flow

// **WARNING**
// This file gets compiled by Webpack before it is executed.
// So when it is executed, the __dirname will be {outputDirectory}/assets/.
// For any other fs activity, this file location must be taken into acconut.

import 'source-map-support/register';
import fs from 'fs';
import pify from 'pify';
import mkdirp from 'mkdirp';
import path from 'path';
import { batfishContext } from 'batfish-internal/context';
import renderInlineJsScripts from '../node/render-inline-js-scripts';
import { renderHtmlPage } from './render-html-page';

// Statically render pages as HTML.
//
// Returned Promise resolves when all HTML pages have been rendered and written.
function staticRenderPages(
  batfishConfig: BatfishConfiguration,
  assets: {
    vendor: { js: string },
    app: { js: string }
  },
  manifestJs: string,
  cssUrl?: string
): Promise<Array<void>> {
  const inlineJsScripts = renderInlineJsScripts(batfishConfig.inlineJs);

  // Load the full stylesheet lazily, after DOMContentLoaded. The page will
  // still render quickly because it will have its own CSS injected inline.
  let css = '';
  if (cssUrl) {
    if (batfishConfig.staticHtmlInlineDeferCss) {
      const loadCssJs = `document.addEventListener('DOMContentLoaded',function(){var s=document.createElement('link');s.rel='stylesheet';s.href='${cssUrl}';document.head.insertBefore(s, document.getElementById('loadCss'));});`;
      css = `<script id="loadCss">${loadCssJs}</script>`;
    } else {
      css = `<link rel="stylesheet" href="${cssUrl}" />`;
    }
  }

  const appendToBody = [
    // The Webpack manifest is inlined because it is very small.
    `<script>${manifestJs.replace(/\/\/#.*?map$/, '')}</script>`,
    `<script src="${assets.vendor.js}"></script>`,
    `<script src="${assets.app.js}"></script>`
  ];

  const writePage = (route: BatfishRouteData): Promise<void> => {
    return renderHtmlPage({
      route,
      inlineJsScripts,
      css,
      appendToBody,
      spa: batfishConfig.spa
    }).then(html => {
      // Write every page as an index.html file in the directory corresponding
      // to its route's path. Except the 404 page.
      if (route.is404) {
        return pify(mkdirp)(batfishConfig.outputDirectory).then(() => {
          return pify(fs.writeFile)(
            path.join(batfishConfig.outputDirectory, '404.html'),
            html
          );
        });
      }

      const baseRelativePath =
        route.path === batfishConfig.siteBasePath
          ? '/'
          : route.path.slice(batfishConfig.siteBasePath.length);
      const directory = path.join(
        batfishConfig.outputDirectory,
        baseRelativePath
      );
      const indexFile = path.join(directory, 'index.html');
      return pify(mkdirp)(directory).then(() => {
        return pify(fs.writeFile)(indexFile, html);
      });
    });
  };

  return Promise.all(batfishContext.routes.map(writePage));
}

export default staticRenderPages;
