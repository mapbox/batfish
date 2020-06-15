# Batfish

[![Build Status](https://travis-ci.org/mapbox/batfish.svg?branch=main)](https://travis-ci.org/mapbox/batfish)

A static-site generator powered by React and Webpack.

![](./batfish-dark.png)

## Table of contents

- [Other documentation to check out](#other-documentation-to-check-out)
- [Goals](#goals)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [API](#api)
  - [Configuration](#configuration)
  - [CLI](#cli)
  - [Node API](#node-api)
- [Pages](#pages)
  - [JS pages](#js-pages)
  - [Markdown pages](#markdown-pages)
  - [Non-page files within the pages directory](#non-page-files-within-the-pages-directory)
  - [Path not found: 404](#path-not-found-404)
- [Routing](#routing)
  - [Links](#links)
  - [Prefixing URLs](#prefixing-urls)
  - [Programmatically changing pages](#programmatically-changing-pages)
- [CSS](#css)
- [Document `<head>`](#document-head)
- [Development server](#development-server)
- [Advanced usage](#advanced-usage)
- [Comparison to other React-powered static-site generators](#comparison-to-other-react-powered-static-site-generators)

## Other documentation to check out

- [`docs/q-and-a.md`](docs/q-and-a.md)
- [`docs/configuration.md`](docs/configuration.md)
- [`docs/advanced-usage.md`](docs/advanced-usage.md)
- [`docs/batfish-modules.md`](docs/batfish-modules.md)
- [`docs/cli.md`](docs/cli.md)
- [`docs/node-api.md`](docs/node-api.md)

## Goals

Batfish aims to provide *the essentials* for building excellent static websites with React and Webpack.

- **(Universal) React.**
  Use React components as your building blocks.
  Your components are rendered into HTML pages at build time and then mounted in the browser for interactivity at run time.
- **Super-powered Markdown pages.**
  Batfish supports [jsxtreme-markdown] pages, which allow for interpolated JS expressions and JSX elements.
- **Client-side routing with key features and minimal overhead.**
  There is often no need for a big router library, but there *is* a need for often-overlooked features like automatic link hijacking (via [link-hijacker]) and scroll restoration (via [scroll-restorer]).
- **Essential optimizations.**
  JS bundles split by page and loaded on demand.
  Hashed asset filenames for long-term caching.
  Essential CSS injected into static HTML (via [postcss-html-filter]).
  And so on.
- **Minimal configuration.**
  Though almost every user will want to set a couple of configuration properties, you might not need more than that — and none are required.
- **Minimal.**
  Batfish does not aim to be an ecosystem unto itself.
  Instead, we've kept the codebase focused on a finite set of problems, while allowing extensibility by providing clear access to the underlying tools (React, Webpack, and Babel).
  We've also tried to abstract generalizable functionality into independent npm packages, like [jsxtreme-markdown], [link-hijacker], and [scroll-restorer].
  You can use these packages outside of Batfish — they are not coupled to Batfish conventions or configuration.

## Installation

You will need:

- Node 10
- npm 6

If you're not sure if your Node and NPM versions are up to date, run `nvm use` before installing dependencies. If you don't have NVM installed, you can [find installation instructions here](https://github.com/nvm-sh/nvm/blob/master/README.md#installing-and-updating).

Besides installing this package, you'll want to do a few things:

- Install the peer dependencies:
  ```
  npm install --save react react-dom react-helmet
  ```
- Add `_batfish*` to your `.gitignore`, and maybe other ignore files (e.g. `.eslintignore`).
  Batfish generates files and puts them in `_batfish_site` and `_batfish_tmp`.

```
npm install --save @mapbox/batfish
```

**You should not install the Batfish CLI globally.**
Install Batfish as an npm dependency for your project, then use the CLI via npm `"scripts"`, npx, or `node_modules/.bin/batfish`.

The easiest way to do this is to set up npm scripts in `package.json`, like so:

```
"scripts": {
  "start": "batfish start",
  "build": "batfish build",
  "serve-static": "batfish serve-static"
}
```

Then run `npm run start`, `npm run build`, and `npm run serve-static`, as needed.

## Getting Started

**The bare minimum to get started with Batfish.**

- Install Batfish and its peer dependencies.
  ```
  npm install --save @mapbox/batfish react react-dom react-helmet
  ```

- Create 3 new `script`s in your `package.json`:
  ```
  "start": "batfish start",
  "build": "batfish build",
  "serve-static": "batfish serve-static",
  ```

- Create your first page file at `src/pages/index.js`.

- Export from that page file a React component that renders something. Maybe something like this:

  ```jsx
  import React from 'react';

  export default class Home extends React.Component {
    render() {
      return (
        <div>Hello world</div>
      );
    }
  }
  ```

- Run `npm run start`.

- Open the URL printed in your terminal.

- Build your website.

- When you're ready to deploy, run `npm run build` to build the site for production, then `npm run serve-static` to check out the production site, which was written to `_batfish_site/`.

- Put your `_batfish_site/` directory on the Internet.

If you need to add configuration, create a `batfish.config.js` module in your project root.
See ["Configuration"](#configuration).

Look at [`examples/basic/`](examples/basic) for a simple example project.
Look at [`examples/no-config/`](examples/no-config) for a project with no configuration.
Or [`examples/miscellany/`](examples/miscellany), for a more advanced example project.

## API

### Configuration

By default, all Batfish CLI commands look for `batfish.config.js` at the root of your project.
It should export a function that returns your configuration object.

For example:

```js
module.exports = () => {
  return {
    siteBasePath: '/my/site/base/path',
    siteOrigin: 'https://www.mydomain.com'
    // Add more configuration options here ...
  };
}
```

See [`docs/configuration.md`](docs/configuration.md) to learn about all the ways you can configure Batfish.

### CLI

The CLI has the following commands:

- `start`: Start a development server and watch files for changes, rebuilding and refreshing as needed.
- `build`: Build the static site.
- `serve-static`: Serve the static site.
- `write-babelrc`: Write a `.babelrc` file that other processes, like your test runner, can use.

All commands will look for your configuration module in the current working directory or where you point with the `--config` option.

For more details, run `batfish --help` or see [`docs/cli.md`](docs/cli.md).

**You should not install the Batfish CLI globally.**
Install Batfish as an npm dependency and use the CLI via npm `"scripts"`, npx, or `node_modules/.bin/batfish`.

### Node API

Usually you should use the Batfish CLI.
But for those special cases when you want absolute control within a Node process, all the CLI's functionality is available in a Node API.

See [`docs/node-api.md`](docs/node-api.md).

## Pages

**The structure of your [`pagesDirectory`] determines the URLs of your site.**
JavaScript (`.js`) and Markdown (`.md`) files map directly to corresponding URLs.

So `src/pages/industries/real-estate.js` corresponds to the URL `/industries/real-estate/`,
and `src/pages/about/index.md` corresponds to the URL `/about/`.

When a page is rendered, its component is passed the following props:

- `location`: The browser's current [Location](https://developer.mozilla.org/en-US/docs/Web/API/Location).
  (During the static build, this will only include the `pathname` property.)
- `frontMatter`: The page's parsed front matter (parsed by [gray-matter]).

### JS pages

JS pages must export a React component with either `export default` (ES2015 modules) or `module.exports` (Node.js modules).

JS pages can include front matter within block comments, delimited by `/*---` and `---*/`.

For example:

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

Markdown pages can include front matter delimited by `---`.

**These files are interpreted as [jsxtreme-markdown], so the Markdown text can include interpolated JS expressions and JSX elements!**
They are transformed into React components.

All the props for the page (e.g. `frontMatter`, `location`) are available on `props`, e.g. `props.frontMatter.title`.

For example:

```md
---
title: Power tie catalog
---

# {{ props.frontMatter.title }}

Content forthcoming ...
```

If you haven't seen [jsxtreme-markdown] before, [try it out online](https://mapbox.github.io/jsxtreme-markdown/).

#### Markdown page wrapper components

You need a wrapper component for each of your Markdown pages.
You can specify a site-wide default wrapper, and also wrappers for specific Markdown pages.
The wrapper component should be a React component (the default export of its module) which accepts the page's props and renders the Markdown content as `{this.props.children}`.
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

The front matter passed to Markdown wrapper components is augmented with a `headings` field, which contains an array of data about the headings in the Markdown.
This data includes `slug`s that correspond to `id` attributes automatically added to the heading elements; so you can use this to generate a table of contents.
(Read more in ["Generating tables of contents for Markdown pages"].)

See [`examples/miscellany/`](examples/miscellany) and [`examples/table-of-contents/`](examples/table-of-contents) to learn more about what's possible with Markdown wrappers.

#### Import JS modules into jsxtreme-markdown

In jsxtreme-markdown components, you can specify JS modules to import and use within the interpolated code using [`prependJs` front matter](https://github.com/mapbox/jsxtreme-markdown/tree/master/packages/jsxtreme-markdown#prependjs).
List lines of `import` or `require` statements that define variables you can use in your interpolated JS and JSX.

By default, the following lines are always specified:

- `import prefixUrl from '@mapbox/batfish/modules/prefix-url'`: See [Prefixing URLs].
- `import routeTo from '@mapbox/batfish/modules/route-to')`: See docs for the [`route-to`] module.

This means that those functions can be used with no additional configuration.
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

### Non-page files within the pages directory

Sometimes you need to put an asset at a specific URL.
You may want a `favicon.ico` in the root directory, for example; or a special image for social media `<meta>` tags on a page.
For this reason, **any non-page files within the [`pagesDirectory`] are copied directly into the same location during the static build.**

*When you access these files from pages, though, you need to use root-relative or absolute URLs.*
That is, within `src/pages/foo/bar.js` you cannot access `src/pages/foo/bar.jpg` as `bar.jpg`: you need to use `/foo/bar.jpg`.
You may want to [prefix the URLs](#prefixing-urls), also.

### Path not found: 404

Create a custom 404 page by adding `404.js` (or `404.md`) to the root of your [`pagesDirectory`].

In development, you can expect to see your 404 page by entering an invalid path.
When you build for [`production`], though, your 404 page will need to be handled and rendered by the server.
(If you run your [`production`] build locally with `serve-static`, expect to see `Cannot GET /yourInvalidPathHere`.)

## Routing

Batfish builds you a minimal client-side router with Webpack bundle splitting by page.

### Links

**You can use regular `<a>` elements throughout your site.**
When the user clicks a link, Batfish checks to see if the link's `href` refers to a page it knows about.
If so, client-side routing is used.
If not, the link behaves normally.

If you would like to use an `<a>` without this link-hijacking (e.g. for your own internal routing within a page), you can give it (or one of its ancestor elements) the attribute `data-batfish-no-hijack`.

This is all accomplished with [link-hijacker].

### Prefixing URLs

To prefix URLs with your [`siteBasePath`] and [`siteOrigin`] configuration options, use the [`prefix-url`] module.

### Programmatically changing pages

To change pages programmatically, with JavaScript, use the [`route-to`] module.

## CSS

Add stylesheets to your site with the [`stylesheets`] configuration option.
List all your stylesheets, URLs or filepaths, in the order you'd like, and Batfish will concatenate them together and add them to the build.
You can also pass them through whatever [PostCSS] plugins you'd like, with the [`postcssPlugins`] configuration option.

**During the static build, each page has its relevant CSS injected inline, and the complete stylesheet is loaded lazily, after the rest of the page is rendered.**
This optimization ensures that the loading of an external stylesheet does not block rendering, and your page content is visible as quickly as possible.
(This is accomplished with [postcss-html-filter].)

Assets referenced by `url()`s in your stylesheets will be hashed and copied to Batfish's [`outputDirectory`].

You can also add page-specific CSS (processed through the same PostCSS pipeline), if you find yourself adding lots of CSS rules that are not used on multiple pages.
Read more about ["Page-specific CSS"].

**If you want to bypass this CSS system and use your own, just do it.**
You can use the [`webpackLoaders`] and [`webpackPlugins`] configuration options to do whatever you need.

(Curious or concerned? Check out the [Q&A entries about CSS](docs/q-and-a.md).)

## Document `<head>`

**Use [react-helmet] to add things the document `<head>`**, (e.g. `<title>` and `<meta>` tags).

Batfish has a [peer dependency](https://nodejs.org/en/blog/npm/peer-dependencies/) on [react-helmet].
You definitely want to use it.
A good pattern is to create a `PageShell` React component that accepts props that it uses to populate that page's `<head>`.

## Development server

The development server (for `start` and `serve-static` commands) is a [Browsersync] server, which provides a nice experience for cross-device testing.

When you change a file, Webpack will recompile and the browser will automatically refresh.

(Why not hot module reloading?
Seemed like more trouble than it's worth.
But if you want to help add the feature, please open an issue.)

## Advanced usage

Additional documentation can be found in [`docs/advanced-usage.md`](docs/advanced-usage.md).

## Comparison to other React-powered static-site generators

We built Batfish by systematically addressing a set of problems we've had while building websites with React components.
We focused first on the problems themselves, trying to develop effective and focused, minimalistic solutions.
Sometimes this meant we used a popular tool, like Webpack.
Other times we sidestepped a popular tool, like React Router, and opted to build something more fitted to our needs.

As a result, Batfish is smaller and less ambitious than projects like [Gatsby](https://www.gatsbyjs.org/) and [Next.js](https://github.com/zeit/next.js/).
It's a thinner wrapper over the underlying tools, not an ecosystem of its own — more of a gateway into existing ecosystems.

Batfish also includes some features that we considered important but are overlooked by similar projects, like powerful Markdown integration and link hijacking.
(Though we tried to build such features in such a way that they could be re-used in other contexts.
  Try [jsxtreme-markdown] in your Gatsby site!)

Since we use Batfish for vital projects, we prioritize the needs of end-users (website visitors) and the stability, simplicity, and clarity of the system.

Please let us know what you think!

![The batfish](https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Longnose_batfish.jpg/320px-Longnose_batfish.jpg)

[configuration]: #configuration

[pages]: #pages

[prefixing urls]: #prefixing-urls

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

[react-helmet]: https://github.com/nfl/react-helmet

[browsersync]: https://www.browsersync.io/

[postcss-html-filter]: https://github.com/mapbox/postcss-html-filter

[postcss]: http://postcss.org/

["injecting data"]: docs/advanced-usage.md#injecting-data

[`postcssplugins`]: docs/configuration.md#postcssplugins

[gray-matter]: https://github.com/jonschlinkert/gray-matter

[`route-to`]: docs/batfish-modules.md#route-to

[`prefix-url`]: docs/batfish-modules.md#prefix-url

["page-specific css"]: docs/advanced-usage.md#page-specific-css

["generating tables of contents for markdown pages"]: docs/advanced-usage.md#generating-tables-of-contents-for-markdown-pages
