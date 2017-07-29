// **WARNING**
// This file gets compiled by Webpack before it is executed.
// So when it is executed, the __dirname will be {outputDirectory}/assets/.
// For any other fs activity, this file location must be taken into acconut.

import 'source-map-support/register';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Helmet } from 'react-helmet';
import fs from 'fs';
import pify from 'pify';
import chalk from 'chalk';
import mkdirp from 'mkdirp';
import path from 'path';
import UglifyJs from 'uglify-js';
import { batfishContext } from 'batfish-internal/context';
import ApplicationWrapper from 'batfish-internal/application-wrapper';
import { StaticHtmlPage } from './static-html-page';
import { Router } from './router';
import constants from '../lib/constants';
import timelog from '../lib/timelog';

/**
 * Statically render pages as HTML.
 *
 * @param {BatfishConfig} batfishConfig
 * @param {Object} assets - JSON output by Webpack that locates assets.
 * @param {string} manifestJs - JS output by Webpack that locates chunks.
 * @return {Promise<void>} - Resolves when all HTML pages have been rendered and written.
 */
function staticRenderPages(batfishConfig, assets, manifestJs) {
  const renderPage = route => {
    let inlineJs;
    if (batfishConfig.production && batfishConfig.inlineJs) {
      inlineJs = batfishConfig.inlineJs
        .map(jsData => {
          let code = fs.readFileSync(jsData.filename, 'utf8');
          if (jsData.uglify !== false) {
            const uglified = UglifyJs.minify(code, { fromString: true });
            if (uglified.error) throw uglified.error;
            code = uglified.code;
          }
          return `<script>${code}</script>`;
        })
        .join('\n');
    }
    return route.getPage().then(pageModule => {
      // We render the page content separately from the StaticHtmlPage, because the page
      // content is what will be re-rendered when the bundled JS loads so it must
      // match exactly what batfish-app.js renders (or you get React checksum errors).
      // The rest of StaticHtmlPage will never be re-rendered by React.
      let pageContent;
      try {
        pageContent = ReactDOMServer.renderToString(
          <ApplicationWrapper>
            <Router
              startingPath={route.path}
              startingComponent={pageModule.component}
              startingProps={pageModule.props}
            />
          </ApplicationWrapper>
        );
      } catch (renderError) {
        timelog(chalk.red.bold(`Error rendering page ${route.path}`));
        throw renderError;
      }

      const cssUrl = assets.app.css;
      // Load the full stylesheet lazily, after DOMContentLoaded. The page will
      // still render quickly because it will have its own CSS injected inline.
      const loadCssScript = `document.addEventListener('DOMContentLoaded',function(){var s=document.createElement('link');s.rel='stylesheet';s.href='${cssUrl}';document.head.insertBefore(s, document.getElementById('loadCss')); });`;
      const head = Helmet.rewind();
      const reactDocument = (
        <StaticHtmlPage
          rawAppHtml={pageContent}
          htmlAttributes={head.htmlAttributes.toComponent()}
          bodyAttributes={head.bodyAttributes.toComponent()}
          appendToHead={[
            head.title.toString(),
            head.base.toString(),
            head.meta.toString(),
            head.link.toString(),
            inlineJs,
            head.script.toString(),
            constants.INLINE_CSS_MARKER,
            `<script id="loadCss">${loadCssScript}</script>`,
            // This comes after the inlined and dynamically loaded CSS
            // so it will override regular stylesheets
            head.style.toString()
          ]}
          appendToBody={[
            // The Webpack manifest is inlined because it is very small.
            `<script>${manifestJs.replace(/\/\/#.*?map$/, '')}</script>`,
            `<script src="${assets.vendor.js}"></script>`,
            `<script src="${assets.app.js}"></script>`
          ]}
        />
      );
      const html = ReactDOMServer.renderToStaticMarkup(reactDocument);
      return `<!doctype html>${html}`;
    });
  };

  const writePage = route => {
    return renderPage(route).then(html => {
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
