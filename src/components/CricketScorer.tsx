"use client";

import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import ShareLinkModal from "../modals/ShareLinkModal";
import type { BallEvent } from "../types/cricket";
import ScoreDisplay from "./ScoreDisplay";
import RecentEvents from "./RecentEvents";
import ScoringKeypad from "./ScoringKeypad";
import TeamNameModal from "../modals/TeamNameModal";
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
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const webSocketService = new WebSocketService();
const defaultTeams = ["", ""];
const defaultState = {
  score: 0,
  targetScore: 0,
  wickets: 0,
  currentOver: 0,
  currentBallOfOver: 0,
  targetOvers: 0,
  teams: defaultTeams,
  remainingBalls: 0,
  recentEvents: {},
  recentEventsByTeams: {},
  winningTeam: "",
};

const LoadingOverlay: React.FC<{ isLoading: boolean }> = ({ isLoading }) =>
  isLoading ? (
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
  ) : null;

const AppBarSection: React.FC<{
  gameId: string;
  onShare: () => void;
  onReset: () => void;
  onShowHistory: () => void;
  isShareModalOpen: boolean;
  shareUrl: string;
  setShareModalOpen: (v: boolean) => void;
  onEndInning: (() => void) | undefined;
  onEndGame: (() => void) | undefined;
}> = ({
  gameId,
  onShare,
  onReset,
  onShowHistory,
  isShareModalOpen,
  shareUrl,
  setShareModalOpen,
  onEndInning,
  onEndGame,
}) => (
  <Box sx={{ width: "100vw", position: "relative", left: 0 }}>
    <AppBar
      onShare={onShare}
      onReset={onReset}
      onShowHistory={onShowHistory}
      gameId={gameId}
      onEndInning={onEndInning}
      onEndGame={onEndGame}
    />
    <ShareLinkModal
      open={isShareModalOpen}
      onClose={() => setShareModalOpen(false)}
      shareUrl={shareUrl}
    />
  </Box>
);

const MainScoreSection: React.FC<{
  score: number;
  wickets: number;
  currentOver: number;
  currentBallOfOver: number;
  targetOvers: number;
  targetScore: number;
  remainingBalls: number;
  teams: string[];
  eventsToShow: BallEvent[];
  handleEventNew: (
    type: BallEvent["type"],
    value: number,
    extra_type?: "no-ball-extra"
  ) => void;
  undoLastEvent: () => void;
}> = ({
  score,
  wickets,
  currentOver,
  currentBallOfOver,
  targetOvers,
  targetScore,
  remainingBalls,
  teams,
  eventsToShow,
  handleEventNew,
  undoLastEvent,
}) => (
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
        teamName={targetScore ? teams[1] : teams[0]}
      />
    </Box>
    <RecentEvents events={eventsToShow} />
    <Box sx={{ width: "100%", height: 0, flexGrow: 1 }} />
    <Box
      sx={{
        width: "100%",
        maxWidth: 600,
        position: "fixed",
        left: "50%",
        bottom: 0,
        transform: "translateX(-50%)",
        zIndex: 1200,
        pb: { xs: 1, sm: 2 },
        background: "none",
      }}
    >
      <ScoringKeypad onEvent={handleEventNew} onUndo={undoLastEvent} />
    </Box>
  </Box>
);

