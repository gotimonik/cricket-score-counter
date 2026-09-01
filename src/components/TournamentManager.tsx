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
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
  const [isLoggedIn, setIsLoggedIn] = React.useState(() =>
    AuthService.isLoggedIn(),
  );
  const [tournamentSearchQuery, setTournamentSearchQuery] = React.useState("");
  const [tournamentForm, setTournamentForm] = React.useState<TournamentInput>(
    defaultTournamentForm,
  );
  const [showTournamentForm, setShowTournamentForm] = React.useState(false);
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
      return ["tournaments-list", pageIndex + 1] as const;
    },
    [isLoggedIn],
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
    ([, page]: readonly [string, number]) =>
      TournamentService.getTournaments({ page }),
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

  const filteredTournaments = React.useMemo(() => {
    const query = tournamentSearchQuery.trim().toLowerCase();
    if (!query) return tournaments;
    return tournaments.filter((tournament) =>
      tournament.name.toLowerCase().includes(query),
    );
  }, [tournaments, tournamentSearchQuery]);

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
                        onClick={() => {
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
                        Save tournament
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
                  {hasMoreTournaments && !tournamentSearchQuery && (
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
