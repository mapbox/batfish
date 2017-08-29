# Some Basic Batfish

A typical basic Batfish setup.

-   Includes two stylesheets via the [`stylesheets`] configuration option, one at an external URL and one local, within the project directory.
-   Defines a `PageShell` component, which translates each page's front matter into `<title>` and `<meta>` tags, using [react-helmet].
-   Specifies a `MarkdownWrapper` component that sends Markdown pages' front matter to the `PageShell` and wraps Markdown content in a class that applies typographic styles. This is configured with [`jsxtremeMarkdownOptions`].
-   Exemplifies a JavaScript page and a Markdown page.
-   Shows both pages using their front matter via `props.frontMatter`.

[`sitebasepath`]: ../../docs/configuration.md#sitebasepath

[`stylesheets`]: ../../docs/configuration.md#stylesheets

[`applicationwrapperpath`]: ../../docs/configuration.md#applicationwrapperpath

[`jsxtrememarkdownoptions`]: ../../docs/configuration.md#jsxtrememarkdownoptions

[react-helmet]: https://github.com/nfl/react-helmet

[`prefixurl`]: ../../README.md#prefixing-urls
