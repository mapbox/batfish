// @flow
'use strict';

// Determine if a slash has to be added between the parts you're combining.
// And combine the parts.
//
// Pass an empty string as the last argument if you want the returned URL
// to end with a slash.
function joinUrlParts(...parts: Array<string>): string {
  let result = '';
  parts.forEach((part, index) => {
    if (index !== 0 && !/\/$/.test(result) && !/^\//.test(part)) {
      result += '/';
    }
    result += part;
  });
  return result;
}

module.exports = joinUrlParts;
