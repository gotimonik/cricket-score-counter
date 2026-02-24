import React, { useEffect, useMemo, useState } from "react";
import AdSenseBanner from "./AdSenseBanner";
import {
  Box,
  Typography,
  Paper,
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

const cricketBg =
  "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))";
const HOME_GUIDE_SEEN_KEY = "home-feature-guide-seen";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);
  const [recentMatchesOpen, setRecentMatchesOpen] = useState(false);
  const [gameId, setGameId] = useState("");
  const [isGuideOpen, setGuideOpen] = useState(false);

  const [gameIdError, setGameIdError] = useState("");
  const { t } = useTranslation();
  const recentMatches = getCompletedMatches();
  const isV1 = location.pathname === "/v1" || location.pathname.startsWith("/v1/");

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
        pageTitle="Home"
        canonical="/"
        description="Cricket Score Counter App - Track your match easily. The easiest way to score, track, and share your cricket matches live."
      />
      <AppBar />
      <Box
        className="app-home-shell"
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: cricketBg,
          position: "relative",
          overflow: "hidden",
          py: 5,
        }}
      >
        {/* Animated background with cricket field and ball */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100vh",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          {/* Cricket field ellipse */}
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
              opacity: 0.12,
            }}
            aria-label="Cricket field background"
            role="img"
          >
            <ellipse cx="200" cy="120" rx="180" ry="60" fill="#fff" />
          </svg>
        </Box>
        <Paper
          className="app-home-card"
          elevation={12}
          sx={{
            px: { xs: 2, sm: 3, md: 6 },
            py: { xs: 2, sm: 3, md: 5 },
            minWidth: { xs: "auto", sm: 400, md: 600 },
            width: { xs: "calc(100% - 16px)", sm: "min(800px, calc(100% - 24px))", md: "min(1000px, calc(100% - 32px))" },
            maxWidth: { xs: "100%", sm: 1200 },
            minHeight: { xs: 300, sm: 350, md: 450 },
            height: "auto",
            overflowWrap: "break-word",
            wordBreak: "break-word",
            whiteSpace: "normal",
            textAlign: "center",
            borderRadius: { xs: 2, sm: 7 },
            boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.18)",
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(8px)",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "hidden",
            pb: { xs: 2, sm: 0 },
          }}
        >
          <Typography
          component="h1"
          variant="h1"
          sx={{
            color: 'var(--app-accent-text, #185a9d)',
            fontWeight: 900,
            fontSize: { xs: "calc(28px * var(--app-font-scale, 1))", sm: "calc(38px * var(--app-font-scale, 1))", md: "calc(44px * var(--app-font-scale, 1))" },
            mb: 2,
            textAlign: 'center',
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            maxWidth: { xs: '92vw', sm: '95vw', md: 800 },
            letterSpacing: 0.5,
          }}
        >
          {t("Cricket Score Counter – Free Online Live Score Tracker")}
        </Typography>
          <Typography
                    variant="body1"
          sx={{
            color: 'var(--app-accent-start, #43cea2)',
            fontWeight: 500,
            fontSize: { xs: "calc(16px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))", md: "calc(20px * var(--app-font-scale, 1))" },
            mb: 3,
            textAlign: 'center',
            maxWidth: { xs: '92vw', sm: '90vw', md: 700 },
          }}
          >
            {t("Effortlessly count runs, track overs, and share live cricket scores with friends. Perfect for street, club, or school matches – keep your game organized and scores accessible from any device, anywhere.")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              width: "100%",
              justifyContent: "center",
              mb: 2,
              maxWidth: { xs: "100vw", sm: 700 },
            }}
          >
            <Button
              data-ga-click="create_game"
              variant="contained"
              color="success"
              onClick={handleCreateGame}
              size="large"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "calc(15px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))" },
                borderRadius: 99,
                boxShadow: "0 6px 24px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 33%, transparent 67%)",
                py: 1.2,
                minWidth: { xs: 120, sm: 150 },
                maxWidth: { xs: "100%", sm: 260 },
                background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                color: "#fff",
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
                  boxShadow: "0 8px 32px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 47%, transparent 53%)",
                  transform: "scale(1.04)",
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
                  transform: "scale(1.04)",
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
                    transform: "scale(1.04)",
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
              color: "var(--app-accent-text, #185a9d)",
              fontWeight: 600,
              fontSize: { xs: "calc(13px * var(--app-font-scale, 1))", sm: "calc(14px * var(--app-font-scale, 1))" },
              mb: 1.5,
              wordBreak: "break-word",
              whiteSpace: "normal",
              maxWidth: { xs: "90vw", sm: "95vw", md: 700 },
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
            }}
          >
            <Box
              sx={{
                flex: 1,
                minWidth: { xs: 120, sm: 180 },
                textAlign: "center",
                p: { xs: 0.5, sm: 1 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: { xs: 90, sm: 110 },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "var(--app-accent-text, #185a9d)",
                  fontWeight: 700,
                  mb: 0.5,
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  fontSize: { xs: "calc(16px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))" },
                  maxWidth: { xs: "100%", sm: 220 },
                }}
              >
                🏏 {t("Quick Match Setup")}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#555",
                  fontWeight: 500,
                  mt: "auto",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  fontSize: { xs: "calc(13px * var(--app-font-scale, 1))", sm: "calc(15px * var(--app-font-scale, 1))" },
                  maxWidth: { xs: "100%", sm: 220 },
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
                p: { xs: 0.5, sm: 1 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: { xs: 90, sm: 110 },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "var(--app-accent-start, #43cea2)",
                  fontWeight: 700,
                  mb: 0.5,
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  fontSize: { xs: "calc(16px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))" },
                  maxWidth: { xs: "100%", sm: 220 },
                }}
              >
                ⚡ {t("Real-Time Scoring")}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#555",
                  fontWeight: 500,
                  mt: "auto",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  fontSize: { xs: "calc(13px * var(--app-font-scale, 1))", sm: "calc(15px * var(--app-font-scale, 1))" },
                  maxWidth: { xs: "100%", sm: 220 },
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
                p: { xs: 0.5, sm: 1 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: { xs: 90, sm: 110 },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#e53935",
                  fontWeight: 700,
                  mb: 0.5,
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  fontSize: { xs: "calc(16px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))" },
                  maxWidth: { xs: "100%", sm: 220 },
                }}
              >
                📲 {t("Easy Sharing")}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#555",
                  fontWeight: 500,
                  mt: "auto",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  fontSize: { xs: "calc(13px * var(--app-font-scale, 1))", sm: "calc(15px * var(--app-font-scale, 1))" },
                  maxWidth: { xs: "100%", sm: 220 },
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
        </Paper>
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
