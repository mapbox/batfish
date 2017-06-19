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
  You should be able to build *on top of* Batfish, extending the Webpack and Babel configurations, adding your own loaders for alternate file types, etc.
  You don't need to do this through a specialized system of plugins or anything like that: you just use Batfish as one part of your larger build system.

## Usage

1. Create a configuration module (there are a couple of required options).
1. Create some pages as React components and/or super-powered Markdown documents.
1. Start the development server, or build a static site.

## Details

### Configuration

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

#### pagesDirectory

`string` - Optional. Default: project directory + `src/pages/`

Absolute path to your project's directory of pages.


#### outputDirectory

`string` - Optional. Default: project directory + `_site`

Absolute path to a directory where site files should be written.
**You probably want to `.gitignore` this directory.**

#### siteBasePath

`string` - Optional. Default: `'/'`

Root-relative path to the base directory on the domain where the site will be deployed.
Used by `prefixUrl` and `prefixAbsoluteUrl`.

#### siteOrigin

`string` - Optional.

Origin where the site will be deployed.
*Required if you want to use `prefixAbsoluteUrl`.*

#### wrapperPath

`string` - Optional.

Absolute path to a module exporting a React component that will wrap all of your pages.

#### notFoundPath

`string` - Optional. Default: pages directory + `404.js`

Absolute path to your 404 page.

#### temporaryDirectory

`string` - Optional. Default: project directory + `_tmp`

Absolute path to a directory where Batfish will write temporary files.
It must be within the project directory.
**You probably want to `.gitignore` this directory.**

#### data

`Object` - Optional.

An object of data the can be selected for injection into pages.

#### dataSelectors

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

#### webpackLoaders

`Array<Object>` - Additional loader configuration to pass to Webpack during both Webpack builds (client bundling and HTML generating).
  Each object should be a [Webpack Rule](https://webpack.js.org/configuration/module/#rule).

#### webpackPlugins

`Array<Object>` - Additional plugin configuration to pass to Webpack during the client bundling task.

#### vendorModules

`Array<string>` - Identifiers of npm modules that you want to be added to the vendor bundle.
  The purpose of the vendor bundle is to deliberately group dependencies that change relatively infrequently — so this bundle will stay cached for longer than the others.

#### externalStylesheets

`Array<string>` - Optional.

An array of URLs to external stylesheets that you want to include in your site.
These stylesheets need to be publicly available at the designated URL so Batfish can download them and work them into the CSS optimizations.

#### production

`boolean` - Optional. Default: `false` for `start`, `true` for `build`

Whether or not to build for production (e.g. minimize files, trim React).

#### port

`number` - Optional. Default: `8080`

Preferred port for development servers.
If the specified port is unavailable, another port is used.