const ModalsSection: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  setTargetOvers: (v: number) => void;
  isOpenNoBallModal: boolean;
  onCloseNoBallModal: () => void;
  handleEventNew: (
    type: BallEvent["type"],
    value: number,
    extra_type?: "no-ball-extra"
  ) => void;
  isOpenResetScoreModal: boolean;
  onCloseResetScoreModal: () => void;
  resetAllState: (args: any) => void;
  isOpenTargetScoreModal: boolean;
  score: number;
  targetOvers: number;
  teams: string[];
  onCloseTargetScoreModal: () => void;
  isOpenMatchWinnerModal: boolean;
  winningTeam: string;
  teamsArr: string[];
  onCloseMatchWinnerModal: () => void;
  setTeamNameModalOpen: (v: boolean) => void;
  isOpenHistoryModal: boolean;
  onCloseHistoryModal: () => void;
  recentEventsByTeams: any;
}> = (props) => (
  <>
    {props.isOpen && (
      <TargetOverModal
        handleClose={props.onClose}
        open={props.isOpen}
        handleSubmit={(overs) => {
          props.setTargetOvers(overs);
          props.onClose();
        }}
      />
    )}
    {props.isOpenNoBallModal && (
      <NoBallModal
        handleClose={props.onCloseNoBallModal}
        open={props.isOpenNoBallModal}
        handleSubmit={(value) => {
          props.handleEventNew(value.type, value.value, "no-ball-extra");
        }}
      />
    )}
    {props.isOpenResetScoreModal && (
      <ResetScoreModal
        handleClose={props.onCloseResetScoreModal}
        open={props.isOpenResetScoreModal}
        handleSubmit={(overs) => {
          props.resetAllState({ resetTargetScore: 0, resetTargetOvers: overs });
          props.onCloseResetScoreModal();
        }}
      />
    )}
    {props.isOpenTargetScoreModal && (
      <TargetScoreModal
        open={props.isOpenTargetScoreModal}
        targetScore={props.score + 1}
        teamName={props.teams[1]}
        handleSubmit={() => {
          props.resetAllState({
            resetTargetScore: props.score + 1,
            resetTargetOvers: props.targetOvers,
            resetRemainingBalls: props.targetOvers * 6,
          });
          props.onCloseTargetScoreModal();
        }}
      />
    )}
    {props.isOpenMatchWinnerModal && (
      <MatchWinnerModal
        open={props.isOpenMatchWinnerModal}
        teamName={props.winningTeam}
        handleSubmit={() => {
          const tempTeams = [...props.teamsArr];
          if (props.winningTeam === "Tied") {
            props.resetAllState({
              resetTargetScore: 0,
              resetTargetOvers: 1,
              resetTeamNames: [tempTeams[1], tempTeams[0]],
            });
            props.setTeamNameModalOpen(true);
          } else {
            props.resetAllState({
              resetTargetScore: 0,
              resetTargetOvers: 0,
              resetTeamNames: [
                props.winningTeam,
                tempTeams.find((t) => t !== props.winningTeam) || "",
              ],
            });
            props.setTeamNameModalOpen(false);
          }
          props.onCloseMatchWinnerModal();
        }}
      />
    )}
    {props.isOpenHistoryModal && (
      <HistoryModal
        open={props.isOpenHistoryModal}
        handleClose={props.onCloseHistoryModal}
        teams={props.teams}
        recentEventsByTeams={props.recentEventsByTeams}
      />
    )}
  </>
);

