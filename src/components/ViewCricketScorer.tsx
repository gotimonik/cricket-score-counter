"use client";

import type React from "react";
import AdSenseBanner from "./AdSenseBanner";
import { useEffect, useMemo, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import ScoreDisplay from "./ScoreDisplay";
import RecentEvents from "./RecentEvents";
import { useDisclosure } from "../hooks/useDisclosure";
import AppBar from "./AppBar";
import HistoryModal from "../modals/HistoryModal";
import WebSocketService from "../services/WebSocketService";
import { SocketIOClientEvents, SocketIOServerEvents } from "../utils/constant";
import { ScoreState } from "../types/cricket";
import { useLocation, useParams } from "react-router-dom";
import MatchWinnerModal from "../modals/MatchWinnerModal";
import TargetScoreModal from "../modals/TargetScoreModal";
import MetaHelmet from "./MetaHelmet";
import PlayerScorecardModal from "../modals/PlayerScorecardModal";
import PlayerScorecardPanel from "./PlayerScorecardPanel";
import { getWinningSummaryFromSnapshot } from "../utils/completedMatches";
import { isV1Path } from "../utils/routes";

const webSocketService = new WebSocketService();
const LOCAL_VIEW_STATE_KEY = "cricket-view-score-state";
const defaultScoreState: ScoreState = {
  score: 0,
  targetScore: 0,
  wickets: 0,
  currentOver: 0,
  currentBallOfOver: 0,
  targetOvers: 0,
  teams: ["INDIA A", "INDIA B"],
  remainingBalls: 0,
  recentEvents: {},
  recentEventsByTeams: {},
  winningTeam: "",
  playerRosterByTeam: {},
  playerScorecardByTeam: {},
  activePlayers: { striker: "", nonStriker: "", bowler: "" },
};

const ViewCricketScorer: React.FC = () => {
  const sectionGap = { xs: 1.5, sm: 2 };
  const location = useLocation();
  const hasAdvancedAccess = useMemo(
    () => isV1Path(location.pathname),
    [location.pathname]
  );
  const [isLoading, setIsLoading] = useState(webSocketService.isLoading());
  const [scoreState, setScoreState] = useState<ScoreState>(defaultScoreState);

  const { gameId } = useParams();

  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_VIEW_STATE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as ScoreState;
      if (!parsed || !Array.isArray(parsed.teams)) return;
      setScoreState({
        ...defaultScoreState,
        ...parsed,
      });
    } catch {
      // ignore invalid local state
    }
  }, []);

  useEffect(() => {
    if (!gameId) return;
    webSocketService.send(SocketIOClientEvents.GAME_JOIN, gameId);
    const interval = setInterval(() => {
      setIsLoading(webSocketService.isLoading());
    }, 200);
    return () => clearInterval(interval);
  }, [gameId]);

  useEffect(() => {
    webSocketService.startListening(
      SocketIOServerEvents.GAME_SCORE_UPDATED,
      (data) => {
        const parsedData =
          typeof data === "string" ? (JSON.parse(data) as ScoreState) : (data as ScoreState);
        const nextState = {
          ...defaultScoreState,
          ...parsedData,
        };
        setScoreState(nextState);
        localStorage.setItem(LOCAL_VIEW_STATE_KEY, JSON.stringify(nextState));
      }
    );
  }, []);

  const {
    isOpen: isOpenHistoryModal,
    onClose: onCloseHistoryModal,
    onOpen: onOpenHistoryModal,
  } = useDisclosure();

  const {
    isOpen: isOpenMatchWinnerModal,
    onClose: onCloseMatchWinnerModal,
    onOpen: onOpenMatchWinnerModal,
  } = useDisclosure();

  const {
    isOpen: isOpenTargetScoreModal,
    onClose: onCloseTargetScoreModal,
    onOpen: onOpenTargetScoreModal,
  } = useDisclosure();
  const {
    isOpen: isOpenPlayerScorecardModal,
    onClose: onClosePlayerScorecardModal,
    onOpen: onOpenPlayerScorecardModal,
  } = useDisclosure();

  const {
    currentBallOfOver,
    currentOver,
    recentEvents,
    score,
    wickets,
    targetOvers,
    targetScore,
    remainingBalls,
    teams,
    winningTeam,
    recentEventsByTeams = {},
    playerRosterByTeam = {},
    playerScorecardByTeam = {},
    activePlayers = { striker: "", nonStriker: "", bowler: "" },
  } = scoreState;
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
  const winningResultText = useMemo(() => {
    if (!winningTeam) return "";
    return getWinningSummaryFromSnapshot(scoreState, winningTeam).resultText;
  }, [scoreState, winningTeam]);

  useEffect(() => {
    if (winningTeam) {
      onOpenMatchWinnerModal();
    } else {
      if (isOpenMatchWinnerModal) {
        onCloseMatchWinnerModal();
      }
    }
  }, [
    isOpenMatchWinnerModal,
    onCloseMatchWinnerModal,
    onOpenMatchWinnerModal,
    winningTeam,
  ]);

  useEffect(() => {
    if (
      targetOvers > 0 &&
      targetOvers === currentOver &&
      !remainingBalls &&
      !targetScore
    ) {
      // Target overs reached
      // Show target score modal
      onOpenTargetScoreModal();
    } else {
      onCloseTargetScoreModal();
    }
  }, [
    currentOver,
    targetOvers,
    remainingBalls,
    targetScore,
    onOpenTargetScoreModal,
    onCloseTargetScoreModal,
  ]);

  let eventsToShow: any[] = [];
  if (
    recentEvents &&
    typeof currentOver === "number" &&
    Number.isFinite(currentOver) &&
    currentOver >= 0
  ) {
    const current = Array.isArray(recentEvents[currentOver])
      ? recentEvents[currentOver]
      : [];
    if (current.length > 0) {
      eventsToShow = current;
    } else if (currentOver > 0) {
      const prev = Array.isArray(recentEvents[currentOver - 1])
        ? recentEvents[currentOver - 1]
        : [];
      eventsToShow = prev;
    }
  }

  // Only show AdSenseBanner if there is meaningful match content and match has started
  const hasContent =
    scoreState.teams.every((t) => t && t.trim().length > 0) &&
    scoreState.targetOvers > 0 &&
    (scoreState.score > 0 ||
      scoreState.wickets > 0 ||
      scoreState.currentOver > 0);
  return (
    <>
      <MetaHelmet
        pageTitle="Score Board"
        canonical="/join-game"
        description="View live cricket scores and match details. Join a game and follow the action with Cricket Score Counter."
        robots="noindex,follow"
      />
      <AppBar
        gameId={gameId}
        onShowHistory={onOpenHistoryModal}
        onShowPlayerScorecard={hasAdvancedAccess ? onOpenPlayerScorecardModal : undefined}
      />
      {/* AdSense banner for content-rich page */}
      <AdSenseBanner show={hasContent} />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        {isLoading && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              background: "rgba(255,255,255,0.5)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={64} thickness={5} color="primary" />
          </Box>
        )}
        {/* Sticky ScoreDisplay for mobile */}
        <Box
          className="app-view-score-sticky"
          sx={{
            width: "100%",
            minHeight: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: { xs: "sticky", sm: "relative" },
            top: { xs: 0, sm: "unset" },
            zIndex: 9,
            py: { xs: 1.25, sm: 1.75 },
            mb: sectionGap,
            background: {
              xs: "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))",
              sm: "none",
            },
          }}
        >
          <ScoreDisplay
            score={score}
            wickets={wickets}
            overs={Number(`${currentOver}.${currentBallOfOver}`)}
            targetOvers={targetOvers}
            targetScore={targetScore}
            remainingBalls={remainingBalls}
            teamName={targetScore ? teams[1] : teams[0]}
            currentStriker={currentStrikerStats}
            currentBowler={currentBowlerStats}
          />
        </Box>
        {/* Main content scrollable on mobile */}
        <Box
          className="app-view-main-content"
          sx={{
            width: "100%",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            overflowY: "visible",
            pt: 0,
            px: { xs: 1, sm: 2 },
          }}
        >
          {winningResultText ? (
            <Box
              className="app-view-result-banner-wrap"
              sx={{
                width: "100%",
                maxWidth: 620,
                mx: "auto",
                mb: sectionGap,
                px: 0,
              }}
            >
              <Box
                sx={{
                  borderRadius: 2.5,
                  border: "1.5px solid var(--app-accent-start, #43cea2)",
                  background: "rgba(255,255,255,0.9)",
                  boxShadow: "0 2px 10px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
                  py: 0.9,
                  px: 1.2,
                  textAlign: "center",
                }}
              >
                <Typography sx={{ color: "#0d8a52", fontWeight: 800, fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(15px * var(--app-font-scale, 1))" } }}>
                  {winningResultText}
                </Typography>
              </Box>
            </Box>
          ) : null}
          <Box sx={{ width: "100%", maxWidth: 940, display: "flex", justifyContent: "center", mb: sectionGap }}>
            <RecentEvents events={eventsToShow} />
          </Box>
          {hasAdvancedAccess ? (
            <Box sx={{ width: "100%", maxWidth: 940, pb: 1.2 }}>
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
            </Box>
          ) : null}
        </Box>
        {hasAdvancedAccess && (
          <PlayerScorecardModal
            open={isOpenPlayerScorecardModal}
            onClose={onClosePlayerScorecardModal}
            teams={teams}
            targetScore={targetScore}
            playerRosterByTeam={playerRosterByTeam}
            playerScorecardByTeam={playerScorecardByTeam}
            striker={activePlayers.striker}
            bowler={activePlayers.bowler}
            editable={false}
          />
        )}

        {isOpenMatchWinnerModal && (
          <MatchWinnerModal
            open={isOpenMatchWinnerModal}
            teamName={winningTeam}
            resultText={winningResultText}
          />
        )}

        {isOpenTargetScoreModal && (
          <TargetScoreModal
            open={isOpenTargetScoreModal}
            teamName={teams[1]}
            targetScore={score + 1}
          />
        )}

        {isOpenHistoryModal && (
          <HistoryModal
            open={isOpenHistoryModal}
            handleClose={onCloseHistoryModal}
            teams={teams}
            recentEventsByTeams={recentEventsByTeams}
            resultText={winningResultText}
          />
        )}
      </Box>
    </>
  );
};

export default ViewCricketScorer;
