import { useEffect } from "react";

export function useGAClickTracking() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest("button, a, [data-ga-click]");
      if (!clickable) return;
      if (typeof window.gtag === "function") {
        window.gtag("event", "click", {
          event_category: "interaction",
          event_label:
            clickable.getAttribute("data-ga-click") || clickable.textContent?.trim(),
          tag_name: clickable.tagName,
        });
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
}
