"use client";

import type React from "react";
import AdSenseBanner from "./AdSenseBanner";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import ShareLinkModal from "../modals/ShareLinkModal";
import type {
  BallEvent,
  PlayerBattingStats,
  PlayerBowlingStats,
  PlayerRosterByTeam,
  PlayerScorecard,
  ScoreState,
} from "../types/cricket";
import ScoreDisplay from "./ScoreDisplay";
import RecentEvents from "./RecentEvents";
import ScoringKeypad from "./ScoringKeypad";
import TeamNameModal from "../modals/TeamNameModal";
import PlayerScorecardModal from "../modals/PlayerScorecardModal";
import ConfirmDialog from "./ConfirmDialog";
import { useDisclosure } from "../hooks/useDisclosure";
import AppBar from "./AppBar";

import NoBallModal from "../modals/NoBallModal";
import ResetScoreModal from "../modals/ResetScoreModal";
import TargetScoreModal from "../modals/TargetScoreModal";
import MatchWinnerModal from "../modals/MatchWinnerModal";
import HistoryModal from "../modals/HistoryModal";
import OpeningPlayersModal from "../modals/OpeningPlayersModal";
import WicketDetailsModal from "../modals/WicketDetailsModal";
import NextBowlerModal from "../modals/NextBowlerModal";
import useNavigationEvents from "../hooks/useNavigationEvents";
import WebSocketService from "../services/WebSocketService";
import { SocketIOClientEvents } from "../utils/constant";
import { useLocation, useNavigate } from "react-router-dom";
import MetaHelmet from "./MetaHelmet";
import { useTranslation } from "react-i18next";
import {
  getWinningSummaryFromSnapshot,
  saveCompletedMatch,
} from "../utils/completedMatches";
import { isV1Path, toCurrentVersionPath } from "../utils/routes";
import { getStoredAppPreferences } from "../utils/appPreferences";

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

const LOCAL_PLAYERS_KEY = "cricket-team-players";
const LOCAL_MATCH_STATE_KEY = "cricket-match-state";
const getSavedPlayersMap = (): Record<string, string[]> => {
  try {
    const saved = localStorage.getItem(LOCAL_PLAYERS_KEY);
    return saved ? (JSON.parse(saved) as Record<string, string[]>) : {};
  } catch {
    return {};
  }
};

const isLegalDelivery = (event: BallEvent) =>
  event.type !== "wide" && event.extra_type !== "no-ball-extra";

const getEventTotalRuns = (event: BallEvent) =>
  event.extra_type === "no-ball-extra" ? event.value + 1 : event.value;

const emptyBatting = (): PlayerBattingStats => ({
  runs: 0,
  balls: 0,
  fours: 0,
  sixes: 0,
  out: false,
  dismissalText: "",
});

const emptyBowling = (): PlayerBowlingStats => ({
  balls: 0,
  runsConceded: 0,
  wickets: 0,
});

const dismissalTextForEvent = (event: BallEvent): string => {
  if (event.wicketType === "caught") {
    const catcher = event.dismissalBy?.trim();
    return catcher ? `c ${catcher} b ${event.bowler ?? ""}` : `c & b ${event.bowler ?? ""}`;
  }
  if (event.wicketType === "run-out") {
    const fielder = event.dismissalBy?.trim();
    return fielder ? `run out (${fielder})` : "run out";
  }
  return `b ${event.bowler ?? ""}`;
};

const createBaseScorecard = (
  roster: PlayerRosterByTeam,
  teams: string[]
): { [team: string]: PlayerScorecard } => {
  const result: { [team: string]: PlayerScorecard } = {};
  teams.forEach((team) => {
    const batting: Record<string, PlayerBattingStats> = {};
    const bowling: Record<string, PlayerBowlingStats> = {};
    (roster[team] ?? []).forEach((player) => {
      batting[player] = emptyBatting();
      bowling[player] = emptyBowling();
    });
    result[team] = { batting, bowling };
  });
  return result;
};

const buildScorecardsFromEvents = (
  teams: string[],
  roster: PlayerRosterByTeam,
  recentEventsByTeams: { [team: string]: { [key: number]: BallEvent[] } }
) => {
  const scorecards = createBaseScorecard(roster, teams);
  teams.forEach((team) => {
    const overs = recentEventsByTeams[team] ?? {};
    Object.values(overs).forEach((events) => {
      events.forEach((event) => {
        if (!event.battingTeam || !event.bowlingTeam || !event.striker) {
          return;
        }
        const battingTeam = event.battingTeam;
        const bowlingTeam = event.bowlingTeam;
        const striker = event.striker;
        const bowler = event.bowler ?? "";
        if (!scorecards[battingTeam]) {
          scorecards[battingTeam] = { batting: {}, bowling: {} };
        }
        if (!scorecards[bowlingTeam]) {
          scorecards[bowlingTeam] = { batting: {}, bowling: {} };
        }
        if (!scorecards[battingTeam].batting[striker]) {
          scorecards[battingTeam].batting[striker] = emptyBatting();
        }
        const totalRuns = getEventTotalRuns(event);
        const isLegal = isLegalDelivery(event);
        const strikerStats = scorecards[battingTeam].batting[striker];
        if (event.type === "run") {
          strikerStats.runs += event.value;
          if (event.value === 4) strikerStats.fours += 1;
          if (event.value === 6) strikerStats.sixes += 1;
        }
        if (event.type === "wicket" && event.value > 0) {
          strikerStats.runs += event.value;
        }
        if (isLegal || event.extra_type === "no-ball-extra") {
          strikerStats.balls += 1;
        }
        if (event.type === "wicket") {
          const outName = event.outBatsman ?? striker;
          if (!scorecards[battingTeam].batting[outName]) {
            scorecards[battingTeam].batting[outName] = emptyBatting();
          }
          scorecards[battingTeam].batting[outName].out = true;
          scorecards[battingTeam].batting[outName].dismissalText =
            dismissalTextForEvent(event);
        }
        if (bowler) {
          if (!scorecards[bowlingTeam].bowling[bowler]) {
            scorecards[bowlingTeam].bowling[bowler] = emptyBowling();
          }
          const bowlerStats = scorecards[bowlingTeam].bowling[bowler];
          bowlerStats.runsConceded += totalRuns;
          if (isLegal) {
            bowlerStats.balls += 1;
          }
          if (
            event.type === "wicket" &&
            event.extra_type !== "no-ball-extra" &&
            event.wicketType !== "run-out"
          ) {
            bowlerStats.wickets += 1;
          }
        }
      });
    });
  });
  return scorecards;
};

