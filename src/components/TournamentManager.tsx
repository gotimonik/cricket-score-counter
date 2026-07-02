import React from "react";
import {
  AddRounded,
  CalendarMonthRounded,
  CheckCircleRounded,
  DeleteRounded,
  EditRounded,
  EmojiEventsRounded,
  GroupsRounded,
  HistoryRounded,
  InfoRounded,
  LeaderboardRounded,
  LoginRounded,
  PersonAddRounded,
  PlaceRounded,
  PlayArrowRounded,
  SaveRounded,
  SearchRounded,
  SportsCricketRounded,
  SyncRounded,
  TableChartRounded,
  ExpandMoreRounded,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";
import AuthService from "../services/AuthService";
import TeamLibraryService from "../services/TeamLibraryService";
import TournamentService from "../services/TournamentService";
import {
  getAvailableRoleOptions,
  getPlayerRoleIcon,
} from "../utils/playerRoles";
import { getTeamAvatarGradient } from "../utils/teamAvatar";
import type {
  TournamentBallType,
  TournamentFormat,
  TournamentInput,
  TournamentMatch,
  TournamentScorerSetup,
  TournamentRecord,
  TournamentSquadMode,
  TournamentStatus,
  TournamentTeam,
  TournamentTeamInput,
} from "../types/tournament";
import type { BallEvent, ScoreState } from "../types/cricket";
import type {
  SavedPlayerTeam,
  SavedPlayerTeamInput,
} from "../types/playerTeam";
import ConfirmDialog from "./ConfirmDialog";

type TeamFormState = TournamentTeamInput;

type PlayableFixture = {
  key: string;
  team1: TournamentTeam;
  team2: TournamentTeam;
  status?: string;
  matchId?: string;
};

const today = new Date().toISOString().slice(0, 10);
const TOURNAMENT_SCORER_SETUP_KEY = "cricket-tournament-scorer-setup";
const TOURNAMENT_RETURN_KEY = "cricket-tournament-return-id";
const MIN_SAVED_TEAM_PLAYERS = 8;
const CUSTOM_FIXTURE_KEY = "__custom-fixture__";

const getNextDate = (date: string) => {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return today;
  parsed.setDate(parsed.getDate() + 1);
  return parsed.toISOString().slice(0, 10);
};

const defaultTournamentForm: TournamentInput = {
  name: "",
  organizerName: "",
  startDate: today,
  endDate: today,
  location: "",
  logoUrl: "",
  ballType: "tennis",
  customBallType: "",
  oversPerMatch: 10,
  format: "league",
  status: "draft",
  squadMode: "teams_only",
};

const defaultTeamForm: TeamFormState = {
  name: "",
  logoUrl: "",
  captainName: "",
  contactNumber: "",
  players: [
    { name: "", role: "Captain", contactNumber: "" },
    { name: "", role: "Batsman", contactNumber: "" },
    { name: "", role: "Bowler", contactNumber: "" },
  ],
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    background: "#fff",
    "& fieldset": {
      borderColor: "rgba(12,53,88,0.22)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(12,53,88,0.42)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#0b7f61",
      borderWidth: 2,
    },
  },
  "& .MuiInputLabel-root": {
    color: "#526274",
    fontWeight: 700,
  },
} as const;

const sectionSx = {
  p: { xs: 2, sm: 2.5 },
  borderRadius: 2,
  border: "1px solid rgba(12,53,88,0.16)",
  background: "#fff",
  boxShadow: "0 10px 30px rgba(8, 26, 56, 0.08)",
} as const;

const primaryButtonSx = {
  borderRadius: 1.5,
  minHeight: 46,
  px: 2.2,
  color: "#fff !important",
  bgcolor: "#0b7f61",
  fontWeight: 900,
  textTransform: "none",
  boxShadow: "0 8px 18px rgba(11,127,97,0.24)",
  "&:hover": {
    bgcolor: "#096f55",
    boxShadow: "0 10px 22px rgba(11,127,97,0.28)",
  },
  "&.Mui-disabled": {
    color: "rgba(255,255,255,0.82) !important",
    bgcolor: "#7ba99b",
  },
  "& .MuiButton-startIcon, & .MuiSvgIcon-root": {
    color: "currentColor !important",
  },
} as const;

const blueButtonSx = {
  ...primaryButtonSx,
  bgcolor: "#185a9d",
  boxShadow: "0 8px 18px rgba(24,90,157,0.24)",
  "&:hover": {
    bgcolor: "#124b84",
    boxShadow: "0 10px 22px rgba(24,90,157,0.28)",
  },
} as const;

const softButtonSx = {
  borderRadius: 1.5,
  minHeight: 42,
  fontWeight: 850,
  textTransform: "none",
  color: "#0c3558",
  "& .MuiButton-startIcon, & .MuiSvgIcon-root": {
    color: "currentColor",
  },
} as const;

const dangerButtonSx = {
  ...softButtonSx,
  color: "#b42318",
  background: "rgba(180,35,24,0.06)",
  border: "1px solid rgba(180,35,24,0.18)",
  "&:hover": {
    borderColor: "rgba(180,35,24,0.32)",
    background: "rgba(180,35,24,0.1)",
  },
} as const;

const gridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
  gap: 1.5,
} as const;

const normalizeTournamentInput = (form: TournamentInput): TournamentInput => ({
  ...form,
  name: form.name.trim(),
  organizerName: form.organizerName.trim(),
  location: form.location.trim(),
  logoUrl: form.logoUrl?.trim(),
  customBallType: form.ballType === "custom" ? form.customBallType?.trim() : "",
  oversPerMatch: Math.max(1, Number(form.oversPerMatch) || 1),
});

const normalizeTeamInput = (form: TeamFormState): TournamentTeamInput => ({
  ...form,
  sourceTeamId: form.sourceTeamId,
  name: form.name.trim(),
  logoUrl: form.logoUrl?.trim(),
  captainName: form.captainName.trim(),
  contactNumber: form.contactNumber.trim(),
  players: form.players
    .map((player) => ({
      playerId: player.playerId,
      username: player.username,
      name: player.name.trim(),
      role: player.role?.trim(),
      contactNumber: player.contactNumber?.trim(),
    }))
    .filter((player) => player.name),
});

const formatLabel = (format: TournamentFormat) =>
  format === "league" ? "League" : "Knockout";

const statusLabel = (status: TournamentStatus) => {
  if (status === "active") return "Active";
  if (status === "completed") return "Completed";
  return "Draft";
};

const statusChipColors = (status: TournamentStatus) => {
  if (status === "active") return { bg: "rgba(11,127,97,0.12)", fg: "#0b7f61" };
  if (status === "completed")
    return { bg: "rgba(24,90,157,0.12)", fg: "#185a9d" };
  return { bg: "rgba(198,146,20,0.14)", fg: "#8a6200" };
};

const PLAYER_STAT_HEADER_LABELS: Record<string, string> = {
  M: "Matches played",
  Runs: "Runs scored",
  "4s": "Fours",
  "6s": "Sixes",
  Wkts: "Wickets taken",
};

const POINTS_TABLE_HEADER_LABELS: Record<string, string> = {
  P: "Played",
  W: "Won",
  L: "Lost",
  T: "Tied",
  Pts: "Points",
  RF: "Runs for",
  RA: "Runs against",
  NRR: "Net run rate",
};

const squadModeLabel = (mode?: TournamentSquadMode) =>
  mode === "with_players" ? "Teams with players" : "Teams only";

const ballTypeLabel = (ballType: TournamentBallType, custom?: string) => {
  if (ballType === "custom") return custom || "Custom";
  return ballType === "tennis" ? "Tennis" : "Leather";
};

const getTournamentStatus = (tournament: TournamentRecord) => {
  const now = new Date(today).getTime();
  const start = new Date(tournament.startDate).getTime();
  const end = new Date(tournament.endDate).getTime();

  if (Number.isFinite(start) && now < start) return "Getting ready";
  if (Number.isFinite(end) && now > end) return "Completed";
  return "Live window";
};

const getFixtureKey = (team1Id: string, team2Id: string) =>
  [team1Id, team2Id].sort().join("__");

const getEventTotalRuns = (event: BallEvent) =>
  event.extra_type === "no-ball-extra" ? event.value + 1 : event.value;

const getScoreSummary = (
  snapshot: ScoreState | null | undefined,
  teamName: string,
) => {
  const overs = snapshot?.recentEventsByTeams?.[teamName] ?? {};
  let runs = 0;
  let wickets = 0;
  let legalBalls = 0;

  Object.values(overs).forEach((events) => {
    events.forEach((event) => {
      runs += getEventTotalRuns(event);
      if (event.type === "wicket") wickets += 1;
      if (event.type !== "wide" && event.extra_type !== "no-ball-extra") {
        legalBalls += 1;
      }
    });
  });

  const oversText =
    legalBalls > 0 ? `${Math.floor(legalBalls / 6)}.${legalBalls % 6}` : "0.0";
  return `${runs}/${wickets} (${oversText})`;
};

// team1Name/team2Name can come back blank from the API when a team was
// removed from the tournament roster after the match was recorded. The
// scorer snapshot still knows both team names (and the events keyed by
// them), so fall back to that to recover whichever side is missing.
const getResolvedMatchTeamNames = (match: TournamentMatch): [string, string] => {
  const snapshotTeams = (match.snapshot?.teams ?? []).filter(
    (name): name is string => Boolean(name),
  );

  let team1Name = match.team1Name || "";
  let team2Name = match.team2Name || "";

  if (!team1Name) {
    team1Name =
      snapshotTeams.find((name) => name !== team2Name) ||
      snapshotTeams[0] ||
      "";
  }
  if (!team2Name) {
    team2Name =
      snapshotTeams.find((name) => name !== team1Name) ||
      snapshotTeams.find((name) => name !== match.team1Name) ||
      "";
  }

  return [team1Name, team2Name];
};

