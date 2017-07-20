import React from 'react';
import PropTypes from 'prop-types';

export function withLocation(Component) {
  function WithLocation(props, context) {
    return <Component location={context.location} {...props} />;
  }

  WithLocation.contextTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      hash: PropTypes.string,
      search: PropTypes.string
    }).isRequired
  };

  WithLocation.WrapperComponent = Component;
  return WithLocation;
}
