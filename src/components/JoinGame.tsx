import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MetaHelmet from "./MetaHelmet";

import AdSenseBanner from "./AdSenseBanner";
const cricketBg = "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)";

const JoinGame: React.FC = () => {
  const [gameId, setGameId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameId.trim()) {
      setError("Please enter a valid Game ID.");
      return;
    }
    setError("");
    navigate(`/join-game/${gameId.trim()}`);
  };

  return (
    <>
      <MetaHelmet
        pageTitle="Join Game"
        canonical="/join-game"
        description="View live cricket scores and match details. Join a game and follow the action with Cricket Score Counter."
      />
      {/* AdSense banner for content-rich page */}
      <AdSenseBanner show={true} />
      <Box
        sx={{
          width: "100vw",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: cricketBg,
          position: "relative",
          overflow: "hidden",
          pt: 5,
        }}
      >
        <Paper
          elevation={12}
          sx={{
            px: { xs: 2, sm: 3, md: 6 },
            py: { xs: 2, sm: 3, md: 5 },
            minWidth: { xs: "96vw", sm: 400, md: 600 },
            width: { xs: "99vw", sm: 480, md: 600 },
            maxWidth: { xs: "100vw", sm: 600 },
            minHeight: { xs: 300, sm: 350, md: 350 },
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
            pb: { xs: 10, sm: 0 },
          }}
        >
          <Typography
            component="h1"
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
            Join Game
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
            Enter your Game ID below to join a live cricket match and view
            scores in real time.
          </Typography>
          <Box
            component="form"
            onSubmit={handleJoin}
            sx={{ width: "100%", maxWidth: 400, mx: "auto" }}
          >
            <TextField
              label="Game ID"
              variant="outlined"
              fullWidth
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              error={!!error}
              helperText={error}
              sx={{ mb: 3, background: "#fff", borderRadius: 2 }}
              autoFocus
              inputProps={{ style: { fontWeight: 700, letterSpacing: 1 } }}
            />
            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
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
              Join
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default JoinGame;
