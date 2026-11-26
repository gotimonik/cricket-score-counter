import AppSpinner from "./AppSpinner";
import React, { useEffect, useRef } from "react";
import useSWRInfinite from "swr/infinite";
import {
  AddRounded,
  EmojiEventsRounded,
  GroupsRounded,
  ChevronRightRounded,
  LoginRounded,
  SaveRounded,
  SearchRounded,
  SportsCricketRounded,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";
import LogoUploadField from "./tournament/LogoUploadField";
import VisibilityPicker, { TOURNAMENT_VISIBILITY_OPTIONS } from "./privacy/VisibilityPicker";
import AuthService from "../services/AuthService";
import TournamentService, {
  type PaginationMeta,
} from "../services/TournamentService";
import { getTeamAvatarGradient } from "../utils/teamAvatar";
import type {
  TournamentBallType,
  TournamentFormat,
  TournamentInput,
  TournamentRecord,
  TournamentSquadMode,
  TournamentStatus,
} from "../types/tournament";
import { useAdMob } from "../hooks/useAdMob";

const today = new Date().toISOString().slice(0, 10);

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
  visibility: "public",
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
  matchLengthMode: form.matchLengthMode === "balls" ? "balls" : "overs",
  ballsPerMatch: Math.min(
    300,
    Math.max(5, Math.round((Number(form.ballsPerMatch) || 30) / 5) * 5),
  ),
});

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

const squadModeLabel = (mode?: TournamentSquadMode) =>
  mode === "with_players" ? "Teams with players" : "Teams only";

