'use strict';

const xtend = require('xtend');
const debounce = require('debounce');

const CAPTURE_SCROLL_DEBOUNCE = 50;
const SYNC_SCROLL_DEBOUNCE = 100;
const SYNC_SCROLL_ATTEMPT_LIMIT = 5;

/**
 * Scroll restoration means that when you dynamically move around in history
 * your past scroll positions are remembered and restored, mimicking the
 * standard behavior of regular page loads.
 */
function initializeScrollRestoration() {
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
    attemptsRemaining: SYNC_SCROLL_ATTEMPT_LIMIT
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
    scrollData = { x, y, attemptsRemaining: SYNC_SCROLL_ATTEMPT_LIMIT };
    trySyncingScroll();
  };

  const debouncedCaptureScroll = debounce(
    captureScroll,
    CAPTURE_SCROLL_DEBOUNCE
  );
  const debouncedSyncScroll = debounce(syncScroll, SYNC_SCROLL_DEBOUNCE, true);

  const onPop = event => {
    const x = (event.state && event.state.scroll && event.state.scroll.x) || 0;
    const y = (event.state && event.state.scroll && event.state.scroll.y) || 0;
    debouncedSyncScroll(x, y);
  };

  onPop(window.location);
  window.addEventListener('scroll', debouncedCaptureScroll, { passive: true });

  window.addEventListener('popstate', onPop);
}

module.exports = initializeScrollRestoration;
