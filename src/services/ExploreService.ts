import AuthService from "./AuthService";
import type { PublicPlayer } from "./PlayerAccountService";
import type { TournamentPlayerStatsResponse } from "./PlayerStatsService";
import type { TournamentVisibility } from "../components/privacy/VisibilityPicker";
import type { InningsStats } from "../utils/matchStats";

// Login-free discovery endpoints. A logged-in user's token is still sent, so
// organizers and squad players can open their private tournaments here too.

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PublicTournamentSummary {
  id: string;
  name: string;
  organizerName: string;
  location: string;
  startDate: string;
  endDate: string;
  logoUrl: string;
  status: "draft" | "active" | "completed";
  format: "league" | "knockout";
  ballType: string;
  oversPerMatch: number;
  visibility: TournamentVisibility;
  teamsCount?: number;
  matchesCompleted?: number;
}

export interface PublicTournamentResponse {
  tournament: PublicTournamentSummary & { isOrganizer: boolean };
  pointsTable: Array<{
    rank: number;
    teamId: string;
    name: string;
    logoUrl: string;
    played: number;
    won: number;
    lost: number;
    tied: number;
    noResult: number;
    points: number;
    netRunRate: number;
  }>;
  teams: Array<{
    id: string;
    name: string;
    logoUrl: string;
    captainName: string;
    players: Array<{ name: string; role: string; player: PublicPlayer | null }>;
  }>;
  matches: Array<{
    id: string;
    team1Id: string;
    team2Id: string;
    team1Name: string;
    team2Name: string;
    status: "scheduled" | "in_progress" | "completed";
    winnerTeamId: string;
    resultText: string;
    liveCode: string;
    date: string;
    innings: Array<{ team: string; runs: number; wickets: number; overs: string }>;
    hasScorecard: boolean;
  }>;
}

export interface PublicScorecardResponse {
  matchId: string;
  team1Name: string;
  team2Name: string;
  resultText: string;
  date: string | null;
  innings: Array<Omit<InningsStats, "overs"> & { oversText: string }>;
}

const qs = (params: Record<string, string | number | undefined>) => {
  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  return parts.length ? `?${parts.join("&")}` : "";
};

/** A match being scored right now (GET /explore/live). */
export interface LiveMatchSummary {
  /** Watch code: open /join-game/:code. */
  code: string;
  kind: "tournament" | "friendly";
  /** Team that batted first (or is batting, in the first innings). */
  team1Name: string;
  team2Name: string;
  team1LogoUrl: string;
  team2LogoUrl: string;
  battingTeam: string;
  innings: Array<{ team: string; runs: number; wickets: number; overs: string }>;
  target: number;
  statusText: string;
  /** False when the scorer is offline and this is the last saved over. */
  scorerOnline: boolean;
  tournament: { id: string; name: string; location: string; logoUrl: string } | null;
  updatedAt: string | null;
  /** When the match went live. The server orders the list by this, newest first. */
  startedAt?: string | null;
}

/** Explore shows the latest 10 players or tournaments, then "Show more". */
export const EXPLORE_PAGE_SIZE = 10;

export const ExploreService = {
  players: (q = "", page = 1) =>
    AuthService.request<{ players: PublicPlayer[]; pagination: PageMeta }>(
      `/explore/players${qs({ q, page, limit: EXPLORE_PAGE_SIZE })}`,
      { method: "GET" },
    ),
  tournaments: (q = "", status = "", page = 1) =>
    AuthService.request<{ tournaments: PublicTournamentSummary[]; pagination: PageMeta }>(
      `/explore/tournaments${qs({ q, status, page, limit: EXPLORE_PAGE_SIZE })}`,
      { method: "GET" },
    ),
  // no-store: scores change every ball, a cached list would hide new matches.
  /** Counts only: registered players, and unclaimed records matching a name (q ≥ 3 chars). */
  playersWaiting: (q = "") =>
    AuthService.request<{ registered: number; matches: number }>(`/explore/players/waiting${qs({ q })}`, { method: "GET" }),
  live: (limit?: number) =>
    AuthService.request<{ matches: LiveMatchSummary[]; count: number }>(`/explore/live${qs({ limit })}`, {
      method: "GET",
      cache: "no-store",
    }),
  tournament: (id: string) =>
    AuthService.request<PublicTournamentResponse>(`/explore/tournaments/${encodeURIComponent(id)}`, { method: "GET" }),
  tournamentPlayerStats: (id: string) =>
    AuthService.request<TournamentPlayerStatsResponse>(
      `/explore/tournaments/${encodeURIComponent(id)}/player-stats`,
      { method: "GET" },
    ),
  scorecard: (tournamentId: string, matchId: string) =>
    AuthService.request<PublicScorecardResponse>(
      `/explore/tournaments/${encodeURIComponent(tournamentId)}/matches/${encodeURIComponent(matchId)}`,
      { method: "GET" },
    ),
};

export default ExploreService;
