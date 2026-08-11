export type BallEventType =
  | "run"
  | "wide"
  | "no-ball"
  | "wicket"
  | "no-ball-extra"
  | "bye"
  | "leg-bye"
  | "penalty";

export type WicketType = "bowled" | "caught" | "lbw" | "run-out";

// "overs" is the classic mode (targetOvers is a whole number of 6-ball
// overs). "balls" lets the match length be any number of legal deliveries
// (e.g. a 25-ball innings), which does not necessarily line up with a whole
// over. `totalBalls` is always the authoritative innings length in legal
// deliveries; `targetOvers` is kept in sync (possibly fractional in "balls"
// mode) purely so older "is the match configured?" checks keep working.
export type MatchLengthMode = "overs" | "balls";

// The number of legal deliveries that make up one over. Standard cricket
// overs are 6 balls; "by balls" matches use a shorter 5-ball over instead,
// so bowlers rotate and figures ("X.Y overs") are expressed in that same
// unit throughout the match.
export const getBallsPerOver = (mode?: MatchLengthMode): number =>
  mode === "balls" ? 5 : 6;

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
  wicketType?: WicketType;
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
  matchLengthMode?: MatchLengthMode;
  totalBalls?: number;
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
  matchLengthMode?: MatchLengthMode;
  totalBalls?: number;
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
