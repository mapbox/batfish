'use strict';

const path = require('path');

module.exports = () => {
  return {
    wrapperPath: path.join(__dirname, './src/components/wrapper.js'),
    siteOrigin: 'https://www.mapbox.com',
    webpackLoaders: [
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'react']
            }
          },
          { loader: '@mapbox/svg-react-transformer-loader' }
        ]
      }
    ]
  };
};
