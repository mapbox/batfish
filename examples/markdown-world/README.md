# Markdown World

A place for all things centered around Markdown usage.

### Examples Checklist
- [x] React component pages
- [x] Markdown pages
- [x] Markdown pages with layouts
- [x] Markdown within JS pages
- [x] Remark plugins
- [x] Rehype plugins
- [x] Unpublished pages
- [x] Page using `this.props.frontMatter`
- [x] Page-specific CSS
- [ ] Non-default `batfishConfig.pagesDirectory`
- [ ] Non-default `batfishConfig.outputDirectory`
- [ ] `batfishConfig.siteBasePath`
- [ ] `batfishConfig.siteOrigin`
- [ ] Non-default `batfishConfig.wrapperPath`
- [x] Non-default `batfishConfig.notFoundPath`
- [ ] Non-default `batfishConfig.temporaryDirectory`
- [ ] `batfishConfig.data`, selectively injected into pages
- [ ] `batfishConfig.dataSelectors`, selectively injected into pages
- [ ] `batfishConfig.vendorModules`
- [ ] `batfishConfig.webpackLoaders`, including asset-optimization loaders
- [ ] `batfishConfig.webpackPlugins`
- [ ] `batfishConfig.babelPlugins`
- [ ] `batfishConfig.babelExclude`, maybe using a [promise-fun](https://github.com/sindresorhus/promise-fun) module, which requires compilation
- [x] `batfishConfig.externalStylesheets`
- [ ] `batfishConfig.fileLoaderExtensions`
- [x] `batfishConfig.port`
- [x] `batfish/prefix-url`
- [x] `batfish/route-to`
- [ ] hijacked links
- [x] [react-helmet](https://github.com/nfl/react-helmet) usage

### Notes
- 404 must be a JavaScript file
- if index pages are Markdown files, React components will need to be in `/components`
- if index pages are React JavaScript files, do the unique layout and content all in one
- assembly.css and some Markdown features don't align as expected
- expect to not use back button after dynamic routing with `batfish/route-to`
