# A miscellany exemplifying miscellaneous features

- Uses the [`dataSelectors`] configuration property to create navigation and indexes.
- Uses `@mapbox/batfish/modules/md` to compile jsxtreme-markdown at build time within React components.
- Configuration includes a [`siteBasePath`], so `@mapbox/batfish/modules/prefix-url` is used to appropriately prefix URLs for links.
- Includes Facebook `<meta>` tags in its generic page shell.
- Uses the [`siteOrigin`] configuration property so a `sitemap.xml` file is generated.
- Uses [jsxtreme-markdown-loader's `getWrapper` option](https://github.com/mapbox/jsxtreme-markdown/tree/master/packages/jsxtreme-markdown-loader#getwrapper) to determine the Markdown page wrapper component based on its path.
- Exemplifies some conventions you might consider as your site grows:
  - Isolates [`dataSelectors`] in their own module.
  - Implements wrapper components for specific content types, which wrap the generic page shell.

[`dataselectors`]: ../../docs/configuration.md#dataselectors

[`sitebasepath`]: ../../docs/configuration.md#sitebasepath

[`siteorigin`]: ../../docs/configuration.md#siteorigin
