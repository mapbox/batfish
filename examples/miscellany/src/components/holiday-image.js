import React from 'react';
import PropTypes from 'prop-types';

export default class HolidayImage extends React.PureComponent {
  render() {
    const { props } = this;
    const style = props.style;
    if (style.maxWidth === undefined) {
      style.maxWidth = '100%';
    }
    return (
      <div className="my24">
        <img src={props.src} style={style} className="mb-3" />
      </div>
    );
  }
}

HolidayImage.propTypes = {
  src: PropTypes.string.isRequired,
  style: PropTypes.object,
};

HolidayImage.defaultProps = {
  style: {},
};
