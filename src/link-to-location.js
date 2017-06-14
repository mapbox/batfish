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
    // Remove credentials, which cause problems in IE11.
    // http://bit.ly/2rvtfN4
    input = input.replace(/^\S+?@/, '');

    link = document.createElement('a');
    link.href = input;
    // IE doesn't populate all link properties when setting .href with a relative URL,
    // however .href will return an absolute URL which then can be used on itself
    // to populate these additional fields.
    // https://stackoverflow.com/a/13405933/2284669
    if (location.host === '') {
      location.href = location.href;
    }
  }

  return {
    pathname: link.pathname,
    hash: link.hash,
    search: link.search
  };
}

module.exports = linkToLocation;
