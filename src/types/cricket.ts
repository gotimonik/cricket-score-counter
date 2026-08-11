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

// A completed super-over phase, played to break a tie. Each phase is its
// own tiny (usually 1-over) mini-match between the same two teams; several
// can chain together if a super over itself ends tied. The very first tied
// result (the regulation match) is captured as the base `ScoreState` fields
// rather than as a phase here, so a match that was never tied has an empty
// `superOvers` list and looks exactly like it always has.
export interface SuperOverPhase {
  teams: string[];
  score: number;
  targetScore: number;
  wickets: number;
  matchLengthMode?: MatchLengthMode;
  totalBalls?: number;
  remainingBalls: number;
  recentEvents: { [key: number]: BallEvent[] };
  recentEventsByTeams: { [team: string]: { [key: number]: BallEvent[] } };
  playerRosterByTeam?: PlayerRosterByTeam;
  playerScorecardByTeam?: { [team: string]: PlayerScorecard };
  activePlayers?: {
    striker: string;
    nonStriker: string;
    bowler: string;
  };
  // The real winner of this phase, or "Tied" if it also ended level and
  // another super over followed.
  winningTeam: string;
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
  // Present only when the regulation match (the fields above) ended tied
  // and the match was decided by one or more super overs. The base fields
  // above always stay frozen as the regulation match's own result — only
  // `winningTeam` is updated to the eventual real winner — so the full
  // regulation scorecard is never lost or overwritten by the tie-breaker.
  superOvers?: SuperOverPhase[];
}
