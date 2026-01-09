"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import ScoreDisplay from "./ScoreDisplay";
import RecentEvents from "./RecentEvents";
import { useDisclosure } from "../hooks/useDisclosure";
import AppBar from "./AppBar";
import HistoryModal from "../modals/HistoryModal";
import WebSocketService from "../services/WebSocketService";
import { SocketIOClientEvents, SocketIOServerEvents } from "../utils/constant";
import { ScoreState } from "../types/cricket";
import { useParams } from "react-router-dom";
import MatchWinnerModal from "../modals/MatchWinnerModal";
import TargetScoreModal from "../modals/TargetScoreModal";
import { Helmet } from "react-helmet";

const webSocketService = new WebSocketService();
const ViewCricketScorer: React.FC = () => {
  const [isLoading, setIsLoading] = useState(webSocketService.isLoading());
  const [scoreState, setScoreState] = useState<ScoreState>({
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
  });

  const { gameId } = useParams();
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
        const parsedData = JSON.parse(data);
        setScoreState((prevState) => ({
          ...prevState,
          ...parsedData,
        }));
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
  } = scoreState;

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

  return (
    <>
      <Helmet>
        <title>Cricket Score Counter | Score Board</title>
        <meta
          name="description"
          content="Welcome to Cricket Score Counter. Start or join a live cricket match and track scores easily."
        />
        <link rel="canonical" href="https://cricket-score-counter.com/" />
      </Helmet>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
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
              width: "100vw",
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
        <Box sx={{ width: "100vw", position: "relative", left: 0, zIndex: 10 }}>
          <AppBar onShowHistory={onOpenHistoryModal} gameId={gameId} />
        </Box>
        {/* Sticky ScoreDisplay for mobile */}
        <Box
          sx={{
            width: "100vw",
            minHeight: { xs: "60vh", sm: "50vh" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: { xs: "sticky", sm: "relative" },
            top: { xs: 0, sm: "unset" },
            zIndex: 9,
            background: {
              xs: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
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
          />
        </Box>
        {/* Main content scrollable on mobile */}
        <Box
          sx={{
            width: "100vw",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            overflowY: { xs: "auto", sm: "visible" },
            pt: { xs: 1, sm: 2 },
          }}
        >
          <RecentEvents events={eventsToShow} />
        </Box>

        {isOpenMatchWinnerModal && (
          <MatchWinnerModal
            open={isOpenMatchWinnerModal}
            teamName={winningTeam}
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
          />
        )}
      </Box>
    </>
  );
};

export default ViewCricketScorer;
