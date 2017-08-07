# Changelog

## Head

-   [Fix] Fix the url-referenced assets in CSS are copied and rebased for the static build.

## 0.9.1

-   [Fix] Assets referenced by `url()` in CSS you include with the `stylesheets` option are copied into the `outputDirectory`.

## 0.9.0

-   [Breaking change] Revised `dataSelectors` system.
    Values returned by `dataSelectors` can now be used by `import`ing modules from `@mapbox/batfish/data/[data-selector-name]`, instead of using the special `injectedData` front matter property.
    For example, the return value from the `dataSelectors.watchOutForBees` is available with `import beeData from '@mapbox/batfish/data/watch-out-for-bees';`.

## 0.8.0

-   [Addition] `includePromisePolyfill` configuration option.
-   [Fix] Batfish will inject its specified version of `es6-promise` even if something about your dependency resolution ends up putting an older version of that polyfill at `node_modules/es6-promise`.

## 0.7.0

-   [Breaking change] Renamed `externalStylesheets` option to `stylesheets`.
-   [Breaking change] CSS is no longer `import`ed or `require`d via Webpack.
    All stylesheets should be listed in the `stylesheets` configuration array.
-   [Breaking change] Renamed `wrapperPath` option to `applicationWrapperPath`.
-   [Breaking change] Removed `notFoundPath` option.
    Instead, 404 pages always live as `404.(js|md)` in the `pagesDirectory`.
-   [Breaking change] 404 pages are no longer `index.html` files inside directories, e.g. `404/index.html`.
    They are just HTML pages, e.g. `404.html`.
-   [Breaking change] Changed default `outputDirectory` from `_site` to `_batfish_site`.
-   [Breaking change] Changed default `temporaryDirectory` from `_tmp` to `_batfish_tmp`.
-   [Breaking change] Upgrade jsxtreme-markdown, which changed `modules` front matter property in Markdown pages to `prependJs`.

## 0.6.0

-   [Addition] `webpackStaticIgnore` configuration option.
-   [Fix] Links with fragment identifiers.
    Only scroll to the top of the page after the URL changes if the location's pathname changes and if there is no fragment identifier in the URL.
-   [Fix] Use ES2015 named imports for default `modules` values in `jsxtreme-markdown` documents.

## 0.5.0

-   Changed `batfish/md` path, for Babel-compiled Markdown in JS pages, to `@mapbox/batfish/modules/md`.
-   Switched ES2015 module compilation from Webpack's system to Babel's ES2015 preset.
-   Use [worker-farm](https://github.com/rvagg/node-worker-farm) for inlining CSS in static HTML files.
-   Upgrade Webpack to v3.
-   Use external [@mapbox/link-to-location](https://github.com/mapbox/link-to-location) package, delete local version.
-   Put BrowserSync in `offline` mode.
-   Upgrade jsxtreme-markdown to get some bug fixes.

## 0.4.0

-   It begins.
