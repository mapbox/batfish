// @flow
'use strict';

const url = require('url');
const path = require('path');
const historyApiFallback = require('connect-history-api-fallback');

type MiddlewareFn = (req: { url: string }, res: Object, next: Function) => void;

function getPagesWithInternalRouting(pagesData: {
  [string]: BatfishPageData
}): Array<BatfishPageData> {
  return Object.keys(pagesData).reduce((memo, pagePath) => {
    const data: BatfishPageData = pagesData[pagePath];
    if (data.frontMatter.internalRouting) {
      memo.push(data);
    }
    return memo;
  }, []);
}

function createInternalRoutingMiddleware(
  batfishConfig: BatfishConfiguration,
  pagesData: { [string]: BatfishPageData }
): ?Array<MiddlewareFn> {
  const pagesWithInternalRouting = getPagesWithInternalRouting(pagesData);

  if (batfishConfig.spa) {
    return [historyApiFallback()];
  }

  if (pagesWithInternalRouting.length !== 0) {
    return pagesWithInternalRouting.map(pageData => {
      return (req: { url: string }, res: Object, next: Function) => {
        const parsedUrl = url.parse(req.url);
        if (
          parsedUrl.pathname &&
          parsedUrl.pathname.startsWith(pageData.path) &&
          !path.extname(req.url)
        ) {
          req.url = pageData.path;
        }
        next();
      };
    });
  }
}

function createStripSiteBasePathMiddleware(siteBasePath: string): MiddlewareFn {
  return function stripSiteBasePath(
    req: { url: string },
    res: Object,
    next: Function
  ) {
    if (req.url.startsWith(siteBasePath)) {
      req.url = req.url.replace(siteBasePath, '') || '/';
    }
    next();
  };
}

function serverStaticMiddleware(
  batfishConfig: BatfishConfiguration,
  pagesData: { [string]: BatfishPageData }
): Array<MiddlewareFn> {
  let middleware = [
    createStripSiteBasePathMiddleware(batfishConfig.siteBasePath)
  ];
  const internalRoutingMiddleware = createInternalRoutingMiddleware(
    batfishConfig,
    pagesData
  );
  if (internalRoutingMiddleware) {
    middleware = middleware.concat(internalRoutingMiddleware);
  }

  return middleware;
}

module.exports = serverStaticMiddleware;
