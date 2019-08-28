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

- the directory of your configuration module, if one is provided; or
- the current working directory, if no configuration module is provided.

## Table of contents

- [Basic options](#basic-options)
  - [siteBasePath](#sitebasepath)
  - [siteOrigin](#siteorigin)
  - [publicAssetsPath](#publicassetspath)
  - [applicationWrapperPath](#applicationwrapperpath)
  - [stylesheets](#stylesheets)
  - [browserslist](#browserslist)
  - [devBrowserslist](#devbrowserslist)
  - [pagesDirectory](#pagesdirectory)
  - [outputDirectory](#outputdirectory)
  - [temporaryDirectory](#temporarydirectory)
- [Advanced options](#advanced-options)
  - [dataSelectors](#dataselectors)
  - [vendorModules](#vendormodules)
  - [hijackLinks](#hijacklinks)
  - [manageScrollRestoration](#managescrollrestoration)
  - [spa](#spa)
  - [webpackLoaders](#webpackloaders)
  - [webpackPlugins](#webpackplugins)
  - [webpackStaticStubReactComponent](#webpackstaticstubreactcomponent)
  - [webpackStaticIgnore](#webpackstaticignore)
  - [staticHtmlInlineDeferCss](#statichtmlinlinedefercss)
  - [babelPlugins](#babelplugins)
  - [babelPresets](#babelpresets)
  - [babelPresetEnvOptions](#babelpresetenvoptions)
  - [babelExclude](#babelexclude)
  - [babelInclude](#babelinclude)
  - [postcssPlugins](#postcssplugins)
  - [fileLoaderExtensions](#fileloaderextensions)
  - [jsxtremeMarkdownOptions](#jsxtrememarkdownoptions)
  - [includePromisePolyfill](#includepromisepolyfill)
  - [inlineJs](#inlinejs)
  - [sitemap](#sitemap)
  - [production](#production)
  - [developmentDevtool](#developmentdevtool)
  - [productionDevtool](#productiondevtool)
  - [clearOutputDirectory](#clearoutputdirectory)
  - [unprocessedPageFiles](#unprocessedpagefiles)
  - [includePages](#includepages)
  - [ignoreWithinPagesDirectory](#ignorewithinpagesdirectory)
  - [webpackConfigClientTransform](#webpackconfigclienttransform)
  - [webpackConfigStaticTransform](#webpackconfigstatictransform)
  - [pageSpecificCss](#pagespecificcss)
  - [port](#port)
  - [verbose](#verbose)

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

*Required if you want to use `prefixUrl.absolute`* (see ["Prefixing URLs"]).

Also, *required if you want a sitemap* (see [`sitemap`] option).

### publicAssetsPath

Type: `string`.
Default: `'assets'`

Default folder where batfish assets will be placed for static webpack build (aka `npm run build`)

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

*If you need to control the order of your stylesheets, avoid globs.*
Batfish cannot guarantee the order in which files matching your glob will be concatenated.

`url()`s referenced in your stylesheets will be hashed and copied to Batfish's [`outputDirectory`].

### browserslist

Type: `Array<string>`.
Default: `['> 5%', 'last 2 versions']`.

A [Browserslist](https://github.com/ai/browserslist) value to specify which browsers you need to support.

This option is used to process your CSS through [Autoprefixer] and determine which Babel transforms to apply through [@babel/preset-env].

**This option determines the browser support of your production build (`batfish build`).
During development (`batfish start`), this will be overridden by [`devBrowserslist`]** (unless `devBrowserslist` is set to `false`).

### devBrowserslist

Type: `Array<string> | false`.
Default: `['Edge >= 14', 'Firefox >= 52', 'Chrome >= 58', 'Safari >= 10', 'iOS >= 10.2'`].

A [Browserslist](https://github.com/ai/browserslist) value to specify which browsers you need to support *with the development build* (`batfish start`).
If this value is `false`, [`browserslist`] will be used for both production and development builds.

This option is used to process your CSS through [Autoprefixer] and determine which Babel transforms to apply through [@babel/preset-env].

**This option determines the browser support of your development build only (`batfish start`).
For production builds (`batfish build`), [`browserslist`] will be used**.

You can also override this value from the CLI with the `--browsers` flag.
If, for example, you spend *most* of your time developing in Chrome 60+, you can run `batfish start --browsers "Chrome >= 60"`, which would dramatically reduce the amount of transformation Babel performs.
When you want to check all the browsers you support in production, you can run `batfish start --browsers false`.

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

- `pages`: An array of objects for pages.
  Each page object includes the following:
  - `path`: The page's URL path.
  - `filePath`: Absolute path to the page's file.
  - `frontMatter`: Parsed front matter from the page's file.

The return values of `dataSelectors` *must be stringifiable as JSON*.
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

If you want to disable this link hijacking altogether, handling it yourself, you can set this option to `false`.

Use this option if you are having trouble with link hijacking or simply don't want it.
If you have a single-page app that completely handles routing on its own (e.g. with React Router), you should set the [`spa`] option to `true`, which turns off link hijacking in addition to other things.

### manageScrollRestoration

Type: `boolean`.
Default `true`.

By default, restoration of scroll state during client-side browser navigation is managed by Batfish (with [scroll-restorer]).

If you want to disable Batfish's scroll restoration altogether, handling it yourself or ignoring it, you can set this option to `false`.

Use this option if you are having trouble with scroll restoration or simply don't want it.
If you have a single-page app that completely handles routing and scroll management on its own (e.g. with React Router), you should set the [`spa`] option to `true`, which turns off scroll restoration in addition to other things.

### spa

Type: `boolean`.
Default: `false`.

**🚨 This option is DEPRECATED, please use [Underreact](https://github.com/mapbox/underreact/).** ️

**Set this option to `true` if you do not need multiple Batfish pages, so do not need Batfish's router.**

If `true`, your app is in SPA mode (single-page app): Batfish expects your app to have only one Batfish page, the landing page, and to handle routing on its own.
The following things happen:

- Link hijacking is disabled (the same as if you set the [`hijackLinks`] option to `false`).
- Scroll restoration is disabled (the same as if you set the [`manageScrollRestoration`] option to `false`).
- Batfish's `Router` is not rendered into your app, which lightens your bundle a little bit.
- [Batfish modules](./batfish-modules.md) that rely on the router, like `routeTo` and `routeChangeListeners`, will not work.
- The chunk for your landing page is bundled up with the main app chunk, instead of separated from it and loaded asynchronously.
- Internal routing is automatically allowed on your landing page (the same as if you set the front matter `internalRouting: true`).
  cf. ["Routing within a page"](./advanced-usage.md#routing-within-a-page).

In SPA mode, you may be able to reduce your build time by using the [`webpackStaticIgnore`] option to reduce the quantity of modules that need to be parsed by Webpack during the build of static HTML files.
For example, if there is loading spinner blocking much of the page until some data is fetched via HTTP, you could put all the content that will replace the spinner (after the data loads) in its own component, then ignore that component during the static build.
That way, Webpack won't parse the component and all of its dependencies — which may even include *all* of your code, if that component includes your client-side router's route definitions and imports components for every route.

To accomplish this, the component for your one page might look something like this:

```jsx
import React from 'react';
import PageShell from '../component/page-shell';
import Spinner from '../component/spinner';

export default class HtmlPage extends React.Component {
  constructor() {
    super();
    this.state = { App: null };
  }

  componentDidMount() {
    // "eager" mode means that in the client-side bundling this import
    // will not create a new async chunk: the code will be included in
    // the main bundle, saving an HTTP request.
    import(/* webpackMode: "eager" */ '../app').then(appModule => {
      this.setState({ App: appModule.default });
    });
  }

  render() {
    const { App } = this.state;
    const content = App ? <App /> : <Spinner />;
    return <PageShell>{content}</PageShell>;
  }
}
```

And in your `batfish.config.js` file you'd use [`webpackStaticIgnore`] so the module at `'../app'` doesn't actually get parsed during the static HTML build:

```js
{ webpackStaticIgnore: [path.join(__dirname, './src/app')] }
```

### webpackLoaders

Type: `Array<Object>`.

Additional loader configuration to pass to Webpack during both Webpack builds (client bundling and HTML generating).
Each object should be a [Webpack Rule](https://webpack.js.org/configuration/module/#rule).

**Warning:** You may need remove the extensions for files your new loader(s) handles from [`fileLoaderExtensions`](#fileloaderextensions).

### webpackPlugins

Type: `Array<Object>`.

Additional plugin configuration to pass to Webpack. These plugins will be included in both the client bundling task and the static HTML rendering task.

For plugins exposed on the `webpack` module itself (e.g. `webpack.DefinePlugin`), **you should use Batfish's version of Webpack instead of installing your own.**
That will prevent any version incompatibilities.
**The Batfish package exposes its version of Webpack as the `webpack` property of its export.**

Here, for example, is how you could use the `DefinePlugin` in your `batfish.config.js`:

```js
const batfish = require('@mapbox/batfish');

module.exports = () => {
  return {
    webpackPlugins: new batfish.webpack.DefinePlugin(..)
  };
}
```

### webpackStaticStubReactComponent

Type: `Array<string>`.

An array of absolute paths to React component modules that you would like to stub during the static Webpack build.
When these files are `import`ed, what you'll get is a simple React component that renders `null`:

```js
module.exports = function StubbedComponent() {
  return null;
};
```

You might want to use this if you are working on a simple app and don't care at all how it initially renders — i.e. a create-react-app-style app where the static HTML that is served contains no content, just waits for the JS to download and execute.

Depending on how you use this option, you may need to set [`staticHtmlInlineDeferCss`] to `false` to avoid a flash of unstyled content.

For more information about the options for this use case, see ["Minimal builds for single-page apps"].

### webpackStaticIgnore

Type: [Webpack `Condition`].

Any modules matching this description will be ignored (with the [ignore-loader](https://github.com/cherrry/ignore-loader)) during the static Webpack build.
**Any dependencies that cannot execute in Node (e.g. because they reference `window` or `document`) should be targeted by this option.**
You may need to other precautions, as well.
But most of the time, this will help you use browser-only libraries without breaking your static build.

### staticHtmlInlineDeferCss

Type: `boolean`.
Default: `true`.

By default, Batfish reads your rendered HTML pages, inlines the CSS that they need, and defers loading the rest of your CSS until after the `DOMContentLoaded` event, so it does not block page rendering.

Usually, this is exactly what you want, giving your users the fastest possible initial render.
However, if you've used [`webpackStaticStubReactComponent`], [`webpackStaticIgnore`], or other means to reduce the amount of HTML that gets generated — so your static HTML does not in fact include all that you need for the page's initial rendering (see ["Minimal builds for single-page apps"])— then the CSS inlined on that HTML page will *not* cover all of its needs.
When the JS downloads and executes and your actual app gets rendered, you might have a flash of unstyled content lasting until the complete CSS (whose loading was deferred) finishes downloading.

To get around this, you can turn off Batfish's optimization by setting `staticHtmlInlineDeferCss: false`.
Batfish will not inline CSS into your HTML pages (which also speeds up your build), and will not defer the loading of your full stylesheet.
Instead, the full stylesheet will be added as a `<link>` to the HTML's `<head>`.

### babelPlugins

Type: `Array<string>`. Default: `[]`.

Additional plugins to pass to Babel during both Webpack builds (client bundling and HTML generating).
**You should `require.resolve()` your plugins.**
Otherwise, Babel might end up looking in the wrong place for the npm package.

*(The prior recommendation to `require` plugins is deprecated. Instead of `require`ing plugins you should `require.resolve` them.)*

For example:

```js
{ babelPlugins: [require.resolve('babel-plugin-transform-fancy-syntax')] }
```

Plugins you provide are concatenated to the following default plugins:

- Always
  - [@babel/plugin-syntax-dynamic-import](https://babeljs.io/docs/plugins/syntax-dynamic-import/)
  - [babel-plugin-transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/)
  - [babel-plugin-transform-object-rest-spread](https://babeljs.io/docs/plugins/transform-object-rest-spread/)
  - [@mapbox/babel-plugin-transform-jsxtreme-markdown](https://github.com/mapbox/jsxtreme-markdown/tree/master/packages/babel-plugin-transform-jsxtreme-markdown): See [`jsxtremeMarkdownOptions`].
- Development only
  - [babel-plugin-transform-react-jsx-source](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-source)
  - [babel-plugin-transform-react-jsx-self](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx-self)
- Production only
  - [babel-plugin-transform-react-remove-prop-types](https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types)

### babelPresets

Type: `Array<string>`. Default: `[]`.

Additional presets to pass to Babel during both Webpack builds (client bundling and HTML generating).
**You should `require.resolve()` your presets.**
Otherwise, Babel might end up looking in the wrong place for the npm package.

*(The prior recommendation to `require` presets is deprecated. Instead of `require`ing presets you should `require.resolve` them.)*

For example:

```js
{ babelPresets: [require.resolve('babel-preset-magic')] }
```

The two presets [@babel/preset-react] and [@babel/preset-env] are automatically applied.
You can pass options to [@babel/preset-env] with the option [`babelPresetEnvOptions`].

### babelPresetEnvOptions

Type: `Object`. [Options for @babel/preset-env].

[@babel/preset-env] is always used.
By default, it receives the following options:

- `useBuiltIns` is `true`.
- `target.browsers` is your [`browserslist`] or [`devBrowserslist`] value (read more about those options to understand when each is used).
- `modules` is `false`.

Use this option to further customize your build by passing any of the other many [options for @babel/preset-env](https://babeljs.io/docs/plugins/preset-env/#options).
It your object will be merged with the defaults — so they will only be overridden if you deliberately do so.

### babelExclude

Type: [Webpack `Condition`].
Default: `/[/\\\\]node_modules[/\\\\]/`. (A nasty regular expression that excludes all nested `node_modules`.)

By default, all packages installed by npm are excluded from Babel compilation (see [`babelExclude`]).
If you'd like to change that (e.g. to exclude more files), provide a valid [Webpack `Condition`].

Make sure your condition somehow excludes the majority of `node_modules` from compilation, or your builds could slow down dramatically.

### babelInclude

Type: `Array<string | Condition>`.
Default: `[]`.

By default, all packages installed by npm are excluded from Babel compilation (see [`babelExclude`]).
If, however, you use a library that includes ES2015+ but does not get compiled for publication (e.g. any of the [promise-fun](https://github.com/sindresorhus/promise-fun) modules), then you'll need to pass that module through Babel.
That's what this option is for.

The easiest way to include an npm package in your compilation is to pass its name as a string.

But if you have more complex needs, any valid [Webpack `Condition`] will work here.
All conditions will be combined with `test: /\.jsx$/` so only `.js` or `.jsx` files are compiled.

Some examples:

To compile `p-queue`:

```js
[`p-queue`]
```

To compile both `p-queue` and `@mapbox/mapbox-gl-style-spec` *except for* its `dist/` directory and any nested `node_modules`:

```js
[
  'p-queue',
  {
    include: path.resolve(__dirname, 'node_modules/@mapbox/mapbox-gl-style-spec'),
    exclude: [
      path.resolve(
        __dirname,
        'node_modules/@mapbox/mapbox-gl-style-spec/dist'
      ),
      path.resolve(
        __dirname,
        'node_modules/@mapbox/mapbox-gl-style-spec/node_modules'
      )
    ]
  }
]
```

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

- `remarkPlugins` and `rehypePlugins` allow you provide [remark](https://github.com/wooorm/remark) and [rehype](https://github.com/wooorm/rehype) plugins, which get applied as your Markdown is converted to a React component.
  There are a wide variety of plugins, from header slug insertions to Markdown syntax extensions to code block syntax highlighting and so on.
- `prependJs` allows you to prepend JS to *every* Markdown page in your site.
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

- **filename** (`string`): Path to the JS file.
- **uglify** (`boolean`, default `true`): Whether or not to process the file with [UglifyJs] before inserting into the `<head>` during the static build.

### sitemap

Type: `boolean`.
Default: `true`.

By default, if you have set [`siteOrigin`] a `sitemap.xml` file will be generated and placed in your [`outputDirectory`] during `batfish build`.
Set this to `false` to skip this step if you do not want a sitemap.

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

For example, if you have a `scripts/` directory and all the `.js` files within it are *not* pages, but are static JavaScript files that you want to expose at `/scripts/*.js` URLs, you could set `unprocessedPageFiles` to `['scripts/**/*.js']`.

### includePages

Type: `Array<string>`.

A whitelist flag which takes an array of globs indicating the pages of your site you want to build. Note, if left empty it will include all pages.

You can use this option during development to speed up your builds by only building the specified pages.
Fewer files will be fed into Webpack, which means the build will go faster.

This is the option that `batfish start --include` manipulates; typically, you'll interface with this option that way, instead of setting it directly in your configuration.

**You should only use this option during development.**

### ignoreWithinPagesDirectory

Type: `Array<string>`.

An array of globs **relative to the [`pagesDirectory`]**.

By default, all files within the [`pagesDirectory`] that are *not* `.js` and `.md` files are copied to corresponding paths in the [`outputDirectory`].
(See ["Non-page files within the pages directory"] for why you might use this feature.)
Sometimes, however, you want to colocate files with your pages and *do not* want those files to be copied into the [`outputDirectory`], because you don't want them to available at public URLs when you deploy your site.

This option allows you to provide globs specifying files in the [`pagesDirectory`] that should *not* be copied.

For example, if you have HTML files in your [`pagesDirectory`] that your JS pages will import with [Webpack's raw-loader], you could prevent them from being copied to the [`outputDirectory`] with `ignoreWithinPagesDirectory: ['**/*.html']`.

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

### pageSpecificCss

Type: `boolean`.
Default:`true`.

Set to `false` to disable Batfish's minimal loader for compiling `.css` with PostCSS and transforming them into React components that you can render as needed.
Read more in ["Page-specific CSS"].

Turning this off will allow you to use different Webpack loaders for `.css` files — whatever suits your preferences.

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

[`babelexclude`]: #babelexclude

[`spa`]: #spa

[`hijacklinks`]: #hijacklinks

[`managescrollrestoration`]: #managescrollrestoration

[`jsxtrememarkdownoptions`]: #jsxtrememarkdownoptions

["injecting data"]: ./advanced-usage.md#injecting-data

["page-specific css"]: ./advanced-usage.md#page-specific-css

[`jsxtrememarkdown.tocomponentmodule`]: https://github.com/mapbox/jsxtreme-markdown#tocomponentmodule

[link-hijacker]: https://github.com/mapbox/link-hijacker

[webpack `condition`]: https://webpack.js.org/configuration/module/#condition

[@babel/preset-react]: https://babeljs.io/docs/plugins/preset-react/

[@babel/preset-env]: https://babeljs.io/docs/plugins/preset-env/

[`babelpresetenvoptions`]: #babelpresetenvoptions

[options for @babel/preset-env]: https://babeljs.io/docs/plugins/preset-env/#options

["non-page files within the pages directory"]: ../README.md#non-page-files-within-the-pages-directory

[webpack's raw-loader]: https://github.com/webpack-contrib/raw-loader

[scroll-restorer]: https://github.com/mapbox/scroll-restorer

[`webpackstaticignore`]: #webpackstaticignore

[`webpackstaticstubreactcomponent`]: #webpackstaticstubreactcomponent

[`statichtmlinlinedefercss`]: #statichtmlinlinedefercss

[`devbrowserslist`]: #devbrowserslist

[`browserslist`]: #browserslist

[`siteorigin`]: #siteorigin

[`sitemap`]: #sitemap

["minimal builds for single-page apps"]: ./advanced-usage.md#minimal-builds-for-single-page-apps
