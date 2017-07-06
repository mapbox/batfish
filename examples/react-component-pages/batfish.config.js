'use strict';

const path = require('path');

module.exports = () => {
  return {
    externalStylesheets: [
      'https://api.mapbox.com/mapbox-assembly/v0.13.0/assembly.min.css'
    ],
    siteOrigin: 'https://www.mapbox.com',
    wrapperPath: path.join(__dirname, './src/components/wrapper.js')
  };
};
