'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.routeToPrefixed = exports.routeTo = undefined;

var _prefixUrl = require('./prefix-url');

var delayed = void 0;
var onRouteTo = void 0;

function routeTo(url) {
  if (!onRouteTo) {
    delayed = url;
    return;
  }
  onRouteTo(url);
}

function routeToPrefixed(url) {
  routeTo((0, _prefixUrl.prefixUrl)(url));
}

// Used by the Router to provide the function that actually does the routing.
// This slight awkwardness is just to enable the user to
// `require('@mapbox/batfish/modules/route-to')`.
routeTo._onRouteTo = function(fn) {
  onRouteTo = fn;
  if (delayed) onRouteTo(delayed);
};

exports.routeTo = routeTo;
exports.routeToPrefixed = routeToPrefixed;
