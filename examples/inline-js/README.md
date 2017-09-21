# Running JS in `<script>` tags

- Uses the [`inlineJs`] configuration property to inject inline JS into the built HTML page — independent of the Webpack bundles.
  This script executes *before* the Webpack bundle, so it can establish global variables that the Webpack bundle relies on.
- Uses [react-helmet] to inject a `<script>` tag.
  Such scripts will always run *after* the bundle loads and the components mount.

[`inlinejs`]: ../../docs/configuration.md#inlinejs

[react-helmet]: https://github.com/nfl/react-helmet
