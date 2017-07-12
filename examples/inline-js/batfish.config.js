'use strict';

const path = require('path');

module.exports = () => {
  return {
    wrapperPath: path.join(__dirname, './src/components/wrapper.js'),
    siteOrigin: 'https://www.mapbox.com'
  };
};
