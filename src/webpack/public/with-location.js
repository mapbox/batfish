// @flow
import React from 'react';
import PropTypes from 'prop-types';

export function withLocation<
  Props: Object,
  Context: { location: BatfishLocation }
>(
  Component: React$ComponentType<{ location: BatfishLocation } & Props>
): React$ComponentType<Props> {
  function WithLocation(props: Props, context: Context) {
    return <Component location={context.location} {...props} />;
  }

  WithLocation.contextTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      hash: PropTypes.string,
      search: PropTypes.string,
    }).isRequired,
  };

  WithLocation.WrappedComponent = Component;
  return WithLocation;
}
