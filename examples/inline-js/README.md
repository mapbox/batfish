# inline-js Batfish example

-   Uses the [`inlineJs`] configuration property to inject inline JS into the built HTML page — independent of the Webpack bundles.
    This script executes _before_ the Webpack bundle, so it can establish global variables that the Webpack bundle relies on.
-   Uses [react-helmet] to inject a `<script>` tag.
    Such scripts will always run _after_ the bundle loads and the components mount.

[`inlinejs`]: ../../docs/configuration.md#inlinejs

[react-helmet]: https://github.com/nfl/react-helmet
