'use strict';

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

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

var React = require('react');
var PropTypes = require('prop-types');

function withLocation(Component) {
  var WithLocation = (function(_React$Component) {
    _inherits(WithLocation, _React$Component);

    function WithLocation() {
      _classCallCheck(this, WithLocation);

      return _possibleConstructorReturn(
        this,
        (WithLocation.__proto__ || Object.getPrototypeOf(WithLocation))
          .apply(this, arguments)
      );
    }

    _createClass(WithLocation, [
      {
        key: 'render',
        value: function render() {
          return React.createElement(
            Component,
            _extends({ location: this.context.location }, this.props)
          );
        }
      }
    ]);

    return WithLocation;
  })(React.Component);

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

module.exports = withLocation;
