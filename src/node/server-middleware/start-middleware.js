// @flow
'use strict';

const historyApiFallback = require('connect-history-api-fallback');
const stripSiteBasePath = require('./strip-site-base-path');

function startMiddleware(
  batfishConfig: BatfishConfiguration
): Array<MiddlewareFn> {
  const stripAssets = (req: { url: string }, res: Object, next: Function) => {
    if (req.url.startsWith(batfishConfig.publicAssetsPath)) {
      req.url = req.url.replace(batfishConfig.publicAssetsPath, '') || '/';
    }
    next();
  };

  return [
    historyApiFallback(),
    stripSiteBasePath(batfishConfig.siteBasePath),
    stripAssets,
  ];
}

module.exports = startMiddleware;
