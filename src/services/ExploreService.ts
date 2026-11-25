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
