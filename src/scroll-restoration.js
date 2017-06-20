'use strict';

const xtend = require('xtend');
const debounce = require('debounce');

let removeListenerFunctions;

function end() {
  removeListenerFunctions.forEach(fn => fn());
}

function start(options = {}) {
  options = xtend({
    captureScrollDebounce: 50,
    syncScrollDebounce: 100,
    syncScrollAttempts: 5
  });

  // cf. https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  if (typeof window.requestAnimationFrame === undefined) return;

  // Scroll positions are saved into the history entry's state; then when that
  // the history changes (the popstate event), we try restoring any saved
  // scroll position.

  let attemptsRemaining = options.syncScrollAttempts;

  const captureScroll = debounce(() => {
    window.requestAnimationFrame(() => {
      const x = window.pageXOffset;
      const y = window.pageYOffset;
      const historyState = window.history.state;
      const savedX =
        historyState && historyState.scroll && historyState.scroll.x;
      const savedY =
        historyState && historyState.scroll && historyState.scroll.y;
      if (savedX !== x || savedY !== y) {
        const nextHistoryState = xtend(historyState, {
          scroll: { x, y }
        });
        window.history.replaceState(nextHistoryState, null, window.location);
      }
    });
  }, options.captureScrollDebounce);

  const syncScroll = debounce(
    input => {
      if (!input || !input.state || !input.state.scroll) return;
      const scrollState = input.state.scroll;
      window.requestAnimationFrame(() => {
        const savedX = scrollState.x;
        const savedY = scrollState.y;
        if (attemptsRemaining < 1) return;
        const { pageXOffset, pageYOffset } = window;
        if (
          savedY < window.document.body.scrollHeight &&
          (savedX !== pageXOffset || savedY !== pageYOffset)
        ) {
          window.scrollTo(savedX, savedY);
        } else {
          attemptsRemaining -= 1;
          syncScroll();
        }
      });
    },
    options.syncScrollDebounce,
    true
  );

  syncScroll(window.history);
  window.addEventListener('scroll', captureScroll, { passive: true });
  window.addEventListener('popstate', syncScroll);

  removeListenerFunctions = [
    () =>
      window.removeEventListener('scroll', captureScroll, {
        passive: true
      }),
    () => window.removeEventListener('popstate', syncScroll)
  ];
}

module.exports = {
  start,
  end
};
