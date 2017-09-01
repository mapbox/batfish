// @flow
let siteBasePath = '';
let siteOrigin;

// Crude heuristic but probably ok.
function isAbsoluteUrl(url: string): boolean {
  return /^https?:/.test(url);
}

function prefixUrl(url: string): string {
  if (isAbsoluteUrl(url)) {
    return url;
  }
  if (siteBasePath && url.indexOf(siteBasePath) === 0) {
    return url;
  }
  if (!/^\//.test(url)) url = '/' + url;
  return siteBasePath + url;
}

function prefixUrlAbsolute(url: string): string {
  if (isAbsoluteUrl(url)) {
    return url;
  }
  if (!siteOrigin) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'The siteOrigin property is not specified in your Batfish configuration. Unable to prefix with absolute path.'
      );
    }
    return url;
  }
  if (!/^\//.test(url)) url = '/' + url;
  return siteOrigin + siteBasePath + url;
}

function isUrlPrefixed(url: string): boolean {
  return url.indexOf(siteBasePath) === 0;
}

prefixUrl._configure = (a?: string, b?: string) => {
  siteBasePath = a || '';
  siteOrigin = b;
};

export { prefixUrl, prefixUrlAbsolute, isUrlPrefixed };
