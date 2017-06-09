'use strict';

function linkToLocation(input) {
  let link = input;
  if (typeof input === 'string') {
    link = document.createElement('a');
    link.href = input;
  }
  let pathname = link.pathname;
  if (!/\/$/.test(pathname)) pathname += '/';

  return {
    pathname,
    hash: link.hash,
    search: link.search
  };
}

module.exports = linkToLocation;
