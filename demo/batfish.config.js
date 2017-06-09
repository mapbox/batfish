'use strict';

const path = require('path');

module.exports = {
  pagesDirectory: path.join(__dirname, 'src/pages'),
  outputDirectory: path.join(__dirname, 'site'),
  wrapperPath: path.join(__dirname, './src/components/wrapper.js'),
  injectData: {
    '/': data => {
      const posts = data.pages.filter(pagesData =>
        /\/posts\//.test(pagesData.path)
      );
      return { posts };
    }
  },
  externalStylesheets: [
    'https://api.mapbox.com/mapbox-assembly/v0.13.0/assembly.min.css'
  ]
};
