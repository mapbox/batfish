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
    -   [externalStylesheets](#externalstylesheets)
    -   [browserslist](#browserslist)
    -   [pagesDirectory](#pagesdirectory)
    -   [staticDirectory](#staticdirectory)
    -   [outputDirectory](#outputdirectory)
    -   [temporaryDirectory](#temporarydirectory)
-   [Advanced options](#advanced-options)
    -   [dataSelectors](#dataselectors)
    -   [vendorModules](#vendormodules)
    -   [webpackLoaders](#webpackloaders)
    -   [webpackPlugins](#webpackplugins)
    -   [webpackStaticIgnore](#webpackstaticignore)
    -   [babelPlugins](#babelplugins)
    -   [babelPresets](#babelpresets)
    -   [babelExclude](#babelexclude)
    -   [postcssPlugins](#postcssplugins)
    -   [fileLoaderExtensions](#fileloaderextensions)
    -   [jsxtremeMarkdownOptions](#jsxtrememarkdownoptions)
    -   [inlineJs](#inlinejs)
    -   [production](#production)
    -   [developmentDevtool](#developmentdevtool)
    -   [productionDevtool](#productiondevtool)
    -   [clearOutputDirectory](#clearoutputdirectory)
    -   [webpackConfigClientTransform](#webpackconfigclienttransform)
    -   [webpackConfigStaticTransform](#webpackconfigstatictransform)
    -   [port](#port)

## Basic options

### siteBasePath

`string` - Optional. Default: `'/'`

**You probably want to set this one.**

Root-relative path to the base directory on the domain where the site will be deployed.
Used by `prefixUrl` and `prefixUrl.absolute` (see ["Prefixing URLs"]).

### siteOrigin

`string` - Optional.

**You probably want to set this one.**

Origin where the site will be deployed.

_Required if you want to use `prefixUrl.absolute`_ (see ["Prefixing URLs"]).

Also, _required if you want a sitemap_.

### applicationWrapperPath

`string` - Optional.

Absolute path to a module exporting a React component that will wrap your React application.
The component must be exported with `export default = YourWrapperComponent` or `module.exports = YourWrapperComponent`.

This component will mount only once, wrapping Batfish's `Router` component, which in turn wraps your pages.

### externalStylesheets

`Array<string>` - Optional.

An array of URLs to external stylesheets that you want to include in your site.
These stylesheets need to be publicly available at the designated URL so Batfish can download them and work them into the CSS optimizations.

### browserslist

`Array<string>` - Optional. Default: `['> 5%', 'last 2 versions']`

A [Browserslist](https://github.com/ai/browserslist) value to specify which browsers you need to support.

This option is used to process your CSS through [Autoprefixer].

### pagesDirectory

`string` - Optional. Default: project directory + `src/pages/`

Absolute path to your project's directory of pages.

### staticDirectory

`string` - Optional. Default: project directory + `static/`

Absolute path to your project's directory of static assets.
The contents of this directory will be copied exactly, without additional processing, into the `/static/` path in your website.

### outputDirectory

`string` - Optional. Default: project directory + `_batfish_site/`

Absolute path to a directory where site files should be written.
**You probably want to `.gitignore` this directory.**

### temporaryDirectory

`string` - Optional. Default: project directory + `_batfish_tmp`

Absolute path to a directory where Batfish will write temporary files.
It must be within the project directory.
**You probably want to `.gitignore` this directory.**

## Advanced options

### dataSelectors

`{ [string]: (Object) => any }` - Optional.

An object of selector functions for selecting processing data before it is injected into the page.
Keys are selector names and values are functions that accept an object representing all the site's data and return a value.

The object received as an argument contains the following properties:

-   `pages`: An array of objects for pages.
    Each page object includes the following:
    -   `path`: The page's URL path.
    -   `filePath`: Absolute path to the page's file.
    -   `frontMatter`: Parsed front matter from the page's file.  

The return values of `dataSelectors` can be used in pages by adding an `injectedData` list in the front matter that includes the name of a data selector.
See ["Injecting data"].

### vendorModules

`Array<string>` - Identifiers of npm modules that you want to be added to the vendor bundle.
The purpose of the vendor bundle is to deliberately group dependencies that change relatively infrequently — so this bundle will stay cached for longer than the others.

### webpackLoaders

`Array<Object>` - Additional loader configuration to pass to Webpack during both Webpack builds (client bundling and HTML generating).
Each object should be a [Webpack Rule](https://webpack.js.org/configuration/module/#rule).

**Warning:** You may need remove the extensions for files your new loader(s) handles from [`fileLoaderExtensions`](#fileloaderextensions).

### webpackPlugins

`Array<Object>` - Additional plugin configuration to pass to Webpack during the client bundling task.

### webpackStaticIgnore

A [Webpack Condition](https://webpack.js.org/configuration/module/#condition) - Any modules matching this description will be ignored (with the [ignore-loader](https://github.com/cherrry/ignore-loader)) during the static Webpack build.
**Any dependencies that cannot execute in Node (e.g. because they reference `window` or `document`) should be targeted by this option.**
You may need to other precautions, as well.
But most of the time, this will help you use browser-only libraries without breaking your static build.

### babelPlugins

`Array` - Additional plugins to pass to Babel during both Webpack builds (client bundling and HTML generating).
**You should `require()` your plugins instead of referencing them as strings.**
Otherwise, Babel might end up looking in the wrong place for the npm package.

### babelPresets

`Array` - Additional presets to pass to Babel during both Webpack builds (client bundling and HTML generating).
**You should `require()` your presets instead of referencing them as strings.**
Otherwise, Babel might end up looking in the wrong place for the npm package.

### babelExclude

`WebpackCondition` - Optional. Default: `/node_modules\/!(@mapbox\/batfish\/)/`

Any [valid Webpack Condition](https://webpack.js.org/configuration/module/#condition) will work here.

You'll need to use this if, for example, you use a library that includes ES2015 but is not compiled for publication (e.g. any of the [promise-fun](https://github.com/sindresorhus/promise-fun) modules).

### postcssPlugins

`Array<Function> | Function` - Optional. Default: Autoprefixer only.

All of the CSS you load via Webpack is run through [PostCSS](http://postcss.org/), so you can apply any [PostCSS plugins](https://github.com/postcss/postcss/blob/master/docs/plugins.md) to it.
By default, only [Autoprefixer] is applied.

If a function is provided, it will receive the default array as an argument and should return a new array.
A transform function is probably preferable if you only need to add or remove an item or two from the default array.

This value is passed directly to [postcss-loader](https://github.com/postcss/postcss-loader#plugins).

### fileLoaderExtensions

`Array<string> | Function` - Options. Default: `['jpeg', 'jpg', 'png', 'gif', 'webp', 'mp4', 'webm', 'woff', 'woff2']`

An array of extensions for files that you would like to Webpack's [file-loader](https://github.com/webpack-contrib/file-loader).

If a function is provided, it will receive the default array as an argument and should return a new array.
A transform function is probably preferable if you only need to add or remove an item or two from the default array.

### jsxtremeMarkdownOptions

`Object` - Optional.

Provide any of the following [jsxtreme-markdown] options (please read about them in [jsxtreme-markdown] docs): `delimiters`, `escapeDelimiter`, `remarkPlugins`, `rehypePlugins`, `wrapper`, `modules`, `name`, `template`.

**To add syntax highlighting to your Markdown pages, you'll probably want to use `remarkPlugins` or `rehypePlugins`.**

### inlineJs

`Array<Object>` - Optional.

If you want to inline JS into static HTML before the Webpack bundle, this is the best way to do it.

On the development server, they will be added at the beginning of the Webpack bundle for debugging (sourcemaps should be available).
For the static build, they will be injected directly into the `<head>`.

Each item is an object with the following properties:

-   **filename** `string` - Absolute path to the JS file.
-   **uglify** `boolean` - Default: `true`. Whether or not to process the file with [UglifyJs] before inserting into the `<head>` during the static build.

### production

`boolean` - Optional. Default: `false` for `start`, `true` for `build`

Whether or not to build for production (e.g. minimize files, trim React).

### developmentDevtool

`string | false` - Optional. Default: `'cheap-module-source-map'`

A [Webpack devtool value](https://webpack.js.org/configuration/devtool/#devtool).
The Webpack docs explain the benefits and drawbacks of each.

### productionDevtool

`string | false` - Optional. Default: `false`

A [Webpack devtool value](https://webpack.js.org/configuration/devtool/#devtool).
The Webpack docs explain the benefits and drawbacks of each.

### clearOutputDirectory

`boolean` - Optional. Default: `true`.

By default, the [`outputDirectory`] will be cleared before `start` and `build` execute.
Set this to `false` to leave the [`outputDirectory`] as it is and only add files to it.

### webpackConfigClientTransform

`Function` - Optional.

The Webpack config for client-side bundles will be passed through this function before it's used.
**Only use this option if you know what you're doing!**
You need to be careful not to change configuration that Batfish relies on.

### webpackConfigStaticTransform

`Function` - Optional.

The Webpack config for static, server-side bundling will be passed through this function before it's used.
**Only use this option if you know what you're doing!**
You need to be careful not to change configuration that Batfish relies on.

### port

`number` - Optional. Default: `8080`

Preferred port for development servers.
If the specified port is unavailable, another port is used.

[uglifyjs]: https://github.com/mishoo/UglifyJS2

[autoprefixer]: https://github.com/postcss/autoprefixer

["prefixing urls"]: ../README.md#prefixing-urls

[`outputdirectory`]: #outputdirectory

["injecting data"]: ./advanced-usage.md#injecting-data
