import React from "react";

const SWIPE_MIN_X = 60;
const SWIPE_RATIO = 1.5; // horizontal travel must clearly beat vertical scroll
const SWIPE_MAX_MS = 800;

interface ScrollerAtStart {
  el: HTMLElement;
  /** Could still scroll further toward the end (content moving left) / start. */
  canScrollForward: boolean;
  canScrollBack: boolean;
}

/**
 * What the touch started inside: `"block"` for controls that own horizontal
 * drags (sliders, text inputs, anything marked data-no-swipe), the nearest
 * sideways-scrolling element (a wide stats table, a chip row), or null.
 * Swipes inside a scroller scroll it first; tabs only change once it is
 * already at its edge in the swipe direction.
 */
const inspectStart = (target: EventTarget | null, boundary: Element): "block" | ScrollerAtStart | null => {
  let el = target instanceof Element ? target : null;
  while (el && el !== boundary) {
    if (el instanceof HTMLElement) {
      if (el.dataset.noSwipe !== undefined) return "block";
      if (el.getAttribute("role") === "slider" || el.tagName === "INPUT" || el.tagName === "TEXTAREA") return "block";
      const { overflowX } = window.getComputedStyle(el);
      if ((overflowX === "auto" || overflowX === "scroll") && el.scrollWidth > el.clientWidth + 2) {
        const left = Math.abs(el.scrollLeft);
        return { el, canScrollForward: left + el.clientWidth < el.scrollWidth - 2, canScrollBack: left > 2 };
      }
    }
    el = el.parentElement;
  }
  return null;
};

type SwipeNativeEvent = TouchEvent & { __tabSwipeHandled?: boolean };

/**
 * Swipe left/right on a tab panel to move to the next/previous tab.
 * Nested panels work too: the innermost one that can move takes the swipe,
 * and when it's already at its first/last tab the outer tabs take it.
 *
 *   const swipe = useSwipeTabs(TABS, tab, setTab);
 *   <Box {...swipe.handlers}><Box key={tab} sx={swipe.enterSx}>...</Box></Box>
 */
export function useSwipeTabs<T extends string>(
  order: readonly T[],
  current: T,
  onChange: (next: T) => void,
  { disabled = false }: { disabled?: boolean } = {},
) {
  const start = React.useRef<{ x: number; y: number; t: number; inside: "block" | ScrollerAtStart | null } | null>(null);
  const [direction, setDirection] = React.useState<1 | -1 | 0>(0);
  const lastIndex = React.useRef(order.indexOf(current));

  // Remember which way we moved (also for taps on the tab bar) to animate in.
  React.useEffect(() => {
    const index = order.indexOf(current);
    if (index !== lastIndex.current && lastIndex.current !== -1 && index !== -1) {
      setDirection(index > lastIndex.current ? 1 : -1);
    }
    lastIndex.current = index;
  }, [current, order]);

  const onTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    if (disabled || !touch || event.touches.length > 1) {
      start.current = null;
      return;
    }
    start.current = {
      x: touch.clientX,
      y: touch.clientY,
      t: Date.now(),
      inside: inspectStart(event.target, event.currentTarget),
    };
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    const s = start.current;
    start.current = null;
    const native = event.nativeEvent as SwipeNativeEvent;
    if (!s || s.inside === "block" || native.__tabSwipeHandled) return;
    const touch = event.changedTouches[0];
    if (!touch || Date.now() - s.t > SWIPE_MAX_MS) return;
    const dx = touch.clientX - s.x;
    const dy = touch.clientY - s.y;
    if (Math.abs(dx) < SWIPE_MIN_X || Math.abs(dx) < Math.abs(dy) * SWIPE_RATIO) return;
    // Inside a wide table: let it scroll until it reaches its edge.
    if (s.inside && (dx < 0 ? s.inside.canScrollForward : s.inside.canScrollBack)) return;
    const index = order.indexOf(current);
    const next = dx < 0 ? index + 1 : index - 1; // swipe left → next tab
    if (index === -1 || next < 0 || next >= order.length) return;
    native.__tabSwipeHandled = true;
    onChange(order[next]);
  };

  const enterSx = React.useMemo(
    () =>
      direction === 0
        ? {}
        : {
            animation: `${direction > 0 ? "tabSwipeInRight" : "tabSwipeInLeft"} 220ms ease-out`,
            "@keyframes tabSwipeInRight": { from: { opacity: 0.35, transform: "translateX(28px)" }, to: { opacity: 1, transform: "none" } },
            "@keyframes tabSwipeInLeft": { from: { opacity: 0.35, transform: "translateX(-28px)" }, to: { opacity: 1, transform: "none" } },
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          },
    [direction],
  );

  return {
    handlers: { onTouchStart, onTouchEnd, onTouchCancel: () => (start.current = null) },
    enterSx,
  };
}

export default useSwipeTabs;
