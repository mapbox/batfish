'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var siteBasePath = '';
var siteOrigin = void 0;

function prefixUrl(url) {
  if (!/^\//.test(url)) url = '/' + url;
  return siteBasePath + url;
}

function prefixUrlAbsolute(url) {
  if (!siteOrigin) {
    throw new Error(
      'siteOrigin is not specified. Unable to prefix with absolute path.'
    );
  }
  if (!/^\//.test(url)) url = '/' + url;
  return siteOrigin + siteBasePath + url;
}

function isUrlPrefixed(url) {
  return url.indexOf(siteBasePath) === 0;
}

prefixUrl._configure = function(a, b) {
  siteBasePath = a || '';
  siteOrigin = b;
};

exports.prefixUrl = prefixUrl;
exports.prefixUrlAbsolute = prefixUrlAbsolute;
exports.isUrlPrefixed = isUrlPrefixed;
