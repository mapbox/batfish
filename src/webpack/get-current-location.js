// @flow
import { getWindow } from './get-window';

export function getCurrentLocation(): BatfishLocation {
  const win = getWindow();
  let pathname = win.location.pathname;
  if (!/\/$/.test(pathname)) pathname += '/';
  return {
    pathname,
    hash: win.location.hash,
    search: win.location.search
  };
}
