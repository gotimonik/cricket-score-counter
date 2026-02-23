export type BallEventType =
  | "run"
  | "wide"
  | "no-ball"
  | "wicket"
  | "no-ball-extra";

export interface BallEvent {
  type: BallEventType;
  extra_type?: BallEventType;
  value: number;
  striker?: string;
  nonStriker?: string;
  bowler?: string;
  battingTeam?: string;
  bowlingTeam?: string;
  outBatsman?: string;
  wicketType?: "bowled" | "caught" | "run-out";
  dismissalBy?: string;
}

export interface PlayerBattingStats {
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  out: boolean;
  dismissalText?: string;
}

export interface PlayerBowlingStats {
  balls: number;
  runsConceded: number;
  wickets: number;
}

export interface PlayerScorecard {
  batting: Record<string, PlayerBattingStats>;
  bowling: Record<string, PlayerBowlingStats>;
}

export interface PlayerRosterByTeam {
  [teamName: string]: string[];
}

export interface Match {
  id: string;
  team1: string;
  team2: string;
  score: number;
  wickets: number;
  overs: number;
  targetScore: number;
  targetOvers: number;
  currentOver: number;
  currentBallOfOver: number;
  teams: string[];
  winningTeam: string;
  remainingBalls: number;
  recentEvents: {
    [key: number]: BallEvent[];
  };
}

export interface ScoreState {
  score: number;
  targetScore: number;
  wickets: number;
  currentOver: number;
  currentBallOfOver: number;
  targetOvers: number;
  teams: string[];
  remainingBalls: number;
  winningTeam: string;
  recentEvents: { [key: number]: BallEvent[] };
  recentEventsByTeams: { [team: string]: { [key: number]: BallEvent[] } };
  playerRosterByTeam?: PlayerRosterByTeam;
  playerScorecardByTeam?: { [team: string]: PlayerScorecard };
  activePlayers?: {
    striker: string;
    nonStriker: string;
    bowler: string;
  };
}
