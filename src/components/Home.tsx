import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const cricketBg = "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [gameId, setGameId] = useState("");

  const [gameIdError, setGameIdError] = useState("");
  const { t } = useTranslation();

  // Only show AdSenseBanner if there is meaningful content (e.g., main heading and description)
  const hasContent = true; // Home page always has content
  const handleCreateGame = () => {
    navigate("/create-game");
  };

  return (
    <>
      <MetaHelmet
        pageTitle="Home"
        canonical="/"
        description="Cricket Score Counter App - Track your match easily. The easiest way to score, track, and share your cricket matches live."
      />
      <AppBar />
      {/* AdSense banner for content-rich page */}
      <AdSenseBanner show={hasContent} />
      <Box
        sx={{
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: cricketBg,
          position: "relative",
          overflow: "hidden",
          overflowX: { xs: "hidden", sm: "unset" },
          overflowY: { xs: "hidden", sm: "unset" },
          pt: 5,
        }}
      >
        {/* Animated background with cricket field and ball */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            width: "100vw",
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
              width: "100vw",
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
          elevation={12}
          sx={{
            px: { xs: 2, sm: 3, md: 6 },
            py: { xs: 2, sm: 3, md: 5 },
            minWidth: { xs: "96vw", sm: 400, md: 600 },
            width: { xs: "99vw", sm: 800, md: 1000 },
            maxWidth: { xs: "100vw", sm: 1200 },
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
            pb: { xs: 10, sm: 0 }, // space for sticky footer on mobile
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: "#185a9d",
              fontWeight: 900,
              fontSize: { xs: 22, sm: 32, md: 38 },
              mb: 1,
              pt: { xs: 2, sm: 2 },
              wordBreak: "break-word",
              whiteSpace: "normal",
              maxWidth: { xs: "90vw", sm: "95vw", md: 700 },
            }}
          >
            {t("Cricket Score Counter")}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#43cea2",
              fontWeight: 700,
              fontSize: { xs: 15, sm: 18 },
              mb: 2,
              wordBreak: "break-word",
              whiteSpace: "normal",
              maxWidth: { xs: "90vw", sm: "95vw", md: 700 },
            }}
          >
            {t(
              "The easiest way to score, track, and share your cricket matches live.",
            )}
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
                fontSize: { xs: 15, sm: 18 },
                borderRadius: 99,
                boxShadow: "0 6px 24px 0 #185a9d55",
                py: 1.2,
                minWidth: { xs: 120, sm: 150 },
                maxWidth: { xs: "100%", sm: 260 },
                background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
                color: "#fff",
                letterSpacing: 1,
                textTransform: "none",
                mb: 1,
                whiteSpace: "normal",
                wordBreak: "break-word",
                px: 2,
                "&:hover, &:focus": {
                  background:
                    "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)",
                  color: "#fff",
                  boxShadow: "0 8px 32px 0 #185a9d77",
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
                fontSize: { xs: 15, sm: 18 },
                borderRadius: 99,
                py: 1.2,
                minWidth: { xs: 120, sm: 150 },
                maxWidth: { xs: "100%", sm: 260 },
                borderWidth: 2,
                background: "rgba(255,255,255,0.85)",
                color: "#185a9d",
                borderColor: "#185a9d",
                letterSpacing: 1,
                textTransform: "none",
                mb: 1,
                whiteSpace: "normal",
                wordBreak: "break-word",
                px: 2,
                "&:hover, &:focus": {
                  background:
                    "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)",
                  color: "#fff",
                  borderColor: "#43cea2",
                  boxShadow: "0 8px 32px 0 #185a9d77",
                  transform: "scale(1.04)",
                },
              }}
            >
              📲 {t("Join Game")}
            </Button>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: "#185a9d",
              fontWeight: 600,
              fontSize: { xs: 13, sm: 14 },
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
                  color: "#185a9d",
                  fontWeight: 700,
                  mb: 0.5,
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  fontSize: { xs: 16, sm: 18 },
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
                  fontSize: { xs: 13, sm: 15 },
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
                  color: "#43cea2",
                  fontWeight: 700,
                  mb: 0.5,
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                  fontSize: { xs: 16, sm: 18 },
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
                  fontSize: { xs: 13, sm: 15 },
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
                  fontSize: { xs: 16, sm: 18 },
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
                  fontSize: { xs: 13, sm: 15 },
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
                fontSize: 22,
                color: "#185a9d",
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
                      navigate(`/join-game/${gameId.trim()}`);
                    }
                  }
                }}
                sx={{
                  mt: 2,
                  mb: 1,
                  borderRadius: 2,
                  background: "#fff",
                  boxShadow: "0 1px 4px 0 #185a9d22",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                  fontSize: { xs: 18, sm: 20 },
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
                  fontSize: 14,
                  borderWidth: 2,
                  background: "#fff",
                  transition: "all 0.2s",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  maxWidth: { xs: "100%", sm: 160 },
                  "&:hover": {
                    background: "#f5f5f5",
                    borderColor: "#185a9d",
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
                    navigate(`/join-game/${gameId.trim()}`);
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
                  fontSize: 14,
                  background:
                    "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
                  color: "#fff",
                  boxShadow: "0 2px 8px 0 #185a9d33",
                  transition: "all 0.2s",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  maxWidth: { xs: "100%", sm: 160 },
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)",
                    color: "#fff",
                  },
                }}
              >
                {t("View Score")}
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </>
  );
};

export default Home;
