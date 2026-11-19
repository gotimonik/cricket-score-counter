import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Capacitor } from "@capacitor/core";

/**
 * Website-only skyscraper ads that live in the empty left/right gutters.
 *
 * Why this exists: AdSense Auto ads "side rails" are placed by Google
 * without knowing our layout, so on common desktop widths they sat on top
 * of the 1400px Home card grid. These rails are rendered ONLY when the
 * gutter beside the widest content container is wide enough to hold the
 * ad plus breathing room, so they can never cover page content.
 *
 * Turn OFF "Side rail ads", "Anchor ads" and "Vignette ads" under
 * AdSense -> Ads -> By site -> Overlay formats, otherwise Google will
 * still inject its own overlays on top of these.
 */

const AD_CLIENT = "ca-pub-6031242056409187";
// Dedicated fixed 160x600 unit "CricketScoreCounter_SideRail_160x600".
const AD_SLOT = process.env.REACT_APP_ADSENSE_RAIL_SLOT || "9944874328";

// Widest centered container used by any page (Home card grid, lg: 1400).
const CONTENT_MAX_WIDTH = 1400;
const RAIL_WIDTH = 160;
const RAIL_HEIGHT = 600;
const GAP = 24; // space between content and rail, and rail and window edge
const TOP_OFFSET = 96; // below the app bar
const MIN_VIEWPORT_WIDTH = CONTENT_MAX_WIDTH + 2 * (RAIL_WIDTH + GAP * 2);
const MIN_VIEWPORT_HEIGHT = RAIL_HEIGHT + TOP_OFFSET + GAP;

// Screens where users are actively scoring/working: no distractions.
const BLOCKED_ROUTES = ["/create-game", "/match-history"];
const BLOCKED_PREFIXES = ["/join-game/"];

const hasRoomForRails = () =>
  typeof window !== "undefined" &&
  window.innerWidth >= MIN_VIEWPORT_WIDTH &&
  window.innerHeight >= MIN_VIEWPORT_HEIGHT;

function RailSlot({ side, hidden }: { side: "left" | "right"; hidden: boolean }) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  return (
    <div
      aria-label="Advertisement"
      style={{
        position: "fixed",
        top: TOP_OFFSET,
        [side]: `max(${GAP}px, calc((100vw - ${CONTENT_MAX_WIDTH}px) / 2 - ${RAIL_WIDTH + GAP}px))`,
        width: RAIL_WIDTH,
        height: RAIL_HEIGHT,
        zIndex: 1, // below app bar, dialogs, menus and toasts
        opacity: hidden ? 0 : 1,
        visibility: hidden ? "hidden" : "visible",
        transition: "opacity 0.2s ease",
        pointerEvents: hidden ? "none" : "auto",
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "inline-block", width: RAIL_WIDTH, height: RAIL_HEIGHT }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOT}
      />
    </div>
  );
}

function WebSideRailAds() {
  const location = useLocation();
  const [roomy, setRoomy] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  const adsEnabled =
    process.env.REACT_APP_ENABLE_ADS === "true" &&
    !Capacitor.isNativePlatform() &&
    !(typeof navigator !== "undefined" && navigator.userAgent === "ReactSnap");

  const blocked =
    BLOCKED_ROUTES.includes(location.pathname) ||
    BLOCKED_PREFIXES.some((p) => location.pathname.startsWith(p));

  useEffect(() => {
    if (!adsEnabled) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setRoomy(hasRoomForRails()));
    };
    update();
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
    };
  }, [adsEnabled]);

  // Fade the rails out while the footer is on screen so they never sit on
  // top of full-width footer links.
  useEffect(() => {
    if (!adsEnabled || !roomy) return;
    const footer = document.querySelector("footer");
    if (!footer || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { rootMargin: "0px 0px 0px 0px" },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, [adsEnabled, roomy, location.pathname]);

  if (!adsEnabled || blocked || !roomy) return null;

  // Keyed by path so each page view requests fresh ads.
  return (
    <React.Fragment key={location.pathname}>
      <RailSlot side="left" hidden={footerVisible} />
      <RailSlot side="right" hidden={footerVisible} />
    </React.Fragment>
  );
}

export default WebSideRailAds;
