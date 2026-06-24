import React from "react";
import {
  AddRounded,
  CalendarMonthRounded,
  DeleteRounded,
  EditRounded,
  EmojiEventsRounded,
  GroupsRounded,
  LoginRounded,
  PersonAddRounded,
  PlaceRounded,
  PlayArrowRounded,
  SaveRounded,
  SportsCricketRounded,
  SyncRounded,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";
import AuthService from "../services/AuthService";
import TournamentService from "../services/TournamentService";
import type {
  TournamentBallType,
  TournamentFormat,
  TournamentInput,
  TournamentScorerSetup,
  TournamentRecord,
  TournamentSquadMode,
  TournamentStatus,
  TournamentTeam,
  TournamentTeamInput,
} from "../types/tournament";
import type { BallEvent, ScoreState } from "../types/cricket";
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
    { name: "", role: "Batter", contactNumber: "" },
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
  name: form.name.trim(),
  logoUrl: form.logoUrl?.trim(),
  captainName: form.captainName.trim(),
  contactNumber: form.contactNumber.trim(),
  players: form.players
    .map((player) => ({
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

const TournamentManager: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState(() =>
    AuthService.isLoggedIn(),
  );
  const [tournaments, setTournaments] = React.useState<TournamentRecord[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = React.useState("");
  const [tournamentForm, setTournamentForm] = React.useState<TournamentInput>(
    defaultTournamentForm,
  );
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
  const [startingMatchId, setStartingMatchId] = React.useState("");
  const [selectedFixtureKey, setSelectedFixtureKey] = React.useState("");
  const [fixtureToStart, setFixtureToStart] =
    React.useState<PlayableFixture | null>(null);
  const [tossWinnerTeamId, setTossWinnerTeamId] = React.useState("");
  const [tossDecision, setTossDecision] = React.useState<"bat" | "bowl">("bat");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

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
  const selectedFixture = React.useMemo(
    () =>
      playableFixtures.find((fixture) => fixture.key === selectedFixtureKey) ??
      playableFixtures[0],
    [playableFixtures, selectedFixtureKey],
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
      setSelectedTournamentId("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const records = await TournamentService.getTournaments();
      const returnTournamentId = sessionStorage.getItem(TOURNAMENT_RETURN_KEY);
      if (returnTournamentId) {
        sessionStorage.removeItem(TOURNAMENT_RETURN_KEY);
      }
      setTournaments(records);
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
    setSelectedFixtureKey((current) =>
      playableFixtures.some((fixture) => fixture.key === current)
        ? current
        : playableFixtures[0]?.key || "",
    );
  }, [playableFixtures]);

  React.useEffect(() => {
    setEditingTeamId("");
    setTeamForm(defaultTeamForm);
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

  const handleSaveTournament = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = normalizeTournamentInput(tournamentForm);
    if (!payload.name || !payload.organizerName || !payload.location) {
      setError("Please add tournament name, organizer name, and location.");
      return;
    }
    if (payload.endDate < payload.startDate) {
      setError("End date should be the same as or after the start date.");
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
        name: player.name,
        role: player.role ?? "",
        contactNumber: player.contactNumber ?? "",
      })),
    });
    setSuccess("");
    setError("");
  };

  const handleSaveTeam = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedTournament) {
      setError("Create a tournament before adding teams.");
      return;
    }

    const payload = normalizeTeamInput(teamForm);
    if (!payload.name || !payload.captainName || !payload.contactNumber) {
      setError("Please add team name, captain name, and contact number.");
      return;
    }
    if (selectedTournamentUsesPlayers && payload.players.length === 0) {
      setError("Please add at least one player.");
      return;
    }

    const teamPayload = selectedTournamentUsesPlayers
      ? payload
      : { ...payload, players: [] };

    setSavingTeam(true);
    setError("");
    setSuccess("");
    try {
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
      await refreshTournaments();
      setTeamForm(defaultTeamForm);
      setEditingTeamId("");
      setSuccess(
        editingTeamId
          ? "Team updated successfully."
          : "Team registered successfully.",
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
    if (!selectedTournament || !selectedFixture) {
      setError("Select a tournament fixture to start.");
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
              <Chip icon={<EmojiEventsRounded />} label="League" />
              <Chip icon={<SportsCricketRounded />} label="Knockout" />
              <Chip
                icon={<GroupsRounded />}
                label={`${totalPlayers} players`}
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
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 380px" },
                gap: 2,
                alignItems: "start",
              }}
            >
              <Stack spacing={2}>
                <Paper
                  component="form"
                  elevation={0}
                  onSubmit={handleSaveTournament}
                  sx={sectionSx}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mb: 2 }}
                  >
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
                      onChange={(event) =>
                        updateTournamentField("startDate", event.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
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
                        {/* <MenuItem value="with_players">Teams with players</MenuItem> */}
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
                              name: tournamentForm.name || "this tournament",
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

                <Paper
                  component="form"
                  elevation={0}
                  onSubmit={handleSaveTeam}
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
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: 1.5,
                          display: "grid",
                          placeItems: "center",
                          bgcolor: "rgba(24,90,157,0.1)",
                          color: "#185a9d",
                        }}
                      >
                        <PersonAddRounded fontSize="small" />
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 900,
                            color: "#0c3558",
                            lineHeight: 1.1,
                          }}
                        >
                          {editingTeamId ? "Edit team" : "Register team"}
                        </Typography>
                        <Typography sx={{ color: "#526274", fontWeight: 700 }}>
                          {selectedTournamentUsesPlayers
                            ? "Add captain and squad details."
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

                  <Box sx={gridSx}>
                    <TextField
                      label="Team Name"
                      value={teamForm.name}
                      onChange={(event) =>
                        updateTeamField("name", event.target.value)
                      }
                      required
                      sx={fieldSx}
                    />
                    <TextField
                      label="Team Logo URL"
                      value={teamForm.logoUrl}
                      onChange={(event) =>
                        updateTeamField("logoUrl", event.target.value)
                      }
                      sx={fieldSx}
                    />
                    <TextField
                      label="Captain Name"
                      value={teamForm.captainName}
                      onChange={(event) =>
                        updateTeamField("captainName", event.target.value)
                      }
                      required
                      sx={fieldSx}
                    />
                    <TextField
                      label="Contact Number"
                      value={teamForm.contactNumber}
                      onChange={(event) =>
                        updateTeamField("contactNumber", event.target.value)
                      }
                      required
                      sx={fieldSx}
                    />
                  </Box>

                  {selectedTournamentUsesPlayers && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Stack spacing={1.2}>
                        <Typography sx={{ fontWeight: 900, color: "#0c3558" }}>
                          Players
                        </Typography>
                        {(teamForm.players ?? []).map((player, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "grid",
                              gridTemplateColumns: {
                                xs: "1fr",
                                sm: "minmax(0, 1fr) 160px 180px",
                              },
                              gap: 1,
                            }}
                          >
                            <TextField
                              label={`Player ${index + 1}`}
                              value={player.name}
                              onChange={(event) =>
                                updatePlayerField(
                                  index,
                                  "name",
                                  event.target.value,
                                )
                              }
                              sx={fieldSx}
                            />
                            <TextField
                              label="Role"
                              value={player.role ?? ""}
                              onChange={(event) =>
                                updatePlayerField(
                                  index,
                                  "role",
                                  event.target.value,
                                )
                              }
                              sx={fieldSx}
                            />
                            <TextField
                              label="Contact Number"
                              value={player.contactNumber ?? ""}
                              onChange={(event) =>
                                updatePlayerField(
                                  index,
                                  "contactNumber",
                                  event.target.value,
                                )
                              }
                              sx={fieldSx}
                            />
                          </Box>
                        ))}
                      </Stack>
                    </>
                  )}

                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    sx={{ mt: 2 }}
                  >
                    {selectedTournamentUsesPlayers && (
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
                        }}
                        sx={softButtonSx}
                      >
                        Cancel edit
                      </Button>
                    )}
                  </Stack>
                </Paper>
              </Stack>

              <Stack spacing={2}>
                <Paper elevation={0} sx={sectionSx}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 900, color: "#0c3558", mb: 1.5 }}
                  >
                    Tournaments
                  </Typography>
                  {loading ? (
                    <Stack alignItems="center" sx={{ py: 3 }}>
                      <CircularProgress />
                    </Stack>
                  ) : tournaments.length === 0 ? (
                    <Typography sx={{ color: "#526274", fontWeight: 600 }}>
                      No tournaments yet. Create one to start registering teams.
                    </Typography>
                  ) : (
                    <Stack spacing={1}>
                      {tournaments.map((tournament) => (
                        <Button
                          key={tournament.id}
                          type="button"
                          onClick={() => setSelectedTournamentId(tournament.id)}
                          sx={{
                            justifyContent: "flex-start",
                            textAlign: "left",
                            p: 1.2,
                            borderRadius: 2,
                            border:
                              selectedTournament?.id === tournament.id
                                ? "2px solid #0b7f61"
                                : "1px solid rgba(24,90,157,0.16)",
                            background:
                              selectedTournament?.id === tournament.id
                                ? "rgba(11,127,97,0.08)"
                                : "rgba(255,255,255,0.72)",
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.2}
                            alignItems="center"
                          >
                            <Avatar
                              src={tournament.logoUrl}
                              sx={{ bgcolor: "#185a9d", fontWeight: 900 }}
                            >
                              {tournament.name.slice(0, 1).toUpperCase()}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                sx={{
                                  fontWeight: 900,
                                  color: "#0c3558",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {tournament.name}
                              </Typography>
                              <Typography
                                sx={{
                                  color: "#526274",
                                  fontSize: 13,
                                  fontWeight: 700,
                                }}
                              >
                                {(tournament.teams ?? []).length} teams
                                {" · "}
                                {statusLabel(tournament.status)}
                                {" · "}
                                {squadModeLabel(tournament.squadMode)}
                              </Typography>
                            </Box>
                          </Stack>
                        </Button>
                      ))}
                    </Stack>
                  )}
                </Paper>

                {selectedTournament && (
                  <Paper elevation={0} sx={sectionSx}>
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <Avatar
                        src={selectedTournament.logoUrl}
                        sx={{ bgcolor: "#0b7f61", fontWeight: 900 }}
                      >
                        {selectedTournament.name.slice(0, 1).toUpperCase()}
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 900, color: "#0c3558" }}
                        >
                          {selectedTournament.name}
                        </Typography>
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

          {isLoggedIn && selectedTournament && (
            <Paper elevation={0} sx={{ ...sectionSx, mt: 2 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 900, color: "#0c3558" }}
                  >
                    Start tournament match
                  </Typography>
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
              ) : playableFixtures.length === 0 ? (
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                  All fixtures for this tournament are completed.
                </Alert>
              ) : (
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={1}
                  alignItems={{ xs: "stretch", md: "center" }}
                >
                  <FormControl sx={{ ...fieldSx, flex: 1 }}>
                    <InputLabel>Fixture</InputLabel>
                    <Select
                      label="Fixture"
                      value={selectedFixture?.key ?? ""}
                      onChange={(event) =>
                        setSelectedFixtureKey(event.target.value)
                      }
                    >
                      {playableFixtures.map((fixture) => (
                        <MenuItem key={fixture.key} value={fixture.key}>
                          {fixture.team1.name} vs {fixture.team2.name}
                          {fixture.status === "in_progress"
                            ? " - In progress"
                            : ""}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    startIcon={
                      startingMatchId === selectedFixture?.key ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <PlayArrowRounded />
                      )
                    }
                    disabled={!selectedFixture || Boolean(startingMatchId)}
                    onClick={handleStartFixture}
                    sx={{ ...primaryButtonSx, minHeight: 54 }}
                  >
                    Start match
                  </Button>
                </Stack>
              )}
            </Paper>
          )}

          {isLoggedIn && selectedTournament && (
            <Paper elevation={0} sx={{ ...sectionSx, mt: 2 }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", md: "center" }}
                spacing={1}
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 900, color: "#0c3558" }}
                  >
                    Points table
                  </Typography>
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
                      <Typography
                        key={label}
                        sx={{
                          p: 1,
                          borderRadius: 1.5,
                          color: "#526274",
                          background: "rgba(24,90,157,0.08)",
                          fontSize: 12,
                          fontWeight: 900,
                        }}
                      >
                        {label}
                      </Typography>
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
            </Paper>
          )}

          {isLoggedIn && selectedTournament && (
            <Paper elevation={0} sx={{ ...sectionSx, mt: 2 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 900, color: "#0c3558" }}
                  >
                    Completed matches
                  </Typography>
                  <Typography sx={{ color: "#526274", fontWeight: 600 }}>
                    Finished tournament fixtures with synced result details.
                  </Typography>
                </Box>
                <Chip
                  label={`${completedMatches.length} completed`}
                  sx={{
                    fontWeight: 900,
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
                  {completedMatches.map((match) => (
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
                            {match.team1Name} vs {match.team2Name}
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
                          {[match.team1Name, match.team2Name].map(
                            (teamName) => (
                              <Box
                                key={`${match.id}-${teamName}`}
                                sx={{
                                  flex: 1,
                                  p: 1,
                                  borderRadius: 1.2,
                                  bgcolor: "#fff",
                                  border: "1px solid rgba(12,53,88,0.1)",
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: "#526274",
                                    fontSize: 12,
                                    fontWeight: 800,
                                  }}
                                >
                                  {teamName}
                                </Typography>
                                <Typography
                                  sx={{ color: "#0c3558", fontWeight: 950 }}
                                >
                                  {getScoreSummary(match.snapshot, teamName)}
                                </Typography>
                              </Box>
                            ),
                          )}
                        </Stack>
                      )}
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          )}

          {isLoggedIn && selectedTournament && (
            <Paper elevation={0} sx={{ ...sectionSx, mt: 2 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                spacing={1}
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 900, color: "#0c3558" }}
                  >
                    Registered teams
                  </Typography>
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

                    return (
                      <Paper
                        key={team.id}
                        elevation={0}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          border: "1px solid rgba(24,90,157,0.14)",
                          background: "rgba(255,255,255,0.72)",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.2}
                          alignItems="center"
                        >
                          <Avatar
                            src={team.logoUrl}
                            sx={{ bgcolor: "#185a9d", fontWeight: 900 }}
                          >
                            {team.name.slice(0, 1).toUpperCase()}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{ color: "#0c3558", fontWeight: 900 }}
                            >
                              {team.name}
                            </Typography>
                            <Typography
                              sx={{ color: "#526274", fontWeight: 700 }}
                            >
                              Captain: {team.captainName}
                            </Typography>
                          </Box>
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
                            ["P", teamStats.played],
                            ["W", teamStats.won],
                            ["L", teamStats.lost],
                            ["Pts", teamStats.points],
                            ["NRR", teamStats.netRunRate.toFixed(2)],
                          ].map(([label, value]) => (
                            <Box
                              key={label}
                              sx={{
                                p: 0.8,
                                borderRadius: 1.5,
                                textAlign: "center",
                                background: "rgba(11,127,97,0.08)",
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
                          ))}
                        </Box>

                        {selectedTournamentUsesPlayers ? (
                          <>
                            <Typography
                              sx={{
                                color: "#526274",
                                fontWeight: 800,
                                mb: 0.8,
                              }}
                            >
                              Players ({teamPlayers.length})
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={0.8}
                              flexWrap="wrap"
                              useFlexGap
                            >
                              {teamPlayers.map((player) => (
                                <Chip
                                  key={player.id}
                                  label={
                                    player.role
                                      ? `${player.name} - ${player.role}`
                                      : player.name
                                  }
                                  size="small"
                                  sx={{ fontWeight: 700 }}
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
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          sx={{ mt: 1.5 }}
                        >
                          <Button
                            startIcon={<EditRounded />}
                            onClick={() => handleEditTeam(team)}
                            sx={softButtonSx}
                          >
                            Edit team
                          </Button>
                          <Button
                            color="error"
                            startIcon={<DeleteRounded />}
                            onClick={() =>
                              setDeletingTarget({
                                type: "team",
                                id: team.id,
                                name: team.name,
                              })
                            }
                            sx={{
                              ...softButtonSx,
                              color: "#b42318",
                            }}
                          >
                            Delete team
                          </Button>
                        </Stack>
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
