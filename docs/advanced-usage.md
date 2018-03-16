# Advanced Usage

![](../batfish-ultra.png)

## Table of contents

- [Draft pages](#draft-pages)
- [Injecting data](#injecting-data)
- [Routing within a page](#routing-within-a-page)
- [Minimal builds for single-page apps](#minimal-builds-for-single-page-apps)
  - [Turn off Batfish's routing](#turn-off-batfishs-routing)
  - [Minimize the static HTML build](#minimize-the-static-html-build)
- [Markdown within JS](#markdown-within-js)
- [Route change listeners](#route-change-listeners)
- [Analyzing bundles](#analyzing-bundles)
- [Page-specific CSS](#page-specific-css)

## Draft pages

Any page with the front matter `published: false` will be considered a draft page.

In development, draft pages are built and visible.
However, in [`production`] builds these pages are **not** included and should be handled with a 404 by the server.

## Injecting data

Most of the time, you should store data as JSON or JS and `import` or `require` it as needed.
Nothing special.

If, however, you are dealing with *lots* of data; that data is used across a number of pages; and each of those pages does not need *all* of the data — then you may not want to write *all* that data into your JS bundles.
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

If you'd like to use a client-side routing library *within a Batfish page*, like [React Router] or [nanorouter], add `internalRouting: true` to the page's front matter.

By specifying that the page has internal routes, any URLs that *start with* the page's path will be considered matches.
If the page is `pages/animals.js`, for example, then `/animals/` will match as usual, but `/animals/tiger/` and `/animals/zebra/` will *also* match.
The client-side router you use within the page can determine what to do with the rest of the URL.

Look at [`examples/internal-routing`](../examples/internal-routing) to see how this works.

## Minimal builds for single-page apps

### Turn off Batfish's routing

If your app includes only one page or else all the client-side routing is handled with some other client-side routing library, like [React Router] or [nanorouter], you can turn off all of Batfish's routing.

To do this, set the [`spa`] configuration option to `true`.
Read more about the effects of [`spa`] in the option's documentation.

### Minimize the static HTML build

You may want to minimize the amount of code that gets parsed and executed doing the static build.

One reason is so the static build runs as quickly as possible: instead of passing *all* of your code through Webpack, you can only pass the code that's needed to build your minimal static HTML.

Another reason is to allow you to write code, or import dependencies, that will rely completely on a browser environment — that global `window` object — without bumping up against errors during the static build.

For production apps, you probably want to think about what gets rendered *before* the JS downloads and executes; so you can do the following:

- Include an app shell and loading state in your single page.
- Dynamically `import(/* webpackMode: "eager" */ '../path/to/app')` your main app component in the page's `componentDidMount` hook.
  (`/* webpackMode: "eager" */` tells Webpack not to create a separate async chunk with this file, but to include it in the main client-side bundle.)
- Use [`webpackStaticIgnore`] to block '../path/to/app' from being included in the static build.
- Set [`staticHtmlInlineDeferCss`] to `false` to avoid a flash of unstyled content.

For example:

```jsx
// Page component, which will be statically rendered.
import React from 'react';
import Helmet from 'react-helmet';
import InitialLoadingState from '../initial-loading-state';

export default Page extends React.Component {
  constructor() {
    super();
    this.state = { body: <InitialLoadingState /> };
  }

  componentDidMount() {
    import(/* webpackMode: "eager" */ '../app').then(AppModule => {
      this.setState({ body: <AppModule.default> });
    });
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Your title</title>
          <meta charset='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          {/* ... other <head> things ... */}
        </Helmet>
        {this.state.body}
      </div>
    );
  }
}
```

```js
// batfish.config.js
const path = require('path');

module.exports = () => {
  return {
    webpackStaticIgnore: path.join(__dirname, 'src/app.js')
    // ... other config
  };
}
```

Sometimes you don't care *at all* about the static HTML that gets served, and just want an HTML shell with some things in the `<head>` and a completely empty `<body>` that will be populated when the JS downloads and executes.
This is the kind of app you build with create-react-app, which you might use for prototyping, internal tooling, etc.

To accomplish this:

- Use [`webpackStaticStubReactComponent`] to stub your main app component.
- Set [`staticHtmlInlineDeferCss`] to `false` to avoid a flash of unstyled content.

For example:

```jsx
// Page component, which will be statically rendered.
import React from 'react';
import Helmet from 'react-helmet';
import App from '../app';

export default Page extends React.Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>Your title</title>
          <meta charset='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          {/* ... other <head> things ... */}
        </Helmet>
        <App />
      </div>
    );
  }
}
```

```js
// batfish.config.js
const path = require('path');

module.exports = () => {
  return {
    webpackStaticStubReactComponent: [path.join(__dirname, 'src/app.js')]
    // ... other config
  };
}
```

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

## Page-specific CSS

Most of the time, you should add CSS to your site with the [`stylesheets`] configuration option.
However, if you are adding a *lot* of CSS that is *not widely used*, you might choose to add it to one page at a time, instead of adding it to the full site's stylesheet.
Batfish includes a way to to this.

If you `import` a `.css` file within your [`pagesDirectory`], you will get a React component (with no props) that you can render within the page.
When the component mounts, the stylesheet's content (processed through PostCSS, using your [`postcssPlugins`]) will be inserted into a `<style>` tag in the `<head>` of the document.
When the component unmounts, that `<style>` tag will be removed.

Like other React components, this one will only be added to the JS bundle of the page that uses it (unless you use it in a number of pages); and it will be rendered into the page's HTML during static rendering.
So that's how you can page-specific CSS, when the fancy strikes.

Example:

```js
import React from 'react';
import SpecialStyles from './special-styles.css';

export default class SomePage extends React.Component {
  render() {
    return (
      <div>
        <SpecialStyles />
        <h1>Some page</h1>
        {/* ... */}
      </div>
    );
  }
}
```

**You can turn this behavior off if you have your own preferences about what to do with imported `.css` files.**
Set the [`pageSpecificCss`] option to `false`.

[`route-change-listeners`]: ./batfish-modules.md#route-change-listeners

[babel-plugin-transform-jsxtreme-markdown]: https://github.com/mapbox/babel-plugin-transform-jsxtreme-markdown

[`stylesheets`]: ./configuration.md#stylesheets

[`pagesdirectory`]: ./configuration.md#pagesdirectory

[`postcssplugins`]: ./configuration.md#postcssplugins

[`production`]: ./configuration.md#production

[`dataselectors`]: ./configuration.md#dataselectors

[`spa`]: ./configuration.md#spa

[react router]: https://reacttraining.com/react-router/

[nanorouter]: https://github.com/yoshuawuyts/nanorouter

[`webpackstaticignore`]: ./configuration.md#webpackstaticignore

[`webpackstaticstubreactcomponent`]: ./configuration.md#webpackstaticstubreactcomponent

[`statichtmlinlinedefercss`]: ./configuration.md#statichtmlinlinedefercss

[`pagespecificcss`]: ./configuration.md#pagespecificcss
