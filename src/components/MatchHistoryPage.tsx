import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowForwardIosRounded, EmojiEventsRounded, PlayArrowRounded, ScheduleRounded } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import AdSenseBanner from "./AdSenseBanner";
import { getCompletedMatches } from "../utils/completedMatches";
import { toCurrentVersionPath } from "../utils/routes";
import PageTitleWithBack from "./PageTitleWithBack";
import AuthService from "../services/AuthService";
import PlayerMatchService, {
  type SavedMatchRecord,
} from "../services/PlayerMatchService";
import type { BallEvent, ScoreState } from "../types/cricket";

const getEventTotalRuns = (event: BallEvent) =>
  event.extra_type === "no-ball-extra" ? event.value + 1 : event.value;

const isLegalDelivery = (event: BallEvent) =>
  event.type !== "wide" && event.extra_type !== "no-ball-extra";

const toOvers = (balls: number) => `${Math.floor(balls / 6)}.${balls % 6}`;

const summarizeInning = (battingTeam: string, snapshot: ScoreState) => {
  const overs = snapshot.recentEventsByTeams?.[battingTeam] ?? {};
  let runs = 0;
  let wickets = 0;
  let legalBalls = 0;

  Object.values(overs).forEach((events) => {
    events.forEach((event) => {
      runs += getEventTotalRuns(event);
      if (event.type === "wicket") wickets += 1;
      if (isLegalDelivery(event)) legalBalls += 1;
    });
  });

  return {
    battingTeam,
    runs,
    wickets,
    overs: toOvers(legalBalls),
  };
};

const toRemoteHistoryItem = (match: SavedMatchRecord) => {
  const [team1 = "", team2 = ""] = match.snapshot.teams ?? match.teams;
  return {
    ...match,
    id: match.id,
    teams: match.snapshot.teams ?? match.teams,
    winningTeam: match.snapshot.winningTeam ?? "",
    innings: [
      summarizeInning(team1, match.snapshot),
      summarizeInning(team2, match.snapshot),
    ],
    isRemote: true,
  };
};

const MatchHistoryPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => AuthService.isLoggedIn());
  const [remoteMatches, setRemoteMatches] = useState<SavedMatchRecord[]>([]);
  const [isRemoteLoading, setRemoteLoading] = useState(false);

  useEffect(() => {
    return AuthService.subscribe(() => {
      setIsLoggedIn(AuthService.isLoggedIn());
    });
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setRemoteMatches([]);
      setRemoteLoading(false);
      return;
    }

    let cancelled = false;
    setRemoteLoading(true);
    PlayerMatchService.getMatches()
      .then((matches) => {
        if (!cancelled) setRemoteMatches(matches);
      })
      .catch(() => {
        if (!cancelled) setRemoteMatches([]);
      })
      .finally(() => {
        if (!cancelled) setRemoteLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const matches = useMemo(() => {
    if (isLoggedIn) {
      return remoteMatches.map(toRemoteHistoryItem);
    }

    const localMatches = getCompletedMatches().map((match) => ({
      ...match,
      status: "completed" as const,
      isRemote: false,
    }));
    return localMatches;
  }, [isLoggedIn, remoteMatches]);

  const formatSavedAt = (iso: string) => {
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) return "";
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(parsed);
  };

  return (
    <>
      <MetaHelmet
        pageTitle={t("Match History")}
        canonical={location.pathname}
        description={t("Browse saved matches, review innings, and open detailed scorecards for Cricket Score Counter.")}
        keywords="match history, cricket score history, saved matches, scorecard"
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
        <Box sx={{ width: "100%", maxWidth: 1000, px: { xs: 1.5, sm: 2.5 }, mt: 2 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              background: "linear-gradient(135deg, #f8fffc 0%, #e0eafc 100%)",
              border: "2px solid var(--app-accent-start, #43cea2)",
              boxShadow: "0 10px 30px rgba(8, 26, 56, 0.14)",
              p: { xs: 2, sm: 3 },
            }}
          >
            <PageTitleWithBack
              titleSx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 900,
                fontSize: { xs: "calc(24px * var(--app-font-scale, 1))", sm: "calc(32px * var(--app-font-scale, 1))" },
              }}
            >
              {t("Match History")}
            </PageTitleWithBack>
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 600,
                fontSize: { xs: "calc(13px * var(--app-font-scale, 1))", sm: "calc(15px * var(--app-font-scale, 1))" },
                mb: 2,
              }}
            >
              {t("Open any saved match to review full scorecards, innings events, and results.")}
            </Typography>

            {matches.length === 0 ? (
              <Box
                sx={{
                  borderRadius: 2.5,
                  border: "1px dashed var(--app-accent-start, #43cea2)",
                  background: "rgba(255,255,255,0.75)",
                  p: 2,
                  textAlign: "center",
                }}
              >
                <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 700 }}>
                  {isRemoteLoading ? ` ${t("Loading...")}` : t("No recent matches found.")}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.4 }}>
                {matches.map((match) => {
                  const first = match.innings[0];
                  const second = match.innings[1];
                  const openMatch = () => {
                    if (match.isRemote && match.status === "in_progress") {
                      navigate(
                        toCurrentVersionPath(
                          location.pathname,
                          `/create-game?resume=${encodeURIComponent(match.id)}`,
                        ),
                      );
                      return;
                    }
                    // if (match.isRemote) {
                    //   return;
                    // }
                    navigate(toCurrentVersionPath(location.pathname, `/match-history/${match.id}`));
                  };
                  return (
                    <Box
                      key={`${match.isRemote ? "remote" : "local"}-${match.id}`}
                      data-ga-click="open_recent_match_scorecard"
                      sx={{
                        border: "1px solid var(--app-accent-start, #43cea2)",
                        borderRadius: 2.8,
                        p: { xs: 1.25, sm: 1.5 },
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(239,250,255,0.94) 100%)",
                        cursor:
                          !match.isRemote || match.status === "in_progress"
                            ? "pointer"
                            : "default",
                        transition: "transform 0.15s ease, box-shadow 0.2s ease",
                        boxShadow: "0 3px 14px color-mix(in srgb, var(--app-accent-end, #185a9d) 8%, transparent 92%)",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 22px color-mix(in srgb, var(--app-accent-end, #185a9d) 17%, transparent 83%)",
                        },
                      }}
                      onClick={openMatch}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        spacing={0.6}
                      >
                        <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 900, fontSize: "calc(18px * var(--app-font-scale, 1))" }}>
                          {match.teams[0]} <span style={{ opacity: 0.7 }}>{t("vs")}</span>{" "}
                          {match.teams[1]}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          {match.status === "in_progress" && (
                            <Chip
                              size="small"
                              label={t("In progress")}
                              sx={{
                                background: "rgba(13,138,82,0.13)",
                                color: "#0d6b43",
                                fontWeight: 900,
                              }}
                            />
                          )}
                          <ScheduleRounded sx={{ fontSize: "calc(16px * var(--app-font-scale, 1))", color: "var(--app-accent-text, #185a9d)" }} />
                          <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 700, fontSize: "calc(12.5px * var(--app-font-scale, 1))" }}>
                            {formatSavedAt(match.savedAt)}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Divider sx={{ my: 1, borderColor: "rgba(24,90,157,0.14)" }} />

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          rowGap: 0.8,
                        }}
                      >
                        <Chip
                          size="small"
                          label={`${first?.battingTeam}: ${first?.runs}/${first?.wickets} (${first?.overs})`}
                          sx={{
                            maxWidth: "100%",
                            background: "rgba(24,90,157,0.1)",
                            color: "var(--app-accent-text, #185a9d)",
                            fontWeight: 700,
                            border: "1px solid rgba(24,90,157,0.16)",
                            "& .MuiChip-label": {
                              whiteSpace: "normal",
                              display: "block",
                              lineHeight: 1.2,
                              py: 0.5,
                            },
                          }}
                        />
                        <Chip
                          size="small"
                          label={`${second?.battingTeam}: ${second?.runs}/${second?.wickets} (${second?.overs})`}
                          sx={{
                            maxWidth: "100%",
                            background: "rgba(67,206,162,0.15)",
                            color: "var(--app-accent-text, #185a9d)",
                            fontWeight: 700,
                            border: "1px solid rgba(67,206,162,0.28)",
                            "& .MuiChip-label": {
                              whiteSpace: "normal",
                              display: "block",
                              lineHeight: 1.2,
                              py: 0.5,
                            },
                          }}
                        />
                      </Box>

                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        spacing={{ xs: 0.7, sm: 0 }}
                        sx={{ mt: 1.1 }}
                      >
                        <Stack direction="row" alignItems="center" spacing={0.7}>
                          <EmojiEventsRounded sx={{ color: "#0d8a52", fontSize: "calc(19px * var(--app-font-scale, 1))" }} />
                          <Typography sx={{ color: "#0d8a52", fontWeight: 800, fontSize: "calc(15px * var(--app-font-scale, 1))", overflowWrap: "anywhere" }}>
                            {match.resultText ||
                              (match.winningTeam
                                ? `${t("Winner")}: ${match.winningTeam}`
                                : t("Saved match"))}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          {match.isRemote && match.status === "in_progress" ? (
                            <Button
                              size="small"
                              startIcon={<PlayArrowRounded />}
                              onClick={(event) => {
                                event.stopPropagation();
                                openMatch();
                              }}
                              sx={{
                                borderRadius: 99,
                                textTransform: "none",
                                fontWeight: 900,
                                color: "#fff",
                                background:
                                  "linear-gradient(135deg, var(--app-accent-start, #43cea2), var(--app-accent-end, #185a9d))",
                                px: 1.2,
                                "&:hover": {
                                  background:
                                    "linear-gradient(135deg, var(--app-accent-start, #43cea2), var(--app-accent-end, #185a9d))",
                                },
                              }}
                            >
                              {t("Resume")}
                            </Button>
                          ) : (
                            <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 700, fontSize: "calc(13px * var(--app-font-scale, 1))" }}>
                              {match.isRemote ? t("Saved") : t("View Scorecard")}
                            </Typography>
                          )}
                          <ArrowForwardIosRounded sx={{ color: "var(--app-accent-text, #185a9d)", fontSize: "calc(14px * var(--app-font-scale, 1))" }} />
                        </Stack>
                      </Stack>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Paper>
        </Box>
        <AdSenseBanner show={matches.length > 0} minContentLength={900} />
      </Box>
    </>
  );
};

export default MatchHistoryPage;
