const batfish = require('../../dist/node');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = () => {
  return {
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
              name: '[name]-[hash].[ext]',
            },
          },
          { loader: 'image-webpack-loader' },
        ],
      },
    ],
    webpackPlugins: [
      new LodashModuleReplacementPlugin(),
      new batfish.webpack.DefinePlugin({
        DEFINED: '"yes"',
      }),
    ],
    babelPlugins: [require('babel-plugin-lodash')],
  };
};
