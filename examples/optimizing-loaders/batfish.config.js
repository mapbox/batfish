const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = () => {
  return {
    siteOrigin: 'https://www.mapbox.com',
    fileLoaderExtensions: ['webp', 'mp4', 'webm', 'woff', 'woff2'],
    webpackLoaders: [
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: '[name]-[hash].[ext]'
            }
          },
          { loader: 'image-webpack-loader' }
        ]
      }
    ],
    webpackPlugins: [new LodashModuleReplacementPlugin({ paths: true })],
    babelPlugins: [require('babel-plugin-lodash')]
  };
};
