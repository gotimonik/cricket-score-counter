import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import PromoBannerService, {
  type PromoBannerRecord,
} from "../services/PromoBannerService";
import AnalyticsService from "../services/AnalyticsService";
import { trackGAEvent } from "../hooks/useGAClickTracking";

const ROTATE_INTERVAL_MS = 6000;

// A scrim strong enough that title/description text stays readable no
// matter how bright or busy the admin's bannerUrl photo is -- darker
// toward the text-bearing left/center of the card, slightly lighter at
// the far edge so the photo still reads as a photo.
const SCRIM_WITH_BANNER =
  "linear-gradient(100deg, rgba(3,14,38,0.92) 0%, rgba(3,14,38,0.86) 40%, rgba(3,14,38,0.68) 100%)";
const SCRIM_WITHOUT_BANNER = "rgba(3, 14, 38, 0.46)";

// Dynamic advertisement / promo card(s) for the Home page. Every part of
// it -- how many banners exist, whether each is shown, its title,
// subtitle, description, image(s), and up to two buttons with their own
// links -- comes from the backend (see PromoBannerService.getHomeBanners).
// There is no hardcoded fallback content: if the backend has nothing
// visible configured, this renders nothing at all. With more than one
// visible banner, it auto-rotates through them like a small, accessible
// carousel (paused on hover/focus and for anyone who prefers reduced
// motion; always navigable by hand via the dots below it).
//
// Every impression and click is tracked two ways -- to GA4 (via
// trackGAEvent, same pipeline the rest of the app's data-ga-click buttons
// use) and to our own analytics backend (AnalyticsService, PROMO_BANNER_VIEW
// / PROMO_BANNER_CLICK events, visible on the admin Analytics dashboard).
const PromoBannerCard: React.FC = () => {
  const navigate = useNavigate();

  // Same prerender guard used elsewhere in Home.tsx: the build's prerender
  // pass has no real network path to the backend, so skip the fetch
  // entirely rather than let it hang or throw during that pass.
  const shouldSkipLiveFetch =
    typeof navigator !== "undefined" && navigator.userAgent === "ReactSnap";

  const { data: banners } = useSWR(
    shouldSkipLiveFetch ? null : "home-promo-banners",
    () => PromoBannerService.getHomeBanners(),
    // Poll every 5 minutes so an admin adding, editing, or hiding a
    // banner shows up for people already sitting on the Home page without
    // them having to reload.
    { revalidateOnFocus: false, refreshInterval: 5 * 60 * 1000 },
  );

  const activeBanners = useMemo(() => banners ?? [], [banners]);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [imageBroken, setImageBroken] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isCardVisible, setIsCardVisible] = useState(false);
  // Tracks the last banner id we already sent a view for, so rotating
  // back and forth between the same two banners (or a re-render) doesn't
  // spam duplicate impressions -- one view per banner per time it becomes
  // visible.
  const lastTrackedViewIdRef = useRef<string | null>(null);

  useEffect(() => {
    // A revalidation can change how many banners there are (or remove
    // them all) -- clamp so a stale index never points past the end.
    setIndex((prev) =>
      activeBanners.length === 0 ? 0 : prev % activeBanners.length,
    );
  }, [activeBanners.length]);

  // Reset the "broken image" flag whenever the slide (or its image)
  // changes, so a real image on the next banner isn't hidden by a
  // previous banner's load failure.
  useEffect(() => {
    setImageBroken(false);
  }, [index]);

  useEffect(() => {
    if (activeBanners.length < 2 || paused) return;
    // Auto-rotating content should be pausable and, for anyone who has
    // asked their OS/browser for reduced motion, should not move on its
    // own at all (WCAG 2.2.2) -- people can still change slides with the
    // dots below.
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % activeBanners.length);
    }, ROTATE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [activeBanners.length, paused]);

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);

  // An ad impression only counts once the card has actually scrolled into
  // view -- not merely rendered somewhere off-screen on a long Home page.
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsCardVisible(entry.isIntersecting),
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Fires a view once per banner each time it's the visible slide of a
  // card that's actually on-screen -- covers both "page loads with the
  // banner already in view" and "carousel rotates to a new banner while
  // still in view".
  useEffect(() => {
    if (!isCardVisible) return;
    const current = activeBanners[index];
    if (!current) return;
    if (lastTrackedViewIdRef.current === current.id) return;
    lastTrackedViewIdRef.current = current.id;

    AnalyticsService.trackPromoBannerView(
      current,
      index + 1,
      activeBanners.length,
    );
    trackGAEvent("promo_banner_view", "home_promo_banner", {
      bannerId: current.id,
      slot: current.slot,
      bannerTitle: current.title,
      position: index + 1,
      total: activeBanners.length,
    });
  }, [isCardVisible, index, activeBanners]);

  if (activeBanners.length === 0) {
    return null;
  }

  const banner = activeBanners[index];

  const handleClick = (
    clickedBanner: PromoBannerRecord,
    url: string,
    openInNewTab: boolean,
    cta: { kind: "primary" | "secondary"; buttonText?: string },
  ) => {
    if (!url) return;
    // Own-platform tracking. GA4 tracking for the same click happens
    // separately and automatically via the button's data-ga-click /
    // data-ga-meta-* attributes (see useGAClickTracking).
    AnalyticsService.trackPromoBannerClick(clickedBanner, {
      kind: cta.kind,
      buttonText: cta.buttonText,
      url,
    });
    if (url.startsWith("/")) {
      navigate(url);
    } else {
      window.open(url, openInNewTab ? "_blank" : "_self", "noopener,noreferrer");
    }
  };

  const hasPrimaryCta = Boolean(banner.buttonText && banner.ctaUrl);
  const hasSecondaryCta = Boolean(banner.buttonText1 && banner.buttonLink1);
  const hasBackdrop = Boolean(banner.bannerUrl);
  // With a full-bleed backdrop photo, the inline image reads better as a
  // small, clearly-framed logo/badge than as a second competing photo --
  // without a backdrop it stays the original larger hero image.
  const showImage = Boolean(banner.imageUrl) && !imageBroken;

  return (
    <Box
      component="section"
      aria-label="Featured promotion"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: { xs: 1.5, sm: 3 },
        pt: { xs: 2.5, sm: 3.5 },
        pb: { xs: 1.5, sm: 2 },
        background:
          "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))",
      }}
    >
      <Box
        role={activeBanners.length > 1 ? "region" : undefined}
        aria-roledescription={activeBanners.length > 1 ? "carousel" : undefined}
        aria-label={activeBanners.length > 1 ? "Promotions" : undefined}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocus={pause}
        onBlur={resume}
        sx={{ width: "100%", maxWidth: 1100 }}
      >
        <Box
          ref={cardRef}
          className="home-content-card"
          role={activeBanners.length > 1 ? "group" : undefined}
          aria-roledescription={activeBanners.length > 1 ? "slide" : undefined}
          aria-label={
            activeBanners.length > 1
              ? `${index + 1} of ${activeBanners.length}${banner.title ? `: ${banner.title}` : ""}`
              : undefined
          }
          sx={{
            position: "relative",
            width: "100%",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: { xs: 2, sm: 3 },
            p: { xs: 2.25, sm: 3 },
            borderRadius: { xs: 3, sm: 4 },
            overflow: "hidden",
            border: "1.5px solid rgba(255,255,255,0.34)",
            boxShadow:
              "0 18px 44px color-mix(in srgb, var(--app-accent-end, #185a9d) 34%, transparent 66%)",
            // The optional bannerUrl paints as a full-bleed photo behind
            // everything; the scrim on top of it is deliberately strong
            // (not just a light tint) so title/description text stays
            // legible no matter how bright or busy the photo is.
            backgroundImage: hasBackdrop
              ? `${SCRIM_WITH_BANNER}, url(${banner.bannerUrl})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            background: hasBackdrop ? undefined : SCRIM_WITHOUT_BANNER,
          }}
        >
          {showImage && (
            <Box
              sx={{
                flexShrink: 0,
                width: hasBackdrop ? { xs: 84, sm: 96 } : { xs: "100%", sm: 220 },
                height: hasBackdrop ? { xs: 84, sm: 96 } : { xs: "auto", sm: 140 },
                aspectRatio: hasBackdrop ? "1 / 1" : { xs: "16 / 9", sm: "auto" },
                borderRadius: hasBackdrop ? 2.5 : 2.5,
                overflow: "hidden",
                background: hasBackdrop ? "#fff" : "transparent",
                border: hasBackdrop
                  ? "1px solid rgba(255,255,255,0.9)"
                  : "none",
                boxShadow: hasBackdrop
                  ? "0 4px 14px rgba(3, 14, 38, 0.35)"
                  : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={banner.imageUrl}
                alt={banner.title ? `${banner.title} logo` : "Promotion"}
                loading="lazy"
                onError={() => setImageBroken(true)}
                sx={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: hasBackdrop ? "contain" : "cover",
                  p: hasBackdrop ? 0.75 : 0,
                }}
              />
            </Box>
          )}
          <Box
            sx={{
              position: "relative",
              flex: 1,
              minWidth: 0,
              textAlign: { xs: "center", sm: "left" },
              width: "100%",
            }}
          >
            {banner.title && (
              <Typography
                component="p"
                sx={{
                  color: "#ffffff",
                  fontWeight: 800,
                  fontSize: { xs: "1.15rem", sm: "1.32rem" },
                  lineHeight: 1.28,
                  textShadow: "0 1px 3px rgba(0,0,0,0.45)",
                }}
              >
                {banner.title}
              </Typography>
            )}
            {banner.subTitle && (
              <Typography
                component="p"
                sx={{
                  color: "rgba(255, 255, 255, 0.92)",
                  fontWeight: 700,
                  fontSize: { xs: "0.92rem", sm: "1rem" },
                  lineHeight: 1.35,
                  mt: 0.4,
                  textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                }}
              >
                {banner.subTitle}
              </Typography>
            )}
            {banner.description && (
              <Typography
                component="p"
                sx={{
                  color: "rgba(255, 255, 255, 0.86)",
                  fontWeight: 500,
                  fontSize: { xs: "0.86rem", sm: "0.92rem" },
                  lineHeight: 1.5,
                  mt: 0.9,
                  textShadow: "0 1px 2px rgba(0,0,0,0.35)",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {banner.description}
              </Typography>
            )}
            {(hasPrimaryCta || hasSecondaryCta) && (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.2,
                  mt: 1.8,
                  justifyContent: { xs: "center", sm: "flex-start" },
                }}
              >
                {hasPrimaryCta && (
                  <Button
                    data-ga-click="home_promo_banner_cta"
                    data-ga-meta-banner-id={banner.id}
                    data-ga-meta-banner-title={banner.title}
                    data-ga-meta-slot={banner.slot}
                    onClick={() =>
                      handleClick(banner, banner.ctaUrl, banner.openInNewTab, {
                        kind: "primary",
                        buttonText: banner.buttonText,
                      })
                    }
                    sx={{
                      borderRadius: 99,
                      px: 3,
                      minHeight: 46,
                      whiteSpace: "nowrap",
                      fontWeight: 800,
                      textTransform: "none",
                      color: "#0b1f3a",
                      background: "#ffffff",
                      boxShadow: "0 4px 12px rgba(3, 14, 38, 0.3)",
                      "&:hover": { background: "#eef4ff" },
                      "&:focus-visible": {
                        outline: "3px solid #ffcf4d",
                        outlineOffset: 2,
                      },
                    }}
                  >
                    {banner.buttonText}
                  </Button>
                )}
                {hasSecondaryCta && (
                  <Button
                    data-ga-click="home_promo_banner_cta_secondary"
                    data-ga-meta-banner-id={banner.id}
                    data-ga-meta-banner-title={banner.title}
                    data-ga-meta-slot={banner.slot}
                    variant="outlined"
                    onClick={() =>
                      handleClick(
                        banner,
                        banner.buttonLink1,
                        banner.openInNewTab,
                        { kind: "secondary", buttonText: banner.buttonText1 },
                      )
                    }
                    sx={{
                      borderRadius: 99,
                      px: 3,
                      minHeight: 46,
                      whiteSpace: "nowrap",
                      fontWeight: 700,
                      textTransform: "none",
                      color: "#ffffff",
                      borderWidth: 1.5,
                      borderColor: "rgba(255, 255, 255, 0.8)",
                      "&:hover": {
                        borderWidth: 1.5,
                        borderColor: "#ffffff",
                        background: "rgba(255, 255, 255, 0.14)",
                      },
                      "&:focus-visible": {
                        outline: "3px solid #ffcf4d",
                        outlineOffset: 2,
                      },
                    }}
                  >
                    {banner.buttonText1}
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {activeBanners.length > 1 && (
          <Box
            role="tablist"
            aria-label="Choose promotion"
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 0.9,
              mt: 1.5,
            }}
          >
            {activeBanners.map((item, dotIndex) => (
              <Box
                key={item.id || dotIndex}
                component="button"
                type="button"
                role="tab"
                aria-selected={dotIndex === index}
                aria-current={dotIndex === index}
                aria-label={`Show promotion ${dotIndex + 1} of ${activeBanners.length}`}
                data-ga-click="home_promo_banner_dot"
                data-ga-meta-banner-id={item.id}
                onClick={() => setIndex(dotIndex)}
                sx={{
                  // Visible dot stays small; the clickable/tappable area
                  // is padded out to a full 44x44 touch target.
                  width: dotIndex === index ? 22 : 10,
                  height: 10,
                  p: 1.1,
                  boxSizing: "content-box",
                  borderRadius: 99,
                  border: "none",
                  background: "transparent",
                  backgroundClip: "content-box",
                  cursor: "pointer",
                  // These sit on the page's own teal-to-blue gradient
                  // background (not on the card), so they stay light/white
                  // rather than following the card's scrim colors.
                  backgroundColor:
                    dotIndex === index ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                  transition: "width 0.2s ease, background-color 0.2s ease",
                  "&:focus-visible": {
                    outline: "3px solid #ffffff",
                    outlineOffset: 2,
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PromoBannerCard;
