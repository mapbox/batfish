# Advanced Usage

## Table of contents

-   [Draft pages](#draft-pages)
-   [Injecting data](#injecting-data)
-   [Page-specific CSS](#page-specific-css)
-   [Routing within a page](#routing-within-a-page)
-   [Markdown within JS](#markdown-within-js)
-   [Dynamically changing pages](#dynamically-changing-pages)

## Draft pages

Any page with the front matter `published: false` will be considered a draft page.

In development, draft pages are built and visible.
However, in [`production`] builds these pages are **not** included and should be handled with a 404 by the server.

## Injecting data

Most of the time, you should store data as JSON or JS and `import` or `require` it.
Nothing special.

If, however, you are dealing with lots of data; that data is used across a number of pages; and each of those pages does not need _all_ of the data — then you may not want to write _all_ that data into your JS bundles.
You may want to control which parts of it get written to which bundles.

You can store data in JSON or JS, anywhere in your project, then specify which data to inject into any given page.

To register data and data selectors, use the [`data`] and [`dataSelectors`] options in your configuration.

To select data to be injected into a page, then, provide `siteData` front matter that is a [sequence](http://www.yaml.org/spec/1.2/spec.html#style/block/sequence) of strings, each representing one of the following:

-   A key in the `data` object. In this case, the entire value will be injected.
-   A key in the `dataSelectors` object. In this case, the return value from that selector will be injected.

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

## Page-specific CSS

By default, all CSS you include with Webpack (via `require` or `import`) will be bundled together.
**During the static build, each page has the CSS relevant to it injected inline, and the complete stylesheet is loaded lazily, after the rest of the page is rendered.**
This optimization ensures that the loading of an external stylesheet does not block rendering, and your page content is visible as quickly as possible.

Sometimes, however, you want to include CSS that will _never_ be used on other pages, so you don't want it to be included in the complete stylesheet.

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

## Routing within a page

If you'd like to use a different client-side routing library _within a page_, like [React Router](https://reacttraining.com/react-router/) or [nanorouter](https://github.com/yoshuawuyts/nanorouter), add `internalRoutes: true` to the page's front matter.

By specifying that the page has internal routes, any URLs that _start with_ the page's path will be considered matches.
If the page is `pages/animals.js`, for example, then `/animals/` will match as usual, but `/animals/tiger/` and `/animals/zebra/` will _also_ match.
The client-side router you use within the page can determine what to do with the rest of the URL.

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

## Dynamically changing pages

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
