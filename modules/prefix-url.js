'use strict';

var siteBasePath = '';
var siteOrigin = void 0;

function prefixUrl(url) {
  if (!/^\//.test(url)) url = '/' + url;
  return siteBasePath + url;
}

prefixUrl.absolute = function(url) {
  if (siteOrigin) {
    throw new Error(
      'siteOrigin is not specified. Unable to prefix with absolute path.'
    );
  }
  if (!/^\//.test(url)) url = '/' + url;
  return siteOrigin + siteBasePath + url;
};

prefixUrl._configure = function(a, b) {
  siteBasePath = a;
  siteOrigin = b;
};

module.exports = prefixUrl;
