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

### JS pages

JS pages must export a single React component (either `module.exports` (Node.js modules) or `export default` (ES2015 modules)).

JS pages can include front matter within block comments, delimited by `/*---` and `---*/` (see example above).

### Markdown pages

**Work in progress!**

### Draft pages

Any page with `published: false` in its front matter will be considered a draft page.

Draft pages are built during development but are *not* included in [production](#production) builds.

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
  - `data`: Parsed front matter from the page's file.
  - `filePath`: Absolute path to the page's file.

### webpackLoaders

`Array<Object>` - Additional loader configuration to pass to Webpack during both Webpack builds (client bundling and HTML generating).
  Each object should be a [Webpack Rule](https://webpack.js.org/configuration/module/#rule).

### webpackPlugins

`Array<Object>` - Additional plugin configuration to pass to Webpack during the client bundling task.

### vendorModules

`Array<string>` - Identifiers of npm modules that you want to be added to the vendor bundle.
  The purpose of the vendor bundle is to deliberately group dependencies that change relatively infrequently — so this bundle will stay cached for longer than the others.

### externalStylesheets

`Array<string>` - Optional.

An array of URLs to external stylesheets that you want to include in your site.
These stylesheets need to be publicly available at the designated URL so Batfish can download them and work them into the CSS optimizations.

### production

`boolean` - Optional. Default: `false` for `start`, `true` for `build`

Whether or not to build for production (e.g. minimize files, trim React).

### port

`number` - Optional. Default: `8080`

Preferred port for development servers.
If the specified port is unavailable, another port is used.

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
