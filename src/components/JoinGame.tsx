import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  InputAdornment,
  Stack,
} from "@mui/material";
import {
  CloseRounded,
  HistoryRounded,
  LinkRounded,
  ReplayRounded,
  SensorsRounded,
  SportsCricketRounded,
  TagRounded,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import MetaHelmet from "./MetaHelmet";
import { useTranslation } from "react-i18next";
import AppBar from "./AppBar";
import { useAdMob } from "../hooks/useAdMob";
import { LAST_JOINED_GAME_ID_KEY, normalizeGameId } from "../utils/gameId";
import PageTitleWithBack from "./PageTitleWithBack";
import { BOARD } from "../utils/brand";
import {
  GlassChip,
  PavilionHero,
  PavilionSectionTitle,
  boardButtonSx,
  goldButtonSx,
  pavilionPageSx,
  pavilionSectionSx,
} from "./ui/Pavilion";

const SCOREBOARD_FONT = 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace';

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

  const steps = [
    {
      icon: <TagRounded />,
      title: t("Get the Game ID"),
      body: t("Ask your friend or match organizer for the Game ID."),
    },
    {
      icon: <SportsCricketRounded />,
      title: t("Enter it and join"),
      body: t('Enter the Game ID above and click "Join".'),
    },
    {
      icon: <SensorsRounded />,
      title: t("Watch it live"),
      body: t("View live scores, match stats, and recent events instantly."),
    },
    {
      icon: <LinkRounded />,
      title: t("Share the match"),
      body: t("Share the match link with others to let them follow along."),
    },
  ];

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
          ...pavilionPageSx,
          width: "100%",
          py: { xs: 2.5, sm: 4 },
          px: { xs: 1.4, sm: 2.5 },
          pb: { xs: 10, sm: 8 },
        }}
      >
        <Box sx={{ maxWidth: 820, mx: "auto" }}>
          <PageTitleWithBack
            titleSx={{
              fontSize: {
                xs: "calc(25px * var(--app-font-scale, 1))",
                sm: "calc(34px * var(--app-font-scale, 1))",
              },
              fontWeight: 900,
              color: BOARD.green,
            }}
          >
            {t("Join Game")}
          </PageTitleWithBack>

          <PavilionHero
            sx={{ mb: 2 }}
            eyebrow={t("Live scoreboard")}
            title={t("Follow a match ball by ball")}
            subtitle={t(
              "Enter your Game ID below to join a live cricket match and view scores in real time.",
            )}
            watermark={<SensorsRounded />}
            chips={
              <>
                <GlassChip tone="live">{t("Real time")}</GlassChip>
                <GlassChip icon={<SportsCricketRounded />}>{t("Every ball")}</GlassChip>
                <GlassChip icon={<LinkRounded />}>{t("No sign-up")}</GlassChip>
              </>
            }
          >
            <Box
              component="form"
              onSubmit={handleJoin}
              noValidate
              sx={{
                mt: { xs: 2, sm: 2.5 },
                p: { xs: 1.25, sm: 1.5 },
                borderRadius: 3,
                background: "rgba(0,0,0,0.22)",
                border: "1px solid rgba(241,214,138,0.22)",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: error ? "flex-start" : "center" },
                gap: 1.25,
              }}
            >
              <TextField
                fullWidth
                value={gameId}
                onChange={(e) => {
                  setGameId(normalizeGameId(e.target.value));
                  if (error) setError("");
                }}
                placeholder={t("Game ID")}
                error={!!error}
                helperText={error || undefined}
                inputProps={{
                  autoCapitalize: "characters",
                  autoCorrect: "off",
                  autoComplete: "off",
                  spellCheck: false,
                  "aria-label": t("Game ID"),
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TagRounded sx={{ color: BOARD.goldLight }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 52,
                    borderRadius: 99,
                    color: BOARD.goldLight,
                    fontFamily: SCOREBOARD_FONT,
                    fontWeight: 800,
                    fontSize: "calc(18px * var(--app-font-scale, 1))",
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    background: "rgba(255,255,255,0.08)",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(241,214,138,0.35)" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(241,214,138,0.6)" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: BOARD.goldLight, borderWidth: 2 },
                    "&.Mui-error .MuiOutlinedInput-notchedOutline": { borderColor: "#ff8a7a" },
                  },
                  "& input::placeholder": {
                    color: "rgba(255,255,255,0.5)",
                    opacity: 1,
                    letterSpacing: 1,
                    fontFamily: "inherit",
                    textTransform: "none",
                  },
                  "& .MuiFormHelperText-root": {
                    mx: 2,
                    fontWeight: 700,
                    color: "#ff8a7a",
                  },
                }}
              />
              <Button
                data-ga-click="submit_join_game"
                type="submit"
                variant="contained"
                sx={{ ...goldButtonSx, minHeight: 52, px: 4, flex: "none" }}
              >
                {t("Join")}
              </Button>
            </Box>
          </PavilionHero>

          {lastGameId ? (
            <Paper
              elevation={0}
              sx={{
                ...pavilionSectionSx,
                p: { xs: 1.5, sm: 2 },
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  background: `linear-gradient(180deg, ${BOARD.goldLight}, ${BOARD.gold})`,
                },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  flex: "none",
                  borderRadius: 3,
                  display: { xs: "none", sm: "grid" },
                  placeItems: "center",
                  color: BOARD.goldLight,
                  background: `linear-gradient(150deg, #1d4b3b 0%, ${BOARD.green} 100%)`,
                }}
              >
                <HistoryRounded />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    fontSize: "calc(10.5px * var(--app-font-scale, 1))",
                    color: "#7a6220",
                  }}
                >
                  {t("Last game")}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: SCOREBOARD_FONT,
                    fontWeight: 800,
                    letterSpacing: 2.5,
                    color: BOARD.green,
                    fontSize: "calc(19px * var(--app-font-scale, 1))",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {lastGameId}
                </Typography>
              </Box>
              <Button
                data-ga-click="reload_last_join_game"
                type="button"
                startIcon={<ReplayRounded />}
                onClick={() => joinGame(lastGameId)}
                sx={{ ...boardButtonSx, flex: "none", minHeight: 40 }}
              >
                {t("Reload game")}
              </Button>
              <IconButton
                data-ga-click="clear_last_join_game"
                aria-label={t("Forget last game")}
                size="small"
                onClick={clearLastGame}
                sx={{ color: "#6b7a74", "&:hover": { color: BOARD.green, background: "rgba(15,46,37,0.06)" } }}
              >
                <CloseRounded fontSize="small" />
              </IconButton>
            </Paper>
          ) : null}

          <Paper elevation={0} sx={pavilionSectionSx}>
            <PavilionSectionTitle>{t("How to Join a Cricket Match:").replace(/:$/, "")}</PavilionSectionTitle>
            <Box
              component="ol"
              sx={{
                listStyle: "none",
                m: 0,
                p: 0,
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                gap: 1.25,
              }}
            >
              {steps.map((step, index) => (
                <Box
                  component="li"
                  key={step.title}
                  sx={{
                    display: "flex",
                    gap: 1.25,
                    alignItems: "flex-start",
                    p: 1.5,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.75)",
                    border: "1px solid rgba(15,46,37,0.08)",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: 38,
                      height: 38,
                      flex: "none",
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      color: BOARD.green,
                      background: `linear-gradient(180deg, ${BOARD.goldLight} 0%, ${BOARD.gold} 100%)`,
                      boxShadow: "0 3px 10px rgba(217,180,90,0.3)",
                      "& svg": { fontSize: 20 },
                    }}
                  >
                    {step.icon}
                    <Box
                      component="span"
                      sx={{
                        position: "absolute",
                        right: -4,
                        bottom: -4,
                        minWidth: 18,
                        height: 18,
                        borderRadius: 99,
                        display: "grid",
                        placeItems: "center",
                        fontFamily: SCOREBOARD_FONT,
                        fontSize: 11,
                        fontWeight: 800,
                        color: BOARD.goldLight,
                        background: BOARD.green,
                        border: "2px solid #fff",
                      }}
                    >
                      {index + 1}
                    </Box>
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 900, color: BOARD.green, fontSize: "calc(15px * var(--app-font-scale, 1))", lineHeight: 1.25 }}>
                      {step.title}
                    </Typography>
                    <Typography sx={{ mt: 0.3, color: "#55665f", fontWeight: 600, fontSize: "calc(13.5px * var(--app-font-scale, 1))", lineHeight: 1.45 }}>
                      {step.body}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Stack
              direction="row"
              flexWrap="wrap"
              justifyContent="center"
              columnGap={1}
              rowGap={0.5}
              sx={{
                mt: 2,
                pt: 1.75,
                borderTop: "1px dashed rgba(15,46,37,0.15)",
                color: "#55665f",
                fontWeight: 700,
                fontSize: "calc(14px * var(--app-font-scale, 1))",
                "& a": {
                  color: BOARD.green,
                  fontWeight: 900,
                  textDecoration: "none",
                  borderBottom: `2px solid ${BOARD.gold}`,
                  "&:hover": { color: "#7a6220" },
                },
              }}
            >
              <span>{t("Need help?")}</span>
              <a href="mailto:gotimonik1@gmail.com">{t("Contact Support")}</a>
              <a href="tel:+918128313138">+91 8128313138</a>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default JoinGame;
