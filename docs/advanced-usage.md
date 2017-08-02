# Advanced Usage

## Table of contents

-   [Draft pages](#draft-pages)
-   [Injecting data](#injecting-data)
-   [Routing within a page](#routing-within-a-page)
-   [Markdown within JS](#markdown-within-js)
-   [Dynamically changing pages](#dynamically-changing-pages)
-   [withLocation](#withlocation)
-   [Route change listeners](#route-change-listeners)
    -   [addRouteChangeStartListener](#addroutechangestartlistener)
    -   [removeRouteChangeStartListener](#removeroutechangestartlistener)
    -   [addRouteChangeEndListener](#addroutechangeendlistener)
    -   [removeRouteChangeEndListener](#removeroutechangeendlistener)
-   [Analyzing bundles](#analyzing-bundles)

## Draft pages

Any page with the front matter `published: false` will be considered a draft page.

In development, draft pages are built and visible.
However, in [`production`] builds these pages are **not** included and should be handled with a 404 by the server.

## Injecting data

Most of the time, you should store data as JSON or JS and `import` or `require` it as needed.
Nothing special.

If, however, you are dealing with _lots_ of data; that data is used across a number of pages; and each of those pages does not need _all_ of the data — then you may not want to write _all_ that data into your JS bundles.
You may want to control which parts of it get written to which bundles.

You can do this with [`dataSelectors`].
Store data in JSON or JS, anywhere in your project, then specify which data to inject into any given page with [`dataSelectors`] in your configuration.
[`dataSelectors`] also have access to build-time data, like the front matter of all the pages being compiled.

Then, to select data to be injected into a specific page, provide `injectedData` front matter that is a [sequence](http://www.yaml.org/spec/1.2/spec.html#style/block/sequence) of strings, each representing a key in the `dataSelectors` object in your configuration.
The return value from that data selector function will be injected into the page.

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
      desserts: () => {
        return myBigData.recipes.desserts;
      }
    }
  };
};

// Page
/*---
injectedData:
  - posts
  - desserts
---*/
import React from 'react';
import { DessertDisplay } from 'path/to/dessert-display';

export default class MyPage extends React.PureComponent {
  render() {
    return (
      <div>
        <h1>Page!</h1>
        <h2>Posts</h2>
        {this.props.injectedData.posts.map(post => {
          return (
            <div key={post.path}>
              <a href={post.path}>{post.frontMatter.title}</a>
            </div>
          );
        })}
        <h2>Desserts</h2>
        {this.props.injectedData.desserts.map(dessert => {
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

If you'd like to use a different client-side routing library _within a page_, like [React Router](https://reacttraining.com/react-router/) or [nanorouter](https://github.com/yoshuawuyts/nanorouter), add `internalRoutes: true` to the page's front matter.

By specifying that the page has internal routes, any URLs that _start with_ the page's path will be considered matches.
If the page is `pages/animals.js`, for example, then `/animals/` will match as usual, but `/animals/tiger/` and `/animals/zebra/` will _also_ match.
The client-side router you use within the page can determine what to do with the rest of the URL.

## Markdown within JS

You can use [jsxtreme-markdown](https://github.com/mapbox/jsxtreme-markdown) within JS, as well as in `.md` page files.
It is compiled by Babel, so will your browser bundle will not need to include a Markdown parser.

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

## Dynamically changing pages

Batfish exposes the module `@mapbox/batfish/modules/route-to`.
Use this to dynamically change pages.
If the URL argument matches a page Batfish knows about, client-side routing is used.
If not, [`Location.assign`](https://developer.mozilla.org/en-US/docs/Web/API/Location/assign) is used, and the page transitions normally.

```js
// Let's imagine:
// - siteBasePath === '/about/jobs/'
// - /about/jobs/writer/ is a page you made
const routeTo = require('@mapbox/batfish/modules/route-to');

// Client-side routing is used
routeTo('/about/jobs/writer/');

// Automatically prefix the URL with siteBasePath
routeTo.prefixed('writer');

// Regular link behavior is used, since this is not a page Batfish made
routeTo('/about/money');
```

## withLocation

Batfish exposes the module `@mapbox/batfish/modules/with-location`.
This module exports a higher-order component that you can use to inject an abbreviated [Location](https://developer.mozilla.org/en-US/docs/Web/API/Location) object into the props of your component, containing `pathname`, `hash`, and `search`.

```js
const withLocation = require('@mapbox/batfish/modules/with-location');

class MyPage extends React.Component {
  render() {
    return (
      <div>
        <div>pathname: {this.props.location.pathname}</div>
        <div>hash: {this.props.location.hash}</div>
        <div>search: {this.props.location.search}</div>
      </div>
    )
  }
}

module.exports = withLocation(MyPage);
```

## Route change listeners

Batfish exposes a few functions that allow you to do things when client-side route changes occur.

All the following functions are named exports of `@mapbox/batfish/modules/route-change-listeners`;

### `addRouteChangeStartListener`

```js
import { addRouteChangeStartListener } from '@mapbox/batfish/modules/route-change-listeners';
const remove = addRouteChangeStartListener(pathname, callback);
```

`pathname`: `string`. Optional.
If provided, only route changes going to this pathname will invoke the `callback`.
Otherwise, all route changes will invoke the `callback`.

`callback`: `Function`. Receives the incoming pathname as an argument.
**This function will be invoked immediately _before_ the incoming page chunk starts downloading.**
If you return a `Promise` from your callback, **you can use this to delay rendering of the next page** (if, for example, you want to show a loading spinner for some period of time, or load some data before switching pages).
After the page chunk finishes downloading, the next page will not be rendered until your return `Promise` has resolved.

`addRouteChangeStartListener` returns a function that will remove this particular listener.

### `removeRouteChangeStartListener`

```js
import { removeRouteChangeStartListener } from '@mapbox/batfish/modules/route-change-listeners';
removeRouteChangeStartListener(pathname, callback);
```

`pathname`: `string`. Optional.
If provided, only the `callback` for this pathname will be removed.
Otherwise, the `callback` for all paths will be removed.

### `addRouteChangeEndListener`

```js
import { addRouteChangeEndListener } from '@mapbox/batfish/modules/route-change-listeners';
const remove = addRouteChangeEndListener(pathname, callback);
```

`pathname`: `string`. Optional.
If provided, only route changes going to this pathname will invoke the `callback`.
Otherwise, all route changes will invoke the `callback`.

`callback`: `Function`. Receives the incoming pathname as an argument.
**This function will be invoked immediately _after_ the incoming page renders.**
The page chunk will have downloaded, your start-listener callbacks will have been invoked, the URL will have been changed, and the page will have rendered.
What you return from your `callback` will have no affect on page rendering.

`addRouteChangeEndListener` returns a function that will remove this particular listener.

### `removeRouteChangeEndListener`

```js
import { removeRouteChangeEndListener } from '@mapbox/batfish/modules/route-change-listeners';
removeRouteChangeEndListener(pathname, callback);
```

`pathname`: `string`. Optional.
If provided, only the `callback` for this pathname will be removed.
Otherwise, the `callback` for all paths will be removed.

## Analyzing bundles

Batfish's `start` and `end` commands output [Webpack's `stats.json`](https://webpack.js.org/api/stats/) so you can use it to analyze the composition of your bundles.

[webpack-bundle-analyzer](https://github.com/th0r/webpack-bundle-analyzer) and [webpack.github.io/analyse](https://webpack.github.io/analyse/) are two great tools that you can feed your `stats.json` to.
There are also others out there in the Webpack ecosystem.
