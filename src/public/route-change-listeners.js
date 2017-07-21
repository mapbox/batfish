import { prefixUrl, isUrlPrefixed } from './prefix-url';

const ALL_PATHS = '*';
const startListeners = {
  [ALL_PATHS]: []
};
const endListeners = {
  [ALL_PATHS]: []
};

function normalizePathname(pathname) {
  if (pathname !== ALL_PATHS && !isUrlPrefixed(pathname)) {
    pathname = prefixUrl(pathname);
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
  return () => remover(pathname, callback);
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
  const listeners = registry[pathname];
  for (let i = 0, l = listeners.length; i < l; i++) {
    if (listeners[i] === callback) {
      listeners.splice(i, 1);
      return;
    }
  }
}

export function invokeCallbacks(nextPathname, registery) {
  nextPathname = normalizePathname(nextPathname);
  let promisesToKeep = [Promise.resolve()];
  if (registery[nextPathname]) {
    registery[nextPathname].forEach(callback => {
      promisesToKeep.push(Promise.resolve(callback(nextPathname)));
    });
  }
  registery[ALL_PATHS].forEach(callback => {
    promisesToKeep.push(Promise.resolve(callback(nextPathname)));
  });
  return Promise.all(promisesToKeep);
}

export function addRouteChangeStartListener(pathname, callback) {
  return addListener(
    pathname,
    callback,
    startListeners,
    removeRouteChangeStartListener
  );
}

export function removeRouteChangeStartListener(pathname, callback) {
  removeListener(pathname, callback, startListeners);
}

export function addRouteChangeEndListener(pathname, callback) {
  return addListener(
    pathname,
    callback,
    endListeners,
    removeRouteChangeEndListener
  );
}

export function removeRouteChangeEndListener(pathname, callback) {
  removeListener(pathname, callback, endListeners);
}

export function _invokeRouteChangeStartCallbacks(nextPathname) {
  return invokeCallbacks(nextPathname, startListeners);
}

export function _invokeRouteChangeEndCallbacks(nextPathname) {
  return invokeCallbacks(nextPathname, endListeners);
}
