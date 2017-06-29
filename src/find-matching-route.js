'use strict';

const batfishContext = require('batfish/context');

const pathRegExps = batfishContext.routes.reduce((result, route) => {
  const ender = route.internalRouting
    ? '(/.+)?$'
    : '$';
  // ? because the last slash is optional
  result[route.path] = new RegExp(`^${route.path.replace(/\//g, '[/]')}?${ender}`);
  return result;
}, {});

/**
 * Find the route data that matches a path.
 *
 * @param {string} path
 * @param {Object} [options]
 * @param {boolean} [options.notFound=false] - If true, returns a special not found route
 *   if no route is found.
 * @return {?Object} - The matching route, or undefined or a not found route if no matching
 *   route exists.
 */
function findMatchingRoute(path, options = {}) {
  for (let i = 0, l = batfishContext.routes.length; i < l; i++) {
    const route = batfishContext.routes[i];
    if (pathRegExps[route.path].test(path)) {
      return route;
    }
  }

  if (options.notFound) {
    return {
      path,
      getPage: batfishContext.getNotFoundPage
    };
  }
}

module.exports = findMatchingRoute;
