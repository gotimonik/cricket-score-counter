import React, { useEffect, useRef, useState } from "react";
import { Box as MuiBox } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Chip,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Menu,
  MenuItem,
  ListItemText,
  CircularProgress,
  Typography,
  Popover,
} from "@mui/material";
import {
  Add,
  CloseSharp,
  DeleteOutline,
  Edit,
  GroupsRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getStoredAppPreferences } from "../utils/appPreferences";
import AuthService from "../services/AuthService";
import PlayerMatchService from "../services/PlayerMatchService";
import TeamLibraryService from "../services/TeamLibraryService";
import type { SavedPlayerTeam } from "../types/playerTeam";

const CRICKET_TIP_STORAGE_KEY = "seenCricketTip";

const hasSeenCricketTip = () => {
  try {
    if (typeof window === "undefined") return true;
    if (navigator.userAgent === "ReactSnap") return true;
    return window.localStorage.getItem(CRICKET_TIP_STORAGE_KEY) === "1";
  } catch {
    return true;
  }
};

const markCricketTipSeen = () => {
  try {
    window.localStorage.setItem(CRICKET_TIP_STORAGE_KEY, "1");
  } catch {
    // Storage can be unavailable in private modes; keep the setup flow unblocked.
  }
};

interface TeamNameModalProps {
  open: boolean;
  requirePlayerRoster?: boolean;
  // Preselects the Overs/Balls toggle when the modal opens (e.g. a user
  // arriving from the "start a match by balls" announcement). Only read
  // once, on mount/open — after that the toggle is fully user-controlled.
  defaultMatchLengthMode?: "overs" | "balls";
  onSubmit: (
    team1: string,
    team2: string,
    overs: number,
    team1Players: string[],
    team2Players: string[],
    playerRosterEnabled: boolean,
    matchLengthMode: "overs" | "balls",
    totalBalls: number
  ) => void;
}

