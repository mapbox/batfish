'use strict';

// **WARNING**
// This file gets compiled before it is executed.
//
// When this is executed, the __dirname will be /assets/ within outputDirectory.
// All `require` calls will have already been resolved; but for any other fs
// activity, this location must be taken into acconut.

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Helmet = require('react-helmet').Helmet;
const fs = require('fs');
const pify = require('pify');
const mkdirp = require('mkdirp');
const path = require('path');
const batfishContext = require('batfish/context');
const Wrapper = require('batfish/wrapper');
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
    return routeData.getPage().then(Page => {
      const pageContent = ReactDOMServer.renderToString(
        <Wrapper>
          <Page />
        </Wrapper>
      );
      const head = Helmet.rewind();
      const reactDocument = (
        <PageTemplate
          rawAppHtml={pageContent}
          htmlAttributes={head.htmlAttributes.toComponent()}
          bodyAttributes={head.bodyAttributes.toComponent()}
          appendToHead={[
            head.title.toString(),
            head.base.toString(),
            head.meta.toString(),
            head.link.toString(),
            head.script.toString(),
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

  return Promise.all(batfishContext.routes.map(writePage));
}

module.exports = staticRenderPages;
