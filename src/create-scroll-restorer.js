'use strict';

const getValue = require('get-value');
const xtend = require('xtend');
const debounce = require('debounce');

const CAPTURE_SCROLL_DEBOUNCE = 50;
const SYNC_SCROLL_DEBOUNCE = 100;
const SYNC_SCROLL_ATTEMPT_LIMIT = 5;

function createScrollRestorer() {
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
      if (
        getValue(historyState, 'scroll.x') !== x ||
        getValue(historyState, 'scroll.y') !== y
      ) {
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
    const x = getValue(event, 'state.scroll.x') || 0;
    const y = getValue(event, 'state.scroll.y') || 0;
    debouncedSyncScroll(x, y);
  };

  onPop(window.location);
  window.addEventListener('scroll', debouncedCaptureScroll, { passive: true });

  window.addEventListener('popstate', onPop);
}

module.exports = createScrollRestorer;
