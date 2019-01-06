// @flow
'use strict';

module.exports = function stripSiteBasePath(
  siteBasePath: string
): MiddlewareFn {
  return (req: { url: string }, res: Object, next: Function) => {
    if (req.url.startsWith(siteBasePath)) {
      req.url = req.url.replace(siteBasePath, '') || '/';
    }
    next();
  };
};
