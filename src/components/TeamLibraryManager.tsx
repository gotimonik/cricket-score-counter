import React from "react";
import {
  AddRounded,
  DeleteRounded,
  EditRounded,
  EmojiEventsRounded,
  GroupsRounded,
  SaveRounded,
  SearchRounded,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
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
import { useNavigate } from "react-router-dom";
import AppBar from "./AppBar";
import ConfirmDialog from "./ConfirmDialog";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";
import AuthService from "../services/AuthService";
import TeamLibraryService from "../services/TeamLibraryService";
import {
  PLAYER_ROLE_OPTIONS,
  getAvailableRoleOptions,
  getPlayerRoleIcon,
} from "../utils/playerRoles";
import { getTeamAvatarGradient } from "../utils/teamAvatar";
import type {
  SavedPlayerTeam,
  SavedPlayerTeamInput,
} from "../types/playerTeam";

type TeamFormState = SavedPlayerTeamInput;

const MIN_PLAYERS = 8;
const PLAYER_ROLES = PLAYER_ROLE_OPTIONS.filter((role) => role !== "Captain");

const createDefaultPlayers = () =>
  Array.from({ length: MIN_PLAYERS }, (_, index) => ({
    name: "",
    role: index === 0 ? "Captain" : "",
    contactNumber: "",
  }));

const defaultTeamForm: TeamFormState = {
  name: "",
  logoUrl: "",
  players: createDefaultPlayers(),
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
  px: 1.6,
  fontWeight: 850,
  textTransform: "none",
  color: "#0c3558",
  borderColor: "rgba(12,53,88,0.22)",
  background: "rgba(24,90,157,0.06)",
  "&:hover": {
    borderColor: "rgba(12,53,88,0.34)",
    background: "rgba(24,90,157,0.1)",
  },
  "& .MuiButton-startIcon, & .MuiSvgIcon-root": {
    color: "currentColor",
  },
} as const;

const dangerButtonSx = {
  ...softButtonSx,
  color: "#b42318",
  background: "rgba(180,35,24,0.06)",
  borderColor: "rgba(180,35,24,0.18)",
  "&:hover": {
    borderColor: "rgba(180,35,24,0.32)",
    background: "rgba(180,35,24,0.1)",
  },
} as const;

const normalizeTeamInput = (form: TeamFormState): SavedPlayerTeamInput => {
  let hasViceCaptain = false;

  return {
    name: form.name.trim(),
    logoUrl: form.logoUrl?.trim(),
    players: (form.players ?? [])
      .map((player, index) => {
        const roleValue = player.role?.trim();
        let role =
          index === 0 ? "Captain" : roleValue === "Captain" ? "" : roleValue;
        if (role === "Vice Captain") {
          if (hasViceCaptain) {
            role = "";
          } else {
            hasViceCaptain = true;
          }
        }

        return {
          playerId: player.playerId,
          username: player.username,
          name: player.name.trim(),
          role,
          contactNumber: player.contactNumber?.trim(),
        };
      })
      .filter((player) => player.name),
  };
};

const ensureMinimumPlayerRows = (
  players: TeamFormState["players"],
): TeamFormState["players"] => {
  const normalized = [...players];
  while (normalized.length < MIN_PLAYERS) {
    normalized.push({ name: "", role: "", contactNumber: "" });
  }
  let hasViceCaptain = false;
  return normalized.map((player, index) => {
    let role =
      index === 0 ? "Captain" : player.role === "Captain" ? "" : player.role;
    if (role === "Vice Captain") {
      if (hasViceCaptain) {
        role = "";
      } else {
        hasViceCaptain = true;
      }
    }
    return {
      ...player,
      role,
    };
  });
};

const TeamLibraryManager: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState(() =>
    AuthService.isLoggedIn(),
  );
  const [teams, setTeams] = React.useState<SavedPlayerTeam[]>([]);
  const [form, setForm] = React.useState<TeamFormState>(defaultTeamForm);
  const [editingTeamId, setEditingTeamId] = React.useState("");
  const [deleteTarget, setDeleteTarget] =
    React.useState<SavedPlayerTeam | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const createFormRef = React.useRef<HTMLFormElement | null>(null);

  const filteredTeams = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return teams;
    return teams.filter(
      (team) =>
        team.name.toLowerCase().includes(query) ||
        team.players.some((player) =>
          player.name.toLowerCase().includes(query),
        ),
    );
  }, [teams, searchQuery]);

  const scrollToCreateForm = () => {
    createFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleUseInTournament = (team: SavedPlayerTeam) => {
    navigate("/tournaments", { state: { focusSavedTeamId: team.id } });
  };

  const refreshTeams = React.useCallback(async () => {
    if (!AuthService.isLoggedIn()) {
      setTeams([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      setTeams(await TeamLibraryService.getTeams());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load player teams.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void refreshTeams();
    return AuthService.subscribe(() => {
      setIsLoggedIn(AuthService.isLoggedIn());
      void refreshTeams();
    });
  }, [refreshTeams]);

  const updateField = <K extends keyof TeamFormState>(
    field: K,
    value: TeamFormState[K],
  ) => setForm((current) => ({ ...current, [field]: value }));

  const updatePlayerField = (
    index: number,
    field: "name" | "role" | "contactNumber",
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      players: current.players.map((player, playerIndex) =>
        playerIndex === index
          ? {
              ...player,
              [field]: field === "role" && index === 0 ? "Captain" : value,
            }
          : player,
      ),
    }));
  };

  const handleAddPlayer = () => {
    setForm((current) => ({
      ...current,
      players: [...current.players, { name: "", role: "", contactNumber: "" }],
    }));
  };

  const handleDeletePlayer = (index: number) => {
    if (index === 0) return;
    setForm((current) => ({
      ...current,
      players: current.players.filter(
        (_, playerIndex) => playerIndex !== index,
      ),
    }));
  };

  const handleEditTeam = (team: SavedPlayerTeam) => {
    setEditingTeamId(team.id);
    setForm({
      name: team.name,
      logoUrl: team.logoUrl ?? "",
      players: ensureMinimumPlayerRows(
        team.players.map((player) => ({
          playerId: player.playerId,
          username: player.username,
          name: player.name,
          role: player.role ?? "",
          contactNumber: player.contactNumber ?? "",
        })),
      ),
    });
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = normalizeTeamInput(form);
    if (!payload.name) {
      setError("Please add team name.");
      return;
    }
    if (!payload.players[0]?.name) {
      setError("Please add the captain as Player 1.");
      return;
    }
    if (payload.players.length < MIN_PLAYERS) {
      setError(`Please add at least ${MIN_PLAYERS} players.`);
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      if (editingTeamId) {
        await TeamLibraryService.updateTeam(editingTeamId, payload);
      } else {
        await TeamLibraryService.createTeam(payload);
      }
      await refreshTeams();
      setEditingTeamId("");
      setForm({ ...defaultTeamForm, players: createDefaultPlayers() });
      setSuccess(
        editingTeamId
          ? "Player team updated."
          : "Player team saved with unique usernames.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save team.");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setError("");
    setSuccess("");
    try {
      await TeamLibraryService.deleteTeam(deleteTarget.id);
      await refreshTeams();
      setDeleteTarget(null);
      if (editingTeamId === deleteTarget.id) {
        setEditingTeamId("");
        setForm(defaultTeamForm);
      }
      setSuccess("Player team deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete team.");
    }
  };

  return (
    <>
      <MetaHelmet
        pageTitle="My Teams"
        description="Create reusable cricket teams with stable player identities for tournaments."
        canonical="/my-teams"
        robots="noindex,follow"
      />
      <AppBar showHomeMenuItem />
      <Box sx={{ minHeight: "100vh", bgcolor: "#eef5f7", pb: 4 }}>
        <Box sx={{ maxWidth: 1180, mx: "auto", px: { xs: 1.4, md: 3 }, pt: 2 }}>
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
            My Teams
          </PageTitleWithBack>

          {!isLoggedIn ? (
            <Paper elevation={0} sx={sectionSx}>
              <Alert severity="info" sx={{ borderRadius: 2, mb: 2 }}>
                Please login to create reusable player teams.
              </Alert>
              <Button
                variant="contained"
                onClick={() =>
                  navigate("/login", { state: { next_redirect: "/my-teams" } })
                }
                sx={primaryButtonSx}
              >
                Login
              </Button>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {(error || success) && (
                <Alert
                  severity={error ? "error" : "success"}
                  sx={{ borderRadius: 2 }}
                >
                  {error || success}
                </Alert>
              )}

<Paper elevation={0} sx={sectionSx}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  justifyContent="space-between"
                  spacing={1.2}
                  sx={{ mb: 2 }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      variant="h6"
                      sx={{ color: "#0c3558", fontWeight: 950 }}
                    >
                      Saved teams
                    </Typography>
                    {teams.length > 0 && (
                      <Chip
                        size="small"
                        label={teams.length}
                        sx={{
                          fontWeight: 900,
                          bgcolor: "rgba(11,127,97,0.12)",
                          color: "#0b7f61",
                        }}
                      />
                    )}
                  </Stack>
                  {teams.length > 0 && (
                    <TextField
                      placeholder="Search by team or player name"
                      size="small"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      sx={{ ...fieldSx, width: { xs: "100%", sm: 280 } }}
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
                  <Stack alignItems="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </Stack>
                ) : teams.length === 0 ? (
                  <Stack
                    alignItems="center"
                    spacing={1.2}
                    sx={{
                      py: 5,
                      px: 2,
                      borderRadius: 2,
                      border: "1.5px dashed rgba(12,53,88,0.2)",
                      background: "rgba(24,90,157,0.03)",
                      textAlign: "center",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: "rgba(24,90,157,0.1)",
                        color: "#185a9d",
                      }}
                    >
                      <GroupsRounded fontSize="medium" />
                    </Avatar>
                    <Typography sx={{ color: "#0c3558", fontWeight: 900 }}>
                      No saved teams yet
                    </Typography>
                    <Typography
                      sx={{ color: "#526274", fontWeight: 650, maxWidth: 360 }}
                    >
                      Save a squad once with player roles, then reuse it
                      across every tournament without re-entering names.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddRounded />}
                      onClick={scrollToCreateForm}
                      sx={{ ...primaryButtonSx, mt: 0.5 }}
                    >
                      Create your first team
                    </Button>
                  </Stack>
                ) : filteredTeams.length === 0 ? (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    No saved teams match “{searchQuery}”.
                  </Alert>
                ) : (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, minmax(0, 1fr))",
                        lg: "repeat(3, minmax(0, 1fr))",
                      },
                      gap: 1.6,
                    }}
                  >
                    {filteredTeams.map((team) => {
                      const captain = team.players.find(
                        (player) =>
                          player.role?.trim().toLowerCase() === "captain",
                      );
                      const viceCaptain = team.players.find(
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
                            border: "1.5px solid rgba(12,53,88,0.12)",
                            overflow: "hidden",
                            background: "#fff",
                            transition:
                              "box-shadow 0.18s ease, border-color 0.18s ease, transform 0.18s ease",
                            "&:hover": {
                              borderColor: "rgba(11,127,97,0.4)",
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
                                    boxShadow: "0 3px 8px rgba(8,26,56,0.18)",
                                  }}
                                >
                                  {team.name.slice(0, 1).toUpperCase()}
                                </Avatar>
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography
                                    sx={{
                                      color: "#0c3558",
                                      fontWeight: 950,
                                      lineHeight: 1.25,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                    title={team.name}
                                  >
                                    {team.name}
                                  </Typography>
                                  <Chip
                                    icon={<GroupsRounded />}
                                    label={`${team.players.length} players`}
                                    size="small"
                                    sx={{
                                      mt: 0.4,
                                      fontWeight: 800,
                                      fontSize: 11,
                                      height: 22,
                                      bgcolor: "rgba(24,90,157,0.08)",
                                      color: "#185a9d",
                                      "& .MuiChip-icon": {
                                        fontSize: 14,
                                        color: "#185a9d",
                                        ml: 0.5,
                                      },
                                    }}
                                  />
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
                                    onClick={() => setDeleteTarget(team)}
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

                            {(captain || viceCaptain) && (
                              <Stack
                                direction="row"
                                spacing={0.6}
                                flexWrap="wrap"
                                useFlexGap
                                sx={{ mt: 1.2 }}
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
                                      border: "1px solid rgba(198,146,20,0.3)",
                                      "& .MuiChip-icon": {
                                        color: "#8a6200 !important",
                                        ml: 0.6,
                                        mr: -0.2,
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
                                      border: "1px solid rgba(24,90,157,0.3)",
                                      "& .MuiChip-icon": {
                                        color: "#185a9d !important",
                                        ml: 0.6,
                                        mr: -0.2,
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
                              sx={{ mt: 1 }}
                            >
                              {team.players
                                .filter(
                                  (player) =>
                                    player !== captain &&
                                    player !== viceCaptain,
                                )
                                .map((player) => (
                                  <Chip
                                    key={player.playerId || player.id}
                                    icon={getPlayerRoleIcon(player.role)}
                                    label={player.name}
                                    size="small"
                                    title={player.role || "Player"}
                                    sx={{
                                      fontWeight: 800,
                                      bgcolor: "rgba(12,53,88,0.05)",
                                      color: "#1f2933",
                                      "& .MuiChip-icon": {
                                        ml: 0.6,
                                        mr: -0.2,
                                      },
                                    }}
                                  />
                                ))}
                            </Stack>

                            <Divider sx={{ my: 1.4 }} />

                            <Button
                              fullWidth
                              startIcon={<EmojiEventsRounded />}
                              onClick={() => handleUseInTournament(team)}
                              sx={{
                                ...softButtonSx,
                                minHeight: 38,
                                justifyContent: "center",
                                bgcolor: "rgba(11,127,97,0.08)",
                                color: "#0b7f61",
                                "&:hover": {
                                  bgcolor: "rgba(11,127,97,0.16)",
                                },
                              }}
                            >
                              Use in Tournament
                            </Button>
                          </Box>
                        </Paper>
                      );
                    })}
                  </Box>
                )}
              </Paper>

              <Paper
                ref={createFormRef}
                component="form"
                elevation={0}
                onSubmit={handleSubmit}
                sx={sectionSx}
              >
                <Stack
                  direction="row"
                  spacing={1.4}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Avatar
                    sx={{
                      width: 46,
                      height: 46,
                      background:
                        "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
                      boxShadow: "0 6px 14px rgba(24,90,157,0.3)",
                    }}
                  >
                    <GroupsRounded />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="h6"
                      sx={{ color: "#0c3558", fontWeight: 950, lineHeight: 1.2 }}
                    >
                      {editingTeamId ? "Edit team" : "Create team"}
                    </Typography>
                    <Typography sx={{ color: "#526274", fontWeight: 700 }}>
                      Save once, reuse in tournaments.
                    </Typography>
                  </Box>
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr" },
                    gap: 1.2,
                  }}
                >
                  <TextField
                    label="Team name"
                    placeholder="e.g. Rahul Eleven"
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    required
                    sx={fieldSx}
                  />
                </Box>

                <Stack
                  direction="row"
                  spacing={1.2}
                  alignItems="center"
                  sx={{ mt: 1.2 }}
                >
                  <Avatar
                    src={form.logoUrl || undefined}
                    sx={{
                      width: 44,
                      height: 44,
                      flexShrink: 0,
                      background: form.logoUrl
                        ? undefined
                        : getTeamAvatarGradient(form.name || "team"),
                      fontWeight: 900,
                    }}
                  >
                    {(form.name || "T").slice(0, 1).toUpperCase()}
                  </Avatar>
                  <TextField
                    label="Team logo URL (optional)"
                    placeholder="https://example.com/team-logo.png"
                    value={form.logoUrl ?? ""}
                    onChange={(event) =>
                      updateField("logoUrl", event.target.value)
                    }
                    helperText="Paste an image link to use a custom team icon. Leave blank for a generated avatar."
                    fullWidth
                    sx={fieldSx}
                  />
                </Stack>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mt: 2.2, mb: 1 }}
                >
                  <Typography
                    sx={{ color: "#0c3558", fontWeight: 900, fontSize: 14 }}
                  >
                    Players ({MIN_PLAYERS} minimum)
                  </Typography>
                  <Chip
                    size="small"
                    label={`${form.players.filter((player) => player.name.trim()).length} / ${Math.max(form.players.length, MIN_PLAYERS)} added`}
                    sx={{
                      fontWeight: 850,
                      bgcolor:
                        form.players.filter((player) => player.name.trim())
                          .length >= MIN_PLAYERS
                          ? "rgba(11,127,97,0.12)"
                          : "rgba(198,146,20,0.14)",
                      color:
                        form.players.filter((player) => player.name.trim())
                          .length >= MIN_PLAYERS
                          ? "#0b7f61"
                          : "#8a6200",
                    }}
                  />
                </Stack>
                <Stack spacing={1}>
                  {form.players.map((player, index) => {
                    const roleOptions = getAvailableRoleOptions(
                      form.players,
                      index,
                      PLAYER_ROLES,
                    );
                    const isCaptainRow = index === 0;

                    return (
                      <Box
                        key={index}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "32px minmax(0, 1fr) 128px 40px",
                            sm: "32px minmax(0, 1fr) 160px 44px",
                          },
                          gap: 1,
                          alignItems: "center",
                          p: 1,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: isCaptainRow
                            ? "rgba(198,146,20,0.3)"
                            : "rgba(12,53,88,0.1)",
                          background: isCaptainRow
                            ? "rgba(198,146,20,0.06)"
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
                              : "rgba(24,90,157,0.16)",
                            color: isCaptainRow ? "#fff" : "#185a9d",
                          }}
                        >
                          {index + 1}
                        </Avatar>
                        <TextField
                          label={
                            isCaptainRow
                              ? "Player 1 name (Captain)"
                              : `Player ${index + 1} name`
                          }
                          value={player.name}
                          onChange={(event) =>
                            updatePlayerField(index, "name", event.target.value)
                          }
                          required={isCaptainRow}
                          size="small"
                          sx={fieldSx}
                        />
                        <FormControl size="small" sx={fieldSx}>
                          <InputLabel>Role</InputLabel>
                          <Select
                            label="Role"
                            value={
                              isCaptainRow ? "Captain" : (player.role ?? "")
                            }
                            onChange={(event) =>
                              updatePlayerField(
                                index,
                                "role",
                                event.target.value,
                              )
                            }
                            disabled={isCaptainRow}
                          >
                            <MenuItem value="">Select role</MenuItem>
                            {isCaptainRow ? (
                              <MenuItem value="Captain">
                                <ListItemIcon sx={{ minWidth: 30 }}>
                                  {getPlayerRoleIcon("Captain")}
                                </ListItemIcon>
                                Captain
                              </MenuItem>
                            ) : (
                              roleOptions.map((role) => (
                                <MenuItem key={role} value={role}>
                                  <ListItemIcon sx={{ minWidth: 30 }}>
                                    {getPlayerRoleIcon(role)}
                                  </ListItemIcon>
                                  {role}
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        </FormControl>
                        {isCaptainRow ? (
                          <Tooltip title="The captain is always Player 1">
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                display: "grid",
                                placeItems: "center",
                              }}
                            >
                              {getPlayerRoleIcon("Captain")}
                            </Box>
                          </Tooltip>
                        ) : (
                          <Tooltip title={`Delete player ${index + 1}`}>
                            <IconButton
                              aria-label={`Delete player ${index + 1}`}
                              onClick={() => handleDeletePlayer(index)}
                              sx={{
                                ...dangerButtonSx,
                                width: 40,
                                height: 40,
                                minHeight: 40,
                                p: 0,
                              }}
                            >
                              <DeleteRounded fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    );
                  })}
                </Stack>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  alignItems={{ xs: "stretch", sm: "center" }}
                  justifyContent="space-between"
                  spacing={1}
                  sx={{ mt: 2 }}
                >
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <Button
                      type="button"
                      variant="outlined"
                      startIcon={<AddRounded />}
                      onClick={handleAddPlayer}
                      sx={softButtonSx}
                    >
                      Add player
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={
                        saving ? (
                          <CircularProgress color="inherit" size={18} />
                        ) : (
                          <SaveRounded />
                        )
                      }
                      disabled={saving}
                      sx={primaryButtonSx}
                    >
                      {editingTeamId ? "Update" : "Save team"}
                    </Button>
                    {editingTeamId && (
                      <Button
                        type="button"
                        onClick={() => {
                          setEditingTeamId("");
                          setForm({
                            ...defaultTeamForm,
                            players: createDefaultPlayers(),
                          });
                        }}
                        sx={softButtonSx}
                      >
                        Cancel edit
                      </Button>
                    )}
                  </Stack>
                  <Typography
                    sx={{
                      color: "#8a94a6",
                      fontWeight: 650,
                      fontSize: 12.5,
                    }}
                  >
                    * Team name and captain name are required
                  </Typography>
                </Stack>
              </Paper>
            </Stack>
          )}
        </Box>
      </Box>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete player team?"
        content={`This removes ${deleteTarget?.name ?? "this team"} from your saved teams. Existing tournaments will keep their copied players.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  );
};

export default TeamLibraryManager;
