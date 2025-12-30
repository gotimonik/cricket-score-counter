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
}
