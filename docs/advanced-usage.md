# Advanced Usage

## Table of contents

- [Draft pages](#draft-pages)
- [Injecting data](#injecting-data)
- [Routing within a page](#routing-within-a-page)
- [Markdown within JS](#markdown-within-js)
- [Route change listeners](#route-change-listeners)
- [Analyzing bundles](#analyzing-bundles)

## Draft pages

Any page with the front matter `published: false` will be considered a draft page.

In development, draft pages are built and visible.
However, in [`production`] builds these pages are **not** included and should be handled with a 404 by the server.

## Injecting data

Most of the time, you should store data as JSON or JS and `import` or `require` it as needed.
Nothing special.

If, however, you are dealing with _lots_ of data; that data is used across a number of pages; and each of those pages does not need _all_ of the data — then you may not want to write _all_ that data into your JS bundles.
You may want to control which parts of it get written to which bundles.

You can do this with the [`dataSelectors`] configuration option.
Store data in JSON or JS, anywhere in your project, then specify which data to inject into any given page with [`dataSelectors`] in your configuration.
[`dataSelectors`] also have access to build-time data, like the front matter of all the pages being compiled.

Each data selector creates a module that can be `import`ed to inject the return value into a component or page.
**The return value of each data selector is the default export of the module available at `@mapbox/batfish/data/[selector-name-kebab-cased]`.**

Example:

```js
// batfish.config.js
const myBigData = require('path/to/my/big-data.json');

module.exports = () => {
  return {
    /* ... */
    dataSelectors: {
      posts: data => {
        return data.pages.filter(pagesData => /\/posts\//.test(pagesData.path));
      },
      fancyDesserts: () => {
        return myBigData.recipes.desserts;
      }
    }
  };
};

// Page
import React from 'react';
import { DessertDisplay } from 'path/to/dessert-display';
import posts from '@mapbox/batfish/data/posts';
import fancyDesserts from '@mapbox/batfish/data/fancy-desserts';

export default class MyPage extends React.PureComponent {
  render() {
    return (
      <div>
        <h1>Page!</h1>
        <h2>Posts</h2>
        {posts.map(post => {
          return (
            <div key={post.path}>
              <a href={post.path}>{post.frontMatter.title}</a>
            </div>
          );
        })}
        <h2>Desserts</h2>
        {fancyDesserts.map(dessert => {
          return (
            <DessertDisplay key={dessert.id} {...dessert} />
          );
        })}
      </div>
    );
  }
}
```

## Routing within a page

If you'd like to use a client-side routing library _within a Batfish page_, like [React Router](https://reacttraining.com/react-router/) or [nanorouter](https://github.com/yoshuawuyts/nanorouter), add `internalRoutes: true` to the page's front matter.

By specifying that the page has internal routes, any URLs that _start with_ the page's path will be considered matches.
If the page is `pages/animals.js`, for example, then `/animals/` will match as usual, but `/animals/tiger/` and `/animals/zebra/` will _also_ match.
The client-side router you use within the page can determine what to do with the rest of the URL.

Look at [`examples/internal-routing`](../examples/internal-routing) to see how this works.

## Markdown within JS

You can use [jsxtreme-markdown](https://github.com/mapbox/jsxtreme-markdown) within JS, as well as in `.md` page files.
It is compiled by Babel, so your browser bundle will not need to include a Markdown parser!

Batfish exposes [babel-plugin-transform-jsxtreme-markdown] as `@mapbox/batfish/modules/md`.
The value of this (fake) module is a [template literal tag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals).
Any template literal with this tag will be compiled as Markdown (jsxtreme-markdown, with interpolated JS expression and JSX elements) at compile time.

```js
const React = require('react');
const md = require('@mapbox/batfish/modules/md');

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

## Route change listeners

To attach listeners to route change events (e.g. add a page-loading animation), use the [`route-change-listeners`] module.

## Analyzing bundles

Batfish's `start` and `end` commands output [Webpack's `stats.json`](https://webpack.js.org/api/stats/) so you can use it to analyze the composition of your bundles.

[webpack-bundle-analyzer](https://github.com/th0r/webpack-bundle-analyzer) and [webpack.github.io/analyse](https://webpack.github.io/analyse/) are two great tools that you can feed your `stats.json` to.
There are also others out there in the Webpack ecosystem.

[`route-change-listeners`]: ./batfish-modules.md#route-change-listeners
