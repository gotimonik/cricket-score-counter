import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { APP_URL } from "../utils/constant";

declare global {
  interface Window {
    // Set in public/index.html: "web", "android" or "ios".
    __GA_APP_PLATFORM__?: string;
  }
}

export function useGAPageTracking() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      const pagePath = location.pathname + location.search;
      // The iOS app runs at capacitor://localhost, so GA would otherwise
      // record every app page under that address. Report the matching
      // website URL instead; "set" makes it stick for the click events that
      // follow on this page too.
      if (window.__GA_APP_PLATFORM__ === "ios") {
        window.gtag("set", { page_location: `${APP_URL}${pagePath}` });
      }
      window.gtag("event", "page_view", {
        page_path: pagePath,
      });
    }
  }, [location]);
}
