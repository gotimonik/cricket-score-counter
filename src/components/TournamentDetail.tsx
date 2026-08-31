import React, { useEffect, useRef } from "react";
import {
  AddRounded,
  ArrowBackRounded,
  CalendarMonthRounded,
  CheckCircleRounded,
  CloseRounded,
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
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import {
  getBallsPerOver,
  type BallEvent,
  type ScoreState,
} from "../types/cricket";
import type {
  SavedPlayerTeam,
  SavedPlayerTeamInput,
} from "../types/playerTeam";
import ConfirmDialog from "./ConfirmDialog";
import { useAdMob } from "../hooks/useAdMob";

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
  matchLengthMode: "overs",
  ballsPerMatch: 30,
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
  matchLengthMode: form.matchLengthMode === "balls" ? "balls" : "overs",
  ballsPerMatch: Math.min(
    300,
    Math.max(5, Math.round((Number(form.ballsPerMatch) || 30) / 5) * 5),
  ),
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
      if (
        event.type !== "wide" &&
        event.type !== "no-ball" &&
        event.type !== "no-ball-extra" &&
        event.type !== "penalty" &&
        event.extra_type !== "no-ball-extra"
      ) {
        legalBalls += 1;
      }
    });
  });

  // "By balls" matches use 5-ball overs instead of the standard 6.
  const ballsPerOver = getBallsPerOver(snapshot?.matchLengthMode);
  const oversText =
    legalBalls > 0
      ? `${Math.floor(legalBalls / ballsPerOver)}.${legalBalls % ballsPerOver}`
      : "0.0";
  return `${runs}/${wickets} (${oversText})`;
};