const LoadingOverlay: React.FC<{ isLoading: boolean }> = ({ isLoading }) =>
  isLoading ? (
    <Box
      className="app-score-shell"
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
  onHomeNavigate: () => void;
  onShare: () => void;
  onReset: () => void;
  onShowHistory: () => void;
  onShowPlayerScorecard?: () => void;
  onShowPlayerPreferences?: () => void;
  isShareModalOpen: boolean;
  shareUrl: string;
  setShareModalOpen: (v: boolean) => void;
  onEndInning: (() => void) | undefined;
  onEndGame: (() => void) | undefined;
}> = ({
  gameId,
  onHomeNavigate,
  onShare,
  onReset,
  onShowHistory,
  onShowPlayerScorecard,
  onShowPlayerPreferences,
  isShareModalOpen,
  shareUrl,
  setShareModalOpen,
  onEndInning,
  onEndGame,
}) => (
  <Box sx={{ width: "100%", position: "relative", left: 0 }}>
    <AppBar
      onHomeNavigate={onHomeNavigate}
      onShare={onShare}
      onReset={onReset}
      onShowHistory={onShowHistory}
      onShowPlayerScorecard={onShowPlayerScorecard}
      onShowPlayerPreferences={onShowPlayerPreferences}
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
  currentStriker?: {
    name: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
  };
  currentBowler?: {
    name: string;
    balls: number;
    runsConceded: number;
    wickets: number;
  };
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
  currentStriker,
  currentBowler,
  handleEventNew,
  undoLastEvent,
}) => {
  const handleEventNewRef = useRef(handleEventNew);
  const undoLastEventRef = useRef(undoLastEvent);

  useEffect(() => {
    handleEventNewRef.current = handleEventNew;
  }, [handleEventNew]);

  useEffect(() => {
    undoLastEventRef.current = undoLastEvent;
  }, [undoLastEvent]);

  const stableHandleEvent = useCallback(
    (type: BallEvent["type"], value: number) => {
      handleEventNewRef.current(type, value);
    },
    []
  );
  const stableUndo = useCallback(() => {
    undoLastEventRef.current();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 600,
        px: { xs: 1, sm: 2 },
        mt: 1,
        pb: {
          xs: "calc(205px + env(safe-area-inset-bottom, 0px))",
          sm: 20,
        },
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box className="app-score-block" sx={{ width: "100%", mb: 1 }}>
        <ScoreDisplay
          score={score}
          wickets={wickets}
          overs={Number(`${currentOver}.${currentBallOfOver}`)}
          targetOvers={targetOvers}
          targetScore={targetScore}
          remainingBalls={remainingBalls}
          teamName={targetScore ? teams[1] : teams[0]}
          currentStriker={currentStriker}
          currentBowler={currentBowler}
        />
      </Box>
      <Box
        className="app-recent-events-block"
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          mb: { xs: 1.5, sm: 2 },
          pb: { xs: 2.5, sm: 0 },
        }}
      >
        <RecentEvents events={eventsToShow} />
      </Box>
      <Box
        className="app-keypad-dock"
        sx={{
          width: "100%",
          maxWidth: 600,
          position: "fixed",
          left: "50%",
          bottom: { xs: "max(8px, env(safe-area-inset-bottom, 0px))", sm: 12 },
          transform: "translateX(-50%)",
          zIndex: 1200,
          px: { xs: 1, sm: 0 },
          background: "none",
        }}
      >
        <ScoringKeypad onEvent={stableHandleEvent} onUndo={stableUndo} />
      </Box>
    </Box>
  );
};

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
  winningResultText?: string;
  onFinalizeMatch?: (winningTeam: string) => void;
}> = (props) => (
  <>
    {/* TargetOverModal removed: overs input is now in TeamNameModal */}
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
            promptForOpeners: true,
          });
          props.onCloseTargetScoreModal();
        }}
      />
    )}
    {props.isOpenMatchWinnerModal && (
      <MatchWinnerModal
        open={props.isOpenMatchWinnerModal}
        teamName={props.winningTeam}
        resultText={props.winningResultText}
        handleSubmit={() => {
          props.onFinalizeMatch?.(props.winningTeam);
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
        resultText={props.winningResultText}
      />
    )}
  </>
);

const CricketScorer: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const hasAdvancedAccess = useMemo(
    () => isV1Path(location.pathname),
    [location.pathname]
  );
  const singlePlayerModeEnabled = getStoredAppPreferences().singlePlayerModeEnabled;
  const [isLoading, setIsLoading] = useState(webSocketService.isLoading());
  const [isPlayerPreferencesOnlyFlow, setPlayerPreferencesOnlyFlow] =
    useState(false);
  const [score, setScore] = useState(defaultState.score);
  const [targetScore, setTargetScore] = useState(defaultState.targetScore);
  const [wickets, setWickets] = useState(defaultState.wickets);
  const [currentOver, setCurrentOver] = useState(defaultState.currentOver);
  const [currentBallOfOver, setCurrentBallOfOver] = useState(
    defaultState.currentBallOfOver
  );
  const [targetOvers, setTargetOvers] = useState(defaultState.targetOvers);
  const [teams, setTeams] = useState<string[]>(defaultState.teams);
  const [playerRosterByTeam, setPlayerRosterByTeam] =
    useState<PlayerRosterByTeam>({});
  const [activePlayers, setActivePlayers] = useState({
    striker: "",
    nonStriker: "",
    bowler: "",
  });
  const [openingPlayersSelection, setOpeningPlayersSelection] = useState({
    striker: "",
    nonStriker: "",
    bowler: "",
  });
  const [playerPreferencesTrigger, setPlayerPreferencesTrigger] = useState(0);
  const [pendingWicketEvent, setPendingWicketEvent] = useState<{
    value: number;
    extra_type?: "no-ball-extra";
    forcedWicketType?: "bowled" | "caught" | "run-out";
    lockWicketType?: boolean;
  } | null>(null);
  const [pendingNextOverState, setPendingNextOverState] = useState<{
    striker: string;
    nonStriker: string;
    previousBowler: string;
  } | null>(null);
  const [isManualBowlerChange, setIsManualBowlerChange] = useState(false);
  const [teamNameModalOpen, setTeamNameModalOpen] = useState(false);
  const [winningTeam, setWinningTeam] = useState<string>(
    defaultState.winningTeam
  );
  const [remainingBalls, setRemainingBalls] = useState(
    defaultState.remainingBalls
  );


  // Only show AdSenseBanner if there is meaningful match content and match has started
  const hasContent =
    !teamNameModalOpen &&
    teams.every((t) => t && t.trim().length > 0) &&
    targetOvers > 0 &&
    (score > 0 || wickets > 0 || currentOver > 0);
  const [recentEvents, setRecentEvents] = useState<{
    [key: number]: BallEvent[];
  }>({});
  const [recentEventsByTeams, setRecentEventsByTeams] = useState<{
    [team: string]: {
      [key: number]: BallEvent[];
    };
  }>({});
  const [isStateHydrated, setIsStateHydrated] = useState(false);

  const mergedEventsByTeam = useMemo(() => {
    const battingTeam = targetScore ? teams[1] : teams[0];
    return {
      ...recentEventsByTeams,
      ...(battingTeam
        ? {
            [battingTeam]: recentEvents,
          }
        : {}),
    };
  }, [recentEventsByTeams, recentEvents, teams, targetScore]);

  const playerScorecardByTeam = useMemo(
    () => buildScorecardsFromEvents(teams, playerRosterByTeam, mergedEventsByTeam),
    [teams, playerRosterByTeam, mergedEventsByTeam]
  );

  const getMatchSnapshot = useCallback(
    (): ScoreState => ({
      score,
      targetScore,
      wickets,
      currentOver,
      currentBallOfOver,
      targetOvers,
      teams,
      remainingBalls,
      recentEvents,
      recentEventsByTeams: mergedEventsByTeam,
      winningTeam,
      playerRosterByTeam,
      playerScorecardByTeam,
      activePlayers,
    }),
    [
      score,
      targetScore,
      wickets,
      currentOver,
      currentBallOfOver,
      targetOvers,
      teams,
      remainingBalls,
      recentEvents,
      mergedEventsByTeam,
      winningTeam,
      playerRosterByTeam,
      playerScorecardByTeam,
      activePlayers,
    ]
  );
  const winningResultText = useMemo(() => {
    if (!winningTeam) return "";
    return getWinningSummaryFromSnapshot(getMatchSnapshot(), winningTeam).resultText;
  }, [getMatchSnapshot, winningTeam]);
  // Share modal state (must be inside component)
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isLeaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const gameId = useMemo(() => Math.random().toString(36).substring(2, 8).toUpperCase(), []);
  const hasSentGameEndRef = useRef(false);

  const sendGameEndOnce = useCallback(() => {
    if (!gameId || hasSentGameEndRef.current) return;
    hasSentGameEndRef.current = true;
    webSocketService.send(SocketIOClientEvents.GAME_END, gameId);
  }, [gameId]);


  useEffect(() => {
    if (!gameId) return;
    hasSentGameEndRef.current = false;
    const interval = setInterval(() => {
      setIsLoading(webSocketService.isLoading());
    }, 200);
    webSocketService.send(SocketIOClientEvents.GAME_JOIN, gameId);
    return () => {
      sendGameEndOnce();
      clearInterval(interval);
    };
  }, [gameId, sendGameEndOnce]);

  useEffect(() => {
    if (!winningTeam) {
      setTeamNameModalOpen(targetOvers === 0);
    }
  }, [targetOvers, winningTeam]);

  useNavigationEvents({
    onLeavePage: sendGameEndOnce,
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
  const {
    isOpen: isOpenPlayerScorecardModal,
    onClose: onClosePlayerScorecardModal,
    onOpen: onOpenPlayerScorecardModal,
  } = useDisclosure();
  const {
    isOpen: isOpenOpeningPlayersModal,
    onClose: onCloseOpeningPlayersModal,
    onOpen: onOpenOpeningPlayersModal,
  } = useDisclosure();
  const {
    isOpen: isOpenWicketDetailsModal,
    onClose: onCloseWicketDetailsModal,
    onOpen: onOpenWicketDetailsModal,
  } = useDisclosure();
  const {
    isOpen: isOpenNextBowlerModal,
    onClose: onCloseNextBowlerModal,
    onOpen: onOpenNextBowlerModal,
  } = useDisclosure();

  const battingTeam = targetScore ? teams[1] : teams[0];
  const bowlingTeam = targetScore ? teams[0] : teams[1];
  const battingPlayers = useMemo(
    () => playerRosterByTeam[battingTeam] ?? [],
    [playerRosterByTeam, battingTeam]
  );
  const bowlingPlayers = useMemo(
    () => playerRosterByTeam[bowlingTeam] ?? [],
    [playerRosterByTeam, bowlingTeam]
  );
  const inningAllOutWickets = useMemo(
    () =>
      hasAdvancedAccess
        ? Math.max(
            1,
            singlePlayerModeEnabled ? battingPlayers.length : battingPlayers.length - 1
          )
        : 10,
    [hasAdvancedAccess, battingPlayers.length, singlePlayerModeEnabled]
  );
  const isAllOut = useMemo(
    () => targetOvers > 0 && wickets >= inningAllOutWickets,
    [targetOvers, wickets, inningAllOutWickets]
  );
  const availableIncomingBatters = useMemo(() => {
    const unavailable = new Set([
      activePlayers.striker,
      activePlayers.nonStriker,
    ]);
    return battingPlayers.filter(
      (name) =>
        !unavailable.has(name) &&
        !playerScorecardByTeam[battingTeam]?.batting?.[name]?.out
    );
  }, [battingPlayers, activePlayers.striker, activePlayers.nonStriker, battingTeam, playerScorecardByTeam]);

  const currentStrikerStats = useMemo(() => {
    if (!battingTeam || !activePlayers.striker) return undefined;
    const stats = playerScorecardByTeam[battingTeam]?.batting?.[activePlayers.striker];
    return {
      name: activePlayers.striker,
      runs: stats?.runs ?? 0,
      balls: stats?.balls ?? 0,
      fours: stats?.fours ?? 0,
      sixes: stats?.sixes ?? 0,
    };
  }, [battingTeam, activePlayers.striker, playerScorecardByTeam]);

  const currentBowlerStats = useMemo(() => {
    if (!bowlingTeam || !activePlayers.bowler) return undefined;
    const stats = playerScorecardByTeam[bowlingTeam]?.bowling?.[activePlayers.bowler];
    return {
      name: activePlayers.bowler,
      balls: stats?.balls ?? 0,
      runsConceded: stats?.runsConceded ?? 0,
      wickets: stats?.wickets ?? 0,
    };
  }, [bowlingTeam, activePlayers.bowler, playerScorecardByTeam]);
  const previousOverBowler = useMemo(() => {
    if (currentOver <= 0) return "";
    const previousOverEvents = recentEvents[currentOver - 1] ?? [];
    return previousOverEvents.find((event) => event.bowler)?.bowler ?? "";
  }, [currentOver, recentEvents]);
  const canManualChangeBowler = useMemo(
    () =>
      hasAdvancedAccess &&
      targetOvers > 0 &&
      currentBallOfOver === 0 &&
      !isOpenNextBowlerModal,
    [hasAdvancedAccess, targetOvers, currentBallOfOver, isOpenNextBowlerModal]
  );

  useEffect(() => {
    if (!battingTeam) return;
    setRecentEventsByTeams((prev) => ({
      ...prev,
      [battingTeam]: recentEvents,
    }));
  }, [battingTeam, recentEvents]);

  const sanitizeActivePlayers = useCallback(
    (selection: { striker: string; nonStriker: string; bowler: string }) => {
      const isValidBatter = (name: string) => battingPlayers.includes(name);
      const striker = isValidBatter(selection.striker)
        ? selection.striker
        : battingPlayers[0] ?? "";
      const nonStrikerCandidate = isValidBatter(selection.nonStriker)
        ? selection.nonStriker
        : battingPlayers.find((p) => p !== striker) ?? "";
      const nonStriker =
        nonStrikerCandidate && nonStrikerCandidate !== striker
          ? nonStrikerCandidate
          : battingPlayers.find((p) => p !== striker) ?? "";
      const bowler = bowlingPlayers.includes(selection.bowler)
        ? selection.bowler
        : bowlingPlayers[0] ?? "";
      return { striker, nonStriker, bowler };
    },
    [battingPlayers, bowlingPlayers]
  );

  const initializeActivePlayers = useCallback(
    (nextTargetScore: number, nextTeams: string[], roster: PlayerRosterByTeam) => {
      const nextBattingTeam = nextTargetScore > 0 ? nextTeams[1] : nextTeams[0];
      const nextBowlingTeam = nextTargetScore > 0 ? nextTeams[0] : nextTeams[1];
      const nextBattingPlayers = roster[nextBattingTeam] ?? [];
      const nextBowlingPlayers = roster[nextBowlingTeam] ?? [];
      setActivePlayers({
        striker: nextBattingPlayers[0] ?? "",
        nonStriker: nextBattingPlayers[1] ?? nextBattingPlayers[0] ?? "",
        bowler: nextBowlingPlayers[0] ?? "",
      });
    },
    []
  );

  const promptOpeningPlayers = useCallback(
    (nextTargetScore: number, nextTeams: string[], roster: PlayerRosterByTeam) => {
      const nextBattingTeam = nextTargetScore > 0 ? nextTeams[1] : nextTeams[0];
      const nextBowlingTeam = nextTargetScore > 0 ? nextTeams[0] : nextTeams[1];
      const nextBattingPlayers = roster[nextBattingTeam] ?? [];
      const nextBowlingPlayers = roster[nextBowlingTeam] ?? [];
      setOpeningPlayersSelection({
        striker: nextBattingPlayers[0] ?? "",
        nonStriker: nextBattingPlayers[1] ?? nextBattingPlayers[0] ?? "",
        bowler: nextBowlingPlayers[0] ?? "",
      });
      onOpenOpeningPlayersModal();
    },
    [onOpenOpeningPlayersModal]
  );

  useEffect(() => {
    if (isOpenOpeningPlayersModal) return;
    if (!battingTeam || !bowlingTeam) return;
    const isSingleBatterState =
      singlePlayerModeEnabled && wickets >= Math.max(1, battingPlayers.length - 1);
    const nextStriker =
      battingPlayers.includes(activePlayers.striker) && activePlayers.striker
        ? activePlayers.striker
        : battingPlayers[0] ?? "";
    const nextNonStriker = isSingleBatterState
      ? ""
      : battingPlayers.includes(activePlayers.nonStriker) && activePlayers.nonStriker
      ? activePlayers.nonStriker
      : battingPlayers.find((p) => p !== nextStriker) ?? "";
    const nextBowler =
      bowlingPlayers.includes(activePlayers.bowler) && activePlayers.bowler
        ? activePlayers.bowler
        : bowlingPlayers[0] ?? "";
    if (
      nextStriker !== activePlayers.striker ||
      nextNonStriker !== activePlayers.nonStriker ||
      nextBowler !== activePlayers.bowler
    ) {
      setActivePlayers({
        striker: nextStriker,
        nonStriker: nextNonStriker,
        bowler: nextBowler,
      });
    }
  }, [
    activePlayers.bowler,
    activePlayers.nonStriker,
    activePlayers.striker,
    battingPlayers,
    bowlingPlayers,
    battingTeam,
    bowlingTeam,
    isOpenOpeningPlayersModal,
    singlePlayerModeEnabled,
    wickets,
  ]);

  const canRemovePlayer = useCallback(
    (team: string, player: string) => {
      const battingStats = playerScorecardByTeam[team]?.batting?.[player];
      const bowlingStats = playerScorecardByTeam[team]?.bowling?.[player];
      const hasPlayed = (battingStats?.balls ?? 0) > 0 || (bowlingStats?.balls ?? 0) > 0;
      const isActive =
        activePlayers.striker === player ||
        activePlayers.nonStriker === player ||
        activePlayers.bowler === player;
      return !hasPlayed && !isActive;
    },
    [activePlayers, playerScorecardByTeam]
  );

  const addPlayer = useCallback((team: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPlayerRosterByTeam((prev) => {
      const current = prev[team] ?? [];
      if (current.includes(trimmed)) return prev;
      const next = { ...prev, [team]: [...current, trimmed] };
      const map = getSavedPlayersMap();
      map[team] = next[team];
      localStorage.setItem(LOCAL_PLAYERS_KEY, JSON.stringify(map));
      return next;
    });
  }, []);

  const removePlayer = useCallback(
    (team: string, name: string) => {
      if (!canRemovePlayer(team, name)) return;
      setPlayerRosterByTeam((prev) => {
        const current = prev[team] ?? [];
        const nextPlayers = current.filter((p) => p !== name);
        if (nextPlayers.length < 2) return prev;
        const next = { ...prev, [team]: nextPlayers };
        const map = getSavedPlayersMap();
        map[team] = nextPlayers;
        localStorage.setItem(LOCAL_PLAYERS_KEY, JSON.stringify(map));
        return next;
      });
    },
    [canRemovePlayer]
  );

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

  useEffect(() => {
    if (!isAllOut) return;
    if (targetScore) {
      if (score >= targetScore) return;
      if (score === targetScore - 1) {
        setWinningTeam("Tied");
      } else {
        setWinningTeam(teams[0]);
      }
      onOpenMatchWinnerModal();
      return;
    }
    onOpenTargetScoreModal();
  }, [
    isAllOut,
    onOpenMatchWinnerModal,
    onOpenTargetScoreModal,
    score,
    targetScore,
    teams,
  ]);

  const processEvent = (
    type: BallEvent["type"],
    value: number,
    extra_type?: "no-ball-extra",
    options?: {
      outBatsman?: string;
      incomingBatsman?: string;
      wicketType?: "bowled" | "caught" | "run-out";
      dismissalBy?: string;
    }
  ) => {
    const isExtra =
      ["wide", "no-ball"].includes(type) || extra_type === "no-ball-extra";
    const isOverBall = !isExtra && currentBallOfOver + 1 >= 6;

    const newEvent: BallEvent = {
      type,
      extra_type,
      value,
      striker: activePlayers.striker,
      nonStriker: activePlayers.nonStriker,
      bowler: activePlayers.bowler,
      battingTeam,
      bowlingTeam,
      outBatsman: options?.outBatsman,
      wicketType: options?.wicketType,
      dismissalBy: options?.dismissalBy,
    };
    const updatedEvents = recentEvents[currentOver] ?? [];
    const newEvents = [...updatedEvents, newEvent];
    setRecentEvents((prev) => ({ ...prev, [currentOver]: newEvents }));

    if (!isExtra) {
      if (isOverBall) {
        setCurrentOver((prev) => prev + 1);
        setCurrentBallOfOver(0);
      } else {
        setCurrentBallOfOver((prev) => prev + 1);
      }
      if (targetScore) {
        setRemainingBalls((prev) => prev - 1);
      }
    }

    if (["run", "wide", "no-ball", "no-ball-extra"].includes(type)) {
      const eventValue = extra_type === "no-ball-extra" ? value + 1 : value;
      setScore((prev) => prev + eventValue);
    }
    if (type === "wicket") {
      setWickets((prev) => prev + 1);
      const wicketScoreDelta =
        extra_type === "no-ball-extra" ? value + 1 : value;
      if (wicketScoreDelta > 0) {
        setScore((prev) => prev + wicketScoreDelta);
      }
    }

    const strikeRuns =
      type === "wide"
        ? Math.max(0, value - 1)
        : extra_type === "no-ball-extra"
        ? value
        : value;
    let nextStriker = activePlayers.striker;
    let nextNonStriker = activePlayers.nonStriker;

    if (type === "wicket" && options?.outBatsman && options?.incomingBatsman) {
      if (options.outBatsman === activePlayers.striker) {
        nextStriker = options.incomingBatsman;
      } else {
        nextNonStriker = options.incomingBatsman;
      }
    } else if (
      type === "wicket" &&
      options?.outBatsman &&
      singlePlayerModeEnabled &&
      !options?.incomingBatsman
    ) {
      if (options.outBatsman === activePlayers.striker) {
        nextStriker = activePlayers.nonStriker;
      }
      nextNonStriker = "";
      if (!nextStriker) {
        nextStriker = activePlayers.striker;
      }
    }

    if (strikeRuns % 2 === 1 && nextNonStriker) {
      const tmp = nextStriker;
      nextStriker = nextNonStriker;
      nextNonStriker = tmp;
    }

    if (isOverBall && hasAdvancedAccess) {
      const tmp = nextStriker;
      if (nextNonStriker) {
        nextStriker = nextNonStriker;
        nextNonStriker = tmp;
      }
      setPendingNextOverState({
        striker: nextStriker,
        nonStriker: nextNonStriker,
        previousBowler: activePlayers.bowler,
      });
      setIsManualBowlerChange(false);
      setActivePlayers({
        striker: nextStriker,
        nonStriker: nextNonStriker,
        bowler: "",
      });
      onOpenNextBowlerModal();
    } else {
      setActivePlayers((prev) => ({
        ...prev,
        striker: nextStriker,
        nonStriker: nextNonStriker,
      }));
    }
  };

  const handleEventNew = (
    type: BallEvent["type"],
    value: number,
    extra_type?: "no-ball-extra"
  ): void => {
    if (!targetOvers) {
      onOpen();
      return;
    }
    if (currentOver === targetOvers) {
      return;
    }
    if (isAllOut) {
      return;
    }
    if (
      hasAdvancedAccess &&
      (!activePlayers.striker ||
        (!singlePlayerModeEnabled && !activePlayers.nonStriker) ||
        !activePlayers.bowler)
    ) {
      return;
    }
    if (
      hasAdvancedAccess &&
      (
        !battingPlayers.includes(activePlayers.striker) ||
        (!!activePlayers.nonStriker && !battingPlayers.includes(activePlayers.nonStriker)) ||
        (!!activePlayers.nonStriker && activePlayers.striker === activePlayers.nonStriker) ||
        !bowlingPlayers.includes(activePlayers.bowler)
      )
    ) {
      return;
    }
    if (type === "no-ball") {
      onOpenNoBallModal();
      return;
    }
    if (type === "wicket" && hasAdvancedAccess) {
      const runOutShortcut =
        extra_type === "no-ball-extra" || (value > 0 && extra_type !== "no-ball-extra");
      setPendingWicketEvent({
        value,
        extra_type,
        forcedWicketType: runOutShortcut ? "run-out" : undefined,
        lockWicketType: runOutShortcut,
      });
      onOpenWicketDetailsModal();
      return;
    }
    processEvent(type, value, extra_type);
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
      const wicketScoreDelta =
        lastEvent.extra_type === "no-ball-extra"
          ? lastEvent.value + 1
          : lastEvent.value;
      if (wicketScoreDelta > 0) {
        setScore((prev) => Math.max(0, prev - wicketScoreDelta));
      }
    }
  };

  const resetAllState = ({
    resetTargetOvers,
    resetTargetScore,
    resetRemainingBalls,
    resetTeamNames,
    promptForOpeners = false,
  }: {
    resetTargetOvers?: number;
    resetTargetScore?: number;
    resetRemainingBalls?: number;
    resetTeamNames?: string[];
    promptForOpeners?: boolean;
  }) => {
    setScore(0);
    setWickets(0);
    setCurrentOver(0);
    setCurrentBallOfOver(0);
    setRecentEvents({});
    setWinningTeam("");
    setPendingWicketEvent(null);
    setPendingNextOverState(null);
    onCloseWicketDetailsModal();
    onCloseNextBowlerModal();
    if (resetTeamNames !== undefined) {
      setTeams(resetTeamNames);
    }
    if (resetTargetOvers !== undefined) {
      setTargetOvers(resetTargetOvers);
    }
    if (resetTargetScore !== undefined) {
      setTargetScore(resetTargetScore);
      if (!resetTargetScore) {
        setRecentEventsByTeams({});
        setRemainingBalls(0);
      }
    }
    if (resetRemainingBalls !== undefined) {
      setRemainingBalls(resetRemainingBalls);
    }
    const nextTargetScore = resetTargetScore ?? targetScore;
    const nextTeams = resetTeamNames ?? teams;
    if (hasAdvancedAccess) {
      initializeActivePlayers(nextTargetScore, nextTeams, playerRosterByTeam);
    } else {
      setActivePlayers({ striker: "", nonStriker: "", bowler: "" });
    }
    if (promptForOpeners && hasAdvancedAccess) {
      promptOpeningPlayers(nextTargetScore, nextTeams, playerRosterByTeam);
    }
  };

  const eventsToShow =
    (recentEvents[currentOver] ?? []).length > 0
      ? recentEvents[currentOver]
      : currentOver > 0
      ? recentEvents[currentOver - 1]
      : [];

  const handleStateUpdate = useCallback(
    (data: ScoreState) => {
      webSocketService.send(SocketIOClientEvents.GAME_SCORE_UPDATE, {
        ...data,
        gameId,
      });
    },
    [gameId]
  );

  useEffect(() => {
    // Create Game should always start from setup modal (teams/overs/toss),
    // not auto-resume previously saved match state.
    setIsStateHydrated(true);
  }, []);

  useEffect(() => {
    if (!isStateHydrated) return;
    const snapshot = getMatchSnapshot();
    localStorage.setItem(LOCAL_MATCH_STATE_KEY, JSON.stringify(snapshot));
    handleStateUpdate(snapshot);
  }, [getMatchSnapshot, handleStateUpdate, isStateHydrated]);

  if (!gameId) {
    return null;
  }

  if (teamNameModalOpen) {
    return (
      <>
        <MetaHelmet
          pageTitle="Create Cricket Scorecard"
          canonical="/create-game"
          description="Create a cricket match, set overs and teams, then score every ball live with wickets, extras, and shareable match links."
          keywords="create cricket scorecard, cricket scoring app, track cricket score live, cricket overs tracker, cricket match scoring"
        />
        <TeamNameModal
          open={teamNameModalOpen}
          requirePlayerRoster={hasAdvancedAccess}
          onSubmit={(team1, team2, overs, team1Players, team2Players) => {
            setTeams([team1, team2]);
            const roster = {
              [team1]: team1Players,
              [team2]: team2Players,
            };
            setPlayerRosterByTeam(roster);
            setTargetOvers(overs);
            setTargetScore(0);
            setRecentEvents({});
            setRecentEventsByTeams({});
            setScore(0);
            setWickets(0);
            setCurrentOver(0);
            setCurrentBallOfOver(0);
            setRemainingBalls(0);
            setActivePlayers({ striker: "", nonStriker: "", bowler: "" });
            if (hasAdvancedAccess) {
              promptOpeningPlayers(0, [team1, team2], roster);
            }
            setTeamNameModalOpen(false);
          }}
          />
      </>
    );
  }

  return (
    <>
      <MetaHelmet
        pageTitle="Create Cricket Scorecard"
        canonical="/create-game"
        description="Create a cricket match, set overs and teams, then score every ball live with wickets, extras, and shareable match links."
        keywords="create cricket scorecard, cricket scoring app, track cricket score live, cricket overs tracker, cricket match scoring"
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
          justifyContent: "flex-start",
          background:
            "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        <LoadingOverlay isLoading={isLoading} />
        <AppBarSection
          gameId={gameId}
          onHomeNavigate={() => {
            const shouldPromptLeave = score > 0 || wickets > 0 || targetOvers > 0;
            if (shouldPromptLeave) {
              setLeaveConfirmOpen(true);
              return;
            }
            sendGameEndOnce();
            window.location.replace(toCurrentVersionPath(location.pathname, "/"));
          }}
          onShare={() => {
            const publicBaseUrl = (
              process.env.REACT_APP_SITE_URL || "https://www.cricket-score-counter.com"
            ).replace(/\/+$/, "");
            const isNativeWebView = (() => {
              const ua =
                navigator.userAgent ||
                navigator.vendor ||
                (window as any).opera ||
                "";
              return (
                /wv|WebView|; wv\)|capacitor/i.test(ua) ||
                "ReactNativeWebView" in window ||
                "cordova" in window ||
                window.location.protocol === "capacitor:" ||
                ((window as any).Capacitor?.isNativePlatform?.() ?? false)
              );
            })();
            const shareBaseUrl = isNativeWebView
              ? publicBaseUrl
              : window.location.origin;
            const shareData = {
              title: "Cricket Score Counter",
              text: "Join my cricket game!",
              url: `${shareBaseUrl}${toCurrentVersionPath(
                location.pathname,
                `/join-game/${gameId}`
              )}`,
            };
            if (navigator.share && !isNativeWebView) {
              navigator
                .share(shareData)
                .then(() => {
                  /* Game link shared successfully */
                })
                .catch((err) => console.error("Error sharing game link:", err));
            } else if (isNativeWebView) {
              setShareUrl(shareData.url);
              setShareModalOpen(true);
            } else {
              if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard
                  .writeText(shareData.url)
                  .then(() => alert(t("Game link copied to clipboard!")))
                  .catch((err) =>
                    alert(
                      t("Error copying game link. Please copy manually: ") +
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
                  alert(t("Game link copied to clipboard!"));
                } catch (err) {
                  alert(
                    t("Error copying game link. Please copy manually: ") +
                      shareData.url
                  );
                }
              }
            }
          }}
          onReset={onOpenResetScoreModal}
          onShowHistory={onOpenHistoryModal}
          onShowPlayerScorecard={
            hasAdvancedAccess
              ? () => {
                  setPlayerPreferencesOnlyFlow(false);
                  setPlayerPreferencesTrigger(0);
                  onOpenPlayerScorecardModal();
                }
              : undefined
          }
          onShowPlayerPreferences={
            hasAdvancedAccess
              ? () => {
                  setPlayerPreferencesOnlyFlow(true);
                  setPlayerPreferencesTrigger((prev) => prev + 1);
                  onOpenPlayerScorecardModal();
                }
              : undefined
          }
          isShareModalOpen={isShareModalOpen}
          shareUrl={shareUrl}
          setShareModalOpen={setShareModalOpen}
          onEndInning={
            targetOvers > 0 && !targetScore
              ? () => {
                  resetAllState({
                    resetTargetScore: score + 1,
                    resetTargetOvers: targetOvers,
                    resetRemainingBalls: targetOvers * 6,
                    promptForOpeners: true,
                  });
                }
              : undefined
          }
          onEndGame={() => {
            resetAllState({});
            navigate(toCurrentVersionPath(location.pathname, "/"));
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
          currentStriker={hasAdvancedAccess ? currentStrikerStats : undefined}
          currentBowler={hasAdvancedAccess ? currentBowlerStats : undefined}
          handleEventNew={handleEventNew}
          undoLastEvent={undoLastEvent}
        />
        {hasAdvancedAccess && (
          <>
            <PlayerScorecardModal
              open={isOpenPlayerScorecardModal}
              onClose={() => {
                setPlayerPreferencesOnlyFlow(false);
                setPlayerPreferencesTrigger(0);
                onClosePlayerScorecardModal();
              }}
              teams={teams}
              targetScore={targetScore}
              playerRosterByTeam={playerRosterByTeam}
              playerScorecardByTeam={playerScorecardByTeam}
              striker={activePlayers.striker}
              bowler={activePlayers.bowler}
              editable
              onChangeBowler={() => {
                if (!canManualChangeBowler) return;
                setIsManualBowlerChange(true);
                onOpenNextBowlerModal();
              }}
              canChangeBowler={canManualChangeBowler}
              onAddPlayer={addPlayer}
              onRemovePlayer={removePlayer}
              canRemovePlayer={canRemovePlayer}
              hidePreferencesButton
              openPreferencesTrigger={playerPreferencesTrigger}
              preferencesOnly={isPlayerPreferencesOnlyFlow}
              onClosePreferencesOnly={() => {
                setPlayerPreferencesOnlyFlow(false);
                setPlayerPreferencesTrigger(0);
                onClosePlayerScorecardModal();
              }}
            />
            <OpeningPlayersModal
              open={isOpenOpeningPlayersModal}
              battingTeam={battingTeam}
              bowlingTeam={bowlingTeam}
              battingPlayers={battingPlayers}
              bowlingPlayers={bowlingPlayers}
              striker={openingPlayersSelection.striker}
              nonStriker={openingPlayersSelection.nonStriker}
              bowler={openingPlayersSelection.bowler}
              onChange={(selection) =>
                setOpeningPlayersSelection(sanitizeActivePlayers(selection))
              }
              onConfirm={() => {
                const sanitized = sanitizeActivePlayers(openingPlayersSelection);
                if (
                  sanitized.striker &&
                  (sanitized.nonStriker || singlePlayerModeEnabled) &&
                  sanitized.bowler &&
                  (singlePlayerModeEnabled || sanitized.striker !== sanitized.nonStriker)
                ) {
                  setOpeningPlayersSelection(sanitized);
                  setActivePlayers(sanitized);
                  onCloseOpeningPlayersModal();
                }
              }}
            />
            <WicketDetailsModal
              open={isOpenWicketDetailsModal}
              striker={activePlayers.striker}
              nonStriker={activePlayers.nonStriker}
              fieldingPlayers={bowlingPlayers}
              availableIncomingBatters={availableIncomingBatters}
              allowSinglePlayerMode={singlePlayerModeEnabled}
              initialWicketType={pendingWicketEvent?.forcedWicketType}
              lockWicketType={pendingWicketEvent?.lockWicketType}
              onConfirm={({ outBatsman, incomingBatsman, wicketType, dismissalBy }) => {
                if (!pendingWicketEvent) return;
                const effectiveWicketType =
                  pendingWicketEvent.forcedWicketType ?? wicketType;
                const hasIncoming = Boolean(incomingBatsman);
                if (
                  ![activePlayers.striker, activePlayers.nonStriker].includes(outBatsman) ||
                  (hasIncoming && !battingPlayers.includes(incomingBatsman as string)) ||
                  (hasIncoming &&
                    (incomingBatsman === activePlayers.striker ||
                      incomingBatsman === activePlayers.nonStriker))
                ) {
                  return;
                }
                if (
                  (effectiveWicketType === "caught" || effectiveWicketType === "run-out") &&
                  (!dismissalBy || !bowlingPlayers.includes(dismissalBy))
                ) {
                  return;
                }
                processEvent(
                  "wicket",
                  pendingWicketEvent.value,
                  pendingWicketEvent.extra_type,
                  {
                    outBatsman,
                    incomingBatsman,
                    wicketType: effectiveWicketType,
                    dismissalBy,
                  }
                );
                setPendingWicketEvent(null);
                onCloseWicketDetailsModal();
                onCloseNoBallModal();
              }}
              onClose={() => {
                setPendingWicketEvent(null);
                onCloseWicketDetailsModal();
              }}
            />
            <NextBowlerModal
              open={isOpenNextBowlerModal}
              bowlers={bowlingPlayers}
              currentBowler={
                isManualBowlerChange
                  ? previousOverBowler
                  : pendingNextOverState?.previousBowler ?? activePlayers.bowler
              }
              onConfirm={(nextBowler) => {
                const previousBowler =
                  isManualBowlerChange
                    ? previousOverBowler
                    : pendingNextOverState?.previousBowler ?? activePlayers.bowler;
                if (
                  !bowlingPlayers.includes(nextBowler) ||
                  nextBowler === previousBowler
                ) {
                  return;
                }
                setActivePlayers((prev) => ({
                  striker: pendingNextOverState?.striker ?? prev.striker,
                  nonStriker: pendingNextOverState?.nonStriker ?? prev.nonStriker,
                  bowler: nextBowler,
                }));
                setPendingNextOverState(null);
                setIsManualBowlerChange(false);
                onCloseNextBowlerModal();
              }}
            />
          </>
        )}
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
          winningResultText={winningResultText}
          onFinalizeMatch={(winner) => {
            const snapshot = getMatchSnapshot();
            saveCompletedMatch(
              {
                ...snapshot,
                winningTeam: winner,
              },
              winner
            );
          }}
        />
        <ConfirmDialog
          open={isLeaveConfirmOpen}
          title="Unsaved changes"
          content="You have unsaved changes. Are you sure you want to leave?"
          cancelText="Stay"
          confirmText="Leave"
          onClose={() => setLeaveConfirmOpen(false)}
          onConfirm={() => {
            setLeaveConfirmOpen(false);
            sendGameEndOnce();
            window.location.replace(toCurrentVersionPath(location.pathname, "/"));
          }}
        />
      </Box>
    </>
  );
};

export default CricketScorer;
