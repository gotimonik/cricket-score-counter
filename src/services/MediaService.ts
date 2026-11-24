import AuthService from "./AuthService";
import { resolveApiMediaUrl } from "../utils/mediaUrl";

export const MediaService = {
  /** Uploads a prepared image (data: URL) and returns a link that can be saved as a logo. */
  uploadImage: async (dataUrl: string, kind = "logo"): Promise<string> => {
    const res = await AuthService.request<{ url: string }>("/media/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataUrl, kind }),
    });
    return resolveApiMediaUrl(res.url);
  },
};

export default MediaService;
