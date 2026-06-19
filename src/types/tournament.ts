import type { ScoreState } from "./cricket";

export type TournamentBallType = "tennis" | "leather" | "custom";

export type TournamentFormat = "league" | "knockout";

export type TournamentStatus = "draft" | "active" | "completed";

export type TournamentSquadMode = "teams_only" | "with_players";

export interface TournamentPlayer {
  id: string;
  name: string;
  role?: string;
  contactNumber?: string;
}

export interface TournamentTeamStatistics {
  matchesPlayed: number;
  wins: number;
  losses: number;
  ties: number;
  noResults: number;
  points: number;
  runsFor: number;
  runsAgainst: number;
  wicketsTaken: number;
  wicketsLost: number;
  ballsFaced: number;
  ballsBowled: number;
  netRunRate: number;
}

export interface TournamentTeam {
  id: string;
  tournamentId?: string;
  name: string;
  logoUrl?: string;
  captainName: string;
  contactNumber: string;
  players: TournamentPlayer[];
  playerCount?: number;
  stats: {
    played: number;
    won: number;
    lost: number;
    points: number;
    netRunRate: number;
  };
  statistics?: TournamentTeamStatistics;
  createdAt: string;
  updatedAt: string;
}

export interface TournamentRecord {
  id: string;
  name: string;
  organizerName: string;
  startDate: string;
  endDate: string;
  location: string;
  logoUrl?: string;
  ballType: TournamentBallType;
  customBallType?: string;
  oversPerMatch: number;
  format: TournamentFormat;
  status: TournamentStatus;
  squadMode: TournamentSquadMode;
  teamsCount?: number;
  teams: TournamentTeam[];
  matches?: TournamentMatch[];
  createdAt: string;
  updatedAt: string;
}

export interface TournamentInput {
  name: string;
  organizerName: string;
  startDate: string;
  endDate: string;
  location: string;
  logoUrl?: string;
  ballType: TournamentBallType;
  customBallType?: string;
  oversPerMatch: number;
  format: TournamentFormat;
  status?: TournamentStatus;
  squadMode?: TournamentSquadMode;
}

export type TournamentUpdateInput = Partial<TournamentInput>;

export interface TournamentTeamInput {
  name: string;
  logoUrl?: string;
  captainName: string;
  contactNumber: string;
  players: Array<{
    name: string;
    role?: string;
    contactNumber?: string;
  }>;
  statistics?: Partial<TournamentTeamStatistics>;
  stats?: Partial<TournamentTeamStatistics>;
}

export type TournamentMatchStatus =
  | "scheduled"
  | "in_progress"
  | "completed";

export interface TournamentMatch {
  id: string;
  tournamentId: string;
  team1Id: string;
  team2Id: string;
  team1Name: string;
  team2Name: string;
  status: TournamentMatchStatus;
  winnerTeamId?: string;
  winnerTeamName?: string;
  resultText?: string;
  scorerMatchId?: string;
  snapshot?: ScoreState | null;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TournamentMatchInput {
  team1Id: string;
  team2Id: string;
  tossWinnerTeamId?: string;
  tossDecision?: "bat" | "bowl";
  battingFirstTeamId?: string;
}

export interface TournamentMatchCompletionInput {
  winnerTeamId?: string;
  winnerTeamName: string;
  resultText?: string;
  scorerMatchId?: string;
  snapshot?: ScoreState;
}

export interface TournamentScorerSetup {
  tournamentId: string;
  tournamentName: string;
  tournamentMatchId: string;
  oversPerMatch: number;
  battingFirstTeamId: string;
  battingFirstTeamName: string;
  team1: {
    id: string;
    name: string;
    players: string[];
  };
  team2: {
    id: string;
    name: string;
    players: string[];
  };
}
