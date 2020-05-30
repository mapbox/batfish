// @flow
import { prefixUrl, isUrlPrefixed } from './prefix-url';

type Registry = {
  [path: string]: Array<Function>,
};

type Remover = (pathname: string, callback?: Function) => void;

const ALL_PATHS = '*';
const startListeners: Registry = {
  [ALL_PATHS]: [],
};
const endListeners: Registry = {
  [ALL_PATHS]: [],
};

function normalizePathname(pathname: string): string {
  if (pathname !== ALL_PATHS && !isUrlPrefixed(pathname)) {
    pathname = prefixUrl(pathname);
  }
  return pathname.replace(/\/$/, '');
}

function addListener(
  pathnameOrListener: string | Function,
  maybeListener?: Function,
  registry: Registry,
  remover: Remover
): Remover {
  let listener;
  let pathname;
  if (typeof pathnameOrListener === 'function') {
    listener = pathnameOrListener;
    pathname = ALL_PATHS;
  } else {
    listener = maybeListener;
    pathname = pathnameOrListener;
  }
  pathname = normalizePathname(pathname);
  if (!registry[pathname]) {
    registry[pathname] = [];
  }
  registry[pathname].push(listener || noop);
  return () => remover(pathname, listener);
}

function removeListener(
  pathnameOrListener?: string | Function,
  maybeListener?: Function,
  registry: Registry
) {
  let listener;
  let pathname;
  if (typeof pathnameOrListener === 'function' || !pathnameOrListener) {
    listener = pathnameOrListener;
    pathname = ALL_PATHS;
  } else {
    listener = maybeListener;
    pathname = pathnameOrListener;
  }
  pathname = normalizePathname(pathname);
  if (!listener) {
    registry[pathname] = [];
    return;
  }
  const listeners = registry[pathname];
  for (let i = 0, l = listeners.length; i < l; i++) {
    if (listeners[i] === listener) {
      listeners.splice(i, 1);
      return;
    }
  }
}

export function invokeCallbacks(
  nextPathname: string,
  registery: Registry
): Promise<*> {
  nextPathname = normalizePathname(nextPathname);
  let promisesToKeep = [Promise.resolve()];
  if (registery[nextPathname]) {
    registery[nextPathname].forEach((callback) => {
      promisesToKeep.push(Promise.resolve(callback(nextPathname)));
    });
  }
  registery[ALL_PATHS].forEach((callback) => {
    promisesToKeep.push(Promise.resolve(callback(nextPathname)));
  });
  return Promise.all(promisesToKeep);
}

export function addRouteChangeStartListener(
  pathnameOrListener: string | Function,
  maybeListener?: Function
): Remover {
  return addListener(
    pathnameOrListener,
    maybeListener,
    startListeners,
    removeRouteChangeStartListener
  );
}

export function removeRouteChangeStartListener(
  pathnameOrListener?: string | Function,
  maybeListener?: Function
) {
  removeListener(pathnameOrListener, maybeListener, startListeners);
}

export function addRouteChangeEndListener(
  pathnameOrListener: string | Function,
  maybeListener?: Function
): Remover {
  return addListener(
    pathnameOrListener,
    maybeListener,
    endListeners,
    removeRouteChangeEndListener
  );
}

export function removeRouteChangeEndListener(
  pathnameOrListener?: string | Function,
  maybeListener?: Function
) {
  removeListener(pathnameOrListener, maybeListener, endListeners);
}

export function _invokeRouteChangeStartCallbacks(
  nextPathname: string
): Promise<*> {
  return invokeCallbacks(nextPathname, startListeners);
}

export function _invokeRouteChangeEndCallbacks(
  nextPathname: string
): Promise<*> {
  return invokeCallbacks(nextPathname, endListeners);
}

function noop() {}
