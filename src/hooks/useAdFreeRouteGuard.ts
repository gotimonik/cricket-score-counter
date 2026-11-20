import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";

/**
 * Keeps Google's overlay ads (sticky anchor bar, side rails) off the screens
 * where people are actively scoring or managing matches.
 *
 * These routes are excluded from Auto ads in AdSense, but AdSense only checks
 * that exclusion when a page actually loads. This is a single-page app, so
 * going Home -> Create Game is a client-side route change: an anchor ad that
 * Google attached to <body> on Home simply stays on screen and covers the
 * scoring keypad. When we land on one of these routes with such an overlay
 * present, do one real reload of the same URL so AdSense re-evaluates the
 * page and applies the exclusion. React Router keeps its navigation state in
 * history.state, which survives the reload.
 */
const AD_FREE_ROUTES = ["/create-game", "/match-history", "/join-game"];

const isAdFreeRoute = (pathname: string) =>
  AD_FREE_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));

const hasGoogleOverlay = () =>
  Array.from(document.querySelectorAll<HTMLElement>("body > ins.adsbygoogle")).some(
    (el) =>
      el.getAttribute("data-anchor-status") !== "dismissed" &&
      el.getBoundingClientRect().height > 0,
  );

export function useAdFreeRouteGuard(pathname: string) {
  useEffect(() => {
    if (typeof window === "undefined" || Capacitor.isNativePlatform()) return;
    if (!isAdFreeRoute(pathname) || !hasGoogleOverlay()) return;

    // Reload at most once per route per tab session, so this can never loop
    // even if Google still serves an overlay after the reload.
    const key = `adFreeReload:${pathname}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      return;
    }
    window.location.reload();
  }, [pathname]);
}
