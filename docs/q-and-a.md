# Q & A

## Table of contents

- [Why not use a Webpack loader and allow import or require for CSS?](#why-not-use-a-webpack-loader-and-allow-import-or-require-for-css)
- [Why not use a CSS-in-JS system?](#why-not-use-a-css-in-js-system)
- [How can I use global constants in Markdown files?](#how-can-i-use-global-constants-in-markdown-files)
- [How can I expose the Babel configuration that Batfish generates?](#how-can-i-expose-the-babel-configuration-that-batfish-generates)

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

[`webpackloaders`]: ./configuration.md#webpackloaders

[`webpackplugins`]: ./configuration.md#webpackplugins

[`jsxtrememarkdownoptions`]: ./configuration.md#jsxtrememarkdownoptions

[`babelplugins`]: ./configuration.md#babelplugins

[`babelpresets`]: ./configuration.md#babelpresets
