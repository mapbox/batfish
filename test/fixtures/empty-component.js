'use strict';

const React = require('react');

module.exports = class EmptyComponent extends React.Component {
  render() {
    return this.props.children;
  }
};
