# Q & A

## Table of contents

- [Why not use a Webpack loader and allow import or require for CSS?](#why-not-use-a-webpack-loader-and-allow-import-or-require-for-css)
- [Why not use a CSS-in-JS system?](#why-not-use-a-css-in-js-system)
- [How can I use global constants in Markdown files?](#how-can-i-use-global-constants-in-markdown-files)
- [How can I expose the Babel configuration that Batfish generates?](#how-can-i-expose-the-babel-configuration-that-batfish-generates)
- [How can I pass my dependencies through Babel, if they need to be compiled?](#how-can-i-pass-my-dependencies-through-babel-if-they-need-to-be-compiled)
- [What if I want to use React Router instead of Batfish's router.](#what-if-i-want-to-use-react-router-instead-of-batfishs-router)

## Why not use a Webpack loader and allow `import` or `require` for CSS?

We've found that getting CSS to load in the way we want it to (for both the development server and the static build) has been messy, buggy, and slow via existing Webpack patterns; so we decided to step outside of Webpack for this part of the build.
However, you can add more Webpack loaders and plugins to accomplish this in your preferred way, if you'd like, using the [`webpackLoaders`] and [`webpackPlugins`] configuration options.

## Why not use a CSS-in-JS system?

You can use one if you'd like!
Just include whatever tools and plugins you need.

We've found that we can accomplish what we need to implement better optimizations by sticking with old fashioned CSS, so Batfish includes a system to optimize that use case.

## How can I use global constants in Markdown files?

In every Markdown file you can use the front matter array `prependJs` to specify lines of code to prepend to the compiled JS file.
Here you can `import` constants and they will be available to interpolated JS expressions within the Markdown.

```markdown
---
prependJs:
  - "import constants from '../constants'"
---

Favorite color: {{ constants.FAVORITE_COLOR }}.
```

## How can I expose the Babel configuration that Batfish generates?

Batfish generates a Babel configuration that combines its defaults with your [`babelPlugins`] and [`babelPresets`] options.
If you want to test client-side JavaScript that relies on the transforms specified in this configuration, you can generate a `.babelrc` file that your test runner can read.

```
batfish write-babelrc
```

The above command will write a `.babelrc` file to the same directory as your Batfish configuration file.
Then Jest or Ava or whatever it is can readthe `.babelrc` file and interpret your source code correctly.

For more information about options for `write-babelrc`, run `batfish --help`.

## How can I pass my dependencies through Babel, if they need to be compiled?

Use the [`babelInclude`] option to point to the npm packages that need to be compiled.

For example, if you want to use the library p-queue (which includes ES2015 syntax like `class` and arrow functions, and is *not* compiled to ES5 for publication), add the following to your configuration:

```
babelInclude: ['p-queue']
```

## What if I want to use React Router instead of Batfish's router.

If you want to *nest* a React Router instance within Batfish pages, you can do that!
This might be useful if, for example, you have detail pages that should not be statically rendered but instead generated in the client after an API call (e.g. `/dogs` lists all docs, then `/dogs/paul`, `/docs/dave`, etc. are details for specific docs).
Read about how to accomplish this in ["Routing within a page"].

If you don't want to use Batfish's router *at all* (either because you have no routes or React Router handles them all), you should set `spa: true` in your configuration. Read more about the [`spa`] option.

[`webpackloaders`]: ./configuration.md#webpackloaders

[`webpackplugins`]: ./configuration.md#webpackplugins

[`jsxtrememarkdownoptions`]: ./configuration.md#jsxtrememarkdownoptions

[`babelplugins`]: ./configuration.md#babelplugins

[`babelpresets`]: ./configuration.md#babelpresets

[`babelinclude`]: ./configuration.md#babelinclude

[`spa`]: ./configuration.md#spa

["routing within a page"]: ./advanced-usage.md#routing-within-a-page
