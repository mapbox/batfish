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
  options: {
    assets: AssetsJson,
    modernAssets?: AssetsJson,
    cssUrl?: string
  }
): Promise<Array<void>> {
  const inlineJsScripts = renderInlineJsScripts(batfishConfig.inlineJs);

  // Load the full stylesheet lazily, after DOMContentLoaded. The page will
  // still render quickly because it will have its own CSS injected inline.
  let loadCssScript = '';
  if (options.cssUrl) {
    const loadCssJs = `document.addEventListener('DOMContentLoaded',function(){var s=document.createElement('link');s.rel='stylesheet';s.href='${options.cssUrl}';document.head.insertBefore(s, document.getElementById('loadCss'));});`;
    loadCssScript = `<script id="loadCss">${loadCssJs}</script>`;
  }

  let appendToBody;
  if (!options.modernAssets) {
    appendToBody = [
      `<script src="${options.assets.runtime.js}"></script>`,
      `<script src="${options.assets.vendor.js}"></script>`,
      `<script src="${options.assets.app.js}"></script>`
    ];
  } else {
    // Scripts are loaded simultaneously but executed in the order of the
    // array.
    // cf. https://www.html5rocks.com/en/tutorials/speed/script-loading/
    appendToBody = [
      `<script>
        var supportsModern = false;
        try {
          eval('const a = x => 2; class Foo {}');
          supportsModern = true;
        } catch (e) {}
        var runtimeSrc = supportsModern
          ? "${options.modernAssets.runtime.js}"
          : "${options.assets.runtime.js}";
        var vendorSrc = supportsModern
          ? "${options.modernAssets.vendor.js}"
          : "${options.assets.vendor.js}";
        var appSrc = supportsModern
          ? "${options.modernAssets.app.js}"
          : "${options.assets.app.js}";
        [runtimeSrc, vendorSrc, appSrc].forEach(function(src) {
          var s = document.createElement('script');
          s.src = src;
          s.async = false;
          document.head.appendChild(s);
        });
      </script>`
    ];
  }

  const writePage = (route: BatfishRouteData): Promise<void> => {
    return renderHtmlPage(
      route,
      inlineJsScripts,
      loadCssScript,
      appendToBody
    ).then(html => {
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
