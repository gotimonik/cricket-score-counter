import { BallEvent } from "../types/cricket";

export const APP_NAME = "Cricket Scorer";
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
