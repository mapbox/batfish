'use strict';

const path = require('path');

module.exports = () => {
  return {
    wrapperPath: path.join(__dirname, './src/components/wrapper.js'),
    siteOrigin: 'https://www.mapbox.com',
    siteBasePath: '/demo',
    externalStylesheets: [
      'https://api.mapbox.com/mapbox-assembly/v0.13.0/assembly.min.css'
    ],
    data: {
      cta: 'Buy now!'
    },
    dataSelectors: {
      posts: data => {
        return data.pages.filter(pagesData => /\/posts\//.test(pagesData.path));
      }
    }
  };
};