const CricketScorer: React.FC = () => {
  const [isLoading, setIsLoading] = useState(webSocketService.isLoading());
  const [score, setScore] = useState(defaultState.score);
  const [targetScore, setTargetScore] = useState(defaultState.targetScore);
  const [wickets, setWickets] = useState(defaultState.wickets);
  const [currentOver, setCurrentOver] = useState(defaultState.currentOver);
  const [currentBallOfOver, setCurrentBallOfOver] = useState(
    defaultState.currentBallOfOver
  );
  const [targetOvers, setTargetOvers] = useState(defaultState.targetOvers);
  const [teams, setTeams] = useState<string[]>(defaultState.teams);
  const [teamNameModalOpen, setTeamNameModalOpen] = useState(false);
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
  // Share modal state (must be inside component)
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();
  const gameId = state?.gameId;

  useEffect(() => {
    if (!gameId) return;
    const interval = setInterval(() => {
      setIsLoading(webSocketService.isLoading());
    }, 200);
    webSocketService.send(SocketIOClientEvents.GAME_JOIN, gameId);
    return () => {
      webSocketService.send(SocketIOClientEvents.GAME_END, gameId);
      clearInterval(interval);
    };
  }, [gameId]);

  useEffect(() => {
    if (!winningTeam) {
      setTeamNameModalOpen(targetOvers === 0);
    }
  }, [targetOvers, winningTeam]);

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
    resetTargetOvers,
    resetTargetScore,
    resetRemainingBalls,
    resetTeamNames,
  }: {
    resetTargetOvers?: number;
    resetTargetScore?: number;
    resetRemainingBalls?: number;
    resetTeamNames?: string[];
  }) => {
    const stateToUpdate = {
      ...defaultState,
    };

    setScore(0);
    setWickets(0);
    setCurrentOver(0);
    setCurrentBallOfOver(0);
    setRecentEvents({});
    setWinningTeam("");
    if (resetTeamNames !== undefined) {
      setTeams(resetTeamNames);
      stateToUpdate.teams = resetTeamNames;
    }
    if (resetTargetOvers !== undefined) {
      setTargetOvers(resetTargetOvers);
      stateToUpdate.targetOvers = resetTargetOvers;
    }
    if (resetTargetScore !== undefined) {
      setTargetScore(resetTargetScore);
      stateToUpdate.targetScore = resetTargetScore;
      if (!resetTargetScore) {
        setRecentEventsByTeams({});
        stateToUpdate.recentEventsByTeams = {};
        setRemainingBalls(0);
        stateToUpdate.remainingBalls = 0;
      }
    }
    if (resetRemainingBalls !== undefined) {
      setRemainingBalls(resetRemainingBalls);
      stateToUpdate.remainingBalls = resetRemainingBalls;
    }
    handleStateUpdate(stateToUpdate);
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

  useMemo(() => {
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
    remainingBalls,
    targetScore,
    teams,
    recentEvents,
    handleStateUpdate,
  ]);

  useMemo(() => {
    handleStateUpdate({ targetOvers, winningTeam });
  }, [handleStateUpdate, targetOvers, winningTeam]);

  useMemo(() => {
    handleStateUpdate(defaultState);
  }, [handleStateUpdate]);

  if (!gameId) {
    return null;
  }

  if (teamNameModalOpen) {
    return (
      <TeamNameModal
        open={teamNameModalOpen}
        onSubmit={(team1, team2) => {
          setTeams([team1, team2]);
          setTeamNameModalOpen(false);
        }}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Cricket Score Counter | Game Counter</title>
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
          justifyContent: "flex-start",
          background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        <LoadingOverlay isLoading={isLoading} />
        <AppBarSection
          gameId={gameId}
          onShare={() => {
            const shareData = {
              title: "Cricket Score Counter",
              text: "Join my cricket game!",
              url: `${window.location.origin}/join-game/${gameId}`,
            };
            const isWebView = (() => {
              const ua =
                navigator.userAgent ||
                navigator.vendor ||
                (window as any).opera ||
                "";
              return (
                /wv|WebView|; wv\)/i.test(ua) ||
                "ReactNativeWebView" in window ||
                "cordova" in window ||
                "Capacitor" in window
              );
            })();
            if (navigator.share && !isWebView) {
              navigator
                .share(shareData)
                .then(() => console.log("Game link shared successfully"))
                .catch((err) => console.error("Error sharing game link:", err));
            } else if (isWebView) {
              setShareUrl(shareData.url);
              setShareModalOpen(true);
            } else {
              if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard
                  .writeText(shareData.url)
                  .then(() => alert("Game link copied to clipboard!"))
                  .catch((err) =>
                    alert(
                      "Error copying game link. Please copy manually: " +
                        shareData.url
                    )
                  );
              } else {
                try {
                  const textArea = document.createElement("textarea");
                  textArea.value = shareData.url;
                  textArea.style.position = "fixed";
                  textArea.style.left = "-9999px";
                  document.body.appendChild(textArea);
                  textArea.focus();
                  textArea.select();
                  document.execCommand("copy");
                  document.body.removeChild(textArea);
                  alert("Game link copied to clipboard!");
                } catch (err) {
                  alert(
                    "Error copying game link. Please copy manually: " +
                      shareData.url
                  );
                }
              }
            }
          }}
          onReset={onOpenResetScoreModal}
          onShowHistory={onOpenHistoryModal}
          isShareModalOpen={isShareModalOpen}
          shareUrl={shareUrl}
          setShareModalOpen={setShareModalOpen}
          onEndInning={
            targetOvers > 0
              ? () => {
                  resetAllState({
                    resetTargetScore: score + 1,
                    resetTargetOvers: targetOvers,
                    resetRemainingBalls: targetOvers * 6,
                  });
                }
              : undefined
          }
          onEndGame={() => {
            resetAllState({});
            navigate("/");
          }}
        />
        <MainScoreSection
          score={score}
          wickets={wickets}
          currentOver={currentOver}
          currentBallOfOver={currentBallOfOver}
          targetOvers={targetOvers}
          targetScore={targetScore}
          remainingBalls={remainingBalls}
          teams={teams}
          eventsToShow={eventsToShow}
          handleEventNew={handleEventNew}
          undoLastEvent={undoLastEvent}
        />
        <ModalsSection
          isOpen={isOpen}
          onClose={onClose}
          setTargetOvers={setTargetOvers}
          isOpenNoBallModal={isOpenNoBallModal}
          onCloseNoBallModal={onCloseNoBallModal}
          handleEventNew={handleEventNew}
          isOpenResetScoreModal={isOpenResetScoreModal}
          onCloseResetScoreModal={onCloseResetScoreModal}
          resetAllState={resetAllState}
          isOpenTargetScoreModal={isOpenTargetScoreModal}
          score={score}
          targetOvers={targetOvers}
          teams={teams}
          onCloseTargetScoreModal={onCloseTargetScoreModal}
          isOpenMatchWinnerModal={isOpenMatchWinnerModal}
          winningTeam={winningTeam}
          teamsArr={teams}
          onCloseMatchWinnerModal={onCloseMatchWinnerModal}
          setTeamNameModalOpen={setTeamNameModalOpen}
          isOpenHistoryModal={isOpenHistoryModal}
          onCloseHistoryModal={onCloseHistoryModal}
          recentEventsByTeams={recentEventsByTeams}
        />
      </Box>
    </>
  );
};

export default CricketScorer;