const TournamentManager: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState(() =>
    AuthService.isLoggedIn(),
  );
  const [tournaments, setTournaments] = React.useState<TournamentRecord[]>([]);
  const [savedPlayerTeams, setSavedPlayerTeams] = React.useState<
    SavedPlayerTeam[]
  >([]);
  const [selectedTournamentId, setSelectedTournamentId] = React.useState("");
  const [tournamentSearchQuery, setTournamentSearchQuery] =
    React.useState("");
  const [tournamentForm, setTournamentForm] = React.useState<TournamentInput>(
    defaultTournamentForm,
  );
  const [showTournamentForm, setShowTournamentForm] = React.useState(false);
  const [teamForm, setTeamForm] =
    React.useState<TeamFormState>(defaultTeamForm);
  const [editingTournamentId, setEditingTournamentId] = React.useState("");
  const [savingTournament, setSavingTournament] = React.useState(false);
  const [savingTeam, setSavingTeam] = React.useState(false);
  const [editingTeamId, setEditingTeamId] = React.useState("");
  const [deletingTarget, setDeletingTarget] = React.useState<
    | { type: "tournament"; id: string; name: string }
    | { type: "team"; id: string; name: string }
    | null
  >(null);
  const [updatingStatus, setUpdatingStatus] = React.useState(false);
  const [syncingStats, setSyncingStats] = React.useState(false);
  const [selectedSavedTeamId, setSelectedSavedTeamId] = React.useState("");
  const [saveTeamForLater, setSaveTeamForLater] = React.useState(true);
  const teamFormRef = React.useRef<HTMLFormElement | null>(null);
  const teamNameInputRef = React.useRef<HTMLInputElement | null>(null);
  const [startingMatchId, setStartingMatchId] = React.useState("");
  const [selectedFixtureKey, setSelectedFixtureKey] = React.useState("");
  const [customTeam1Id, setCustomTeam1Id] = React.useState("");
  const [customTeam2Id, setCustomTeam2Id] = React.useState("");
  const [fixtureToStart, setFixtureToStart] =
    React.useState<PlayableFixture | null>(null);
  const [tossWinnerTeamId, setTossWinnerTeamId] = React.useState("");
  const [tossDecision, setTossDecision] = React.useState<"bat" | "bowl">("bat");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const filteredTournaments = React.useMemo(() => {
    const query = tournamentSearchQuery.trim().toLowerCase();
    if (!query) return tournaments;
    return tournaments.filter((tournament) =>
      tournament.name.toLowerCase().includes(query),
    );
  }, [tournaments, tournamentSearchQuery]);

  const selectedTournament = React.useMemo(
    () =>
      tournaments.find(
        (tournament) => tournament.id === selectedTournamentId,
      ) ?? tournaments[0],
    [selectedTournamentId, tournaments],
  );
  const selectedTeams = React.useMemo(
    () => selectedTournament?.teams ?? [],
    [selectedTournament],
  );
  const selectedTournamentUsesPlayers =
    selectedTournament?.squadMode === "with_players";
  const savedTeamStatusById = React.useMemo(() => {
    const status = new Map<string, boolean>();
    const selectedTeamNameKeys = new Set(
      selectedTeams.map((team) => team.name.trim().toLowerCase()),
    );
    const selectedTeamPlayerIdSets = selectedTeams.map(
      (team) =>
        new Set(
          (team.players ?? []).map((player) => player.playerId).filter(Boolean),
        ),
    );

    savedPlayerTeams.forEach((savedTeam) => {
      const savedPlayerIds = savedTeam.players
        .map((player) => player.playerId)
        .filter(Boolean);
      const alreadyAddedByName = selectedTeamNameKeys.has(
        savedTeam.name.trim().toLowerCase(),
      );
      const alreadyAddedByPlayers =
        savedPlayerIds.length > 0 &&
        selectedTeamPlayerIdSets.some(
          (teamPlayerIds) =>
            teamPlayerIds.size > 0 &&
            savedPlayerIds.every((playerId) => teamPlayerIds.has(playerId)),
        );
      status.set(savedTeam.id, alreadyAddedByName || alreadyAddedByPlayers);
    });

    return status;
  }, [savedPlayerTeams, selectedTeams]);
  const pointsTable = React.useMemo(
    () =>
      selectedTeams
        .map((team) => ({
          teamId: team.id,
          teamName: team.name,
          played: team.statistics?.matchesPlayed ?? team.stats?.played ?? 0,
          won: team.statistics?.wins ?? team.stats?.won ?? 0,
          lost: team.statistics?.losses ?? team.stats?.lost ?? 0,
          tied: team.statistics?.ties ?? 0,
          points: team.statistics?.points ?? team.stats?.points ?? 0,
          runsFor: team.statistics?.runsFor ?? 0,
          runsAgainst: team.statistics?.runsAgainst ?? 0,
          netRunRate:
            team.statistics?.netRunRate ?? team.stats?.netRunRate ?? 0,
        }))
        .sort(
          (a, b) =>
            b.points - a.points ||
            b.netRunRate - a.netRunRate ||
            b.won - a.won ||
            a.teamName.localeCompare(b.teamName),
        ),
    [selectedTeams],
  );
  const playerLeaderboard = React.useMemo(
    () =>
      selectedTeams
        .flatMap((team) =>
          (team.players ?? []).map((player) => ({
            id: player.playerId || player.id,
            name: player.name,
            username: player.username ?? "",
            teamName: team.name,
            role: player.role ?? "",
            matchesPlayed: player.statistics?.matchesPlayed ?? 0,
            runs: player.statistics?.runs ?? 0,
            ballsFaced: player.statistics?.ballsFaced ?? 0,
            fours: player.statistics?.fours ?? 0,
            sixes: player.statistics?.sixes ?? 0,
            wickets: player.statistics?.wickets ?? 0,
            ballsBowled: player.statistics?.ballsBowled ?? 0,
            runsConceded: player.statistics?.runsConceded ?? 0,
          })),
        )
        .sort(
          (a, b) =>
            b.runs - a.runs ||
            b.wickets - a.wickets ||
            a.name.localeCompare(b.name),
        ),
    [selectedTeams],
  );
  const playerStatsByTeam = React.useMemo(
    () =>
      selectedTeams
        .map((team) => ({
          teamId: team.id,
          teamName: team.name,
          players: playerLeaderboard.filter(
            (player) => player.teamName === team.name,
          ),
        }))
        .filter((team) => team.players.length > 0),
    [playerLeaderboard, selectedTeams],
  );
  const playableFixtures = React.useMemo(() => {
    const fixtures: PlayableFixture[] = [];
    const matches = selectedTournament?.matches ?? [];

    for (let i = 0; i < selectedTeams.length; i += 1) {
      for (let j = i + 1; j < selectedTeams.length; j += 1) {
        const team1 = selectedTeams[i];
        const team2 = selectedTeams[j];
        const key = getFixtureKey(team1.id, team2.id);
        const match = matches.find(
          (candidate) =>
            getFixtureKey(candidate.team1Id, candidate.team2Id) === key,
        );
        if (match?.status === "completed") continue;
        fixtures.push({
          key,
          team1,
          team2,
          status: match?.status,
          matchId: match?.id,
        });
      }
    }

    return fixtures;
  }, [selectedTeams, selectedTournament]);
  const isCustomFixtureSelected = selectedFixtureKey === CUSTOM_FIXTURE_KEY;
  const selectedFixture = React.useMemo(() => {
    if (isCustomFixtureSelected) return undefined;
    return (
      playableFixtures.find((fixture) => fixture.key === selectedFixtureKey) ??
      playableFixtures[0]
    );
  }, [isCustomFixtureSelected, playableFixtures, selectedFixtureKey]);
  const selectedCustomFixtureTeams = React.useMemo(
    () => ({
      team1: selectedTeams.find((team) => team.id === customTeam1Id),
      team2: selectedTeams.find((team) => team.id === customTeam2Id),
    }),
    [customTeam1Id, customTeam2Id, selectedTeams],
  );
  const canStartSelectedFixture = isCustomFixtureSelected
    ? Boolean(
        selectedCustomFixtureTeams.team1 &&
        selectedCustomFixtureTeams.team2 &&
        selectedCustomFixtureTeams.team1.id !==
          selectedCustomFixtureTeams.team2.id,
      )
    : Boolean(selectedFixture);
  const selectedFixtureActionLabel = isCustomFixtureSelected
    ? "Schedule match"
    : selectedFixture?.status === "in_progress"
      ? "Resume match"
      : "Start match";
  const selectedFixtureLoadingKey = isCustomFixtureSelected
    ? CUSTOM_FIXTURE_KEY
    : selectedFixture?.key;
  const selectedFixtureButtonDisabled =
    !canStartSelectedFixture || Boolean(startingMatchId);
  const shouldShowFixturePicker = selectedTeams.length >= 2;
  const hasOnlyCustomFixtures =
    shouldShowFixturePicker && playableFixtures.length === 0;
  const customTeam2Options = React.useMemo(
    () => selectedTeams.filter((team) => team.id !== customTeam1Id),
    [customTeam1Id, selectedTeams],
  );
  const completedMatches = React.useMemo(
    () =>
      (selectedTournament?.matches ?? [])
        .filter((match) => match.status === "completed")
        .sort((a, b) =>
          (b.completedAt ?? b.updatedAt).localeCompare(
            a.completedAt ?? a.updatedAt,
          ),
        ),
    [selectedTournament],
  );
  const refreshTournaments = React.useCallback(async () => {
    if (!AuthService.isLoggedIn()) {
      setTournaments([]);
      setSavedPlayerTeams([]);
      setSelectedTournamentId("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const [records, libraryTeams] = await Promise.all([
        TournamentService.getTournaments(),
        TeamLibraryService.getTeams().catch(() => []),
      ]);
      const returnTournamentId = sessionStorage.getItem(TOURNAMENT_RETURN_KEY);
      if (returnTournamentId) {
        sessionStorage.removeItem(TOURNAMENT_RETURN_KEY);
      }
      setTournaments(records);
      setSavedPlayerTeams(libraryTeams);
      setSelectedTournamentId((current) =>
        returnTournamentId &&
        records.some((record) => record.id === returnTournamentId)
          ? returnTournamentId
          : records.some((record) => record.id === current)
            ? current
            : records[0]?.id || "",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load tournaments right now.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refreshTournaments();
    return AuthService.subscribe(() => {
      setIsLoggedIn(AuthService.isLoggedIn());
      void refreshTournaments();
    });
  }, [refreshTournaments]);

  React.useEffect(() => {
    if (!loading && isLoggedIn && tournaments.length === 0) {
      setShowTournamentForm(true);
    }
  }, [isLoggedIn, loading, tournaments.length]);

  React.useEffect(() => {
    setSelectedFixtureKey((current) =>
      current === CUSTOM_FIXTURE_KEY && selectedTeams.length >= 2
        ? current
        : playableFixtures.some((fixture) => fixture.key === current)
          ? current
          : playableFixtures[0]?.key ||
            (selectedTeams.length >= 2 ? CUSTOM_FIXTURE_KEY : ""),
    );
  }, [playableFixtures, selectedTeams.length]);

  React.useEffect(() => {
    setCustomTeam1Id((current) =>
      selectedTeams.some((team) => team.id === current)
        ? current
        : selectedTeams[0]?.id || "",
    );
    setCustomTeam2Id((current) => {
      const currentTeamAvailable = selectedTeams.some(
        (team) => team.id === current && team.id !== customTeam1Id,
      );
      if (currentTeamAvailable) return current;
      return selectedTeams.find((team) => team.id !== customTeam1Id)?.id || "";
    });
  }, [customTeam1Id, selectedTeams]);

  React.useEffect(() => {
    setEditingTeamId("");
    setTeamForm(defaultTeamForm);
    setSelectedSavedTeamId("");
    setSaveTeamForLater(true);
    setCustomTeam1Id("");
    setCustomTeam2Id("");
  }, [selectedTournamentId]);

  React.useEffect(() => {
    if (!fixtureToStart) return;
    setTossWinnerTeamId(fixtureToStart.team1.id);
    setTossDecision("bat");
  }, [fixtureToStart]);

  const updateTournamentField = <K extends keyof TournamentInput>(
    field: K,
    value: TournamentInput[K],
  ) => {
    setTournamentForm((current) => ({ ...current, [field]: value }));
  };

  const updateTeamField = <K extends keyof TeamFormState>(
    field: K,
    value: TeamFormState[K],
  ) => {
    setTeamForm((current) => ({ ...current, [field]: value }));
  };

  const updatePlayerField = (
    index: number,
    field: "name" | "role" | "contactNumber",
    value: string,
  ) => {
    setTeamForm((current) => ({
      ...current,
      players: (current.players ?? []).map((player, playerIndex) =>
        playerIndex === index ? { ...player, [field]: value } : player,
      ),
    }));
  };

  const addPlayerRow = () => {
    setTeamForm((current) => ({
      ...current,
      players: [...(current.players ?? []), { name: "", role: "" }],
    }));
  };

  const removePlayerRow = (index: number) => {
    setTeamForm((current) => ({
      ...current,
      players: (current.players ?? []).filter(
        (_, playerIndex) => playerIndex !== index,
      ),
    }));
  };

  const applySavedTeam = (teamId: string) => {
    setSelectedSavedTeamId(teamId);
    const savedTeam = savedPlayerTeams.find((team) => team.id === teamId);
    if (!savedTeam) {
      setTeamForm((current) => ({ ...current, sourceTeamId: undefined }));
      setSaveTeamForLater(true);
      return;
    }

    setSaveTeamForLater(false);
    setTeamForm({
      sourceTeamId: savedTeam.id,
      name: savedTeam.name,
      logoUrl: savedTeam.logoUrl ?? "",
      captainName: savedTeam.captainName,
      contactNumber: savedTeam.contactNumber,
      players: savedTeam.players.map((player) => ({
        playerId: player.playerId,
        username: player.username,
        name: player.name,
        role: player.role ?? "",
        contactNumber: player.contactNumber ?? "",
      })),
    });
  };

  // Supports the "Use in Tournament" shortcut on My Teams: arrives via
  // navigate("/tournaments", { state: { focusSavedTeamId } }) and, once a
  // players-enabled tournament is selected, preselects that saved team in
  // the Register Team form so the user only has to click Register.
  const pendingFocusTeamIdRef = React.useRef<string | undefined>(
    (location.state as { focusSavedTeamId?: string } | null)?.focusSavedTeamId,
  );

  React.useEffect(() => {
    const teamId = pendingFocusTeamIdRef.current;
    if (!teamId || loading || !isLoggedIn || !selectedTournament) return;

    if (!selectedTournamentUsesPlayers) {
      // Nothing more we can do for a team-only tournament; stop watching.
      pendingFocusTeamIdRef.current = undefined;
      return;
    }

    const alreadyAdded = savedTeamStatusById.get(teamId) ?? false;
    const isAvailable = savedPlayerTeams.some((team) => team.id === teamId);
    if (isAvailable && !alreadyAdded) {
      applySavedTeam(teamId);
    }
    pendingFocusTeamIdRef.current = undefined;
    navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loading,
    isLoggedIn,
    selectedTournament,
    selectedTournamentUsesPlayers,
    savedTeamStatusById,
    savedPlayerTeams,
  ]);

  const handleSaveTournament = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = normalizeTournamentInput(tournamentForm);
    if (!payload.name || !payload.organizerName || !payload.location) {
      setError("Please add tournament name, organizer name, and location.");
      return;
    }
    if (payload.startDate < today) {
      setError("Start date should be today or a future date.");
      return;
    }
    if (payload.endDate < payload.startDate) {
      setError("End date should be after the start date.");
      return;
    }

    setSavingTournament(true);
    setError("");
    setSuccess("");
    try {
      const saved = editingTournamentId
        ? await TournamentService.updateTournament(editingTournamentId, payload)
        : await TournamentService.createTournament(payload);
      await refreshTournaments();
      setSelectedTournamentId(saved.id);
      setEditingTournamentId("");
      setTournamentForm(defaultTournamentForm);
      setShowTournamentForm(false);
      setSuccess(
        editingTournamentId
          ? "Tournament updated successfully."
          : "Tournament created successfully.",
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save tournament.",
      );
    } finally {
      setSavingTournament(false);
    }
  };

  const handleEditTournament = (tournament: TournamentRecord) => {
    setEditingTournamentId(tournament.id);
    setShowTournamentForm(true);
    setTournamentForm({
      name: tournament.name,
      organizerName: tournament.organizerName,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      location: tournament.location,
      logoUrl: tournament.logoUrl ?? "",
      ballType: tournament.ballType,
      customBallType: tournament.customBallType ?? "",
      oversPerMatch: tournament.oversPerMatch,
      format: tournament.format,
      status: tournament.status,
      squadMode: tournament.squadMode,
    });
    setSuccess("");
    setError("");
  };

  const handleEditTeam = (team: TournamentTeam) => {
    setEditingTeamId(team.id);
    setTeamForm({
      name: team.name,
      logoUrl: team.logoUrl ?? "",
      captainName: team.captainName,
      contactNumber: team.contactNumber,
      players: (team.players ?? []).map((player) => ({
        playerId: player.playerId,
        username: player.username,
        name: player.name,
        role: player.role ?? "",
        contactNumber: player.contactNumber ?? "",
      })),
    });
    setSelectedSavedTeamId("");
    setSaveTeamForLater(false);
    setSuccess("");
    setError("");
    // The Edit team form lives above the Registered teams list, so users
    // clicking Edit down here won't otherwise notice it switched into edit
    // mode. Bring it into view and focus the first field.
    requestAnimationFrame(() => {
      teamFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      teamNameInputRef.current?.focus();
    });
  };

  const buildSavedTeamInput = (
    payload: TournamentTeamInput,
  ): SavedPlayerTeamInput => ({
    name: payload.name,
    logoUrl: payload.logoUrl,
    players: payload.players.map((player, index) => ({
      playerId: player.playerId,
      username: player.username,
      name: player.name,
      role: index === 0 ? "Captain" : player.role,
      contactNumber: player.contactNumber,
    })),
  });

  const handleSaveTeam = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedTournament) {
      setError("Create a tournament before adding teams.");
      return;
    }

    const payload = normalizeTeamInput(teamForm);
    if (!payload.name || !payload.captainName) {
      setError("Please add team name, captain name, and contact number.");
      return;
    }
    if (selectedTournamentUsesPlayers && payload.players.length === 0) {
      setError("Please add at least one player.");
      return;
    }
    if (
      selectedTournamentUsesPlayers &&
      !selectedSavedTeamId &&
      saveTeamForLater &&
      payload.players.length < MIN_SAVED_TEAM_PLAYERS
    ) {
      setError(
        `Add at least ${MIN_SAVED_TEAM_PLAYERS} players to save this team for later, or uncheck that option.`,
      );
      return;
    }

    const teamPayload = selectedTournamentUsesPlayers
      ? payload
      : { ...payload, players: [] };

    setSavingTeam(true);
    setError("");
    setSuccess("");
    try {
      let savedForLater = false;
      let saveForLaterMessage = "";
      if (editingTeamId) {
        await TournamentService.updateTeam(
          selectedTournament.id,
          editingTeamId,
          {
            name: teamPayload.name,
            logoUrl: teamPayload.logoUrl,
            captainName: teamPayload.captainName,
            contactNumber: teamPayload.contactNumber,
          },
        );
        if (selectedTournamentUsesPlayers) {
          await TournamentService.updateTeamPlayers(
            selectedTournament.id,
            editingTeamId,
            teamPayload.players,
          );
        }
      } else {
        await TournamentService.addTeam(selectedTournament.id, teamPayload);
      }
      if (
        selectedTournamentUsesPlayers &&
        !selectedSavedTeamId &&
        saveTeamForLater
      ) {
        try {
          await TeamLibraryService.createTeam(buildSavedTeamInput(teamPayload));
          savedForLater = true;
        } catch (libraryError) {
          saveForLaterMessage =
            libraryError instanceof Error
              ? ` ${libraryError.message}`
              : " Unable to save this team for later.";
        }
      }
      await refreshTournaments();
      setTeamForm(defaultTeamForm);
      setEditingTeamId("");
      setSelectedSavedTeamId("");
      setSaveTeamForLater(true);
      setSuccess(
        editingTeamId
          ? `Team updated successfully.${savedForLater ? " Saved for later too." : saveForLaterMessage}`
          : `Team registered successfully.${savedForLater ? " Saved for later too." : saveForLaterMessage}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save team.");
    } finally {
      setSavingTeam(false);
    }
  };

  const handleTournamentStatusChange = async (status: TournamentStatus) => {
    if (!selectedTournament || selectedTournament.status === status) return;

    setUpdatingStatus(true);
    setError("");
    setSuccess("");
    try {
      const saved = await TournamentService.updateTournament(
        selectedTournament.id,
        { status },
      );
      await refreshTournaments();
      setSelectedTournamentId(saved.id);
      setSuccess(`Tournament marked as ${statusLabel(status)}.`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update tournament status.",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingTarget) return;

    setError("");
    setSuccess("");
    try {
      if (deletingTarget.type === "tournament") {
        await TournamentService.deleteTournament(deletingTarget.id);
        await refreshTournaments();
        setEditingTournamentId("");
        setSuccess("Tournament deleted successfully.");
      } else if (selectedTournament) {
        await TournamentService.deleteTeam(
          selectedTournament.id,
          deletingTarget.id,
        );
        await refreshTournaments();
        if (editingTeamId === deletingTarget.id) {
          setEditingTeamId("");
          setTeamForm(defaultTeamForm);
        }
        setSuccess("Team deleted successfully.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete this item.",
      );
    } finally {
      setDeletingTarget(null);
    }
  };

  const handleLogin = () => {
    navigate("/login", {
      state: { next_redirect: location.pathname },
    });
  };

  const handleSyncStatistics = async () => {
    if (!selectedTournament) return;

    setSyncingStats(true);
    setError("");
    setSuccess("");
    try {
      const syncedTournament = await TournamentService.syncStatistics(
        selectedTournament.id,
      );
      setTournaments((current) =>
        current.map((tournament) =>
          tournament.id === syncedTournament.id ? syncedTournament : tournament,
        ),
      );
      setSelectedTournamentId(syncedTournament.id);
      await refreshTournaments();
      setSuccess("Points table synced from completed matches.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sync tournament statistics.",
      );
    } finally {
      setSyncingStats(false);
    }
  };

  const handleStartFixture = async () => {
    if (!selectedTournament) {
      setError("Select a tournament before starting a fixture.");
      return;
    }

    if (isCustomFixtureSelected) {
      const { team1, team2 } = selectedCustomFixtureTeams;
      if (!team1 || !team2 || team1.id === team2.id) {
        setError("Select two different teams for the custom fixture.");
        return;
      }

      setFixtureToStart({
        key: CUSTOM_FIXTURE_KEY,
        team1,
        team2,
      });
      setError("");
      setSuccess("");
      return;
    }

    if (!selectedFixture) {
      setError("Select a tournament fixture to start.");
      return;
    }

    if (selectedFixture.status === "in_progress" && selectedFixture.matchId) {
      setStartingMatchId(selectedFixture.key);
      setError("");
      setSuccess("");
      try {
        const setup: TournamentScorerSetup = {
          tournamentId: selectedTournament.id,
          tournamentName: selectedTournament.name,
          tournamentMatchId: selectedFixture.matchId,
          resumeMatch: true,
          oversPerMatch: selectedTournament.oversPerMatch,
          battingFirstTeamId: selectedFixture.team1.id,
          battingFirstTeamName: selectedFixture.team1.name,
          team1: {
            id: selectedFixture.team1.id,
            name: selectedFixture.team1.name,
            players: selectedTournamentUsesPlayers
              ? (selectedFixture.team1.players ?? []).map(
                  (player) => player.name,
                )
              : [],
          },
          team2: {
            id: selectedFixture.team2.id,
            name: selectedFixture.team2.name,
            players: selectedTournamentUsesPlayers
              ? (selectedFixture.team2.players ?? []).map(
                  (player) => player.name,
                )
              : [],
          },
        };
        sessionStorage.setItem(
          TOURNAMENT_SCORER_SETUP_KEY,
          JSON.stringify(setup),
        );
        navigate(
          `/create-game?resume=${encodeURIComponent(
            selectedFixture.matchId,
          )}&tournamentId=${encodeURIComponent(selectedTournament.id)}`,
        );
      } finally {
        setStartingMatchId("");
      }
      return;
    }

    setFixtureToStart(selectedFixture);
    setError("");
    setSuccess("");
  };

  const handleConfirmStartFixture = async () => {
    if (!selectedTournament || !fixtureToStart || !tossWinnerTeamId) {
      setError("Select toss winner and batting decision.");
      return;
    }

    const tossWinner =
      fixtureToStart.team1.id === tossWinnerTeamId
        ? fixtureToStart.team1
        : fixtureToStart.team2;
    const tossLoser =
      fixtureToStart.team1.id === tossWinnerTeamId
        ? fixtureToStart.team2
        : fixtureToStart.team1;
    const battingFirst = tossDecision === "bat" ? tossWinner : tossLoser;

    setStartingMatchId(fixtureToStart.key);
    setError("");
    setSuccess("");
    try {
      const tournamentMatchId =
        fixtureToStart.status === "in_progress" && fixtureToStart.matchId
          ? fixtureToStart.matchId
          : (
              await TournamentService.startMatch(selectedTournament.id, {
                team1Id: fixtureToStart.team1.id,
                team2Id: fixtureToStart.team2.id,
                tossWinnerTeamId,
                tossDecision,
                battingFirstTeamId: battingFirst.id,
              })
            ).id;
      const setup: TournamentScorerSetup = {
        tournamentId: selectedTournament.id,
        tournamentName: selectedTournament.name,
        tournamentMatchId,
        resumeMatch: false,
        oversPerMatch: selectedTournament.oversPerMatch,
        battingFirstTeamId: battingFirst.id,
        battingFirstTeamName: battingFirst.name,
        team1: {
          id: fixtureToStart.team1.id,
          name: fixtureToStart.team1.name,
          players: selectedTournamentUsesPlayers
            ? (fixtureToStart.team1.players ?? []).map((player) => player.name)
            : [],
        },
        team2: {
          id: fixtureToStart.team2.id,
          name: fixtureToStart.team2.name,
          players: selectedTournamentUsesPlayers
            ? (fixtureToStart.team2.players ?? []).map((player) => player.name)
            : [],
        },
      };
      sessionStorage.setItem(
        TOURNAMENT_SCORER_SETUP_KEY,
        JSON.stringify(setup),
      );
      setFixtureToStart(null);
      navigate(
        `/create-game?tournamentSetup=${encodeURIComponent(tournamentMatchId)}`,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to start this match.",
      );
    } finally {
      setStartingMatchId("");
    }
  };

  const totalPlayers =
    selectedTeams.reduce((sum, team) => sum + (team.players?.length ?? 0), 0) ??
    0;

  return (
    <>
      <MetaHelmet
        pageTitle="Tournament Management"
        canonical={location.pathname}
        description="Create cricket tournaments, register teams, add players, and prepare league or knockout fixtures."
      />
      <AppBar showHomeMenuItem />
      <Box
        sx={{
          minHeight: "calc(100dvh - 88px)",
          py: { xs: 2.5, sm: 4 },
          px: { xs: 1.4, sm: 2.5 },
          background: "#f3f8fb",
        }}
      >
        <Box sx={{ maxWidth: 1180, mx: "auto" }}>
          <PageTitleWithBack
            titleSx={{
              fontSize: {
                xs: "calc(25px * var(--app-font-scale, 1))",
                sm: "calc(34px * var(--app-font-scale, 1))",
              },
              fontWeight: 900,
              color: "var(--app-accent-text, #185a9d)",
            }}
          >
            Tournament Manager
          </PageTitleWithBack>

          <Paper
            elevation={0}
            sx={{
              ...sectionSx,
              mb: 2,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "stretch", md: "center" },
              justifyContent: "space-between",
              gap: 1.5,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 900, color: "#0c3558", mb: 0.5 }}
              >
                Launch a local cricket tournament
              </Typography>
              <Typography sx={{ color: "#526274", fontWeight: 600 }}>
                Start with League or Knockout, register teams, and keep a clean
                player list for each captain.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                icon={<EmojiEventsRounded />}
                label="League"
                variant="outlined"
                sx={{
                  fontWeight: 800,
                  color: "#0b7f61",
                  borderColor: "rgba(11,127,97,0.35)",
                  bgcolor: "rgba(11,127,97,0.06)",
                  "& .MuiChip-icon": { color: "#0b7f61" },
                }}
              />
              <Chip
                icon={<SportsCricketRounded />}
                label="Knockout"
                variant="outlined"
                sx={{
                  fontWeight: 800,
                  color: "#185a9d",
                  borderColor: "rgba(24,90,157,0.35)",
                  bgcolor: "rgba(24,90,157,0.06)",
                  "& .MuiChip-icon": { color: "#185a9d" },
                }}
              />
              <Chip
                icon={<GroupsRounded />}
                label={`${totalPlayers} players`}
                sx={{
                  fontWeight: 800,
                  color: "#0c3558",
                  bgcolor: "rgba(12,53,88,0.08)",
                  "& .MuiChip-icon": { color: "#0c3558" },
                }}
              />
            </Stack>
          </Paper>

          {!isLoggedIn && (
            <Alert
              severity="info"
              action={
                <Button
                  startIcon={<LoginRounded />}
                  onClick={handleLogin}
                  size="small"
                  sx={{ fontWeight: 900 }}
                >
                  Login
                </Button>
              }
              sx={{ mb: 2, borderRadius: 2 }}
            >
              Tournament features are available for logged in users only.
            </Alert>
          )}

          {!isLoggedIn && (
            <Paper elevation={0} sx={sectionSx}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 900, color: "#0c3558", mb: 0.5 }}
              >
                Login to manage tournaments
              </Typography>
              <Typography sx={{ color: "#526274", fontWeight: 600, mb: 2 }}>
                Create tournaments, register teams, and start tournament matches
                from your account.
              </Typography>
              <Button
                variant="contained"
                startIcon={<LoginRounded />}
                onClick={handleLogin}
                sx={primaryButtonSx}
              >
                Login
              </Button>
            </Paper>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              {success}
            </Alert>
          )}

          {isLoggedIn && (
            <Box sx={{ maxWidth: 980, mx: "auto" }}>
              <Stack spacing={2}>
                <Paper elevation={0} sx={sectionSx}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                    spacing={1.2}
                    sx={{ mb: 1.5 }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 900, color: "#0c3558" }}
                      >
                        Tournaments
                      </Typography>
                      {tournaments.length > 0 && (
                        <Chip
                          size="small"
                          label={tournaments.length}
                          sx={{
                            fontWeight: 900,
                            bgcolor: "rgba(24,90,157,0.12)",
                            color: "#185a9d",
                          }}
                        />
                      )}
                    </Stack>
                    {tournaments.length > 3 && (
                      <TextField
                        placeholder="Search tournaments"
                        size="small"
                        value={tournamentSearchQuery}
                        onChange={(event) =>
                          setTournamentSearchQuery(event.target.value)
                        }
                        sx={{ ...fieldSx, width: { xs: "100%", sm: 240 } }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchRounded
                                fontSize="small"
                                sx={{ color: "#526274" }}
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  </Stack>

                  {loading ? (
                    <Stack alignItems="center" sx={{ py: 3 }}>
                      <CircularProgress />
                    </Stack>
                  ) : tournaments.length === 0 ? (
                    <Stack
                      alignItems="center"
                      spacing={1.2}
                      sx={{
                        py: 4,
                        px: 2,
                        borderRadius: 2,
                        border: "1.5px dashed rgba(12,53,88,0.2)",
                        background: "rgba(24,90,157,0.03)",
                        textAlign: "center",
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 52,
                          height: 52,
                          bgcolor: "rgba(24,90,157,0.1)",
                          color: "#185a9d",
                        }}
                      >
                        <EmojiEventsRounded />
                      </Avatar>
                      <Typography sx={{ color: "#0c3558", fontWeight: 900 }}>
                        No tournaments yet
                      </Typography>
                      <Typography sx={{ color: "#526274", fontWeight: 600 }}>
                        Create one below to start registering teams and
                        scheduling matches.
                      </Typography>
                    </Stack>
                  ) : filteredTournaments.length === 0 ? (
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                      No tournaments match “{tournamentSearchQuery}”.
                    </Alert>
                  ) : (
                    <Stack spacing={1}>
                      {filteredTournaments.map((tournament) => {
                        const isSelected =
                          selectedTournament?.id === tournament.id;
                        const statusColors = statusChipColors(
                          tournament.status,
                        );

                        return (
                          <Button
                            key={tournament.id}
                            type="button"
                            onClick={() =>
                              setSelectedTournamentId(tournament.id)
                            }
                            sx={{
                              justifyContent: "flex-start",
                              textAlign: "left",
                              p: 1.2,
                              borderRadius: 2,
                              border: isSelected
                                ? "2px solid #0b7f61"
                                : "1px solid rgba(24,90,157,0.16)",
                              background: isSelected
                                ? "rgba(11,127,97,0.08)"
                                : "rgba(255,255,255,0.72)",
                              "&:hover": {
                                background: isSelected
                                  ? "rgba(11,127,97,0.12)"
                                  : "rgba(24,90,157,0.06)",
                              },
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={1.2}
                              alignItems="center"
                              sx={{ width: "100%" }}
                            >
                              <Avatar
                                src={tournament.logoUrl || undefined}
                                sx={{
                                  background: tournament.logoUrl
                                    ? undefined
                                    : getTeamAvatarGradient(
                                        tournament.id || tournament.name,
                                      ),
                                  fontWeight: 900,
                                }}
                              >
                                {tournament.name.slice(0, 1).toUpperCase()}
                              </Avatar>
                              <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography
                                  sx={{
                                    fontWeight: 900,
                                    color: "#0c3558",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {tournament.name}
                                </Typography>
                                <Stack
                                  direction="row"
                                  spacing={0.6}
                                  alignItems="center"
                                  flexWrap="wrap"
                                  useFlexGap
                                  sx={{ mt: 0.3 }}
                                >
                                  <Chip
                                    size="small"
                                    label={statusLabel(tournament.status)}
                                    sx={{
                                      height: 20,
                                      fontSize: 11,
                                      fontWeight: 850,
                                      bgcolor: statusColors.bg,
                                      color: statusColors.fg,
                                    }}
                                  />
                                  <Typography
                                    sx={{
                                      color: "#526274",
                                      fontSize: 12.5,
                                      fontWeight: 700,
                                    }}
                                  >
                                    {(tournament.teams ?? []).length} teams
                                    {" · "}
                                    {squadModeLabel(tournament.squadMode)}
                                  </Typography>
                                </Stack>
                              </Box>
                              {isSelected && (
                                <CheckCircleRounded
                                  sx={{ color: "#0b7f61", flexShrink: 0 }}
                                />
                              )}
                            </Stack>
                          </Button>
                        );
                      })}
                    </Stack>
                  )}
                </Paper>

                <Stack spacing={2}>
                  {!showTournamentForm ? (
                    <Paper elevation={0} sx={sectionSx}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.2}
                        alignItems={{ xs: "stretch", sm: "center" }}
                        justifyContent="space-between"
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 900, color: "#0c3558" }}
                          >
                            Create a new tournament
                          </Typography>
                          <Typography
                            sx={{ color: "#526274", fontWeight: 650 }}
                          >
                            Add tournament details first. Team registration
                            appears after the tournament is created.
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          startIcon={<AddRounded />}
                          onClick={() => {
                            setEditingTournamentId("");
                            setTournamentForm(defaultTournamentForm);
                            setShowTournamentForm(true);
                          }}
                          sx={primaryButtonSx}
                        >
                          Create tournament
                        </Button>
                      </Stack>
                    </Paper>
                  ) : (
                    <Paper
                      component="form"
                      elevation={0}
                      onSubmit={handleSaveTournament}
                      sx={sectionSx}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                        spacing={1}
                        sx={{ mb: 2 }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <EmojiEventsRounded sx={{ color: "#0b7f61" }} />
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 900, color: "#0c3558" }}
                          >
                            {editingTournamentId
                              ? "Edit tournament"
                              : "Create tournament"}
                          </Typography>
                        </Stack>
                        <Button
                          type="button"
                          onClick={() => {
                            setEditingTournamentId("");
                            setTournamentForm(defaultTournamentForm);
                            setShowTournamentForm(false);
                          }}
                          sx={softButtonSx}
                        >
                          Close
                        </Button>
                      </Stack>

                      <Box sx={gridSx}>
                        <TextField
                          label="Tournament Name"
                          value={tournamentForm.name}
                          onChange={(event) =>
                            updateTournamentField("name", event.target.value)
                          }
                          required
                          sx={fieldSx}
                        />
                        <TextField
                          label="Organizer Name"
                          value={tournamentForm.organizerName}
                          onChange={(event) =>
                            updateTournamentField(
                              "organizerName",
                              event.target.value,
                            )
                          }
                          required
                          sx={fieldSx}
                        />
                        <TextField
                          label="Start Date"
                          type="date"
                          value={tournamentForm.startDate}
                          onChange={(event) => {
                            const nextStartDate = event.target.value;
                            setTournamentForm((current) => ({
                              ...current,
                              startDate: nextStartDate,
                              endDate:
                                current.endDate <= nextStartDate
                                  ? getNextDate(nextStartDate)
                                  : current.endDate,
                            }));
                          }}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ min: today }}
                          required
                          sx={fieldSx}
                        />
                        <TextField
                          label="End Date"
                          type="date"
                          value={tournamentForm.endDate}
                          onChange={(event) =>
                            updateTournamentField("endDate", event.target.value)
                          }
                          InputLabelProps={{ shrink: true }}
                          inputProps={{
                            min: getNextDate(tournamentForm.startDate || today),
                          }}
                          required
                          sx={fieldSx}
                        />
                        <TextField
                          label="Location"
                          value={tournamentForm.location}
                          onChange={(event) =>
                            updateTournamentField(
                              "location",
                              event.target.value,
                            )
                          }
                          required
                          sx={fieldSx}
                        />
                        <TextField
                          label="Tournament Logo URL"
                          value={tournamentForm.logoUrl}
                          onChange={(event) =>
                            updateTournamentField("logoUrl", event.target.value)
                          }
                          sx={fieldSx}
                        />
                        <FormControl sx={fieldSx}>
                          <InputLabel>Ball Type</InputLabel>
                          <Select
                            label="Ball Type"
                            value={tournamentForm.ballType}
                            onChange={(event) =>
                              updateTournamentField(
                                "ballType",
                                event.target.value as TournamentBallType,
                              )
                            }
                          >
                            <MenuItem value="tennis">Tennis</MenuItem>
                            <MenuItem value="leather">Leather</MenuItem>
                            <MenuItem value="custom">Custom</MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          label="Overs Per Match"
                          type="number"
                          value={tournamentForm.oversPerMatch}
                          onChange={(event) =>
                            updateTournamentField(
                              "oversPerMatch",
                              Number(event.target.value),
                            )
                          }
                          inputProps={{ min: 1, max: 50 }}
                          sx={fieldSx}
                        />
                        {tournamentForm.ballType === "custom" && (
                          <TextField
                            label="Custom Ball Type"
                            value={tournamentForm.customBallType}
                            onChange={(event) =>
                              updateTournamentField(
                                "customBallType",
                                event.target.value,
                              )
                            }
                            sx={fieldSx}
                          />
                        )}
                        <FormControl sx={fieldSx}>
                          <InputLabel>Tournament Format</InputLabel>
                          <Select
                            label="Tournament Format"
                            value={tournamentForm.format}
                            onChange={(event) =>
                              updateTournamentField(
                                "format",
                                event.target.value as TournamentFormat,
                              )
                            }
                          >
                            <MenuItem value="league">
                              League Round Robin
                            </MenuItem>
                            <MenuItem value="knockout">Knockout</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl sx={fieldSx}>
                          <InputLabel>Team Setup</InputLabel>
                          <Select
                            label="Team Setup"
                            value={tournamentForm.squadMode ?? "teams_only"}
                            onChange={(event) =>
                              updateTournamentField(
                                "squadMode",
                                event.target.value as TournamentSquadMode,
                              )
                            }
                          >
                            <MenuItem value="teams_only">Teams only</MenuItem>
                            <MenuItem value="with_players">
                              Teams with players
                            </MenuItem>
                          </Select>
                        </FormControl>
                        {editingTournamentId && (
                          <FormControl sx={fieldSx}>
                            <InputLabel>Status</InputLabel>
                            <Select
                              label="Status"
                              value={tournamentForm.status ?? "draft"}
                              onChange={(event) =>
                                updateTournamentField(
                                  "status",
                                  event.target.value as TournamentStatus,
                                )
                              }
                            >
                              <MenuItem value="draft">Draft</MenuItem>
                              <MenuItem value="active">Active</MenuItem>
                              <MenuItem value="completed">Completed</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      </Box>

                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        sx={{ mt: 2 }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={
                            savingTournament ? (
                              <CircularProgress size={18} color="inherit" />
                            ) : (
                              <SaveRounded />
                            )
                          }
                          disabled={savingTournament}
                          sx={primaryButtonSx}
                        >
                          {editingTournamentId
                            ? "Update tournament"
                            : "Save tournament"}
                        </Button>
                        {editingTournamentId && (
                          <>
                            <Button
                              type="button"
                              onClick={() => {
                                setEditingTournamentId("");
                                setTournamentForm(defaultTournamentForm);
                              }}
                              sx={softButtonSx}
                            >
                              Cancel edit
                            </Button>
                            <Button
                              type="button"
                              color="error"
                              startIcon={<DeleteRounded />}
                              onClick={() =>
                                setDeletingTarget({
                                  type: "tournament",
                                  id: editingTournamentId,
                                  name:
                                    tournamentForm.name || "this tournament",
                                })
                              }
                              sx={{
                                ...softButtonSx,
                                color: "#b42318",
                              }}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </Stack>
                    </Paper>
                  )}

                  {!showTournamentForm && selectedTournament && (
                    <Paper
                      component="form"
                      elevation={0}
                      onSubmit={handleSaveTeam}
                      sx={sectionSx}
                      ref={teamFormRef}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                        spacing={1}
                        sx={{ mb: 2 }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1.2}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              background:
                                "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
                              boxShadow: "0 6px 14px rgba(24,90,157,0.3)",
                            }}
                          >
                            <PersonAddRounded fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography
                              variant="h6"
                              display="inline-flex"
                              sx={{
                                fontWeight: 900,
                                color: "#0c3558",
                                lineHeight: 1.1,
                              }}
                            >
                              {editingTeamId ? "Edit team" : "Register team"}
                              <Typography
                                component="span"
                                sx={{
                                  color: "#526274",
                                  paddingLeft: 0.5,
                                  fontWeight: 800,
                                }}
                              >
                                ({selectedTournament.name})
                              </Typography>
                            </Typography>
                            <Typography
                              sx={{ color: "#526274", fontWeight: 700 }}
                            >
                              {selectedTournamentUsesPlayers
                                ? "Pick a saved team or add players manually."
                                : "Add team and captain details only."}
                            </Typography>
                          </Box>
                        </Stack>
                        <Chip
                          label={squadModeLabel(selectedTournament?.squadMode)}
                          size="small"
                          sx={{
                            bgcolor: selectedTournamentUsesPlayers
                              ? "rgba(24,90,157,0.1)"
                              : "rgba(11,127,97,0.1)",
                            color: selectedTournamentUsesPlayers
                              ? "#185a9d"
                              : "#0b6f55",
                            fontWeight: 900,
                          }}
                        />
                      </Stack>

                      {selectedTournamentUsesPlayers && (
                        <Box sx={{ mb: 2 }}>
                          <FormControl fullWidth sx={fieldSx}>
                            <InputLabel>Saved team</InputLabel>
                            <Select
                              label="Saved team"
                              value={selectedSavedTeamId}
                              onChange={(event) =>
                                applySavedTeam(event.target.value)
                              }
                            >
                              <MenuItem value="">Add manually</MenuItem>
                              {savedPlayerTeams.map((team) => {
                                const alreadyAdded =
                                  savedTeamStatusById.get(team.id) ?? false;
                                return (
                                  <MenuItem
                                    key={team.id}
                                    value={team.id}
                                    disabled={alreadyAdded}
                                  >
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      alignItems="center"
                                      sx={{ minWidth: 0, width: "100%" }}
                                    >
                                      {alreadyAdded && (
                                        <CheckCircleRounded
                                          fontSize="small"
                                          sx={{ color: "#0b7f61" }}
                                        />
                                      )}
                                      <Box sx={{ minWidth: 0, flex: 1 }}>
                                        <Typography
                                          sx={{
                                            fontWeight: 850,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                          }}
                                        >
                                          {team.name} ({team.players.length}{" "}
                                          players)
                                        </Typography>
                                        {alreadyAdded && (
                                          <Typography
                                            sx={{
                                              color: "#0b6f55",
                                              fontSize: 12,
                                              fontWeight: 800,
                                            }}
                                          >
                                            Already added to this tournament
                                          </Typography>
                                        )}
                                      </Box>
                                    </Stack>
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                          {savedPlayerTeams.length === 0 && (
                            <Alert
                              severity="info"
                              sx={{ mt: 1, borderRadius: 2 }}
                            >
                              No saved teams yet. Add players manually below and
                              keep Save this team for later selected, or create
                              one from My Teams.
                              <Button
                                size="small"
                                onClick={() => navigate("/my-teams")}
                                sx={{
                                  ...softButtonSx,
                                  minHeight: 30,
                                  ml: 1,
                                  px: 1,
                                }}
                              >
                                My Teams
                              </Button>
                            </Alert>
                          )}
                        </Box>
                      )}

                      {selectedTournamentUsesPlayers && selectedSavedTeamId ? (
                        <Alert severity="success" sx={{ borderRadius: 2 }}>
                          {teamForm.name} is ready with{" "}
                          {
                            teamForm.players.filter((player) => player.name)
                              .length
                          }{" "}
                          players. Click Register team.
                        </Alert>
                      ) : (
                        <Box sx={gridSx}>
                          <TextField
                            label="Team name"
                            value={teamForm.name}
                            onChange={(event) =>
                              updateTeamField("name", event.target.value)
                            }
                            required
                            sx={fieldSx}
                            inputRef={teamNameInputRef}
                          />
                          <TextField
                            label="Captain"
                            value={teamForm.captainName}
                            onChange={(event) =>
                              updateTeamField("captainName", event.target.value)
                            }
                            required
                            sx={fieldSx}
                          />
                          <TextField
                            label="Captain mobile"
                            value={teamForm.contactNumber}
                            onChange={(event) =>
                              updateTeamField(
                                "contactNumber",
                                event.target.value,
                              )
                            }
                            required
                            sx={fieldSx}
                          />
                        </Box>
                      )}

                      {!(selectedTournamentUsesPlayers && selectedSavedTeamId) && (
                        <Stack
                          direction="row"
                          spacing={1.2}
                          alignItems="center"
                          sx={{ mt: 1.5 }}
                        >
                          <Avatar
                            src={teamForm.logoUrl || undefined}
                            sx={{
                              width: 44,
                              height: 44,
                              flexShrink: 0,
                              background: teamForm.logoUrl
                                ? undefined
                                : getTeamAvatarGradient(
                                    teamForm.name || "team",
                                  ),
                              fontWeight: 900,
                            }}
                          >
                            {(teamForm.name || "T").slice(0, 1).toUpperCase()}
                          </Avatar>
                          <TextField
                            label="Team logo URL (optional)"
                            placeholder="https://example.com/team-logo.png"
                            value={teamForm.logoUrl ?? ""}
                            onChange={(event) =>
                              updateTeamField("logoUrl", event.target.value)
                            }
                            helperText="Paste an image link to use a custom team icon. Leave blank for a generated avatar."
                            fullWidth
                            sx={fieldSx}
                          />
                        </Stack>
                      )}

                      {selectedTournamentUsesPlayers &&
                        !selectedSavedTeamId && (
                          <>
                            <Divider sx={{ my: 2 }} />
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                              sx={{ mb: 1 }}
                            >
                              <Typography
                                sx={{ fontWeight: 900, color: "#0c3558" }}
                              >
                                Players
                              </Typography>
                              <Chip
                                size="small"
                                label={`${
                                  (teamForm.players ?? []).filter((player) =>
                                    player.name.trim(),
                                  ).length
                                } added`}
                                sx={{
                                  fontWeight: 850,
                                  bgcolor: "rgba(24,90,157,0.1)",
                                  color: "#185a9d",
                                }}
                              />
                            </Stack>
                            <Stack spacing={1}>
                              {(teamForm.players ?? []).map((player, index) => {
                                const roleOptions = getAvailableRoleOptions(
                                  teamForm.players ?? [],
                                  index,
                                );
                                const normalizedRole = player.role
                                  ?.trim()
                                  .toLowerCase();
                                const isCaptainRow =
                                  normalizedRole === "captain";
                                const isViceCaptainRow =
                                  normalizedRole === "vice captain";

                                return (
                                  <Box
                                    key={index}
                                    sx={{
                                      display: "grid",
                                      gridTemplateColumns: {
                                        xs: "28px minmax(0, 1fr) 40px",
                                        sm: "28px minmax(0, 1fr) 160px 40px",
                                      },
                                      gap: 1,
                                      alignItems: "center",
                                      p: 1,
                                      borderRadius: 2,
                                      border: "1px solid",
                                      borderColor: isCaptainRow
                                        ? "rgba(198,146,20,0.3)"
                                        : isViceCaptainRow
                                          ? "rgba(24,90,157,0.3)"
                                          : "rgba(12,53,88,0.1)",
                                      background: isCaptainRow
                                        ? "rgba(198,146,20,0.06)"
                                        : isViceCaptainRow
                                          ? "rgba(24,90,157,0.05)"
                                          : "rgba(12,53,88,0.015)",
                                    }}
                                  >
                                    <Avatar
                                      sx={{
                                        width: 28,
                                        height: 28,
                                        fontSize: 12,
                                        fontWeight: 900,
                                        bgcolor: isCaptainRow
                                          ? "#c69214"
                                          : isViceCaptainRow
                                            ? "#185a9d"
                                            : "rgba(24,90,157,0.16)",
                                        color:
                                          isCaptainRow || isViceCaptainRow
                                            ? "#fff"
                                            : "#185a9d",
                                      }}
                                    >
                                      {index + 1}
                                    </Avatar>
                                    <TextField
                                      label={`Player ${index + 1} name`}
                                      value={player.name}
                                      onChange={(event) =>
                                        updatePlayerField(
                                          index,
                                          "name",
                                          event.target.value,
                                        )
                                      }
                                      size="small"
                                      sx={fieldSx}
                                    />
                                    <FormControl size="small" sx={fieldSx}>
                                      <InputLabel>Role</InputLabel>
                                      <Select
                                        label="Role"
                                        value={player.role ?? ""}
                                        onChange={(event) =>
                                          updatePlayerField(
                                            index,
                                            "role",
                                            event.target.value,
                                          )
                                        }
                                      >
                                        <MenuItem value="">Select role</MenuItem>
                                        {roleOptions.map((role) => (
                                          <MenuItem key={role} value={role}>
                                            <ListItemIcon sx={{ minWidth: 30 }}>
                                              {getPlayerRoleIcon(role)}
                                            </ListItemIcon>
                                            {role}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                    <Tooltip title={`Remove player ${index + 1}`}>
                                      <IconButton
                                        aria-label={`Remove player ${index + 1}`}
                                        onClick={() => removePlayerRow(index)}
                                        sx={{
                                          ...dangerButtonSx,
                                          width: 36,
                                          height: 36,
                                          minHeight: 36,
                                          p: 0,
                                          justifySelf: "center",
                                        }}
                                      >
                                        <DeleteRounded fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                );
                              })}
                            </Stack>
                            <FormControlLabel
                              sx={{
                                mt: 1.2,
                                color: "#0c3558",
                                fontWeight: 800,
                                "& .MuiFormControlLabel-label": {
                                  fontWeight: 800,
                                },
                              }}
                              control={
                                <Checkbox
                                  checked={saveTeamForLater}
                                  onChange={(event) =>
                                    setSaveTeamForLater(event.target.checked)
                                  }
                                  sx={{
                                    color: "#185a9d",
                                    "&.Mui-checked": { color: "#0b7f61" },
                                  }}
                                />
                              }
                              label={`Save this team for later (${MIN_SAVED_TEAM_PLAYERS}+ players)`}
                            />
                          </>
                        )}

                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        sx={{ mt: 2 }}
                      >
                        {selectedTournamentUsesPlayers &&
                          !selectedSavedTeamId && (
                            <Button
                              type="button"
                              variant="outlined"
                              startIcon={<AddRounded />}
                              onClick={addPlayerRow}
                              sx={softButtonSx}
                            >
                              Add player
                            </Button>
                          )}
                        <Button
                          type="submit"
                          variant="contained"
                          startIcon={
                            savingTeam ? (
                              <CircularProgress size={18} color="inherit" />
                            ) : (
                              <GroupsRounded />
                            )
                          }
                          disabled={savingTeam || !selectedTournament}
                          sx={blueButtonSx}
                        >
                          {editingTeamId ? "Update team" : "Register team"}
                        </Button>
                        {editingTeamId && (
                          <Button
                            type="button"
                            onClick={() => {
                              setEditingTeamId("");
                              setTeamForm(defaultTeamForm);
                              setSelectedSavedTeamId("");
                              setSaveTeamForLater(true);
                            }}
                            sx={softButtonSx}
                          >
                            Cancel edit
                          </Button>
                        )}
                      </Stack>
                    </Paper>
                  )}
                </Stack>

                {selectedTournament && (
                  <Paper elevation={0} sx={sectionSx}>
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <Avatar
                        src={selectedTournament.logoUrl || undefined}
                        sx={{
                          width: 48,
                          height: 48,
                          background: selectedTournament.logoUrl
                            ? undefined
                            : getTeamAvatarGradient(
                                selectedTournament.id ||
                                  selectedTournament.name,
                              ),
                          fontWeight: 900,
                        }}
                      >
                        {selectedTournament.name.slice(0, 1).toUpperCase()}
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          flexWrap="wrap"
                          useFlexGap
                        >
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 900, color: "#0c3558" }}
                          >
                            {selectedTournament.name}
                          </Typography>
                          <Chip
                            size="small"
                            label={statusLabel(selectedTournament.status)}
                            sx={{
                              height: 22,
                              fontWeight: 850,
                              bgcolor: statusChipColors(
                                selectedTournament.status,
                              ).bg,
                              color: statusChipColors(
                                selectedTournament.status,
                              ).fg,
                            }}
                          />
                        </Stack>
                        <Typography sx={{ color: "#526274", fontWeight: 600 }}>
                          {selectedTournament.organizerName}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack spacing={1} sx={{ mt: 2 }}>
                      <Chip
                        icon={<CalendarMonthRounded />}
                        label={`${selectedTournament.startDate} to ${selectedTournament.endDate}`}
                        sx={{ justifyContent: "flex-start", fontWeight: 800 }}
                      />
                      <Chip
                        icon={<PlaceRounded />}
                        label={selectedTournament.location}
                        sx={{ justifyContent: "flex-start", fontWeight: 800 }}
                      />
                      <Chip
                        icon={<SportsCricketRounded />}
                        label={`${selectedTournament.oversPerMatch} overs, ${ballTypeLabel(
                          selectedTournament.ballType,
                          selectedTournament.customBallType,
                        )} ball`}
                        sx={{ justifyContent: "flex-start", fontWeight: 800 }}
                      />
                    </Stack>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        gap: 1,
                        mt: 2,
                      }}
                    >
                      {[
                        ["Format", formatLabel(selectedTournament.format)],
                        ["Setup", squadModeLabel(selectedTournament.squadMode)],
                        ["Status", statusLabel(selectedTournament.status)],
                        ["Window", getTournamentStatus(selectedTournament)],
                        ["Teams", String(selectedTeams.length)],
                        ["Players", String(totalPlayers)],
                      ].map(([label, value]) => (
                        <Box
                          key={label}
                          sx={{
                            p: 1.2,
                            borderRadius: 2,
                            background: "rgba(24,90,157,0.08)",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#526274",
                              fontSize: 12,
                              fontWeight: 800,
                            }}
                          >
                            {label}
                          </Typography>
                          <Typography
                            sx={{ color: "#0c3558", fontWeight: 900 }}
                          >
                            {value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <FormControl
                      fullWidth
                      sx={{
                        ...fieldSx,
                        mt: 2,
                      }}
                    >
                      <InputLabel>Tournament Status</InputLabel>
                      <Select
                        label="Tournament Status"
                        value={selectedTournament.status}
                        disabled={updatingStatus}
                        onChange={(event) =>
                          handleTournamentStatusChange(
                            event.target.value as TournamentStatus,
                          )
                        }
                      >
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                      </Select>
                    </FormControl>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      sx={{ mt: 2 }}
                    >
                      <Button
                        fullWidth
                        startIcon={<EditRounded />}
                        onClick={() => handleEditTournament(selectedTournament)}
                        sx={softButtonSx}
                      >
                        Edit details
                      </Button>
                      <Button
                        fullWidth
                        color="error"
                        startIcon={<DeleteRounded />}
                        onClick={() =>
                          setDeletingTarget({
                            type: "tournament",
                            id: selectedTournament.id,
                            name: selectedTournament.name,
                          })
                        }
                        sx={{
                          ...softButtonSx,
                          color: "#b42318",
                        }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Paper>
                )}
              </Stack>
            </Box>
          )}

          {isLoggedIn && selectedTournament && !showTournamentForm && (
            <Paper elevation={0} sx={{ ...sectionSx, mt: 2 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PlayArrowRounded sx={{ color: "#185a9d" }} />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 900, color: "#0c3558" }}
                    >
                      Start or resume tournament match
                    </Typography>
                  </Stack>
                  <Typography sx={{ color: "#526274", fontWeight: 600 }}>
                    Pick any available fixture and open the scorer with teams,
                    players, and overs already set.
                  </Typography>
                </Box>
              </Stack>

              {selectedTeams.length < 2 ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  Register at least two teams before starting a match.
                </Alert>
              ) : (
                <Stack spacing={1}>
                  {hasOnlyCustomFixtures && (
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                      All predefined fixtures are completed. Pick a custom
                      fixture to schedule another match.
                    </Alert>
                  )}
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={1}
                    alignItems={{ xs: "stretch", md: "center" }}
                  >
                    <FormControl sx={{ ...fieldSx, flex: 1 }}>
                      <InputLabel>Fixture</InputLabel>
                      <Select
                        label="Fixture"
                        value={
                          isCustomFixtureSelected
                            ? CUSTOM_FIXTURE_KEY
                            : (selectedFixture?.key ?? CUSTOM_FIXTURE_KEY)
                        }
                        onChange={(event) =>
                          setSelectedFixtureKey(event.target.value)
                        }
                      >
                        {playableFixtures.map((fixture) => (
                          <MenuItem key={fixture.key} value={fixture.key}>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              justifyContent="space-between"
                              sx={{ width: "100%" }}
                            >
                              <Typography sx={{ fontWeight: 800 }}>
                                {fixture.team1.name} vs {fixture.team2.name}
                              </Typography>
                              {fixture.status === "in_progress" && (
                                <Chip
                                  size="small"
                                  label="In progress"
                                  sx={{
                                    height: 20,
                                    fontSize: 11,
                                    fontWeight: 850,
                                    bgcolor: "rgba(198,146,20,0.14)",
                                    color: "#8a6200",
                                  }}
                                />
                              )}
                            </Stack>
                          </MenuItem>
                        ))}
                        <MenuItem value={CUSTOM_FIXTURE_KEY}>
                          Custom fixture
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      startIcon={
                        startingMatchId === selectedFixtureLoadingKey ? (
                          <CircularProgress size={18} color="inherit" />
                        ) : (
                          <PlayArrowRounded />
                        )
                      }
                      disabled={selectedFixtureButtonDisabled}
                      onClick={handleStartFixture}
                      sx={{ ...primaryButtonSx, minHeight: 54 }}
                    >
                      {selectedFixtureActionLabel}
                    </Button>
                  </Stack>
                  {isCustomFixtureSelected && (
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                      <FormControl fullWidth sx={fieldSx}>
                        <InputLabel>Team 1</InputLabel>
                        <Select
                          label="Team 1"
                          value={customTeam1Id}
                          onChange={(event) => {
                            const nextTeam1Id = event.target.value;
                            setCustomTeam1Id(nextTeam1Id);
                            if (nextTeam1Id === customTeam2Id) {
                              setCustomTeam2Id(
                                selectedTeams.find(
                                  (team) => team.id !== nextTeam1Id,
                                )?.id || "",
                              );
                            }
                          }}
                        >
                          {selectedTeams.map((team) => (
                            <MenuItem key={team.id} value={team.id}>
                              {team.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth sx={fieldSx}>
                        <InputLabel>Team 2</InputLabel>
                        <Select
                          label="Team 2"
                          value={customTeam2Id}
                          onChange={(event) =>
                            setCustomTeam2Id(event.target.value)
                          }
                        >
                          {customTeam2Options.map((team) => (
                            <MenuItem key={team.id} value={team.id}>
                              {team.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  )}
                </Stack>
              )}
            </Paper>
          )}

          {isLoggedIn &&
            selectedTournament &&
            selectedTournamentUsesPlayers &&
            !showTournamentForm && (
              <Paper elevation={0} sx={{ ...sectionSx, mt: 2 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  spacing={1}
                  sx={{ mb: 2 }}
                >
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LeaderboardRounded sx={{ color: "#185a9d" }} />
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 900, color: "#0c3558" }}
                      >
                        Player stats
                      </Typography>
                    </Stack>
                    <Typography sx={{ color: "#526274", fontWeight: 600 }}>
                      Individual stats are calculated on the backend from
                      completed tournament matches.
                    </Typography>
                  </Box>
                  <Chip
                    label={`${playerLeaderboard.length} players`}
                    sx={{
                      fontWeight: 900,
                      alignSelf: { xs: "flex-start", sm: "center" },
                    }}
                  />
                </Stack>

                {playerLeaderboard.length === 0 ? (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    Add player teams to show individual tournament stats.
                  </Alert>
                ) : (
                  <Stack spacing={1}>
                    {playerStatsByTeam.map((team, teamIndex) => (
                      <Accordion
                        key={team.teamId}
                        defaultExpanded={teamIndex === 0}
                        disableGutters
                        elevation={0}
                        sx={{
                          borderRadius: "8px !important",
                          border: "1px solid rgba(12,53,88,0.14)",
                          overflow: "hidden",
                          bgcolor: "rgba(255,255,255,0.82)",
                          "&:before": { display: "none" },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreRounded />}
                          sx={{
                            minHeight: 54,
                            px: 1.5,
                            "& .MuiAccordionSummary-content": {
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 1,
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#0c3558",
                              fontWeight: 950,
                              overflowWrap: "anywhere",
                            }}
                          >
                            {team.teamName}
                          </Typography>
                          <Chip
                            size="small"
                            label={`${team.players.length} players`}
                            sx={{
                              flexShrink: 0,
                              color: "#0b6f55",
                              bgcolor: "rgba(11,127,97,0.1)",
                              fontWeight: 900,
                            }}
                          />
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 1.2, pt: 0 }}>
                          <Box sx={{ overflowX: "auto" }}>
                            <Box
                              sx={{
                                minWidth: 620,
                                display: "grid",
                                gridTemplateColumns:
                                  "minmax(180px, 1.6fr) repeat(5, minmax(64px, 0.65fr))",
                                gap: 0.6,
                              }}
                            >
                              {["Player", "M", "Runs", "4s", "6s", "Wkts"].map(
                                (label) => (
                                  <Tooltip
                                    key={label}
                                    title={
                                      PLAYER_STAT_HEADER_LABELS[label] ?? ""
                                    }
                                  >
                                    <Typography
                                      sx={{
                                        p: 1,
                                        borderRadius: 1.5,
                                        color: "#526274",
                                        background: "rgba(24,90,157,0.08)",
                                        fontSize: 12,
                                        fontWeight: 900,
                                        cursor: PLAYER_STAT_HEADER_LABELS[
                                          label
                                        ]
                                          ? "help"
                                          : "default",
                                      }}
                                    >
                                      {label}
                                    </Typography>
                                  </Tooltip>
                                ),
                              )}
                              {team.players.map((row) => (
                                <React.Fragment
                                  key={`${row.id}-${team.teamId}`}
                                >
                                  {[
                                    row.username
                                      ? `${row.name} @${row.username}`
                                      : row.name,
                                    row.matchesPlayed,
                                    row.runs,
                                    row.fours,
                                    row.sixes,
                                    row.wickets,
                                  ].map((value, index) => (
                                    <Typography
                                      key={`${row.id}-${index}`}
                                      sx={{
                                        p: 1,
                                        borderRadius: 1.5,
                                        color: "#0c3558",
                                        background: "rgba(255,255,255,0.72)",
                                        fontWeight: index === 0 ? 900 : 800,
                                        overflowWrap: "anywhere",
                                      }}
                                    >
                                      {value}
                                    </Typography>
                                  ))}
                                </React.Fragment>
                              ))}
                            </Box>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Stack>
                )}
              </Paper>
            )}

          {isLoggedIn &&
            selectedTournament &&
            selectedTournamentUsesPlayers &&
            !showTournamentForm && (
              <Divider
                sx={{ my: 1, borderColor: "rgba(24,90,157,0.16)" }}
              />
            )}

          {isLoggedIn && selectedTournament && !showTournamentForm && (
            <Paper elevation={0} sx={{ ...sectionSx, mt: 2 }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", md: "center" }}
                spacing={1}
                sx={{ mb: 2 }}
              >
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TableChartRounded sx={{ color: "#185a9d" }} />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 900, color: "#0c3558" }}
                    >
                      Points table
                    </Typography>
                  </Stack>
                  <Typography sx={{ color: "#526274", fontWeight: 600 }}>
                    Synced from backend tournament results after each completed
                    match.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  startIcon={
                    syncingStats ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <SyncRounded />
                    )
                  }
                  disabled={syncingStats}
                  onClick={handleSyncStatistics}
                  sx={{
                    ...primaryButtonSx,
                    alignSelf: { xs: "stretch", md: "center" },
                  }}
                >
                  Sync stats
                </Button>
              </Stack>

              {pointsTable.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  Register teams to build the points table.
                </Alert>
              ) : (
                <>
                  <Stack
                    direction="row"
                    spacing={0.6}
                    alignItems="center"
                    sx={{ mb: 1, color: "#8a94a6" }}
                  >
                    <InfoRounded sx={{ fontSize: 16 }} />
                    <Typography sx={{ fontSize: 12.5, fontWeight: 650 }}>
                      Hover a column heading for its full name. Sorted by
                      points, then net run rate, then wins.
                    </Typography>
                  </Stack>
                  <Box sx={{ overflowX: "auto" }}>
                    <Box
                      sx={{
                        minWidth: 760,
                        display: "grid",
                        gridTemplateColumns:
                          "minmax(180px, 1.6fr) repeat(8, minmax(72px, 0.7fr))",
                        gap: 0.6,
                        alignItems: "stretch",
                      }}
                    >
                      {["Team", "P", "W", "L", "T", "Pts", "RF", "RA", "NRR"].map(
                        (label) => (
                          <Tooltip
                            key={label}
                            title={POINTS_TABLE_HEADER_LABELS[label] ?? ""}
                          >
                            <Typography
                              sx={{
                                p: 1,
                                borderRadius: 1.5,
                                color: "#526274",
                                background: "rgba(24,90,157,0.08)",
                                fontSize: 12,
                                fontWeight: 900,
                                cursor: POINTS_TABLE_HEADER_LABELS[label]
                                  ? "help"
                                  : "default",
                              }}
                            >
                              {label}
                            </Typography>
                          </Tooltip>
                        ),
                      )}
                      {pointsTable.map((row) => (
                        <React.Fragment key={row.teamId}>
                          {[
                            row.teamName,
                            row.played,
                            row.won,
                            row.lost,
                            row.tied,
                            row.points,
                            row.runsFor,
                            row.runsAgainst,
                            row.netRunRate.toFixed(3),
                          ].map((value, index) => (
                            <Typography
                              key={`${row.teamId}-${index}`}
                              sx={{
                                p: 1,
                                borderRadius: 1.5,
                                color: "#0c3558",
                                background: "rgba(255,255,255,0.72)",
                                fontWeight: index === 0 ? 900 : 800,
                              }}
                            >
                              {value}
                            </Typography>
                          ))}
                        </React.Fragment>
                      ))}
                    </Box>
                  </Box>
                </>
              )}
            </Paper>
          )}

          {isLoggedIn && selectedTournament && !showTournamentForm && (
            <Paper elevation={0} sx={{ ...sectionSx, mt: 2 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <HistoryRounded sx={{ color: "#185a9d" }} />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 900, color: "#0c3558" }}
                    >
                      Completed matches
                    </Typography>
                  </Stack>
                  <Typography sx={{ color: "#526274", fontWeight: 600 }}>
                    Finished tournament fixtures with synced result details.
                  </Typography>
                </Box>
                <Chip
                  label={`${completedMatches.length} completed`}
                  sx={{
                    fontWeight: 900,
                    bgcolor: "rgba(24,90,157,0.12)",
                    color: "#185a9d",
                    alignSelf: { xs: "flex-start", sm: "center" },
                  }}
                />
              </Stack>

              {completedMatches.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  Completed tournament matches will appear here after the scorer
                  finish action syncs the result.
                </Alert>
              ) : (
                <Stack spacing={1}>
                  {completedMatches.map((match) => {
                    const [resolvedTeam1Name, resolvedTeam2Name] =
                      getResolvedMatchTeamNames(match);
                    return (
                    <Box
                      key={match.id}
                      sx={{
                        p: 1.4,
                        borderRadius: 1.5,
                        border: "1px solid rgba(12,53,88,0.14)",
                        background: "#f8fbfd",
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        justifyContent="space-between"
                        alignItems={{ xs: "stretch", sm: "flex-start" }}
                      >
                        <Box>
                          <Typography
                            sx={{ color: "#0c3558", fontWeight: 900 }}
                          >
                            {resolvedTeam1Name} vs {resolvedTeam2Name}
                          </Typography>
                          <Typography
                            sx={{ color: "#526274", fontWeight: 750 }}
                          >
                            {match.resultText ||
                              (match.winnerTeamName
                                ? `${match.winnerTeamName} won`
                                : "Result synced")}
                          </Typography>
                        </Box>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={0.8}
                          alignItems={{ xs: "stretch", sm: "center" }}
                        >
                          <Chip
                            size="small"
                            label={
                              match.completedAt?.slice(0, 10) || "Completed"
                            }
                            sx={{
                              bgcolor: "rgba(11,127,97,0.1)",
                              color: "#0b6f55",
                              fontWeight: 900,
                            }}
                          />
                          {match.scorerMatchId && (
                            <Button
                              size="small"
                              onClick={() =>
                                navigate(
                                  `/match-history/${encodeURIComponent(
                                    match.scorerMatchId || "",
                                  )}`,
                                )
                              }
                              sx={{
                                ...softButtonSx,
                                minHeight: 32,
                                px: 1.2,
                              }}
                            >
                              View history
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                      {match.snapshot && (
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          sx={{ mt: 1 }}
                        >
                          {[resolvedTeam1Name, resolvedTeam2Name].map(
                            (teamName, teamIndex) => {
                              const isWinner =
                                match.winnerTeamName === teamName;
                              return (
                                <Box
                                  key={`${match.id}-${teamIndex}-${teamName}`}
                                  sx={{
                                    flex: 1,
                                    p: 1,
                                    borderRadius: 1.2,
                                    bgcolor: isWinner
                                      ? "rgba(11,127,97,0.06)"
                                      : "#fff",
                                    border: isWinner
                                      ? "1px solid rgba(11,127,97,0.35)"
                                      : "1px solid rgba(12,53,88,0.1)",
                                  }}
                                >
                                  <Stack
                                    direction="row"
                                    spacing={0.4}
                                    alignItems="center"
                                  >
                                    {isWinner && (
                                      <EmojiEventsRounded
                                        sx={{ fontSize: 14, color: "#0b7f61" }}
                                      />
                                    )}
                                    <Typography
                                      sx={{
                                        color: "#526274",
                                        fontSize: 12,
                                        fontWeight: 800,
                                      }}
                                    >
                                      {teamName}
                                    </Typography>
                                  </Stack>
                                  <Typography
                                    sx={{ color: "#0c3558", fontWeight: 950 }}
                                  >
                                    {getScoreSummary(match.snapshot, teamName)}
                                  </Typography>
                                </Box>
                              );
                            },
                          )}
                        </Stack>
                      )}
                    </Box>
                    );
                  })}
                </Stack>
              )}
            </Paper>
          )}

          {isLoggedIn && selectedTournament && !showTournamentForm && (
            <Paper elevation={0} sx={{ ...sectionSx, mt: 2 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 900, color: "#0c3558" }}
                    >
                      Registered teams
                    </Typography>
                    {selectedTeams.length > 0 && (
                      <Chip
                        size="small"
                        label={selectedTeams.length}
                        sx={{
                          fontWeight: 900,
                          bgcolor: "rgba(24,90,157,0.12)",
                          color: "#185a9d",
                        }}
                      />
                    )}
                  </Stack>
                  <Typography sx={{ color: "#526274", fontWeight: 600 }}>
                    Team statistics are calculated by the backend from
                    tournament match results and saved to the database.
                  </Typography>
                </Box>
              </Stack>

              {selectedTeams.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  No teams registered yet for this tournament.
                </Alert>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      md: "repeat(2, minmax(0, 1fr))",
                    },
                    gap: 1.5,
                  }}
                >
                  {selectedTeams.map((team: TournamentTeam) => {
                    const teamPlayers = team.players ?? [];
                    const teamStats = {
                      played:
                        team.statistics?.matchesPlayed ??
                        team.stats?.played ??
                        0,
                      won: team.statistics?.wins ?? team.stats?.won ?? 0,
                      lost: team.statistics?.losses ?? team.stats?.lost ?? 0,
                      points:
                        team.statistics?.points ?? team.stats?.points ?? 0,
                      netRunRate:
                        team.statistics?.netRunRate ??
                        team.stats?.netRunRate ??
                        0,
                    };

                    const captain = teamPlayers.find(
                      (player) =>
                        player.role?.trim().toLowerCase() === "captain",
                    );
                    const viceCaptain = teamPlayers.find(
                      (player) =>
                        player.role?.trim().toLowerCase() === "vice captain",
                    );

                    return (
                      <Paper
                        key={team.id}
                        elevation={0}
                        sx={{
                          borderRadius: 3,
                          border: "1.5px solid rgba(24,90,157,0.14)",
                          background: "#fff",
                          overflow: "hidden",
                          transition:
                            "box-shadow 0.18s ease, border-color 0.18s ease, transform 0.18s ease",
                          "&:hover": {
                            borderColor: "rgba(24,90,157,0.4)",
                            boxShadow: "0 12px 28px rgba(8,26,56,0.12)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            height: 4,
                            background:
                              "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
                          }}
                        />
                        <Box sx={{ p: 1.6 }}>
                          <Stack
                            direction="row"
                            spacing={1.2}
                            alignItems="flex-start"
                            justifyContent="space-between"
                          >
                            <Stack
                              direction="row"
                              spacing={1.2}
                              alignItems="center"
                              sx={{ minWidth: 0 }}
                            >
                              <Avatar
                                src={team.logoUrl || undefined}
                                sx={{
                                  background: team.logoUrl
                                    ? undefined
                                    : getTeamAvatarGradient(
                                        team.id || team.name,
                                      ),
                                  fontWeight: 900,
                                  width: 44,
                                  height: 44,
                                }}
                              >
                                {team.name.slice(0, 1).toUpperCase()}
                              </Avatar>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography
                                  sx={{
                                    color: "#0c3558",
                                    fontWeight: 900,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                  title={team.name}
                                >
                                  {team.name}
                                </Typography>
                                <Typography
                                  sx={{
                                    color: "#526274",
                                    fontWeight: 700,
                                    fontSize: 13,
                                  }}
                                >
                                  Captain: {team.captainName}
                                </Typography>
                              </Box>
                            </Stack>
                            <Stack direction="row" spacing={0.4}>
                              <Tooltip title="Edit team">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditTeam(team)}
                                  sx={{
                                    color: "#185a9d",
                                    bgcolor: "rgba(24,90,157,0.08)",
                                    "&:hover": {
                                      bgcolor: "rgba(24,90,157,0.16)",
                                    },
                                  }}
                                >
                                  <EditRounded fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete team">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    setDeletingTarget({
                                      type: "team",
                                      id: team.id,
                                      name: team.name,
                                    })
                                  }
                                  sx={{
                                    color: "#b42318",
                                    bgcolor: "rgba(180,35,24,0.08)",
                                    "&:hover": {
                                      bgcolor: "rgba(180,35,24,0.16)",
                                    },
                                  }}
                                >
                                  <DeleteRounded fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </Stack>

                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                              gap: 0.8,
                              my: 1.4,
                            }}
                          >
                            {[
                              ["P", "Played", teamStats.played],
                              ["W", "Won", teamStats.won],
                              ["L", "Lost", teamStats.lost],
                              ["Pts", "Points", teamStats.points],
                              [
                                "NRR",
                                "Net Run Rate",
                                teamStats.netRunRate.toFixed(2),
                              ],
                            ].map(([label, fullLabel, value]) => (
                              <Tooltip key={label} title={fullLabel}>
                                <Box
                                  sx={{
                                    p: 0.8,
                                    borderRadius: 1.5,
                                    textAlign: "center",
                                    background: "rgba(11,127,97,0.08)",
                                    cursor: "default",
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontSize: 11,
                                      color: "#526274",
                                      fontWeight: 800,
                                    }}
                                  >
                                    {label}
                                  </Typography>
                                  <Typography
                                    sx={{ color: "#0c3558", fontWeight: 900 }}
                                  >
                                    {value}
                                  </Typography>
                                </Box>
                              </Tooltip>
                            ))}
                          </Box>

                          {selectedTournamentUsesPlayers ? (
                            <>
                              <Typography
                                sx={{
                                  color: "#526274",
                                  fontWeight: 800,
                                  mb: 0.8,
                                  fontSize: 13,
                                }}
                              >
                                Players ({teamPlayers.length})
                              </Typography>
                              {(captain || viceCaptain) && (
                                <Stack
                                  direction="row"
                                  spacing={0.6}
                                  flexWrap="wrap"
                                  useFlexGap
                                  sx={{ mb: 0.8 }}
                                >
                                  {captain && (
                                    <Chip
                                      icon={getPlayerRoleIcon("Captain")}
                                      label={`Captain: ${captain.name}`}
                                      size="small"
                                      sx={{
                                        fontWeight: 850,
                                        bgcolor: "rgba(198,146,20,0.14)",
                                        color: "#8a6200",
                                        border:
                                          "1px solid rgba(198,146,20,0.3)",
                                        "& .MuiChip-icon": {
                                          color: "#8a6200 !important",
                                        },
                                      }}
                                    />
                                  )}
                                  {viceCaptain && (
                                    <Chip
                                      icon={getPlayerRoleIcon("Vice Captain")}
                                      label={`Vice Captain: ${viceCaptain.name}`}
                                      size="small"
                                      sx={{
                                        fontWeight: 850,
                                        bgcolor: "rgba(24,90,157,0.12)",
                                        color: "#185a9d",
                                        border:
                                          "1px solid rgba(24,90,157,0.3)",
                                        "& .MuiChip-icon": {
                                          color: "#185a9d !important",
                                        },
                                      }}
                                    />
                                  )}
                                </Stack>
                              )}
                              <Stack
                                direction="row"
                                spacing={0.6}
                                flexWrap="wrap"
                                useFlexGap
                              >
                                {teamPlayers
                                  .filter(
                                    (player) =>
                                      player !== captain &&
                                      player !== viceCaptain,
                                  )
                                  .map((player) => (
                                    <Chip
                                      key={player.id}
                                      icon={getPlayerRoleIcon(player.role)}
                                      label={
                                        player.username
                                          ? `${player.name} @${player.username}`
                                          : player.name
                                      }
                                      size="small"
                                      title={player.role || "Player"}
                                      sx={{
                                        fontWeight: 700,
                                        bgcolor: "rgba(12,53,88,0.05)",
                                      }}
                                    />
                                  ))}
                              </Stack>
                            </>
                          ) : (
                            <Chip
                              label="Team-only scoring"
                              size="small"
                              sx={{ fontWeight: 800 }}
                            />
                          )}
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>
              )}
            </Paper>
          )}
        </Box>
      </Box>
      <Dialog
        open={Boolean(fixtureToStart)}
        onClose={() => {
          if (!startingMatchId) setFixtureToStart(null);
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ color: "#0c3558", fontWeight: 950 }}>
          Toss and batting order
        </DialogTitle>
        <DialogContent>
          {fixtureToStart && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                {fixtureToStart.team1.name} vs {fixtureToStart.team2.name}
              </Alert>
              <FormControl fullWidth sx={fieldSx}>
                <InputLabel>Toss Winner</InputLabel>
                <Select
                  label="Toss Winner"
                  value={tossWinnerTeamId}
                  onChange={(event) => setTossWinnerTeamId(event.target.value)}
                >
                  {[fixtureToStart.team1, fixtureToStart.team2].map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={fieldSx}>
                <InputLabel>Decision</InputLabel>
                <Select
                  label="Decision"
                  value={tossDecision}
                  onChange={(event) =>
                    setTossDecision(event.target.value as "bat" | "bowl")
                  }
                >
                  <MenuItem value="bat">Bat first</MenuItem>
                  <MenuItem value="bowl">Bowl first</MenuItem>
                </Select>
              </FormControl>
              <Box
                sx={{
                  p: 1.4,
                  borderRadius: 1.5,
                  bgcolor: "rgba(11,127,97,0.08)",
                  border: "1px solid rgba(11,127,97,0.16)",
                }}
              >
                <Typography sx={{ color: "#526274", fontWeight: 800 }}>
                  Batting first
                </Typography>
                <Typography sx={{ color: "#0c3558", fontWeight: 950 }}>
                  {(() => {
                    const winner =
                      fixtureToStart.team1.id === tossWinnerTeamId
                        ? fixtureToStart.team1
                        : fixtureToStart.team2;
                    const loser =
                      fixtureToStart.team1.id === tossWinnerTeamId
                        ? fixtureToStart.team2
                        : fixtureToStart.team1;
                    return tossDecision === "bat" ? winner.name : loser.name;
                  })()}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setFixtureToStart(null)}
            disabled={Boolean(startingMatchId)}
            sx={softButtonSx}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={
              startingMatchId ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <PlayArrowRounded />
              )
            }
            disabled={Boolean(startingMatchId) || !tossWinnerTeamId}
            onClick={handleConfirmStartFixture}
            sx={primaryButtonSx}
          >
            Start scorer
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        open={Boolean(deletingTarget)}
        title={
          deletingTarget?.type === "tournament"
            ? "Delete tournament?"
            : "Delete team?"
        }
        content={
          deletingTarget
            ? `Delete ${deletingTarget.name}? This action cannot be undone.`
            : "This action cannot be undone."
        }
        cancelText="Cancel"
        confirmText="Delete"
        onClose={() => setDeletingTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default TournamentManager;
