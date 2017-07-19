'use strict';

let siteBasePath = '';
let siteOrigin;

function prefixUrl(url) {
  if (!/^\//.test(url)) url = '/' + url;
  return siteBasePath + url;
}

prefixUrl.absolute = url => {
  if (!siteOrigin) {
    throw new Error(
      'siteOrigin is not specified. Unable to prefix with absolute path.'
    );
  }
  if (!/^\//.test(url)) url = '/' + url;
  return siteOrigin + siteBasePath + url;
};

prefixUrl._configure = (a, b) => {
  siteBasePath = a || '';
  siteOrigin = b;
};

module.exports = prefixUrl;
