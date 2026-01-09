import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useGAPageTracking() {
  const location = useLocation();

  useEffect(() => {
    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search,
    });
  }, [location]);
}
