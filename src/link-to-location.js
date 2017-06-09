'use strict';

/**
 * Convert a link, anchor node or URL, to a location object.
 *
 * @param {HTMLAnchorElement | string} input - Either an anchor node or a URL.
 * @return {Objecct}
 */
function linkToLocation(input) {
  let link = input;
  // Take advantage of the browser's built-in URL parsing by creating
  // an anchor and then reading its properties.
  if (typeof input === 'string') {
    link = document.createElement('a');
    link.href = input;
  }

  return {
    pathname: link.pathname,
    hash: link.hash,
    search: link.search
  };
}

module.exports = linkToLocation;
