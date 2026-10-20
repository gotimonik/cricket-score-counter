import React from "react";
import { Navigate } from "react-router-dom";
import { ANDROID_APP_URL, IOS_APP_URL } from "../utils/constant";

/**
 * Target of the "scan to download" QR code. On Vercel, /get-app is
 * redirected server-side by user agent (see vercel.json), so this only runs
 * when that didn't happen (local dev, other hosts, in-app navigation): send
 * iPhones/iPads to the App Store, Android to Google Play, and anyone else
 * to the download page, which shows both.
 */
const getStoreUrl = (): string | null => {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  const isAppleMobile =
    /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (isAppleMobile && IOS_APP_URL) return IOS_APP_URL;
  if (/Android/i.test(ua) && ANDROID_APP_URL) return ANDROID_APP_URL;
  return null;
};

const GetAppRedirect: React.FC = () => {
  const storeUrl = React.useMemo(getStoreUrl, []);

  React.useEffect(() => {
    if (storeUrl) window.location.replace(storeUrl);
  }, [storeUrl]);

  return storeUrl ? null : <Navigate to="/download-app" replace />;
};

export default GetAppRedirect;
