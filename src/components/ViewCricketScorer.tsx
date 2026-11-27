"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Snackbar, Typography } from "@mui/material";
import {
  EmojiEventsRounded,
  HomeRounded,
  ReplayRounded,
  SensorsRounded,
  WifiOffRounded,
} from "@mui/icons-material";
import { API_ROOT_URL } from "../services/AuthService";
import LoadingOverlay from "./LoadingOverlay";
import BackToListButton from "./BackToListButton";
import ShareSheet from "./share/ShareSheet";
import { matchStoryCard } from "../utils/shareCards";
import { APP_URL } from "../utils/constant";
import ScoreDisplay from "./ScoreDisplay";
import { getLivePartnership } from "./PartnershipStrip";
import RecentEvents from "./RecentEvents";
import { useDisclosure } from "../hooks/useDisclosure";
import AppBar from "./AppBar";
import HistoryModal from "../modals/HistoryModal";
import WebSocketService from "../services/WebSocketService";
import { SocketIOClientEvents, SocketIOServerEvents } from "../utils/constant";
import { getBallsPerOver, ScoreState } from "../types/cricket";
import {
  decodeScoreStateWire,
  type ScoreStateWirePayload,
} from "../utils/scoreStateWire";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LAST_JOINED_GAME_ID_KEY, normalizeGameId } from "../utils/gameId";
import MatchWinnerModal from "../modals/MatchWinnerModal";
import TargetScoreModal from "../modals/TargetScoreModal";
import MetaHelmet from "./MetaHelmet";
import PlayerScorecardModal from "../modals/PlayerScorecardModal";
import PlayerScorecardPanel from "./PlayerScorecardPanel";
import { getWinningSummaryFromSnapshot } from "../utils/completedMatches";
import { useTranslation } from "react-i18next";
import { statCardBackground } from "../utils/cardSurface";

/** GET /api/v1/live/:code — a tournament match the organizer shared. */
type PublicLiveMatch = {
  code: string;
  status: "scheduled" | "in_progress" | "completed";
  tournamentName: string;
  team1: { name: string; logoUrl: string };
  team2: { name: string; logoUrl: string };
  winnerTeamName: string;
  resultText: string;
  snapshot: unknown;
};

const LOCAL_VIEW_STATE_KEY = "cricket-view-score-state";

/** GAME_STATUS from the live server: is this match still being scored? */
type LiveStatus = "live" | "scorer_offline" | "ended" | "not_found";
type LiveStatusPayload = { gameId?: string; status?: LiveStatus; reason?: string };

/** A state right after the scorer pressed "Reset" / started a new match. */
const isFreshMatchState = (s: Partial<ScoreState>) =>
  !s.score &&
  !s.wickets &&
  !s.currentOver &&
  !s.currentBallOfOver &&
  !s.targetScore &&
  !s.winningTeam &&
  !(s.superOvers && s.superOvers.length) &&
  Object.values(s.recentEventsByTeams ?? {}).every((overs) =>
    Object.values(overs ?? {}).every((balls) => !balls || balls.length === 0),
  );

