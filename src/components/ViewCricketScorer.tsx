"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
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

const webSocketService = new WebSocketService();
const ViewCricketScorer: React.FC = () => {
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
    console.log("gameId", gameId);
    webSocketService.send(SocketIOClientEvents.ROOM_JOIN, gameId);
  }, [gameId]);

  useEffect(() => {
    webSocketService.startListening(
      SocketIOServerEvents.GAME_SCORE_UPDATED,
      (data) => {
        console.log("updated score", JSON.parse(data));
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
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      <Box sx={{ width: '100vw', position: 'relative', left: 0 }}>
        <AppBar onShowHistory={onOpenHistoryModal} />
      </Box>
      <ScoreDisplay
        score={score}
        wickets={wickets}
        overs={Number(`${currentOver}.${currentBallOfOver}`)}
        targetOvers={targetOvers}
        targetScore={targetScore}
        remainingBalls={remainingBalls}
      />
      <RecentEvents events={eventsToShow} />

      {isOpenMatchWinnerModal && (
        <MatchWinnerModal
          open={isOpenMatchWinnerModal}
          teamName={winningTeam}
        />
      )}

      {isOpenTargetScoreModal && (
        <TargetScoreModal
          open={isOpenTargetScoreModal}
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
  );
};

export default ViewCricketScorer;
