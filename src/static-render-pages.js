'use strict';

// **WARNING**
// This file gets compiled before it is executed.
//
// When this is executed, the __dirname will be /assets/ within outputDirectory.
// All `require` calls will have already been resolved; but for any other fs
// activity, this location must be taken into acconut.

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const fs = require('fs');
const pify = require('pify');
const mkdirp = require('mkdirp');
const path = require('path');
const batfishContext = require('batfish/context');
const PageTemplate = require('./page-template');

const assets = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'assets.json'), 'utf8')
);
const manifestJs = fs.readFileSync(
  path.join(__dirname, path.basename(assets.manifest.js)),
  'utf8'
);

/**
 * Statically render pages as HTML.
 *
 * @param {Object} options
 * @param {string} options.outputDirectory
 * @return {Promise<>}
 */
function staticRenderPages(options) {
  const renderPage = routeData => {
    return routeData.getModule().then(pageModule => {
      const pageContent = ReactDOMServer.renderToString(
        <pageModule.component />
      );
      const reactDocument = (
        <PageTemplate
          rawAppHtml={pageContent}
          appendToBody={[
            // The Webpack manifest is inlined because it is quite small
            `<script>${manifestJs}</script>`,
            `<script src="${assets.vendor.js}"></script>`,
            `<script src="${assets.app.js}"></script>`
          ]}
        />
      );
      const html = ReactDOMServer.renderToStaticMarkup(reactDocument);
      return `<!doctype html>${html}`;
    });
  };

  const writePage = routeData => {
    return renderPage(routeData).then(html => {
      const directory = path.join(options.outputDirectory, routeData.path);
      const indexFile = path.join(
        options.outputDirectory,
        routeData.path,
        'index.html'
      );
      return pify(mkdirp)(directory).then(() =>
        pify(fs.writeFile)(indexFile, html)
      );
    });
  };

  return Promise.all(batfishContext.routesData.map(writePage));
}

module.exports = staticRenderPages;
