// @flow
import { prefixUrl, isUrlPrefixed } from './prefix-url';

type Registry = {
  [path: string]: Array<Function>
};

type Remover = (pathname: string, callback?: Function) => void;

const ALL_PATHS = '*';
const startListeners: Registry = {
  [ALL_PATHS]: []
};
const endListeners: Registry = {
  [ALL_PATHS]: []
};

function normalizePathname(pathname: string): string {
  if (pathname !== ALL_PATHS && !isUrlPrefixed(pathname)) {
    pathname = prefixUrl(pathname);
  }
  return pathname.replace(/\/$/, '');
}

function addListener(
  pathnameOrHandler: string | Function,
  maybeHandler?: Function,
  registry: Registry,
  remover: Remover
): Remover {
  let handler;
  let pathname;
  if (typeof pathnameOrHandler === 'function') {
    handler = pathnameOrHandler;
    pathname = ALL_PATHS;
  } else {
    handler = maybeHandler;
    pathname = pathnameOrHandler;
  }
  pathname = normalizePathname(pathname);
  if (!registry[pathname]) {
    registry[pathname] = [];
  }
  registry[pathname].push(handler || noop);
  return () => remover(pathname, handler);
}

function removeListener(
  pathnameOrHandler?: string | Function,
  maybeHandler?: Function,
  registry: Registry
) {
  let handler;
  let pathname;
  if (typeof pathnameOrHandler === 'function' || !pathnameOrHandler) {
    handler = pathnameOrHandler;
    pathname = ALL_PATHS;
  } else {
    handler = maybeHandler;
    pathname = pathnameOrHandler;
  }
  pathname = normalizePathname(pathname);
  if (!handler) {
    registry[pathname] = [];
    return;
  }
  const listeners = registry[pathname];
  for (let i = 0, l = listeners.length; i < l; i++) {
    if (listeners[i] === handler) {
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
    registery[nextPathname].forEach(callback => {
      promisesToKeep.push(Promise.resolve(callback(nextPathname)));
    });
  }
  registery[ALL_PATHS].forEach(callback => {
    promisesToKeep.push(Promise.resolve(callback(nextPathname)));
  });
  return Promise.all(promisesToKeep);
}

export function addRouteChangeStartListener(
  pathnameOrHandler: string | Function,
  maybeHandler?: Function
): Remover {
  return addListener(
    pathnameOrHandler,
    maybeHandler,
    startListeners,
    removeRouteChangeStartListener
  );
}

export function removeRouteChangeStartListener(
  pathnameOrHandler?: string | Function,
  maybeHandler?: Function
) {
  removeListener(pathnameOrHandler, maybeHandler, startListeners);
}

export function addRouteChangeEndListener(
  pathnameOrHandler: string | Function,
  maybeHandler?: Function
): Remover {
  return addListener(
    pathnameOrHandler,
    maybeHandler,
    endListeners,
    removeRouteChangeEndListener
  );
}

export function removeRouteChangeEndListener(
  pathnameOrHandler?: string | Function,
  maybeHandler?: Function
) {
  removeListener(pathnameOrHandler, maybeHandler, endListeners);
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
