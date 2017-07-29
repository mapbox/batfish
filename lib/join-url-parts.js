'use strict';

/**
 * Determine if a slash has to be added between the parts you're combining.
 * And combine the parts.
 *
 * @param {...string} parts - Pass an empty string as the last argument if you
 *   want the returned URL to end with a slash.
 * @return {string}
 */
function joinUrlParts() {
  let result = '';
  for (let i = 0, l = arguments.length; i < l; i++) {
    const arg = arguments[i];
    if (i !== 0 && !/\/$/.test(result) && !/^\//.test(arg)) {
      result += '/';
    }
    result += arg;
  }
  return result;
}

module.exports = joinUrlParts;
