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
  targetScore?: number;
  targetOvers?: number;
  events: BallEvent[];
}
