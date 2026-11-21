/**
 * The moment the opening panel hands the screen over.
 *
 * The panel ends by opening the hero's photo to full size, so the hero's own
 * entrance — headline, copy, figures, calls to action — has to start only once
 * it has left. Left to itself it would play behind the panel and be over before
 * anyone saw it, so the hero waits for this signal instead of starting on mount.
 */
let handedOver = false;
const waiting = new Set<() => void>();

/** Called by the preloader as it leaves. */
export const markHandoff = () => {
  if (handedOver) return;
  handedOver = true;
  waiting.forEach((listener) => listener());
  waiting.clear();
};

/**
 * Runs `listener` once the panel is gone — immediately if it already is. The
 * timeout is a safety net: if the panel never reports (an error, a browser that
 * skipped it), the page must not sit on its first frame forever.
 */
export const onHandoff = (listener: () => void, fallbackMs = 9000) => {
  if (handedOver) {
    listener();
    return () => {};
  }

  waiting.add(listener);
  const failsafe = window.setTimeout(() => {
    if (waiting.delete(listener)) listener();
  }, fallbackMs);

  return () => {
    waiting.delete(listener);
    window.clearTimeout(failsafe);
  };
};
