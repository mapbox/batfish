// @flow

export function getWindow() {
  if (typeof window === 'undefined') {
    throw new Error(
      'Do not call getWindow in code that will run during the static build.'
    );
  }
  return window;
}
