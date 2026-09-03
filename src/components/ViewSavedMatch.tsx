import React, { useEffect, useState } from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MetaHelmet from "./MetaHelmet";
import AppBar from "./AppBar";
import ScoreDisplay from "./ScoreDisplay";
import PlayerScorecardPanel from "./PlayerScorecardPanel";
import {
  buildInningsSummaries,
  CompletedMatchRecord,
  getCompletedMatchById,
  type MatchInningSummary,
} from "../utils/completedMatches";
import PlayerMatchService from "../services/PlayerMatchService";
import LoadingOverlay from "./LoadingOverlay";
import PageTitleWithBack from "./PageTitleWithBack";

const ViewSavedMatch: React.FC = () => {
  const { historyId } = useParams();
  const { t } = useTranslation();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [match, setMatch] = useState<CompletedMatchRecord | null>(null);

  useEffect(() => {
    if (!historyId) return;

    const cachedMatch = getCompletedMatchById(historyId);

    if (cachedMatch) {
      setMatch(cachedMatch);
      setIsLoading(false);
      return;
    }

    PlayerMatchService.getMatch(historyId)
      .then((match) => {
        setMatch(match as unknown as CompletedMatchRecord);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [historyId]);

  if (!match) {
    return (
      <>
        <MetaHelmet
          pageTitle="Saved Match Not Found"
          canonical={location.pathname}
          description="The requested saved cricket match could not be found."
        />
        <AppBar showHomeMenuItem />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!isLoading ? <Typography sx={{ color: "#fff", fontWeight: 700 }}>
            {t("Match not found")}
          </Typography> : <LoadingOverlay isLoading={isLoading} />}
        </Box>
      </>
    );
  }

  const snapshot = match.snapshot;
  const {
    score,
    wickets,
    currentOver,
    currentBallOfOver,
    targetOvers,
    matchLengthMode,
    totalBalls,
    targetScore,
    remainingBalls,
    teams,
    playerRosterByTeam = {},
    playerScorecardByTeam = {},
    activePlayers = { striker: "", nonStriker: "", bowler: "" },
  } = snapshot;
  // Computed straight from the snapshot rather than read off `match.innings`
  // -- a remote (logged-in) saved match never has that field populated by
  // the backend, only a locally-stored guest match does, so relying on it
  // silently dropped this whole section for every logged-in user. This
  // also folds in each Super Over's own mini-innings when the match was
  // decided by one, instead of only ever showing the two regulation
  // innings that were already level.
  const innings = buildInningsSummaries(snapshot);
  const hasMultipleSuperOvers = (snapshot.superOvers?.length ?? 0) > 1;
  const getInningLabel = (inning: MatchInningSummary, idx: number) => {
    if (inning.phase === "super-over") {
      return hasMultipleSuperOvers
        ? `${t("Super Over")} ${inning.superOverNumber}`
        : t("Super Over");
    }
    return idx === 0 ? t("1st Inning") : t("2nd Inning");
  };

  const battingTeam = targetScore ? teams[1] : teams[0];
  const bowlingTeam = targetScore ? teams[0] : teams[1];
  const currentStrikerStats = activePlayers.striker
    ? {
        name: activePlayers.striker,
        runs:
          playerScorecardByTeam[battingTeam]?.batting?.[activePlayers.striker]
            ?.runs ?? 0,
        balls:
          playerScorecardByTeam[battingTeam]?.batting?.[activePlayers.striker]
            ?.balls ?? 0,
        fours:
          playerScorecardByTeam[battingTeam]?.batting?.[activePlayers.striker]
            ?.fours ?? 0,
        sixes:
          playerScorecardByTeam[battingTeam]?.batting?.[activePlayers.striker]
            ?.sixes ?? 0,
      }
    : undefined;
  const currentBowlerStats = activePlayers.bowler
    ? {
        name: activePlayers.bowler,
        balls:
          playerScorecardByTeam[bowlingTeam]?.bowling?.[activePlayers.bowler]
            ?.balls ?? 0,
        runsConceded:
          playerScorecardByTeam[bowlingTeam]?.bowling?.[activePlayers.bowler]
            ?.runsConceded ?? 0,
        wickets:
          playerScorecardByTeam[bowlingTeam]?.bowling?.[activePlayers.bowler]
            ?.wickets ?? 0,
      }
    : undefined;
  const hasDetailedScorecard = Object.values(playerRosterByTeam).some(
    (players) => (players ?? []).length > 0,
  );

  return (
    <>
      <MetaHelmet
        pageTitle="Saved Cricket Match Scorecard"
        canonical={location.pathname}
        description="Review saved cricket match scorecards with innings summary, batting stats, and bowling stats."
        keywords="saved cricket scorecard, cricket match history, cricket innings summary, batting and bowling stats"
      />
      <AppBar showHomeMenuItem />
      <Box
        className="app-saved-match-shell"
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background:
            "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))",
          pb: 2.5,
        }}
      >
        <Box
          className="app-saved-match-container"
          sx={{ width: "100%", maxWidth: 860, px: { xs: 1, sm: 2 }, mt: 1.2 }}
        >
          <Paper
            className="app-saved-match-card"
            elevation={0}
            sx={{
              borderRadius: 4,
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)",
              border: "2px solid var(--app-accent-start, #43cea2)",
              boxShadow:
                "0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
              p: { xs: 1.2, sm: 1.6 },
            }}
          >
            <Box sx={{ px: 0.6, pb: 0.6 }}>
              <PageTitleWithBack
              titleSx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 900,
                fontSize: { xs: "calc(24px * var(--app-font-scale, 1))", sm: "calc(32px * var(--app-font-scale, 1))" },
              }}
            >
              {t("Match Summary")}
            </PageTitleWithBack>
              <Typography
                sx={{
                  color: "var(--app-accent-text, #185a9d)",
                  fontWeight: 700,
                  fontSize: {
                    xs: "calc(14px * var(--app-font-scale, 1))",
                    sm: "calc(15px * var(--app-font-scale, 1))",
                  },
                  opacity: 0.95,
                }}
              >
                {match.teams[0]} vs {match.teams[1]} |{" "}
                {match.resultText ?? `${t("Winner")}: ${match.winningTeam}`}
              </Typography>
            </Box>
            <Divider
              sx={{
                mb: 1.3,
                background: "var(--app-accent-start, #43cea2)",
                height: 2.5,
                borderRadius: 2,
              }}
            />
            <ScoreDisplay
              score={score}
              wickets={wickets}
              overs={Number(`${currentOver}.${currentBallOfOver}`)}
              targetOvers={targetOvers}
              matchLengthMode={matchLengthMode}
              totalBalls={totalBalls}
              targetScore={targetScore}
              remainingBalls={remainingBalls}
              teamName={targetScore ? teams[1] : teams[0]}
              resultText={match.resultText}
              currentStriker={currentStrikerStats}
              currentBowler={currentBowlerStats}
            />
            {innings.length > 0 && <Box
              className="app-saved-match-section"
              sx={{
                mt: 1.1,
                border:
                  "1px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 72%, transparent 28%)",
                borderRadius: 2.5,
                p: 1.1,
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 11%, transparent 89%) 0%, color-mix(in srgb, var(--app-accent-end, #185a9d) 10%, transparent 90%) 100%)",
              }}
            >
              <Typography
                sx={{
                  color: "var(--app-accent-text, #185a9d)",
                  fontWeight: 800,
                  fontSize: "calc(15px * var(--app-font-scale, 1))",
                  mb: 0.8,
                }}
              >
                {t("Innings Summary")}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 0.9,
                }}
              >
                {innings.map((inning, idx) => (
                  <Box
                    key={`${inning.battingTeam}-${idx}`}
                    sx={{
                      border: "1px solid var(--app-accent-start, #43cea2)",
                      borderRadius: 2,
                      p: 0.9,
                      background:
                        "color-mix(in srgb, white 88%, var(--app-accent-start, #43cea2) 12%)",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "var(--app-accent-text, #185a9d)",
                        fontWeight: 700,
                        fontSize: "calc(12.5px * var(--app-font-scale, 1))",
                      }}
                    >
                      {getInningLabel(inning, idx)}
                    </Typography>
                    <Typography
                      sx={{
                        color: "var(--app-accent-text, #185a9d)",
                        fontWeight: 800,
                        fontSize: "calc(14px * var(--app-font-scale, 1))",
                      }}
                    >
                      {inning.battingTeam}
                    </Typography>
                    <Typography
                      sx={{
                        color: "var(--app-accent-text, #185a9d)",
                        fontWeight: 900,
                        fontSize: "calc(18px * var(--app-font-scale, 1))",
                        lineHeight: 1.1,
                      }}
                    >
                      {inning.runs}/{inning.wickets}
                    </Typography>
                    <Typography
                      sx={{
                        color: "var(--app-accent-text, #185a9d)",
                        fontWeight: 700,
                        fontSize: "calc(12.5px * var(--app-font-scale, 1))",
                      }}
                    >
                      {matchLengthMode === "balls"
                        ? `${t("Balls")}: ${inning.balls}`
                        : `${t("Overs")}: ${inning.overs}`}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>}
            <Box sx={{ mt: 1.2 }}>
              {hasDetailedScorecard ? (
                <PlayerScorecardPanel
                  teams={teams}
                  targetScore={targetScore}
                  matchLengthMode={matchLengthMode}
                  playerRosterByTeam={playerRosterByTeam}
                  playerScorecardByTeam={playerScorecardByTeam}
                  recentEventsByTeams={snapshot.recentEventsByTeams}
                  striker={activePlayers.striker}
                  bowler={activePlayers.bowler}
                  editable={false}
                  showHeader
                />
              ) : (
                <Box
                  className="app-saved-match-empty"
                  sx={{
                    border: "1px dashed var(--app-accent-start, #43cea2)",
                    borderRadius: 2,
                    px: 1.2,
                    py: 1,
                    background:
                      "color-mix(in srgb, white 76%, var(--app-accent-start, #43cea2) 24%)",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--app-accent-text, #185a9d)",
                      fontWeight: 700,
                      fontSize: "calc(13.5px * var(--app-font-scale, 1))",
                    }}
                  >
                    {t("Detailed scorecard is not available for this match.")}
                  </Typography>
                </Box>
              )}
            </Box>
            {/* Each Super Over is its own tiny mini-match with its own
                openers, so its individual batting/bowling figures live in
                `snapshot.superOvers[].playerScorecardByTeam` -- separate
                from (and never merged into) the regulation scorecard above.
                Without this, a tied match's summary page showed the team
                totals for a Super Over (via the Innings Summary section)
                but never who actually scored or bowled those runs. */}
            {(snapshot.superOvers ?? []).map((phase, phaseIdx) => {
              const phaseHasDetailedScorecard = Object.values(
                phase.playerRosterByTeam ?? {},
              ).some((players) => (players ?? []).length > 0);
              if (!phaseHasDetailedScorecard) return null;
              const phaseLabel = hasMultipleSuperOvers
                ? `${t("Super Over")} ${phaseIdx + 1}`
                : t("Super Over");
              return (
                <Box key={`super-over-scorecard-${phaseIdx}`} sx={{ mt: 1.2 }}>
                  <Typography
                    sx={{
                      color: "var(--app-accent-text, #185a9d)",
                      fontWeight: 800,
                      fontSize: "calc(15px * var(--app-font-scale, 1))",
                      mb: 0.8,
                    }}
                  >
                    {phaseLabel} — {t("Player Scorecard")}
                  </Typography>
                  <PlayerScorecardPanel
                    teams={phase.teams}
                    targetScore={phase.targetScore}
                    matchLengthMode={phase.matchLengthMode}
                    playerRosterByTeam={phase.playerRosterByTeam ?? {}}
                    playerScorecardByTeam={phase.playerScorecardByTeam ?? {}}
                    recentEventsByTeams={phase.recentEventsByTeams}
                    striker={phase.activePlayers?.striker}
                    bowler={phase.activePlayers?.bowler}
                    editable={false}
                    showHeader={false}
                  />
                </Box>
              );
            })}
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default ViewSavedMatch;
