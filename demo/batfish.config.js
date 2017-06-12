'use strict';

const path = require('path');

module.exports = {
  pagesDirectory: path.join(__dirname, 'src/pages'),
  outputDirectory: path.join(__dirname, 'site'),
  wrapperPath: path.join(__dirname, './src/components/wrapper.js'),
  siteOrigin: 'https://www.mapbox.com',
  siteBasePath: '/demo',
  data: {
    cta: 'Buy now!'
  },
  dataSelectors: {
    posts: data => {
      return data.pages.filter(pagesData => /\/posts\//.test(pagesData.path));
    }
  },
  externalStylesheets: [
    'https://api.mapbox.com/mapbox-assembly/v0.13.0/assembly.min.css'
  ]
};
