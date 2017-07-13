'use strict';

const prefixUrl = require('batfish/prefix-url');

let delayed;
let onRouteTo;

function routeTo(url) {
  if (!onRouteTo) {
    delayed = url;
    return;
  }
  onRouteTo(url);
}

routeTo.prefixed = url => {
  routeTo(prefixUrl(url));
};

// Used by the Router to provide the function that actually does the routing.
// This slight awkwardness is just to enable the user to
// `require('batfish/route-to')`.
routeTo.onRouteTo = fn => {
  onRouteTo = fn;
  if (delayed) onRouteTo(delayed);
};

module.exports = routeTo;
