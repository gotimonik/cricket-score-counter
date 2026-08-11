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

const appContent = <AppWithRouter />;

const app =
  process.env.NODE_ENV === "development" ? (
    <React.StrictMode>{appContent}</React.StrictMode>
  ) : (
    appContent
  );

const hasPrerenderedMarkup = rootElement.hasChildNodes();

if (process.env.NODE_ENV === "production" && hasPrerenderedMarkup) {
  window.__APP_SUPPRESS_INITIAL_ROUTE_FALLBACK__ = true;

  document
    .querySelectorAll(".MuiModal-root, .MuiPopover-root")
    .forEach((node) => node.parentElement?.removeChild(node));
}

const currentPath = window.location.pathname || "/";

const mountApp = () => {
  if (hasPrerenderedMarkup) {
    hydrateRoot(rootElement, app);
  } else {
    createRoot(rootElement).render(app);
  }
};

if (hasPrerenderedMarkup) {
  // The prerendered HTML is already visible to the user the instant the
  // browser parses it, well before this script runs — so waiting here for
  // the current route's JS chunk does NOT delay first paint. It does,
  // however, avoid a serious layout-shift bug: every route is wrapped in a
  // single `<Suspense>` around a `React.lazy()` component, and if that
  // chunk hasn't been fetched yet when `hydrateRoot` first tries to render
  // it, React discards the prerendered content for that boundary and mounts
  // the (empty/invisible) fallback while the chunk loads over the network,
  // then swaps the real content back in once it arrives. That collapse of
  // the whole page body followed by it popping back to full height is a
  // large, measurable Cumulative Layout Shift on every single page load.
  // Preloading (and awaiting) the chunk before calling hydrateRoot means
  // it's already cached by the time React renders it, so hydration
  // resolves on the first pass without ever discarding the prerendered DOM.
  preloadRouteModule(currentPath)
    .catch(() => {
      // Ignore preload failures — hydration will still fall back to
      // fetching the chunk itself if needed.
    })
    .finally(mountApp);
} else {
  // No prerendered markup to protect from a layout shift — mount right
  // away and let the lazy chunk load in the background as before.
  mountApp();
  void preloadRouteModule(currentPath).catch(() => {
    // Ignore preload failures.
  });
}
