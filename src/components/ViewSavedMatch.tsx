import React, { useMemo } from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MetaHelmet from "./MetaHelmet";
import AppBar from "./AppBar";
import ScoreDisplay from "./ScoreDisplay";
import PlayerScorecardPanel from "./PlayerScorecardPanel";
import { getCompletedMatchById } from "../utils/completedMatches";

const ViewSavedMatch: React.FC = () => {
  const { historyId } = useParams();
  const { t } = useTranslation();

  const match = useMemo(
    () => (historyId ? getCompletedMatchById(historyId) : undefined),
    [historyId]
  );

  if (!match) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography sx={{ color: "#fff", fontWeight: 700 }}>{t("Match not found")}</Typography>
      </Box>
    );
  }

  const snapshot = match.snapshot;
  const {
    score,
    wickets,
    currentOver,
    currentBallOfOver,
    targetOvers,
    targetScore,
    remainingBalls,
    teams,
    playerRosterByTeam = {},
    playerScorecardByTeam = {},
    activePlayers = { striker: "", nonStriker: "", bowler: "" },
  } = snapshot;

  const battingTeam = targetScore ? teams[1] : teams[0];
  const bowlingTeam = targetScore ? teams[0] : teams[1];
  const currentStrikerStats = activePlayers.striker
    ? {
        name: activePlayers.striker,
        runs:
          playerScorecardByTeam[battingTeam]?.batting?.[activePlayers.striker]?.runs ?? 0,
        balls:
          playerScorecardByTeam[battingTeam]?.batting?.[activePlayers.striker]?.balls ?? 0,
        fours:
          playerScorecardByTeam[battingTeam]?.batting?.[activePlayers.striker]?.fours ?? 0,
        sixes:
          playerScorecardByTeam[battingTeam]?.batting?.[activePlayers.striker]?.sixes ?? 0,
      }
    : undefined;
  const currentBowlerStats = activePlayers.bowler
    ? {
        name: activePlayers.bowler,
        balls:
          playerScorecardByTeam[bowlingTeam]?.bowling?.[activePlayers.bowler]?.balls ?? 0,
        runsConceded:
          playerScorecardByTeam[bowlingTeam]?.bowling?.[activePlayers.bowler]?.runsConceded ?? 0,
        wickets:
          playerScorecardByTeam[bowlingTeam]?.bowling?.[activePlayers.bowler]?.wickets ?? 0,
      }
    : undefined;
  const hasDetailedScorecard = Object.values(playerRosterByTeam).some(
    (players) => (players ?? []).length > 0
  );

  return (
    <>
      <MetaHelmet
        pageTitle="Saved Match"
        canonical="/match-history"
        description="View saved cricket match history and scorecards"
      />
      <AppBar showHomeMenuItem />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
          pb: 2.5,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 860, px: { xs: 1, sm: 2 }, mt: 1.2 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              background: "linear-gradient(135deg, #e0eafc 0%, #f8fffc 100%)",
              border: "2px solid #43cea2",
              boxShadow: "0 8px 32px 0 #43cea255",
              p: { xs: 1.2, sm: 1.6 },
            }}
          >
            <Box sx={{ px: 0.6, pb: 0.6 }}>
              <Typography sx={{ color: "#185a9d", fontWeight: 800, fontSize: { xs: 21, sm: 24 } }}>
                {t("Match Summary")}
              </Typography>
              <Typography sx={{ color: "#185a9d", fontWeight: 700, fontSize: { xs: 14, sm: 15 }, opacity: 0.95 }}>
                {match.teams[0]} vs {match.teams[1]} |{" "}
                {match.resultText ?? `${t("Winner")}: ${match.winningTeam}`}
              </Typography>
            </Box>
            <Divider
              sx={{
                mb: 1.3,
                background: "#43cea2",
                height: 2.5,
                borderRadius: 2,
              }}
            />
            <ScoreDisplay
              score={score}
              wickets={wickets}
              overs={Number(`${currentOver}.${currentBallOfOver}`)}
              targetOvers={targetOvers}
              targetScore={targetScore}
              remainingBalls={remainingBalls}
              teamName={targetScore ? teams[1] : teams[0]}
              resultText={match.resultText}
              currentStriker={currentStrikerStats}
              currentBowler={currentBowlerStats}
            />
            <Box
              sx={{
                mt: 1.1,
                border: "1px solid rgba(67,206,162,0.7)",
                borderRadius: 2.5,
                p: 1.1,
                background:
                  "linear-gradient(135deg, rgba(67,206,162,0.08) 0%, rgba(24,90,157,0.07) 100%)",
              }}
            >
              <Typography sx={{ color: "#185a9d", fontWeight: 800, fontSize: 15, mb: 0.8 }}>
                {t("Innings Summary")}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 0.9,
                }}
              >
                {match.innings?.map((inning, idx) => (
                  <Box
                    key={`${inning.battingTeam}-${idx}`}
                    sx={{
                      border: "1px solid #43cea2",
                      borderRadius: 2,
                      p: 0.9,
                      background: "rgba(255,255,255,0.85)",
                    }}
                  >
                    <Typography sx={{ color: "#185a9d", fontWeight: 700, fontSize: 12.5 }}>
                      {idx === 0 ? t("1st Inning") : t("2nd Inning")}
                    </Typography>
                    <Typography sx={{ color: "#185a9d", fontWeight: 800, fontSize: 14 }}>
                      {inning.battingTeam}
                    </Typography>
                    <Typography sx={{ color: "#185a9d", fontWeight: 900, fontSize: 18, lineHeight: 1.1 }}>
                      {inning.runs}/{inning.wickets}
                    </Typography>
                    <Typography sx={{ color: "#185a9d", fontWeight: 700, fontSize: 12.5 }}>
                      {t("Overs")}: {inning.overs}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box sx={{ mt: 1.2 }}>
              {hasDetailedScorecard ? (
                <PlayerScorecardPanel
                  teams={teams}
                  targetScore={targetScore}
                  playerRosterByTeam={playerRosterByTeam}
                  playerScorecardByTeam={playerScorecardByTeam}
                  striker={activePlayers.striker}
                  bowler={activePlayers.bowler}
                  editable={false}
                  showHeader
                />
              ) : (
                <Box
                  sx={{
                    border: "1px dashed #43cea2",
                    borderRadius: 2,
                    px: 1.2,
                    py: 1,
                    background: "rgba(255,255,255,0.72)",
                  }}
                >
                  <Typography sx={{ color: "#185a9d", fontWeight: 700, fontSize: 13.5 }}>
                    {t("Detailed player scorecard is not available for this match.")}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default ViewSavedMatch;
