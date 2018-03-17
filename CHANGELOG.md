# Changelog

## HEAD

- **Fix:** Improve error messages when front matter parsing fails.

## 1.5.1

- Remove webpack-chunk-hash dependency. Recent versions of Webpack do not require this module for deterministic filename hashing.

## 1.5.0

- **Add:** Add `staticHtmlInlineDeferCss` option.

## 1.4.0

- **Add:** Add `webpackStaticStubReactComponent` option.
- **Add:** Use Webpack's `node` option in the client config to stub core Node libraries, resulting in fewer errors buried in users' dependencies.

## 1.3.0

- **Add:** Add `devBrowserslist` option. **This will change the browser support of your development (not production) build.**
- **Add:** Add `-b, --browsers` option for `batfish start`.
- **Add:** `browserslist` and `devBrowserslist` affect babel-preset-env, not just Autoprefixer.

## 1.2.0

- **Add:** Include `babel-plugin-transform-object-rest-spread` by default.
- **Add:** Add `manageScrollRestoration` option.
- **Add:** Add **experimental** `spa` option.
  This option might suffer breaking changes on any release until it's no longer "experimental".

## 1.1.0

- **Add:** `-i, --include` option to `batfish start` command, and corresponding `includePages` configuration option, which allows you to speed up your development build by only building the specified pages.
- **Add:** `batfish write-bablerc` command (`batfish.writeBabelrc` in Node API), which writes a `.babelrc` file that you can use to tell other process, like a test runner, how to interpret your source files.
- **Add:** Add `babelInclude` option.
- **Fix:** Fix bug that could cause builds with unnamed dynamic imports to fail with a cryptic error about a hash-based filename that is too long.
- **Fix:** Actually exclude `node_modules` from Babel compilation, as intended and documented.
  **Warning:** this fix makes the functionality fit the documented public API, but if you were accidentally relying on a `node_module` being accidentally compiled, this could break your build.
  You'll want to use the new `babelInclude` option to indicate those `node_modules` that need to be compiled.
- **Fix:** Tweak default `babelExclude` value to ensure it excludes nested `node_modules` directories.
- **Chore:** Remove json-loader, which Webpack no longer needs to import JSON.
- **Chore:** Allow babel-loader to use its default cache location (`node_modules/.cache/babel-loader`).

## 1.0.4

- **Fix:** Fix bug causing build to fail if you used `npm link` (or `yarn link`), with a message about failing to find Babel plugins.

## 1.0.3

- Upgrade dependencies. There should not be any user-faces changes, just behind-the-scenes improvements.

## 1.0.2

- **Fix:** Fix bug where changes to recent versions of BrowserSync broke server initialization logging.

## 1.0.1

- **Fix:** Upgrade `@mapbox/jsxtreme-markdown-loader` to get bug fix related to determining Markdown wrappers with a `getWrapper` function.

## 1.0.0

- No changes. Releasing 1.0 because the library has been stable enough that 1.0 will be good for semver.

## 0.13.4

- **Fix:** Use `NamedChunksPlugin` to improve long-term caching.

## 0.13.3

- **Fix:** Do not copy files specified by `unprocessedPageFiles` option if they are also ignored by `ignoreWithinPagesDirectory`.
- **Fix:** Fix bug that caused the static build's Webpack config to look for certain dependencies, like `uglify-js`, in the wrong place.
- **Fix:** Better errors for obscure parse errors from compiled `static-render-pages.js`.

## 0.13.2

- **Fix:** `outputDirectory` and `temporaryDirectory` do not have to exist as part of config validation.

## 0.13.1

- **Fix:** Add Prettier to `dependencies`, not just `devDependencies`.
- **Fix:** Provide more clear error messages by checking for the existing of files or directories while validating configuration for the following options: `applicationWrapperPath`, `pagesDirectory`, `outputDirectory`, `temporaryDirectory`, `inlineJs`.
- **Fix:** Fix buggy validation of `inlineJs` configuration property.

## 0.13.0

- **Add:** Add `ignoreWithinPagesDirectory` option.

## 0.12.1

- **Fix:** Update jsxtreme-markdown dependencies to get bug fix.

## 0.12.0

- **Add:** Add `publicAssetsPath` option.
- **Fix:** Slight improvement to filename hashing for long-term caching.
- **Fix:** Remove `strip-color` from `vendorModules`, as it's no longer being used.
- **Chore:** Allow for React 16 as peer dependency.
- **Chore:** Update all other dependencies.

## 0.11.4

- **Fix:** Fragments in the URL take precedence over scrolling to the top of pages on dynamic route changes.

## 0.11.3

- **Fix:** Fragments in the URL take precedence over saved scroll positions in the history.

## 0.11.2

- **Fix:** Development server does not quit the process when there are Webpack compilation errors.
  Instead, you can just fix them and rebuild.

## 0.11.1

- **Fix:** Remove imports of `batfish-internal/context` from public modules.
  These break unit tests, or any other reference to the file outside of Batfish's builds.

## 0.11.0

