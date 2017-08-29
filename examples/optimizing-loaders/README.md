# Custom Webpack and Babel stuff

-   Uses [image-webpack-loader] to optimize images.
    To accomplish this, takes advantage of the [`fileLoaderExtensions`] and [`webpackLoaders`] configuration options.
-   Uses a minimal bundle of Lodash, enabled by [babel-plugin-lodash] and [lodash-webpack-plugin].
    To accomplish this, takes advantage of the [`webpackPlugins`] and [`babelPlugins`] configuration options.

[image-webpack-loader]: https://github.com/tcoopman/image-webpack-loader

[`fileloaderextensions`]: ../../docs/configuration.md#fileloaderextensions

[`webpackloaders`]: ../../docs/configuration.md#webpackloaders

[`webpackplugins`]: ../../docs/configuration.md#webpackplugins

[`babelplugins`]: ../../docs/configuration.md#babelplugins

[babel-plugin-lodash]: https://github.com/lodash/babel-plugin-lodash

[lodash-webpack-plugin]: https://github.com/lodash/lodash-webpack-plugin
