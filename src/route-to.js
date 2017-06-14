'use strict';

const prefixUrl = require('batfish/prefix-url');

let delayed;
let onRouteTo;

function routeTo(url) {
  if (!routeTo) {
    delayed = url;
    return;
  }
  onRouteTo(url);
}

routeTo.prefixed = url => {
  routeTo(prefixUrl(url));
};

routeTo.onRouteTo = fn => {
  onRouteTo = fn;
  if (delayed) onRouteTo(delayed);
};

module.exports = routeTo;
