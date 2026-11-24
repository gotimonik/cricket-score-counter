"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { EmojiEventsRounded, ReplayRounded } from "@mui/icons-material";
import { API_ROOT_URL } from "../services/AuthService";
import LoadingOverlay from "./LoadingOverlay";
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
        liveDataReceivedRef.current = true;
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
  }, [webSocketService, connectionKey, cacheKey]);

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
      />
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
        {gameId && !hasScoreData && (connectionError || waitingTooLong) ? (
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
              width: "100%",
              maxWidth: 940,
              mt: { xs: 1.5, sm: 2 },
              px: { xs: 1.5, sm: 2 },
              py: 1.25,
              borderRadius: 3,
              background: "rgba(255,255,255,0.94)",
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
            width: "100%",
            maxWidth: 940,
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
            matchLengthMode={matchLengthMode}
            totalBalls={totalBalls}
            targetScore={targetScore}
            remainingBalls={remainingBalls}
            teamName={targetScore ? teams[1] : teams[0]}
            currentStriker={currentStrikerStats}
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