// team1Name/team2Name can come back blank from the API when a team was
// removed from the tournament roster after the match was recorded. The
// scorer snapshot still knows both team names (and the events keyed by
// them), so fall back to that to recover whichever side is missing.
const getResolvedMatchTeamNames = (
  match: TournamentMatch,
): [string, string] => {
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

const TournamentDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showInterstitial } = useAdMob();
  const [isLoggedIn, setIsLoggedIn] = React.useState(() =>
    AuthService.isLoggedIn(),
  );
  const { tournamentId = "" } = useParams<{ tournamentId: string }>();
  const [tournament, setTournament] = React.useState<TournamentRecord | null>(
    null,
  );
  const [savedPlayerTeams, setSavedPlayerTeams] = React.useState<
    SavedPlayerTeam[]
  >([]);
  const [tournamentForm, setTournamentForm] = React.useState<TournamentInput>(
    defaultTournamentForm,
  );
  const [showTournamentForm, setShowTournamentForm] = React.useState(false);
  const [showTeamForm, setShowTeamForm] = React.useState(false);
  type TournamentTab = "overview" | "teams" | "matches" | "standings";
  const TOURNAMENT_TAB_ORDER: TournamentTab[] = [
    "overview",
    "teams",
    "matches",
    "standings",
  ];
  const [activeTournamentTab, setActiveTournamentTab] =
    React.useState<TournamentTab>("overview");
  // Lets the tournament tabs (Overview/Teams/Matches/Standings) be switched
  // by swiping left/right on mobile, not just by tapping a tab.
  const tournamentTabSwipeStartRef = useRef<{ x: number; y: number } | null>(
    null,
  );
  const [showPlayerStats, setShowPlayerStats] = React.useState(true);
  const [showPointsTable, setShowPointsTable] = React.useState(true);
  const [showCompletedMatches, setShowCompletedMatches] = React.useState(true);
  const [showRegisteredTeams, setShowRegisteredTeams] = React.useState(true);
  const [teamForm, setTeamForm] =
    React.useState<TeamFormState>(defaultTeamForm);
  const [editingTournamentId, setEditingTournamentId] = React.useState("");
  const [savingTournament, setSavingTournament] = React.useState(false);
  const [savingTeam, setSavingTeam] = React.useState(false);
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
  // Picking the two teams for a custom fixture now happens in its own
  // dialog (like the toss dialog) instead of inline Team 1 / Team 2 selects
  // wedged between the Fixture picker and the Schedule match button.
  const [showCustomFixtureModal, setShowCustomFixtureModal] =
    React.useState(false);
  const [tossWinnerTeamId, setTossWinnerTeamId] = React.useState("");
  const [tossDecision, setTossDecision] = React.useState<"bat" | "bowl">("bat");
  // Drives the same coin-flip toss experience used for casual matches
  // (heads/tails call, animated coin, then bat/bowl choice) instead of the
  // old manual Toss Winner / Decision dropdowns.
  const [tossChosenSide, setTossChosenSide] = React.useState<
    null | "Heads" | "Tails"
  >(null);
  const [tossCoinResult, setTossCoinResult] = React.useState<
    null | "Heads" | "Tails"
  >(null);
  const [tossCoinFlipped, setTossCoinFlipped] = React.useState(false);
  const [tossCoinAnimating, setTossCoinAnimating] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const interstitialShown = useRef(false);

  useEffect(() => {
    if (interstitialShown.current) return;

    interstitialShown.current = true;
    showInterstitial();
  }, [showInterstitial]);

  // This page is scoped to a single fetched-by-id tournament, so
  // `selectedTournament` is just that record (or undefined while loading /
  // when it couldn't be found) -- kept as its own name since the rest of
  // this component's logic and JSX (shared with the list page it was
  // split from) refers to it throughout.
  const selectedTournament = tournament ?? undefined;

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
    ? true
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
  const refreshTournament = React.useCallback(async () => {
    if (!AuthService.isLoggedIn()) {
      setTournament(null);
      setSavedPlayerTeams([]);
      setLoading(false);
      return;
    }
    if (!tournamentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const [record, libraryTeams] = await Promise.all([
        TournamentService.getTournament(tournamentId),
        TeamLibraryService.getTeams().catch(() => []),
      ]);
      setTournament(record);
      setSavedPlayerTeams(libraryTeams);
    } catch (err) {
      setTournament(null);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load this tournament right now.",
      );
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);

  React.useEffect(() => {
    refreshTournament();
    return AuthService.subscribe(() => {
      setIsLoggedIn(AuthService.isLoggedIn());
      void refreshTournament();
    });
  }, [refreshTournament]);

  // Only ever auto-opens the Register team form (never auto-closes it), so a
  // brand-new tournament with no teams yet lands with the form ready to go,
  // but it won't yank the form shut from under someone mid-way through
  // registering a batch of teams.
  React.useEffect(() => {
    if (
      !loading &&
      isLoggedIn &&
      selectedTournament &&
      selectedTeams.length === 0
    ) {
      setShowTeamForm(true);
    }
  }, [isLoggedIn, loading, selectedTournament, selectedTeams.length]);

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
    setTeamForm(defaultTeamForm);
    setSelectedSavedTeamId("");
    setSaveTeamForLater(true);
    setCustomTeam1Id("");
    setCustomTeam2Id("");
    // Collapse the team form when switching to a tournament that already has
    // teams; the effect above will re-open it if the new tournament is empty.
    // Land straight on the Teams tab for a brand-new, empty tournament so the
    // form is actually visible; otherwise start on Overview.
    setShowTeamForm(selectedTeams.length === 0);
    setActiveTournamentTab(selectedTeams.length === 0 ? "teams" : "overview");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId]);

  React.useEffect(() => {
    if (!fixtureToStart) return;
    setTossWinnerTeamId(fixtureToStart.team1.id);
    setTossDecision("bat");
    setTossChosenSide(null);
    setTossCoinResult(null);
    setTossCoinFlipped(false);
    setTossCoinAnimating(false);
  }, [fixtureToStart]);

  // Mirrors the casual-match coin flip: team1 flips, team2 calls
  // heads/tails, and whoever guessed the random result right wins the toss.
  const handleFixtureCoinFlip = () => {
    if (!fixtureToStart || !tossChosenSide) return;
    setTossCoinAnimating(true);
    setTimeout(() => {
      const result: "Heads" | "Tails" = Math.random() < 0.5 ? "Heads" : "Tails";
      setTossCoinResult(result);
      setTossCoinFlipped(true);
      setTossCoinAnimating(false);
      const winner =
        tossChosenSide === result ? fixtureToStart.team2 : fixtureToStart.team1;
      setTossWinnerTeamId(winner.id);
    }, 900);
  };

  // True if `target` sits inside an element (the Player stats / Points
  // table wrappers, any future one, or the tab bar's own scroller) that
  // actually has extra horizontal content to scroll through. Walking the
  // DOM and checking real scrollWidth/overflow, rather than matching a
  // fixed list of class names, means a scrollable table added later is
  // covered automatically instead of silently re-triggering this bug.
  const isInsideHorizontallyScrollableElement = (
    target: EventTarget | null,
  ): boolean => {
    let node = target instanceof HTMLElement ? target : null;
    while (node) {
      if (node.scrollWidth > node.clientWidth + 1) {
        const overflowX = window.getComputedStyle(node).overflowX;
        if (overflowX === "auto" || overflowX === "scroll") {
          return true;
        }
      }
      node = node.parentElement;
    }
    return false;
  };

  // Swipe-to-switch-tabs for the tournament detail view (Overview / Teams /
  // Matches / Standings). Ignores touches starting on the tab bar itself or
  // inside any horizontally-scrollable table (they already handle their own
  // horizontal scrolling), and requires a clearly horizontal drag so
  // vertical scrolling still works.
  const handleTournamentTabTouchStart = (
    event: React.TouchEvent<HTMLDivElement>,
  ) => {
    const target = event.target as HTMLElement | null;
    if (
      target?.closest(".MuiTabs-root") ||
      isInsideHorizontallyScrollableElement(target)
    ) {
      tournamentTabSwipeStartRef.current = null;
      return;
    }
    const touch = event.touches[0];
    if (!touch) return;
    tournamentTabSwipeStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTournamentTabTouchEnd = (
    event: React.TouchEvent<HTMLDivElement>,
  ) => {
    const start = tournamentTabSwipeStartRef.current;
    tournamentTabSwipeStartRef.current = null;
    if (!start || !selectedTournament || showTournamentForm) return;
    const touch = event.changedTouches[0];
    if (!touch) return;
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const SWIPE_THRESHOLD = 60;
    if (
      Math.abs(deltaX) < SWIPE_THRESHOLD ||
      Math.abs(deltaX) < Math.abs(deltaY) * 1.5
    ) {
      return;
    }
    const currentIndex = TOURNAMENT_TAB_ORDER.indexOf(activeTournamentTab);
    if (currentIndex === -1) return;
    if (deltaX < 0 && currentIndex < TOURNAMENT_TAB_ORDER.length - 1) {
      // Swiped right-to-left -> advance to the next tab.
      setActiveTournamentTab(TOURNAMENT_TAB_ORDER[currentIndex + 1]);
    } else if (deltaX > 0 && currentIndex > 0) {
      // Swiped left-to-right -> go back to the previous tab.
      setActiveTournamentTab(TOURNAMENT_TAB_ORDER[currentIndex - 1]);
    }
  };

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
      setActiveTournamentTab("teams");
      setShowTeamForm(true);
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
      const saved = await TournamentService.updateTournament(
        tournamentId,
        payload,
      );
      setTournament(saved);
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
      matchLengthMode: tournament.matchLengthMode ?? "overs",
      ballsPerMatch: tournament.ballsPerMatch || tournament.oversPerMatch * 6,
      format: tournament.format,
      status: tournament.status,
      squadMode: tournament.squadMode,
    });
    setSuccess("");
    setError("");
  };

  const handleCloseTournamentForm = () => {
    setEditingTournamentId("");
    setTournamentForm(defaultTournamentForm);
    setShowTournamentForm(false);
  };

  // Team editing is intentionally not available from the Tournament page —
  // team details are edited from My Teams, and any linked tournament
  // registration is kept in sync automatically by the backend.
  const handleCloseTeamForm = () => {
    setTeamForm(defaultTeamForm);
    setSelectedSavedTeamId("");
    setSaveTeamForLater(true);
    setShowTeamForm(false);
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
      await TournamentService.addTeam(selectedTournament.id, teamPayload);
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
      await refreshTournament();
      setTeamForm(defaultTeamForm);
      setSelectedSavedTeamId("");
      setSaveTeamForLater(true);
      setSuccess(
        `Team registered successfully.${savedForLater ? " Saved for later too." : saveForLaterMessage}`,
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
      setTournament(saved);
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
        // The tournament this page was showing no longer exists -- head
        // back to the tournament list instead of trying to stay here.
        navigate("/tournaments", {
          state: { deletedTournamentName: deletingTarget.name },
        });
        return;
      } else if (selectedTournament) {
        await TournamentService.deleteTeam(
          selectedTournament.id,
          deletingTarget.id,
        );
        await refreshTournament();
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
      setTournament(syncedTournament);
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
      setShowCustomFixtureModal(true);
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
          matchLengthMode: selectedTournament.matchLengthMode,
          ballsPerMatch: selectedTournament.ballsPerMatch,
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

  const handleConfirmCustomFixtureTeams = () => {
    const { team1, team2 } = selectedCustomFixtureTeams;
    if (!team1 || !team2 || team1.id === team2.id) {
      setError("Select two different teams for the custom fixture.");
      return;
    }

    setShowCustomFixtureModal(false);
    setFixtureToStart({
      key: CUSTOM_FIXTURE_KEY,
      team1,
      team2,
    });
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
        matchLengthMode: selectedTournament.matchLengthMode,
        ballsPerMatch: selectedTournament.ballsPerMatch,
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

  const totalPlayers = React.useMemo(() => {
    // Dedupe by player identity in case the same player was somehow added
    // to more than one team within this tournament.
    const uniquePlayerIds = new Set<string>();
    selectedTeams.forEach((team) => {
      (team.players ?? []).forEach((player) => {
        uniquePlayerIds.add(player.playerId || player.id);
      });
    });
    return uniquePlayerIds.size;
  }, [selectedTeams]);

  return (
    <>
      <MetaHelmet
        pageTitle={selectedTournament ? selectedTournament.name : "Tournament"}
        canonical={location.pathname}
        description="Manage this tournament's teams, fixtures, standings, and player stats."
        robots="noindex,follow"
      />
      <AppBar showHomeMenuItem />
      <Box
        sx={{
          minHeight: "calc(100dvh - 88px)",
          py: { xs: 2.5, sm: 4 },
          px: { xs: 1.4, sm: 2.5 },
          pb: { xs: 8, sm: 8 },
          background: "#f3f8fb",
        }}
      >
        <Box
          sx={{ maxWidth: 1180, mx: "auto" }}
          onTouchStart={handleTournamentTabTouchStart}
          onTouchEnd={handleTournamentTabTouchEnd}
        >
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
            {selectedTournament ? selectedTournament.name : "Tournament"}
          </PageTitleWithBack>

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

          {/* Feedback for actions/API calls surfaces as a toast instead of an
              inline banner pinned to the top of the page. */}
          <Snackbar
            open={Boolean(error)}
            autoHideDuration={4000}
            onClose={() => setError("")}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              severity="error"
              variant="filled"
              onClose={() => setError("")}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              {error}
            </Alert>
          </Snackbar>
          <Snackbar
            open={Boolean(success)}
            autoHideDuration={3000}
            onClose={() => setSuccess("")}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              severity="success"
              variant="filled"
              onClose={() => setSuccess("")}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              {success}
            </Alert>
          </Snackbar>

          {isLoggedIn && (
            <Box sx={{ mx: "auto" }}>
              <Stack spacing={2} mb={2}>
                <Dialog
                  open={showTournamentForm}
                  onClose={handleCloseTournamentForm}
                  fullWidth
                  maxWidth="sm"
                  PaperProps={{
                    component: "form",
                    onSubmit: handleSaveTournament,
                    sx: { borderRadius: 3 },
                  }}
                >
                  <DialogTitle sx={{ position: "relative", pr: 6 }}>
                    <Stack direction="row" alignItems="center" spacing={1.2}>
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
                    <IconButton
                      aria-label="Close"
                      onClick={handleCloseTournamentForm}
                      sx={{
                        position: "absolute",
                        right: 10,
                        top: 10,
                        color: "var(--app-accent-text, #185a9d)",
                      }}
                    >
                      <CloseRounded fontSize="small" />
                    </IconButton>
                  </DialogTitle>
                  <DialogContent dividers>
                    <Box sx={{ ...gridSx, pt: 0.5 }}>
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
                          updateTournamentField("location", event.target.value)
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
                      <ToggleButtonGroup
                        value={tournamentForm.matchLengthMode ?? "overs"}
                        exclusive
                        fullWidth
                        size="small"
                        onChange={(_event, value) => {
                          if (value)
                            updateTournamentField("matchLengthMode", value);
                        }}
                        sx={{ gridColumn: { sm: "1 / -1" } }}
                      >
                        <ToggleButton value="overs">By Overs</ToggleButton>
                        <ToggleButton value="balls">By Balls</ToggleButton>
                      </ToggleButtonGroup>
                      {tournamentForm.matchLengthMode === "balls" ? (
                        <TextField
                          label="Balls Per Match"
                          type="number"
                          value={tournamentForm.ballsPerMatch}
                          onChange={(event) =>
                            updateTournamentField(
                              "ballsPerMatch",
                              Number(event.target.value),
                            )
                          }
                          helperText="In steps of 5 (e.g. 5, 10, 15, ...)"
                          inputProps={{ min: 5, max: 300, step: 5 }}
                          sx={fieldSx}
                        />
                      ) : (
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
                      )}
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
                          <MenuItem value="league">League Round Robin</MenuItem>
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
                  </DialogContent>
                  <DialogActions sx={{ px: 3, py: 2, display: "block" }}>
                    <Stack
                      direction={{ xs: "column-reverse", sm: "row" }}
                      alignItems="stretch"
                      spacing={1.2}
                    >
                      {editingTournamentId && (
                        <Button
                          type="button"
                          color="error"
                          startIcon={<DeleteRounded />}
                          onClick={() =>
                            setDeletingTarget({
                              type: "tournament",
                              id: editingTournamentId,
                              name: tournamentForm.name || "this tournament",
                            })
                          }
                          sx={{
                            ...softButtonSx,
                            color: "#b42318",
                            width: { xs: "100%", sm: "auto" },
                          }}
                        >
                          Delete
                        </Button>
                      )}
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        sx={{
                          width: { xs: "100%", sm: "auto" },
                          ml: { sm: "auto" },
                        }}
                      >
                        <Button
                          type="button"
                          onClick={handleCloseTournamentForm}
                          sx={{
                            ...softButtonSx,
                            width: { xs: "100%", sm: "auto" },
                          }}
                        >
                          Cancel
                        </Button>
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
                          sx={{
                            ...primaryButtonSx,
                            width: { xs: "100%", sm: "auto" },
                          }}
                        >
                          {editingTournamentId
                            ? "Update tournament"
                            : "Save tournament"}
                        </Button>
                      </Stack>
                    </Stack>
                  </DialogActions>
                </Dialog>

                <Stack spacing={2}>
                  {loading ? (
                    <Paper
                      elevation={0}
                      sx={{
                        ...sectionSx,
                        display: "flex",
                        justifyContent: "center",
                        py: 4,
                      }}
                    >
                      <CircularProgress />
                    </Paper>
                  ) : !selectedTournament ? (
                    <Paper elevation={0} sx={sectionSx}>
                      <Stack
                        alignItems="center"
                        spacing={1}
                        sx={{ py: 2, textAlign: "center" }}
                      >
                        <Typography sx={{ color: "#0c3558", fontWeight: 900 }}>
                          Tournament not found
                        </Typography>
                        <Typography sx={{ color: "#526274", fontWeight: 600 }}>
                          It may have been deleted, or you may not have access
                          to it.
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<ArrowBackRounded />}
                          onClick={() => navigate("/tournaments")}
                          sx={{ ...primaryButtonSx, mt: 1 }}
                        >
                          Back to tournaments
                        </Button>
                      </Stack>
                    </Paper>
                  ) : (
                    <Paper elevation={0} sx={sectionSx}>
                      <Stack direction="row" alignItems="center" spacing={1.2}>
                        {/* <IconButton
                          onClick={() => navigate("/tournaments")}
                          aria-label="Back to tournaments"
                          sx={{
                            color: "#185a9d",
                            bgcolor: "rgba(24,90,157,0.08)",
                            "&:hover": { bgcolor: "rgba(24,90,157,0.16)" },
                          }}
                        >
                          <ArrowBackRounded />
                        </IconButton> */}
                        <Avatar
                          src={selectedTournament.logoUrl || undefined}
                          sx={{
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
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 900,
                              color: "#0c3558",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {selectedTournament.name}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={0.6}
                            alignItems="center"
                            flexWrap="wrap"
                            useFlexGap
                          >
                            <Chip
                              size="small"
                              label={statusLabel(selectedTournament.status)}
                              sx={{
                                height: 20,
                                fontSize: 11,
                                fontWeight: 850,
                                bgcolor: statusChipColors(
                                  selectedTournament.status,
                                ).bg,
                                color: statusChipColors(
                                  selectedTournament.status,
                                ).fg,
                              }}
                            />
                            <Typography
                              sx={{
                                color: "#526274",
                                fontSize: 12.5,
                                fontWeight: 700,
                              }}
                            >
                              {(selectedTournament.teams ?? []).length} teams
                              {" · "}
                              {squadModeLabel(selectedTournament.squadMode)}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </Paper>
                  )}
                </Stack>

                {selectedTournament && (
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      border: "1px solid rgba(12,53,88,0.16)",
                      background: "#fff",
                      boxShadow: "0 10px 30px rgba(8, 26, 56, 0.08)",
                      overflow: "hidden",
                    }}
                  >
                    <Tabs
                      value={activeTournamentTab}
                      onChange={(_event, value: TournamentTab) =>
                        setActiveTournamentTab(value)
                      }
                      variant="scrollable"
                      scrollButtons="auto"
                      allowScrollButtonsMobile
                      sx={{
                        minHeight: 52,
                        "& .MuiTab-root": {
                          minHeight: 52,
                          textTransform: "none",
                          fontWeight: 850,
                          color: "#526274",
                        },
                        "& .Mui-selected": {
                          color: "#0b7f61 !important",
                        },
                        "& .MuiTabs-indicator": {
                          backgroundColor: "#0b7f61",
                          height: 3,
                        },
                      }}
                    >
                      <Tab
                        value="overview"
                        icon={<InfoRounded fontSize="small" />}
                        iconPosition="start"
                        label="Overview"
                      />
                      <Tab
                        value="teams"
                        icon={<GroupsRounded fontSize="small" />}
                        iconPosition="start"
                        label={`Teams${selectedTeams.length ? ` (${selectedTeams.length})` : ""}`}
                      />
                      <Tab
                        value="matches"
                        icon={<PlayArrowRounded fontSize="small" />}
                        iconPosition="start"
                        label="Matches"
                      />
                      <Tab
                        value="standings"
                        icon={<TableChartRounded fontSize="small" />}
                        iconPosition="start"
                        label="Standings"
                      />
                    </Tabs>
                  </Paper>
                )}

                {activeTournamentTab === "overview" && selectedTournament && (
                  <Paper elevation={0} sx={sectionSx}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 0.5 }}
                    >
                      <InfoRounded sx={{ color: "#185a9d", fontSize: 20 }} />
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 900, color: "#0c3558" }}
                      >
                        Tournament details
                      </Typography>
                    </Stack>
                    <Typography sx={{ color: "#526274", fontWeight: 650 }}>
                      Organized by {selectedTournament.organizerName}
                    </Typography>

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
                        label={`${
                          selectedTournament.matchLengthMode === "balls"
                            ? `${selectedTournament.ballsPerMatch} balls`
                            : `${selectedTournament.oversPerMatch} overs`
                        }, ${ballTypeLabel(
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

                {activeTournamentTab === "teams" &&
                  selectedTournament &&
                  !showTeamForm && (
                    <Paper elevation={0} sx={sectionSx}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.2}
                        alignItems={{ xs: "stretch", sm: "center" }}
                        justifyContent="space-between"
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.2}
                        >
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
                              sx={{ fontWeight: 900, color: "#0c3558" }}
                            >
                              {selectedTeams.length === 0
                                ? "Register your first team"
                                : "Register another team"}
                            </Typography>
                            <Typography
                              sx={{ color: "#526274", fontWeight: 650 }}
                            >
                              {selectedTournamentUsesPlayers
                                ? "Pick a saved team or add players manually."
                                : "Add team and captain details only."}
                            </Typography>
                          </Box>
                        </Stack>
                        <Button
                          variant="contained"
                          startIcon={<PersonAddRounded />}
                          onClick={() => setShowTeamForm(true)}
                          sx={blueButtonSx}
                        >
                          Register team
                        </Button>
                      </Stack>
                    </Paper>
                  )}

                {activeTournamentTab === "teams" &&
                  selectedTournament &&
                  showTeamForm && (
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
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.2}
                        >
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
                              Register team
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
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          flexWrap="wrap"
                          useFlexGap
                        >
                          <Chip
                            label={squadModeLabel(
                              selectedTournament?.squadMode,
                            )}
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
                          <Button
                            type="button"
                            onClick={handleCloseTeamForm}
                            sx={softButtonSx}
                          >
                            Close
                          </Button>
                        </Stack>
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

                      {!(
                        selectedTournamentUsesPlayers && selectedSavedTeamId
                      ) && (
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
                                        xs: "28px 1fr 40px",
                                        sm: "28px minmax(0, 1fr) 160px 40px",
                                      },
                                      gridTemplateAreas: {
                                        xs: `"avatar name action" "avatar role action"`,
                                        sm: `"avatar name role action"`,
                                      },
                                      columnGap: 1,
                                      rowGap: 0.8,
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
                                        gridArea: "avatar",
                                        alignSelf: {
                                          xs: "start",
                                          sm: "center",
                                        },
                                        mt: { xs: 0.5, sm: 0 },
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
                                      sx={{ ...fieldSx, gridArea: "name" }}
                                    />
                                    <FormControl
                                      size="small"
                                      sx={{ ...fieldSx, gridArea: "role" }}
                                    >
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
                                        <MenuItem value="">
                                          Select role
                                        </MenuItem>
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
                                    <Tooltip
                                      title={`Remove player ${index + 1}`}
                                    >
                                      <IconButton
                                        aria-label={`Remove player ${index + 1}`}
                                        onClick={() => removePlayerRow(index)}
                                        sx={{
                                          ...dangerButtonSx,
                                          gridArea: "action",
                                          alignSelf: {
                                            xs: "start",
                                            sm: "center",
                                          },
                                          mt: { xs: 0.5, sm: 0 },
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
                          Register team
                        </Button>
                      </Stack>
                    </Paper>
                  )}
              </Stack>
            </Box>
          )}

          {activeTournamentTab === "matches" &&
            isLoggedIn &&
            selectedTournament && (
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
                          onChange={(event) => {
                            const nextFixtureKey = event.target.value;
                            setSelectedFixtureKey(nextFixtureKey);
                            // Open the team picker right away instead of
                            // waiting for a second tap on "Schedule match" --
                            // picking "Custom fixture" should visibly do
                            // something immediately.
                            if (nextFixtureKey === CUSTOM_FIXTURE_KEY) {
                              setShowCustomFixtureModal(true);
                              setError("");
                              setSuccess("");
                            }
                          }}
                        >
                          {playableFixtures.map((fixture) => (
                            <MenuItem
                              key={fixture.key}
                              value={fixture.key}
                              sx={{ maxWidth: "100%" }}
                            >
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                justifyContent="space-between"
                                sx={{ width: "100%", minWidth: 0 }}
                              >
                                <Typography
                                  sx={{
                                    fontWeight: 800,
                                    minWidth: 0,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
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
                                      flexShrink: 0,
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
                  </Stack>
                )}
              </Paper>
            )}

          {activeTournamentTab === "standings" &&
            isLoggedIn &&
            selectedTournament &&
            selectedTournamentUsesPlayers && (
              <Paper elevation={0} sx={{ ...sectionSx, mt: 2 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  spacing={1}
                  onClick={() => setShowPlayerStats((prev) => !prev)}
                  sx={{ cursor: "pointer" }}
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
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={`${playerLeaderboard.length} players`}
                      sx={{
                        fontWeight: 900,
                        alignSelf: { xs: "flex-start", sm: "center" },
                      }}
                    />
                    <ExpandMoreRounded
                      sx={{
                        color: "#185a9d",
                        transform: showPlayerStats
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  </Stack>
                </Stack>

                <Collapse in={showPlayerStats}>
                  <Box sx={{ pt: 2 }}>
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
                              <Stack
                                spacing={0.8}
                                sx={{ display: { xs: "flex", sm: "none" } }}
                              >
                                {team.players.map((row) => (
                                  <Box
                                    key={`${row.id}-${team.teamId}-card`}
                                    sx={{
                                      p: 1.1,
                                      borderRadius: 1.5,
                                      border: "1px solid rgba(12,53,88,0.12)",
                                      background: "rgba(255,255,255,0.82)",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        color: "#0c3558",
                                        fontWeight: 900,
                                        overflowWrap: "anywhere",
                                        fontSize: 13.5,
                                      }}
                                    >
                                      {row.username
                                        ? `${row.name} @${row.username}`
                                        : row.name}
                                    </Typography>
                                    <Stack
                                      direction="row"
                                      spacing={1.4}
                                      flexWrap="wrap"
                                      useFlexGap
                                      sx={{ mt: 0.6 }}
                                    >
                                      {[
                                        ["M", row.matchesPlayed],
                                        ["Runs", row.runs],
                                        ["4s", row.fours],
                                        ["6s", row.sixes],
                                        ["Wkts", row.wickets],
                                      ].map(([label, value]) => (
                                        <Box key={label} sx={{ minWidth: 34 }}>
                                          <Typography
                                            sx={{
                                              fontSize: 10.5,
                                              color: "#8a94a6",
                                              fontWeight: 800,
                                              lineHeight: 1.3,
                                            }}
                                          >
                                            {label}
                                          </Typography>
                                          <Typography
                                            sx={{
                                              color: "#0c3558",
                                              fontWeight: 850,
                                              fontSize: 13.5,
                                            }}
                                          >
                                            {value}
                                          </Typography>
                                        </Box>
                                      ))}
                                    </Stack>
                                  </Box>
                                ))}
                              </Stack>
                              <Box
                                sx={{
                                  overflowX: "auto",
                                  display: { xs: "none", sm: "block" },
                                }}
                              >
                                <Box
                                  sx={{
                                    minWidth: 620,
                                    display: "grid",
                                    gridTemplateColumns:
                                      "minmax(180px, 1.6fr) repeat(5, minmax(64px, 0.65fr))",
                                    gap: 0.6,
                                  }}
                                >
                                  {[
                                    "Player",
                                    "M",
                                    "Runs",
                                    "4s",
                                    "6s",
                                    "Wkts",
                                  ].map((label) => (
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
                                  ))}
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
                                            background:
                                              "rgba(255,255,255,0.72)",
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
                  </Box>
                </Collapse>
              </Paper>
            )}

          {activeTournamentTab === "standings" &&
            isLoggedIn &&
            selectedTournament &&
            selectedTournamentUsesPlayers && (
              <Divider sx={{ my: 1, borderColor: "rgba(24,90,157,0.16)" }} />
            )}

          {activeTournamentTab === "standings" &&
            isLoggedIn &&
            selectedTournament && (
              <Paper elevation={0} sx={{ ...sectionSx, mt: 2 }}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "stretch", md: "center" }}
                  spacing={1}
                  onClick={() => setShowPointsTable((prev) => !prev)}
                  sx={{ cursor: "pointer" }}
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
                      Synced from backend tournament results after each
                      completed match.
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} alignItems="center">
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
                      onClick={(event) => {
                        event.stopPropagation();
                        handleSyncStatistics();
                      }}
                      sx={{
                        ...primaryButtonSx,
                        alignSelf: { xs: "stretch", md: "center" },
                      }}
                    >
                      Sync stats
                    </Button>
                    <ExpandMoreRounded
                      sx={{
                        color: "#185a9d",
                        flexShrink: 0,
                        transform: showPointsTable
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  </Stack>
                </Stack>

                <Collapse in={showPointsTable}>
                  <Box sx={{ pt: 2 }}>
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
                        <Stack
                          spacing={1}
                          sx={{ display: { xs: "flex", sm: "none" } }}
                        >
                          {pointsTable.map((row, rowIndex) => (
                            <Box
                              key={row.teamId}
                              sx={{
                                p: 1.2,
                                borderRadius: 1.5,
                                border: "1px solid rgba(12,53,88,0.12)",
                                background: "#fff",
                              }}
                            >
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={1}
                              >
                                <Stack
                                  direction="row"
                                  spacing={0.8}
                                  alignItems="center"
                                  sx={{ minWidth: 0 }}
                                >
                                  <Chip
                                    size="small"
                                    label={rowIndex + 1}
                                    sx={{
                                      height: 20,
                                      minWidth: 20,
                                      fontSize: 11,
                                      fontWeight: 900,
                                      bgcolor: "rgba(24,90,157,0.1)",
                                      color: "#185a9d",
                                    }}
                                  />
                                  <Typography
                                    sx={{
                                      color: "#0c3558",
                                      fontWeight: 900,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {row.teamName}
                                  </Typography>
                                </Stack>
                                <Chip
                                  size="small"
                                  label={`${row.points} pts`}
                                  sx={{
                                    flexShrink: 0,
                                    fontWeight: 900,
                                    bgcolor: "rgba(11,127,97,0.12)",
                                    color: "#0b7f61",
                                  }}
                                />
                              </Stack>
                              <Stack
                                direction="row"
                                spacing={1.4}
                                flexWrap="wrap"
                                useFlexGap
                                sx={{ mt: 0.8 }}
                              >
                                {[
                                  ["P", row.played],
                                  ["W", row.won],
                                  ["L", row.lost],
                                  ["T", row.tied],
                                  ["NRR", row.netRunRate.toFixed(3)],
                                ].map(([label, value]) => (
                                  <Box key={label} sx={{ minWidth: 34 }}>
                                    <Typography
                                      sx={{
                                        fontSize: 10.5,
                                        color: "#8a94a6",
                                        fontWeight: 800,
                                        lineHeight: 1.3,
                                      }}
                                    >
                                      {label}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        color: "#0c3558",
                                        fontWeight: 850,
                                        fontSize: 13.5,
                                      }}
                                    >
                                      {value}
                                    </Typography>
                                  </Box>
                                ))}
                              </Stack>
                            </Box>
                          ))}
                        </Stack>
                        <Box
                          sx={{
                            overflowX: "auto",
                            display: { xs: "none", sm: "block" },
                          }}
                        >
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
                            {[
                              "Team",
                              "P",
                              "W",
                              "L",
                              "T",
                              "Pts",
                              "RF",
                              "RA",
                              "NRR",
                            ].map((label) => (
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
                            ))}
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
                  </Box>
                </Collapse>
              </Paper>
            )}

          {activeTournamentTab === "matches" &&
            isLoggedIn &&
            selectedTournament && (
              <Paper elevation={0} sx={{ ...sectionSx, mt: 2 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  spacing={1}
                  onClick={() => setShowCompletedMatches((prev) => !prev)}
                  sx={{ cursor: "pointer" }}
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
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={`${completedMatches.length} completed`}
                      sx={{
                        fontWeight: 900,
                        bgcolor: "rgba(24,90,157,0.12)",
                        color: "#185a9d",
                        alignSelf: { xs: "flex-start", sm: "center" },
                      }}
                    />
                    <ExpandMoreRounded
                      sx={{
                        color: "#185a9d",
                        flexShrink: 0,
                        transform: showCompletedMatches
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                      }}
                    />
                  </Stack>
                </Stack>

                <Collapse in={showCompletedMatches}>
                  <Box sx={{ pt: 2 }}>
                    {completedMatches.length === 0 ? (
                      <Alert severity="info" sx={{ borderRadius: 2 }}>
                        Completed tournament matches will appear here after the
                        scorer finish action syncs the result.
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
                                      match.completedAt?.slice(0, 10) ||
                                      "Completed"
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
                                                sx={{
                                                  fontSize: 14,
                                                  color: "#0b7f61",
                                                }}
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
                                            sx={{
                                              color: "#0c3558",
                                              fontWeight: 950,
                                            }}
                                          >
                                            {getScoreSummary(
                                              match.snapshot,
                                              teamName,
                                            )}
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
                  </Box>
                </Collapse>
              </Paper>
            )}

          {activeTournamentTab === "teams" &&
            isLoggedIn &&
            selectedTournament && (
              <Paper elevation={0} sx={{ ...sectionSx, mt: 2 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  spacing={1}
                  onClick={() => setShowRegisteredTeams((prev) => !prev)}
                  sx={{ cursor: "pointer" }}
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
                  <ExpandMoreRounded
                    sx={{
                      color: "#185a9d",
                      flexShrink: 0,
                      alignSelf: { xs: "flex-end", sm: "center" },
                      transform: showRegisteredTeams
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </Stack>

                <Collapse in={showRegisteredTeams}>
                  <Box sx={{ pt: 2 }}>
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
                            lost:
                              team.statistics?.losses ?? team.stats?.lost ?? 0,
                            points:
                              team.statistics?.points ??
                              team.stats?.points ??
                              0,
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
                              player.role?.trim().toLowerCase() ===
                              "vice captain",
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
                                    gridTemplateColumns:
                                      "repeat(5, minmax(0, 1fr))",
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
                                          sx={{
                                            color: "#0c3558",
                                            fontWeight: 900,
                                          }}
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
                                            icon={getPlayerRoleIcon(
                                              "Vice Captain",
                                            )}
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
                                            icon={getPlayerRoleIcon(
                                              player.role,
                                            )}
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
                  </Box>
                </Collapse>
              </Paper>
            )}
        </Box>
      </Box>
      <Dialog
        open={showCustomFixtureModal}
        onClose={() => setShowCustomFixtureModal(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "var(--app-accent-text, #185a9d)",
            fontWeight: 950,
            fontSize: "calc(20px * var(--app-font-scale, 1))",
          }}
        >
          Select custom fixture teams
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Alert
              severity="info"
              sx={{
                borderRadius: 2,
                background:
                  "color-mix(in srgb, var(--app-accent-start, #43cea2) 10%, #ffffff 90%)",
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 700,
                border:
                  "1px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 30%, transparent 70%)",
                "& .MuiAlert-icon": {
                  color: "var(--app-accent-text, #185a9d)",
                },
              }}
            >
              Pick any two registered teams to play a match outside the
              predefined fixture list.
            </Alert>
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
                      selectedTeams.find((team) => team.id !== nextTeam1Id)
                        ?.id || "",
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
                onChange={(event) => setCustomTeam2Id(event.target.value)}
              >
                {customTeam2Options.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setShowCustomFixtureModal(false)}
            sx={{
              ...softButtonSx,
              color: "var(--app-accent-text, #185a9d)",
              "&:hover": {
                background:
                  "color-mix(in srgb, var(--app-accent-start, #43cea2) 12%, transparent 88%)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<PlayArrowRounded />}
            disabled={
              !selectedCustomFixtureTeams.team1 ||
              !selectedCustomFixtureTeams.team2 ||
              selectedCustomFixtureTeams.team1.id ===
                selectedCustomFixtureTeams.team2.id
            }
            onClick={handleConfirmCustomFixtureTeams}
            sx={primaryButtonSx}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={Boolean(fixtureToStart)}
        onClose={() => {
          if (!startingMatchId) setFixtureToStart(null);
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "var(--app-accent-text, #185a9d)",
            fontWeight: 950,
            fontSize: "calc(20px * var(--app-font-scale, 1))",
          }}
        >
          Toss and batting order
        </DialogTitle>
        <DialogContent>
          {fixtureToStart && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Alert
                severity="info"
                sx={{
                  borderRadius: 2,
                  background:
                    "color-mix(in srgb, var(--app-accent-start, #43cea2) 10%, #ffffff 90%)",
                  color: "var(--app-accent-text, #185a9d)",
                  fontWeight: 700,
                  border:
                    "1px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 30%, transparent 70%)",
                  "& .MuiAlert-icon": {
                    color: "var(--app-accent-text, #185a9d)",
                  },
                }}
              >
                {fixtureToStart.team1.name} vs {fixtureToStart.team2.name}
              </Alert>
              {/* Same coin-flip toss experience as the casual match flow:
                  team1 flips, team2 calls heads/tails, then the toss winner
                  picks bat or bowl. */}
              {!tossCoinFlipped ? (
                <Box sx={{ textAlign: "center", py: 1 }}>
                  <Box
                    sx={{
                      fontWeight: 700,
                      fontSize: "calc(17px * var(--app-font-scale, 1))",
                      mb: 2,
                    }}
                  >
                    <span style={{ color: "var(--app-accent-start, #43cea2)" }}>
                      {fixtureToStart.team1.name}
                    </span>{" "}
                    will flip the coin
                    <br />
                    <span style={{ color: "var(--app-accent-text, #185a9d)" }}>
                      {fixtureToStart.team2.name}
                    </span>{" "}
                    will select Heads or Tails
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Button
                      variant={
                        tossChosenSide === "Heads" ? "contained" : "outlined"
                      }
                      sx={{
                        fontWeight: 800,
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        background:
                          tossChosenSide === "Heads"
                            ? "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)"
                            : "#fff",
                        color:
                          tossChosenSide === "Heads"
                            ? "#fff"
                            : "var(--app-accent-text, #185a9d)",
                        borderWidth: tossChosenSide === "Heads" ? 0 : 2,
                        borderColor: "var(--app-accent-start, #43cea2)",
                      }}
                      onClick={() => setTossChosenSide("Heads")}
                    >
                      Heads
                    </Button>
                    <Button
                      variant={
                        tossChosenSide === "Tails" ? "contained" : "outlined"
                      }
                      sx={{
                        fontWeight: 800,
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        background:
                          tossChosenSide === "Tails"
                            ? "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)"
                            : "#fff",
                        color:
                          tossChosenSide === "Tails"
                            ? "#fff"
                            : "var(--app-accent-text, #185a9d)",
                        borderWidth: tossChosenSide === "Tails" ? 0 : 2,
                        borderColor: "var(--app-accent-start, #43cea2)",
                      }}
                      onClick={() => setTossChosenSide("Tails")}
                    >
                      Tails
                    </Button>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Box
                      onClick={
                        !tossChosenSide || tossCoinAnimating
                          ? undefined
                          : () => handleFixtureCoinFlip()
                      }
                      sx={{
                        borderRadius: "50%",
                        width: 72,
                        height: 72,
                        background: !tossChosenSide
                          ? "radial-gradient(circle, #e0eafc 60%, #bdbdbd 100%)"
                          : "radial-gradient(circle, var(--app-accent-start, #43cea2) 60%, var(--app-accent-end, #185a9d) 100%)",
                        boxShadow:
                          "0 4px 16px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 27%, transparent 73%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        color: "#fff",
                        cursor: !tossChosenSide ? "not-allowed" : "pointer",
                        opacity: !tossChosenSide ? 0.5 : 1,
                        userSelect: "none",
                        transition:
                          "background 0.3s, opacity 0.3s, transform 0.9s cubic-bezier(.68,-0.55,.27,1.55)",
                        transform: tossCoinAnimating
                          ? "rotateY(720deg)"
                          : "none",
                      }}
                      title={
                        !tossChosenSide
                          ? "Select Heads or Tails first"
                          : "Click to flip coin"
                      }
                    >
                      🪙
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      fontWeight: 500,
                      fontSize: "calc(14px * var(--app-font-scale, 1))",
                      color: "var(--app-accent-text, #185a9d)",
                      mt: 1,
                    }}
                  >
                    {tossChosenSide
                      ? "Tap the coin to flip"
                      : "Select Heads or Tails to enable coin"}
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: "center", py: 1 }}>
                  <Box
                    sx={{
                      fontWeight: 700,
                      fontSize: "calc(17px * var(--app-font-scale, 1))",
                      color: "var(--app-accent-text, #185a9d)",
                      mb: 0.5,
                    }}
                  >
                    Coin Flip Result:{" "}
                    <span style={{ color: "var(--app-accent-start, #43cea2)" }}>
                      {tossCoinResult}
                    </span>
                  </Box>
                  <Box
                    sx={{
                      fontWeight: 600,
                      fontSize: "calc(15px * var(--app-font-scale, 1))",
                      color: "var(--app-accent-text, #185a9d)",
                      mb: 2,
                    }}
                  >
                    {
                      (tossWinnerTeamId === fixtureToStart.team1.id
                        ? fixtureToStart.team1
                        : fixtureToStart.team2
                      ).name
                    }{" "}
                    won the toss!
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 2 }}
                  >
                    <Button
                      variant={
                        tossDecision === "bat" ? "contained" : "outlined"
                      }
                      sx={{
                        fontWeight: 800,
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        background:
                          tossDecision === "bat"
                            ? "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)"
                            : "#fff",
                        color:
                          tossDecision === "bat"
                            ? "#fff"
                            : "var(--app-accent-text, #185a9d)",
                        borderWidth: tossDecision === "bat" ? 0 : 2,
                        borderColor: "var(--app-accent-start, #43cea2)",
                      }}
                      onClick={() => setTossDecision("bat")}
                    >
                      Bat First
                    </Button>
                    <Button
                      variant={
                        tossDecision === "bowl" ? "contained" : "outlined"
                      }
                      sx={{
                        fontWeight: 800,
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        background:
                          tossDecision === "bowl"
                            ? "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)"
                            : "#fff",
                        color:
                          tossDecision === "bowl"
                            ? "#fff"
                            : "var(--app-accent-text, #185a9d)",
                        borderWidth: tossDecision === "bowl" ? 0 : 2,
                        borderColor: "var(--app-accent-start, #43cea2)",
                      }}
                      onClick={() => setTossDecision("bowl")}
                    >
                      Bowl First
                    </Button>
                  </Box>
                </Box>
              )}
              {tossCoinFlipped && (
                <Box
                  sx={{
                    p: 1.6,
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #ffffff 0%, color-mix(in srgb, var(--app-accent-start, #43cea2) 12%, #ffffff 88%) 100%)",
                    border: "1.5px solid var(--app-accent-start, #43cea2)",
                    boxShadow:
                      "0 4px 14px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 18%, transparent 82%)",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--app-accent-text, #185a9d)",
                      opacity: 0.75,
                      fontWeight: 800,
                      fontSize: "calc(13px * var(--app-font-scale, 1))",
                      textTransform: "uppercase",
                      letterSpacing: "0.4px",
                    }}
                  >
                    Batting first
                  </Typography>
                  <Typography
                    sx={{
                      color: "var(--app-accent-text, #185a9d)",
                      fontWeight: 950,
                      fontSize: "calc(17px * var(--app-font-scale, 1))",
                    }}
                  >
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
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setFixtureToStart(null)}
            disabled={Boolean(startingMatchId)}
            sx={{
              ...softButtonSx,
              color: "var(--app-accent-text, #185a9d)",
              "&:hover": {
                background:
                  "color-mix(in srgb, var(--app-accent-start, #43cea2) 12%, transparent 88%)",
              },
            }}
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
            disabled={Boolean(startingMatchId) || !tossCoinFlipped}
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

export default TournamentDetail;
