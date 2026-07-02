import React from "react";
import {
  AddRounded,
  DeleteRounded,
  EditRounded,
  EmojiEventsRounded,
  MilitaryTechRounded,
  PersonAddRounded,
  PersonRounded,
  SaveRounded,
  ShieldRounded,
  SportsBaseballRounded,
  SportsCricketRounded,
  StarRounded,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppBar from "./AppBar";
import ConfirmDialog from "./ConfirmDialog";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";
import AuthService from "../services/AuthService";
import TeamLibraryService from "../services/TeamLibraryService";
import type {
  SavedPlayerTeam,
  SavedPlayerTeamInput,
} from "../types/playerTeam";

type TeamFormState = SavedPlayerTeamInput;

const MIN_PLAYERS = 8;
const PLAYER_ROLES = [
  "Vice Captain",
  "Batsman",
  "Bowler",
  "Wicket Keeper",
  "All Rounder",
  "WC",
];

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

const playerRoleIconSx = {
  fontSize: "16px !important",
  color: "#185a9d !important",
} as const;

const getPlayerRoleIcon = (role?: string) => {
  const normalizedRole = role?.trim().toLowerCase();
  if (normalizedRole === "captain") {
    return <EmojiEventsRounded sx={playerRoleIconSx} />;
  }
  if (normalizedRole === "vice captain") {
    return <MilitaryTechRounded sx={playerRoleIconSx} />;
  }
  if (normalizedRole === "batsman") {
    return <SportsCricketRounded sx={playerRoleIconSx} />;
  }
  if (normalizedRole === "bowler") {
    return <SportsBaseballRounded sx={playerRoleIconSx} />;
  }
  if (normalizedRole === "wicket keeper" || normalizedRole === "wc") {
    return <ShieldRounded sx={playerRoleIconSx} />;
  }
  if (normalizedRole === "all rounder") {
    return <StarRounded sx={playerRoleIconSx} />;
  }
  return <PersonRounded sx={playerRoleIconSx} />;
};

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
                <Typography
                  variant="h6"
                  sx={{ color: "#0c3558", fontWeight: 950, mb: 0.5 }}
                >
                  Saved teams
                </Typography>

                {loading ? (
                  <Stack alignItems="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </Stack>
                ) : teams.length === 0 ? (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    No player teams saved yet.
                  </Alert>
                ) : (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        md: "repeat(2, minmax(0, 1fr))",
                      },
                      gap: 1,
                    }}
                  >
                    {teams.map((team) => (
                      <Paper
                        key={team.id}
                        elevation={0}
                        sx={{
                          p: 1.2,
                          borderRadius: 2,
                          border: "1px solid rgba(12,53,88,0.14)",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.2}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ minWidth: 0 }}
                          >
                            <Avatar
                              src={team.logoUrl}
                              sx={{ bgcolor: "#0b7f61", fontWeight: 900 }}
                            >
                              {team.name.slice(0, 1).toUpperCase()}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                sx={{ color: "#0c3558", fontWeight: 950 }}
                              >
                                {team.name}
                              </Typography>
                              <Typography
                                sx={{ color: "#526274", fontWeight: 750 }}
                              >
                                {team.players.length} players
                              </Typography>
                            </Box>
                          </Stack>
                          <Button
                            startIcon={<EditRounded />}
                            onClick={() => handleEditTeam(team)}
                            sx={{ ...softButtonSx, minHeight: 34, px: 1.2 }}
                          >
                            Edit
                          </Button>
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={0.6}
                          flexWrap="wrap"
                          useFlexGap
                          sx={{ mt: 1 }}
                        >
                          {team.players.map((player) => (
                            <Chip
                              key={player.playerId || player.id}
                              icon={getPlayerRoleIcon(player.role)}
                              label={player.name}
                              size="small"
                              title={player.role || "Player"}
                              sx={{
                                fontWeight: 800,
                                bgcolor: "rgba(24,90,157,0.08)",
                                color: "#1f2933",
                                "& .MuiChip-icon": {
                                  ml: 0.6,
                                  mr: -0.2,
                                },
                              }}
                            />
                          ))}
                        </Stack>

                        <Button
                          color="error"
                          startIcon={<DeleteRounded />}
                          onClick={() => setDeleteTarget(team)}
                          sx={{
                            ...dangerButtonSx,
                            minHeight: 34,
                            mt: 1,
                            px: 1.2,
                          }}
                        >
                          Delete
                        </Button>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Paper>

              <Paper
                component="form"
                elevation={0}
                onSubmit={handleSubmit}
                sx={sectionSx}
              >
                <Stack
                  direction="row"
                  spacing={1.2}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Avatar sx={{ bgcolor: "#185a9d" }}>
                    <PersonAddRounded />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="h6"
                      sx={{ color: "#0c3558", fontWeight: 950 }}
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
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    required
                    sx={fieldSx}
                  />
                </Box>

                <Stack spacing={1} sx={{ mt: 1.5 }}>
                  <Typography
                    sx={{ color: "#0c3558", fontWeight: 900, fontSize: 14 }}
                  >
                    Players ({MIN_PLAYERS} minimum)
                  </Typography>
                  {form.players.map((player, index) => {
                    const roleOptions = PLAYER_ROLES.filter(
                      (role) =>
                        role !== "Vice Captain" ||
                        player.role === "Vice Captain" ||
                        !form.players.some(
                          (candidate, playerIndex) =>
                            playerIndex !== index &&
                            candidate.role === "Vice Captain",
                        ),
                    );

                    return (
                      <Box
                        key={index}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "minmax(0, 1fr) 128px 40px",
                            sm: "minmax(0, 1fr) 160px 44px",
                          },
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          label={
                            index === 0
                              ? "Player 1 name (Captain)"
                              : `Player ${index + 1} name`
                          }
                          value={player.name}
                          onChange={(event) =>
                            updatePlayerField(index, "name", event.target.value)
                          }
                          required={index === 0}
                          sx={fieldSx}
                        />
                        <FormControl sx={fieldSx}>
                          <InputLabel>Role</InputLabel>
                          <Select
                            label="Role"
                            value={
                              index === 0 ? "Captain" : (player.role ?? "")
                            }
                            onChange={(event) =>
                              updatePlayerField(
                                index,
                                "role",
                                event.target.value,
                              )
                            }
                            disabled={index === 0}
                          >
                            <MenuItem value="">Select role</MenuItem>
                            {index === 0 ? (
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
                        {index === 0 ? (
                          <Box sx={{ width: 40, height: 40 }} />
                        ) : (
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
                        )}
                      </Box>
                    );
                  })}
                </Stack>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  sx={{ mt: 2 }}
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
