import { Capacitor } from "@capacitor/core";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

export type ShareOutcome = "shared" | "cancelled" | "unsupported";

const blobToBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

const isCancel = (err: unknown) => /cancel|abort/i.test(String((err as Error)?.message ?? err));

/**
 * Opens the system share sheet (Instagram, WhatsApp, Messages, Save image…).
 * In the apps this is the native sheet via @capacitor/share; on the web the
 * browser's share sheet where there is one. With an image, the link goes in
 * the caption so story/post apps get the picture and chats get both.
 */
export const shareNative = async (p: {
  title?: string;
  text?: string;
  url: string;
  image?: Blob;
  fileName?: string;
}): Promise<ShareOutcome> => {
  const caption = [p.text, p.url].filter(Boolean).join("\n");
  if (Capacitor.isNativePlatform()) {
    try {
      if (p.image) {
        const name = p.fileName || `cricket-score-${Date.now()}.png`;
        const written = await Filesystem.writeFile({
          path: name,
          data: await blobToBase64(p.image),
          directory: Directory.Cache,
        });
        await Share.share({ title: p.title, text: caption, files: [written.uri], dialogTitle: p.title });
      } else {
        await Share.share({ title: p.title, text: p.text, url: p.url, dialogTitle: p.title });
      }
      return "shared";
    } catch (err) {
      return isCancel(err) ? "cancelled" : "unsupported";
    }
  }

  const nav = typeof navigator !== "undefined" ? navigator : null;
  if (!nav?.share) return "unsupported";
  try {
    if (p.image) {
      const file = new File([p.image], p.fileName || "cricket-score.png", { type: p.image.type || "image/png" });
      if (nav.canShare?.({ files: [file] })) {
        await nav.share({ title: p.title, text: caption, files: [file] });
        return "shared";
      }
    }
    await nav.share({ title: p.title, text: p.text, url: p.url });
    return "shared";
  } catch (err) {
    return isCancel(err) ? "cancelled" : "unsupported";
  }
};

/** Copies text; true on success. */
export const copyText = async (value: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = value;
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(area);
      return ok;
    } catch {
      return false;
    }
  }
};

/** True when a share sheet exists here (native app or a browser that has one). */
export const canShareNatively = () =>
  Capacitor.isNativePlatform() || (typeof navigator !== "undefined" && typeof navigator.share === "function");
