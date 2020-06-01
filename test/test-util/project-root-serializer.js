'use strict';

const path = require('path');

const absolutePathRegExp = new RegExp(
  path.join(__dirname, '../..').replace(/\//g, '\\\\{0,3}/'),
  'g'
);

// A custom Jest serializer to make absolute paths in snapshots start with
// <PROJECT_ROOT>, instead.
module.exports = {
  print: (value, serialize) => {
    return serialize(value).replace(absolutePathRegExp, '<PROJECT_ROOT>');
  },
  test: (value) => {
    return absolutePathRegExp.test(value);
  }
};
