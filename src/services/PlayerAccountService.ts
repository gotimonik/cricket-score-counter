import AuthService, { API_ROOT_URL } from "./AuthService";
import type { BattingLine, BowlingLine, CareerStats, MatchResult } from "../utils/matchStats";

export interface PublicPlayer {
  id: string;
  name: string;
  username: string;
  role: string;
  city: string;
  battingStyle: string;
  bowlingStyle: string;
  registered: boolean;
  avatarUrl: string;
}

export interface MyPlayer extends PublicPlayer {
  visibility: "public" | "unlisted" | "hidden";
  claimedAt: string | null;
  /** Hidden by a platform admin; can't be made public until lifted. */
  suspended?: boolean;
}

export interface ClaimSearchResult extends PublicPlayer {
  addedBy: string;
  teams: string[];
}

export interface PlayerProfileInput {
  name?: string;
  username?: string;
  role?: string;
  city?: string;
  battingStyle?: string;
  bowlingStyle?: string;
  visibility?: "public" | "unlisted" | "hidden";
  /** data: URL, or null to remove the photo */
  avatarData?: string | null;
}

export interface ClaimRequest {
  id: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  message: string;
  createdAt: string;
  decidedAt: string | null;
  record: PublicPlayer | null;
  requester: PublicPlayer | null;
  requesterName: string;
  approverName: string;
}

export interface AppNotification {
  id: string;
  type: "squad_added" | "team_added" | "claim_requested" | "claim_approved" | "claim_rejected" | "player_left_squad";
  title: string;
  body: string;
  link: string;
  data: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

export interface MyTournament {
  tournamentId: string;
  name: string;
  logoUrl: string;
  status: string;
  format: string;
  visibility?: "public" | "unlisted" | "private";
  organizerName: string;
  startDate: string;
  endDate: string;
  teamId: string;
  teamName: string;
  matches: Array<{
    id: string;
    opponent: string;
    status: "scheduled" | "in_progress" | "completed";
    resultText: string;
    outcome: "won" | "lost" | "tied" | null;
    date: string;
  }>;
  yetToPlay: string[];
}

export interface PublicProfileResponse {
  player: PublicPlayer;
  overall: CareerStats;
  tournaments: Array<{ tournamentId?: string; name: string; teamName: string; matches: number; runs: number; wickets: number }>;
  recentMatches: Array<{
    date: string;
    team: string;
    opponent: string;
    result: MatchResult;
    tournamentName: string;
    batting?: BattingLine;
    bowling?: BowlingLine;
  }>;
}

const json = (body: unknown) => ({
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

/** Absolute URL for a player's photo path returned by the API. */
export const playerAvatarSrc = (avatarUrl?: string) =>
  avatarUrl ? (/^https?:/.test(avatarUrl) ? avatarUrl : `${API_ROOT_URL}${avatarUrl}`) : "";

export const PlayerAccountService = {
  getMyPlayer: () => AuthService.request<{ player: MyPlayer | null }>("/me/player", { method: "GET" }),
  register: (input: PlayerProfileInput) =>
    AuthService.request<{ player: MyPlayer }>("/me/player", { method: "POST", ...json(input) }),
  update: (input: PlayerProfileInput) =>
    AuthService.request<{ player: MyPlayer }>("/me/player", { method: "PATCH", ...json(input) }),

  search: (q: string) =>
    AuthService.request<{ players: PublicPlayer[] }>(`/players/search?q=${encodeURIComponent(q)}`, { method: "GET" }),
  searchUnclaimed: (q: string) =>
    AuthService.request<{ players: ClaimSearchResult[] }>(`/players/search?unclaimed=1&q=${encodeURIComponent(q)}`, { method: "GET" }),
  recent: () => AuthService.request<{ players: PublicPlayer[] }>("/players/recent", { method: "GET" }),

  claim: (playerId: string, message?: string) =>
    AuthService.request<{ claim: ClaimRequest }>(`/players/${encodeURIComponent(playerId)}/claim`, { method: "POST", ...json({ message }) }),
  myClaims: () => AuthService.request<{ claims: ClaimRequest[] }>("/me/claims", { method: "GET" }),
  incomingClaims: () => AuthService.request<{ claims: ClaimRequest[] }>("/me/claim-requests", { method: "GET" }),
  decideClaim: (claimId: string, decision: "approve" | "reject" | "cancel") =>
    AuthService.request<{ claim: ClaimRequest }>(`/players/claims/${encodeURIComponent(claimId)}/${decision}`, { method: "POST" }),

  notifications: () =>
    AuthService.request<{ unreadCount: number; notifications: AppNotification[] }>("/me/notifications", { method: "GET" }),
  markRead: (ids?: string[]) =>
    AuthService.request<{ ok: boolean }>("/me/notifications/read", { method: "POST", ...json(ids ? { ids } : {}) }),

  myTournaments: () => AuthService.request<{ tournaments: MyTournament[] }>("/me/tournaments", { method: "GET" }),
  leaveTeam: (teamId: string) =>
    AuthService.request<{ ok: boolean }>(`/me/tournaments/teams/${encodeURIComponent(teamId)}/leave`, { method: "POST" }),

  publicProfile: (username: string) =>
    AuthService.request<PublicProfileResponse>(`/players/public/${encodeURIComponent(username)}`, { method: "GET" }),
};

export default PlayerAccountService;
