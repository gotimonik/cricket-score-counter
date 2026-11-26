import AppSpinner from "./AppSpinner";
import React, { useEffect, useRef } from "react";
import {
  AddRounded,
  CloseSharp,
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Paper,
  Select,
  Snackbar,
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
import PlayerPicker, { type PickedPlayer } from "./player/PlayerPicker";
import QuickAddPlayers from "./player/QuickAddPlayers";
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
import { useAdMob } from "../hooks/useAdMob";
import TeamLogoPicker from "./team/TeamLogoPicker";

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
  const { showInterstitial } = useAdMob();
  // Deterministic false on first render -- see the matching comment in
  // AppBar.tsx. The effect below syncs the real value immediately after
  // mount instead of reading AuthService synchronously here.
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [teams, setTeams] = React.useState<SavedPlayerTeam[]>([]);
  const [form, setForm] = React.useState<TeamFormState>(defaultTeamForm);
  const [editingTeamId, setEditingTeamId] = React.useState("");
  const [deleteTarget, setDeleteTarget] =
    React.useState<SavedPlayerTeam | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [formError, setFormError] = React.useState("");
  const [notice, setNotice] = React.useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({ open: false, severity: "success", message: "" });
  const [showTeamFormModal, setShowTeamFormModal] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"recent" | "name" | "players">("recent");
  const interstitialShown = useRef(false);

  useEffect(() => {
    if (interstitialShown.current) return;

    interstitialShown.current = true;
    showInterstitial();
  }, [showInterstitial]);

  const filteredTeams = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const matching = !query
      ? teams
      : teams.filter(
          (team) =>
            team.name.toLowerCase().includes(query) ||
            team.players.some((player) =>
              player.name.toLowerCase().includes(query),
            ),
        );
    const sorted = [...matching];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "players") {
      sorted.sort((a, b) => b.players.length - a.players.length || a.name.localeCompare(b.name));
    } else {
      sorted.sort(
        (a, b) =>
          new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime(),
      );
    }
    return sorted;
  }, [teams, searchQuery, sortBy]);

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
    try {
      setTeams(await TeamLibraryService.getTeams());
    } catch (err) {
      setNotice({
        open: true,
        severity: "error",
        message:
          err instanceof Error ? err.message : "Unable to load player teams.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    setIsLoggedIn(AuthService.isLoggedIn());
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

  const updatePlayerIdentity = (index: number, picked: PickedPlayer) => {
    setForm((current) => ({
      ...current,
      players: current.players.map((player, playerIndex) =>
        playerIndex === index
          ? { ...player, name: picked.name, playerId: picked.playerId, username: picked.username }
          : player,
      ),
    }));
  };

  // Quick add: fill empty rows first, then append; skip names already in the squad.
  const handleQuickAdd = (incoming: PickedPlayer[]) => {
    setForm((current) => {
      const players = [...current.players];
      const taken = new Set(players.map((p) => p.name.trim().toLowerCase()).filter(Boolean));
      incoming.forEach((picked) => {
        const key = picked.name.trim().toLowerCase();
        if (!key || taken.has(key)) return;
        taken.add(key);
        const entry = { name: picked.name, playerId: picked.playerId, username: picked.username };
        const emptyIndex = players.findIndex((p) => !p.name.trim());
        if (emptyIndex >= 0) {
          players[emptyIndex] = { ...players[emptyIndex], ...entry };
        } else {
          players.push({ ...entry, role: "", contactNumber: "" });
        }
      });
      return { ...current, players };
    });
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

  const handleOpenCreateModal = () => {
    setEditingTeamId("");
    setForm({ ...defaultTeamForm, players: createDefaultPlayers() });
    setFormError("");
    setShowTeamFormModal(true);
  };

  const handleCloseTeamFormModal = () => {
    setShowTeamFormModal(false);
    setEditingTeamId("");
    setForm({ ...defaultTeamForm, players: createDefaultPlayers() });
    setFormError("");
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
    setFormError("");
    setShowTeamFormModal(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = normalizeTeamInput(form);
    if (!payload.name) {
      setFormError("Please add team name.");
      return;
    }
    if (!payload.players[0]?.name) {
      setFormError("Please add the captain as Player 1.");
      return;
    }
    if (payload.players.length < MIN_PLAYERS) {
      setFormError(`Please add at least ${MIN_PLAYERS} players.`);
      return;
    }

    const wasEditing = Boolean(editingTeamId);
    setSaving(true);
    setFormError("");
    try {
      if (editingTeamId) {
        await TeamLibraryService.updateTeam(editingTeamId, payload);
      } else {
        await TeamLibraryService.createTeam(payload);
      }
      await refreshTeams();
      setEditingTeamId("");
      setForm({ ...defaultTeamForm, players: createDefaultPlayers() });
      setShowTeamFormModal(false);
      setNotice({
        open: true,
        severity: "success",
        message: wasEditing
          ? "Player team updated."
          : "Player team saved with unique usernames.",
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Unable to save team.");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await TeamLibraryService.deleteTeam(deleteTarget.id);
      await refreshTeams();
      setDeleteTarget(null);
      if (editingTeamId === deleteTarget.id) {
        setEditingTeamId("");
        setForm(defaultTeamForm);
        setShowTeamFormModal(false);
      }
      setNotice({
        open: true,
        severity: "success",
        message: "Player team deleted.",
      });
    } catch (err) {
      setNotice({
        open: true,
        severity: "error",
        message: err instanceof Error ? err.message : "Unable to delete team.",
      });
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
          <Typography
            sx={{
              color: "#526274",
              fontWeight: 650,
              mt: -0.6,
              mb: 2,
              fontSize: "calc(14px * var(--app-font-scale, 1))",
            }}
          >
            Build a squad once with fixed player roles, then reuse it in any
            tournament without retyping names.
          </Typography>

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
              <Paper elevation={0} sx={sectionSx}>
                <Stack spacing={1.4} sx={{ mb: 2 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1}
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
                    <Tooltip title="Add team">
                      <Button
                        variant="contained"
                        startIcon={<AddRounded />}
                        onClick={handleOpenCreateModal}
                        sx={{
                          ...primaryButtonSx,
                          minHeight: 40,
                          px: { xs: 1.4, sm: 2.2 },
                          "& .MuiButton-startIcon": {
                            mr: { xs: 0, sm: 1 },
                          },
                        }}
                      >
                        <Box
                          component="span"
                          sx={{ display: { xs: "none", sm: "inline" } }}
                        >
                          Add team
                        </Box>
                      </Button>
                    </Tooltip>
                  </Stack>
                  {teams.length > 0 && (
                    <Stack direction="row" spacing={1}>
                    <TextField
                      fullWidth
                      placeholder="Search by team or player name"
                      size="small"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      sx={fieldSx}
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
                    <FormControl size="small" sx={{ ...fieldSx, minWidth: { xs: 128, sm: 180 } }}>
                      <Select
                        value={sortBy}
                        onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
                        inputProps={{ "aria-label": "Sort teams" }}
                      >
                        <MenuItem value="recent">Recently updated</MenuItem>
                        <MenuItem value="name">Name A–Z</MenuItem>
                        <MenuItem value="players">Most players</MenuItem>
                      </Select>
                    </FormControl>
                    </Stack>
                  )}
                </Stack>

                {loading ? (
                  <Stack alignItems="center" sx={{ py: 4 }}>
                    <AppSpinner />
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
                      Save a squad once with player roles, then reuse it across
                      every tournament without re-entering names.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddRounded />}
                      onClick={handleOpenCreateModal}
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
                          player.role?.trim().toLowerCase() === "vice captain",
                      );

                      return (
                        <Paper
                          key={team.id}
                          elevation={0}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
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
                              flexShrink: 0,
                              background:
                                "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
                            }}
                          />
                          <Box
                            sx={{
                              p: 1.6,
                              flexGrow: 1,
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
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

                            <Typography
                              sx={{
                                mt: 1.2,
                                fontSize: 13,
                                color: "#334155",
                                fontWeight: 650,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Box component="span" sx={{ color: "#8a6200", fontWeight: 900 }}>C</Box>{" "}
                              {captain?.name ?? team.captainName ?? "—"}
                              {viceCaptain ? (
                                <>
                                  {"  ·  "}
                                  <Box component="span" sx={{ color: "#185a9d", fontWeight: 900 }}>VC</Box>{" "}
                                  {viceCaptain.name}
                                </>
                              ) : null}
                            </Typography>
                            <Stack direction="row" alignItems="center" sx={{ mt: 1.1, mb: 1.4 }}>
                              {team.players.slice(0, 7).map((player, index) => (
                                <Tooltip key={player.playerId || player.id || index} title={player.playerId ? `${player.name} – view stats` : player.name}>
                                  <Avatar
                                    onClick={player.playerId ? () => navigate(`/players/${player.playerId}`) : undefined}
                                    sx={{
                                      width: 32,
                                      height: 32,
                                      fontSize: 12,
                                      fontWeight: 900,
                                      ml: index === 0 ? 0 : -0.6,
                                      border: "2px solid #fff",
                                      color: "#fff",
                                      textShadow: "0 1px 1px rgba(0,0,0,0.25)",
                                      cursor: player.playerId ? "pointer" : "default",
                                      background: getTeamAvatarGradient(player.name),
                                      zIndex: 10 - index,
                                    }}
                                  >
                                    {player.name
                                      .split(/\s+/)
                                      .slice(0, 2)
                                      .map((part) => part[0]?.toUpperCase())
                                      .join("")}
                                  </Avatar>
                                </Tooltip>
                              ))}
                              {team.players.length > 7 && (
                                <Avatar
                                  onClick={() => handleEditTeam(team)}
                                  sx={{ width: 32, height: 32, fontSize: 11.5, fontWeight: 900, ml: -0.6, border: "2px solid #fff", bgcolor: "#e8eef5", color: "#185a9d", cursor: "pointer" }}
                                >
                                  +{team.players.length - 7}
                                </Avatar>
                              )}
                              <Typography
                                onClick={() => handleEditTeam(team)}
                                sx={{ ml: 1.2, fontSize: 12.5, fontWeight: 800, color: "#185a9d", cursor: "pointer", whiteSpace: "nowrap", "&:hover": { textDecoration: "underline" } }}
                              >
                                View squad
                              </Typography>
                            </Stack>

                            <Divider sx={{ mt: "auto", mb: 1.4 }} />

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

              {showTeamFormModal && (
                <Dialog
                  open={showTeamFormModal}
                  onClose={handleCloseTeamFormModal}
                  fullWidth
                  maxWidth="md"
                  PaperProps={{ sx: { borderRadius: 3 } }}
                >
                  <Box component="form" onSubmit={handleSubmit}>
                    <DialogTitle sx={{ position: "relative", pr: 6 }}>
                      <Stack direction="row" spacing={1.4} alignItems="center">
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
                            sx={{ fontWeight: 950, lineHeight: 1.2 }}
                          >
                            {editingTeamId ? "Edit team" : "Create team"}
                          </Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: 13.5 }}>
                            Save once, reuse in tournaments.
                          </Typography>
                        </Box>
                      </Stack>
                      <IconButton
                        aria-label="Close"
                        onClick={handleCloseTeamFormModal}
                        sx={{
                          position: "absolute",
                          right: 10,
                          top: 10,
                          color: "var(--app-accent-text, #185a9d)",
                        }}
                      >
                        <CloseSharp fontSize="small" />
                      </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                      {formError && (
                        <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>
                          {formError}
                        </Alert>
                      )}

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr)" },
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
                          autoFocus
                          sx={fieldSx}
                        />
                      </Box>

                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1.5 }}>
                        <TeamLogoPicker
                          name={form.name}
                          value={form.logoUrl}
                          onChange={(url) => updateField("logoUrl", url)}
                          size={72}
                        />
                        <Typography sx={{ fontSize: 13, color: "#526274" }}>
                          Tap the tile to choose a photo from your device (PNG, JPG or WebP). It's resized automatically. Leave it empty for a generated badge.
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ mt: 2.2, mb: 1 }}
                      >
                        <Typography sx={{ fontWeight: 900, fontSize: 14 }}>
                          Players ({MIN_PLAYERS} minimum)
                        </Typography>
                        <Chip
                          size="small"
                          label={`${form.players.filter((player) => player.name.trim()).length} / ${Math.max(form.players.length, MIN_PLAYERS)} added`}
                          sx={{
                            fontWeight: 850,
                            bgcolor:
                              form.players.filter((player) =>
                                player.name.trim(),
                              ).length >= MIN_PLAYERS
                                ? "rgba(11,127,97,0.12)"
                                : "rgba(198,146,20,0.14)",
                            color:
                              form.players.filter((player) =>
                                player.name.trim(),
                              ).length >= MIN_PLAYERS
                                ? "#0b7f61"
                                : "#8a6200",
                          }}
                        />
                      </Stack>
                      <QuickAddPlayers
                        existing={form.players.map((p) => ({ name: p.name, playerId: p.playerId }))}
                        onAdd={handleQuickAdd}
                      />
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
                                  xs: "34px 1fr 40px",
                                  sm: "32px minmax(0, 1fr) 160px 44px",
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
                                  : "rgba(12,53,88,0.1)",
                                background: isCaptainRow
                                  ? "rgba(198,146,20,0.06)"
                                  : "rgba(12,53,88,0.015)",
                              }}
                            >
                              <Avatar
                                sx={{
                                  gridArea: "avatar",
                                  alignSelf: { xs: "start", sm: "center" },
                                  mt: { xs: 0.5, sm: 0 },
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
                              <PlayerPicker
                                label={
                                  isCaptainRow
                                    ? "Player 1 name (Captain)"
                                    : `Player ${index + 1} name`
                                }
                                value={{ name: player.name, playerId: player.playerId, username: player.username }}
                                onChange={(picked) => updatePlayerIdentity(index, picked)}
                                excludeIds={form.players
                                  .map((other) => other.playerId ?? "")
                                  .filter(Boolean)}
                                required={isCaptainRow}
                                sx={{ ...fieldSx, gridArea: "name" }}
                              />
                              <FormControl
                                size="small"
                                sx={{ ...fieldSx, gridArea: "role" }}
                              >
                                <InputLabel>Role</InputLabel>
                                <Select
                                  label="Role"
                                  value={
                                    isCaptainRow
                                      ? "Captain"
                                      : (player.role ?? "")
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
                                      gridArea: "action",
                                      alignSelf: { xs: "start", sm: "center" },
                                      mt: { xs: 0.5, sm: 0 },
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
                                      gridArea: "action",
                                      alignSelf: { xs: "start", sm: "center" },
                                      mt: { xs: 0.5, sm: 0 },
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
                    </DialogContent>
                    <DialogActions sx={{ px: 3, py: 2, display: "block" }}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "stretch", sm: "center" }}
                        justifyContent="space-between"
                        spacing={1.2}
                      >
                        <Button
                          type="button"
                          variant="outlined"
                          startIcon={<AddRounded />}
                          onClick={handleAddPlayer}
                          sx={softButtonSx}
                        >
                          Add player
                        </Button>
                        <Typography
                          sx={{
                            fontWeight: 650,
                            fontSize: 12.5,
                            flex: 1,
                            textAlign: { xs: "left", sm: "center" },
                          }}
                        >
                          * Team name and captain name are required
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ width: { xs: "100%", sm: "auto" } }}
                        >
                          <Button
                            type="button"
                            onClick={handleCloseTeamFormModal}
                            sx={{
                              ...softButtonSx,
                              flex: { xs: 1, sm: "initial" },
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            startIcon={
                              saving ? (
                                <AppSpinner color="inherit" size={18} />
                              ) : (
                                <SaveRounded />
                              )
                            }
                            disabled={saving}
                            sx={{
                              ...primaryButtonSx,
                              flex: { xs: 1, sm: "initial" },
                            }}
                          >
                            {editingTeamId ? "Update" : "Save team"}
                          </Button>
                        </Stack>
                      </Stack>
                    </DialogActions>
                  </Box>
                </Dialog>
              )}
            </Stack>
          )}
        </Box>
      </Box>
      <Snackbar
        open={notice.open}
        autoHideDuration={notice.severity === "error" ? 4000 : 3000}
        onClose={() => setNotice((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={notice.severity}
          variant="filled"
          onClose={() => setNotice((prev) => ({ ...prev, open: false }))}
          sx={{ fontWeight: 800, borderRadius: 2 }}
        >
          {notice.message}
        </Alert>
      </Snackbar>
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
