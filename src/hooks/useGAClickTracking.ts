import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

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

    const pushToDataLayer = (payload: Record<string, unknown>) => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(payload);
    };

    const track = (
      eventName: string,
      eventLabel: string,
      meta?: Record<string, unknown>
    ) => {
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

      track("click", label, {
        tag_name: clickable.tagName,
        element_id: clickable.id || label,
        element_text:
          clickable.textContent?.trim().slice(0, 100) || undefined,
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

      track("form_submit", label, {
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

      track("change", label, {
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