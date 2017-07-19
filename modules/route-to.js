'use strict';

var prefixUrl = require('@mapbox/batfish/modules/prefix-url');

var delayed = void 0;
var onRouteTo = void 0;

function routeTo(url) {
  if (!onRouteTo) {
    delayed = url;
    return;
  }
  onRouteTo(url);
}

routeTo.prefixed = function(url) {
  routeTo(prefixUrl(url));
};

// Used by the Router to provide the function that actually does the routing.
// This slight awkwardness is just to enable the user to
// `require('@mapbox/batfish/modules/route-to')`.
routeTo._onRouteTo = function(fn) {
  onRouteTo = fn;
  if (delayed) onRouteTo(delayed);
};

module.exports = routeTo;
