import React, { useEffect, useLayoutEffect, useState } from "react";
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

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  const isBlockedUtilityRoute = [
    "/create-game",
    "/how-it-works",
    "/about",
    "/privacy-policy",
    "/disclaimer",
  ].includes(pathname);

  // We can't know how much text THIS render has put on the page until
  // after it has actually committed to the DOM — reading
  // `document.body.innerText` synchronously during render only ever sees
  // the previous commit's content. That was causing a real bug: on a
  // content-rich page like Home, the first render would (incorrectly) come
  // up short, so the ad's reserved space was absent on first paint, then
  // popped in a moment later once some later render re-evaluated the check
  // against the now-current DOM — pushing everything below it (including
  // the footer) down.
  //
  // Instead, assume the page is content-rich by default (true for the
  // overwhelming majority of pages that render this component, and matches
  // what's already in the prerendered markup) and only correct DOWN to
  // hidden via useLayoutEffect — which runs before the browser paints — if
  // a page genuinely turns out to be too thin. The reserved space is either
  // there from the very first frame or never shown at all; it's never
  // added after the fact.
  const [isContentRich, setIsContentRich] = useState(true);

  useLayoutEffect(() => {
    const richEnough =
      typeof document !== "undefined" &&
      !!document.body &&
      document.body.innerText.length > minContentLength;
    setIsContentRich(richEnough);
  }, [minContentLength, pathname]);

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

  // Reserve space up front so the ad slot doesn't push page content around
  // once Google's script determines the actual ad size asynchronously.
  // 250px comfortably covers the common responsive banner heights Google
  // serves for "auto" + full-width-responsive units (a plain 200px floor
  // under-reserves for many of them, which is a real contributor to CLS).
  const reservedHeight = shouldRender ? 250 : 0;

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: reservedHeight,
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
            minHeight: 250,
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