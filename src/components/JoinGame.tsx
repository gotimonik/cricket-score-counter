import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
} from "@mui/material";
import { CloseRounded, ReplayRounded } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import MetaHelmet from "./MetaHelmet";
import { useTranslation } from "react-i18next";
import AppBar from "./AppBar";
import { useAdMob } from "../hooks/useAdMob";
import { LAST_JOINED_GAME_ID_KEY, normalizeGameId } from "../utils/gameId";

const readLastGameId = (): string => {
  try {
    return normalizeGameId(localStorage.getItem(LAST_JOINED_GAME_ID_KEY) || "");
  } catch {
    return "";
  }
};

const JoinGame: React.FC = () => {
  const [gameId, setGameId] = useState("");
  // Read after mount (not during render) so the prerendered HTML and the
  // first client render match.
  const [lastGameId, setLastGameId] = useState("");
  React.useEffect(() => {
    setLastGameId(readLastGameId());
  }, []);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { showInterstitial } = useAdMob();

  const joinGame = (rawId: string) => {
    const id = normalizeGameId(rawId);
    if (!id) {
      setError(t("Please enter a valid Game ID."));
      return;
    }
    setError("");
    try {
      localStorage.setItem(LAST_JOINED_GAME_ID_KEY, id);
    } catch {
      // storage blocked: joining still works, just no "reload" shortcut
    }
    navigate(`/join-game/${encodeURIComponent(id)}`);
    showInterstitial();
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    joinGame(gameId);
  };

  const clearLastGame = () => {
    try {
      localStorage.removeItem(LAST_JOINED_GAME_ID_KEY);
    } catch {
      // ignore
    }
    setLastGameId("");
  };

  return (
    <>
      <MetaHelmet
        pageTitle={t("Join Live Cricket Match")}
        canonical={location.pathname}
        description={t(
          "Join a live cricket match with Game ID and follow ball-by-ball score updates, wickets, overs, and match momentum in real time.",
        )}
        keywords="join cricket game, live cricket score viewer, cricket game id, cricket match tracker, realtime cricket scoreboard"
        robots="noindex,follow"
      />
      <AppBar showHomeMenuItem />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background:
            "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))",
          pb: 4,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1000,
            px: { xs: 1.5, sm: 2.5 },
            mt: 2,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
              px: { xs: 2, sm: 3, md: 6 },
              py: { xs: 2, sm: 3, md: 3 },
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
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                mb: { xs: -1, sm: 0 },
              }}
            >
              <IconButton
                data-ga-click="close_join_game_card"
                aria-label={t("Close")}
                onClick={() => navigate("/")}
                sx={{
                  color: "var(--app-accent-text, #185a9d)",
                  background: "rgba(24,90,157,0.08)",
                  border: "1px solid rgba(24,90,157,0.12)",
                  "&:hover": {
                    background: "rgba(24,90,157,0.14)",
                  },
                }}
              >
                <CloseRounded />
              </IconButton>
            </Box>
            <Typography
              component="h1"
              variant="h2"
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 900,
                fontSize: {
                  xs: "calc(22px * var(--app-font-scale, 1))",
                  sm: "calc(32px * var(--app-font-scale, 1))",
                  md: "calc(38px * var(--app-font-scale, 1))",
                },
                mb: 1,
                pt: { xs: 1, sm: 1 },
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
                fontSize: {
                  xs: "calc(15px * var(--app-font-scale, 1))",
                  sm: "calc(18px * var(--app-font-scale, 1))",
                },
                mb: 2,
                wordBreak: "break-word",
                whiteSpace: "normal",
                maxWidth: { xs: "90vw", sm: "95vw", md: 700 },
              }}
            >
              {t(
                "Enter your Game ID below to join a live cricket match and view scores in real time.",
              )}
            </Typography>
            <Box
              sx={{
                mb: 2,
                background: "#fff",
                borderRadius: 2,
                boxShadow:
                  "0 1px 4px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
                p: 2,
              }}
            >
              <strong>{t("How to Join a Cricket Match:")}</strong>
              <ul
                style={{
                  margin: "8px 0 0 16px",
                  padding: 0,
                  fontSize: "calc(15px * var(--app-font-scale, 1))",
                  textAlign: "left",
                }}
              >
                <li>
                  {t("Ask your friend or match organizer for the Game ID.")}
                </li>
                <li>{t('Enter the Game ID above and click "Join".')}</li>
                <li>
                  {t(
                    "View live scores, match stats, and recent events instantly.",
                  )}
                </li>
                <li>
                  {t(
                    "Share the match link with others to let them follow along.",
                  )}
                </li>
              </ul>
              <Box
                sx={{
                  mt: 2,
                  color: "var(--app-accent-text, #185a9d)",
                  fontWeight: 500,
                  fontSize: "calc(15px * var(--app-font-scale, 1))",
                }}
              >
                {t("Need help?")}{" "}
                <a href="mailto:gotimonik1@gmail.com">{t("Contact Support")}</a>{" "}
                <a href="tel:+918128313138">+91 8128313138</a>.
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
                onChange={(e) => {
                  setGameId(normalizeGameId(e.target.value));
                  if (error) setError("");
                }}
                error={!!error}
                helperText={error}
                sx={{ mb: 3, background: "#fff", borderRadius: 2 }}
                inputProps={{
                  style: {
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  },
                  autoCapitalize: "characters",
                  autoCorrect: "off",
                  autoComplete: "off",
                  spellCheck: false,
                  "aria-label": t("Game ID"),
                }}
              />
              <Button
                data-ga-click="submit_join_game"
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                sx={{
                  fontWeight: 800,
                  fontSize: {
                    xs: "calc(15px * var(--app-font-scale, 1))",
                    sm: "calc(18px * var(--app-font-scale, 1))",
                  },
                  borderRadius: 99,
                  boxShadow:
                    "0 6px 24px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 33%, transparent 67%)",
                  py: 1.2,
                  minWidth: { xs: 120, sm: 150 },
                  maxWidth: { xs: "100%", sm: 260 },
                  background:
                    "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
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
                    boxShadow:
                      "0 8px 32px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 47%, transparent 53%)",
                    transform: "scale(1.04)",
                  },
                }}
              >
                {t("Join")}
              </Button>
              {lastGameId ? (
                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    textAlign: "left",
                    background:
                      "color-mix(in srgb, var(--app-accent-start, #43cea2) 10%, #ffffff 90%)",
                    border:
                      "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 40%, transparent 60%)",
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        color: "var(--app-accent-text, #185a9d)",
                        fontSize: "calc(12px * var(--app-font-scale, 1))",
                        fontWeight: 600,
                        opacity: 0.85,
                      }}
                    >
                      {t("Last game")}
                    </Typography>
                    <Typography
                      sx={{
                        color: "var(--app-accent-text, #185a9d)",
                        fontWeight: 900,
                        letterSpacing: 2,
                        fontSize: "calc(17px * var(--app-font-scale, 1))",
                      }}
                    >
                      {lastGameId}
                    </Typography>
                  </Box>
                  <Button
                    data-ga-click="reload_last_join_game"
                    type="button"
                    variant="outlined"
                    startIcon={<ReplayRounded />}
                    onClick={() => joinGame(lastGameId)}
                    sx={{
                      flexShrink: 0,
                      textTransform: "none",
                      fontWeight: 800,
                      borderRadius: 999,
                      borderColor: "var(--app-accent-end, #185a9d)",
                      color: "var(--app-accent-text, #185a9d)",
                    }}
                  >
                    {t("Reload game")}
                  </Button>
                  <IconButton
                    data-ga-click="clear_last_join_game"
                    aria-label={t("Forget last game")}
                    size="small"
                    onClick={clearLastGame}
                    sx={{ color: "var(--app-accent-text, #185a9d)" }}
                  >
                    <CloseRounded fontSize="small" />
                  </IconButton>
                </Box>
              ) : null}
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default JoinGame;
