import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import MetaHelmet from "./MetaHelmet";
import { useTranslation } from "react-i18next";
import { toCurrentVersionPath } from "../utils/routes";
const cricketBg =
  "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))";

const JoinGame: React.FC = () => {
  const [gameId, setGameId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameId.trim()) {
      setError(t("Please enter a valid Game ID."));
      return;
    }
    setError("");
    navigate(toCurrentVersionPath(location.pathname, `/join-game/${gameId.trim()}`));
  };

  return (
    <>
      <MetaHelmet
        pageTitle={t("Join Live Cricket Match")}
        canonical="/join-game"
        description={t("Join a live cricket match with Game ID and follow ball-by-ball score updates, wickets, overs, and match momentum in real time.")}
        keywords="join cricket game, live cricket score viewer, cricket game id, cricket match tracker, realtime cricket scoreboard"
      />
      <Box
        sx={{
          width: "100%",
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
              color: "var(--app-accent-text, #185a9d)",
              fontWeight: 900,
              fontSize: { xs: "calc(22px * var(--app-font-scale, 1))", sm: "calc(32px * var(--app-font-scale, 1))", md: "calc(38px * var(--app-font-scale, 1))" },
              mb: 1,
              pt: { xs: 2, sm: 2 },
              wordBreak: "break-word",
              whiteSpace: "normal",
              maxWidth: { xs: "90vw", sm: "95vw", md: 700 },
            }}
          >
            {t("Join Game")}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "var(--app-accent-start, #43cea2)",
              fontWeight: 700,
              fontSize: { xs: "calc(15px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))" },
              mb: 2,
              wordBreak: "break-word",
              whiteSpace: "normal",
              maxWidth: { xs: "90vw", sm: "95vw", md: 700 },
            }}
          >
            {t("Enter your Game ID below to join a live cricket match and view scores in real time.")}
          </Typography>
          <Box sx={{ mb: 2, background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)', p: 2 }}>
            <strong>{t("How to Join a Cricket Match:")}</strong>
            <ul style={{ margin: '8px 0 0 16px', padding: 0, fontSize: "calc(15px * var(--app-font-scale, 1))", textAlign: 'left' }}>
              <li>{t("Ask your friend or match organizer for the Game ID.")}</li>
              <li>{t('Enter the Game ID above and click "Join".')}</li>
              <li>{t("View live scores, match stats, and recent events instantly.")}</li>
              <li>{t("Share the match link with others to let them follow along.")}</li>
            </ul>
            <Box sx={{ mt: 2, color: 'var(--app-accent-text, #185a9d)', fontWeight: 500, fontSize: "calc(15px * var(--app-font-scale, 1))" }}>
              {t("Need help?")} <a href="mailto:support@cricketscorecounter.com">{t("Contact Support")}</a>.
            </Box>
          </Box>
          <Box
            component="form"
            onSubmit={handleJoin}
            sx={{ width: "100%", maxWidth: 400, mx: "auto" }}
          >
            <TextField
              label={t("Game ID")}
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
              data-ga-click="submit_join_game"
              type="submit"
              variant="contained"
              color="success"
              fullWidth
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
              {t("Join")}
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default JoinGame;
