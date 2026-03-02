import React, { useEffect, useMemo, useState } from "react";
import AdSenseBanner from "./AdSenseBanner";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RecentMatchesModal from "../modals/RecentMatchesModal";
import { getCompletedMatches } from "../utils/completedMatches";
import FeatureGuideTour, { FeatureGuideStep } from "./FeatureGuideTour";
import {
  APP_VERSION_OLD,
  APP_VERSION_V1,
  getStoredAppVersion,
  setStoredAppVersion,
  toCurrentVersionPath,
} from "../utils/routes";

const HOME_GUIDE_SEEN_KEY = "home-feature-guide-seen";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [recentMatchesOpen, setRecentMatchesOpen] = useState(false);
  const [gameId, setGameId] = useState("");
  const [isGuideOpen, setGuideOpen] = useState(false);
  const [liveIndex, setLiveIndex] = useState(0);

  const [gameIdError, setGameIdError] = useState("");
  const { t } = useTranslation();
  const recentMatches = getCompletedMatches();
  const isV1 = location.pathname === "/v1" || location.pathname.startsWith("/v1/");
  const liveUpdates = useMemo(
    () => [
      "INDIA A 48/2 (4.3)  •  RRR 8.5",
      "Monik XI 76/4 (8.0)  •  Needs 21 in 12",
      "Street Warriors 32/0 (2.4)  •  CRR 12.0",
      "Club Smashers 109/7 (12.0)  •  Final Over",
    ],
    []
  );

  useEffect(() => {
    const storedVersion = getStoredAppVersion();
    if (!isV1 && storedVersion === APP_VERSION_V1) {
      navigate("/v1/", { replace: true });
      return;
    }
    setStoredAppVersion(isV1 ? APP_VERSION_V1 : APP_VERSION_OLD);
  }, [isV1, navigate]);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(HOME_GUIDE_SEEN_KEY);
      if (!seen) {
        const timer = window.setTimeout(() => setGuideOpen(true), 450);
        return () => window.clearTimeout(timer);
      }
    } catch {
      // ignore storage failures
    }
    return undefined;
  }, []);

  useEffect(() => {
    const ticker = window.setInterval(() => {
      setLiveIndex((prev) => (prev + 1) % liveUpdates.length);
    }, 2200);
    return () => window.clearInterval(ticker);
  }, [liveUpdates.length]);

  const guideSteps = useMemo<FeatureGuideStep[]>(
    () => [
      {
        selector: "[data-ga-click='open_app_preferences']",
        title: t("Use Latest Version (v1)"),
        description: t(
          "Open App Preferences and set App Version to v1 (Latest) for the newest features."
        ),
      },
      {
        selector: "[data-ga-click='create_game']",
        title: t("Create Game"),
        description: t(
          "Start a new match, set teams and overs, and begin live scoring."
        ),
      },
      {
        selector: "[data-ga-click='join_game']",
        title: t("Join Game"),
        description: t(
          "Enter a Game ID to watch score updates in real time."
        ),
      },
      ...(isV1
        ? [
            {
              selector: "[data-ga-click='recent_history']",
              title: t("History"),
              description: t(
                "Open recent completed matches and review full scorecards."
              ),
            },
          ]
        : []),
    ],
    [isV1, t]
  );

  const closeGuide = () => {
    setGuideOpen(false);
    try {
      localStorage.setItem(HOME_GUIDE_SEEN_KEY, "1");
    } catch {
      // ignore storage failures
    }
  };

  // Only show AdSenseBanner if there is meaningful content (e.g., main heading and description)
  const hasContent = true; // Home page always has content
  const handleCreateGame = () => {
    navigate(toCurrentVersionPath(location.pathname, "/create-game"));
  };

  return (
    <>
      <MetaHelmet
        pageTitle="Live Cricket Score Counter"
        canonical="/"
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
            }}
          />
          <svg
            width="100vw"
            height="100vh"
            viewBox="0 0 400 200"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              opacity: 0.18,
            }}
            aria-label="Cricket field background"
            role="img"
          >
            <ellipse cx="200" cy="120" rx="180" ry="60" fill="#fff" />
          </svg>
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
            width: { xs: "calc(100% - 16px)", sm: "min(800px, calc(100% - 24px))", md: "min(1000px, calc(100% - 32px))" },
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
            sx={{ mb: 1.6, width: "100%", justifyContent: "center", flexWrap: "wrap", rowGap: 0.7 }}
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
                fontSize: { xs: "calc(12px * var(--app-font-scale, 1))", sm: "calc(14px * var(--app-font-scale, 1))" },
                letterSpacing: 0.2,
                zIndex: 1,
                animation: "homeTicker 0.45s ease-out",
              }}
            >
              {liveUpdates[liveIndex]}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              borderRadius: { xs: 3, sm: 4 },
              px: { xs: 1.2, sm: 2.4 },
              py: { xs: 1.6, sm: 2.4 },
              mb: 2,
              background: "linear-gradient(135deg, rgba(6, 24, 55, 0.34) 0%, rgba(6, 24, 55, 0.18) 100%)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.28)",
              animation: "homeRise 0.7s ease-out both",
            }}
          >
          <Typography
          component="h1"
          variant="h1"
          sx={{
            color: '#ffffff',
            fontWeight: 900,
            fontSize: { xs: "calc(30px * var(--app-font-scale, 1))", sm: "calc(42px * var(--app-font-scale, 1))", md: "calc(48px * var(--app-font-scale, 1))" },
            mb: 1.6,
            textAlign: 'center',
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            maxWidth: { xs: '92vw', sm: '95vw', md: 800 },
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
            color: 'rgba(255,255,255,0.93)',
            fontWeight: 600,
            fontSize: { xs: "calc(17px * var(--app-font-scale, 1))", sm: "calc(20px * var(--app-font-scale, 1))", md: "calc(22px * var(--app-font-scale, 1))" },
            mb: 0.4,
            textAlign: 'center',
            maxWidth: { xs: '92vw', sm: '90vw', md: 700 },
            lineHeight: 1.38,
            textShadow: "0 1px 10px rgba(0, 0, 0, 0.25)",
            mx: "auto",
            width: "100%",
          }}
          >
            {t("Effortlessly count runs, track overs, and share live cricket scores with friends. Perfect for street, club, or school matches – keep your game organized and scores accessible from any device, anywhere.")}
          </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              width: "100%",
              justifyContent: "center",
              mb: 2,
              maxWidth: { xs: "100vw", sm: 700 },
              animation: "homeRise 0.85s ease-out both",
            }}
          >
            <Button
              data-ga-click="create_game"
              variant="contained"
              onClick={handleCreateGame}
              size="large"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "calc(15px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))" },
                borderRadius: 99,
                boxShadow:
                  "0 12px 30px color-mix(in srgb, var(--app-accent-end, #185a9d) 45%, transparent 55%)",
                py: 1.2,
                minWidth: { xs: 120, sm: 150 },
                maxWidth: { xs: "100%", sm: 260 },
                background:
                  "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                color: "var(--app-accent-contrast-text, #fff)",
                letterSpacing: 1,
                textTransform: "none",
                mb: 1,
                whiteSpace: "normal",
                wordBreak: "break-word",
                px: 2,
                border: "1.5px solid rgba(255,255,255,0.42)",
                textShadow: "0 1px 8px rgba(0,0,0,0.25)",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
                  color: "var(--app-accent-contrast-text, #fff)",
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
              onClick={() => setModalOpen(true)}
              size="large"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "calc(15px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))" },
                borderRadius: 99,
                py: 1.2,
                minWidth: { xs: 120, sm: 150 },
                maxWidth: { xs: "100%", sm: 260 },
                borderWidth: 2,
                background: "rgba(255,255,255,0.85)",
                color: "var(--app-accent-text, #185a9d)",
                borderColor: "var(--app-accent-text, #185a9d)",
                letterSpacing: 1,
                textTransform: "none",
                mb: 1,
                whiteSpace: "normal",
                wordBreak: "break-word",
                px: 2,
                "&:hover, &:focus": {
                  background:
                    "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
                  color: "#fff",
                  borderColor: "var(--app-accent-start, #43cea2)",
                  boxShadow: "0 8px 32px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 47%, transparent 53%)",
                  transform: "translateY(-1px) scale(1.03)",
                },
              }}
            >
              📲 {t("Join Game")}
            </Button>
            {isV1 && (
              <Button
                data-ga-click="recent_history"
                variant="outlined"
                color="primary"
                onClick={() => setRecentMatchesOpen(true)}
                size="large"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "calc(15px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))" },
                  borderRadius: 99,
                  py: 1.2,
                  minWidth: { xs: 120, sm: 150 },
                  maxWidth: { xs: "100%", sm: 260 },
                  borderWidth: 2,
                  background: "rgba(255,255,255,0.85)",
                  color: "var(--app-accent-text, #185a9d)",
                  borderColor: "var(--app-accent-text, #185a9d)",
                  letterSpacing: 1,
                  textTransform: "none",
                  mb: 1,
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  px: 2,
                  "&:hover, &:focus": {
                    background:
                      "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
                    color: "#fff",
                    borderColor: "var(--app-accent-start, #43cea2)",
                    boxShadow: "0 8px 32px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 47%, transparent 53%)",
                    transform: "translateY(-1px) scale(1.03)",
                  },
                }}
              >
                📜 {t("History")}
              </Button>
            )}
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255,255,255,0.93)",
              fontWeight: 700,
              fontSize: { xs: "calc(13px * var(--app-font-scale, 1))", sm: "calc(14px * var(--app-font-scale, 1))" },
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
                "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-end, #185a9d) 38%, transparent 62%) 0%, color-mix(in srgb, var(--app-accent-start, #43cea2) 22%, transparent 78%) 100%)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.16)",
              animation: "homeRise 1.05s ease-out both",
            }}
          >
            <Box
              sx={{
                flex: 1,
                minWidth: { xs: 120, sm: 180 },
                textAlign: "center",
                p: { xs: 1, sm: 1.2 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: { xs: 90, sm: 110 },
                borderRadius: 2.4,
                background:
                  "linear-gradient(145deg, rgba(9, 47, 84, 0.68) 0%, rgba(26, 96, 154, 0.58) 100%)",
                border: "1px solid rgba(255,255,255,0.18)",
                boxShadow: "0 10px 28px rgba(0,0,0,0.14)",
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
                  color: "#c9e8ff",
                  fontWeight: 700,
                  mb: 0.5,
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  fontSize: { xs: "calc(16px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))" },
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
                  color: "rgba(255,255,255,0.88)",
                  fontWeight: 500,
                  mt: "auto",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  fontSize: { xs: "calc(13px * var(--app-font-scale, 1))", sm: "calc(15px * var(--app-font-scale, 1))" },
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
                p: { xs: 1, sm: 1.2 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: { xs: 90, sm: 110 },
                borderRadius: 2.4,
                background:
                  "linear-gradient(145deg, rgba(9, 68, 66, 0.68) 0%, rgba(23, 122, 103, 0.58) 100%)",
                border: "1px solid rgba(255,255,255,0.18)",
                boxShadow: "0 10px 28px rgba(0,0,0,0.14)",
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
                  color: "#8af3d1",
                  fontWeight: 700,
                  mb: 0.5,
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  fontSize: { xs: "calc(16px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))" },
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
                  color: "rgba(255,255,255,0.88)",
                  fontWeight: 500,
                  mt: "auto",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  fontSize: { xs: "calc(13px * var(--app-font-scale, 1))", sm: "calc(15px * var(--app-font-scale, 1))" },
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
                p: { xs: 1, sm: 1.2 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: { xs: 90, sm: 110 },
                borderRadius: 2.4,
                background:
                  "linear-gradient(145deg, rgba(58, 22, 38, 0.66) 0%, rgba(102, 30, 59, 0.56) 100%)",
                border: "1px solid rgba(255,255,255,0.18)",
                boxShadow: "0 10px 28px rgba(0,0,0,0.14)",
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
                  color: "#ffbf69",
                  fontWeight: 700,
                  mb: 0.5,
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  fontSize: { xs: "calc(16px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))" },
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
                  fontSize: { xs: "calc(13px * var(--app-font-scale, 1))", sm: "calc(15px * var(--app-font-scale, 1))" },
                  maxWidth: { xs: "100%", sm: 220 },
                  mx: "auto",
                  textAlign: "center",
                }}
              >
                {t("Share your match link with friends and family instantly.")}
              </Typography>
            </Box>
          </Box>
          {/* Game ID Modal */}
          <Dialog
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            PaperProps={{
              sx: {
                borderRadius: 4,
                p: 2,
                background: "linear-gradient(135deg, #f8fffc 0%, #e0eafc 100%)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
                minWidth: { xs: 300, sm: 400 },
                maxWidth: "90vw",
              },
            }}
          >
            <DialogTitle
              sx={{
                fontWeight: 700,
                fontSize: "calc(22px * var(--app-font-scale, 1))",
                color: "var(--app-accent-text, #185a9d)",
                textAlign: "center",
                pb: 1,
                letterSpacing: 1,
                wordBreak: "break-word",
                whiteSpace: "normal",
                maxWidth: { xs: "90vw", sm: "95vw", md: 400 },
              }}
            >
              {t("Enter Game ID")}
            </DialogTitle>
            <DialogContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pt: 0,
              }}
            >
              <TextField
                id="game-id-input"
                aria-label={t("Game ID")}
                autoFocus
                margin="dense"
                type="text"
                fullWidth
                variant="outlined"
                label={t("Game ID")}
                value={gameId}
                onChange={(e) => {
                  setGameId(e.target.value);
                  setGameIdError("");
                }}
                error={!!gameIdError}
                helperText={gameIdError || ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (!gameId.trim()) {
                      setGameIdError(t("Game ID is required"));
                    } else {
                      setModalOpen(false);
                      navigate(
                        toCurrentVersionPath(location.pathname, `/join-game/${gameId.trim()}`)
                      );
                    }
                  }
                }}
                sx={{
                  mt: 2,
                  mb: 1,
                  borderRadius: 2,
                  background: "#fff",
                  boxShadow: "0 1px 4px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                  fontSize: { xs: "calc(18px * var(--app-font-scale, 1))", sm: "calc(20px * var(--app-font-scale, 1))" },
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  maxWidth: { xs: "90vw", sm: 350 },
                }}
              />
            </DialogContent>
            <DialogActions
              sx={{ justifyContent: "space-between", px: 3, pb: 2 }}
            >
              <Button
                data-ga-click="cancel_join_game"
                onClick={() => setModalOpen(false)}
                color="secondary"
                variant="outlined"
                size="small"
                sx={{
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2,
                  py: 0.7,
                  fontSize: "calc(14px * var(--app-font-scale, 1))",
                  borderWidth: 2,
                  background: "#fff",
                  transition: "all 0.2s",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  maxWidth: { xs: "100%", sm: 160 },
                  "&:hover": {
                    background: "#f5f5f5",
                    borderColor: "var(--app-accent-text, #185a9d)",
                  },
                }}
              >
                {t("Cancel")}
              </Button>
              <Button
                data-ga-click="confirm_join_game"
                onClick={() => {
                  if (!gameId.trim()) {
                    setGameIdError(t("Game ID is required"));
                  } else {
                    setModalOpen(false);
                    navigate(
                      toCurrentVersionPath(location.pathname, `/join-game/${gameId.trim()}`)
                    );
                  }
                }}
                color="primary"
                variant="contained"
                size="small"
                sx={{
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 2,
                  py: 0.7,
                  fontSize: "calc(14px * var(--app-font-scale, 1))",
                  background:
                    "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                  color: "#fff",
                  boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
                  transition: "all 0.2s",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  maxWidth: { xs: "100%", sm: 160 },
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
                    color: "#fff",
                  },
                }}
              >
                {t("View Score")}
              </Button>
            </DialogActions>
          </Dialog>
          <RecentMatchesModal
            open={recentMatchesOpen}
            onClose={() => setRecentMatchesOpen(false)}
            matches={recentMatches}
            onSelectMatch={(id) => {
              setRecentMatchesOpen(false);
              navigate(toCurrentVersionPath(location.pathname, `/match-history/${id}`));
            }}
          />
        </Box>
      </Box>
      <FeatureGuideTour
        open={isGuideOpen}
        steps={guideSteps}
        onClose={closeGuide}
      />
      {/* Render ad after substantial home content */}
      <AdSenseBanner show={hasContent} />
    </>
  );
};

export default Home;
