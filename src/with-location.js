'use strict';

const React = require('react');
const PropTypes = require('prop-types');

function withLocation(Component) {
  class WithLocation extends React.Component {
    static contextTypes = {
      location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
        hash: PropTypes.string,
        search: PropTypes.string
      }).isRequired
    };

    render() {
      return <Component location={this.context.location} {...this.props} />;
    }
  }

  WithLocation.WrapperComponent = Component;
  return WithLocation;
}

module.exports = withLocation;
