"use client";

import type React from "react";
import { useEffect, useState } from "react";
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

const CricketScorer: React.FC = () => {
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [currentOver, setCurrentOver] = useState(0);
  const [currentBallOfOver, setCurrentBallOfOver] = useState(0);
  const [targetOvers, setTargetOvers] = useState(0);
  const [teams, setTeams] = useState<string[]>(["Team 1", "Team 2"]);
  const [winningTeam, setWinningTeam] = useState<string>("");
  const [remainingBalls, setRemainingBalls] = useState(0);
  const [recentEvents, setRecentEvents] = useState<{
    [key: number]: BallEvent[];
  }>({});
  const [recentEventsByTeams, setRecentEventsByTeams] = useState<{
    [team: string]: {
      [key: number]: BallEvent[];
    };
  }>({});

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
    if (recentEvents && Object.keys(recentEvents).length > 0) {
      setRecentEventsByTeams((prev) => ({
        ...prev,
        [targetScore ? teams[1] : teams[0]]: recentEvents,
      }));
    }
  }, [
    currentOver,
    targetOvers,
    onOpenTargetScoreModal,
    remainingBalls,
    targetScore,
    teams,
    recentEvents,
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

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#7e7e7e",
      }}
    >
      <AppBar
        onReset={onOpenResetScoreModal}
        onShowHistory={onOpenHistoryModal}
      />
      <ScoreDisplay
        score={score}
        wickets={wickets}
        overs={Number(`${currentOver}.${currentBallOfOver}`)}
        targetOvers={targetOvers}
        targetScore={targetScore}
        remainingBalls={remainingBalls}
      />
      <RecentEvents events={eventsToShow} />
      <ScoringKeypad onEvent={handleEventNew} onUndo={undoLastEvent} />
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
