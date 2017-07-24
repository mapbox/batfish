const path = require('path');
module.exports = () => {
  return {
    siteBasePath: '/example',
    siteOrigin: 'https://www.mapbox.com',
    wrapperPath: path.join(__dirname, './src/components/wrapper.js'),
    notFoundPath: path.join(__dirname, './src/pages/404.js'),
    externalStylesheets: [
      'https://api.mapbox.com/mapbox-assembly/v0.15.0/assembly.min.css'
    ],
    autoprefixerBrowsers: ['last 4 versions', 'not ie < 10'],
    pagesDirectory: path.join(__dirname, './src/pages'),
    outputDirectory: path.join(__dirname, './_site'),
    temporaryDirectory: path.join(__dirname, './_tmp')
  };
};