const TeamNameModal: React.FC<TeamNameModalProps> = ({
  open,
  requirePlayerRoster = false,
  defaultMatchLengthMode,
  onSubmit,
}) => {
  const PREDEFINED_PLAYERS = [
    "Miral",
    "Monik",
    "Rajnikant",
    "Rajani H.",
    "Rajnish",
    "Milan C.",
    "Ashish C.",
    "Bapu",
    "Hardik B.",
    "Jay",
    "Rasik",
    "Sunil",
    "Tushar",
    "Venish",
    "Krishnam",
    "Aata",
    "Rutvik",
    "Anil",
  ];
  const { t } = useTranslation();
  const LOCAL_PLAYERS_KEY = "cricket-team-players";
  const LOCAL_LAST_TEAMS_KEY = "cricket-last-teams";
  const LOCAL_MATCH_STATE_KEY = "cricket-match-state";
  const LOCAL_PLAYER_TOGGLE_KEY = "cricket-players-enabled";
  const MIN_PLAYERS_PER_TEAM = 5;
  const BALLS_STEP = 5;
  const MIN_BALLS = 5;
  const MAX_BALLS = 300;
  const normalizePlayers = (players: string[]) =>
    Array.from(
      new Set(
        players
          .map((p) => p.trim())
          .filter(Boolean)
      )
    );
  const getSavedPlayersMap = (): Record<string, string[]> => {
    try {
      const saved = localStorage.getItem(LOCAL_PLAYERS_KEY);
      return saved ? (JSON.parse(saved) as Record<string, string[]>) : {};
    } catch {
      return {};
    }
  };
  const getSavedTeamNames = (): [string, string] | null => {
    try {
      const savedTeams = localStorage.getItem(LOCAL_LAST_TEAMS_KEY);
      if (savedTeams) {
        const parsed = JSON.parse(savedTeams) as string[];
        if (Array.isArray(parsed) && parsed.length >= 2) {
          const first = parsed[0]?.trim();
          const second = parsed[1]?.trim();
          if (first && second) return [first, second];
        }
      }
    } catch {
      // ignore invalid local data
    }

    try {
      const savedState = localStorage.getItem(LOCAL_MATCH_STATE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState) as { teams?: string[] };
        if (Array.isArray(parsed.teams) && parsed.teams.length >= 2) {
          const first = parsed.teams[0]?.trim();
          const second = parsed.teams[1]?.trim();
          if (first && second) return [first, second];
        }
      }
    } catch {
      // ignore invalid local data
    }

    const savedPlayers = getSavedPlayersMap();
    const savedTeamNames = Object.keys(savedPlayers).filter((name) => name.trim());
    if (savedTeamNames.length >= 2) {
      return [savedTeamNames[0], savedTeamNames[1]];
    }
    return null;
  };
  const [team1, setTeam1] = useState("INDIA A");
  const [team2, setTeam2] = useState("INDIA B");
  const [team1Players, setTeam1Players] = useState<string[]>([]);
  const [team2Players, setTeam2Players] = useState<string[]>([]);
  const [playerRosterEnabled, setPlayerRosterEnabled] = useState(false);
  const [playerModalTeam, setPlayerModalTeam] = useState<"team1" | "team2" | null>(
    null
  );
  const [newPlayerName, setNewPlayerName] = useState("");
  const [playerModalError, setPlayerModalError] = useState("");
  const [overs, setOvers] = useState<number>(8);
  const [matchLengthMode, setMatchLengthMode] = useState<"overs" | "balls">(
    defaultMatchLengthMode ?? "overs"
  );
  const [balls, setBalls] = useState<number>(30);
  const [error, setError] = useState("");
  const [tossResult, setTossResult] = useState<null | "Heads" | "Tails">(null);
  const [tossTeam, setTossTeam] = useState<string>("");
  const [showCoin, setShowCoin] = useState(false);
  const [coinFlipped, setCoinFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTossOptions, setShowTossOptions] = useState(false);
  const [chosenSide, setChosenSide] = useState<null | "Heads" | "Tails">(null);
  // Anchors the toss dropdown to the "Go with Toss" button so it opens right
  // where the user clicked instead of appearing after all the setup fields.
  const goWithTossButtonRef = useRef<HTMLButtonElement | null>(null);
  // Stepper state: 0 = tip, 1 = form
  const [step, setStep] = useState(() => (hasSeenCricketTip() ? 1 : 0));
  const playersSectionRef = React.useRef<HTMLDivElement | null>(null);
  const addPlayerInputRef = useRef<HTMLInputElement | null>(null);
  const showPredefinedPlayers = getStoredAppPreferences().predefinedPlayersEnabled;

  // Logged-in users can pick one of their saved "My Teams" rosters straight
  // from the roster card instead of typing/adding players one by one.
  const [savedTeams, setSavedTeams] = useState<SavedPlayerTeam[]>([]);
  const [savedTeamsStatus, setSavedTeamsStatus] = useState<
    "idle" | "loading" | "loaded" | "error"
  >("idle");
  const [teamPicker, setTeamPicker] = useState<{
    team: "team1" | "team2";
    anchorEl: HTMLElement;
  } | null>(null);
  // Set right after applying a saved team so the name-keyed auto-load effect
  // below doesn't immediately overwrite the roster we just picked.
  const skipNextAutoLoadRef = useRef(false);

  useEffect(() => {
    if (!open || !playerRosterEnabled || !AuthService.isLoggedIn()) return;
    let cancelled = false;
    setSavedTeamsStatus("loading");
    TeamLibraryService.getTeams()
      .then((teams) => {
        if (cancelled) return;
        setSavedTeams(teams);
        setSavedTeamsStatus("loaded");
      })
      .catch(() => {
        if (cancelled) return;
        setSavedTeamsStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [open, playerRosterEnabled]);

  useEffect(() => {
    if (!playerModalTeam) return;
    const timer = window.setTimeout(() => {
      addPlayerInputRef.current?.focus();
    }, 140);
    return () => window.clearTimeout(timer);
  }, [playerModalTeam]);

  const scrollToPlayersSection = () => {
    requestAnimationFrame(() => {
      playersSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  };
  useEffect(() => {
    if (open) {
      setStep(hasSeenCricketTip() ? 1 : 0);
      const savedToggle = localStorage.getItem(LOCAL_PLAYER_TOGGLE_KEY);
      const savedTeamNames = getSavedTeamNames();
      if (savedTeamNames) {
        setTeam1(savedTeamNames[0]);
        setTeam2(savedTeamNames[1]);
      }
      if (savedToggle !== null) {
        setPlayerRosterEnabled(savedToggle === "true");
      } else {
        setPlayerRosterEnabled(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const savedPlayers = getSavedPlayersMap();
    setTeam1Players(normalizePlayers(savedPlayers[team1] ?? []));
    setTeam2Players(normalizePlayers(savedPlayers[team2] ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, team1, team2]);

  useEffect(() => {
    if (!open || !playerRosterEnabled || !AuthService.isLoggedIn()) return;
    if (skipNextAutoLoadRef.current) {
      // A saved team was just explicitly applied for one of the sides --
      // don't let this name-keyed auto-load race in and overwrite it.
      skipNextAutoLoadRef.current = false;
      return;
    }
    const teamsToLoad = [team1.trim(), team2.trim()].filter(Boolean);
    if (!teamsToLoad.length) return;

    let cancelled = false;
    const debounceTimer = window.setTimeout(() => {
      PlayerMatchService.getPlayers(teamsToLoad)
        .then((playersByTeam) => {
          if (cancelled) return;
          const nextTeam1Players = normalizePlayers(playersByTeam[team1] ?? []);
          const nextTeam2Players = normalizePlayers(playersByTeam[team2] ?? []);
          if (nextTeam1Players.length) setTeam1Players(nextTeam1Players);
          if (nextTeam2Players.length) setTeam2Players(nextTeam2Players);
        })
        .catch(() => {
          // Keep setup usable if the saved player API is unavailable.
        });
    }, 450);

    return () => {
      cancelled = true;
      window.clearTimeout(debounceTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, playerRosterEnabled, team1, team2]);

  const handleNextFromTip = () => {
    setStep(1);
    markCricketTipSeen();
  };

  const navigate = useNavigate();
  const validateSetup = () => {
    const nextTeam1Players = normalizePlayers(team1Players);
    const nextTeam2Players = normalizePlayers(team2Players);
    if (!team1.trim() || !team2.trim()) {
      setError(t("Please enter both team names."));
      return null;
    }
    if (
      playerRosterEnabled &&
      (nextTeam1Players.length < MIN_PLAYERS_PER_TEAM ||
        nextTeam2Players.length < MIN_PLAYERS_PER_TEAM)
    ) {
      scrollToPlayersSection();
      setError(
        t("Please add at least {{count}} players for each team.", {
          count: MIN_PLAYERS_PER_TEAM,
        })
      );
      return null;
    }
    if (matchLengthMode === "balls") {
      if (!balls || balls < MIN_BALLS || balls > MAX_BALLS || balls % BALLS_STEP !== 0) {
        setError(
          t("Please enter a valid number of balls ({{min}}-{{max}}, in steps of {{step}}).", {
            min: MIN_BALLS,
            max: MAX_BALLS,
            step: BALLS_STEP,
          })
        );
        return null;
      }
    } else if (!overs || overs < 1 || overs > 50) {
      setError(t("Please enter a valid number of overs (1-50)."));
      return null;
    }

    setError("");
    const totalBalls = matchLengthMode === "balls" ? balls : overs * 6;
    return {
      team1Name: team1.trim(),
      team2Name: team2.trim(),
      oversCount: matchLengthMode === "balls" ? Math.ceil(balls / 5) : overs,
      matchLengthMode,
      totalBalls,
      nextTeam1Players,
      nextTeam2Players,
    };
  };

  const saveSetup = (
    team1Name: string,
    team2Name: string,
    nextTeam1Players: string[],
    nextTeam2Players: string[]
  ) => {
    if (playerRosterEnabled) {
      const map = getSavedPlayersMap();
      map[team1Name] = nextTeam1Players;
      map[team2Name] = nextTeam2Players;
      localStorage.setItem(LOCAL_PLAYERS_KEY, JSON.stringify(map));
    }
    localStorage.setItem(
      LOCAL_LAST_TEAMS_KEY,
      JSON.stringify([team1Name, team2Name])
    );
    if (playerRosterEnabled && AuthService.isLoggedIn()) {
      PlayerMatchService.savePlayers({
        [team1Name]: nextTeam1Players,
        [team2Name]: nextTeam2Players,
      }).catch(() => {
        // Local setup is already saved; backend sync can retry next edit.
      });
    }
  };

  const handleSubmit = () => {
    const setup = validateSetup();
    if (!setup) return;
    saveSetup(
      setup.team1Name,
      setup.team2Name,
      setup.nextTeam1Players,
      setup.nextTeam2Players
    );
    onSubmit(
      setup.team1Name,
      setup.team2Name,
      setup.oversCount,
      playerRosterEnabled ? setup.nextTeam1Players : [],
      playerRosterEnabled ? setup.nextTeam2Players : [],
      playerRosterEnabled,
      setup.matchLengthMode,
      setup.totalBalls
    );
  };

  // Closes the toss dropdown and resets its state, e.g. when the user
  // clicks away/outside or hits the close icon before finishing the toss.
  const handleCancelToss = () => {
    setShowTossOptions(false);
    setShowCoin(false);
    setCoinFlipped(false);
    setTossResult(null);
    setChosenSide(null);
    setIsAnimating(false);
  };

  const handleCoinFlip = () => {
    setIsAnimating(true);
    setTimeout(() => {
      // Simulate coin flip
      const result = Math.random() < 0.5 ? "Heads" : "Tails";
      setTossResult(result);
      setCoinFlipped(true);
      // Decide toss winner based on Team 2's choice
      const winner = chosenSide === result ? team2.trim() : team1.trim();
      setTossTeam(winner);
      setIsAnimating(false);
      setTimeout(() => {
        setShowTossOptions(true);
      }, 400);
    }, 900); // animation duration
  };

  const handleChooseBatBall = (choice: "bat" | "ball") => {
    const setup = validateSetup();
    if (!setup) {
      setShowCoin(false);
      setCoinFlipped(false);
      setTossResult(null);
      setShowTossOptions(false);
      setStep(1);
      return;
    }
    saveSetup(
      setup.team1Name,
      setup.team2Name,
      setup.nextTeam1Players,
      setup.nextTeam2Players
    );
    // If tossTeam chooses to bat, they are team1, else swap order
    if (choice === "bat") {
      onSubmit(
        tossTeam,
        tossTeam === setup.team1Name ? setup.team2Name : setup.team1Name,
        setup.oversCount,
        tossTeam === setup.team1Name
          ? setup.nextTeam1Players
          : setup.nextTeam2Players,
        tossTeam === setup.team1Name
          ? setup.nextTeam2Players
          : setup.nextTeam1Players,
        playerRosterEnabled,
        setup.matchLengthMode,
        setup.totalBalls
      );
    } else {
      // tossTeam bowls, other team bats first
      onSubmit(
        tossTeam === setup.team1Name ? setup.team2Name : setup.team1Name,
        tossTeam,
        setup.oversCount,
        tossTeam === setup.team1Name
          ? setup.nextTeam2Players
          : setup.nextTeam1Players,
        tossTeam === setup.team1Name
          ? setup.nextTeam1Players
          : setup.nextTeam2Players,
        playerRosterEnabled,
        setup.matchLengthMode,
        setup.totalBalls
      );
    }
  };

  const currentModalPlayers = playerModalTeam === "team1" ? team1Players : team2Players;
  const setCurrentModalPlayers =
    playerModalTeam === "team1" ? setTeam1Players : setTeam2Players;
  const otherTeamPlayers = playerModalTeam === "team1" ? team2Players : team1Players;

  const handleAddPlayerFromModal = () => {
    const player = newPlayerName.trim();
    if (!player) {
      setPlayerModalError(t("Player name is required."));
      return;
    }
    if (currentModalPlayers.some((p) => p.toLowerCase() === player.toLowerCase())) {
      setPlayerModalError(t("Player already exists."));
      return;
    }
    setCurrentModalPlayers((prev: string[]) => normalizePlayers([...prev, player]));
    setNewPlayerName("");
    setPlayerModalError("");
    window.setTimeout(() => {
      addPlayerInputRef.current?.focus();
    }, 0);
  };

  const handleRemovePlayerFromModal = (player: string) => {
    setCurrentModalPlayers((prev: string[]) => prev.filter((p) => p !== player));
  };

  const handleTogglePredefinedPlayer = (player: string) => {
    const alreadyInCurrent = currentModalPlayers.some(
      (p) => p.toLowerCase() === player.toLowerCase()
    );
    if (alreadyInCurrent) {
      setCurrentModalPlayers((prev: string[]) =>
        prev.filter((p) => p.toLowerCase() !== player.toLowerCase())
      );
      setPlayerModalError("");
      return;
    }
    const existsInOtherTeam = otherTeamPlayers.some(
      (p) => p.toLowerCase() === player.toLowerCase()
    );
    if (existsInOtherTeam) {
      setPlayerModalError(
        t("Player already selected in the other team.")
      );
      return;
    }
    setCurrentModalPlayers((prev: string[]) => normalizePlayers([...prev, player]));
    setPlayerModalError("");
  };

  const handlePlayerRosterToggle = (enabled: boolean) => {
    setPlayerRosterEnabled(enabled);
    setError("");
    localStorage.setItem(LOCAL_PLAYER_TOGGLE_KEY, String(enabled));
    if (!enabled) {
      setPlayerModalTeam(null);
      setPlayerModalError("");
    }
  };

  const openPlayersModal = (team: "team1" | "team2") => {
    setPlayerModalTeam(team);
    setNewPlayerName("");
    setPlayerModalError("");
  };

  const openTeamPicker = (
    team: "team1" | "team2",
    anchorEl: HTMLElement,
  ) => {
    setTeamPicker({ team, anchorEl });
  };

  const closeTeamPicker = () => setTeamPicker(null);

  const applySavedTeam = (team: "team1" | "team2", savedTeam: SavedPlayerTeam) => {
    const players = normalizePlayers(
      savedTeam.players.map((player) => player.name),
    );
    // Persist under the saved team's name first so the name-keyed local
    // roster lookup (which fires as soon as team1/team2 changes below)
    // reads back exactly this roster instead of an empty one.
    const map = getSavedPlayersMap();
    map[savedTeam.name] = players;
    localStorage.setItem(LOCAL_PLAYERS_KEY, JSON.stringify(map));
    skipNextAutoLoadRef.current = true;

    if (team === "team1") {
      setTeam1(savedTeam.name);
      setTeam1Players(players);
    } else {
      setTeam2(savedTeam.name);
      setTeam2Players(players);
    }
    closeTeamPicker();
  };

  const renderTeamPlayersCard = (
    teamKey: "team1" | "team2",
    teamName: string,
    players: string[],
    tone: "start" | "end"
  ) => {
    const accent =
      tone === "start"
        ? "var(--app-accent-start, #43cea2)"
        : "var(--app-accent-end, #185a9d)";
    const softBackground =
      tone === "start"
        ? "color-mix(in srgb, var(--app-accent-start, #43cea2) 9%, #ffffff 91%)"
        : "color-mix(in srgb, var(--app-accent-end, #185a9d) 7%, #ffffff 93%)";
    const displayName = teamName || t(teamKey === "team1" ? "Team 1" : "Team 2");
    const previewPlayers = players.slice(0, 4);
    const remainingPlayers = Math.max(0, players.length - previewPlayers.length);

    return (
      <Box
        sx={{
          p: { xs: 1.1, sm: 1.25 },
          borderRadius: 2.5,
          border: `1.5px solid color-mix(in srgb, ${accent} 42%, transparent 58%)`,
          background: softBackground,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Box
              sx={{
                fontWeight: 900,
                fontSize: "calc(14px * var(--app-font-scale, 1))",
                color: "#202124",
                lineHeight: 1.2,
              }}
            >
              {displayName}
            </Box>
            <Box
              sx={{
                mt: 0.25,
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 700,
                fontSize: "calc(12px * var(--app-font-scale, 1))",
              }}
            >
              {players.length
                ? t("{{count}} players selected", { count: players.length })
                : t("No players selected")}
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            {AuthService.isLoggedIn() && (
              <Button
                data-ga-click={`open_${teamKey}_saved_teams`}
                variant="outlined"
                onClick={(event) => openTeamPicker(teamKey, event.currentTarget)}
                aria-label={t("Use a saved team")}
                startIcon={<GroupsRounded sx={{ fontSize: 18 }} />}
                sx={{
                  minWidth: 0,
                  height: 34,
                  borderRadius: 999,
                  px: 1.1,
                  py: 0,
                  fontWeight: 800,
                  textTransform: "none",
                  color: "var(--app-accent-text, #185a9d)",
                  background: "#fff",
                  borderColor: `color-mix(in srgb, ${accent} 45%, transparent 55%)`,
                  "& .MuiButton-startIcon": {
                    mr: 0.35,
                    ml: 0,
                  },
                  "&:hover": {
                    background: "color-mix(in srgb, " + accent + " 8%, #ffffff 92%)",
                    borderColor: accent,
                  },
                }}
              >
                {t("My Teams")}
              </Button>
            )}
            <Button
              data-ga-click={`open_${teamKey}_players_modal`}
              variant="contained"
              onClick={() => openPlayersModal(teamKey)}
              aria-label={t("Add Players")}
              startIcon={players.length ? <Edit /> : <Add />}
              sx={{
                minWidth: 0,
                height: 34,
                borderRadius: 999,
                px: 1.25,
                py: 0,
                color: "#fff",
                fontWeight: 900,
                textTransform: "none",
                background:
                  "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                boxShadow:
                  "0 5px 12px color-mix(in srgb, var(--app-accent-end, #185a9d) 18%, transparent 82%)",
                "& .MuiButton-startIcon": {
                  mr: 0.35,
                  ml: 0,
                },
                "& svg": {
                  fontSize: 18,
                },
                "&:hover, &:active, &:focus, &.Mui-focusVisible": {
                  color: "#fff",
                  background:
                    "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
                },
              }}
            >
              {players.length ? t("Edit") : t("Add")}
            </Button>
          </Box>
        </Box>
        <Box sx={{ mt: 0.95, display: "flex", flexWrap: "wrap", gap: 0.55 }}>
          {players.length ? (
            <>
              {previewPlayers.map((player) => (
                <Chip
                  key={`${teamKey}-player-${player}`}
                  label={player}
                  variant="outlined"
                  sx={{
                    borderRadius: 999,
                    fontWeight: 800,
                    maxWidth: "100%",
                    background: "#fff",
                    color: "#4b5563",
                    borderColor: `color-mix(in srgb, ${accent} 40%, transparent 60%)`,
                    "& .MuiChip-label": {
                      px: 1,
                      fontSize: "calc(11.5px * var(--app-font-scale, 1))",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                />
              ))}
              {remainingPlayers > 0 && (
                <Chip
                  label={`+${remainingPlayers}`}
                  sx={{
                    borderRadius: 999,
                    fontWeight: 900,
                    background:
                      "color-mix(in srgb, var(--app-accent-start, #43cea2) 12%, #ffffff 88%)",
                    color: "var(--app-accent-text, #185a9d)",
                  }}
                />
              )}
            </>
          ) : (
            <Button
              data-ga-click={`open_${teamKey}_players_empty_state`}
              onClick={() => openPlayersModal(teamKey)}
              sx={{
                textTransform: "none",
                justifyContent: "flex-start",
                width: "100%",
                minHeight: 42,
                borderRadius: 2,
                px: 1.2,
                color: "var(--app-accent-text, #185a9d)",
                border: `1px dashed color-mix(in srgb, ${accent} 52%, transparent 48%)`,
                background: "rgba(255,255,255,0.62)",
                fontWeight: 800,
              }}
            >
              {t("Tap to add players")}
            </Button>
          )}
        </Box>
      </Box>
    );
  };

  // Hide any saved team that's already assigned to either side, so the same
  // team can't be picked twice (and a slot's own dropdown doesn't list the
  // team it's already set to).
  const usedSavedTeamNames = new Set(
    [team1, team2].map((name) => name.trim().toLowerCase()).filter(Boolean),
  );
  const selectableSavedTeams = savedTeams.filter(
    (savedTeam) => !usedSavedTeamNames.has(savedTeam.name.trim().toLowerCase()),
  );

  return (
    <Dialog
      open={open}
      disableScrollLock
      disableEscapeKeyDown
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 5,
          background: "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)",
          boxShadow: "0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
          border: "2px solid var(--app-accent-start, #43cea2)",
          backdropFilter: "blur(8px)",
          maxWidth: '94vw',
          width: { xs: "94vw", md:'50vw', sm: '94vw' },
          maxHeight: "calc(100dvh - 16px)",
          boxSizing: "border-box",
          margin: "8px",
          pt: { xs: 0.8, sm: 1.5 },
          // p: { xs: 0.8, sm: 1.5 },
        },
      }}
    >
      <DialogTitle
        sx={{
          mt: 0.2,
          mb: 0.4,
          px: 0.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            px: 1.6,
            py: 0.5,
            borderRadius: 999,
            fontWeight: 900,
            fontSize: "calc(18px * var(--app-font-scale, 1))",
            letterSpacing: 1,
            color: "var(--app-accent-text, #185a9d)",
            background:
              "linear-gradient(90deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 18%, #e0eafc 82%) 0%, #f8fffc 100%)",
            border: "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 45%, transparent 55%)",
            boxShadow: "0 2px 10px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 18%, transparent 82%)",
          }}
        >
          {t('Enter Team Names')}
        </Box>
      </DialogTitle>
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          display: "flex",
          gap: 1,
          zIndex: 11,
        }}
      >
        <IconButton
          data-ga-click="team_modal_close_to_home"
          aria-label="close"
          onClick={() => navigate("/")}
          sx={{
            color: "var(--app-accent-text, #185a9d)",
            background: "#fff",
            border: "1.5px solid var(--app-accent-start, #43cea2)",
            boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
            "&:hover": {
              background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, #e0eafc 100%)",
              color: "var(--app-accent-text, #185a9d)",
              borderColor: "var(--app-accent-text, #185a9d)",
            },
          }}
        >
          <CloseSharp fontSize="small" />
        </IconButton>
      </Box>
      <DialogContent
        sx={{
          px: { xs: 0.5, sm: 2 },
          pt: 0,
          pb: 1,
          overflowY: "auto",
          scrollbarGutter: "stable",
          maxHeight: "calc(100dvh - 92px)",
        }}
      >
        {/* Stepper: Step 0 = Tip, Step 1 = Form */}
        {step === 0 ? (
          <MuiBox
            sx={{
              m: { xs: 0.5, sm: 1 },
              mb: 2,
              p: { xs: 1.2, sm: 1.5 },
              background: "#fff",
              borderRadius: 2,
              boxShadow:
                "0 1px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
              border: "1.5px solid var(--app-accent-start, #43cea2)",
              position: "relative",
            }}
          >
            <Box sx={{ mb: 1 }}>
              <strong>{t("How to Set Up Your Cricket Match:")}</strong>
              <ul style={{ margin: "8px 0 0 16px", padding: 0, fontSize: "calc(15px * var(--app-font-scale, 1))" }}>
                <li>{t("Enter unique team names for both sides.")}</li>
                <li>{t("Choose the match length — by overs (1-50) or by a fixed number of balls.")}</li>
                <li>{t("Optionally, use the toss feature to decide who bats or bowls first.")}</li>
                <li>{t('Click "Start Match" to begin scoring live.')}</li>
              </ul>
            </Box>
            <Box sx={{ mb: 1 }}>
              <strong>{t("Cricket Match FAQ:")}</strong>
              <ul style={{ margin: "8px 0 0 16px", padding: 0, fontSize: "calc(15px * var(--app-font-scale, 1))" }}>
                <li><b>{t("What is an over?")}</b> {t("An over consists of 6 legal balls bowled by one bowler.")}</li>
                <li><b>{t("How do I score runs?")}</b> {t("Use the scoring keypad to add runs, wickets, and extras ball-by-ball.")}</li>
                <li><b>{t("Can I share my match?")}</b> {t("Yes! After setup, use the share link to invite friends and family.")}</li>
                <li><b>{t("Is my data private?")}</b> {t("Your scores are only visible to those with your match link.")}</li>
              </ul>
            </Box>
            <Box sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 500, fontSize: "calc(15px * var(--app-font-scale, 1))", mb: 2 }}>
              {t("Need help?")} {t("Contact")} <a href="mailto:gotimonik1@gmail.com">gotimonik1@gmail.com</a> {t("or")} <a href="tel:+918128313138">+91 8128313138</a>.
            </Box>
            <Button
              data-ga-click="team_setup_next"
              variant="contained"
              color="primary"
              onClick={handleNextFromTip}
              sx={{ fontWeight: 800, borderRadius: 2, px: 3, py: 1, fontSize: "calc(15px * var(--app-font-scale, 1))", background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)", color: "#fff", boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)", mt: 1 }}
            >
              {t("Next")}
            </Button>
          </MuiBox>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.2,
              minWidth: 220,
              mt: 1,
            }}
          >
            <Box
              sx={{
                p: 1.6,
                borderRadius: 2,
                border: "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 45%, transparent 55%)",
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 10%, #ffffff 90%) 0%, #f8fffc 100%)",
                boxShadow: "0 2px 10px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 12%, transparent 88%)",
              }}
            >
              <Box sx={{ fontWeight: 800, fontSize: "calc(16px * var(--app-font-scale, 1))", mb: 1 }}>
                {t("Teams")}
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
                <Box>
                  <label
                    htmlFor="team1-name"
                    style={{ fontWeight: 600, fontSize: "calc(14px * var(--app-font-scale, 1))", marginBottom: 4, display: "block" }}
                  >
                    {t('Team 1 Name')}
                  </label>
                  <TextField
                    id="team1-name"
                    aria-label="Team 1 Name"
                    value={team1}
                    onChange={(e) => setTeam1(e.target.value)}
                    autoFocus
                    fullWidth
                    placeholder={t('INDIA A')}
                    inputProps={{
                      maxLength: 24,
                      style: { fontWeight: 700, fontSize: "calc(16px * var(--app-font-scale, 1))", letterSpacing: 1 },
                    }}
                    sx={{
                      background: "#fff",
                      borderRadius: 2,
                      boxShadow: "0 1px 4px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
                      "& .MuiOutlinedInput-root": { borderRadius: 2 },
                      "& .MuiInputLabel-root": { fontWeight: 600 },
                    }}
                  />
                </Box>
                <Box>
                  <label
                    htmlFor="team2-name"
                    style={{ fontWeight: 600, fontSize: "calc(14px * var(--app-font-scale, 1))", marginBottom: 4, display: "block" }}
                  >
                    {t('Team 2 Name')}
                  </label>
                  <TextField
                    id="team2-name"
                    aria-label="Team 2 Name"
                    value={team2}
                    onChange={(e) => setTeam2(e.target.value)}
                    fullWidth
                    placeholder={t('INDIA B')}
                    inputProps={{
                      maxLength: 24,
                      style: { fontWeight: 700, fontSize: "calc(16px * var(--app-font-scale, 1))", letterSpacing: 1 },
                    }}
                    sx={{
                      background: "#fff",
                      borderRadius: 2,
                      boxShadow: "0 1px 4px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
                      "& .MuiOutlinedInput-root": { borderRadius: 2 },
                      "& .MuiInputLabel-root": { fontWeight: 600 },
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                p: 1.6,
                borderRadius: 2,
                border: "1.5px solid color-mix(in srgb, var(--app-accent-end, #185a9d) 35%, transparent 65%)",
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-end, #185a9d) 8%, #ffffff 92%) 0%, #f8fffc 100%)",
                boxShadow: "0 2px 10px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 12%, transparent 88%)",
              }}
            >
              <label
                style={{ fontWeight: 600, fontSize: "calc(14px * var(--app-font-scale, 1))", marginBottom: 4, display: "block" }}
              >
                {t('Match Length')}
              </label>
              <ToggleButtonGroup
                value={matchLengthMode}
                exclusive
                fullWidth
                size="small"
                onChange={(_e, value) => {
                  if (value) setMatchLengthMode(value);
                }}
                sx={{
                  mb: 1.2,
                  background: "#fff",
                  borderRadius: 2,
                  "& .MuiToggleButton-root": {
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: 2,
                  },
                  "& .Mui-selected": {
                    background:
                      "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%) !important",
                    color: "#fff !important",
                  },
                }}
              >
                <ToggleButton value="overs" data-ga-click="match_length_mode_overs">
                  {t("By Overs")}
                </ToggleButton>
                <ToggleButton value="balls" data-ga-click="match_length_mode_balls">
                  {t("By Balls")}
                </ToggleButton>
              </ToggleButtonGroup>
              {matchLengthMode === "balls" ? (
                <>
                  <label
                    htmlFor="balls-input"
                    style={{ fontWeight: 600, fontSize: "calc(14px * var(--app-font-scale, 1))", marginBottom: 4, display: "block" }}
                  >
                    {t('Number of Balls')}
                  </label>
                  <TextField
                    id="balls-input"
                    aria-label={t('Number of Balls')}
                    type="number"
                    value={balls}
                    onChange={(e) => setBalls(Number(e.target.value))}
                    fullWidth
                    required
                    helperText={t("In steps of {{step}} (e.g. 5, 10, 15, ...)", {
                      step: BALLS_STEP,
                    })}
                    inputProps={{
                      min: MIN_BALLS,
                      max: MAX_BALLS,
                      step: BALLS_STEP,
                      style: { fontWeight: 700, fontSize: "calc(18px * var(--app-font-scale, 1))", letterSpacing: 1, textAlign: 'center' },
                    }}
                    sx={{
                      background: "#fff",
                      borderRadius: 2,
                      boxShadow: "0 1px 4px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
                      "& .MuiOutlinedInput-root": { borderRadius: 2 },
                      "& .MuiInputLabel-root": { fontWeight: 600 },
                      mt: 1,
                    }}
                  />
                </>
              ) : (
                <>
                  <label
                    htmlFor="overs-input"
                    style={{ fontWeight: 600, fontSize: "calc(14px * var(--app-font-scale, 1))", marginBottom: 4, display: "block" }}
                  >
                    {t('Number of Overs')}
                  </label>
                  <TextField
                    id="overs-input"
                    aria-label={t('Number of Overs')}
                    type="number"
                    value={overs}
                    onChange={(e) => setOvers(Number(e.target.value))}
                    fullWidth
                    required
                    inputProps={{
                      min: 1,
                      max: 50,
                      style: { fontWeight: 700, fontSize: "calc(18px * var(--app-font-scale, 1))", letterSpacing: 1, textAlign: 'center' },
                    }}
                    sx={{
                      background: "#fff",
                      borderRadius: 2,
                      boxShadow: "0 1px 4px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
                      "& .MuiOutlinedInput-root": { borderRadius: 2 },
                      "& .MuiInputLabel-root": { fontWeight: 600 },
                      mt: 1,
                    }}
                  />
                </>
              )}
            </Box>
            {requirePlayerRoster && (
              <Box
                ref={playersSectionRef}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.3,
                  p: { xs: 1.2, sm: 1.5 },
                  borderRadius: 3,
                  border: "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 45%, transparent 55%)",
                  background:
                    "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 8%, #ffffff 92%) 0%, #f8fffc 100%)",
                  boxShadow:
                    "0 10px 28px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 12%, transparent 88%)",
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    alignItems: "center",
                    gap: { xs: 0.8, sm: 1 },
                    p: { xs: 0.9, sm: 1 },
                    borderRadius: 2.5,
                    background: playerRosterEnabled
                      ? "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 12%, #ffffff 88%) 0%, #ffffff 100%)"
                      : "rgba(255,255,255,0.62)",
                    border: "1px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 34%, transparent 66%)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Switch
                      checked={playerRosterEnabled}
                      onChange={(event) => {
                        handlePlayerRosterToggle(event.target.checked);
                      }}
                      color="primary"
                      sx={{
                        width: 48,
                        height: 28,
                        p: 0,
                        "& .MuiSwitch-switchBase": {
                          p: "4px",
                          color: "#fff",
                          "&.Mui-checked": {
                            transform: "translateX(20px)",
                          },
                        },
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#fff",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb": {
                          boxShadow:
                            "0 3px 8px color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                          background:
                            "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                          opacity: 1,
                        },
                        "& .MuiSwitch-thumb": {
                          width: 20,
                          height: 20,
                          boxShadow:
                            "0 2px 6px color-mix(in srgb, #000 18%, transparent 82%)",
                        },
                        "& .MuiSwitch-track": {
                          backgroundColor:
                            "color-mix(in srgb, var(--app-accent-end, #185a9d) 20%, #cfd8dc 80%)",
                          borderRadius: 999,
                          opacity: 1,
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Box
                      sx={{
                        color: "var(--app-accent-text, #185a9d)",
                        fontWeight: 900,
                        fontSize: "calc(14px * var(--app-font-scale, 1))",
                        lineHeight: 1.2,
                      }}
                    >
                      {t("Add players now (optional)")}
                    </Box>
                    <Box
                      sx={{
                        mt: 0.35,
                        color: "color-mix(in srgb, var(--app-accent-text, #185a9d) 82%, #202124 18%)",
                        fontWeight: 600,
                        fontSize: "calc(11.5px * var(--app-font-scale, 1))",
                        lineHeight: 1.3,
                      }}
                    >
                      {playerRosterEnabled
                        ? t("Minimum {{count}} players per team.", {
                            count: MIN_PLAYERS_PER_TEAM,
                          })
                        : t("You can continue without adding players, like the older version.")}
                    </Box>
                  </Box>
                </Box>
                {!playerRosterEnabled && (
                  <Button
                    data-ga-click="enable_players_from_helper"
                    onClick={() => handlePlayerRosterToggle(true)}
                    sx={{
                      alignSelf: "flex-start",
                      textTransform: "none",
                      fontWeight: 800,
                      borderRadius: 999,
                      px: 1.7,
                      py: 0.7,
                      color: "var(--app-accent-text, #185a9d)",
                      background:
                        "color-mix(in srgb, var(--app-accent-start, #43cea2) 12%, #ffffff 88%)",
                      border:
                        "1px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 42%, transparent 58%)",
                    }}
                  >
                    {t("Add team players")}
                  </Button>
                )}
                {playerRosterEnabled && (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gap: 0.9,
                    }}
                  >
                    {renderTeamPlayersCard("team1", team1, team1Players, "start")}
                    {renderTeamPlayersCard("team2", team2, team2Players, "end")}
                  </Box>
                )}
              </Box>
            )}
            {error && (
              <Box
                sx={{
                  color: "#e53935",
                  fontWeight: 600,
                  textAlign: "center",
                  mt: 0.5,
                }}
              >
                {error}
              </Box>
            )}
          </Box>
        )}
        {/* Toss dropdown: opens anchored to the "Go with Toss" button instead
            of appending after the whole setup form, so it's visible right
            away without scrolling to the end of the modal. */}
        <Popover
          open={showTossOptions}
          anchorEl={goWithTossButtonRef.current}
          onClose={handleCancelToss}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          transformOrigin={{ vertical: "bottom", horizontal: "center" }}
          PaperProps={{
            sx: {
              position: "relative",
              borderRadius: 3,
              p: 2.5,
              pt: 3.5,
              mb: 1,
              maxWidth: "min(92vw, 380px)",
              boxShadow:
                "0 12px 40px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 30%, transparent 70%)",
              border: "1.5px solid var(--app-accent-start, #43cea2)",
            },
          }}
        >
          <IconButton
            size="small"
            onClick={handleCancelToss}
            aria-label={t("Close")}
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              color: "var(--app-accent-text, #185a9d)",
            }}
          >
            <CloseSharp fontSize="small" />
          </IconButton>
        {!coinFlipped && (
          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{ fontWeight: 700, fontSize: "calc(18px * var(--app-font-scale, 1))", mb: 2, textAlign: "center" }}
            >
              <span style={{ color: "var(--app-accent-start, #43cea2)" }}>
                {team1.trim() || t('Team 1')}
              </span>{" "}
              {t('will flip the coin')}
              <br />
              <span style={{ color: "var(--app-accent-text, #185a9d)" }}>
                {team2.trim() || t('Team 2')}
              </span>{" "}
              {t('will select Heads or Tails')}
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}
            >
              <Button
                data-ga-click="choose_heads"
                color="primary"
                variant={chosenSide === "Heads" ? "contained" : "outlined"}
                sx={{
                  fontWeight: 800,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontSize: "calc(15px * var(--app-font-scale, 1))",
                  background:
                    chosenSide === "Heads"
                      ? "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)"
                      : "#fff",
                  color: chosenSide === "Heads" ? "#fff" : "var(--app-accent-text, #185a9d)",
                  boxShadow:
                    chosenSide === "Heads"
                      ? "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)"
                      : "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
                  borderWidth: chosenSide === "Heads" ? 0 : 2,
                  borderColor: "var(--app-accent-start, #43cea2)",
                  transition: "all 0.2s",
                  "&:hover": {
                    background:
                      chosenSide === "Heads"
                        ? "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)"
                        : "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, #e0eafc 100%)",
                    color: "#fff",
                    borderColor: "var(--app-accent-text, #185a9d)",
                  },
                }}
                onClick={() => setChosenSide("Heads")}
              >
                {t('Heads')}
              </Button>
              <Button
                data-ga-click="choose_tails"
                color="secondary"
                variant={chosenSide === "Tails" ? "contained" : "outlined"}
                sx={{
                  fontWeight: 800,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontSize: "calc(15px * var(--app-font-scale, 1))",
                  background:
                    chosenSide === "Tails"
                      ? "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)"
                      : "#fff",
                  color: chosenSide === "Tails" ? "#fff" : "var(--app-accent-text, #185a9d)",
                  boxShadow:
                    chosenSide === "Tails"
                      ? "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)"
                      : "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
                  borderWidth: chosenSide === "Tails" ? 0 : 2,
                  borderColor: "var(--app-accent-start, #43cea2)",
                  transition: "all 0.2s",
                  "&:hover": {
                    background:
                      chosenSide === "Tails"
                        ? "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)"
                        : "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, #e0eafc 100%)",
                    color: "#fff",
                    borderColor: "var(--app-accent-text, #185a9d)",
                  },
                }}
                onClick={() => setChosenSide("Tails")}
              >
                {t('Tails')}
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Box
                onClick={
                  !chosenSide || isAnimating
                    ? undefined
                    : () => {
                        setIsAnimating(true);
                        setTimeout(() => {
                          setShowCoin(true);
                          setIsAnimating(false);
                          // Immediately flip the coin after showing
                          setTimeout(() => {
                            handleCoinFlip();
                          }, 400);
                        }, 400);
                      }
                }
                sx={{
                  borderRadius: "50%",
                  width: 80,
                  height: 80,
                  background: !chosenSide
                    ? "radial-gradient(circle, #e0eafc 60%, #bdbdbd 100%)"
                    : "radial-gradient(circle, var(--app-accent-start, #43cea2) 60%, var(--app-accent-end, #185a9d) 100%)",
                  boxShadow: "0 4px 16px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 27%, transparent 73%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "calc(32px * var(--app-font-scale, 1))",
                  color: "#fff",
                  cursor: !chosenSide ? "not-allowed" : "pointer",
                  opacity: !chosenSide ? 0.5 : 1,
                  userSelect: "none",
                  transition:
                    "background 0.3s, opacity 0.3s, transform 0.9s cubic-bezier(.68,-0.55,.27,1.55)",
                  transform: isAnimating ? "rotateY(720deg)" : "none",
                }}
                title={
                  !chosenSide
                    ? t('Select Heads or Tails first')
                    : t('Click to flip coin')
                }
              >
                🪙
              </Box>
            </Box>
            <Box
              sx={{ fontWeight: 500, fontSize: "calc(15px * var(--app-font-scale, 1))", color: "var(--app-accent-text, #185a9d)", mt: 1 }}
            >
              {chosenSide
                ? t('Tap the coin to flip')
                : t('Select Heads or Tails to enable coin')}
            </Box>
          </Box>
        )}
        {coinFlipped && tossResult && (
          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{ fontWeight: 700, fontSize: "calc(18px * var(--app-font-scale, 1))", color: "var(--app-accent-text, #185a9d)", mb: 1 }}
            >
              {t('Coin Flip Result:')} <span style={{ color: "var(--app-accent-start, #43cea2)" }}>{tossResult}</span>
            </Box>
            <Box
              sx={{ fontWeight: 600, fontSize: "calc(16px * var(--app-font-scale, 1))", color: "var(--app-accent-text, #185a9d)", mb: 1 }}
            >
              {tossTeam} {t('won the toss!')}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                data-ga-click="choose_bat_first"
                onClick={() => handleChooseBatBall("bat")}
                color="primary"
                variant="contained"
                sx={{
                  fontWeight: 800,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontSize: "calc(15px * var(--app-font-scale, 1))",
                  background:
                    "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                  color: "#fff",
                  boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
                  transition: "all 0.2s",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
                    color: "#fff",
                  },
                }}
              >
                {t('Bat First')}
              </Button>
              <Button
                data-ga-click="choose_ball_first"
                onClick={() => handleChooseBatBall("ball")}
                color="secondary"
                variant="outlined"
                sx={{
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontSize: "calc(15px * var(--app-font-scale, 1))",
                  borderWidth: 2,
                  background: "#fff",
                  color: "var(--app-accent-text, #185a9d)",
                  borderColor: "var(--app-accent-start, #43cea2)",
                  boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
                  transition: "all 0.2s",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, #e0eafc 100%)",
                    color: "var(--app-accent-text, #185a9d)",
                    borderColor: "var(--app-accent-text, #185a9d)",
                  },
                }}
              >
                {t('Ball First')}
              </Button>
            </Box>
          </Box>
        )}
        </Popover>
      </DialogContent>
      <Dialog
        open={Boolean(playerModalTeam)}
        onClose={() => setPlayerModalTeam(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: { xs: "min(78dvh, 620px)", sm: 520 },
            width: { xs: "94vw", sm: "min(720px, 94vw)" },
            m: { xs: "8px", sm: 2 },
            borderRadius: 3,
            border: "2px solid var(--app-accent-start, #43cea2)",
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 10%, #e0eafc 90%) 0%, #f8fffc 100%)",
            boxShadow:
              "0 16px 42px color-mix(in srgb, var(--app-accent-end, #185a9d) 26%, transparent 74%)",
          },
        }}
      >
        <DialogTitle
          sx={{
            px: { xs: 2, sm: 2.4 },
            pt: { xs: 2, sm: 2.3 },
            pb: 1,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "center",
              gap: 1.2,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  color: "var(--app-accent-text, #185a9d)",
                  fontWeight: 900,
                  fontSize: "calc(24px * var(--app-font-scale, 1))",
                  lineHeight: 1.1,
                }}
              >
                {playerModalTeam === "team1" ? team1 : team2} {t("Players")}
              </Box>
              <Box
                sx={{
                  mt: 0.6,
                  color: "color-mix(in srgb, var(--app-accent-text, #185a9d) 80%, #202124 20%)",
                  fontWeight: 700,
                  fontSize: "calc(13px * var(--app-font-scale, 1))",
                }}
              >
                {t("Add or remove players for this team")}
              </Box>
            </Box>
            <Box
              sx={{
                minWidth: 44,
                height: 44,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 900,
                border:
                  "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 45%, transparent 55%)",
                background: "#fff",
              }}
            >
              {currentModalPlayers.length}
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 2.4 }, pb: 1 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
              gap: 1,
              mt: 0.5,
              p: 1.2,
              borderRadius: 2.5,
              border:
                "1.5px solid color-mix(in srgb, var(--app-accent-end, #185a9d) 25%, transparent 75%)",
              background: "rgba(255,255,255,0.72)",
            }}
          >
            <TextField
              fullWidth
              size="small"
              autoFocus
              inputRef={addPlayerInputRef}
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder={t("Enter player name")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddPlayerFromModal();
                }
              }}
              sx={{
                background: "#fff",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  fontWeight: 700,
                },
              }}
            />
            <Button
              data-ga-click="add_player_from_modal"
              variant="contained"
              onClick={handleAddPlayerFromModal}
              startIcon={<Add />}
              sx={{
                textTransform: "none",
                fontWeight: 900,
                px: { xs: 2, sm: 2.5 },
                minHeight: 42,
                borderRadius: 2,
                color: "#fff",
                background:
                  "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                boxShadow:
                  "0 8px 18px color-mix(in srgb, var(--app-accent-end, #185a9d) 20%, transparent 80%)",
                "&:hover, &:active, &:focus, &.Mui-focusVisible": {
                  color: "#fff",
                  background:
                    "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
                },
              }}
            >
              {t("Add")}
            </Button>
          </Box>
          {playerModalError && (
            <Box
              sx={{
                color: "#e53935",
                mt: 1,
                fontWeight: 700,
                fontSize: "calc(13px * var(--app-font-scale, 1))",
              }}
            >
              {playerModalError}
            </Box>
          )}
          {showPredefinedPlayers && (
            <Box
              sx={{
                mt: 1.4,
                mb: 1.4,
                p: 1.2,
                borderRadius: 2.5,
                border: "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 7%, #ffffff 93%) 0%, #f8fffc 100%)",
              }}
            >
              <Box
                sx={{
                  color: "var(--app-accent-text, #185a9d)",
                  fontWeight: 900,
                  fontSize: "calc(13px * var(--app-font-scale, 1))",
                  mb: 0.8,
                }}
              >
                {t("Predefined Players")}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.75,
                  maxHeight: 170,
                  overflowY: "auto",
                  pr: 0.5,
                }}
              >
                {PREDEFINED_PLAYERS.filter((player) => {
                  const selectedInCurrent = currentModalPlayers.some(
                    (p) => p.toLowerCase() === player.toLowerCase()
                  );
                  const selectedInOther = otherTeamPlayers.some(
                    (p) => p.toLowerCase() === player.toLowerCase()
                  );
                  return !selectedInCurrent && !selectedInOther;
                }).map((player) => (
                  <Chip
                    key={player}
                    label={player}
                    data-ga-click="toggle_predefined_player"
                    color="primary"
                    variant="outlined"
                    clickable
                    onClick={() => handleTogglePredefinedPlayer(player)}
                    sx={{
                      borderRadius: 999,
                      fontWeight: 800,
                      px: 1.3,
                      py: 0.2,
                      minHeight: 28,
                      minWidth: "unset",
                      width: "auto",
                      background: "#fff",
                      color: "var(--app-accent-text, #185a9d)",
                      borderColor: "color-mix(in srgb, var(--app-accent-start, #43cea2) 55%, transparent 45%)",
                      "&:hover": {
                        background:
                          "color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #ffffff 86%)",
                      },
                      "& .MuiChip-label": {
                        px: 1.1,
                        fontWeight: 700,
                        fontSize: "calc(13px * var(--app-font-scale, 1))",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
          <Box
            className="app-scrollable"
            sx={{
              mt: 1.2,
              minHeight: { xs: 210, sm: 230 },
              maxHeight: { xs: "34dvh", sm: 260 },
              overflowY: "auto",
              border: "1px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 22%, transparent 78%)",
              borderRadius: 2.5,
              px: { xs: 1, sm: 1.2 },
              py: { xs: 1, sm: 1.2 },
              background: "rgba(255,255,255,0.68)",
            }}
          >
            {currentModalPlayers.length === 0 ? (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  color: "var(--app-accent-text, #185a9d)",
                  opacity: 0.85,
                  px: 2,
                }}
              >
                <Box sx={{ fontWeight: 700, fontSize: "calc(14px * var(--app-font-scale, 1))" }}>
                  {t("No players selected yet")}
                </Box>
                <Box sx={{ mt: 0.5, fontSize: "calc(12px * var(--app-font-scale, 1))" }}>
                  {t("Select predefined players or add a player name above.")}
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                {currentModalPlayers.map((player) => (
                  <Chip
                    key={player}
                    label={player}
                    onDelete={() => handleRemovePlayerFromModal(player)}
                    deleteIcon={<DeleteOutline />}
                    sx={{
                      borderRadius: 999,
                      fontWeight: 900,
                      background: "#fff",
                      color: "var(--app-accent-text, #185a9d)",
                      border: "1px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 40%, transparent 60%)",
                      minHeight: 34,
                      "& .MuiChip-label": { px: 1.2, fontSize: "calc(13px * var(--app-font-scale, 1))" },
                      "& .MuiChip-deleteIcon": { color: "var(--app-accent-text, #185a9d)" },
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 2.4 }, pb: { xs: 2, sm: 2.2 } }}>
          <Button
            data-ga-click="close_player_modal"
            onClick={() => setPlayerModalTeam(null)}
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 900,
              borderRadius: 2,
              px: 2.5,
              py: 1,
              color: "#fff",
              background:
                "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
              boxShadow:
                "0 8px 18px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
              "&:hover, &:active, &:focus, &.Mui-focusVisible": {
                color: "#fff",
                background:
                  "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
              },
            }}
          >
            {t("Done")}
          </Button>
        </DialogActions>
      </Dialog>
      <Menu
        open={Boolean(teamPicker)}
        anchorEl={teamPicker?.anchorEl ?? null}
        onClose={closeTeamPicker}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            mt: 0.5,
            minWidth: 260,
            maxWidth: 340,
            maxHeight: 360,
            borderRadius: 2.5,
            border: "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 40%, transparent 60%)",
            boxShadow: "0 10px 28px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 24%, transparent 76%)",
          },
        }}
      >
        <Typography
          sx={{
            px: 2,
            pt: 1,
            pb: 0.5,
            fontWeight: 800,
            fontSize: "calc(12px * var(--app-font-scale, 1))",
            color: "var(--app-accent-text, #185a9d)",
            opacity: 0.85,
          }}
        >
          {t("Select a saved team")}
        </Typography>
        {savedTeamsStatus === "loading" && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2.5 }}>
            <CircularProgress size={22} />
          </Box>
        )}
        {savedTeamsStatus === "error" && (
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography sx={{ fontSize: "calc(12.5px * var(--app-font-scale, 1))", color: "#e53935", fontWeight: 600 }}>
              {t("Couldn't load your teams. Please try again.")}
            </Typography>
          </Box>
        )}
        {savedTeamsStatus === "loaded" && savedTeams.length === 0 && (
          <Box sx={{ px: 2, py: 1.5, maxWidth: 300 }}>
            <Typography sx={{ fontSize: "calc(12.5px * var(--app-font-scale, 1))", color: "var(--app-accent-text, #185a9d)", fontWeight: 600, mb: 1 }}>
              {t("You don't have any saved teams yet.")}
            </Typography>
            <Button
              data-ga-click="team_picker_manage_teams"
              size="small"
              variant="outlined"
              onClick={() => {
                closeTeamPicker();
                navigate("/my-teams");
              }}
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: 999 }}
            >
              {t("Manage My Teams")}
            </Button>
          </Box>
        )}
        {savedTeamsStatus === "loaded" &&
          savedTeams.length > 0 &&
          selectableSavedTeams.length === 0 && (
            <Box sx={{ px: 2, py: 1.5, maxWidth: 300 }}>
              <Typography sx={{ fontSize: "calc(12.5px * var(--app-font-scale, 1))", color: "var(--app-accent-text, #185a9d)", fontWeight: 600 }}>
                {t("All your saved teams are already selected for this match.")}
              </Typography>
            </Box>
          )}
        {savedTeamsStatus === "loaded" &&
          selectableSavedTeams.map((savedTeam) => (
            <MenuItem
              key={savedTeam.id}
              onClick={() => {
                if (teamPicker) applySavedTeam(teamPicker.team, savedTeam);
              }}
            >
              <ListItemText
                primary={savedTeam.name}
                secondary={t("{{count}} players", {
                  count: savedTeam.players.length,
                })}
                primaryTypographyProps={{ fontWeight: 700 }}
              />
            </MenuItem>
          ))}
      </Menu>
      <DialogActions
        sx={{
          justifyContent: "center",
          pb: 1,
          flexDirection: "row",
          gap: 1,
        }}
      >
        {step === 1 && (
          <>
            {!showCoin && !showTossOptions && (
              <Button
                data-ga-click="start_match"
                onClick={handleSubmit}
                color="primary"
                variant="contained"
                sx={{
                  fontWeight: 800,
                  borderRadius: 2,
                  px: { xs: 2, sm: 3 },
                  py: 1,
                  fontSize: "calc(15px * var(--app-font-scale, 1))",
                  whiteSpace: "nowrap",
                  background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                  color: "#fff",
                  boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
                  transition: "all 0.2s",
                  "&:hover": {
                    background: "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
                    color: "#fff",
                  },
                }}
              >
                {t('Start Match')}
              </Button>
            )}
            {/* Stays mounted (just disabled) while the toss dropdown is open
                so it keeps anchoring the Popover above. */}
            <Button
              ref={goWithTossButtonRef}
              data-ga-click="go_with_toss"
              disabled={showTossOptions}
              onClick={() => {
                if (!validateSetup()) return;
                setShowCoin(false);
                setCoinFlipped(false);
                setTossResult(null);
                setShowTossOptions(true);
                setChosenSide(null);
              }}
              color="secondary"
              variant="outlined"
              sx={{
                fontWeight: 700,
                borderRadius: 2,
                px: { xs: 2, sm: 3 },
                py: 1,
                fontSize: "calc(15px * var(--app-font-scale, 1))",
                whiteSpace: "nowrap",
                borderWidth: 2,
                background: "#fff",
                color: "var(--app-accent-text, #185a9d)",
                borderColor: "var(--app-accent-start, #43cea2)",
                boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
                transition: "all 0.2s",
                "&:hover": {
                  background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, #e0eafc 100%)",
                  color: "var(--app-accent-text, #185a9d)",
                  borderColor: "var(--app-accent-text, #185a9d)",
                },
                "&.Mui-disabled": {
                  borderColor: "var(--app-accent-start, #43cea2)",
                  color: "var(--app-accent-text, #185a9d)",
                  opacity: 0.6,
                },
              }}
            >
              {t('Go with Toss')}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TeamNameModal;
