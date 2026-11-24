/**
 * Reads an image file and returns a square, centre-cropped JPEG data URL
 * (default 256×256), small enough to store as a profile photo.
 */
export const resizeImageToDataUrl = (file: File, size = 256, quality = 0.82): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - side) / 2;
      const sy = (img.naturalHeight - side) / 2;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Couldn't process the image."));
        return;
      }
      ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read that image."));
    };
    img.src = url;
  });

export const LOGO_MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // what we accept from the device
export const LOGO_MAX_DATA_CHARS = 380_000; // what we send (server allows 400k)
export const LOGO_ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read that image. Try a PNG or JPG."));
    };
    img.src = url;
  });

/**
 * Prepares a logo for upload: checks type and size, keeps its shape (no
 * cropping), fits it inside 512×512, and keeps transparency for PNG/WebP.
 * Steps down in size until it fits the upload limit.
 */
export const resizeLogoToDataUrl = async (file: File): Promise<string> => {
  if (!LOGO_ACCEPTED_TYPES.includes(file.type)) {
    throw new Error("Please choose a PNG, JPG or WebP image.");
  }
  if (file.size > LOGO_MAX_UPLOAD_BYTES) {
    throw new Error("That image is over 5 MB. Please choose a smaller one.");
  }
  const img = await loadImage(file);
  const keepAlpha = file.type !== "image/jpeg";
  for (const maxSide of [512, 384, 256, 192]) {
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Couldn't process the image.");
    ctx.drawImage(img, 0, 0, width, height);
    let dataUrl = keepAlpha ? canvas.toDataURL("image/webp", 0.9) : canvas.toDataURL("image/jpeg", 0.85);
    // Browsers without WebP encoding fall back to PNG silently.
    if (keepAlpha && !dataUrl.startsWith("data:image/webp") && !dataUrl.startsWith("data:image/png")) {
      dataUrl = canvas.toDataURL("image/png");
    }
    if (dataUrl.length <= LOGO_MAX_DATA_CHARS) return dataUrl;
  }
  throw new Error("That image is too detailed to use as a logo. Try a simpler or smaller image.");
};
