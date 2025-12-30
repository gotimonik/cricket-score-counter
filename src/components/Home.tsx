import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const cricketBg = "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [gameId, setGameId] = useState("");
  const [gameIdError, setGameIdError] = useState("");

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: cricketBg,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated cricket ball */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            animation: "spin 8s linear infinite",
            opacity: 0.15,
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
        elevation={8}
        sx={{
          p: 5,
          minWidth: 340,
          textAlign: "center",
          borderRadius: 5,
          boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.37)`,
          background: "rgba(255,255,255,0.95)",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            letterSpacing: 2,
            textShadow: "0 2px 8px #185a9d33",
          }}
        >
          🏏 Cricket Score Counter
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ color: theme.palette.grey[700], mb: 2 }}
        >
          Select an option to get started
        </Typography>
        <Box
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 4 },
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
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
              fontWeight: 700,
              fontSize: { xs: 18, sm: 22 },
              borderRadius: 3,
              boxShadow: "0 6px 24px 0 #185a9d55",
              py: 1.5,
              minWidth: { xs: 180, sm: 200 },
              background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
              color: "#fff",
              outline: "3px solid #185a9d",
              outlineOffset: "2px",
              transform: "scale(1.07)",
              transition:
                "transform 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s",
              "&:hover, &:focus, &:active": {
                // No further change on hover/active
                background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
                color: "#fff",
                outline: "3px solid #185a9d",
                outlineOffset: "2px",
                transform: "scale(1.07)",
                boxShadow: "0 6px 24px 0 #185a9d55",
              },
              "&.Mui-focusVisible": {
                outline: "3px solid #185a9d",
                outlineOffset: "2px",
              },
            }}
          >
            Create Game
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setModalOpen(true)}
            size="large"
            sx={{
              fontWeight: 700,
              fontSize: { xs: 18, sm: 22 },
              borderRadius: 3,
              py: 1.5,
              minWidth: { xs: 180, sm: 200 },
              borderWidth: 2,
              background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
              color: "#fff",
              outline: "3px solid #185a9d",
              outlineOffset: "2px",
              transform: "scale(1.07)",
              transition:
                "transform 0.2s, border-color 0.2s, background 0.2s, color 0.2s",
              "&:hover, &:focus, &:active": {
                background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
                color: "#fff",
                outline: "3px solid #185a9d",
                outlineOffset: "2px",
                transform: "scale(1.07)",
              },
              "&.Mui-focusVisible": {
                outline: "3px solid #185a9d",
                outlineOffset: "2px",
              },
            }}
          >
            Join Game
          </Button>
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
                fontSize: 24,
                color: "#185a9d",
                textAlign: "center",
                pb: 1,
                letterSpacing: 1,
              }}
            >
              <span role="img" aria-label="search">
                🔎
              </span>{" "}
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
                autoFocus
                margin="dense"
                label="Game ID"
                type="text"
                fullWidth
                variant="outlined"
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
                  "& .MuiInputLabel-root": {
                    fontWeight: 600,
                  },
                }}
              />
            </DialogContent>
            <DialogActions
              sx={{ justifyContent: "space-between", px: 3, pb: 2 }}
            >
              <Button
                onClick={() => setModalOpen(false)}
                color="secondary"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontSize: 16,
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
                sx={{
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontSize: 16,
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
        </Box>
      </Paper>
    </Box>
  );
};

export default Home;
