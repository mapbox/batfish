const path = require('path');
const bigData = require('./data/big-data.json');

module.exports = () => {
  return {
    wrapperPath: path.join(__dirname, './src/components/wrapper.js'),
    siteOrigin: 'https://www.mapbox.com',
    siteBasePath: '/demo',
    externalStylesheets: [
      'https://api.mapbox.com/mapbox-assembly/v0.13.0/assembly.min.css'
    ],
    dataSelectors: {
      posts: data => {
        return data.pages.filter(pagesData => /\/posts\//.test(pagesData.path));
      },
      horseNames: () => {
        return bigData.horseNames;
      },
      pigNames: () => {
        return bigData.pigNames;
      }
    },
    webpackStaticIgnore: [/problem\.js$/]
  };
};
