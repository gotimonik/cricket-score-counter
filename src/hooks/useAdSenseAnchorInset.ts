import { Capacitor } from "@capacitor/core";
import { useEffect } from "react";

/**
 * Safety net for AdSense "anchor" (sticky bottom/top) ads.
 *
 * Anchor ads are fixed-position and sit on top of the page. The proper fix
 * is turning "Anchor ads" off in AdSense -> Ads -> By site -> Overlay
 * formats, but Google can still inject one (e.g. before the setting
 * propagates). If it does, this pads the page by the ad's height so the
 * last bit of content and the footer can always be scrolled into view
 * instead of being permanently covered.
 */
export function useAdSenseAnchorInset() {
  useEffect(() => {
    if (typeof document === "undefined" || Capacitor.isNativePlatform()) return;

    const root = document.documentElement;
    let last = "";

    const measure = () => {
      let bottom = 0;
      let top = 0;
      document
        .querySelectorAll<HTMLElement>("ins.adsbygoogle[data-anchor-status]")
        .forEach((el) => {
          const status = el.getAttribute("data-anchor-status");
          if (status === "dismissed") return;
          const rect = el.getBoundingClientRect();
          if (rect.height <= 0) return;
          if (rect.top > window.innerHeight / 2) bottom = Math.max(bottom, rect.height);
          else top = Math.max(top, rect.height);
        });
      const next = `${Math.round(bottom)}|${Math.round(top)}`;
      if (next === last) return;
      last = next;
      root.style.setProperty("--web-anchor-ad-bottom", `${Math.round(bottom)}px`);
      root.style.setProperty("--web-anchor-ad-top", `${Math.round(top)}px`);
    };

    let scheduled = 0;
    const schedule = () => {
      cancelAnimationFrame(scheduled);
      scheduled = requestAnimationFrame(measure);
    };

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-anchor-status", "style"],
    });
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(scheduled);
    };
  }, []);
}
