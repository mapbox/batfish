# batfish

The React-powered static-site generator you didn't know you wanted.

![The batfish](https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Longnose_batfish.jpg/320px-Longnose_batfish.jpg)

🚧🚧  WORK IN PROGRESS! 🚧🚧

## Goals

A minimalistic, React-powered static-site generator.
Batfish aims to provide *the essentials* for creating a static website with the following key features:

- **(Universal) React.**
  Use React components as the building blocks for pages.
  "Universal" means the components are rendered into HTML pages for the static build, and then mounted in the browser for interactivity.
- **Super-powered Markdown pages.**
  Write Markdown pages that are even more powerful than [Jekyll's](https://jekyllrb.com/), with interpolated JS expressions and JSX elements.
- **Client-side routing with key features and minimal overhead.**
  There is no need for a big router library, but there *is* a need for often-overlooked features like automatic link hijacking and scroll restoration.
- **Optimizations you don't need to think about.**
  JS bundles split up by page and loaded on demand.
  Essential CSS injected into static HTML.
  Hashed asset filenames for long-term caching.
  And so on.
- **Minimal configuration.**
  So far there are no required options!
- **Open to extension and composition with other tools.**

## Usage

1. Create a [configuration](#configuration) module (oh don't, if you want to rely on defaults).
1. Create some [pages](#pages) as React components and/or super-powered Markdown documents.
1. Start the development server, or build a static site.

## API

### CLI

The CLI has three commands:

- `start`: Start a development server.
- `build`: Build the static site.
- `serve-static`: Serve the static site.

All will look for your configuration module in the current working directory or where you specify with the `--config` option.

For more details, run `batfish --help`.

### Node API

The Node API exposes three functions:

- `start(batfishConfig?: Object, projectDirectory?: string): void`: Start a development server.
- `build(batfishConfig?: Object, projectDirectory?: string): Promise<void>`: Build the static site.
  Returns a Promise that resolves when the build is complete.
- `serveStatic(batfishConfig?: Object, projectDirectory?: string): void`: Serve the static site.

In all of the above, the `projectDirectory` argument is used to determine configuration defaults if you have not provided certain options (e.g. [`pagesDirectory`](#pagesdirectory), [`outputDirectory`](#outputdirectory)).
It defaults to the current working directory.

## Pages

The structure of your [`pagesDirectory`](#pagesdirectory) determines the URLs of your site.
JS and Markdown files map directly to distinct URLs.
So `src/pages/industries/real-estate.js` corresponds to the URL `/industries/real-estate/`.

When a page is rendered, it is passed the following props:

- `location`: The browser's current [Location](https://developer.mozilla.org/en-US/docs/Web/API/Location).
- `frontMatter`: The page's parsed front matter (minus any `siteData` array)
- `siteData`: Any site-wide data that the page has selected for injection.

### JS pages

JS pages must export a single React component (either `module.exports` (Node.js modules) or `export default` (ES2015 modules)).

JS pages can include front matter within block comments, delimited by `/*---` and `---*/` (see example above).

### Markdown pages

Markdown pages can include front matter, delimited by `---` and `---`, as is the norm.

These files are interpreted as [jsxtreme-markdown](https://github.com/mapbox/jsxtreme-markdown), so **the Markdown text can include interpolated JS expressions and JSX elements!**
They are transformed into React components.

All the props for the page (`frontMatter`, `siteData`, etc.) are available on `props`, e.g. `props.frontMatter.title`.

In jsxtreme-markdown components, you can specify modules to import and use within the interpolated code.
By default, the following modules are specified (they are documented below):

- `const prefixUrl = require('batfish/prefix-url');`
- `const routeTo = require('batfish/route-to');`

This means that these modules can be used with no additional configuration.

```md
Learn more about [security]({{prefixUrl('/about/security')}}).
```

### Non-page files with in the pages directory

Sometimes you need to put an asset at a specific URL.
A `favicon.ico` in the root directory, for example; or a special image for social media `<meta>` tags.
For this reason, any non-page files within the pages directory are copied directly into the same location during the static build.

### Injecting data

You can store data in JSON, anywhere in your project, then specify which specific data to inject into any given page.

To specify data, use the [`data`](#data) and [`dataSelectors`](#dataselectors) options in your configuration.

To select data for a page, then, provide `siteData` front matter that is a [sequence](http://www.yaml.org/spec/1.2/spec.html#style/block/sequence) of strings, each representing one of the following:

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

### Draft pages

Any page with `published: false` in its front matter will be considered a draft page.

Draft pages are built during development but are *not* included in [production](#production) builds.

### Page-specific CSS

By default, all CSS you include with Webpack (via `require` or `import`) will be bundled together.
During the static build, each page has the CSS relevant to it injected inline, and the complete stylesheet is loaded lazily, after the rest of the page is rendered.
Sometimes, however, you want to include CSS that will *never* be used on other pages, so you don't want it to be included in the complete stylesheet.

To do that, create CSS files *within the [`pagesDirectory`](#pagesdirectory) (preferably adjacent to the page that uses them).
Import a page-specific CSS from the page that will use it.
It exports a React component that you should render in your page. For example:

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

If you'd like to use a different client-side routing library *inside a page*, like [React Router](https://reacttraining.com/react-router/) or [nanorouter](https://github.com/yoshuawuyts/nanorouter), add `internalRoutes: true` to the page's front matter.

By specifying that the page has internal routes, any URLs that *start with* the page's path will be considered matches.
If the page is `pages/animals.js`, for example, then `/animals/` will match as usual, but `/animals/tiger/` and `/animals/zebra/` will *also* match.
The client-side router within the page can determine what to do with the rest of the URL.

## Configuration

To use the Batfish CLI, your configuration file should be a Node module that exports a function returning a configuration object.

```js
module.exports = () => {
  return { .. };
};
```

(This format mirrors Webpack's configuration setup, which allows for unlimited extensibility.)

By default, the Batfish CLI looks for a `batfish.config.js` file in the current working directory.
You can specify an alternate location.

**Below, "project directory" means either**:
- the directory of your configuration module, if one is provided; or
- the current working directory, if no configuration module is provided.

### pagesDirectory

`string` - Optional. Default: project directory + `src/pages/`

Absolute path to your project's directory of pages.


### outputDirectory

`string` - Optional. Default: project directory + `_site`

Absolute path to a directory where site files should be written.
**You probably want to `.gitignore` this directory.**

### siteBasePath

`string` - Optional. Default: `'/'`

Root-relative path to the base directory on the domain where the site will be deployed.
Used by `prefixUrl` and `prefixAbsoluteUrl`.

### siteOrigin

`string` - Optional.

Origin where the site will be deployed.
*Required if you want to use `prefixAbsoluteUrl`.*

### wrapperPath

`string` - Optional.

Absolute path to a module exporting a React component that will wrap all of your pages.

### notFoundPath

`string` - Optional. Default: pages directory + `404.js`

Absolute path to your 404 page.

### temporaryDirectory

`string` - Optional. Default: project directory + `_tmp`

Absolute path to a directory where Batfish will write temporary files.
It must be within the project directory.
**You probably want to `.gitignore` this directory.**

### data

`Object` - Optional.

An object of data the can be selected for injection into pages.

### dataSelectors

`{ [string]: (Object) => any }` - Optional.

An object of selector functions for selecting processing data before it is injected into the page.
Keys are selector names and values are functions that accept an object representing all the site's data and return a value.

The object received as an argument contains the following:
- All of the data you provided in the `data` configuration property.
- `pages`: An array of objects for pages.
  Each page object includes the following:
  - `path`: The page's URL path.
  - `filePath`: Absolute path to the page's file.
  - `frontMatter`: Parsed front matter from the page's file.  

### vendorModules

`Array<string>` - Identifiers of npm modules that you want to be added to the vendor bundle.
The purpose of the vendor bundle is to deliberately group dependencies that change relatively infrequently — so this bundle will stay cached for longer than the others.

### webpackLoaders

`Array<Object>` - Additional loader configuration to pass to Webpack during both Webpack builds (client bundling and HTML generating).
Each object should be a [Webpack Rule](https://webpack.js.org/configuration/module/#rule).

**Warning:** You may need remove the extensions for files your new loader(s) handles from [`fileLoaderExtensions`](#fileloaderextensions).

### webpackPlugins

`Array<Object>` - Additional plugin configuration to pass to Webpack during the client bundling task.

### babelPlugins

`Array` - Additional plugin configuration to pass to Babel during both Webpack builds (client bundling and HTML generating).
**You should `require()` your plugins instead of referencing them as strings.**
Otherwise, Babel might end up looking in the wrong place for the npm package.

### babelExclude

`WebpackCondition` - Optional. Default: `/node_modules/`

Any [valid Webpack Condition](https://webpack.js.org/configuration/module/#condition) will work here.

You'll need to use this if, for example, you use a library that includes ES2015 but is not compiled for publication (e.g. any of the [promise-fun](https://github.com/sindresorhus/promise-fun) modules).

### externalStylesheets

`Array<string>` - Optional.

An array of URLs to external stylesheets that you want to include in your site.
These stylesheets need to be publicly available at the designated URL so Batfish can download them and work them into the CSS optimizations.

### autoprefixerBrowsers

`Array<string>` - Optional. Default: `['last 4 versions', 'not ie < 10']`

All of the CSS you load via Webpack is run through [Autoprefixer](https://github.com/postcss/autoprefixer).
Use a [Browserslist](https://github.com/ai/browserslist) value to specify which browsers you need to support with vendor prefixes.

### postcssPlugins

`Array<Function>` - Optional.

All of the CSS you load via Webpack is run through [PostCSS](http://postcss.org/), so you can apply any [PostCSS plugins](https://github.com/postcss/postcss/blob/master/docs/plugins.md) to it.
By default, only [Autoprefixer](https://github.com/postcss/autoprefixer) is applied.

This value is passed directly to [postcss-loader](https://github.com/postcss/postcss-loader#plugins).

### fileLoaderExtensions

`Array<string>` - Options. Default: `['jpeg', 'jpg', 'png', 'gif', 'webp', 'mp4', 'webm', 'woff', 'woff2']`

An array of extensions for files that you would like to Webpack's [file-loader](https://github.com/webpack-contrib/file-loader).

### production

`boolean` - Optional. Default: `false` for `start`, `true` for `build`

Whether or not to build for production (e.g. minimize files, trim React).

### port

`number` - Optional. Default: `8080`

Preferred port for development servers.
If the specified port is unavailable, another port is used.

## Markdown within JS

You can use [jsxtreme-markdown](https://github.com/mapbox/jsxtreme-markdown) within JS, as well as in `.md` page files.
It is compiled by Babel, so will not affect your browser bundle.

To do so, Batfish exposes [babel-plugin-transform-jsxtreme-markdown](https://github.com/mapbox/babel-plugin-transform-jsxtreme-markdown) as `batfish/md`.
The value of this (fake) module is a [template literal tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals).
Any template literal will this tag will be compiled as Markdown (with interpolated JS expression and JSX elements) at compile time.

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
Use this to prefix your URLs according to the [`siteBasePath`](#sitebasepath) and [`siteOrigin`](#siteorigin) you specified in your b, ensuring that they point to the right place both during development and in production.

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

You can use regular `<a>` elements throughout your site.
When the user clicks a link, Batfish checks to see if the link's `href` refers to a page it knows about.
If so, client-side routing is used.
If not, the link behaves normally.

**If you would like to use an `<a>` that doesn't get hijacked** (e.g. for your own internal routing within a page), you can give it the attribute `data-no-hijack`.

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

Batfish has a [peer dependency](https://nodejs.org/en/blog/npm/peer-dependencies/) on [react-helmet](https://github.com/nfl/react-helmet).
Use react-helmet to add things your document `<head>`.

## Development server

The development server (for `start` and `serve-static` commands) is a [Browsersync](https://www.browsersync.io/) server, for easy cross-device testing.

Usually when you change a file, Webpack will recompile and the browser will automatically refresh.
However, **the browser will not automatically refresh for the following changes**:

- Adding or removing a page.
- Changing a page's front matter.

When you do one of these things, restart the server to see your change.

## Example sites

Each subdirectory in `examples/` is an example site, illustrating some subset of Batfish's features.

### Running examples

- `cd` into the example's directory.
- `yarn install` (or `npm install`) to get any dependencies of that example.
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
