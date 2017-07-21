'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.invokeCallbacks = invokeCallbacks;
exports.addRouteChangeStartListener = addRouteChangeStartListener;
exports.removeRouteChangeStartListener = removeRouteChangeStartListener;
exports.addRouteChangeEndListener = addRouteChangeEndListener;
exports.removeRouteChangeEndListener = removeRouteChangeEndListener;
exports._invokeRouteChangeStartCallbacks = _invokeRouteChangeStartCallbacks;
exports._invokeRouteChangeEndCallbacks = _invokeRouteChangeEndCallbacks;

var _prefixUrl = require('./prefix-url');

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

var ALL_PATHS = '*';
var startListeners = _defineProperty({}, ALL_PATHS, []);
var endListeners = _defineProperty({}, ALL_PATHS, []);

function normalizePathname(pathname) {
  if (pathname !== ALL_PATHS && !(0, _prefixUrl.isUrlPrefixed)(pathname)) {
    pathname = (0, _prefixUrl.prefixUrl)(pathname);
  }
  return pathname.replace(/\/$/, '');
}

function addListener(pathname, callback, registry, remover) {
  if (typeof pathname === 'function') {
    callback = pathname;
    pathname = ALL_PATHS;
  }
  pathname = normalizePathname(pathname);
  if (!registry[pathname]) registry[pathname] = [];
  registry[pathname].push(callback);
  return function() {
    return remover(pathname, callback);
  };
}

function removeListener(pathname, callback, registry) {
  if (typeof pathname === 'function' || !pathname) {
    callback = pathname;
    pathname = ALL_PATHS;
  }
  pathname = normalizePathname(pathname);
  if (!callback) {
    registry[pathname] = [];
    return;
  }
  var listeners = registry[pathname];
  for (var i = 0, l = listeners.length; i < l; i++) {
    if (listeners[i] === callback) {
      listeners.splice(i, 1);
      return;
    }
  }
}

function invokeCallbacks(nextPathname, registery) {
  nextPathname = normalizePathname(nextPathname);
  var promisesToKeep = [Promise.resolve()];
  if (registery[nextPathname]) {
    registery[nextPathname].forEach(function(callback) {
      promisesToKeep.push(Promise.resolve(callback(nextPathname)));
    });
  }
  registery[ALL_PATHS].forEach(function(callback) {
    promisesToKeep.push(Promise.resolve(callback(nextPathname)));
  });
  return Promise.all(promisesToKeep);
}

function addRouteChangeStartListener(pathname, callback) {
  return addListener(
    pathname,
    callback,
    startListeners,
    removeRouteChangeStartListener
  );
}

function removeRouteChangeStartListener(pathname, callback) {
  removeListener(pathname, callback, startListeners);
}

function addRouteChangeEndListener(pathname, callback) {
  return addListener(
    pathname,
    callback,
    endListeners,
    removeRouteChangeEndListener
  );
}

function removeRouteChangeEndListener(pathname, callback) {
  removeListener(pathname, callback, endListeners);
}

function _invokeRouteChangeStartCallbacks(nextPathname) {
  return invokeCallbacks(nextPathname, startListeners);
}

function _invokeRouteChangeEndCallbacks(nextPathname) {
  return invokeCallbacks(nextPathname, endListeners);
}
