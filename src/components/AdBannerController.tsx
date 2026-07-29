import React from "react";
import { useLocation } from "react-router-dom";
import { useAdMob } from "../hooks/useAdMob";

function AdBannerController() {
  const location = useLocation();
  const { showBanner, removeBanner } = useAdMob();

  React.useEffect(() => {
    let cancelled = false;

    const hideBannerRoutes = ["/create-game", "/match-history"];

    const updateBanner = async () => {
      if (cancelled) return;

      if (hideBannerRoutes.includes(location.pathname)) {
        await removeBanner();
      } else {
        await showBanner(0);
      }
    };

    void updateBanner();

    return () => {
      cancelled = true;
    };
  }, [location.pathname, removeBanner, showBanner]);

  return null;
}

export default AdBannerController;
