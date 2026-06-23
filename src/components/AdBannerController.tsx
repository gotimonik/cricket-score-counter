import React from "react";
import { useLocation } from "react-router-dom";
import { useAdMob } from "../hooks/useAdMob";

function AdBannerController() {
  const location = useLocation();
  const { showBanner, removeBanner } = useAdMob();

  React.useEffect(() => {
    const hideBannerRoutes = [
      "/create-game",
      "/match-history",
    ];

    if (hideBannerRoutes.includes(location.pathname)) {
      removeBanner();
    } else {
      showBanner(0);
    }
  }, [location.pathname, showBanner, removeBanner]);

  return null;
}

export default AdBannerController;