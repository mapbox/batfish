'use strict';

// **WARNING**
// This file gets compiled by Webpack before it is executed.
// So when it is executed, the __dirname will be /assets/ within the outputDirectory.
// All `require` calls will have already been resolved; but for any other fs
// activity, this file location must be taken into acconut.

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Helmet = require('react-helmet').Helmet;
const fs = require('fs');
const pify = require('pify');
const mkdirp = require('mkdirp');
const path = require('path');
const batfishContext = require('batfish/context');
const Wrapper = require('batfish/wrapper');
const StaticHtmlPage = require('./static-html-page');
const Router = require('./router');
const constants = require('../lib/constants');

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
    return route.getPage().then(pageModule => {
      // We render the page content separately from the StaticHtmlPage, because the page
      // content is what will be re-rendered when the bundled JS loads so it must
      // match exactly what batfish-app.js renders (or you get React checksum errors).
      const pageContent = ReactDOMServer.renderToString(
        <Wrapper>
          <Router
            startingPath={route.path}
            startingComponent={pageModule.component}
            startingProps={pageModule.props}
          />
        </Wrapper>
      );

      const cssUrl = assets.app.css;
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
      // to its route's path.
      const baseRelativePath = route.path === batfishConfig.siteBasePath
        ? '/'
        : route.path.slice(batfishConfig.siteBasePath.length);
      const directory = path.join(
        batfishConfig.outputDirectory,
        baseRelativePath
      );
      const indexFile = path.join(directory, 'index.html');
      return pify(mkdirp)(directory).then(() =>
        pify(fs.writeFile)(indexFile, html)
      );
    });
  };

  return Promise.all(batfishContext.routes.map(writePage));
}

module.exports = staticRenderPages;
