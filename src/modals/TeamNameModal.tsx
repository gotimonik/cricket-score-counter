import AppSpinner from "../components/AppSpinner";
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
  Typography,
  Popover,
} from "@mui/material";
import {
  Add,
  CloseSharp,
  DeleteOutline,
  Edit,
  GroupsRounded,
  Remove,
} from "@mui/icons-material";
import { BOARD } from "../utils/brand";
import { useNavigate } from "react-router-dom";
import {
  getStoredAppPreferences,
  setStoredAppPreferences,
} from "../utils/appPreferences";
import AuthService from "../services/AuthService";
import PlayerMatchService from "../services/PlayerMatchService";
import TeamLibraryService from "../services/TeamLibraryService";
import type { SavedPlayerTeam } from "../types/playerTeam";

// Match-setup palette: pavilion green and chalk, matching the app header.
const SETUP = {
  surface: "#F7F5EE",
  field: "#F1EEE4",
  ink: "#1d2b26",
  muted: "#5f6b66",
  line: "rgba(15,46,37,0.12)",
  lineStrong: "rgba(15,46,37,0.28)",
  tint: "rgba(15,46,37,0.06)",
  tintStrong: "rgba(15,46,37,0.12)",
} as const;

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
  // Single player mode (moved here from App Preferences): lets the last
  // batter keep batting alone with a dummy partner. Saved as an app-wide
  // preference, so the scorer picks it up for this and later matches.
  const [singlePlayerMode, setSinglePlayerMode] = useState(
    () => getStoredAppPreferences().singlePlayerModeEnabled,
  );
  const handleSinglePlayerModeToggle = (enabled: boolean) => {
    setSinglePlayerMode(enabled);
    setStoredAppPreferences({
      ...getStoredAppPreferences(),
      singlePlayerModeEnabled: enabled,
    });
  };

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

  // Starts the toss from the coin or the "Flip coin" button once the
  // calling side has picked heads or tails.
  const startTossFlip = () => {
    if (!chosenSide || isAnimating || coinFlipped) return;
    setShowCoin(true);
    handleCoinFlip();
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
    if (players.length && !playerRosterEnabled) handlePlayerRosterToggle(true);
    closeTeamPicker();
  };

  const renderTeamPlayersCard = (
    teamKey: "team1" | "team2",
    players: string[],
  ) => {
    const previewPlayers = players.slice(0, 3);
    const remainingPlayers = Math.max(0, players.length - previewPlayers.length);

    return (
      <Box
        sx={{
          mt: 1.25,
          pt: 1.25,
          borderTop: `1px dashed ${SETUP.line}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box sx={{ fontSize: "calc(12.5px * var(--app-font-scale, 1))", fontWeight: 700, color: SETUP.muted }}>
            {players.length
              ? t("{{count}} players", { count: players.length })
              : t("No players yet")}
          </Box>
          <Button
            data-ga-click={`open_${teamKey}_players_modal`}
            onClick={() => openPlayersModal(teamKey)}
            aria-label={t("Add Players")}
            startIcon={players.length ? <Edit /> : <Add />}
            sx={{
              minWidth: 0,
              height: 30,
              px: 1.1,
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 800,
              fontSize: "calc(12.5px * var(--app-font-scale, 1))",
              color: BOARD.green,
              background: SETUP.tint,
              "& .MuiButton-startIcon": { mr: 0.35, ml: 0 },
              "& svg": { fontSize: 16 },
              "&:hover": { background: SETUP.tintStrong },
            }}
          >
            {players.length ? t("Edit") : t("Add")}
          </Button>
        </Box>
        {players.length > 0 && (
          <Box sx={{ mt: 0.75, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {previewPlayers.map((player) => (
              <Chip
                key={`${teamKey}-player-${player}`}
                label={player}
                size="small"
                sx={{
                  maxWidth: "100%",
                  fontWeight: 700,
                  background: "#fff",
                  color: SETUP.ink,
                  border: `1px solid ${SETUP.line}`,
                  "& .MuiChip-label": {
                    fontSize: "calc(11.5px * var(--app-font-scale, 1))",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
              />
            ))}
            {remainingPlayers > 0 && (
              <Chip
                size="small"
                label={`+${remainingPlayers}`}
                sx={{ fontWeight: 800, background: SETUP.tint, color: BOARD.green }}
              />
            )}
          </Box>
        )}
      </Box>
    );
  };

  const renderTeamCard = (
    teamKey: "team1" | "team2",
    value: string,
    setValue: (value: string) => void,
    players: string[],
  ) => {
    const isFirst = teamKey === "team1";
    const inputId = isFirst ? "team1-name" : "team2-name";
    const label = isFirst ? t("Team 1") : t("Team 2");
    return (
      <Box
        sx={{
          minWidth: 0,
          p: 1.5,
          borderRadius: 3,
          background: "#fff",
          border: `1px solid ${SETUP.line}`,
          boxShadow: "0 1px 2px rgba(15,46,37,0.06)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mb: 0.75,
            minHeight: 28,
          }}
        >
          <Box
            component="label"
            htmlFor={inputId}
            sx={{ fontSize: "calc(12.5px * var(--app-font-scale, 1))", fontWeight: 800, color: SETUP.muted }}
          >
            {label}
          </Box>
          {requirePlayerRoster && AuthService.isLoggedIn() && (
            <Button
              data-ga-click={`open_${teamKey}_saved_teams`}
              onClick={(event) => openTeamPicker(teamKey, event.currentTarget)}
              aria-label={t("Use a saved team")}
              startIcon={<GroupsRounded />}
              sx={{
                minWidth: 0,
                height: 28,
                px: 1,
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 800,
                fontSize: "calc(12px * var(--app-font-scale, 1))",
                color: BOARD.green,
                "& .MuiButton-startIcon": { mr: 0.35, ml: 0 },
                "& svg": { fontSize: 16 },
                "&:hover": { background: SETUP.tint },
              }}
            >
              {t("My Teams")}
            </Button>
          )}
        </Box>
        <TextField
          id={inputId}
          aria-label={isFirst ? "Team 1 Name" : "Team 2 Name"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus={isFirst}
          fullWidth
          size="small"
          placeholder={isFirst ? t("INDIA A") : t("INDIA B")}
          inputProps={{
            maxLength: 24,
            style: {
              fontWeight: 800,
              fontSize: "calc(16px * var(--app-font-scale, 1))",
              letterSpacing: 0.3,
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              background: SETUP.field,
              "& fieldset": { borderColor: "transparent" },
              "&:hover fieldset": { borderColor: SETUP.line },
              "&.Mui-focused fieldset": { borderColor: BOARD.green, borderWidth: 1.5 },
            },
            "& input": { py: 1.1 },
          }}
        />
        {requirePlayerRoster && playerRosterEnabled && renderTeamPlayersCard(teamKey, players)}
      </Box>
    );
  };

  const lengthValue = matchLengthMode === "balls" ? balls : overs;
  const lengthMin = matchLengthMode === "balls" ? MIN_BALLS : 1;
  const lengthMax = matchLengthMode === "balls" ? MAX_BALLS : 50;
  const lengthStep = matchLengthMode === "balls" ? BALLS_STEP : 1;
  const lengthPresets = matchLengthMode === "balls" ? [30, 60, 90, 120] : [5, 6, 8, 10, 20];
  const setLengthValue = (value: number) => {
    if (matchLengthMode === "balls") setBalls(value);
    else setOvers(value);
  };
  const stepLength = (direction: 1 | -1) => {
    const current = Number(lengthValue) || 0;
    const next = Math.min(
      lengthMax,
      Math.max(lengthMin, current + direction * lengthStep),
    );
    setLengthValue(next);
  };
  const sectionLabelSx = {
    fontSize: "calc(13px * var(--app-font-scale, 1))",
    fontWeight: 800,
    color: SETUP.ink,
  } as const;
  const stepButtonSx = {
    width: 44,
    height: 44,
    borderRadius: 2,
    background: "#fff",
    border: `1px solid ${SETUP.line}`,
    color: BOARD.green,
    "&:hover": { background: SETUP.tint },
    "&.Mui-disabled": { opacity: 0.4 },
  } as const;

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
      PaperProps={{ className: "match-setup-paper" }}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 4,
          overflow: "hidden",
          background: SETUP.surface,
          boxShadow: "0 24px 60px rgba(10,31,26,0.28)",
          width: { xs: "calc(100vw - 16px)", sm: 560 },
          maxWidth: "calc(100vw - 16px)",
          maxHeight: "calc(100dvh - 16px)",
          boxSizing: "border-box",
          margin: "8px",
          overflowX: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          position: "relative",
          px: 2.25,
          pt: 2,
          pb: 1.75,
          pr: 7,
          color: BOARD.chalk,
          background: `radial-gradient(120% 140% at 0% 0%, #1a4638 0%, ${BOARD.green} 55%, ${BOARD.greenDeep} 100%)`,
          borderBottom: `3px solid ${BOARD.gold}`,
        }}
      >
        <Box
          component="span"
          sx={{
            display: "block",
            fontWeight: 900,
            fontSize: "calc(20px * var(--app-font-scale, 1))",
            lineHeight: 1.2,
          }}
        >
          {t("New match")}
        </Box>
        <Box
          component="span"
          className="modal-subtitle"
          sx={{
            display: "block",
            mt: 0.4,
            fontWeight: 600,
            fontSize: "calc(13px * var(--app-font-scale, 1))",
            color: "rgba(237,233,220,0.72)",
          }}
        >
          {step === 0
            ? t("A quick guide before your first match")
            : t("Name the teams, pick the length, and you're ready to score.")}
        </Box>
        <IconButton
          data-ga-click="team_modal_close_to_home"
          aria-label="close"
          onClick={() => navigate("/")}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            color: BOARD.chalk,
            background: "rgba(237,233,220,0.1)",
            border: "1px solid rgba(237,233,220,0.22)",
            "&:hover": { background: "rgba(237,233,220,0.2)" },
          }}
        >
          <CloseSharp fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          px: { xs: 1.5, sm: 2.25 },
          pt: "16px !important",
          pb: 1.5,
          overflowY: "auto",
          // Never scroll sideways: when the vertical scrollbar appears it
          // eats ~15px of width, which was enough to push the cards a few
          // pixels past the edge and add a horizontal scrollbar too.
          overflowX: "hidden",
          // Keep the vertical scrollbar slim (desktop browsers) so it
          // doesn't crowd the cards; touch devices use overlay bars anyway.
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(15,46,37,0.25) transparent",
          "&::-webkit-scrollbar": { width: 6, height: 0 },
          "&::-webkit-scrollbar-thumb": { background: "rgba(15,46,37,0.25)", borderRadius: 3 },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "& > *": { minWidth: 0, maxWidth: "100%" },
        }}
      >
        {/* Stepper: Step 0 = Tip, Step 1 = Form */}
        {step === 0 ? (
          <MuiBox
            sx={{
              p: { xs: 1.5, sm: 1.75 },
              background: "#fff",
              borderRadius: 3,
              border: `1px solid ${SETUP.line}`,
              color: SETUP.ink,
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
            <Box sx={{ color: SETUP.muted, fontWeight: 500, fontSize: "calc(15px * var(--app-font-scale, 1))", mb: 2 }}>
              {t("Need help?")} {t("Contact")} <a href="mailto:gotimonik1@gmail.com">gotimonik1@gmail.com</a> {t("or")} <a href="tel:+918128313138">+91 8128313138</a>.
            </Box>
            <Button
              data-ga-click="team_setup_next"
              className="match-setup-next"
              variant="contained"
              color="primary"
              onClick={handleNextFromTip}
              disableElevation
              sx={{ width: "100%", height: 48, fontWeight: 900, textTransform: "none", borderRadius: 2.5, fontSize: "calc(15px * var(--app-font-scale, 1))", background: BOARD.green, color: BOARD.chalk, mt: 1, "&:hover": { background: BOARD.greenDeep } }}
            >
              {t("Next")}
            </Button>
          </MuiBox>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
            <Box>
              <Box sx={{ ...sectionLabelSx, mb: 1 }}>{t("Teams")}</Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "minmax(0, 1fr) auto minmax(0, 1fr)" },
                  alignItems: "stretch",
                  gap: { xs: 0.75, sm: 1 },
                }}
              >
                {renderTeamCard("team1", team1, setTeam1, team1Players)}
                <Box
                  aria-hidden
                  sx={{
                    alignSelf: "center",
                    justifySelf: "center",
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 900,
                    fontSize: "calc(12px * var(--app-font-scale, 1))",
                    color: BOARD.green,
                    background: `linear-gradient(180deg, ${BOARD.goldLight} 0%, ${BOARD.gold} 100%)`,
                    boxShadow: "0 2px 6px rgba(15,46,37,0.18)",
                    my: { xs: -1.75, sm: 0 },
                    zIndex: 1,
                  }}
                >
                  {t("vs")}
                </Box>
                {renderTeamCard("team2", team2, setTeam2, team2Players)}
              </Box>
            </Box>

            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Box sx={sectionLabelSx}>{t("Match length")}</Box>
                <ToggleButtonGroup
                  value={matchLengthMode}
                  exclusive
                  size="small"
                  onChange={(_e, value) => {
                    if (value) setMatchLengthMode(value);
                  }}
                  sx={{
                    p: 0.4,
                    gap: 0.4,
                    borderRadius: 999,
                    background: SETUP.field,
                    "& .MuiToggleButton-root": {
                      border: 0,
                      borderRadius: "999px !important",
                      px: 1.5,
                      py: 0.4,
                      fontWeight: 800,
                      textTransform: "none",
                      fontSize: "calc(12.5px * var(--app-font-scale, 1))",
                      color: SETUP.muted,
                    },
                    "& .Mui-selected, & .Mui-selected:hover": {
                      background: `${BOARD.green} !important`,
                      color: `${BOARD.chalk} !important`,
                    },
                  }}
                >
                  <ToggleButton value="overs" data-ga-click="match_length_mode_overs">
                    {t("Overs")}
                  </ToggleButton>
                  <ToggleButton value="balls" data-ga-click="match_length_mode_balls">
                    {t("Balls")}
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 3,
                  background: "#fff",
                  border: `1px solid ${SETUP.line}`,
                  boxShadow: "0 1px 2px rgba(15,46,37,0.06)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    data-ga-click="match_length_decrease"
                    aria-label={t("Decrease")}
                    onClick={() => stepLength(-1)}
                    disabled={Number(lengthValue) <= lengthMin}
                    sx={stepButtonSx}
                  >
                    <Remove />
                  </IconButton>
                  <Box sx={{ flex: 1, textAlign: "center", minWidth: 0 }}>
                    <TextField
                      id={matchLengthMode === "balls" ? "balls-input" : "overs-input"}
                      aria-label={
                        matchLengthMode === "balls"
                          ? t("Number of Balls")
                          : t("Number of Overs")
                      }
                      type="number"
                      value={lengthValue}
                      onChange={(e) => setLengthValue(Number(e.target.value))}
                      variant="standard"
                      required
                      InputProps={{ disableUnderline: true }}
                      inputProps={{
                        min: lengthMin,
                        max: lengthMax,
                        step: lengthStep,
                        inputMode: "numeric",
                        style: {
                          textAlign: "center",
                          fontWeight: 900,
                          fontSize: "calc(30px * var(--app-font-scale, 1))",
                          color: BOARD.green,
                          padding: 0,
                          MozAppearance: "textfield",
                        },
                      }}
                      sx={{
                        width: "100%",
                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                          WebkitAppearance: "none",
                          margin: 0,
                        },
                      }}
                    />
                    <Box sx={{ fontSize: "calc(12px * var(--app-font-scale, 1))", fontWeight: 700, color: SETUP.muted }}>
                      {matchLengthMode === "balls"
                        ? t("balls per innings")
                        : t("overs per innings")}
                    </Box>
                  </Box>
                  <IconButton
                    data-ga-click="match_length_increase"
                    aria-label={t("Increase")}
                    onClick={() => stepLength(1)}
                    disabled={Number(lengthValue) >= lengthMax}
                    sx={stepButtonSx}
                  >
                    <Add />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    mt: 1.25,
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 0.75,
                  }}
                >
                  {lengthPresets.map((preset) => {
                    const selected = Number(lengthValue) === preset;
                    return (
                      <Chip
                        key={`${matchLengthMode}-${preset}`}
                        data-ga-click={`match_length_preset_${matchLengthMode}_${preset}`}
                        label={preset}
                        onClick={() => setLengthValue(preset)}
                        sx={{
                          minWidth: 44,
                          fontWeight: 800,
                          fontSize: "calc(13px * var(--app-font-scale, 1))",
                          color: selected ? BOARD.chalk : BOARD.green,
                          background: selected ? BOARD.green : SETUP.field,
                          "&:hover": {
                            background: selected ? BOARD.green : SETUP.tintStrong,
                          },
                        }}
                      />
                    );
                  })}
                </Box>
                {matchLengthMode === "balls" && (
                  <Box
                    sx={{
                      mt: 1,
                      textAlign: "center",
                      fontSize: "calc(11.5px * var(--app-font-scale, 1))",
                      color: SETUP.muted,
                    }}
                  >
                    {t("In steps of {{step}} (e.g. 5, 10, 15, ...)", {
                      step: BALLS_STEP,
                    })}
                  </Box>
                )}
              </Box>
            </Box>

            {requirePlayerRoster && (
              <Box
                ref={playersSectionRef}
                component="label"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  p: 1.25,
                  pl: 1.5,
                  borderRadius: 3,
                  cursor: "pointer",
                  background: playerRosterEnabled ? SETUP.tint : "#fff",
                  border: `1px solid ${playerRosterEnabled ? SETUP.tintStrong : SETUP.line}`,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ ...sectionLabelSx }}>{t("Add players")}</Box>
                  <Box
                    sx={{
                      mt: 0.25,
                      fontSize: "calc(12px * var(--app-font-scale, 1))",
                      fontWeight: 600,
                      color: SETUP.muted,
                      lineHeight: 1.35,
                    }}
                  >
                    {playerRosterEnabled
                      ? t("Minimum {{count}} players per team.", {
                          count: MIN_PLAYERS_PER_TEAM,
                        })
                      : t("Optional. Track each player's runs and wickets.")}
                  </Box>
                </Box>
                <Switch
                  checked={playerRosterEnabled}
                  onChange={(event) => {
                    handlePlayerRosterToggle(event.target.checked);
                  }}
                  inputProps={{ "aria-label": t("Add players") }}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: BOARD.green },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: BOARD.green,
                      opacity: 0.55,
                    },
                  }}
                />
              </Box>
            )}
            {requirePlayerRoster && playerRosterEnabled && (
              <Box
                component="label"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  mt: -1,
                  p: 1.25,
                  pl: 1.5,
                  borderRadius: 3,
                  cursor: "pointer",
                  background: "#fff",
                  border: `1px solid ${SETUP.line}`,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={sectionLabelSx}>{t("Last batter can bat alone")}</Box>
                  <Box
                    sx={{
                      mt: 0.25,
                      fontSize: "calc(12px * var(--app-font-scale, 1))",
                      fontWeight: 600,
                      color: SETUP.muted,
                      lineHeight: 1.35,
                    }}
                  >
                    {t("Single player mode: when one batter is left, they keep batting with a dummy partner.")}
                  </Box>
                </Box>
                <Switch
                  data-ga-click="toggle_single_player_mode_setup"
                  checked={singlePlayerMode}
                  onChange={(event) => handleSinglePlayerModeToggle(event.target.checked)}
                  inputProps={{ "aria-label": t("Last batter can bat alone") }}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: BOARD.green },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: BOARD.green,
                      opacity: 0.55,
                    },
                  }}
                />
              </Box>
            )}
            {error && (
              <Box
                role="alert"
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  color: "#9b2c22",
                  background: "#fbecea",
                  border: "1px solid #f1c7c1",
                  fontWeight: 700,
                  fontSize: "calc(13px * var(--app-font-scale, 1))",
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
            className: "match-setup-toss",
            sx: {
              position: "relative",
              overflow: "hidden",
              borderRadius: 4,
              mb: 1,
              width: "min(92vw, 380px)",
            },
          }}
        >
          <Box
            sx={{
              position: "relative",
              px: 2.25,
              pt: 1.75,
              pb: 1.5,
              pr: 6,
              color: BOARD.chalk,
              background: `radial-gradient(120% 140% at 0% 0%, #1a4638 0%, ${BOARD.green} 55%, ${BOARD.greenDeep} 100%)`,
              borderBottom: `3px solid ${BOARD.gold}`,
            }}
          >
            <Box sx={{ fontWeight: 900, fontSize: "calc(17px * var(--app-font-scale, 1))" }}>
              {t("Toss")}
            </Box>
            <Box
              sx={{
                mt: 0.25,
                fontWeight: 600,
                fontSize: "calc(12.5px * var(--app-font-scale, 1))",
                color: "rgba(237,233,220,0.72)",
              }}
            >
              {coinFlipped && tossResult
                ? t("{{caller}} called {{side}}", {
                    caller: team2.trim() || t("Team 2"),
                    side: chosenSide === "Tails" ? t("tails") : t("heads"),
                  })
                : t("{{team}} flips, {{caller}} calls", {
                    team: team1.trim() || t("Team 1"),
                    caller: team2.trim() || t("Team 2"),
                  })}
            </Box>
            <IconButton
              size="small"
              onClick={handleCancelToss}
              aria-label={t("Close")}
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 32,
                height: 32,
                color: BOARD.chalk,
                background: "rgba(237,233,220,0.1)",
                border: "1px solid rgba(237,233,220,0.22)",
                "&:hover": { background: "rgba(237,233,220,0.2)" },
              }}
            >
              <CloseSharp fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ p: 2.25, textAlign: "center" }}>
            {/* The coin: shows the call while choosing, spins during the
                flip, then lands on the result. */}
            <Box
              role="button"
              tabIndex={!coinFlipped && chosenSide && !isAnimating ? 0 : -1}
              aria-label={t("Flip coin")}
              onClick={!coinFlipped ? startTossFlip : undefined}
              onKeyDown={(event) => {
                if (!coinFlipped && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  startTossFlip();
                }
              }}
              sx={{
                mx: "auto",
                width: 92,
                height: 92,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                fontWeight: 900,
                fontSize: "calc(30px * var(--app-font-scale, 1))",
                color: "#6b4f12",
                background: `radial-gradient(circle at 32% 28%, #fff4c9 0%, ${BOARD.goldLight} 28%, ${BOARD.gold} 62%, #a8822d 100%)`,
                boxShadow:
                  "inset 0 0 0 5px rgba(255,255,255,0.35), inset 0 -4px 8px rgba(107,79,18,0.35), 0 8px 18px rgba(15,46,37,0.22)",
                cursor: !coinFlipped && chosenSide && !isAnimating ? "pointer" : "default",
                opacity: !coinFlipped && !chosenSide ? 0.55 : 1,
                transition: "opacity 0.2s",
                animation: isAnimating ? "tossCoinSpin 0.45s linear infinite" : "none",
                "@keyframes tossCoinSpin": {
                  from: { transform: "rotateY(0deg)" },
                  to: { transform: "rotateY(360deg)" },
                },
                "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                "&:focus-visible": { outline: `3px solid ${BOARD.green}`, outlineOffset: 3 },
              }}
            >
              {isAnimating
                ? ""
                : coinFlipped && tossResult
                  ? tossResult === "Heads" ? t("H") : t("T")
                  : chosenSide === "Tails" ? t("T") : t("H")}
            </Box>

            {!coinFlipped && (
              <>
                <Box
                  sx={{
                    mt: 1.75,
                    fontWeight: 800,
                    fontSize: "calc(14px * var(--app-font-scale, 1))",
                    color: SETUP.ink,
                  }}
                >
                  {isAnimating
                    ? t("Flipping...")
                    : t("{{team}}, call it", { team: team2.trim() || t("Team 2") })}
                </Box>
                <Box
                  role="radiogroup"
                  aria-label={t("Call")}
                  sx={{
                    mt: 1.25,
                    p: 0.5,
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                    gap: 0.5,
                    borderRadius: 3,
                    background: SETUP.field,
                  }}
                >
                  {(["Heads", "Tails"] as const).map((side) => {
                    const selected = chosenSide === side;
                    return (
                      <Button
                        key={side}
                        role="radio"
                        aria-checked={selected}
                        data-ga-click={side === "Heads" ? "choose_heads" : "choose_tails"}
                        disabled={isAnimating}
                        onClick={() => setChosenSide(side)}
                        sx={{
                          height: 44,
                          borderRadius: 2.5,
                          textTransform: "none",
                          fontWeight: 900,
                          fontSize: "calc(15px * var(--app-font-scale, 1))",
                          color: selected ? `${BOARD.chalk} !important` : `${BOARD.green} !important`,
                          background: selected ? `${BOARD.green} !important` : "transparent",
                          boxShadow: selected ? "0 2px 6px rgba(15,46,37,0.25)" : "none",
                          "&:hover": { background: selected ? BOARD.green : SETUP.tintStrong },
                        }}
                      >
                        {side === "Heads" ? t("Heads") : t("Tails")}
                      </Button>
                    );
                  })}
                </Box>
                <Button
                  data-ga-click="flip_coin"
                  disabled={!chosenSide || isAnimating}
                  onClick={startTossFlip}
                  fullWidth
                  sx={{
                    mt: 1.5,
                    height: 48,
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: 900,
                    fontSize: "calc(15px * var(--app-font-scale, 1))",
                    color: `${BOARD.green} !important`,
                    background: `linear-gradient(180deg, ${BOARD.goldLight} 0%, ${BOARD.gold} 100%) !important`,
                    boxShadow: "0 4px 12px rgba(184,146,60,0.35)",
                    "&.Mui-disabled": { opacity: 0.45, boxShadow: "none" },
                  }}
                >
                  {chosenSide ? t("Flip coin") : t("Pick heads or tails first")}
                </Button>
              </>
            )}

            {coinFlipped && tossResult && (
              <>
                <Box
                  sx={{
                    mt: 1.5,
                    fontWeight: 900,
                    fontSize: "calc(22px * var(--app-font-scale, 1))",
                    color: BOARD.green,
                    lineHeight: 1.2,
                  }}
                >
                  {tossResult === "Heads" ? t("It's heads") : t("It's tails")}
                </Box>
                <Box
                  sx={{
                    mt: 0.5,
                    fontWeight: 700,
                    fontSize: "calc(14px * var(--app-font-scale, 1))",
                    color: SETUP.muted,
                  }}
                >
                  {t("{{team}} won the toss. What do they choose?", { team: tossTeam })}
                </Box>
                <Box sx={{ mt: 1.75, display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 1 }}>
                  {([
                    { choice: "bat", ga: "choose_bat_first", label: t("Bat first") },
                    { choice: "ball", ga: "choose_ball_first", label: t("Bowl first") },
                  ] as const).map((option) => (
                    <Button
                      key={option.choice}
                      data-ga-click={option.ga}
                      onClick={() => handleChooseBatBall(option.choice)}
                      sx={{
                        height: 52,
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 900,
                        fontSize: "calc(15px * var(--app-font-scale, 1))",
                        color: `${BOARD.green} !important`,
                        background: "#fff !important",
                        border: `1.5px solid ${SETUP.lineStrong}`,
                        "&:hover": { borderColor: BOARD.green, background: `${SETUP.tint} !important` },
                      }}
                    >
                      {option.label}
                    </Button>
                  ))}
                </Box>
                <Button
                  data-ga-click="toss_again"
                  onClick={() => {
                    setCoinFlipped(false);
                    setTossResult(null);
                    setShowCoin(false);
                    setChosenSide(null);
                  }}
                  sx={{
                    mt: 1,
                    textTransform: "none",
                    fontWeight: 700,
                    color: `${SETUP.muted} !important`,
                  }}
                >
                  {t("Redo the toss")}
                </Button>
              </>
            )}
          </Box>
        </Popover>
      </DialogContent>
      <Dialog
        open={Boolean(playerModalTeam)}
        onClose={() => setPlayerModalTeam(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            width: { xs: "calc(100vw - 16px)", sm: 480 },
            maxWidth: "calc(100vw - 16px)",
            m: "8px",
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                component="span"
                sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {t("{{team}} players", {
                  team: (playerModalTeam === "team1" ? team1 : team2) || t("Team"),
                })}
              </Box>
              <Box component="span" className="modal-subtitle">
                {currentModalPlayers.length >= MIN_PLAYERS_PER_TEAM
                  ? t("{{count}} players added", { count: currentModalPlayers.length })
                  : t("{{count}} of {{min}} players needed", {
                      count: currentModalPlayers.length,
                      min: MIN_PLAYERS_PER_TEAM,
                    })}
              </Box>
            </Box>
            <Box
              className="modal-keep-color"
              aria-hidden
              sx={{
                minWidth: 40,
                height: 40,
                px: 1,
                borderRadius: 999,
                display: "grid",
                placeItems: "center",
                fontWeight: 900,
                fontSize: "calc(17px * var(--app-font-scale, 1))",
                color: BOARD.green,
                background: `linear-gradient(180deg, ${BOARD.goldLight} 0%, ${BOARD.gold} 100%)`,
              }}
            >
              {currentModalPlayers.length}
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 1.75, sm: 2.25 }, pb: 1.5 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              autoFocus
              inputRef={addPlayerInputRef}
              value={newPlayerName}
              onChange={(e) => {
                setNewPlayerName(e.target.value);
                if (playerModalError) setPlayerModalError("");
              }}
              placeholder={t("Player name")}
              inputProps={{ "aria-label": t("Player name"), maxLength: 30 }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddPlayerFromModal();
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 44,
                  borderRadius: 2.5,
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
                flexShrink: 0,
                height: 44,
                px: 2,
                borderRadius: 2.5,
                fontWeight: 900,
              }}
            >
              {t("Add")}
            </Button>
          </Box>
          {playerModalError && (
            <Box
              role="alert"
              sx={{
                mt: 1,
                color: "#9b2c22",
                fontWeight: 700,
                fontSize: "calc(13px * var(--app-font-scale, 1))",
              }}
            >
              {playerModalError}
            </Box>
          )}
          {showPredefinedPlayers && (
            <Box sx={{ mt: 1.75 }}>
              <Box sx={{ fontWeight: 800, fontSize: "calc(12.5px * var(--app-font-scale, 1))", color: SETUP.muted, mb: 0.75 }}>
                {t("Predefined Players")}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.6,
                  maxHeight: 150,
                  overflowY: "auto",
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
                    icon={<Add />}
                    clickable
                    onClick={() => handleTogglePredefinedPlayer(player)}
                    sx={{
                      fontWeight: 700,
                      background: "#fff",
                      color: BOARD.green,
                      border: `1px dashed ${SETUP.lineStrong}`,
                      "& .MuiChip-icon": { color: BOARD.green, fontSize: 16 },
                      "&:hover": { background: SETUP.tint },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
          <Box sx={{ mt: 1.75 }}>
            {currentModalPlayers.length === 0 ? (
              <Box
                sx={{
                  py: 4,
                  px: 2,
                  textAlign: "center",
                  borderRadius: 3,
                  border: `1px dashed ${SETUP.lineStrong}`,
                  color: SETUP.muted,
                }}
              >
                <Box sx={{ fontWeight: 800, color: SETUP.ink, fontSize: "calc(14px * var(--app-font-scale, 1))" }}>
                  {t("No players yet")}
                </Box>
                <Box sx={{ mt: 0.5, fontSize: "calc(12.5px * var(--app-font-scale, 1))" }}>
                  {t("Type a name above and press Add. You need at least {{min}}.", {
                    min: MIN_PLAYERS_PER_TEAM,
                  })}
                </Box>
              </Box>
            ) : (
              <Box
                component="ol"
                className="app-scrollable"
                sx={{
                  m: 0,
                  p: 0,
                  listStyle: "none",
                  maxHeight: { xs: "42dvh", sm: 320 },
                  overflowY: "auto",
                  borderRadius: 3,
                  background: "#fff",
                  border: `1px solid ${SETUP.line}`,
                }}
              >
                {currentModalPlayers.map((player, index) => (
                  <Box
                    component="li"
                    key={player}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      pl: 1.5,
                      pr: 0.5,
                      minHeight: 46,
                      borderTop: index ? `1px solid ${SETUP.line}` : "none",
                    }}
                  >
                    <Box
                      sx={{
                        width: 26,
                        height: 26,
                        flexShrink: 0,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        fontWeight: 800,
                        fontSize: "calc(12px * var(--app-font-scale, 1))",
                        color: BOARD.green,
                        background: SETUP.field,
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        fontWeight: 700,
                        fontSize: "calc(14.5px * var(--app-font-scale, 1))",
                        color: SETUP.ink,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {player}
                    </Box>
                    <IconButton
                      data-ga-click="remove_player_from_modal"
                      aria-label={t("Remove {{name}}", { name: player })}
                      onClick={() => handleRemovePlayerFromModal(player)}
                      sx={{
                        color: SETUP.muted,
                        "&:hover": { color: "#9b2c22", background: "#fbecea" },
                      }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            data-ga-click="close_player_modal"
            onClick={() => setPlayerModalTeam(null)}
            variant="contained"
            fullWidth
            sx={{ height: 46, borderRadius: 2.5, fontWeight: 900, fontSize: "calc(15px * var(--app-font-scale, 1))" }}
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
            <AppSpinner size={22} />
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
          px: { xs: 1.5, sm: 2.25 },
          pt: 1.25,
          pb: 1.75,
          gap: 1,
          borderTop: `1px solid ${SETUP.line}`,
          background: "#fff",
          "& > :not(style) ~ :not(style)": { ml: 0 },
        }}
      >
        {step === 1 && (
          <Box
            sx={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: !showCoin && !showTossOptions ? "minmax(0, 1fr) 1.4fr" : "minmax(0, 1fr)",
              gap: 1,
            }}
          >
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
              variant="outlined"
              sx={{
                height: 48,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 800,
                fontSize: "calc(15px * var(--app-font-scale, 1))",
                whiteSpace: "nowrap",
                color: BOARD.green,
                borderColor: SETUP.lineStrong,
                background: "#fff",
                "&:hover": { borderColor: BOARD.green, background: SETUP.tint },
                "&.Mui-disabled": { color: BOARD.green, borderColor: SETUP.line, opacity: 0.6 },
              }}
            >
              {t("Toss first")}
            </Button>
            {!showCoin && !showTossOptions && (
              <Button
                data-ga-click="start_match"
                className="match-setup-start"
                onClick={handleSubmit}
                variant="contained"
                disableElevation
                sx={{
                  height: 48,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 900,
                  fontSize: "calc(15px * var(--app-font-scale, 1))",
                  whiteSpace: "nowrap",
                  color: BOARD.green,
                  background: `linear-gradient(180deg, ${BOARD.goldLight} 0%, ${BOARD.gold} 100%)`,
                  boxShadow: "0 4px 12px rgba(184,146,60,0.35)",
                  "&:hover": {
                    background: `linear-gradient(180deg, ${BOARD.gold} 0%, #c49f45 100%)`,
                    color: BOARD.green,
                  },
                }}
              >
                {t("Start match")}
              </Button>
            )}
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TeamNameModal;
