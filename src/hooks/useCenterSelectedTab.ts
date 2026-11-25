import React from "react";

/**
 * Keeps the selected tab of a scrollable MUI <Tabs> centred in its row.
 * MUI only scrolls far enough to touch the edge, which leaves the active tab
 * under the edge fade on phones (especially after swiping between tabs).
 *
 *   const tabsRef = useCenterSelectedTab(value);
 *   <Tabs ref={tabsRef} variant="scrollable" ... />
 */
export function useCenterSelectedTab(value: unknown) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const root = ref.current;
    if (!root) return;
    // Run after MUI's own scroll-into-view animation (~300ms), which would
    // otherwise finish later and pull the tab back to the edge.
    const id = window.setTimeout(() => {
      const scroller = root.querySelector<HTMLElement>(".MuiTabs-scroller");
      const tab = root.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
      if (!scroller || !tab || scroller.scrollWidth <= scroller.clientWidth + 1) return;
      // Measure on screen: offsetLeft isn't relative to the scroller here.
      const tabRect = tab.getBoundingClientRect();
      const scrollerRect = scroller.getBoundingClientRect();
      const left = scroller.scrollLeft + (tabRect.left - scrollerRect.left) - (scroller.clientWidth - tabRect.width) / 2;
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      scroller.scrollTo({ left: Math.max(0, left), behavior: reduce ? "auto" : "smooth" });
    }, 320);
    return () => window.clearTimeout(id);
  }, [value]);
  return ref;
}

export default useCenterSelectedTab;
