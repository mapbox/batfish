'use strict';

const regExp = /\[.*node_modules.*\]/;

// A custom Jest serializer to transform regular expressions pointing to
// node_modules into <NODE_MODULES>, instead, because those regular
// expressions are slightly different in Node 10 and 12.
module.exports = {
  print: () => {
    return '<NODE_MODULES>';
  },
  test: (value) => {
    return regExp.test(value);
  }
};
