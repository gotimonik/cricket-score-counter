"use client";

import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import type { BallEvent } from "../types/cricket";
import ScoreDisplay from "./ScoreDisplay";
import RecentEvents from "./RecentEvents";
import ScoringKeypad from "./ScoringKeypad";
import { useDisclosure } from "../hooks/useDisclosure";
import AppBar from "./AppBar";
import TargetOverModal from "../modals/TargetOverModal";
import NoBallModal from "../modals/NoBallModal";
import ResetScoreModal from "../modals/ResetScoreModal";
import TargetScoreModal from "../modals/TargetScoreModal";
import MatchWinnerModal from "../modals/MatchWinnerModal";
import HistoryModal from "../modals/HistoryModal";
import useNavigationEvents from "../hooks/useNavigationEvents";
import WebSocketService from "../services/WebSocketService";
import { SocketIOClientEvents } from "../utils/constant";
import { useLocation } from "react-router-dom";

const webSocketService = new WebSocketService();
const defaultState = {
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
};

const CricketScorer: React.FC = () => {
  const [score, setScore] = useState(defaultState.score);
  const [targetScore, setTargetScore] = useState(defaultState.targetScore);
  const [wickets, setWickets] = useState(defaultState.wickets);
  const [currentOver, setCurrentOver] = useState(defaultState.currentOver);
  const [currentBallOfOver, setCurrentBallOfOver] = useState(
    defaultState.currentBallOfOver
  );
  const [targetOvers, setTargetOvers] = useState(defaultState.targetOvers);
  const [teams, setTeams] = useState<string[]>(defaultState.teams);
  const [winningTeam, setWinningTeam] = useState<string>(
    defaultState.winningTeam
  );
  const [remainingBalls, setRemainingBalls] = useState(
    defaultState.remainingBalls
  );
  const [recentEvents, setRecentEvents] = useState<{
    [key: number]: BallEvent[];
  }>({});
  const [recentEventsByTeams, setRecentEventsByTeams] = useState<{
    [team: string]: {
      [key: number]: BallEvent[];
    };
  }>({});
  const { state } = useLocation();
  const gameId = state?.gameId;

  useEffect(() => {
    if (!gameId) return;
    webSocketService.send(SocketIOClientEvents.ROOM_JOIN, gameId);
  }, [gameId]);

  useNavigationEvents({
    onLeavePage: (eventType) => {
      console.log("Navigation event:", eventType);
    },
    shouldPrompt: score > 0 || wickets > 0 || targetOvers > 0,
    confirmationMessage:
      "You have unsaved changes. Are you sure you want to leave?",
  });

  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isOpenNoBallModal,
    onClose: onCloseNoBallModal,
    onOpen: onOpenNoBallModal,
  } = useDisclosure();

  const {
    isOpen: isOpenResetScoreModal,
    onClose: onCloseResetScoreModal,
    onOpen: onOpenResetScoreModal,
  } = useDisclosure();

  const {
    isOpen: isOpenTargetScoreModal,
    onClose: onCloseTargetScoreModal,
    onOpen: onOpenTargetScoreModal,
  } = useDisclosure();

  const {
    isOpen: isOpenMatchWinnerModal,
    onClose: onCloseMatchWinnerModal,
    onOpen: onOpenMatchWinnerModal,
  } = useDisclosure();

  const {
    isOpen: isOpenHistoryModal,
    onClose: onCloseHistoryModal,
    onOpen: onOpenHistoryModal,
  } = useDisclosure();

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
    }
  }, [
    currentOver,
    targetOvers,
    onOpenTargetScoreModal,
    remainingBalls,
    targetScore,
  ]);

  useEffect(() => {
    if (targetScore) {
      if (score >= targetScore) {
        setWinningTeam(teams[1]);
        onOpenMatchWinnerModal();
      } else if (remainingBalls === 0 && score === targetScore - 1) {
        setWinningTeam("Tied");
        onOpenMatchWinnerModal();
      } else if (remainingBalls === 0 && score < targetScore) {
        setWinningTeam(teams[0]);
        onOpenMatchWinnerModal();
      }
    }
  }, [
    targetScore,
    score,
    targetOvers,
    currentOver,
    onOpenMatchWinnerModal,
    teams,
    remainingBalls,
  ]);

  const handleEventNew = (
    type: BallEvent["type"],
    value: number,
    extra_type?: "no-ball-extra"
  ): void => {
    // ask for the target overs if not set
    if (!targetOvers) {
      onOpen();
      return;
    }

    // do nothing if target overs are reached
    if (currentOver === targetOvers) {
      return;
    }

    const isExtra =
      ["wide", "no-ball"].includes(type) || extra_type === "no-ball-extra";

    // Handle no-ball modal trigger
    if (type === "no-ball") {
      onOpenNoBallModal();
      return;
    }

    // Add event
    const newEvent: BallEvent = { type: type, extra_type, value };
    const updatedEvents = recentEvents[currentOver] ?? [];
    const newEvents = [...updatedEvents, newEvent];

    setRecentEvents((prev) => ({
      ...prev,
      [currentOver]: newEvents,
    }));

    // Handle ball progression only for valid deliveries
    if (!isExtra) {
      const nextBall = currentBallOfOver + 1;
      if (nextBall < 6) {
        setCurrentBallOfOver(nextBall);
      } else {
        setCurrentOver((prev) => prev + 1);
        setCurrentBallOfOver(0);
      }
      // Update remaining balls
      if (targetScore) {
        setRemainingBalls((prev) => prev - 1);
      }
    }

    // Update score and wickets
    if (["run", "wide", "no-ball", "no-ball-extra"].includes(type)) {
      // value + 1, here 1 is for no ball
      const eventValue = extra_type === "no-ball-extra" ? value + 1 : value;
      setScore((prev) => prev + eventValue);
    }
    if (type === "wicket") {
      setWickets((prev) => prev + 1);
    }

    // Close no-ball modal if needed
    if (type !== "wide") {
      onCloseNoBallModal();
    }
  };

  const undoLastEvent = (): void => {
    let over = currentOver;
    let events = recentEvents[over];

    // If current over is empty, move to previous
    while ((!events || events.length === 0) && over > 0) {
      over -= 1;
      events = recentEvents[over];
    }

    if (!events || events.length === 0) {
      // Nothing to undo
      return;
    }

    const lastEvent = events[events.length - 1];

    if (!lastEvent) return;
    const isExtra = ["wide", "no-ball", "no-ball-extra"].includes(
      lastEvent.type
    );

    if (!isExtra) {
      if (currentBallOfOver > 0) {
        // Simply go back one ball
        setCurrentBallOfOver(currentBallOfOver - 1);
      } else if (currentOver > 0) {
        // Move to previous over and count its valid deliveries
        const previousOver = currentOver - 1;
        const previousEvents = recentEvents[previousOver] || [];
        const validBalls = previousEvents.filter(
          (e) => !["wide", "no-ball", "no-ball-extra"].includes(e.type)
        ).length;

        setCurrentOver(previousOver);
        setCurrentBallOfOver(validBalls > 0 ? validBalls - 1 : 0);
      } else {
        // Already at start, reset to 0
        setCurrentBallOfOver(0);
      }

      // Update remaining balls
      if (targetScore) {
        setRemainingBalls((prev) => prev + 1);
      }
    }

    const updatedEvents = events.slice(0, -1);

    setRecentEvents((prev) => ({
      ...prev,
      [over]: updatedEvents,
    }));

    // Reverse score/wickets
    if (["run", "wide", "no-ball", "no-ball-extra"].includes(lastEvent.type)) {
      // value + 1, here 1 is for no ball
      const lastEventValue =
        lastEvent.type === "no-ball-extra"
          ? lastEvent.value + 1
          : lastEvent.value;
      setScore((prev) => prev - lastEventValue);
    }
    if (lastEvent.type === "wicket") {
      setWickets((prev) => Math.max(0, prev - 1));
    }
  };

  const resetAllState = ({
    resetTargetOvers = true,
    resetTargetScore = false,
    targetOvers = 0,
  }) => {
    setScore(0);
    setWickets(0);
    setCurrentOver(0);
    setCurrentBallOfOver(0);
    setRecentEvents({});
    setWinningTeam("");
    setTeams(["Team 1", "Team 2"]);
    if (resetTargetOvers) {
      setTargetOvers(targetOvers);
    }
    if (resetTargetScore) {
      setTargetScore(0);
      setRecentEventsByTeams({});
      setRemainingBalls(0);
    }
  };

  const eventsToShow =
    (recentEvents[currentOver] ?? []).length > 0
      ? recentEvents[currentOver]
      : currentOver > 0
      ? recentEvents[currentOver - 1]
      : [];

  const handleStateUpdate = useCallback(
    (data: object) => {
      webSocketService.send(SocketIOClientEvents.GAME_SCORE_UPDATE, {
        ...data,
        gameId,
      });
    },
    [gameId]
  );

  useEffect(() => {
    if (recentEvents && Object.keys(recentEvents).length > 0) {
      setRecentEventsByTeams((prev) => {
        const updatedRecentEventsByTeams = {
          ...prev,
          [targetScore ? teams[1] : teams[0]]: recentEvents,
        };
        const updatedData = {
          score,
          wickets,
          currentBallOfOver,
          currentOver,
          targetOvers,
          remainingBalls,
          targetScore,
          teams,
          recentEvents,
          recentEventsByTeams: updatedRecentEventsByTeams,
        };
        handleStateUpdate(updatedData);
        return updatedRecentEventsByTeams;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentOver,
    targetOvers,
    onOpenTargetScoreModal,
    remainingBalls,
    targetScore,
    teams,
    recentEvents,
    handleStateUpdate,
  ]);

  useEffect(() => {
    handleStateUpdate({ targetOvers, winningTeam });
  }, [handleStateUpdate, targetOvers, winningTeam]);

  useEffect(() => {
    handleStateUpdate(defaultState);
  }, [handleStateUpdate]);

  if (!gameId) {
    return null;
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
        background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <Box sx={{ width: "100vw", position: "relative", left: 0 }}>
        <AppBar
          onShare={() => {
            const shareData = {
              title: "Cricket Score Counter",
              text: "Join my cricket game!",
              url: `${window.location.origin}/join-game/${gameId}`,
            };
            if (navigator.share) {
              navigator
                .share(shareData)
                .then(() => console.log("Game link shared successfully"))
                .catch((err) => console.error("Error sharing game link:", err));
            } else {
              // Fallback for browsers that do not support the Web Share API
              navigator.clipboard
                .writeText(shareData.url)
                .then(() => alert("Game link copied to clipboard!"))
                .catch((err) =>
                  console.error("Error copying game link to clipboard:", err)
                );
            }
          }}
          onReset={onOpenResetScoreModal}
          onShowHistory={onOpenHistoryModal}
          gameId={gameId}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          px: { xs: 1, sm: 2 },
          mt: 2,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "100%", mb: 2 }}>
          <ScoreDisplay
            score={score}
            wickets={wickets}
            overs={Number(`${currentOver}.${currentBallOfOver}`)}
            targetOvers={targetOvers}
            targetScore={targetScore}
            remainingBalls={remainingBalls}
          />
        </Box>
        <RecentEvents events={eventsToShow} />
        <Box sx={{ width: "100%", height: 0, flexGrow: 1 }} />
        <Box
          sx={{
            width: '100%',
            maxWidth: 600,
            position: 'fixed',
            left: '50%',
            bottom: 0,
            transform: 'translateX(-50%)',
            zIndex: 1200,
            pb: { xs: 1, sm: 2 },
            background: 'none',
          }}
        >
          <ScoringKeypad onEvent={handleEventNew} onUndo={undoLastEvent} />
        </Box>
      </Box>
      {isOpen && (
        <TargetOverModal
          handleClose={onClose}
          open={isOpen}
          handleSubmit={(overs) => {
            setTargetOvers(overs);
            onClose();
          }}
        />
      )}
      {isOpenNoBallModal && (
        <NoBallModal
          handleClose={onCloseNoBallModal}
          open={isOpenNoBallModal}
          handleSubmit={(value) => {
            handleEventNew(value.type, value.value, "no-ball-extra");
          }}
        />
      )}
      {isOpenResetScoreModal && (
        <ResetScoreModal
          handleClose={onCloseResetScoreModal}
          open={isOpenResetScoreModal}
          handleSubmit={(overs) => {
            resetAllState({ resetTargetScore: true });
            setTargetOvers(overs);
            onCloseResetScoreModal();
            handleStateUpdate({ ...defaultState, targetOvers: overs });
          }}
        />
      )}
      {isOpenTargetScoreModal && (
        <TargetScoreModal
          open={isOpenTargetScoreModal}
          targetScore={score + 1}
          handleSubmit={() => {
            setTargetScore(score + 1);
            setRemainingBalls(targetOvers * 6);
            resetAllState({ resetTargetOvers: false });
            onCloseTargetScoreModal();
          }}
        />
      )}
      {isOpenMatchWinnerModal && (
        <MatchWinnerModal
          open={isOpenMatchWinnerModal}
          teamName={winningTeam}
          handleSubmit={() => {
            resetAllState({
              resetTargetOvers: true,
              resetTargetScore: true,
              targetOvers: winningTeam === "Tied" ? 1 : 0,
            });
            handleStateUpdate(defaultState);
            onCloseMatchWinnerModal();
          }}
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

export default CricketScorer;
