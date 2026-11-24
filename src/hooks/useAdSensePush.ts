import { useEffect, type RefObject } from "react";

/**
 * Requests an ad for one <ins class="adsbygoogle"> slot, exactly once, and
 * only once the slot actually has width.
 *
 * Why: calling adsbygoogle.push() blindly from an effect caused two
 * AdSense errors (shown as "Script error." in the dev overlay because
 * Google's script is cross-origin):
 *  - "All 'ins' elements ... already have ads in them": React StrictMode
 *    runs effects twice in development, so every slot pushed twice. We mark
 *    the element after pushing, so a re-run is a no-op.
 *  - "No slot size for availableWidth=0": the push happened before the slot
 *    was laid out (or while it was collapsed). We wait for a non-zero width
 *    with a ResizeObserver instead, which also avoids wasted ad requests in
 *    production.
 */
export const useAdSensePush = (ref: RefObject<HTMLElement>, enabled: boolean) => {
  useEffect(() => {
    const ins = ref.current;
    if (!enabled || !ins) return undefined;

    let done = false;
    const tryPush = () => {
      if (done) return;
      if (ins.dataset.adPushed || ins.getAttribute("data-adsbygoogle-status")) {
        done = true;
        return;
      }
      if (ins.offsetWidth <= 0) return;
      done = true;
      ins.dataset.adPushed = "1";
      try {
        const w = window as unknown as { adsbygoogle?: unknown[] };
        (w.adsbygoogle = w.adsbygoogle || []).push({});
      } catch {
        // AdSense errors must never break the page.
      }
    };

    tryPush();
    if (done || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(() => {
      tryPush();
      if (done) observer.disconnect();
    });
    observer.observe(ins);
    return () => observer.disconnect();
  }, [ref, enabled]);
};
