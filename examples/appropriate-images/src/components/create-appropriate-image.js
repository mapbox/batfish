const React = require('react');
const PropTypes = require('prop-types');
const survey = require('@mapbox/react-simple-surveyor');
const getAppropriateImageUrl = require('@mapbox/appropriate-images/browser/get-appropriate-image-url');

function createAppropriateImage(imageConfig, transformUrl) {
  class AppropriateImage extends React.PureComponent {
    render() {
      let url = getAppropriateImageUrl({
        imageId: this.props.imageId,
        width: this.props.width,
        imageConfig,
        hiResRatio: 1.3
      });
      url = transformUrl(url);
      const imgProps = Object.keys(this.props).reduce((result, key) => {
        if (!/^(imageId|width)$/.test(key)) {
          result[key] = this.props[key];
        }
        return result;
      }, {});
      return <img src={url} {...imgProps} />;
    }
  }

  AppropriateImage.propTypes = {
    imageId: PropTypes.string.isRequired,
    // Provided by survey
    width: PropTypes.number.isRequired
  };

  return survey(AppropriateImage);
}

module.exports = createAppropriateImage;
