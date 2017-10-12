# Q & A

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

**Have unanswered questions? Please file an issue!**

[`webpackloaders`]: ./configuration.md#webpackloaders

[`webpackplugins`]: ./configuration.md#webpackplugins

[`jsxtrememarkdownoptions`]: ./configuration.md#jsxtrememarkdownoptions
