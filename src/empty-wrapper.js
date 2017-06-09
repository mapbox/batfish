'use strict';

const React = require('react');

/**
 * When the user's config does not provide wrapperPath, we use this.
 */
class EmptyWrapper extends React.PureComponent {
  render() {
    return this.props.children;
  }
}

module.exports = EmptyWrapper;
