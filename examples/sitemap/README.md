# Customize the sitemap

This example customizes the sitemap by using the `ignoreFile` option to remove some files from the sitemap.

Since Batfish only generates the sitemap on build, run:

```
npm run batfish -- build && npm run batfish -- serve-static
```