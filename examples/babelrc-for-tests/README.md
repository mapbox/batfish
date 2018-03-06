# Generating a `.babelrc` for a test runner

This example includes an additional Babel plugin (via the [`babelPlugins`] option) that provides syntax sugar that will cause a runtime error if the source file is not compiled correctly by Babel.
It also include a Jes tests that reads the source file — so if Jest is not running Babel with the correct config, the test will fail.

To make the Jest test work, this example uses `batfish write-babelrc` to generate a `.babelrc` file before running Jest (in its `npm test` script).

For more information, read ["How can I expose the Babel configuration that Batfish generates?"](../../docs/q-and-a.md#how-can-i-expose-the-babel-configuration-that-batfish-generates).

[`babelplugins`]: ../../docs/configuration.md#babelplugins
