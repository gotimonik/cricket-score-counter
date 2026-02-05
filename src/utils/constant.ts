import { BallEvent } from "../types/cricket";

export const APP_NAME = "Cricket Score Counter";
export const APP_URL =
  process.env.REACT_APP_WEBSOCKET_API_URL ||
  "https://www.cricket-score-counter.com";
export const APP_VERSION = "1.0.0";
export const scoringOptions: BallEvent[] = [
  {
    type: "run",
    value: 0,
  },
  {
    type: "run",
    value: 1,
  },
  {
    type: "run",
    value: 2,
  },
  {
    type: "run",
    value: 4,
  },
  {
    type: "run",
    value: 6,
  },
  {
    type: "wide",
    value: 1,
  },
  {
    type: "no-ball",
    value: 1,
  },
  {
    type: "wicket",
    value: 0,
  },
];

export const noBallScoringOptions: BallEvent[] = [
  {
    type: "run",
    value: 0,
  },
  {
    type: "run",
    value: 1,
  },
  {
    type: "run",
    value: 2,
  },
  {
    type: "run",
    value: 4,
  },
  {
    type: "run",
    value: 6,
  },
  {
    type: "wicket",
    value: 0,
  },
];

export const SocketIOServerEvents = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  MESSAGE: "message",
  ERROR: "error",
  GAME_STARTED: "GAME_STARTED",
  GAME_SCORED: "GAME_SCORED",
  GAME_SCORE_UPDATED: "GAME_SCORE_UPDATED",
};
export const SocketIOClientEvents = {
  GAME_JOIN: "GAME_JOIN",
  GAME_END: "GAME_END",
  GAME_SCORE_UPDATE: "GAME_SCORE_UPDATE",
};
