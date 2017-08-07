# Batfish

[![Build Status](https://travis-ci.org/mapbox/batfish.svg?branch=master)](https://travis-ci.org/mapbox/batfish)

A minimalistic static-site generator powered by React and Webpack.

🚧🚧  **WORK IN PROGRESS!** 🚧🚧

![The batfish](https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Longnose_batfish.jpg/320px-Longnose_batfish.jpg)

## Table of contents

-   [Goals](#goals)
-   [Usage](#usage)
-   [Requirements](#requirements)
-   [API](#api)
-   [Configuration](#configuration)
    -   [CLI](#cli)
    -   [Node API](#node-api)
-   [Pages](#pages)
    -   [JS pages](#js-pages)
    -   [Markdown pages](#markdown-pages)
        -   [Markdown page wrapper components](#markdown-page-wrapper-components)
        -   [Import JS modules into jsxtreme-markdown](#import-js-modules-into-jsxtreme-markdown)
    -   [Non-page files with in the pages directory](#non-page-files-with-in-the-pages-directory)
    -   [Path not found: 404](#path-not-found-404)
-   [Routing](#routing)
    -   [Links](#links)
    -   [Prefixing URLs](#prefixing-urls)
-   [CSS](#css)
-   [Document &lt;head>](#document-head)
-   [Development server](#development-server)
-   [Advanced usage](#advanced-usage)

## Goals

Batfish provides _the essentials_ for building excellent static websites with React and Webpack.

-   **(Universal) React.**
    Use React components as the building blocks for your pages.
    Your React code is "universal" because the components are rendered into HTML pages at build time and then mounted in the browser for interactivity at run time.
-   **Super-powered Markdown pages.**
    Markdown pages that are even more powerful than [Jekyll's](https://jekyllrb.com/) with interpolated JS expressions and JSX elements.
-   **Client-side routing with key features and minimal overhead.**
    There is often no need for a big router library, but there _is_ a need for often-overlooked features like automatic link hijacking and scroll restoration.
-   **Essential optimizations.**
    JS bundles split up by page and loaded on demand.
    Essential CSS injected into static HTML.
    Hashed asset filenames for long-term caching.
    And so on.
-   **Minimal configuration.**
    Though almost every user will want to set a couple of configuration properties, you might not need more than that — and none are required.
-   **Minimal.**
    Batfish does not aim to be an ecosystem unto itself.
    Instead, we've kept the codebase small and extracted any generalizable functionality into independent npm packages, like [jsxtreme-markdown], [link-hijacker], and [scroll-restorer].
    You can use these packages outside of Batfish — they are not coupled to Batfish conventions or configuration.

## Usage

1.  Create a [configuration] module.
2.  Create some [pages] as React components and/or Markdown documents.
3.  Start the development server and work on your pages.
4.  At some point, build your static site and deploy it.

Have a look at [`examples/basic/`](examples/basic) for a simple example project.

## Requirements

-   You'll need Node >=4.
-   The client-side code has been tested down to IE11.
    To support IE11, **a Promise polyfill is included by default.**
    If you would like to provide your own Promise polyfill, set the [`includePromisePolyfill`] option to `false`.

## API

## Configuration

See [`docs/configuration.md`](docs/configuration.md) to learn about all the ways you can configure Batfish.

### CLI

The CLI has three commands:

-   `start`: Start a development server.
-   `build`: Build the static site.
-   `serve-static`: Serve the static site.

All commands will look for your configuration module in the current working directory or where you point with the `--config` option.

For more details, run `batfish --help`.

**You should not install the Batfish CLI globally.**
Install Batfish as an npm dependency and use the CLI via npm `"scripts"`, npx, or `node_modules/.bin/batfish`.

### Node API

The Node API exposes three functions:

-   `start(batfishConfig?: Object, projectDirectory?: string): void`: Start a development server.
-   `build(batfishConfig?: Object, projectDirectory?: string): Promise<void>`: Build the static site.
    Returns a Promise that resolves when the build is complete.
-   `serveStatic(batfishConfig?: Object, projectDirectory?: string): void`: Serve the static site.

In all of the above, the `projectDirectory` argument is used to determine configuration defaults if you have not provided certain options (e.g. [`pagesDirectory`], [`outputDirectory`]).
It defaults to the current working directory.

## Pages

**The structure of your [`pagesDirectory`] determines the URLs of your site.**
JS and Markdown files map directly to distinct URLs.
So `src/pages/industries/real-estate.js` corresponds to the URL `/industries/real-estate/`.

When a page is rendered, its component is passed the following props:

-   `location`: The browser's current [Location](https://developer.mozilla.org/en-US/docs/Web/API/Location).
-   `frontMatter`: The page's parsed front matter (minus any `siteData` array)
-   `siteData`: Any site-wide data that the page has selected for injection.

### JS pages

JS pages must export a single React component, with either `export default` (ES2015 modules) or `module.exports` (Node.js modules).

JS pages can include front matter within block comments, delimited by `/*---` and `---*/`.

Here's an example:

```js
/*---
title: Power tie catalog
---*/
import React from 'react';

export default class PowerTiePage extends React.PureComponent {
  render() {
    return (
      <div>
        <h1>{this.props.frontMatter.title}</h1>
        <p>Content forthcoming ...</p>
      </div>
    );
  }
}
```

### Markdown pages

Markdown pages can include front matter, delimited by `---` and `---`, as is the norm.

These files are interpreted as [jsxtreme-markdown](https://github.com/mapbox/jsxtreme-markdown), so **the Markdown text can include interpolated JS expressions and JSX elements!**
They are transformed into React components.

All the props for the page (`frontMatter`, `siteData`, etc.) are available on `props`, e.g. `props.frontMatter.title`.

#### Markdown page wrapper components

You'll probably want to specify a wrapper component for each of your Markdown pages.
(Unless you have a single site-wide wrapper that works for all pages.)
It should be a React component that accepts the page's props and renders the Markdown content as `{this.props.children}`.
Because it will receive the page's front matter as `this.props.frontMatter`, you can use front matter to fill out different parts of the wrapper (just like a Jekyll layout).

Example:

```js
// blog-post-wrapper.js
import React from 'react';
import { MyPageShell } from './my-page-shell';

export default class BlogPostWrapper extends React.PureComponent {
  render() {
    const { frontMatter } = this.props;
    return (
      <MyPageShell>
        <h1>{frontMatter.title}</h1>        
        <p>
          <strong>Summary:</strong> {frontMatter.summary}
        </p>        
        <p>
          Posted on {frontMatter.date}
        </p>
        {this.props.children}
      </MyPageShell>
    );
  }
}
```

```markdown
---
wrapper: '../path/to/blog-post-wrapper'
title: Today I cleaned my refrigerator
summary: You can't put off your responsibilities forever, and refrigerators do not clean themselves. So I cleaned my refrigerator.
date: January 7, 2016
---

## Why did I do it

Things had started to smell ...

## How did I do it

I love shopping for cleaning supplies ...
```

#### Import JS modules into jsxtreme-markdown

In jsxtreme-markdown components, you can specify JS modules to import and use within the interpolated code using `prependJs` front matter.
List lines of `import` or `require` statements that define variables you can use in your interpolated JS and JSX.

By default, the following lines are specified:

-   `import prefixUrl from '@mapbox/batfish/modules/prefix-url'`: See [Prefixing URLs].
-   `import routeTo from '@mapbox/batfish/modules/route-to')`: See [Dynamically changing pages].

This means that these functions can be used with no additional configuration.
Import your own modules and do more things.

Example:

```markdown
---
prependJs:
  - "import { myDateFormatter } from './path/to/my-date-formatter';"
---

Learn more about [security]({{prefixUrl('/about/security')}}).

Today is {{myDateFormatter('2015-08-21')}}
```

### Non-page files with in the pages directory

Sometimes you need to put an asset at a specific URL.
You may want a `favicon.ico` in the root directory, for example; or a special image for social media `<meta>` tags on a page.
For this reason, **any non-page files within the [`pagesDirectory`] are copied directly into the same location during the static build.**

_When you access these files from pages, though, you need to use root-relative or absolute URLs._
That is, within `src/pages/foo/bar.js` you cannot access `src/pages/foo/bar.jpg` as `bar.jpg`: you need to use `/foo/bar.jpg`.
You may want to [prefix the URLs](#prefixing-urls), also.

### Path not found: 404

Create a custom 404 pages by adding `404.js` (or `404.md`) to the root of your [`pagesDirectory`].

In development, you can expect to see your 404 page by entering an invalid path.
When you build for [`production`], though, your 404 page will need to be handled and rendered by the server.
(If you run your [`production`] build locally with `serve-static`, expect to see `Cannot GET /yourInvalidPathHere`.)

## Routing

### Links

**You can use regular `<a>` elements throughout your site.**
When the user clicks a link, Batfish checks to see if the link's `href` refers to a page it knows about.
If so, client-side routing is used.
If not, the link behaves normally.

If you would like to use an `<a>` without this hijacking (e.g. for your own internal routing within a page), you can give it the attribute `data-no-hijack`.

This is all accomplished with [link-hijacker].

### Prefixing URLs

Batfish exposes the module `@mapbox/batfish/modules/prefix-url`.

Use this to prefix your URLs according to the [`siteBasePath`] and [`siteOrigin`] you specified in your configuration, ensuring that they point to the right place both during development and in production.

```js
// Let's imagine:
// - siteBasePath === '/about/jobs/'
// - siteOrigin === 'https://mydomain.com'
const prefixUrl = require('@mapbox/batfish/modules/prefix-url');

// The function prefixes a URL with siteBasePath
prefixUrl('engineer') // -> '/about/jobs/engineer'

// You can also prefix an absolute path, if you've provided siteOrigin
prefixUrl.absolute('engineer') // -> 'https://mydomain.com/about/jobs/engineer'
```

## CSS

Add stylesheets to your site with the [`stylesheets`] configuration option.
List all your stylesheets, URLs or filepaths, in the order you'd like, and Batfish will concatenate them together and add them to the build.
You can also pass them through whatever [PostCSS] plugins you'd like.

**During the static build, each page has its relevant CSS injected inline, and the complete stylesheet is loaded lazily, after the rest of the page is rendered.**
This optimization ensures that the loading of an external stylesheet does not block rendering, and your page content is visible as quickly as possible.
(This is accomplished with [postcss-html-filter].)

`url()`s referenced in your stylesheets will be hashed and copied to Batfish's [`outputDirectory`].

_Why not use a Webpack loader and allow `import` or `require` for CSS?_
We've found that getting CSS to load in the way we want it to (for both the development server and the static build) has been messy, buggy, and slow enough via existing Webpack patterns that we decided to step outside of Webpack for this part of the build.
However, you can add more Webpack loaders and plugins to accomplish this in your preferred way, if you'd like, using the [`webpackLoaders`] and [`webpackPlugins`] configuration options.

## Document `<head>`

**Use [react-helmet] to add things your document `<head>`.**

Batfish has a [peer dependency](https://nodejs.org/en/blog/npm/peer-dependencies/) on [react-helmet].

## Development server

The development server (for `start` and `serve-static` commands) is a [Browsersync] server, for easy cross-device testing.

Usually when you change a file, Webpack will recompile and the browser will automatically refresh.
However, **the browser will not automatically refresh for the following changes**:

-   Adding or removing a page.
-   Changing a page's front matter.

When you do one of these things, restart the server to see your change.

## Advanced usage

Additional documentation can be found in [`docs/advanced-usage.md`](docs/advanced-usage.md).

[configuration]: #configuration

[pages]: #pages

[prefixing urls]: #prefixing-urls

[dynamically changing pages]: docs/advanced-usage.md#dynamically-changing-pages

[`pagesdirectory`]: docs/configuration.md#pagesdirectory

[`outputdirectory`]: docs/configuration.md#outputdirectory

[`dataselectors`]: docs/configuration.md#dataselectors

[`sitebasepath`]: docs/configuration.md#sitebasepath

[`siteorigin`]: docs/configuration.md#siteorigin

[`production`]: docs/configuration.md#production

[`stylesheets`]: docs/configuration.md#stylesheets

[`includepromisepolyfill`]: docs/configuration.md#includepromisepolyfill

[`webpackloaders`]: docs/configuration.md#webpackloaders

[`webpackplugins`]: docs/configuration.md#webpackplugins

[jsxtreme-markdown]: https://github.com/mapbox/jsxtreme-markdown

[link-hijacker]: https://github.com/mapbox/link-hijacker

[scroll-restorer]: https://github.com/mapbox/scroll-restorer

[babel-plugin-transform-jsxtreme-markdown]: https://github.com/mapbox/babel-plugin-transform-jsxtreme-markdown

[react-helmet]: https://github.com/nfl/react-helmet

[browsersync]: https://www.browsersync.io/

[postcss-html-filter]: https://github.com/mapbox/postcss-html-filter

[postcss]: http://postcss.org/
