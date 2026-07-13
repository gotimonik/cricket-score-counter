import React, { useEffect } from "react";
import { Box } from "@mui/material";

interface AdSenseBannerProps {
  show: boolean;
  minContentLength?: number;
}

const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  show,
  minContentLength = 500,
}) => {
  const adsEnabled = process.env.REACT_APP_ENABLE_ADS === "true";

  const isContentRich =
    typeof document !== "undefined" &&
    document.body &&
    document.body.innerText.length > minContentLength;

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  const isBlockedUtilityRoute = [
    "/create-game",
    "/how-it-works",
    "/about",
    "/privacy-policy",
    "/disclaimer",
  ].includes(pathname);

  const shouldRender =
    adsEnabled &&
    show &&
    isContentRich &&
    !isBlockedUtilityRoute;

  useEffect(() => {
    if (!shouldRender) return;

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [shouldRender]);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 280,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {shouldRender && (
        <ins
          className="adsbygoogle"
          style={{
            display: "block",
            width: "100%",
            minHeight: 280,
          }}
          data-ad-client="ca-pub-6031242056409187"
          data-ad-slot="3168855636"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </Box>
  );
};

export default AdSenseBanner;