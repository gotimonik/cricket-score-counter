import React, { useEffect, useMemo, useState } from "react";
import AdSenseBanner from "./AdSenseBanner";
import { Box, Typography, Chip, Stack, Button } from "@mui/material";

import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SocketIOClientEvents, SocketIOServerEvents } from "../utils/constant";
import { toCurrentVersionPath } from "../utils/routes";
import WebSocketService from "../services/WebSocketService";

type LiveUpdatePayloadItem = { gameId?: string; text?: unknown };

const getLiveUpdateText = (item: unknown): string | null => {
  if (typeof item === "string") {
    return item.trim() || null;
  }
  if (item && typeof item === "object") {
    const text = (item as LiveUpdatePayloadItem).text;
    return typeof text === "string" && text.trim() ? text.trim() : null;
  }
  return null;
};

const normalizeLiveUpdates = (payload: unknown): string[] => {
  let parsedPayload = payload;
  if (typeof payload === "string") {
    try {
      parsedPayload = JSON.parse(payload);
    } catch {
      const text = getLiveUpdateText(payload);
      return text ? [text] : [];
    }
  }

  const source =
    Array.isArray(parsedPayload)
      ? parsedPayload
      : parsedPayload && typeof parsedPayload === "object"
        ? (parsedPayload as { updates?: unknown; data?: unknown }).updates ??
          (parsedPayload as { updates?: unknown; data?: unknown }).data
        : null;

  return Array.isArray(source)
    ? source.map(getLiveUpdateText).filter((text): text is string => Boolean(text))
    : [];
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [liveIndex, setLiveIndex] = useState(0);
  const [liveUpdatesReady, setLiveUpdatesReady] = useState(false);
  const { t } = useTranslation();
  const shouldSkipLiveFetch =
    typeof navigator !== "undefined" && navigator.userAgent === "ReactSnap";
  const defaultLiveUpdates = useMemo(
    () => [
      "Street Warriors 32/0 (2.4)  •  CRR 12.0",
      "Club Smashers 109/7 (12.0)  •  Final Over",
      "Green Warriors 58/1 (5.1)  •  CRR 11.2",
      "Royal Kings 132/5 (14.0)  •  Last 6 balls",
      "Sunrise Strikers 41/3 (3.5)  •  RRR 12.8",
      "City Challengers 64/2 (6.0)  •  Partnership 40",
      "Lake Riders 99/6 (10.2)  •  Needs 18 in 10",
      "Storm Blasters 87/4 (9.0)  •  Powerplay done",
      "Gully Stars 27/0 (1.5)  •  CRR 14.7",
    ],
    [],
  );
  const [liveUpdates, setLiveUpdates] = useState<string[]>(defaultLiveUpdates);

  useEffect(() => {
    if (shouldSkipLiveFetch) {
      return;
    }
    const ws = new WebSocketService();
    ws.send(SocketIOClientEvents.HOME_PAGE_VIEW, {
      path: location.pathname,
      ts: Date.now(),
    });
    ws.startListening(SocketIOServerEvents.LIVE_UPDATES, (payload: unknown) => {
      const updates = normalizeLiveUpdates(payload);
      if (updates.length > 0) {
        setLiveUpdates([...updates, ...defaultLiveUpdates]);
        setLiveIndex(0);
        setLiveUpdatesReady(true);
      }
    });
    const fallbackTimer = window.setTimeout(() => {
      setLiveUpdatesReady(true);
    }, 2500);
    return () => {
      window.clearTimeout(fallbackTimer);
      ws.close();
    };
  }, [defaultLiveUpdates, location.pathname, shouldSkipLiveFetch]);

  useEffect(() => {
    const ticker = window.setInterval(() => {
      setLiveIndex((prev) => (prev + 1) % liveUpdates.length);
    }, 2200);
    return () => window.clearInterval(ticker);
  }, [liveUpdates.length]);

  // Only show AdSenseBanner if there is meaningful content (e.g., main heading and description)
  const hasContent = true; // Home page always has content
  const homeContentCardSx = {
    p: { xs: 2, sm: 3 },
    borderRadius: 4,
    background: "transparent",
    border: "1.5px solid rgba(255,255,255,0.28)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.12)",
  } as const;
  const homeContentTextColor = "#e9fff1";
  const homeContentMuted = "rgba(233, 255, 241, 0.82)";
  const homeActionButtonSx = {
    width: "100%",
    minHeight: 58,
    borderRadius: 99,
    px: { xs: 2.2, sm: 2.6 },
    mb: 0,
    whiteSpace: "nowrap",
    lineHeight: 1.15,
  } as const;
  const handleCreateGame = () => {
    navigate(toCurrentVersionPath(location.pathname, "/create-game"));
  };

  return (
    <>
      <MetaHelmet
        pageTitle="Live Cricket Score Counter"
        canonical={location.pathname}
        description="Live cricket score counter for local matches. Track runs, overs, wickets, and share score updates ball-by-ball in real time."
        keywords="live cricket score counter, cricket scoring app, ball by ball cricket score, cricket scoreboard online, local cricket scoring"
      />
      <AppBar />
      <Box
        className="app-home-shell"
        sx={{
          width: "100%",
          minHeight: "calc(100dvh - 88px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(120% 110% at 10% 5%, color-mix(in srgb, var(--app-accent-start, #43cea2) 45%, transparent 55%) 0%, transparent 44%), radial-gradient(90% 90% at 90% 12%, color-mix(in srgb, var(--app-accent-end, #185a9d) 42%, transparent 58%) 0%, transparent 52%), var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))",
          position: "relative",
          overflow: "hidden",
          py: { xs: 3, sm: 4.5 },
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            pointerEvents: "none",
            willChange: "transform",
            transform: "translateZ(0)",
            display: { xs: "none", md: "block" },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: "-18%",
              background:
                "conic-gradient(from 220deg at 50% 50%, color-mix(in srgb, var(--app-accent-start, #43cea2) 34%, transparent 66%) 0deg, transparent 85deg, color-mix(in srgb, var(--app-accent-end, #185a9d) 34%, transparent 66%) 175deg, transparent 260deg, color-mix(in srgb, #22d3ee 28%, transparent 72%) 360deg)",
              filter: "blur(24px)",
              opacity: 0.35,
              animation: "homeGradientShift 14s linear infinite",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              opacity: 0.2,
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.65) 1.1px, transparent 0)",
              backgroundSize: "22px 22px",
              animation: "homeDrift 18s linear infinite",
              willChange: "transform",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: { xs: -30, sm: -40 },
              right: { xs: -50, sm: -20 },
              width: { xs: 180, sm: 260 },
              height: { xs: 180, sm: 260 },
              borderRadius: "50%",
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--app-accent-start, #43cea2) 60%, #fff 40%) 0%, transparent 70%)",
              opacity: 0.25,
              animation: "homePulse 7s ease-in-out infinite",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: { xs: "24%", sm: "26%" },
              left: { xs: "-8%", sm: "6%" },
              width: { xs: 58, sm: 84 },
              height: { xs: 58, sm: 84 },
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.1) 65%, transparent 70%)",
              animation: "homeFloat 8s ease-in-out infinite",
              opacity: 0.5,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: { xs: "20%", sm: "18%" },
              right: { xs: "2%", sm: "8%" },
              width: { xs: 70, sm: 110 },
              height: { xs: 70, sm: 110 },
              borderRadius: "24px",
              transform: "rotate(18deg)",
              background:
                "linear-gradient(145deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 65%, #fff 35%) 0%, color-mix(in srgb, var(--app-accent-end, #185a9d) 70%, #fff 30%) 100%)",
              opacity: 0.2,
              animation: "homeFloat 10s ease-in-out infinite reverse",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: { xs: -60, sm: -40 },
              left: { xs: -70, sm: -20 },
              width: { xs: 220, sm: 290 },
              height: { xs: 220, sm: 290 },
              borderRadius: "50%",
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--app-accent-end, #185a9d) 45%, #fff 55%) 0%, transparent 72%)",
              opacity: 0.22,
              animation: "homePulse 9s ease-in-out infinite reverse",
            }}
          />
        </Box>
        <Box
          className="app-home-content"
          sx={{
            px: { xs: 1.2, sm: 2, md: 3 },
            py: { xs: 1, sm: 1.8, md: 2.4 },
            width: {
              xs: "calc(100% - 16px)",
              sm: "min(800px, calc(100% - 24px))",
              md: "min(1000px, calc(100% - 32px))",
            },
            textAlign: "center",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              mb: 1.6,
              width: "100%",
              justifyContent: "center",
              flexWrap: "wrap",
              rowGap: 0.7,
            }}
          >
            <Chip
              label={t("LIVE")}
              size="small"
              sx={{
                fontWeight: 900,
                letterSpacing: 1,
                color: "#fff",
                background: "#e63946",
                border: "1px solid rgba(255,255,255,0.22)",
                boxShadow: "none",
                animation: "none",
              }}
            />
            <Chip
              label={t("Instant Match Sharing")}
              size="small"
              sx={{
                fontWeight: 800,
                color: "#fff",
                background: "rgba(6, 24, 55, 0.34)",
                border: "1px solid rgba(255,255,255,0.32)",
              }}
            />
            <Chip
              label={t("Realtime Score Updates")}
              size="small"
              sx={{
                fontWeight: 800,
                color: "#fff",
                background: "rgba(6, 24, 55, 0.34)",
                border: "1px solid rgba(255,255,255,0.32)",
              }}
            />
          </Stack>
          <Box
            sx={{
              width: "100%",
              maxWidth: 760,
              mb: 1.8,
              px: { xs: 1.2, sm: 1.6 },
              py: 0.9,
              borderRadius: 999,
              background:
                "linear-gradient(90deg, rgba(4, 18, 48, 0.58) 0%, rgba(4, 18, 48, 0.38) 100%)",
              border: "1px solid rgba(255,255,255,0.28)",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.1) inset",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              overflow: "hidden",
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.22) 25%, transparent 48%)",
                transform: "translateX(-120%)",
                animation: "homeShine 3.2s ease-in-out infinite",
              },
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: "#ff4d4f",
                boxShadow: "0 0 0 0 rgba(255,77,79,0.9)",
                animation: "homePing 1.4s ease-out infinite",
                zIndex: 1,
              }}
            />
            <Typography
              key={liveIndex}
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: {
                  xs: "calc(12px * var(--app-font-scale, 1))",
                  sm: "calc(14px * var(--app-font-scale, 1))",
                },
                letterSpacing: 0.2,
                zIndex: 1,
                animation: "homeTicker 0.45s ease-out",
              }}
            >
              {liveUpdatesReady
                ? liveUpdates[liveIndex]
                : t("Fetching live scores…")}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              borderRadius: { xs: 3, sm: 4 },
              px: { xs: 1.2, sm: 2.4 },
              py: { xs: 1.6, sm: 2.4 },
              mb: 2,
              background:
                "linear-gradient(135deg, rgba(6, 24, 55, 0.34) 0%, rgba(6, 24, 55, 0.18) 100%)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.28)",
              animation: "homeRise 0.7s ease-out both",
            }}
          >
            <Typography
              component="h1"
              variant="h1"
              sx={{
                color: "#ffffff",
                fontWeight: 900,
                fontSize: {
                  xs: "calc(30px * var(--app-font-scale, 1))",
                  sm: "calc(42px * var(--app-font-scale, 1))",
                  md: "calc(48px * var(--app-font-scale, 1))",
                },
                mb: 1.6,
                textAlign: "center",
                wordBreak: "break-word",
                whiteSpace: "normal",
                maxWidth: { xs: "92vw", sm: "95vw", md: 800 },
                letterSpacing: 0.2,
                lineHeight: 1.08,
                textShadow: "0 2px 20px rgba(0, 0, 0, 0.28)",
                mx: "auto",
                width: "100%",
              }}
            >
              {t("Cricket Score Counter – Free Online Live Score Tracker")}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.93)",
                fontWeight: 600,
                fontSize: {
                  xs: "calc(17px * var(--app-font-scale, 1))",
                  sm: "calc(20px * var(--app-font-scale, 1))",
                  md: "calc(22px * var(--app-font-scale, 1))",
                },
                mb: 0.4,
                textAlign: "center",
                maxWidth: { xs: "92vw", sm: "90vw", md: 700 },
                lineHeight: 1.38,
                textShadow: "0 1px 10px rgba(0, 0, 0, 0.25)",
                mx: "auto",
                width: "100%",
              }}
            >
              {t(
                "Effortlessly count runs, track overs, and share live cricket scores with friends. Perfect for street, club, or school matches – keep your game organized and scores accessible from any device, anywhere.",
              )}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
              gap: { xs: 1.4, sm: 1.6, lg: 1.8 },
              width: "100%",
              mb: 2,
              maxWidth: { xs: 560, sm: 860, lg: 1400 },
              animation: "homeRise 0.85s ease-out both",
              alignItems: "stretch",
              justifyContent: "center",
              justifyItems: "center",
              mx: "auto",
            }}
          >
            <Button
              data-ga-click="create_game"
              variant="contained"
              onClick={handleCreateGame}
              size="large"
              sx={{
                ...homeActionButtonSx,
                fontWeight: 800,
                fontSize: {
                  xs: "calc(15px * var(--app-font-scale, 1))",
                  sm: "calc(18px * var(--app-font-scale, 1))",
                },
                boxShadow:
                  "0 12px 30px color-mix(in srgb, var(--app-accent-end, #185a9d) 45%, transparent 55%)",
                py: 1.2,
                background:
                  "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                color: "var(--app-accent-contrast-text, #fff)",
                letterSpacing: 1,
                textTransform: "none",
                wordBreak: "keep-all",
                border: "1.5px solid var(--app-accent-text, #185a9d)",
                textShadow: "0 1px 8px rgba(0,0,0,0.25)",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
                  color: "var(--app-accent-contrast-text, #fff)",
                  borderColor: "var(--app-accent-start, #43cea2)",
                  boxShadow:
                    "0 14px 34px color-mix(in srgb, var(--app-accent-end, #185a9d) 52%, transparent 48%)",
                  transform: "translateY(-1px)",
                },
                "&:focus-visible": {
                  outline: "3px solid rgba(255,255,255,0.9)",
                  outlineOffset: "2px",
                },
              }}
            >
              🏏 {t("Create Game")}
            </Button>
            <Button
              data-ga-click="join_game"
              variant="outlined"
              color="primary"
              onClick={() =>
                navigate(toCurrentVersionPath(location.pathname, "/join-game"))
              }
              size="large"
              sx={{
                ...homeActionButtonSx,
                fontWeight: 800,
                fontSize: {
                  xs: "calc(15px * var(--app-font-scale, 1))",
                  sm: "calc(18px * var(--app-font-scale, 1))",
                },
                py: 1.2,
                borderWidth: 2,
                background: "rgba(255,255,255,0.85)",
                color: "var(--app-accent-text, #185a9d)",
                borderColor: "var(--app-accent-text, #185a9d)",
                letterSpacing: 1,
                textTransform: "none",
                wordBreak: "keep-all",
                "&:hover, &:focus": {
                  background:
                    "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
                  color: "#fff",
                  borderColor: "var(--app-accent-start, #43cea2)",
                  boxShadow:
                    "0 8px 32px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 47%, transparent 53%)",
                  transform: "translateY(-1px) scale(1.03)",
                },
              }}
            >
              📲 {t("Join Game")}
            </Button>
            <Button
              data-ga-click="how_it_works"
              variant="outlined"
              color="primary"
              onClick={() =>
                navigate(
                  toCurrentVersionPath(location.pathname, "/how-it-works"),
                )
              }
              size="large"
              sx={{
                ...homeActionButtonSx,
                fontWeight: 700,
                fontSize: {
                  xs: "calc(14px * var(--app-font-scale, 1))",
                  sm: "calc(16px * var(--app-font-scale, 1))",
                },
                py: 1.2,
                borderWidth: 2,
                background: "rgba(255,255,255,0.85)",
                color: "var(--app-accent-text, #185a9d)",
                borderColor: "var(--app-accent-text, #185a9d)",
                letterSpacing: 0.6,
                textTransform: "none",
                wordBreak: "keep-all",
                "&:hover, &:focus": {
                  background:
                    "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
                  color: "#fff",
                  borderColor: "var(--app-accent-start, #43cea2)",
                  boxShadow:
                    "0 8px 32px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 47%, transparent 53%)",
                  transform: "translateY(-1px) scale(1.03)",
                },
              }}
            >
              ℹ️ {t("How It Works")}
            </Button>
            <Button
              data-ga-click="recent_history"
              variant="outlined"
              color="primary"
              onClick={() =>
                navigate(
                  toCurrentVersionPath(location.pathname, "/match-history"),
                )
              }
              size="large"
              sx={{
                ...homeActionButtonSx,
                fontWeight: 800,
                fontSize: {
                  xs: "calc(15px * var(--app-font-scale, 1))",
                  sm: "calc(18px * var(--app-font-scale, 1))",
                },
                py: 1.2,
                borderWidth: 2,
                background: "rgba(255,255,255,0.85)",
                color: "var(--app-accent-text, #185a9d)",
                borderColor: "var(--app-accent-text, #185a9d)",
                letterSpacing: 1,
                textTransform: "none",
                wordBreak: "keep-all",
                "&:hover, &:focus": {
                  background:
                    "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
                  color: "#fff",
                  borderColor: "var(--app-accent-start, #43cea2)",
                  boxShadow:
                    "0 8px 32px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 47%, transparent 53%)",
                  transform: "translateY(-1px) scale(1.03)",
                },
              }}
            >
              📜 {t("History")}
            </Button>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255,255,255,0.93)",
              fontWeight: 700,
              fontSize: {
                xs: "calc(13px * var(--app-font-scale, 1))",
                sm: "calc(14px * var(--app-font-scale, 1))",
              },
              mb: 1.5,
              wordBreak: "break-word",
              whiteSpace: "normal",
              maxWidth: { xs: "90vw", sm: "95vw", md: 700 },
              textAlign: "center",
              mx: "auto",
              width: "100%",
            }}
          >
            {t(
              "Start a new match or join an existing one to begin scoring instantly.",
            )}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "center",
              alignItems: { xs: "stretch", sm: "flex-start" },
              gap: { xs: 1, sm: 4 },
              mb: { xs: 1.5, sm: 2.5 },
              width: "100%",
              maxWidth: { xs: "100%", sm: 900 },
              p: { xs: 1.1, sm: 1.4 },
              borderRadius: 3,
              background:
                "linear-gradient(135deg, rgba(30, 96, 70, 0.55) 0%, rgba(20, 70, 52, 0.55) 100%)",
              backdropFilter: "blur(6px)",
              border: "1.5px solid rgba(255,255,255,0.18)",
              animation: "homeRise 1.05s ease-out both",
            }}
          >
            <Box
              sx={{
                flex: 1,
                minWidth: { xs: 120, sm: 180 },
                textAlign: "center",
                p: { xs: 1.2, sm: 1.4 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: { xs: 100, sm: 122 },
                borderRadius: 2.4,
                background:
                  "linear-gradient(145deg, rgba(15, 63, 86, 0.88) 0%, rgba(34, 108, 140, 0.82) 100%)",
                border: "1.5px solid rgba(255,255,255,0.28)",
                boxShadow: "0 12px 26px rgba(0,0,0,0.18)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 16px 32px rgba(0,0,0,0.2)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#d6efff",
                  fontWeight: 700,
                  mb: 0.5,
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  fontSize: {
                    xs: "calc(16px * var(--app-font-scale, 1))",
                    sm: "calc(18px * var(--app-font-scale, 1))",
                  },
                  maxWidth: { xs: "100%", sm: 220 },
                  mx: "auto",
                  textAlign: "center",
                }}
              >
                🏏 {t("Quick Match Setup")}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 500,
                  mt: "auto",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  fontSize: {
                    xs: "calc(13px * var(--app-font-scale, 1))",
                    sm: "calc(15px * var(--app-font-scale, 1))",
                  },
                  maxWidth: { xs: "100%", sm: 220 },
                  mx: "auto",
                  textAlign: "center",
                }}
              >
                {t("Start a new game in seconds—no sign up needed!")}
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                minWidth: { xs: 120, sm: 180 },
                textAlign: "center",
                p: { xs: 1.2, sm: 1.4 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: { xs: 100, sm: 122 },
                borderRadius: 2.4,
                background:
                  "linear-gradient(145deg, rgba(18, 90, 71, 0.88) 0%, rgba(24, 126, 100, 0.84) 100%)",
                border: "1.5px solid rgba(255,255,255,0.28)",
                boxShadow: "0 12px 26px rgba(0,0,0,0.18)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 16px 32px rgba(0,0,0,0.2)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#b7ffe8",
                  fontWeight: 700,
                  mb: 0.5,
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  fontSize: {
                    xs: "calc(16px * var(--app-font-scale, 1))",
                    sm: "calc(18px * var(--app-font-scale, 1))",
                  },
                  maxWidth: { xs: "100%", sm: 220 },
                  mx: "auto",
                  textAlign: "center",
                }}
              >
                ⚡ {t("Real-Time Scoring")}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 500,
                  mt: "auto",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  fontSize: {
                    xs: "calc(13px * var(--app-font-scale, 1))",
                    sm: "calc(15px * var(--app-font-scale, 1))",
                  },
                  maxWidth: { xs: "100%", sm: 220 },
                  mx: "auto",
                  textAlign: "center",
                }}
              >
                {t("Update scores ball-by-ball and see instant results.")}
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                minWidth: { xs: 120, sm: 180 },
                textAlign: "center",
                p: { xs: 1.2, sm: 1.4 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: { xs: 100, sm: 122 },
                borderRadius: 2.4,
                background:
                  "linear-gradient(145deg, rgba(74, 50, 42, 0.9) 0%, rgba(96, 66, 50, 0.86) 100%)",
                border: "1.5px solid rgba(255,255,255,0.28)",
                boxShadow: "0 12px 26px rgba(0,0,0,0.18)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 16px 32px rgba(0,0,0,0.2)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#ffc878",
                  fontWeight: 700,
                  mb: 0.5,
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  fontSize: {
                    xs: "calc(16px * var(--app-font-scale, 1))",
                    sm: "calc(18px * var(--app-font-scale, 1))",
                  },
                  maxWidth: { xs: "100%", sm: 220 },
                  mx: "auto",
                  textAlign: "center",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    marginRight: 6,
                    filter: "drop-shadow(0 0 6px rgba(255,255,255,0.35))",
                  }}
                >
                  🔗
                </span>
                {t("Easy Sharing")}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 500,
                  mt: "auto",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  fontSize: {
                    xs: "calc(13px * var(--app-font-scale, 1))",
                    sm: "calc(15px * var(--app-font-scale, 1))",
                  },
                  maxWidth: { xs: "100%", sm: 220 },
                  mx: "auto",
                  textAlign: "center",
                }}
              >
                {t("Share your match link with friends and family instantly.")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          px: { xs: 1.5, sm: 3 },
          pb: 3,
          pt: 3,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 1100 }}>
          <Box
            sx={{
              ...homeContentCardSx,
            }}
            className="home-content-card home-stagger-1"
          >
            <Box
              sx={{
                display: "grid",
                gap: 2.2,
                gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
              }}
            >
              <Box>
                <Box
                  sx={{
                    fontWeight: 900,
                    color: homeContentTextColor,
                    fontSize: "calc(22px * var(--app-font-scale, 1))",
                    mb: 1,
                  }}
                >
                  {t("Why Cricket Score Counter?")}
                </Box>
                <Box sx={{ color: homeContentMuted, mb: 1.4 }}>
                  {t(
                    "Built for local matches, Cricket Score Counter helps you score every ball, track players, and share live updates without delays. It works smoothly on phones and keeps your match organized.",
                  )}
                </Box>
                <Box sx={{ color: homeContentMuted, mb: 1.4 }}>
                  {t(
                    "Whether you score on the boundary line or from the pavilion, the interface stays fast, readable, and reliable. The goal is simple: fewer taps, fewer mistakes, and a clear scoreboard for everyone.",
                  )}
                </Box>
                <Box
                  component="ul"
                  sx={{ pl: 2.4, m: 0, color: homeContentTextColor }}
                >
                  <li>
                    {t(
                      "Fast ball-by-ball scoring with runs, extras, and wickets.",
                    )}
                  </li>
                  <li>
                    {t(
                      "Automatic stats for batting, bowling, run rate, and partnerships.",
                    )}
                  </li>
                  <li>
                    {t("Share a live link instantly with friends and teams.")}
                  </li>
                  <li>{t("Clean, readable UI for scorers and viewers.")}</li>
                </Box>
              </Box>
              <Box>
                <Box
                  sx={{
                    fontWeight: 900,
                    color: homeContentTextColor,
                    fontSize: "calc(18px * var(--app-font-scale, 1))",
                    mb: 1,
                  }}
                >
                  {t("Quick FAQ")}
                </Box>
                <Box sx={{ color: homeContentMuted, mb: 1 }}>
                  <strong>{t("Is it free to use?")}</strong>{" "}
                  {t("Yes, you can score matches for free on web and mobile.")}
                </Box>
                <Box sx={{ color: homeContentMuted, mb: 1 }}>
                  <strong>{t("Can I edit a mistake?")}</strong>{" "}
                  {t(
                    "Yes. Use undo or adjust events to keep the score correct.",
                  )}
                </Box>
                <Box sx={{ color: homeContentMuted, mb: 1 }}>
                  <strong>{t("Can viewers follow live?")}</strong>{" "}
                  {t(
                    "Share the match link and everyone can watch the score update.",
                  )}
                </Box>
                <Box sx={{ color: homeContentMuted }}>
                  <strong>{t("Do I need an account?")}</strong>{" "}
                  {t("No account required to start scoring quickly.")}
                </Box>
                <Box sx={{ color: homeContentMuted, mt: 1 }}>
                  <strong>{t("Does it work on slow networks?")}</strong>{" "}
                  {t(
                    "Yes. The app is lightweight and keeps scoring responsive even with spotty signals.",
                  )}
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                mt: 3,
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
              }}
            >
              <Box
                sx={{ p: 1.4, borderRadius: 2 }}
                className="home-content-mini"
              >
                <Box
                  sx={{ fontWeight: 800, color: homeContentTextColor, mb: 0.6 }}
                >
                  {t("For Scorers")}
                </Box>
                <Box sx={{ color: homeContentMuted }}>
                  {t(
                    "Quick buttons and clear prompts help you score accurately without missing a ball.",
                  )}
                </Box>
              </Box>
              <Box
                sx={{ p: 1.4, borderRadius: 2 }}
                className="home-content-mini"
              >
                <Box
                  sx={{ fontWeight: 800, color: homeContentTextColor, mb: 0.6 }}
                >
                  {t("For Teams")}
                </Box>
                <Box sx={{ color: homeContentMuted }}>
                  {t(
                    "Track batting and bowling stats in one place and share results after the match.",
                  )}
                </Box>
              </Box>
              <Box
                sx={{ p: 1.4, borderRadius: 2 }}
                className="home-content-mini"
              >
                <Box
                  sx={{ fontWeight: 800, color: homeContentTextColor, mb: 0.6 }}
                >
                  {t("For Fans")}
                </Box>
                <Box sx={{ color: homeContentMuted }}>
                  {t(
                    "Live links make it easy to follow the score in real time from anywhere.",
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              mt: 3,
              ...homeContentCardSx,
            }}
            className="home-content-card home-stagger-2"
          >
            <Box
              sx={{
                fontWeight: 900,
                color: homeContentTextColor,
                fontSize: "calc(20px * var(--app-font-scale, 1))",
                mb: 1,
              }}
            >
              {t("How Scoring Works")}
            </Box>
            <Box sx={{ color: homeContentMuted, mb: 1.2 }}>
              {t(
                "Each ball updates the score instantly. Runs, wickets, and extras are tracked separately so your totals remain accurate.",
              )}
            </Box>
            <Box
              sx={{
                display: "grid",
                gap: 1.2,
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              }}
            >
              <Box
                sx={{ p: 1.2, borderRadius: 2 }}
                className="home-content-mini"
              >
                <Box
                  sx={{ fontWeight: 800, color: homeContentTextColor, mb: 0.6 }}
                >
                  {t("Runs and Boundaries")}
                </Box>
                <Box sx={{ color: homeContentMuted }}>
                  {t(
                    "Add runs with a tap. Fours and sixes update the batter and the team score at the same time.",
                  )}
                </Box>
              </Box>
              <Box
                sx={{ p: 1.2, borderRadius: 2 }}
                className="home-content-mini"
              >
                <Box
                  sx={{ fontWeight: 800, color: homeContentTextColor, mb: 0.6 }}
                >
                  {t("Extras")}
                </Box>
                <Box sx={{ color: homeContentMuted }}>
                  {t(
                    "Wides and no-balls add extra runs and do not count as legal balls. Byes and leg-byes count as legal deliveries.",
                  )}
                </Box>
              </Box>
              <Box
                sx={{ p: 1.2, borderRadius: 2 }}
                className="home-content-mini"
              >
                <Box
                  sx={{ fontWeight: 800, color: homeContentTextColor, mb: 0.6 }}
                >
                  {t("Wickets")}
                </Box>
                <Box sx={{ color: homeContentMuted }}>
                  {t(
                    "Choose the wicket type and confirm the fielder when needed. The scorecard updates instantly.",
                  )}
                </Box>
              </Box>
              <Box
                sx={{ p: 1.2, borderRadius: 2 }}
                className="home-content-mini"
              >
                <Box
                  sx={{ fontWeight: 800, color: homeContentTextColor, mb: 0.6 }}
                >
                  {t("Overs and Run Rate")}
                </Box>
                <Box sx={{ color: homeContentMuted }}>
                  {t(
                    "Overs advance automatically with legal balls. CRR and RRR are recalculated every ball.",
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              mt: 3,
              ...homeContentCardSx,
            }}
            className="home-content-card home-stagger-3"
          >
            <Box
              sx={{
                fontWeight: 900,
                color: homeContentTextColor,
                fontSize: "calc(20px * var(--app-font-scale, 1))",
                mb: 1,
              }}
            >
              {t("Scoring Glossary")}
            </Box>
            <Box sx={{ color: homeContentMuted, mb: 1.2 }}>
              {t("A quick reference to common terms used in the app.")}
            </Box>
            <Box
              sx={{
                display: "grid",
                gap: 1,
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              }}
            >
              <Box sx={{ color: homeContentMuted }}>
                <strong>{t("Striker")}</strong> —{" "}
                {t("The batter facing the next delivery.")}
              </Box>
              <Box sx={{ color: homeContentMuted }}>
                <strong>{t("Non-striker")}</strong> —{" "}
                {t("The batter at the other end of the pitch.")}
              </Box>
              <Box sx={{ color: homeContentMuted }}>
                <strong>{t("Extras")}</strong> —{" "}
                {t("Runs from wides, no-balls, byes, and leg-byes.")}
              </Box>
              <Box sx={{ color: homeContentMuted }}>
                <strong>{t("CRR")}</strong> —{" "}
                {t("Current run rate, runs scored per over.")}
              </Box>
              <Box sx={{ color: homeContentMuted }}>
                <strong>{t("RRR")}</strong> —{" "}
                {t("Required run rate to win the match.")}
              </Box>
              <Box sx={{ color: homeContentMuted }}>
                <strong>{t("Over")}</strong> —{" "}
                {t("A set of six legal deliveries by one bowler.")}
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              mt: 3,
              ...homeContentCardSx,
            }}
            className="home-content-card home-stagger-4"
          >
            <Box
              sx={{
                fontWeight: 900,
                color: homeContentTextColor,
                fontSize: "calc(20px * var(--app-font-scale, 1))",
                mb: 1,
              }}
            >
              {t("More FAQs")}
            </Box>
            <Box sx={{ color: homeContentMuted, mb: 1 }}>
              <strong>{t("Can I score without adding players?")}</strong>{" "}
              {t("Yes. You can start quickly and add players later.")}
            </Box>
            <Box sx={{ color: homeContentMuted, mb: 1 }}>
              <strong>{t("What if a player changes teams?")}</strong>{" "}
              {t("You can edit rosters any time in Player Preferences.")}
            </Box>
            <Box sx={{ color: homeContentMuted, mb: 1 }}>
              <strong>{t("Will it save my match?")}</strong>{" "}
              {t("Yes. Recent matches can be reviewed from history.")}
            </Box>
            <Box sx={{ color: homeContentMuted }}>
              <strong>{t("Is the scorecard shareable?")}</strong>{" "}
              {t("Yes. Share the match link to let others follow live.")}
            </Box>
          </Box>
          <Box
            sx={{
              mt: 3,
              ...homeContentCardSx,
            }}
            className="home-content-card home-stagger-5"
          >
            <Box
              sx={{
                fontWeight: 900,
                color: homeContentTextColor,
                fontSize: "calc(20px * var(--app-font-scale, 1))",
                mb: 1,
              }}
            >
              {t("Practical Match-Day Tips")}
            </Box>
            <Box sx={{ color: homeContentMuted, mb: 1.4 }}>
              {t(
                "Good scoring habits make the scoreboard more trustworthy and easier to follow for both teams and spectators. These tips come from real local-match scoring scenarios where speed and accuracy matter at the same time.",
              )}
            </Box>
            <Box
              component="ul"
              sx={{ pl: 2.4, m: 0, color: homeContentTextColor }}
            >
              <li>
                {t(
                  "Confirm the opening batters, bowler, and total overs before the first ball.",
                )}
              </li>
              <li>
                {t(
                  "Announce wickets and extras clearly before entering the next event.",
                )}
              </li>
              <li>
                {t(
                  "Share the live link after the innings has genuinely started, not before setup is complete.",
                )}
              </li>
              <li>
                {t(
                  "Use the history or recent events area to catch mistakes early instead of waiting until the innings ends.",
                )}
              </li>
            </Box>
          </Box>
          <Box
            sx={{
              mt: 3,
              ...homeContentCardSx,
            }}
            className="home-content-card home-stagger-6"
          >
            <Box
              sx={{
                fontWeight: 900,
                color: homeContentTextColor,
                fontSize: "calc(20px * var(--app-font-scale, 1))",
                mb: 1,
              }}
            >
              {t("Who This Tool Is Best For")}
            </Box>
            <Box
              sx={{
                display: "grid",
                gap: 1.2,
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              }}
            >
              <Box sx={{ color: homeContentMuted }}>
                <strong>{t("Street and community matches")}</strong>{" "}
                {t(
                  "Use it when you want a simple shared live score without a complex setup process.",
                )}
              </Box>
              <Box sx={{ color: homeContentMuted }}>
                <strong>{t("School and practice games")}</strong>{" "}
                {t(
                  "Track overs, wickets, and partnerships while helping players learn match situations.",
                )}
              </Box>
              <Box sx={{ color: homeContentMuted }}>
                <strong>{t("Club organizers")}</strong>{" "}
                {t(
                  "Share a live score link quickly when not everyone can be at the ground.",
                )}
              </Box>
              <Box sx={{ color: homeContentMuted }}>
                <strong>{t("Volunteer scorers")}</strong>{" "}
                {t(
                  "Use large buttons and clear prompts when scoring under time pressure on a phone.",
                )}
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              mt: 3,
              ...homeContentCardSx,
            }}
            className="home-content-card home-stagger-7"
          >
            <Box
              sx={{
                fontWeight: 900,
                color: homeContentTextColor,
                fontSize: "calc(20px * var(--app-font-scale, 1))",
                mb: 1,
              }}
            >
              {t("Support and Trust")}
            </Box>
            <Box sx={{ color: homeContentMuted, mb: 1.2 }}>
              {t(
                "Cricket Score Counter is designed as a practical scoring utility, but we also want the site itself to be useful. Public pages explain how scoring works, what the app is for, and where to get help if something is unclear.",
              )}
            </Box>
            <Box sx={{ color: homeContentMuted, mb: 1.2 }}>
              {t(
                "If you need help with setup, live links, downloads, or policy questions, visit the support page, email gotimonik1@gmail.com, or call +91 8128313138.",
              )}
            </Box>
            <Box sx={{ color: homeContentTextColor }}>
              <strong>{t("Support page:")}</strong>{" "}
              <a
                href="/support"
                style={{ color: "#fff", textDecoration: "underline" }}
              >
                {t("Open support and help")}
              </a>
            </Box>
            <Box sx={{ color: homeContentTextColor, mt: 1 }}>
              <strong>{t("More resources:")}</strong>{" "}
              <a
                href="/cricket-scoring-guide"
                style={{ color: "#fff", textDecoration: "underline" }}
              >
                {t("Cricket scoring guide")}
              </a>{" "}
              {t("and")}{" "}
              <a
                href="/scorekeeping-tips"
                style={{ color: "#fff", textDecoration: "underline" }}
              >
                {t("scorekeeping tips")}
              </a>
              {", "}
              <a
                href="/faq"
                style={{ color: "#fff", textDecoration: "underline" }}
              >
                {t("frequently asked questions")}
              </a>
            </Box>
          </Box>
        </Box>
      </Box>
      {/* Render ad after substantial home content */}
      <AdSenseBanner show={hasContent} />
    </>
  );
};

export default Home;
