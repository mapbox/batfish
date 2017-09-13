// @flow
import { batfishContext } from 'batfish-internal/context';

// Crude heuristic but probably ok.
function isAbsoluteUrl(url: string): boolean {
  return /^https?:/.test(url);
}

function prefixUrl(url: string): string {
  if (isAbsoluteUrl(url)) {
    return url;
  }
  if (
    batfishContext.selectedConfig.siteBasePath &&
    url.indexOf(batfishContext.selectedConfig.siteBasePath) === 0
  ) {
    return url;
  }
  if (!/^\//.test(url)) url = '/' + url;
  return batfishContext.selectedConfig.siteBasePath + url;
}

function prefixUrlAbsolute(url: string): string {
  if (isAbsoluteUrl(url)) {
    return url;
  }
  if (!batfishContext.selectedConfig.siteOrigin) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'The siteOrigin property is not specified in your Batfish configuration. Unable to prefix with absolute path.'
      );
    }
    return url;
  }
  if (!/^\//.test(url)) url = '/' + url;
  return (
    batfishContext.selectedConfig.siteOrigin +
    batfishContext.selectedConfig.siteBasePath +
    url
  );
}

function isUrlPrefixed(url: string): boolean {
  return url.indexOf(batfishContext.selectedConfig.siteBasePath) === 0;
}

export { prefixUrl, prefixUrlAbsolute, isUrlPrefixed };
