import React from 'react';
import PropTypes from 'prop-types';
import { prefixUrl } from '@mapbox/batfish/modules/prefix-url';
import { withLocation } from './public/with-location';

class DefaultNotFound extends React.Component {
  static propTypes = {
    location: PropTypes.shape({ pathname: PropTypes.string.isRequired })
      .isRequired
  };

  render() {
    return (
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <h1>Route not found</h1>
        <p>
          Batfish can't find a route for{' '}
          <span style={{ color: 'red', textDecoration: 'underline' }}>
            {this.props.location.pathname}
          </span>
          .
        </p>
        <p>
          <a href={prefixUrl('/')} style={{ fontWeight: 'bold' }}>
            Go somewhere safe
          </a>
        </p>
        <p style={{ fontSize: '0.8em', marginTop: '2em' }}>
          This is Batfish's default <em>development only</em> 404 page.
          <br />
          It will not appear in production builds.
        </p>
        <div aria-hidden={true}>
          <code style={{ fontSize: '3em' }}>(•́﹏•̀)</code>
        </div>
      </div>
    );
  }
}

export default withLocation(DefaultNotFound);
