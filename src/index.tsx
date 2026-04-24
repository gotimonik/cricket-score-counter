import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import AppWithRouter, { preloadRouteModule } from "./App";

declare global {
  interface Window {
    __APP_SUPPRESS_INITIAL_ROUTE_FALLBACK__?: boolean;
  }
}

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

const rootElement = document.getElementById("root") as HTMLElement;
const app = (
  <React.StrictMode>
    <AppWithRouter />
  </React.StrictMode>
);

const hasPrerenderedMarkup = rootElement.hasChildNodes();
const shouldHydrate =
  hasPrerenderedMarkup && process.env.NODE_ENV !== "production";

const bootstrap = async () => {
  const currentPath = window.location.pathname || "/";

  if (process.env.NODE_ENV === "production" && hasPrerenderedMarkup) {
    window.__APP_SUPPRESS_INITIAL_ROUTE_FALLBACK__ = true;
  }

  try {
    await preloadRouteModule(currentPath);
  } catch {
    // If a route chunk fails to preload, continue with the normal render path.
  }

  if (shouldHydrate) {
    hydrateRoot(rootElement, app);
  } else {
    createRoot(rootElement).render(app);
  }
};

void bootstrap();
