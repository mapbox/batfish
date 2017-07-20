const path = require('path');
const appropriateImages = require('@mapbox/appropriate-images');
const imageConfig = require('./src/img/image-config');

appropriateImages
  .generate(imageConfig, {
    inputDirectory: path.join(__dirname, './src/img/raw'),
    outputDirectory: path.join(__dirname, './src/img/optimized')
  })
  .catch(error => console.error(error.stack));
