import React, { useState } from "react";
import AdSenseBanner from "./AdSenseBanner";
import {
  Box,
  Button,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import MetaHelmet from "./MetaHelmet";
import { useNavigate } from "react-router-dom";

const cricketBg = "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [gameId, setGameId] = useState("");
  const [gameIdError, setGameIdError] = useState("");

  // Only show AdSenseBanner if there is meaningful content (e.g., main heading and description)
  const hasContent = true; // Home page always has content
  return (
    <>
      <MetaHelmet />
      {/* AdSense banner for content-rich page */}
      <AdSenseBanner show={hasContent} />
      <Box
        sx={{
          minHeight: "100vh",
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
          >
            <ellipse cx="200" cy="120" rx="180" ry="60" fill="#fff" />
          </svg>
          {/* Animated cricket ball */}
          <svg
            width="90"
            height="90"
            viewBox="0 0 120 120"
            style={{
              position: "absolute",
              top: 30,
              left: 30,
              animation: "spin 8s linear infinite",
              opacity: 0.18,
            }}
          >
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="#e53935"
              stroke="#fff"
              strokeWidth="6"
            />
            <ellipse
              cx="60"
              cy="60"
              rx="40"
              ry="10"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
            />
          </svg>
          <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        </Box>
        <Paper
          elevation={12}
          sx={{
            px: { xs: 1, sm: 3, md: 6 },
            py: { xs: 2, sm: 3, md: 5 },
            minWidth: { xs: "96vw", sm: 320, md: 420 },
            width: { xs: "99vw", sm: 600, md: 720 },
            maxWidth: { xs: "100vw", sm: 900 },
            textAlign: "center",
            borderRadius: { xs: 2, sm: 7 },
            boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.18)",
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(8px)",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            m: { xs: 2, sm: 4 },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: "#185a9d",
              fontWeight: 900,
              fontSize: { xs: 22, sm: 32, md: 38 },
              mb: 1,
            }}
          >
            Cricket Score Counter
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#43cea2",
              fontWeight: 700,
              fontSize: { xs: 15, sm: 18 },
              mb: 2,
            }}
          >
            The easiest way to score, track, and share your cricket matches
            live.
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              width: "100%",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Button
              data-ga-click="create_game"
              variant="contained"
              color="success"
              onClick={() => {
                const gameId = Math.random()
                  .toString(36)
                  .substring(2, 8)
                  .toUpperCase();
                navigate("/create-game", { state: { gameId } });
              }}
              size="large"
              sx={{
                fontWeight: 800,
                fontSize: { xs: 15, sm: 18 },
                borderRadius: 99,
                boxShadow: "0 6px 24px 0 #185a9d55",
                py: 1.2,
                minWidth: { xs: 120, sm: 150 },
                background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
                color: "#fff",
                letterSpacing: 1,
                textTransform: "none",
                mb: 1,
                "&:hover, &:focus": {
                  background:
                    "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)",
                  color: "#fff",
                  boxShadow: "0 8px 32px 0 #185a9d77",
                  transform: "scale(1.04)",
                },
              }}
            >
              🏏 Create Game
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
                borderWidth: 2,
                background: "rgba(255,255,255,0.85)",
                color: "#185a9d",
                borderColor: "#185a9d",
                letterSpacing: 1,
                textTransform: "none",
                mb: 1,
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
              📲 Join Game
            </Button>
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: "#185a9d",
              fontWeight: 600,
              fontSize: { xs: 13, sm: 14 },
              mb: 1.5,
            }}
          >
            Start a new match or join an existing one to begin scoring
            instantly.
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
                sx={{ color: "#185a9d", fontWeight: 700, mb: 0.5 }}
              >
                🏏 Quick Match Setup
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#555", fontWeight: 500, mt: "auto" }}
              >
                Start a new game in seconds—no sign up needed!
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
                sx={{ color: "#43cea2", fontWeight: 700, mb: 0.5 }}
              >
                ⚡ Real-Time Scoring
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#555", fontWeight: 500, mt: "auto" }}
              >
                Update scores ball-by-ball and see instant results.
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
                sx={{ color: "#e53935", fontWeight: 700, mb: 0.5 }}
              >
                📲 Easy Sharing
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#555", fontWeight: 500, mt: "auto" }}
              >
                Share your match link with friends and family instantly.
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
              }}
            >
              Enter Game ID
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
                aria-label="Game ID"
                autoFocus
                margin="dense"
                type="text"
                fullWidth
                variant="outlined"
                label="Game ID"
                value={gameId}
                onChange={(e) => {
                  setGameId(e.target.value);
                  setGameIdError("");
                }}
                error={!!gameIdError}
                helperText={gameIdError}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (!gameId.trim()) {
                      setGameIdError("Game ID is required");
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
                  fontSize: { xs: 22, sm: 24 },
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
                  "&:hover": {
                    background: "#f5f5f5",
                    borderColor: "#185a9d",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                data-ga-click="confirm_join_game"
                onClick={() => {
                  if (!gameId.trim()) {
                    setGameIdError("Game ID is required");
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
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)",
                    color: "#fff",
                  },
                }}
              >
                View Score
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </>
  );
};

export default Home;
