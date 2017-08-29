/* eslint-disable react/display-name */
var React = require('react');
var PropTypes = require('prop-types');
var createClass = require('create-react-class');

var ApplicationWrapper = createClass({
  propTypes: {
    children: PropTypes.node.isRequired
  },
  render: function() {
    return (
      <div>
        <h1>CommonJS module syntax works</h1>
        {this.props.children}
      </div>
    );
  }
});

module.exports = ApplicationWrapper;
