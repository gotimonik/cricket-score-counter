import { useEffect } from "react";

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

    const track = (eventName: string, eventLabel: string, meta?: Record<string, unknown>) => {
      if (typeof window.gtag !== "function") return;
      window.gtag("event", eventName, {
        event_category: "interaction",
        event_label: eventLabel,
        ...meta,
      });
    };

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest("button, a, [data-ga-click]");
      if (!clickable) return;
      const label = normalizeLabel(
        clickable.getAttribute("data-ga-click") ||
          clickable.getAttribute("aria-label") ||
          clickable.getAttribute("id") ||
          clickable.textContent
      );
      if (!label) return;
      track(
        "click",
        label,
        { tag_name: clickable.tagName }
      );
    };

    const submitHandler = (e: Event) => {
      const form = e.target as HTMLFormElement;
      if (!form || form.tagName !== "FORM") return;
      const label = normalizeLabel(
        form.getAttribute("data-ga-submit") ||
        form.getAttribute("aria-label") ||
        form.getAttribute("id") ||
        "form_submit"
      );
      track("form_submit", label, { tag_name: "FORM" });
    };

    const changeHandler = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const field = target.closest("input, select, textarea") as
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
      track("change", label, { tag_name: field.tagName });
    };

    document.addEventListener("click", handler);
    document.addEventListener("submit", submitHandler, true);
    document.addEventListener("change", changeHandler, true);
    return () => {
      document.removeEventListener("click", handler);
      document.removeEventListener("submit", submitHandler, true);
      document.removeEventListener("change", changeHandler, true);
    };
  }, []);
}
