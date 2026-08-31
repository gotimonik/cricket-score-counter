import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AnalyticsService from "../services/AnalyticsService";

// Records our own self-hosted PAGE_VIEW event (separate from Google
// Analytics -- see useGAPageTracking) on every route change.
export function useAppAnalyticsTracking() {
  const location = useLocation();

  useEffect(() => {
    AnalyticsService.trackPageView(location.pathname + location.search);
  }, [location]);
}
