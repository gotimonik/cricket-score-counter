import AuthService from "./AuthService";
import type { PublicPlayer } from "./PlayerAccountService";
import type {
  Achievement,
  CareerInsights,
  MilestoneProgress,
} from "../utils/careerInsights";
import type { PlayerVisibility, TournamentVisibility } from "../components/privacy/VisibilityPicker";
import type {
  BattingLine,
  BowlingLine,
  CareerStats,
  MatchResult,
} from "../utils/matchStats";

export interface CareerRecentMatch {
  matchId: string;
  source: "tournament" | "friendly";
  date: string;
  team: string;
  opponent: string;
  tournamentId?: string;
  tournamentName?: string;
  result: MatchResult;
  batting?: BattingLine;
  bowling?: BowlingLine;
  fielding: { catches: number; runOuts: number };
}

export interface PlayerCareerResponse {
  player: PublicPlayer & { isOwner: boolean; visibility: PlayerVisibility; memberSince: string | null };
  /** Set when the id asked for was an old record now linked to this profile. */
  redirectTo?: string;
  overall: CareerStats;
  tournament: CareerStats;
  friendly: CareerStats;
  tournaments: Array<{
    tournamentId: string;
    name: string;
    logoUrl: string;
    status: string;
    visibility: TournamentVisibility;
    startDate: string;
    teamName: string;
    stats: CareerStats;
  }>;
  recentMatches: CareerRecentMatch[];
  /** Earned badges, newest first (whole career, whatever the scope). */
  achievements: Achievement[];
  nextMilestones: MilestoneProgress[];
  insights: Record<"overall" | "tournament" | "friendly", CareerInsights>;
  /** Only sent to the profile's owner. */
  privacy?: { privateMatches: number };
}

interface RecordBase {
  matchId: string;
  playerKey?: string;
  playerId?: string;
  name?: string;
  teamName: string;
  opponent: string;
}

export interface TournamentPlayerRow {
  playerKey: string;
  playerId: string;
  name: string;
  role: string;
  teamId: string;
  teamName: string;
  teamLogoUrl: string;
  stats: CareerStats;
}

export interface TournamentPlayerStatsResponse {
  tournamentId: string;
  matchesCounted: number;
  players: TournamentPlayerRow[];
  records: {
    topInnings: Array<RecordBase & { name: string; runs: number; balls: number; notOut: boolean; fours: number; sixes: number }>;
    bestBowling: Array<RecordBase & { name: string; wickets: number; runs: number; balls: number }>;
    partnerships: Array<RecordBase & {
      wicket: number;
      batter1: string;
      batter2: string;
      batter1Runs: number;
      batter2Runs: number;
      extras: number;
      runs: number;
      balls: number;
      unbroken: boolean;
    }>;
  };
}

export const PlayerStatsService = {
  getCareer: (playerId: string) =>
    AuthService.request<PlayerCareerResponse>(
      `/players/${encodeURIComponent(playerId)}/stats`,
      { method: "GET" },
    ),
  getTournamentPlayerStats: (tournamentId: string) =>
    AuthService.request<TournamentPlayerStatsResponse>(
      `/tournaments/${encodeURIComponent(tournamentId)}/player-stats`,
      { method: "GET" },
    ),
};

export default PlayerStatsService;
