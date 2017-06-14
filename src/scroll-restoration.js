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

  // Scroll positions are saved into the history entry's state; then when that
  // the history changes (the popstate event), we try restoring any saved
  // scroll position.

  let scrollData = {
    x: 0,
    y: 0,
    attemptsRemaining: options.syncScrollAttempts
  };

  if (typeof window.requestAnimationFrame === undefined) return;

  const captureScroll = () => {
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
  };

  const trySyncingScroll = () => {
    window.requestAnimationFrame(() => {
      if (scrollData.attemptsRemaining < 1) return;
      const { pageXOffset, pageYOffset } = window;
      if (
        scrollData.y < window.document.body.scrollHeight &&
        (scrollData.x !== pageXOffset || scrollData.y !== pageYOffset)
      ) {
        window.scrollTo(scrollData.x, scrollData.y);
      } else {
        scrollData.attemptsRemaining -= 1;
        trySyncingScroll();
      }
    });
  };

  const syncScroll = (x, y) => {
    scrollData = { x, y, attemptsRemaining: options.syncScrollAttempts };
    trySyncingScroll();
  };

  const debouncedCaptureScroll = debounce(
    captureScroll,
    options.captureScrollDebounce
  );
  const debouncedSyncScroll = debounce(
    syncScroll,
    options.syncScrollDebounce,
    true
  );

  const onPop = event => {
    const savedScroll = event.state && event.state.scroll;
    if (!savedScroll) return;
    debouncedSyncScroll(savedScroll.x, savedScroll.y);
  };

  onPop(window.location);
  window.addEventListener('scroll', debouncedCaptureScroll, { passive: true });
  window.addEventListener('popstate', onPop);
  removeListenerFunctions = [
    window.removeEventListener('scroll', debouncedCaptureScroll, {
      passive: true
    }),
    window.removeEventListener('popstate', onPop)
  ];
}

module.exports = {
  start,
  end
};
