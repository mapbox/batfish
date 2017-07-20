const createAppropriateImage = require('./create-appropriate-image');
const imageConfig = require('../img/image-config');

module.exports = createAppropriateImage(imageConfig, url => {
  return require('../img/optimized/' + url);
});
