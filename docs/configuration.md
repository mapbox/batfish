# Configuration

To use the Batfish CLI, your configuration file should be a Node module that exports a function returning a configuration object.

```js
module.exports = () => {
  return { .. };
};
```

(This format mirrors Webpack's configuration setup, which allows for unlimited flexibility and extensibility.)

By default, the Batfish CLI looks for a `batfish.config.js` file in the current working directory.
You can specify an alternate location.

**Below, "project directory" means either**:

-   the directory of your configuration module, if one is provided; or
-   the current working directory, if no configuration module is provided.

## Table of contents

-   [Basic options](#basic-options)
    -   [siteBasePath](#sitebasepath)
    -   [siteOrigin](#siteorigin)
    -   [applicationWrapperPath](#applicationwrapperpath)
    -   [stylesheets](#stylesheets)
    -   [browserslist](#browserslist)
    -   [pagesDirectory](#pagesdirectory)
    -   [outputDirectory](#outputdirectory)
    -   [temporaryDirectory](#temporarydirectory)
-   [Advanced options](#advanced-options)
    -   [dataSelectors](#dataselectors)
    -   [vendorModules](#vendormodules)
    -   [hijackLinks](#hijacklinks)
    -   [webpackLoaders](#webpackloaders)
    -   [webpackPlugins](#webpackplugins)
    -   [webpackStaticIgnore](#webpackstaticignore)
    -   [babelPlugins](#babelplugins)
    -   [babelPresets](#babelpresets)
    -   [babelExclude](#babelexclude)
    -   [postcssPlugins](#postcssplugins)
    -   [fileLoaderExtensions](#fileloaderextensions)
    -   [jsxtremeMarkdownOptions](#jsxtrememarkdownoptions)
    -   [includePromisePolyfill](#includepromisepolyfill)
    -   [inlineJs](#inlinejs)
    -   [production](#production)
    -   [developmentDevtool](#developmentdevtool)
    -   [productionDevtool](#productiondevtool)
    -   [clearOutputDirectory](#clearoutputdirectory)
    -   [unprocessedPageFiles](#unprocessedpagefiles)
    -   [webpackConfigClientTransform](#webpackconfigclienttransform)
    -   [webpackConfigStaticTransform](#webpackconfigstatictransform)
    -   [port](#port)
    -   [verbose](#verbose)

## Basic options

### siteBasePath

Type: `string`.
Default: `'/'`.

**You probably want to set this one.**

Root-relative path to the base directory on the domain where the site will be deployed.
Used by `prefixUrl` and `prefixUrl.absolute` (see ["Prefixing URLs"]).

### siteOrigin

Type: `string`.

**You probably want to set this one.**

Origin where the site will be deployed.

_Required if you want to use `prefixUrl.absolute`_ (see ["Prefixing URLs"]).

Also, _required if you want a sitemap_.

### applicationWrapperPath

Type: `string`.

Absolute path to a module exporting a React component that will wrap your React application.
The component must be exported with `export default = YourWrapperComponent` or `module.exports = YourWrapperComponent`.

This component will mount only once, wrapping Batfish's `Router` component, which in turn wraps your pages.

### stylesheets

Type: `Array<string>`.

An array of **URLs, filenames, or globs** pointing to stylesheets that you want to include in your site.

If an item is a URL, it must start with `http(s)` and must be publicly available, so Batfish can download it and work it into the CSS optimizations.
If using filenames and globs, provide absolute paths.

_If you need to control the order of your stylesheets, avoid globs._
Batfish cannot guarantee the order in which files matching your glob will be concatenated.

`url()`s referenced in your stylesheets will be hashed and copied to Batfish's [`outputDirectory`].

### browserslist

Type: `Array<string>`.
Default: `['> 5%', 'last 2 versions']`.

A [Browserslist](https://github.com/ai/browserslist) value to specify which browsers you need to support.

This option is used to process your CSS through [Autoprefixer].

### pagesDirectory

Type: `string`.
Default: project directory + `src/pages/`.

Absolute path to your project's directory of pages.

### outputDirectory

Type: `string`.
Default: project directory + `_batfish_site/`.

Absolute path to a directory where site files should be written.
**You probably want to `.gitignore` this directory.**

### temporaryDirectory

Type: `string`.
Default: project directory + `_batfish_tmp`.

Absolute path to a directory where Batfish will write temporary files.
It must be within the project directory.
**You probably want to `.gitignore` this directory.**

## Advanced options

### dataSelectors

Type: `{ [string]: (Object) => any }`.

An object of selector functions for selecting processing data before it is injected into the page.
Keys are selector names and values are functions that accept an object of build-time data and return a value that can be stringified into JSON.

The object received as an argument contains the following properties:

-   `pages`: An array of objects for pages.
    Each page object includes the following:
    -   `path`: The page's URL path.
    -   `filePath`: Absolute path to the page's file.
    -   `frontMatter`: Parsed front matter from the page's file.  

The return values of `dataSelectors` _must be stringifiable as JSON_.
These values can be used in your components pages by `import`ing modules from `@mapbox/batfish/data/*`.
See ["Injecting data"].

### vendorModules

Type: `Array<string>`.

Identifiers of npm modules that you want to be added to the vendor bundle.
The purpose of the vendor bundle is to deliberately group dependencies that change relatively infrequently — so this bundle will stay cached for longer than the others.

### hijackLinks

Type: `boolean`.
Default `true`.

By default, links are hijacked (with [link-hijacker]) and checked against your site's routes.
If the link targets one of your routes, it will make a client-side change, instead of functioning as a regular link (with a regular page load).
You can prevent this behavior by adding `data-batfish-no-hijack` to the link itself or to any of its descendents.

If you want to disable this link-hijacking altogether, handling it all yourself, you can set this option to `false`.

### webpackLoaders

Type: `Array<Object>`.

Additional loader configuration to pass to Webpack during both Webpack builds (client bundling and HTML generating).
Each object should be a [Webpack Rule](https://webpack.js.org/configuration/module/#rule).

**Warning:** You may need remove the extensions for files your new loader(s) handles from [`fileLoaderExtensions`](#fileloaderextensions).

### webpackPlugins

Type: `Array<Object>`.

Additional plugin configuration to pass to Webpack during the client bundling task.

### webpackStaticIgnore

Type: [Webpack `Condition`].

Any modules matching this description will be ignored (with the [ignore-loader](https://github.com/cherrry/ignore-loader)) during the static Webpack build.
**Any dependencies that cannot execute in Node (e.g. because they reference `window` or `document`) should be targeted by this option.**
You may need to other precautions, as well.
But most of the time, this will help you use browser-only libraries without breaking your static build.

### babelPlugins

Type: `Array`.

Additional plugins to pass to Babel during both Webpack builds (client bundling and HTML generating).
**You should `require()` your plugins instead of referencing them as strings.**
Otherwise, Babel might end up looking in the wrong place for the npm package.

### babelPresets

Type: `Array`.

Additional presets to pass to Babel during both Webpack builds (client bundling and HTML generating).
**You should `require()` your presets instead of referencing them as strings.**
Otherwise, Babel might end up looking in the wrong place for the npm package.

### babelExclude

Type: [Webpack `Condition`].
Default: `/node_modules\/!(@mapbox\/batfish\/)/`.

Any valid [Webpack `Condition`] will work here.

You'll need to use this if, for example, you use a library that includes ES2015 but is not compiled for publication (e.g. any of the [promise-fun](https://github.com/sindresorhus/promise-fun) modules).

### postcssPlugins

Type: `Array<Function> | Function`.
Default: [Autoprefixer].

All of the CSS you load via [`stylesheets`] is run through [PostCSS](http://postcss.org/), so you can apply any [PostCSS plugins](https://github.com/postcss/postcss/blob/master/docs/plugins.md) to it.
By default, only [Autoprefixer] is applied.

If a function is provided, it will receive the default array as an argument and should return a new array.
A transform function is probably preferable if you only need to add or remove an item or two from the default array.

### fileLoaderExtensions

Type: `Array<string> | Function`.
Default: `['jpeg', 'jpg', 'png', 'gif', 'webp', 'mp4', 'webm', 'woff', 'woff2']`.

An array of extensions for files that you would like to Webpack's [file-loader](https://github.com/webpack-contrib/file-loader).

If a function is provided, it will receive the default array as an argument and should return a new array.
A transform function is probably preferable if you only need to add or remove an item or two from the default array.

### jsxtremeMarkdownOptions

Type: `Object`.

Markdown pages are passed through [jsxtreme-markdown-loader](https://github.com/mapbox/jsxtreme-markdown-loader), which runs the Markdown through [`jsxtremeMarkdown.toComponentModule`].
This option is passed directly to [`jsxtremeMarkdown.toComponentModule`].

Please read the documentation for [`jsxtremeMarkdown.toComponentModule`'s `options`](https://github.com/mapbox/jsxtreme-markdown#options-1) for complete details.
But here are some of the options you are more likely to want to use with Batfish:

-   `remarkPlugins` and `rehypePlugins` allow you provide [remark](https://github.com/wooorm/remark) and [rehype](https://github.com/wooorm/rehype) plugins, which get applied as your Markdown is converted to a React component.
    There are a wide variety of plugins, from header slug insertions to Markdown syntax extensions to code block syntax highlighting and so on.
-   `prependJs` allows you to prepend JS to _every_ Markdown page in your site.
    For example, if you have a utility function that you want to make available to every Markdown page, you can use this option to `import` it.

### includePromisePolyfill

Type: `boolean`.
Default: `true`.

Webpack and Batfish both rely on Promises, so if you want to support IE11 you'll need a Promise polyfill.

By default, [es6-promise](https://github.com/stefanpenner/es6-promise)'s auto-polyfill is inserted at the beginning of the vendor bundle.
**If you'd like to use your own Promise polyfill, you should set this option to `false`** (e.g. if [core-js](https://github.com/zloirock/core-js) is throwing in polyfills via some Babel tool or other).

### inlineJs

Type: `Array<Object>`.

If you want to inline JS into static HTML before the Webpack bundle, this is the best way to do it.

On the development server, they will be added at the beginning of the Webpack bundle for debugging (sourcemaps should be available).
For the static build, they will be injected directly into the `<head>`.

Each item is an object with the following properties:

Type: -   **filename** `string` path to the JS file.
Type: -   **uglify** `boolean`: `true`. Whether or not to process the file with [UglifyJs] before inserting into the `<head>` during the static build.

### production

Type: `boolean`.
Default: `false` for `start`, `true` for `build`.

Whether or not to build for production (e.g. minimize files, trim React).

### developmentDevtool

Type: `string | false`.
Default: `'cheap-module-source-map'`.

A [Webpack devtool value](https://webpack.js.org/configuration/devtool/#devtool).
The Webpack docs explain the benefits and drawbacks of each.

### productionDevtool

Type: `string | false`.
Default: `false`.

A [Webpack devtool value](https://webpack.js.org/configuration/devtool/#devtool).
The Webpack docs explain the benefits and drawbacks of each.

### clearOutputDirectory

Type: `boolean`.
Default: `true`.

By default, the [`outputDirectory`] will be cleared before `start` and `build` execute.
Set this to `false` to leave the [`outputDirectory`] as it is and only add files to it.

### unprocessedPageFiles

Type: `Array<string>`.

An array of globs **relative to the [`pagesDirectory`]**.

By default, all `.js` and `.md` files within the [`pagesDirectory`] are processed as pages, producing HTML files at their paths.
If you would like instead to copy `.js` or `.md` files as static files, without creating corresponding HTML files, use this option.

For example, if you have a `scripts/` directory and all the `.js` files within it are _not_ pages, but are static JavaScript files that you want to expose at `/scripts/*.js` URLs, you could set `unprocessedPageFiles` to `['scripts/**/*.js']`.

### webpackConfigClientTransform

Type: `Function`.

The Webpack config for client-side bundles will be passed through this function before it's used.
**Only use this option if you know what you're doing!**
You need to be careful not to change configuration that Batfish relies on.

### webpackConfigStaticTransform

Type: `Function`.

The Webpack config for static, server-side bundling will be passed through this function before it's used.
**Only use this option if you know what you're doing!**
You need to be careful not to change configuration that Batfish relies on.

### port

Type: `number`.
Default: `8080`.

Preferred port for development servers.
If the specified port is unavailable, another port is used.

### verbose

Type: `boolean`.
Default: `false`.

If `true`, more information will be logged to the console.

[uglifyjs]: https://github.com/mishoo/UglifyJS2

[autoprefixer]: https://github.com/postcss/autoprefixer

["prefixing urls"]: ../README.md#prefixing-urls

[`outputdirectory`]: #outputdirectory

[`pagesdirectory`]: #pagesdirectory

[`stylesheets`]: #stylesheets

["injecting data"]: ./advanced-usage.md#injecting-data

[`jsxtrememarkdown.tocomponentmodule`]: https://github.com/mapbox/jsxtreme-markdown#tocomponentmodule

[link-hijacker]: https://github.com/mapbox/link-hijacker

[webpack `condition`]: https://webpack.js.org/configuration/module/#condition