- **Add:** Add `babelPresetEnvOptions` option.
- **Add:** Enable page-specific CSS.
  See ["Page-specific CSS" documentation](docs/advanced-usage.md#page-specific-css).
- **Fix:** Prevent two simultaneous Webpack compilations from messing with each other when a page file changes.

## 0.10.4

- **Fix:** Restructure directories to be more friendly for Flow-using consumers.

## 0.10.3

- **Fix:** Don't hijack links that aren't to Batfish routes.
  Refactoring in 0.10.0 introduced this bug.

## 0.10.2

- **Fix:** Include more files in npm package ...

## 0.10.1

- **Fix:** Include `dist/` in npm package. Oops.

## 0.10.0

- 🚨 **Breaking change:** Require Node 6. (Drop support for Node 4.)
- 🚨 **Breaking change:** Remove `staticDirectory` option.
  The same effect can be accomplished by putting static files in the pages directory.
- 🚨 **Breaking change:** `with-location` now provides the original component at WrappedComponent instead of WrapperComponent.
- 🚨 **Breaking change:** change `data-no-hijack` attribute name to `data-batfish-no-hijack`.
  Also, this attribute now blocks link hijacking on the element itself *and all its children*.
- 🚨 **Breaking change:** (maybe, maybe not) Links with fragment URLs (e.g. `href="#foo"`) are not hijacked, just left to their default behavior.
- **Add:** Much improved logging!
- **Add:** Much improved configuration validation!
- **Add:** Much improved error handling!
- **Add:** `hijackLinks` configuration option, defaulting to `true`.
- **Add:** Improve `prefixUrl` to work with already-prefixed URLs and absolute URLs.
- **Add:** Add `unprocessedPageFiles` option.
- **Add:** Include `babel-plugin-transform-class-properties` by default.
- **Add:** `start` now rebuilds when you change a page's front matter, create a new page, or delete a page.
- **Fix:** Update postcss-html-filter to fix bugs inlining CSS with certain pseudo selectors.

## 0.9.4

- **Fix:** Do not rebase URLs in CSS that have protocols.

## 0.9.2

- **Fix:** Fix the url-referenced assets in CSS are copied and rebased for the static build.
- **Fix:** Ensure that the user's versions of react, react-dom, and react-helmet are used.

## 0.9.1

- **Fix:** Assets referenced by `url()` in CSS you include with the `stylesheets` option are copied into the `outputDirectory`.

## 0.9.0

- 🚨 **Breaking change:** Revised `dataSelectors` system.
  Values returned by `dataSelectors` can now be used by `import`ing modules from `@mapbox/batfish/data/[data-selector-name]`, instead of using the special `injectedData` front matter property.
  For example, the return value from the `dataSelectors.watchOutForBees` is available with `import beeData from '@mapbox/batfish/data/watch-out-for-bees';`.

## 0.8.0

- **Addition:** `includePromisePolyfill` configuration option.
- **Fix:** Batfish will inject its specified version of `es6-promise` even if something about your dependency resolution ends up putting an older version of that polyfill at `node_modules/es6-promise`.

## 0.7.0

- 🚨 **Breaking change:** Renamed `externalStylesheets` option to `stylesheets`.
- 🚨 **Breaking change:** CSS is no longer `import`ed or `require`d via Webpack.
  All stylesheets should be listed in the `stylesheets` configuration array.
- 🚨 **Breaking change:** Renamed `wrapperPath` option to `applicationWrapperPath`.
- 🚨 **Breaking change:** Removed `notFoundPath` option.
  Instead, 404 pages always live as `404.(js|md)` in the `pagesDirectory`.
- 🚨 **Breaking change:** 404 pages are no longer `index.html` files inside directories, e.g. `404/index.html`.
  They are just HTML pages, e.g. `404.html`.
- 🚨 **Breaking change:** Changed default `outputDirectory` from `_site` to `_batfish_site`.
- 🚨 **Breaking change:** Changed default `temporaryDirectory` from `_tmp` to `_batfish_tmp`.
- 🚨 **Breaking change:** Upgrade jsxtreme-markdown, which changed `modules` front matter property in Markdown pages to `prependJs`.

## 0.6.0

- **Addition:** `webpackStaticIgnore` configuration option.
- **Fix:** Links with fragment identifiers.
  Only scroll to the top of the page after the URL changes if the location's pathname changes and if there is no fragment identifier in the URL.
- **Fix:** Use ES2015 named imports for default `modules` values in `jsxtreme-markdown` documents.

## 0.5.0

- Changed `batfish/md` path, for Babel-compiled Markdown in JS pages, to `@mapbox/batfish/modules/md`.
- Switched ES2015 module compilation from Webpack's system to Babel's ES2015 preset.
- Use [worker-farm](https://github.com/rvagg/node-worker-farm) for inlining CSS in static HTML files.
- Upgrade Webpack to v3.
- Use external [@mapbox/link-to-location](https://github.com/mapbox/link-to-location) package, delete local version.
- Put BrowserSync in `offline` mode.
- Upgrade jsxtreme-markdown to get some bug fixes.

## 0.4.0

- It begins.
