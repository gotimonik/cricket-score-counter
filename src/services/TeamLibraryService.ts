import AuthService from "./AuthService";
import type {
  PlayerIdentity,
  SavedPlayerTeam,
  SavedPlayerTeamInput,
  SavedTeamPlayer,
} from "../types/playerTeam";

type TeamResponse = { team?: unknown; data?: unknown };
type TeamsResponse = { teams?: unknown; data?: unknown };
type PlayersResponse = { players?: unknown; data?: unknown };
type MessageResponse = { message?: string };

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const asString = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const asNumber = (value: unknown, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;

const normalizePlayer = (value: unknown): SavedTeamPlayer => {
  const player = asRecord(value);
  return {
    id: asString(player.id, createId("team-player")),
    playerId: asString(player.playerId ?? player.player_id ?? player.id),
    name: asString(player.name, "Unnamed Player"),
    username: asString(player.username),
    role: asString(player.role),
    contactNumber: asString(player.contactNumber ?? player.contact_number),
  };
};

const normalizeTeam = (value: unknown): SavedPlayerTeam => {
  const team = asRecord(value);
  const players = Array.isArray(team.players) ? team.players : [];
  const now = new Date().toISOString();

  return {
    id: asString(team.id, createId("saved-team")),
    name: asString(team.name, "Untitled Team"),
    logoUrl: asString(team.logoUrl ?? team.logo_url),
    captainName: asString(team.captainName ?? team.captain_name),
    contactNumber: asString(team.contactNumber ?? team.contact_number),
    players: players.map(normalizePlayer),
    playerCount: asNumber(team.playerCount ?? team.player_count, players.length),
    createdAt: asString(team.createdAt ?? team.created_at, now),
    updatedAt: asString(team.updatedAt ?? team.updated_at, now),
  };
};

const normalizePublicPlayer = (value: unknown): PlayerIdentity => {
  const player = asRecord(value);
  return {
    id: asString(player.id, createId("player")),
    name: asString(player.name, "Unnamed Player"),
    username: asString(player.username),
    role: asString(player.role),
    contactNumber: asString(player.contactNumber ?? player.contact_number),
    createdAt: asString(player.createdAt ?? player.created_at),
    updatedAt: asString(player.updatedAt ?? player.updated_at),
  };
};

const extractTeam = (value: unknown) => {
  const response = asRecord(value);
  return normalizeTeam(response.team ?? response.data ?? value);
};

const extractTeams = (value: unknown) => {
  const response = asRecord(value);
  const teams = response.teams ?? response.data ?? value;
  return Array.isArray(teams) ? teams.map(normalizeTeam) : [];
};

const extractPlayers = (value: unknown) => {
  const response = asRecord(value);
  const players = response.players ?? response.data ?? value;
  return Array.isArray(players) ? players.map(normalizePublicPlayer) : [];
};

const requireLoggedIn = () => {
  if (!AuthService.isLoggedIn()) {
    throw new Error("Please login to manage player teams.");
  }
};

export const TeamLibraryService = {
  getTeams: async () => {
    requireLoggedIn();
    const data = await AuthService.request<TeamsResponse>("/player-teams", {
      method: "GET",
    });
    return extractTeams(data);
  },

  createTeam: async (input: SavedPlayerTeamInput) => {
    requireLoggedIn();
    const data = await AuthService.request<TeamResponse>("/player-teams", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return extractTeam(data);
  },

  updateTeam: async (id: string, input: SavedPlayerTeamInput) => {
    requireLoggedIn();
    const data = await AuthService.request<TeamResponse>(
      `/player-teams/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        body: JSON.stringify(input),
      },
    );
    return extractTeam(data);
  },

  deleteTeam: async (id: string) => {
    requireLoggedIn();
    return AuthService.request<MessageResponse>(
      `/player-teams/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
  },

  getPublicPlayers: async (query = "") => {
    const suffix = query.trim()
      ? `?q=${encodeURIComponent(query.trim())}`
      : "";
    const data = await AuthService.request<PlayersResponse>(
      `/public-players${suffix}`,
      { method: "GET" },
    );
    return extractPlayers(data);
  },
};

export default TeamLibraryService;
