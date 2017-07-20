'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

exports.withLocation = withLocation;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function withLocation(Component) {
  function WithLocation(props, context) {
    return _react2.default.createElement(
      Component,
      _extends({ location: context.location }, props)
    );
  }

  WithLocation.contextTypes = {
    location: _propTypes2.default.shape({
      pathname: _propTypes2.default.string.isRequired,
      hash: _propTypes2.default.string,
      search: _propTypes2.default.string
    }).isRequired
  };

  WithLocation.WrapperComponent = Component;
  return WithLocation;
}
