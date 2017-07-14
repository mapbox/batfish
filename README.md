# Batfish

A minimalistic static-site generator powered by React and Webpack.

🚧🚧  **WORK IN PROGRESS!** 🚧🚧

![The batfish](https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Longnose_batfish.jpg/320px-Longnose_batfish.jpg)

## Goals

Batfish provides *the essentials* for building excellent static websites with React and Webpack.

- **(Universal) React.**
  Use React components as the building blocks for pages.
  "Universal" means the components are rendered into HTML pages at build time, and then mounted in the browser for interactivity at run time.
- **Super-powered Markdown pages.**
Markdown pages that are even more powerful than [Jekyll's](https://jekyllrb.com/) with interpolated JS expressions and JSX elements.
- **Client-side routing with key features and minimal overhead.**
  There is often no need for a big router library, but there *is* a need for often-overlooked features like automatic link hijacking and scroll restoration.
- **Essential optimizations.**
  JS bundles split up by page and loaded on demand.
  Essential CSS injected into static HTML.
  Hashed asset filenames for long-term caching.
  And so on.
- **Minimal configuration.**
  So far there are no required options!
- **Minimal (period).**
  Batfish does not aim to be an ecosystem unto itself.
  Instead, we've kept the codebase small and extracted any generalizable functionality into independent npm packages, like [jsxtreme-markdown], [link-hijacker], and [scroll-restorer].

## Usage

1. Create a [configuration] module (or don't, if you want to rely on defaults).
1. Create some [pages] as React components and/or Markdown documents.
1. Start the development server, or build a static site and start the static-site server.
1. At some point, build your static site and deploy it.

<!-- toc -->

- [API](#api)
  * [CLI](#cli)
  * [Node API](#node-api)
- [Pages](#pages)
  * [JS pages](#js-pages)
  * [Markdown pages](#markdown-pages)
    + [Markdown page wrapper components](#markdown-page-wrapper-components)
    + [Import JS modules into jsxtreme-markdown](#import-js-modules-into-jsxtreme-markdown)
  * [Non-page files with in the pages directory](#non-page-files-with-in-the-pages-directory)
  * [Injecting data](#injecting-data)
  * [Path not found: 404](#path-not-found-404)
  * [Draft pages](#draft-pages)
  * [Page-specific CSS](#page-specific-css)
  * [Routing within a page](#routing-within-a-page)
- [Configuration](#configuration)
- [Markdown within JS](#markdown-within-js)
- [Routing](#routing)
  * [Prefixing URLs](#prefixing-urls)
  * [Links](#links)
  * [Dynamically changing pages](#dynamically-changing-pages)
- [Document ``](#document-)
- [Development server](#development-server)
- [Example sites](#example-sites)
  * [Running examples](#running-examples)
  * [Creating a new example](#creating-a-new-example)

<!-- tocstop -->

## API

### CLI

The CLI has three commands:

- `start`: Start a development server.
- `build`: Build the static site.
- `serve-static`: Serve the static site.

All commands will look for your configuration module in the current working directory or where you point with the `--config` option.

For more details, run `batfish --help`.

### Node API

The Node API exposes three functions:

- `start(batfishConfig?: Object, projectDirectory?: string): void`: Start a development server.
- `build(batfishConfig?: Object, projectDirectory?: string): Promise<void>`: Build the static site.
  Returns a Promise that resolves when the build is complete.
- `serveStatic(batfishConfig?: Object, projectDirectory?: string): void`: Serve the static site.

In all of the above, the `projectDirectory` argument is used to determine configuration defaults if you have not provided certain options (e.g. [`pagesDirectory`], [`outputDirectory`]).
It defaults to the current working directory.

## Pages

**The structure of your [`pagesDirectory`] determines the URLs of your site.**
JS and Markdown files map directly to distinct URLs.
So `src/pages/industries/real-estate.js` corresponds to the URL `/industries/real-estate/`.

When a page is rendered, its component is passed the following props:

- `location`: The browser's current [Location](https://developer.mozilla.org/en-US/docs/Web/API/Location).
- `frontMatter`: The page's parsed front matter (minus any `siteData` array)
- `siteData`: Any site-wide data that the page has selected for injection.

### JS pages

JS pages must export a single React component (either `module.exports` (Node.js modules) or `export default` (ES2015 modules)).

JS pages can include front matter within block comments, delimited by `/*---` and `---*/`.

Here's an example:

```jsx
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

```jsx
// blog-post-wrapper.js
import React from react';
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

```md
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

In jsxtreme-markdown components, you can specify JS modules to import and use within the interpolated code using `modules` front matter.
By default, the following modules are specified:

- `import prefixUrl from 'batfish/prefix-url'`: See [Prefixing URLs].
- `import routeTo from 'batfish/route-to')`: See [Dynamically changing pages].

This means that these modules can be used with no additional configuration.
Import your own modules and do more things.

Example:

```md
---
modules:
  - `import { myDateFormatter } from './path/to/my-date-formatter';
---

Learn more about [security]({{prefixUrl('/about/security')}}).

Today is {{myDateFormatter('2015-08-21')}}
```

### Non-page files with in the pages directory

Sometimes you need to put an asset at a specific URL.
A `favicon.ico` in the root directory, for example; or a special image for social media `<meta>` tags on a page.
For this reason, any non-page files within the [`pagesDirectory`] are copied directly into the same location during the static build.

*When you access these files from pages, though, you need to use root-relative or absolute URLs.*
That is, within `src/pages/foo/bar.js` you cannot access `src/pages/foo/bar.jpg` as `bar.jpg`: you need to use `/foo/bar.jpg`.
(You may want to [prefix the URLs](#prefixing-urls)).

### Injecting data

You can store data in JSON or JS, anywhere in your project, then specify which specific data to inject into any given page.

To register data and data selectors, use the [`data`] and [`dataSelectors`] options in your configuration.

To select data to be injected into a page, then, provide `siteData` front matter that is a [sequence](http://www.yaml.org/spec/1.2/spec.html#style/block/sequence) of strings, each representing one of the following:

- A key in the `data` object. In this case, the entire value will be injected.
- A key in the `dataSelectors` object. In this case, the return value from that selector will be injected.

Example:

```jsx
// batfish.config.js
module.exports = () => {
  return {
    /* ... */
    data: {
      cta: 'Buy now!',
      siteTitle: 'Place to buy things'
    },
    dataSelectors: {
      posts: data => {
        return data.pages.filter(pagesData => /\/posts\//.test(pagesData.path));
      },
      things: data => { /* ... */ }
    }
  };
};

// Page
/*---
siteData:
  - cta
  - posts
---*/
const React  = require('react');
class MyPage extends React.PureComponent {
  render() {
    return (
      <div>
        <h1>Page!</h1>
        <p>Here is our call to action: {this.props.siteData.cta}</p>
        <h2>Posts</h2>
        {this.props.siteData.posts.map(post => {
          return (
            <div key={post.path}>
              <a href={post.path}>{post.data.title}</a>
            </div>
          );
        })}
      </div>
    );
  }
}
```

### Path not found: 404

Note that adding the [`notFoundPath`] property is optional in your `batfish.config.js`.
By default, it looks for a `404.js` in your directory.
If you provide [`notFoundPath`] a valid string path, the 404s will point to this absolute path.

In development, you can expect to see your 404 page by entering an invalid path.
When you build for [`production`], though, your 404 page will need to be handled and rendered by the server.
(If you run your [`production`] build locally with `serve-static`, expect to see `Cannot GET /yourInvalidPathHere`.)

### Draft pages

Any page with the front matter `published: false` will be considered a draft page.

In development, draft pages are built and visible.
However, in [`production`] builds these pages are **not** included and should be handled with a 404 by the server.

### Page-specific CSS

By default, all CSS you include with Webpack (via `require` or `import`) will be bundled together.
**During the static build, each page has the CSS relevant to it injected inline, and the complete stylesheet is loaded lazily, after the rest of the page is rendered.**
This optimization ensures that the loading of an external stylesheet does not block rendering, and your page content is visible as quickly as possible.

Sometimes, however, you want to include CSS that will *never* be used on other pages, so you don't want it to be included in the complete stylesheet.

To do that, create CSS files within the [`pagesDirectory`] — preferably adjacent to the page that uses them.
Import a page-specific CSS from the page that will use it: expect a React component that you can render in your page.

Example:

```jsx
const AboutCss = require('./about.css');
class AboutPage extends React.PureComponent {
  render() {
    return (
      <PageShell>
        <AboutCss />
        {/* The rest of the page content */}
      </PageShell>
    );
  }
}
```

### Routing within a page

If you'd like to use a different client-side routing library *within a page*, like [React Router](https://reacttraining.com/react-router/) or [nanorouter](https://github.com/yoshuawuyts/nanorouter), add `internalRoutes: true` to the page's front matter.

By specifying that the page has internal routes, any URLs that *start with* the page's path will be considered matches.
If the page is `pages/animals.js`, for example, then `/animals/` will match as usual, but `/animals/tiger/` and `/animals/zebra/` will *also* match.
The client-side router you use within the page can determine what to do with the rest of the URL.

## Configuration

See [`docs/configuration.md`](docs/configuration.md).

## Markdown within JS

You can use [jsxtreme-markdown](https://github.com/mapbox/jsxtreme-markdown) within JS, as well as in `.md` page files.
It is compiled by Babel, so will your browser bundle will not need to include a Markdown parser.

Batfish exposes [babel-plugin-transform-jsxtreme-markdown] as `batfish/md`.
The value of this (fake) module is a [template literal tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals).
Any template literal with this tag will be compiled as Markdown (jsxtreme-markdown, with interpolated JS expression and JSX elements) at compile time.

```jsx
const React = require('react');
const md = require('batfish/md');

class MyPage extends React.Component {
  render() {
    const text = md`
      # A title

      This is a paragraph. Receives interpolated props, like this one:
      {{this.props.location}}.

      You can use interpolated {{<span className="foo">JSX elements</span>}},
      also.
    `;

    return (
      <div>
        {/* some fancy stuff */}
        {text}
      {/* some more fancy stuff */}
      </div>
    );
  }
}
```

## Routing

### Prefixing URLs

During Webpack compilation, Batfish exposes the module `batfish/prefix-url`.

Use this to prefix your URLs according to the [`siteBasePath`] and [`siteOrigin`] you specified in your configuration, ensuring that they point to the right place both during development and in production.

```js
// Let's imagine:
// - siteBasePath === '/about/jobs/'
// - siteOrigin === 'https://mydomain.com'
const prefixUrl = require('batfish/prefix-url');

// The function prefixes a URL with siteBasePath
prefixUrl('engineer') // -> '/about/jobs/engineer'

// You can also prefix an absolute path, if you've provided siteOrigin
prefixUrl.absolute('engineer') // -> 'https://mydomain.com/about/jobs/engineer'
```

### Links

**You can use regular `<a>` elements throughout your site.**
When the user clicks a link, Batfish checks to see if the link's `href` refers to a page it knows about.
If so, client-side routing is used.
If not, the link behaves normally.

If you would like to use an `<a>` without this hijacking (e.g. for your own internal routing within a page), you can give it the attribute `data-no-hijack`.

This is all accomplished with [link-hijacker].

### Dynamically changing pages

During Webpack compilation, Batfish exposes the module `batfish/route-to`.
Use this to dynamically change pages.
If the URL argument matches a page Batfish knows about, client-side routing is used.
If not, [`Location.assign`](https://developer.mozilla.org/en-US/docs/Web/API/Location/assign) is used, and the page transitions normally.

```js
// Let's imagine:
// - siteBasePath === '/about/jobs/'
// - /about/jobs/writer/ is a page you made
const routeTo = require('batfish/route-to');

// Client-side routing is used
routeTo('/about/jobs/writer/');

// Automatically prefix the URL with siteBasePath
routeTo.prefixed('writer');

// Regular link behavior is used, since this is not a page Batfish made
routeTo('/about/money');
```

## Document `<head>`

**Use [react-helmet] to add things your document `<head>`.**

Batfish has a [peer dependency](https://nodejs.org/en/blog/npm/peer-dependencies/) on [react-helmet].

## Development server

The development server (for `start` and `serve-static` commands) is a [Browsersync] server, for easy cross-device testing.

Usually when you change a file, Webpack will recompile and the browser will automatically refresh.
However, **the browser will not automatically refresh for the following changes**:

- Adding or removing a page.
- Changing a page's front matter.

When you do one of these things, restart the server to see your change.

## Example sites

Each subdirectory in `examples/` is an example site, illustrating some subset of Batfish's features.

### Running examples

- `cd` into the example's directory.
- npm install` (or `yarn install`) to get any dependencies of that example.
- `npm run batfish -- start` (or `build` or `serve-static`).

`npm run batfish` is just a shortcut script that examples should include.
You can also use the Batfish CLI directly to run the examples: it lives in `bin/batfish.js`.
You'll need to make sure you either run the command from the example's directory or else use the `--config` argument, so Batfish can find the example's configuration.

Examples:

```
# From project root directory
bin/batfish.js --config examples/initial-experiments/batfish.config.js start

# From examples/initial-experiments/
../../bin/batfish.js build && ../../bin/batfish.js serve-static
```

### Creating a new example

Create a new directory in `examples/`.
Add the following `package.json`:

```json
{
  "private": true,
  "scripts": {
    "batfish": "../../bin/batfish.js"
  },
  "dependencies": {}
}
```

Install dependencies as needed.

Create a configuration file and some pages ... and go from there!

[configuration]: #configuration
[pages]: #pages
[Prefixing URLs]: #prefixing-urls
[Dynamically changing pages]: #dynamically-changing-pages
[`pagesDirectory`]: docs/configuration.md#pagesdirectory
[`outputDirectory`]: docs/configuration.md#outputdirectory
[`notFoundPath`]: docs/configuration.md#notfoundpath
[`data`]: docs/configuration.md#data
[`dataSelectors`]: docs/configuration.md#dataselectors
[`siteBasePath`]: docs/configuration.md#sitebasepath
[`siteOrigin`]: docs/configuration.md#siteorigin
[`production`]: docs/configuration.md#production
[jsxtreme-markdown]: https://github.com/mapbox/jsxtreme-markdown
[link-hijacker]: https://github.com/mapbox/link-hijacker
[scroll-restorer]: https://github.com/mapbox/scroll-restorer
[babel-plugin-transform-jsxtreme-markdown]: https://github.com/mapbox/babel-plugin-transform-jsxtreme-markdown
[react-helmet]: https://github.com/nfl/react-helmet
[Browsersync]: https://www.browsersync.io/
