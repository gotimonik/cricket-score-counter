import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

const pushToDataLayer = (payload: Record<string, unknown>) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
};

// Shared GA4 dispatch. Used internally by the click/submit/change
// auto-tracking below, and exported so any component that needs to fire a
// one-off custom event that ISN'T the direct result of a DOM click (e.g.
// an ad/promo banner impression -- see PromoBannerCard.tsx) can send it
// through the exact same GTM + gtag pipeline instead of reimplementing it.
// Fire-and-forget: never throws, and is a no-op if neither GTM nor gtag is
// loaded (e.g. blocked by an ad blocker, or not configured for this env).
export const trackGAEvent = (
  eventName: string,
  eventLabel: string,
  meta?: Record<string, unknown>,
): void => {
  const payload = {
    event: eventName,
    event_category: "interaction",
    event_label: eventLabel,
    ...meta,
  };

  // Push event to GTM
  pushToDataLayer(payload);

  // Optional: also send directly to GA4
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
  }
};

const DATA_GA_META_PREFIX = "data-ga-meta-";

// Any data-ga-meta-foo-bar="baz" attribute on a tracked element rides
// along as an extra { fooBar: "baz" } event param -- lets a single stable
// data-ga-click label (good for GA4 filtering/reporting) still carry
// per-instance detail, e.g. which of several rotating promo banners was
// actually clicked.
const readMetaAttributes = (el: HTMLElement): Record<string, unknown> => {
  const meta: Record<string, unknown> = {};
  Array.from(el.attributes).forEach((attr) => {
    if (!attr.name.startsWith(DATA_GA_META_PREFIX)) return;
    const key = attr.name
      .slice(DATA_GA_META_PREFIX.length)
      .replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
    if (key) meta[key] = attr.value;
  });
  return meta;
};

export function useGAClickTracking() {
  useEffect(() => {
    const normalizeLabel = (value?: string | null): string => {
      if (!value) return "";

      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 80);
    };

    const clickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;

      if (!target) return;

      const clickable = target.closest(
        "button, a, [data-ga-click]"
      ) as HTMLElement | null;

      if (!clickable) return;

      const label = normalizeLabel(
        clickable.getAttribute("data-ga-click") ||
          clickable.getAttribute("aria-label") ||
          clickable.getAttribute("id") ||
          clickable.textContent
      );

      if (!label) return;

      trackGAEvent("click", label, {
        tag_name: clickable.tagName,
        element_id: clickable.id || label,
        element_text:
          clickable.textContent?.trim().slice(0, 100) || undefined,
        ...readMetaAttributes(clickable),
      });
    };

    const submitHandler = (e: Event) => {
      const form = e.target as HTMLFormElement | null;

      if (!form || form.tagName !== "FORM") return;

      const label = normalizeLabel(
        form.getAttribute("data-ga-submit") ||
          form.getAttribute("aria-label") ||
          form.getAttribute("id") ||
          "form_submit"
      );

      trackGAEvent("form_submit", label, {
        tag_name: "FORM",
        form_id: form.id || undefined,
      });
    };

    const changeHandler = (e: Event) => {
      const target = e.target as HTMLElement | null;

      if (!target) return;

      const field = target.closest(
        "input, select, textarea"
      ) as
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLTextAreaElement
        | null;

      if (!field) return;

      const label = normalizeLabel(
        field.getAttribute("data-ga-change") ||
          field.getAttribute("name") ||
          field.getAttribute("id") ||
          field.getAttribute("aria-label")
      );

      if (!label) return;

      trackGAEvent("change", label, {
        tag_name: field.tagName,
        field_name: field.getAttribute("name") || undefined,
      });
    };

    document.addEventListener("click", clickHandler, true);
    document.addEventListener("submit", submitHandler, true);
    document.addEventListener("change", changeHandler, true);

    return () => {
      document.removeEventListener("click", clickHandler, true);
      document.removeEventListener("submit", submitHandler, true);
      document.removeEventListener("change", changeHandler, true);
    };
  }, []);
}
