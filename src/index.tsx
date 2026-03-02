import React from "react";
import ReactDOM from "react-dom/client";
import AppWithRouter from "./App";

const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
const isAndroid = /Android/i.test(ua);
const isNativeWebView =
  /\bwv\b/.test(ua) ||
  /; wv\)/i.test(ua) ||
  ((window as any).Capacitor?.isNativePlatform?.() ?? false) ||
  window.location.protocol === "capacitor:";

if (isAndroid && isNativeWebView) {
  document.documentElement.setAttribute("data-native-android", "true");
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppWithRouter />
  </React.StrictMode>
);