const TournamentManager: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showInterstitial } = useAdMob();
  // Deterministic false on first render -- see the matching comment in
  // AppBar.tsx. The effect below syncs the real value immediately after
  // mount instead of reading AuthService synchronously here.
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [tournamentSearchQuery, setTournamentSearchQuery] = React.useState("");
  // What's actually sent to the server: the typed text, settled for a moment
  // so we don't query on every keystroke.
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<TournamentStatus | "all">("all");
  React.useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(tournamentSearchQuery.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [tournamentSearchQuery]);
  const isFiltering = Boolean(debouncedSearch) || statusFilter !== "all";
  const [tournamentForm, setTournamentForm] = React.useState<TournamentInput>(
    defaultTournamentForm,
  );
  const [showTournamentForm, setShowTournamentForm] = React.useState(false);
  const [createStep, setCreateStep] = React.useState(0);
  const [savingTournament, setSavingTournament] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const interstitialShown = useRef(false);

  useEffect(() => {
    if (interstitialShown.current) return;

    interstitialShown.current = true;
    showInterstitial();
  }, [showInterstitial]);

  React.useEffect(() => {
    setIsLoggedIn(AuthService.isLoggedIn());
    return AuthService.subscribe(() => {
      setIsLoggedIn(AuthService.isLoggedIn());
    });
  }, []);

  type TournamentsPage = {
    tournaments: TournamentRecord[];
    pagination?: PaginationMeta;
  };

  // Keyed, page-cached tournament list -- SWR keeps each loaded page around
  // (keyed on ["tournaments-list", page]) so leaving this screen and coming
  // back (e.g. from a tournament's detail page) renders the previously
  // loaded pages instantly from cache while it quietly revalidates in the
  // background, instead of showing a blank spinner every time.
  const getTournamentsPageKey = React.useCallback(
    (pageIndex: number, previousPageData: TournamentsPage | null) => {
      if (!isLoggedIn) return null;
      if (previousPageData && !previousPageData.pagination?.hasMore) {
        return null;
      }
      return ["tournaments-list", pageIndex + 1, debouncedSearch, statusFilter] as const;
    },
    [isLoggedIn, debouncedSearch, statusFilter],
  );

  const {
    data: tournamentPages,
    error: tournamentsError,
    isLoading: loading,
    isValidating: isValidatingTournaments,
    size: tournamentsPageCount,
    setSize: setTournamentsPageCount,
  } = useSWRInfinite<TournamentsPage>(
    getTournamentsPageKey,
    ([, page, q, status]: readonly [string, number, string, TournamentStatus | "all"]) =>
      TournamentService.getTournaments({ page, q, status: status === "all" ? undefined : status }),
    // Keep showing the current list while a new search loads.
    { keepPreviousData: true },
  );

  const tournaments = React.useMemo(
    () => (tournamentPages ?? []).flatMap((page) => page.tournaments),
    [tournamentPages],
  );
  const hasMoreTournaments = Boolean(
    tournamentPages &&
      tournamentPages[tournamentPages.length - 1]?.pagination?.hasMore,
  );
  const loadingMoreTournaments =
    isValidatingTournaments && tournamentsPageCount > 1;

  React.useEffect(() => {
    if (tournamentsError) {
      setError(
        tournamentsError instanceof Error
          ? tournamentsError.message
          : "Unable to load tournaments right now.",
      );
    } else if (tournamentPages) {
      setError((current) => (current ? "" : current));
    }
  }, [tournamentsError, tournamentPages]);

  // Searching and filtering happen on the server, across every tournament
  // (not just the pages loaded so far).
  const filteredTournaments = tournaments;
  const tournamentsTotal = tournamentPages?.[0]?.pagination?.total ?? tournaments.length;
  // Shown once there's something to search, and kept while a search is
  // active even if it narrows the list down to a few.
  const [showSearchTools, setShowSearchTools] = React.useState(false);
  React.useEffect(() => {
    if (!isFiltering && tournamentsTotal > 3) setShowSearchTools(true);
  }, [isFiltering, tournamentsTotal]);

  const loadMoreTournaments = React.useCallback(() => {
    if (loadingMoreTournaments || !hasMoreTournaments) return;
    void setTournamentsPageCount((size) => size + 1);
  }, [hasMoreTournaments, loadingMoreTournaments, setTournamentsPageCount]);

  React.useEffect(() => {
    const deletedTournamentName = (
      location.state as { deletedTournamentName?: string } | null
    )?.deletedTournamentName;
    if (deletedTournamentName) {
      setSuccess(`"${deletedTournamentName}" was deleted.`);
      navigate(location.pathname, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  React.useEffect(() => {
    if (!loading && isLoggedIn && tournaments.length === 0) {
      setShowTournamentForm(true);
    }
  }, [isLoggedIn, loading, tournaments.length]);

  const updateTournamentField = <K extends keyof TournamentInput>(
    field: K,
    value: TournamentInput[K],
  ) => {
    setTournamentForm((current) => ({ ...current, [field]: value }));
  };

  // Validates one step of the create flow; returns an error message or "".
  const validateCreateStep = (step: number): string => {
    const f = tournamentForm;
    if (step === 0) {
      if (!f.name.trim()) return "Give your tournament a name.";
      if (!f.organizerName.trim()) return "Add the organizer's name.";
      if (!f.location.trim()) return "Add where it's being played.";
      if (f.startDate < today) return "Start date should be today or later.";
      if (f.endDate < f.startDate) return "End date should be on or after the start date.";
    }
    if (step === 1) {
      if (f.ballType === "custom" && !f.customBallType?.trim()) return "Name the custom ball type.";
      if ((f.matchLengthMode ?? "overs") === "balls") {
        if (!f.ballsPerMatch || f.ballsPerMatch < 5 || f.ballsPerMatch > 300) return "Balls per match must be between 5 and 300.";
      } else if (!f.oversPerMatch || f.oversPerMatch < 1 || f.oversPerMatch > 50) {
        return "Overs per match must be between 1 and 50.";
      }
    }
    return "";
  };

  const goToCreateStep = (target: number) => {
    for (let step = 0; step < target; step += 1) {
      const problem = validateCreateStep(step);
      if (problem) {
        setError(problem);
        setCreateStep(step);
        return;
      }
    }
    setError("");
    setCreateStep(target);
  };

  const openCreateForm = () => {
    const userName = (AuthService.getUser() as { name?: string } | null)?.name ?? "";
    setTournamentForm({ ...defaultTournamentForm, organizerName: userName, squadMode: "with_players" });
    setCreateStep(0);
    setError("");
    setShowTournamentForm(true);
  };

  const handleSaveTournament = async (event: React.FormEvent) => {
    event.preventDefault();
    if (createStep < 2) {
      goToCreateStep(createStep + 1);
      return;
    }
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
      const saved = await TournamentService.createTournament(payload);
      setTournamentForm(defaultTournamentForm);
      setShowTournamentForm(false);
      navigate(`/tournaments/${saved.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save tournament.",
      );
    } finally {
      setSavingTournament(false);
    }
  };

  const handleLogin = () => {
    navigate("/login", {
      state: { next_redirect: location.pathname },
    });
  };

  const totalPlayersAcrossTournaments = React.useMemo(() => {
    // Dedupe by player identity (the same saved player-team, and therefore
    // the same players, is often reused across multiple tournaments) so a
    // shared player is only counted once rather than once per tournament.
    const uniquePlayerIds = new Set<string>();
    tournaments.forEach((tournament) => {
      (tournament.teams ?? []).forEach((team) => {
        (team.players ?? []).forEach((player) => {
          uniquePlayerIds.add(player.playerId || player.id);
        });
      });
    });
    return uniquePlayerIds.size;
  }, [tournaments]);
  const heroPlayersCount = totalPlayersAcrossTournaments;

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
          pb: { xs: 8, sm: 8 },
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
                label={`${heroPlayersCount} players`}
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

          {/* Feedback for actions/API calls surfaces as a toast instead of an
              inline banner pinned to the top of the page. */}
          <Snackbar
            open={Boolean(error)}
            autoHideDuration={4000}
            onClose={() => setError("")}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
                        <Typography sx={{ color: "#526274", fontWeight: 650 }}>
                          Add tournament details first. Team registration
                          appears after the tournament is created.
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        startIcon={<AddRounded />}
                        onClick={openCreateForm}
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
                          Create tournament
                        </Typography>
                      </Stack>
                      <Button
                        type="button"
                        onClick={() => {
                          setTournamentForm(defaultTournamentForm);
                          setShowTournamentForm(false);
                        }}
                        sx={softButtonSx}
                      >
                        Close
                      </Button>
                    </Stack>

                    {/* Step indicator */}
                    <Stack direction="row" spacing={1} sx={{ mb: 2.25 }}>
                      {["Basics", "Match rules", "Teams"].map((label, index) => (
                        <Box
                          key={label}
                          component="button"
                          type="button"
                          onClick={() => (index < createStep ? setCreateStep(index) : goToCreateStep(index))}
                          sx={{ all: "unset", cursor: "pointer", flex: 1 }}
                        >
                          <Box sx={{ height: 5, borderRadius: 99, background: index <= createStep ? "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)" : "#e3e9ef" }} />
                          <Typography sx={{ mt: 0.6, fontSize: 12.5, fontWeight: 900, color: index <= createStep ? "#0c3558" : "#8a96a3" }}>
                            {index + 1}. {label}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>

                    {createStep === 0 && (
                      <Box sx={gridSx}>
                        <TextField
                          label="Tournament name"
                          placeholder="e.g. Monsoon Premier League"
                          value={tournamentForm.name}
                          onChange={(event) => updateTournamentField("name", event.target.value)}
                          autoFocus
                          sx={{ ...fieldSx, gridColumn: { sm: "1 / -1" } }}
                        />
                        <TextField
                          label="Organizer"
                          value={tournamentForm.organizerName}
                          onChange={(event) => updateTournamentField("organizerName", event.target.value)}
                          sx={fieldSx}
                        />
                        <TextField
                          label="Ground / city"
                          placeholder="e.g. Shivaji Park, Mumbai"
                          value={tournamentForm.location}
                          onChange={(event) => updateTournamentField("location", event.target.value)}
                          sx={fieldSx}
                        />
                        <TextField
                          label="Starts"
                          type="date"
                          value={tournamentForm.startDate}
                          onChange={(event) => {
                            const nextStartDate = event.target.value;
                            setTournamentForm((current) => ({
                              ...current,
                              startDate: nextStartDate,
                              endDate: current.endDate < nextStartDate ? nextStartDate : current.endDate,
                            }));
                          }}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ min: today }}
                          sx={fieldSx}
                        />
                        <TextField
                          label="Ends"
                          type="date"
                          value={tournamentForm.endDate}
                          onChange={(event) => updateTournamentField("endDate", event.target.value)}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ min: tournamentForm.startDate || today }}
                          sx={fieldSx}
                        />
                        <Box sx={{ gridColumn: { sm: "1 / -1" } }}>
                          <LogoUploadField
                            label="Logo (optional)"
                            name={tournamentForm.name}
                            value={{ logoUrl: tournamentForm.logoUrl, logoData: tournamentForm.logoData }}
                            onChange={(logo) =>
                              setTournamentForm((current) => ({
                                ...current,
                                logoUrl: logo.logoUrl ?? "",
                                logoData: logo.logoData,
                              }))
                            }
                          />
                        </Box>
                      </Box>
                    )}

                    {createStep === 1 && (
                      <Stack spacing={2.25}>
                        <Box>
                          <Typography sx={{ fontWeight: 900, color: "#0c3558", mb: 0.75 }}>Ball</Typography>
                          <ToggleButtonGroup
                            value={tournamentForm.ballType}
                            exclusive
                            size="small"
                            onChange={(_event, value) => value && updateTournamentField("ballType", value as TournamentBallType)}
                          >
                            <ToggleButton value="tennis" sx={{ px: 2, fontWeight: 800, textTransform: "none" }}>🎾 Tennis</ToggleButton>
                            <ToggleButton value="leather" sx={{ px: 2, fontWeight: 800, textTransform: "none" }}>🏏 Leather</ToggleButton>
                            <ToggleButton value="custom" sx={{ px: 2, fontWeight: 800, textTransform: "none" }}>Other</ToggleButton>
                          </ToggleButtonGroup>
                          {tournamentForm.ballType === "custom" && (
                            <TextField
                              label="Ball type"
                              placeholder="e.g. Rubber, Season"
                              size="small"
                              value={tournamentForm.customBallType}
                              onChange={(event) => updateTournamentField("customBallType", event.target.value)}
                              sx={{ ...fieldSx, mt: 1, display: "block", maxWidth: 280 }}
                            />
                          )}
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 900, color: "#0c3558", mb: 0.75 }}>Match length</Typography>
                          <ToggleButtonGroup
                            value={tournamentForm.matchLengthMode ?? "overs"}
                            exclusive
                            size="small"
                            onChange={(_event, value) => value && updateTournamentField("matchLengthMode", value)}
                            sx={{ mb: 1 }}
                          >
                            <ToggleButton value="overs" sx={{ px: 2, fontWeight: 800, textTransform: "none" }}>By overs</ToggleButton>
                            <ToggleButton value="balls" sx={{ px: 2, fontWeight: 800, textTransform: "none" }}>By balls</ToggleButton>
                          </ToggleButtonGroup>
                          {(tournamentForm.matchLengthMode ?? "overs") === "balls" ? (
                            <TextField
                              label="Balls per innings"
                              type="number"
                              size="small"
                              value={tournamentForm.ballsPerMatch}
                              onChange={(event) => updateTournamentField("ballsPerMatch", Number(event.target.value))}
                              helperText="Uses 5-ball overs, in steps of 5 (e.g. 30, 50, 100)"
                              inputProps={{ min: 5, max: 300, step: 5 }}
                              sx={{ ...fieldSx, display: "block", maxWidth: 280 }}
                            />
                          ) : (
                            <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                              {[5, 6, 8, 10, 12, 20].map((overs) => (
                                <Chip
                                  key={overs}
                                  label={`${overs} overs`}
                                  onClick={() => updateTournamentField("oversPerMatch", overs)}
                                  sx={{
                                    fontWeight: 800,
                                    ...(tournamentForm.oversPerMatch === overs
                                      ? { color: "#fff", background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)" }
                                      : {}),
                                  }}
                                />
                              ))}
                              <TextField
                                label="Other"
                                type="number"
                                size="small"
                                value={tournamentForm.oversPerMatch}
                                onChange={(event) => updateTournamentField("oversPerMatch", Number(event.target.value))}
                                inputProps={{ min: 1, max: 50 }}
                                sx={{ ...fieldSx, width: 96 }}
                              />
                            </Stack>
                          )}
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 900, color: "#0c3558", mb: 0.75 }}>Format</Typography>
                          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "minmax(0, 1fr) minmax(0, 1fr)" }, gap: 1 }}>
                            {([
                              { value: "league", title: "League (round robin)", body: "Every team plays every other team. Points table decides the winner." },
                              { value: "knockout", title: "Knockout", body: "Lose and you're out. Quickest way to a champion." },
                            ] as const).map((option) => {
                              const selected = tournamentForm.format === option.value;
                              return (
                                <Box
                                  key={option.value}
                                  component="button"
                                  type="button"
                                  onClick={() => updateTournamentField("format", option.value as TournamentFormat)}
                                  sx={{
                                    all: "unset",
                                    cursor: "pointer",
                                    p: 1.5,
                                    borderRadius: 2,
                                    border: "2px solid",
                                    borderColor: selected ? "#185a9d" : "rgba(12,53,88,0.14)",
                                    background: selected ? "rgba(67,206,162,0.1)" : "#fff",
                                  }}
                                >
                                  <Typography sx={{ fontWeight: 900, color: "#0c3558" }}>{option.title}</Typography>
                                  <Typography sx={{ fontSize: 13, color: "#526274", fontWeight: 600 }}>{option.body}</Typography>
                                </Box>
                              );
                            })}
                          </Box>
                        </Box>
                      </Stack>
                    )}

                    {createStep === 2 && (
                      <Stack spacing={2}>
                        <Box>
                          <Typography sx={{ fontWeight: 900, color: "#0c3558", mb: 0.75 }}>How will teams be added?</Typography>
                          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "minmax(0, 1fr) minmax(0, 1fr)" }, gap: 1 }}>
                            {([
                              { value: "with_players", title: "Teams with players", badge: "Recommended", body: "Add squads (or pick saved teams). Unlocks player stats, leaders and records, and players get notified." },
                              { value: "teams_only", title: "Teams only", badge: "Fastest", body: "Just team names and captains. Scores and points table only, no player stats." },
                            ] as const).map((option) => {
                              const selected = (tournamentForm.squadMode ?? "teams_only") === option.value;
                              return (
                                <Box
                                  key={option.value}
                                  component="button"
                                  type="button"
                                  onClick={() => updateTournamentField("squadMode", option.value as TournamentSquadMode)}
                                  sx={{
                                    all: "unset",
                                    cursor: "pointer",
                                    p: 1.5,
                                    borderRadius: 2,
                                    border: "2px solid",
                                    borderColor: selected ? "#185a9d" : "rgba(12,53,88,0.14)",
                                    background: selected ? "rgba(67,206,162,0.1)" : "#fff",
                                  }}
                                >
                                  <Stack direction="row" spacing={0.75} alignItems="center">
                                    <Typography sx={{ fontWeight: 900, color: "#0c3558" }}>{option.title}</Typography>
                                    <Chip size="small" label={option.badge} sx={{ height: 20, fontSize: 11, fontWeight: 900, bgcolor: "rgba(11,127,97,0.12)", color: "#0b7f61" }} />
                                  </Stack>
                                  <Typography sx={{ fontSize: 13, color: "#526274", fontWeight: 600, mt: 0.25 }}>{option.body}</Typography>
                                </Box>
                              );
                            })}
                          </Box>
                        </Box>
                        <Box>
                          <Typography sx={{ fontWeight: 900, color: "#0c3558", mb: 0.75 }}>Who can see it?</Typography>
                          <VisibilityPicker
                            value={tournamentForm.visibility ?? "public"}
                            options={TOURNAMENT_VISIBILITY_OPTIONS}
                            onChange={(v) => updateTournamentField("visibility", v)}
                          />
                          <Typography sx={{ fontSize: 12.5, color: "#6b7785", fontWeight: 600, mt: 0.75 }}>
                            You can change this any time from the tournament page.
                          </Typography>
                        </Box>
                        <Box sx={{ p: 1.5, borderRadius: 2, background: "#f6f9fb", border: "1px solid #e6ecf1" }}>
                          <Typography sx={{ fontWeight: 900, color: "#0c3558", mb: 0.5 }}>Summary</Typography>
                          {[
                            ["Tournament", tournamentForm.name || "—"],
                            ["Organizer", tournamentForm.organizerName || "—"],
                            ["Where", tournamentForm.location || "—"],
                            ["When", tournamentForm.startDate === tournamentForm.endDate ? tournamentForm.startDate : `${tournamentForm.startDate} → ${tournamentForm.endDate}`],
                            ["Ball", tournamentForm.ballType === "custom" ? tournamentForm.customBallType || "Other" : tournamentForm.ballType === "tennis" ? "Tennis" : "Leather"],
                            ["Length", (tournamentForm.matchLengthMode ?? "overs") === "balls" ? `${tournamentForm.ballsPerMatch} balls` : `${tournamentForm.oversPerMatch} overs`],
                            ["Format", tournamentForm.format === "knockout" ? "Knockout" : "League (round robin)"],
                          ].map(([label, value]) => (
                            <Stack key={label} direction="row" spacing={1} sx={{ fontSize: 13.5, py: 0.25 }}>
                              <Box sx={{ width: 96, color: "#6b7785", fontWeight: 700, flex: "none" }}>{label}</Box>
                              <Box sx={{ color: "#1f2933", fontWeight: 700 }}>{value}</Box>
                            </Stack>
                          ))}
                          <Typography sx={{ fontSize: 12.5, color: "#526274", mt: 0.75 }}>
                            Next you'll add teams. You can change these details later.
                          </Typography>
                        </Box>
                      </Stack>
                    )}

                    <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ mt: 2.5 }}>
                      <Button
                        type="button"
                        disabled={createStep === 0}
                        onClick={() => setCreateStep((step) => Math.max(0, step - 1))}
                        sx={softButtonSx}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={
                          savingTournament ? (
                            <AppSpinner size={18} color="inherit" />
                          ) : createStep === 2 ? (
                            <SaveRounded />
                          ) : undefined
                        }
                        disabled={savingTournament}
                        sx={{ ...primaryButtonSx, px: 3 }}
                      >
                        {createStep === 2 ? "Create tournament" : "Next"}
                      </Button>
                    </Stack>
                  </Paper>
                )}

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
                          label={tournamentsTotal}
                          sx={{
                            fontWeight: 900,
                            bgcolor: "rgba(24,90,157,0.12)",
                            color: "#185a9d",
                          }}
                        />
                      )}
                    </Stack>
                    {showSearchTools && (
                      <TextField
                        placeholder="Search by name or place"
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

                  {showSearchTools && (
                    <ToggleButtonGroup
                      exclusive
                      size="small"
                      value={statusFilter}
                      onChange={(_event, value: TournamentStatus | "all" | null) => value && setStatusFilter(value)}
                      sx={{
                        mb: 1.5,
                        flexWrap: "wrap",
                        "& .MuiToggleButton-root": { textTransform: "none", fontWeight: 800, px: 1.6, py: 0.5 },
                        "& .Mui-selected": { color: "#0c3558 !important", background: "rgba(67,206,162,0.16) !important" },
                      }}
                    >
                      <ToggleButton value="all">All</ToggleButton>
                      <ToggleButton value="active">Active</ToggleButton>
                      <ToggleButton value="draft">Draft</ToggleButton>
                      <ToggleButton value="completed">Completed</ToggleButton>
                    </ToggleButtonGroup>
                  )}

                  {loading ? (
                    <Stack alignItems="center" sx={{ py: 3 }}>
                      <AppSpinner />
                    </Stack>
                  ) : tournaments.length === 0 && isFiltering ? (
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                      {debouncedSearch
                        ? `No ${statusFilter === "all" ? "" : `${statusLabel(statusFilter).toLowerCase()} `}tournaments match “${debouncedSearch}”.`
                        : `No ${statusLabel(statusFilter as TournamentStatus).toLowerCase()} tournaments.`}
                    </Alert>
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
                  ) : (
                    <Stack spacing={1}>
                      {filteredTournaments.map((tournament) => {
                        const statusColors = statusChipColors(
                          tournament.status,
                        );

                        return (
                          <Button
                            key={tournament.id}
                            type="button"
                            onClick={() =>
                              navigate(`/tournaments/${tournament.id}`, {
                                state: location.state?.focusSavedTeamId
                                  ? {
                                      focusSavedTeamId:
                                        location.state.focusSavedTeamId,
                                    }
                                  : undefined,
                              })
                            }
                            sx={{
                              justifyContent: "flex-start",
                              textAlign: "left",
                              p: 1.2,
                              borderRadius: 2,
                              border: "1px solid rgba(24,90,157,0.16)",
                              background: "rgba(255,255,255,0.72)",
                              "&:hover": {
                                background: "rgba(24,90,157,0.06)",
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
                              <ChevronRightRounded
                                sx={{ color: "#9aa8b8", flexShrink: 0 }}
                              />
                            </Stack>
                          </Button>
                        );
                      })}
                    </Stack>
                  )}
                  {hasMoreTournaments && (
                    <Button
                      type="button"
                      onClick={loadMoreTournaments}
                      disabled={loadingMoreTournaments}
                      sx={{ mt: 1.2, alignSelf: "center", fontWeight: 800 }}
                    >
                      {loadingMoreTournaments ? "Loading..." : "Load more"}
                    </Button>
                  )}
                </Paper>
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default TournamentManager;
