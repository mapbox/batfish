'use strict';

const React = require('react');

class Wrapper extends React.Component {
  componentDidMount() {
    console.log('mounted');
  }

  componentDidUpdate() {
    console.log('updated');
  }

  render() {
    return this.props.children;
  }
}

module.exports = Wrapper;