const hasMatchProgress = (s: Partial<ScoreState>) =>
  Boolean(s.score || s.wickets || s.currentOver || s.currentBallOfOver || s.targetScore || s.winningTeam);
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
  const { t } = useTranslation();
  const sectionGap = { xs: 1.5, sm: 2 };
  const location = useLocation();
  // Created per component instance (not at module scope) so the app's
  // idle-time route preloader can warm this module's JS chunk without
  // opening a socket connection just by importing the file. A real
  // connection now only happens once this component actually mounts, and
  // it's closed again on unmount.
  const webSocketService = useMemo(() => new WebSocketService(), []);
  useEffect(() => {
    return () => {
      webSocketService.close();
    };
  }, [webSocketService]);
  const [isLoading, setIsLoading] = useState(webSocketService.isLoading());
  const [scoreState, setScoreState] = useState<ScoreState>(defaultScoreState);

  const { gameId: rawGameId } = useParams();
  const navigate = useNavigate();
  // Game IDs are upper case; accept links typed or shared in lower case.
  const gameId = rawGameId ? normalizeGameId(rawGameId) : rawGameId;
  useEffect(() => {
    if (rawGameId && gameId && rawGameId !== gameId) {
      navigate(`/join-game/${encodeURIComponent(gameId)}`, { replace: true });
    }
  }, [rawGameId, gameId, navigate]);
  useEffect(() => {
    if (!gameId) return;
    try {
      localStorage.setItem(LAST_JOINED_GAME_ID_KEY, gameId);
    } catch {
      // ignore
    }
  }, [gameId]);
  const matchCanonicalPath =
    location.pathname || (gameId ? `/join-game/${gameId}` : "/join-game");

  // Cached last-known score, kept per game so opening a different Game ID
  // never flashes another match's score.
  const cacheKey = gameId ? `${LOCAL_VIEW_STATE_KEY}:${gameId}` : "";
  const [connectionKey, setConnectionKey] = useState(0);
  const [hasScoreData, setHasScoreData] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [waitingTooLong, setWaitingTooLong] = useState(false);
  const [liveStatus, setLiveStatus] = useState<LiveStatus | null>(null);
  const [liveStatusReason, setLiveStatusReason] = useState("");
  const [resetNotice, setResetNotice] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const lastStateRef = useRef<ScoreState | null>(null);
  useEffect(() => {
    setLiveStatus(null);
    setLiveStatusReason("");
    lastStateRef.current = null;
  }, [gameId]);

  useEffect(() => {
    if (!cacheKey) return;
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(cacheKey);
    } catch {
      raw = null;
    }
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
  }, [cacheKey]);

  useEffect(() => {
    if (!gameId) return;
    setIsLoading(true);
    setConnectionError(false);
    setWaitingTooLong(false);
    // Re-sent automatically after every reconnect (e.g. after the phone
    // briefly loses signal), so viewers keep receiving updates.
    webSocketService.sendOnEveryConnect(SocketIOClientEvents.GAME_JOIN, gameId);
    const interval = setInterval(() => {
      setIsLoading(webSocketService.isLoading());
      setConnectionError(webSocketService.hasConnectionError());
    }, 200);
    // No score after a while: the ID may be wrong or the scorer hasn't
    // started yet. Stop implying it's still loading and offer a reload.
    const waitTimer = setTimeout(() => setWaitingTooLong(true), 12000);
    return () => {
      clearInterval(interval);
      clearTimeout(waitTimer);
    };
  }, [gameId, webSocketService, connectionKey]);

  // A live view left open in a background tab (or a backgrounded app) would
  // otherwise download the whole match on every ball for hours. After a
  // minute out of sight we disconnect; coming back reconnects, and the
  // server sends the latest score straight away on re-join.
  useEffect(() => {
    if (!gameId || typeof document === "undefined") return;
    const HIDDEN_DISCONNECT_MS = 60_000;
    let hiddenTimer: number | undefined;
    let paused = false;
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        window.clearTimeout(hiddenTimer);
        hiddenTimer = window.setTimeout(() => {
          paused = true;
          webSocketService.close();
        }, HIDDEN_DISCONNECT_MS);
      } else {
        window.clearTimeout(hiddenTimer);
        if (paused) {
          paused = false;
          setConnectionKey((key) => key + 1);
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.clearTimeout(hiddenTimer);
    };
  }, [gameId, webSocketService]);

  // Tournament matches shared by the organizer ("T" + 6 characters): besides
  // the live socket, load the match from the public API so the page shows
  // the tournament, and the latest saved score (or the final result) when
  // the scorer isn't connected right now.
  const isTournamentCode = Boolean(gameId && /^T[A-Z0-9]{6}$/.test(gameId));
  const [tournamentInfo, setTournamentInfo] = useState<PublicLiveMatch | null>(null);
  const [showingSavedScore, setShowingSavedScore] = useState(false);
  const liveDataReceivedRef = useRef(false);
  useEffect(() => {
    liveDataReceivedRef.current = false;
  }, [gameId]);
  useEffect(() => {
    if (!isTournamentCode || !gameId) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`${API_ROOT_URL}/api/v1/live/${encodeURIComponent(gameId)}`);
        if (!res.ok) return;
        const { match } = (await res.json()) as { match?: PublicLiveMatch };
        if (cancelled || !match) return;
        setTournamentInfo(match);
        const snapshot = match.snapshot as Partial<ScoreState> | null;
        if (snapshot && Array.isArray(snapshot.teams) && !liveDataReceivedRef.current) {
          setScoreState({ ...defaultScoreState, ...snapshot } as ScoreState);
          setHasScoreData(true);
          setWaitingTooLong(false);
          setShowingSavedScore(match.status !== "completed");
        }
      } catch {
        // offline: the live socket (or cached score) still applies
      }
    };
    load();
    // While nobody is scoring live, refresh the saved score now and then
    // (it's updated at the end of every over).
    const timer = window.setInterval(() => {
      if (!liveDataReceivedRef.current && document.visibilityState === "visible") load();
    }, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [gameId, isTournamentCode, connectionKey]);

  const reloadGame = () => {
    webSocketService.close();
    setHasScoreData(false);
    setConnectionKey((key) => key + 1);
  };

  useEffect(() => {
    webSocketService.startListening(
      SocketIOServerEvents.GAME_SCORE_UPDATED,
      (data) => {
        // The scorer now sends a trimmed-down wire payload (see
        // utils/scoreStateWire.ts) to cut bandwidth -- decode it back into a
        // full ScoreState before it touches any component state, so nothing
        // downstream (rendering, localStorage cache) needs to know the wire
        // format is any different than before.
        const parsedPayload =
          typeof data === "string"
            ? (JSON.parse(data) as ScoreStateWirePayload)
            : (data as ScoreStateWirePayload);
        const decoded = decodeScoreStateWire(parsedPayload);
        const nextState = {
          ...defaultScoreState,
          ...decoded,
        };
        // The scorer reset the match (or started a new one) on this code.
        const previous = lastStateRef.current;
        if (previous && hasMatchProgress(previous) && isFreshMatchState(nextState)) {
          setResetNotice(
            previous.winningTeam
              ? t("A new match has started on this code.")
              : t("The scorer reset the match. Showing the new match."),
          );
        }
        lastStateRef.current = nextState;
        liveDataReceivedRef.current = true;
        setLiveStatus("live");
        setLiveStatusReason("");
        setShowingSavedScore(false);
        setScoreState(nextState);
        setHasScoreData(true);
        setWaitingTooLong(false);
        if (cacheKey) {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(nextState));
          } catch {
            // storage full/blocked: live view still works
          }
        }
      },
    );
  }, [webSocketService, connectionKey, cacheKey, t]);

  useEffect(() => {
    const onStatus = (data: unknown) => {
      let payload: LiveStatusPayload;
      try {
        payload = (typeof data === "string" ? JSON.parse(data) : data) as LiveStatusPayload;
      } catch {
        return;
      }
      if (!payload?.status || (payload.gameId && gameId && payload.gameId !== gameId)) return;
      setLiveStatus(payload.status);
      setLiveStatusReason(payload.reason ?? "");
      if (isTournamentCode && (payload.status === "scorer_offline" || payload.status === "ended")) {
        // Tournament codes are permanent: the page falls back to the saved
        // score and picks up live again when scoring resumes.
        liveDataReceivedRef.current = false;
        setShowingSavedScore(true);
      }
      if (payload.status === "ended" || payload.status === "not_found") {
        // Don't bring back a dead match's score the next time this link opens.
        if (cacheKey && !isTournamentCode) {
          try {
            localStorage.removeItem(cacheKey);
          } catch {
            // ignore
          }
        }
      }
    };
    webSocketService.startListening(SocketIOServerEvents.GAME_STATUS, onStatus);
    return () => webSocketService.stopListening(SocketIOServerEvents.GAME_STATUS, onStatus);
    // isTournamentCode is derived from gameId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webSocketService, connectionKey, cacheKey, gameId]);

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
    matchLengthMode,
    totalBalls = 0,
    targetScore,
    remainingBalls,
    teams,
    winningTeam,
    recentEventsByTeams = {},
    playerRosterByTeam = {},
    playerScorecardByTeam = {},
    activePlayers = { striker: "", nonStriker: "", bowler: "" },
  } = scoreState;
  // "By balls" matches use a shorter 5-ball over instead of the standard 6,
  // so bowler figures and the innings-complete check need that same unit.
  const ballsPerOver = getBallsPerOver(matchLengthMode);
  const ballsBowledThisInnings = currentOver * ballsPerOver + currentBallOfOver;
  const isInningsBallsComplete =
    totalBalls > 0 && ballsBowledThisInnings >= totalBalls;
  const battingTeam = targetScore ? teams[1] : teams[0];
  const bowlingTeam = targetScore ? teams[0] : teams[1];
  const currentPartnership = winningTeam
    ? undefined
    : getLivePartnership(
        recentEventsByTeams[battingTeam],
        battingTeam,
        bowlingTeam,
        ballsPerOver,
        activePlayers.striker,
        activePlayers.nonStriker,
      );
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
  const nonStrikerStats = activePlayers.nonStriker
    ? playerScorecardByTeam[battingTeam]?.batting?.[activePlayers.nonStriker]
    : undefined;
  const currentNonStrikerStats = activePlayers.nonStriker
    ? {
        name: activePlayers.nonStriker,
        runs: nonStrikerStats?.runs ?? 0,
        balls: nonStrikerStats?.balls ?? 0,
        fours: nonStrikerStats?.fours ?? 0,
        sixes: nonStrikerStats?.sixes ?? 0,
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
  // Casual codes only live while their scorer is connected: once the server
  // says the match ended (or isn't being scored), stop presenting the last
  // ball as live. Tournament codes fall back to the saved score instead.
  const casualNotLive =
    !isTournamentCode && (liveStatus === "ended" || liveStatus === "not_found");
  const statusCard = (() => {
    if (!gameId) return null;
    const offline = liveStatus === "scorer_offline";
    if (!casualNotLive && !(offline && !isTournamentCode)) return null;
    const finished = Boolean(scoreState.winningTeam);
    const seenScore = hasMatchProgress(scoreState);
    const title = offline
      ? t("Scorer is offline")
      : finished
        ? t("This match has finished")
        : liveStatus === "ended"
          ? t("This match has ended")
          : seenScore
            ? t("This match isn't live anymore")
            : t("No live match with code {{id}}", { id: gameId });
    const body = offline
      ? t("The scorer's connection dropped. The score updates again as soon as they're back.")
      : finished
        ? t("Final score below. Thanks for watching!")
        : liveStatus === "ended" && liveStatusReason === "scorer_left"
          ? t("The scorer closed the match without finishing it, so the score below is the last one sent.")
          : liveStatus === "ended"
            ? t("The scorer left or ended the match. The score below is the last one sent.")
            : seenScore
              ? t("Nobody is scoring it right now. The score below is the last one seen on this device.")
              : t("It may have ended, or the scorer hasn't started yet. This page updates by itself when scoring starts.");
    const tone = offline ? { bg: "#fff8e1", border: "#f0c04f", ink: "#6b4a00" } : { bg: statCardBackground, border: "rgba(12,53,88,0.12)", ink: "#0c3558" };
    return (
      <Box
        role="status"
        data-testid="live-status-card"
        sx={{
          width: "calc(100% - 24px)",
          maxWidth: 620,
          mt: 1.5,
          p: { xs: 1.5, sm: 2 },
          borderRadius: 3,
          background: tone.bg,
          border: `1px solid ${tone.border}`,
          boxShadow: "0 8px 24px rgba(8,26,56,0.18)",
          zIndex: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
          <Box sx={{ color: offline ? "#b07800" : finished ? "#c69214" : "#8a96a3", display: "flex", mt: 0.2 }}>
            {offline ? <WifiOffRounded /> : finished ? <EmojiEventsRounded /> : <SensorsRounded />}
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontWeight: 900, color: tone.ink, fontSize: "calc(16px * var(--app-font-scale, 1))", lineHeight: 1.25 }}>
              {title}
            </Typography>
            <Typography sx={{ color: tone.ink, opacity: 0.85, fontWeight: 600, fontSize: "calc(13.5px * var(--app-font-scale, 1))", mt: 0.4 }}>
              {body}
            </Typography>
          </Box>
        </Box>
        {!offline && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
            <Button
              data-ga-click="ended_game_live_matches"
              variant="contained"
              startIcon={<SensorsRounded />}
              onClick={() => navigate("/explore/live")}
              sx={{
                flex: { xs: "1 1 100%", sm: "0 0 auto" },
                textTransform: "none",
                fontWeight: 800,
                borderRadius: 999,
                color: "#fff",
                background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
              }}
            >
              {t("See live matches")}
            </Button>
            <Button
              data-ga-click="ended_game_join_other"
              variant="outlined"
              onClick={() => navigate("/join-game")}
              sx={{ flex: "1 1 auto", textTransform: "none", fontWeight: 800, borderRadius: 999 }}
            >
              {t("Join another game")}
            </Button>
            <Button
              data-ga-click="ended_game_home"
              variant="outlined"
              startIcon={<HomeRounded />}
              onClick={() => navigate("/")}
              sx={{ flex: "1 1 auto", textTransform: "none", fontWeight: 800, borderRadius: 999 }}
            >
              {t("Home")}
            </Button>
          </Box>
        )}
      </Box>
    );
  })();

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
    if (isInningsBallsComplete && !remainingBalls && !targetScore) {
      // Target balls reached
      // Show target score modal
      onOpenTargetScoreModal();
    } else {
      onCloseTargetScoreModal();
    }
  }, [
    isInningsBallsComplete,
    remainingBalls,
    targetScore,
    onOpenTargetScoreModal,
    onCloseTargetScoreModal,
  ]);

  let eventsToShow: any[] = [];
  let recentEventsStatusMessage: string | undefined;
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
    } else if (currentOver > 0 && currentBallOfOver === 0) {
      recentEventsStatusMessage = t("Over complete. Waiting for next over.");
    }
  }

  console.log("playerScorecardByTeam", playerScorecardByTeam);
  console.log("playerRosterByTeam", playerRosterByTeam);
  console.log("activePlayers", activePlayers);

  return (
    <>
      <MetaHelmet
        pageTitle="Live Cricket Scoreboard"
        canonical={matchCanonicalPath}
        description="Follow this live cricket scoreboard with real-time runs, wickets, overs, and batting or bowling updates."
        keywords="live cricket scoreboard, cricket score live, ball by ball cricket updates, cricket match tracker"
      />
      <AppBar
        gameId={gameId}
        onShowHistory={onOpenHistoryModal}
        onShowPlayerScorecard={onOpenPlayerScorecardModal}
        onShare={gameId ? () => setShareOpen(true) : undefined}
      />
      {gameId && (
        <ShareSheet
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          title="Share live score"
          url={`${APP_URL}/join-game/${gameId}`}
          text="Watch the match live, ball by ball"
          fileName="live-score.png"
          makeImage={() => {
            // teams never rotate: teams[0] bats first, teams[1] chases.
            const chasing = targetScore > 0;
            const overs = `${currentOver}.${currentBallOfOver}`;
            const balls = currentOver * ballsPerOver + currentBallOfOver;
            const crr = balls ? ((score * ballsPerOver) / balls).toFixed(2) : "0.00";
            return matchStoryCard({
              heading: tournamentInfo?.tournamentName || `${teams[0]} vs ${teams[1]}`,
              live: !winningTeam,
              teams: [
                chasing
                  ? { name: teams[0], score: String(targetScore - 1) }
                  : { name: teams[0], score: `${score}/${wickets}`, overs, batting: true },
                chasing
                  ? { name: teams[1], score: `${score}/${wickets}`, overs, batting: true }
                  : { name: teams[1] },
              ],
              status: winningResultText
                ? winningResultText
                : chasing
                  ? `${teams[1]} need ${Math.max(targetScore - score, 0)} runs`
                  : `Current run rate ${crr}`,
              url: `${APP_URL}/join-game/${gameId}`,
            });
          }}
        />
      )}
      {/* Ads disabled on live scoreboard screens to comply with AdSense content policies */}
      <Box
        sx={{
          // Fill the space left under the app bar rather than adding a
          // second full screen height (which caused a needless scrollbar,
          // most visibly on iOS).
          flex: 1,
          minHeight: 0,
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
        <LoadingOverlay
          isLoading={isLoading && !connectionError && !hasScoreData}
          label={t("Connecting to live match…")}
        />
        <BackToListButton
          sx={{ maxWidth: 940, px: { xs: 1.5, sm: 2 }, mt: { xs: 1.25, sm: 1.75 }, mb: { xs: 1, sm: 1.25 } }}
        />
        {statusCard}
        {gameId && !hasScoreData && (connectionError || (waitingTooLong && !casualNotLive)) ? (
          <Box
            role="alert"
            sx={{
              width: "calc(100% - 24px)",
              maxWidth: 560,
              mt: 2,
              p: 2,
              borderRadius: 3,
              background: "rgba(255,255,255,0.96)",
              boxShadow: "0 8px 24px rgba(8,26,56,0.18)",
              textAlign: "center",
              zIndex: 2,
            }}
          >
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 800,
                fontSize: "calc(16px * var(--app-font-scale, 1))",
                mb: 0.5,
              }}
            >
              {connectionError
                ? t("Can't connect to the live score server")
                : t("Waiting for live score for game {{id}}", { id: gameId })}
            </Typography>
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                opacity: 0.85,
                fontSize: "calc(14px * var(--app-font-scale, 1))",
                mb: 1.5,
              }}
            >
              {connectionError
                ? t("Check your internet connection and try again.")
                : t("Check the Game ID is correct, or wait for the scorer to start the match.")}
            </Typography>
            <Button
              data-ga-click="reload_live_game"
              variant="contained"
              startIcon={<ReplayRounded />}
              onClick={reloadGame}
              sx={{
                textTransform: "none",
                fontWeight: 800,
                borderRadius: 999,
                px: 3,
                color: "#fff",
                background:
                  "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
              }}
            >
              {t("Reload game")}
            </Button>
          </Box>
        ) : null}
        {tournamentInfo && (
          <Box
            sx={{
              width: { xs: "calc(100% - 24px)", sm: "calc(100% - 32px)" },
              maxWidth: 940,
              mt: { xs: 1.5, sm: 2 },
              px: { xs: 1.5, sm: 2 },
              py: 1.25,
              borderRadius: 3,
              background: statCardBackground,
              boxShadow: "0 6px 18px rgba(8,26,56,0.14)",
              display: "flex",
              alignItems: "center",
              gap: 1.25,
            }}
          >
            <EmojiEventsRounded sx={{ color: "#c69214", flex: "none" }} />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontWeight: 900, color: "#0c3558", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {tournamentInfo.tournamentName}
              </Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#526274" }}>
                {tournamentInfo.status === "completed" || scoreState.winningTeam
                  ? [t("Final"), tournamentInfo.resultText || (scoreState.winningTeam ? `${scoreState.winningTeam} won` : tournamentInfo.winnerTeamName)]
                      .filter(Boolean)
                      .join(" · ")
                  : showingSavedScore
                    ? t("Score saved at the end of the last over · live updates resume when the scorer is back online")
                    : `${tournamentInfo.team1.name} vs ${tournamentInfo.team2.name}`}
              </Typography>
            </Box>
            {tournamentInfo.status === "in_progress" && !showingSavedScore && !scoreState.winningTeam && (
              <Box
                component="span"
                sx={{ flex: "none", fontSize: 12, fontWeight: 900, color: "#fff", background: "#e0463c", borderRadius: 999, px: 1, py: 0.25 }}
              >
                ● {t("LIVE")}
              </Box>
            )}
          </Box>
        )}
        {/* Sticky ScoreDisplay for mobile */}
        <Box
          className="app-view-score-sticky"
          sx={{
            ...(casualNotLive ? { filter: "grayscale(0.7)", opacity: 0.75 } : {}),
            width: "100%",
            maxWidth: 940,
            minHeight: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: { xs: "sticky", sm: "relative" },
            top: { xs: 0, sm: "unset" },
            zIndex: 9,
            boxSizing: "border-box",
            // Same side margin as the back button and status card above.
            px: { xs: 1.5, sm: 2 },
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
            matchLengthMode={matchLengthMode}
            totalBalls={totalBalls}
            targetScore={targetScore}
            remainingBalls={remainingBalls}
            teamName={targetScore ? teams[1] : teams[0]}
            currentStriker={currentStrikerStats}
            currentNonStriker={currentNonStrikerStats}
            currentBowler={currentBowlerStats}
            partnership={currentPartnership}
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
            px: { xs: 1.5, sm: 2 },
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
                  boxShadow:
                    "0 2px 10px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
                  py: 0.9,
                  px: 1.2,
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    color: "#0d8a52",
                    fontWeight: 800,
                    fontSize: {
                      xs: "calc(14px * var(--app-font-scale, 1))",
                      sm: "calc(15px * var(--app-font-scale, 1))",
                    },
                  }}
                >
                  {winningResultText}
                </Typography>
              </Box>
            </Box>
          ) : null}
          <Box
            sx={{
              width: "100%",
              maxWidth: 940,
              display: "flex",
              justifyContent: "center",
              mb: sectionGap,
            }}
          >
            <RecentEvents
              events={eventsToShow}
              statusMessage={recentEventsStatusMessage}
            />
          </Box>
          {activePlayers?.striker && (
            <Box sx={{ width: "100%", maxWidth: 940, pb: 1.2 }}>
              <PlayerScorecardPanel
                teams={teams}
                targetScore={targetScore}
                matchLengthMode={matchLengthMode}
                playerRosterByTeam={playerRosterByTeam}
                playerScorecardByTeam={playerScorecardByTeam}
                recentEventsByTeams={recentEventsByTeams}
                striker={activePlayers.striker}
                bowler={activePlayers.bowler}
                editable={false}
                showHeader
              />
            </Box>
          )}
        </Box>
        {activePlayers?.striker && (
          <PlayerScorecardModal
            open={isOpenPlayerScorecardModal}
            onClose={onClosePlayerScorecardModal}
            teams={teams}
            targetScore={targetScore}
            matchLengthMode={matchLengthMode}
            playerRosterByTeam={playerRosterByTeam}
            playerScorecardByTeam={playerScorecardByTeam}
            recentEventsByTeams={recentEventsByTeams}
            striker={activePlayers.striker}
            bowler={activePlayers.bowler}
            editable={false}
          />
        )}
        <Snackbar
          open={Boolean(resetNotice)}
          autoHideDuration={5000}
          onClose={() => setResetNotice("")}
          message={resetNotice}
        />
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
