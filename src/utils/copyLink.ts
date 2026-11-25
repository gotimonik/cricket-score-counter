/**
 * Copies a link (native share sheet first when available). Returns "shared",
 * "copied", or the URL itself when nothing worked so the caller can show it.
 */
export const shareOrCopyLink = async (url: string, title?: string): Promise<"shared" | "copied" | string> => {
  const nav = typeof navigator !== "undefined" ? (navigator as Navigator & { share?: (d: ShareData) => Promise<void> }) : null;
  if (nav?.share && /Android|iPhone|iPad|iPod/i.test(nav.userAgent)) {
    try {
      await nav.share({ url, title });
      return "shared";
    } catch {
      /* cancelled or unsupported: fall back to copying */
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = url;
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(area);
      if (ok) return "copied";
    } catch {
      /* show the link instead */
    }
    return url;
  }
};
