'use strict';

const batfishContext = require('batfish/context');

// An array of regular expressions that are used to check whether a URL path
// matches one of the routes.
const pathRegExps = batfishContext.routes.reduce((result, route) => {
  // Pages with internal routing aren't just exact matches.
  const ending = route.internalRouting ? '(/.+)?$' : '$';
  // ? because the last slash is optional
  result[route.path] = new RegExp(
    `^${route.path.replace(/\//g, '[/]')}?${ending}`
  );
  return result;
}, {});

/**
 * Find the route data that matches a URL path.
 *
 * @param {string} urlPath
 * @param {Object} [options]
 * @param {boolean} [options.notFound=false] - If true, returns a special
 *   not-found route if no route is found.
 * @return {?Object} - The matching route, or `undefined` or a not-found route
 *   if no matching route exists.
 */
function findMatchingRoute(urlPath, options = {}) {
  for (let i = 0, l = batfishContext.routes.length; i < l; i++) {
    const route = batfishContext.routes[i];
    if (pathRegExps[route.path].test(urlPath)) {
      return route;
    }
  }

  if (options.notFound) {
    return {
      path: urlPath,
      getPage: batfishContext.getNotFoundPage,
      internalRouting: false
    };
  }
}

module.exports = findMatchingRoute;
