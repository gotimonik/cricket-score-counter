// Shrinks a ScoreState down to what actually needs to travel over the
// WebSocket for a live broadcast (CricketScorer -> GAME_SCORE_UPDATE ->
// backend -> GAME_SCORE_UPDATED -> ViewCricketScorer), and reconstructs the
// full ScoreState back out of that smaller payload on the receiving end.
//
// Three things are stripped before sending, all because they are 100%
// derivable from data that's already present elsewhere in the same payload
// -- sending them too is pure duplicate bytes, repeated on every single ball
// for the entire match:
//   1. `recentEvents` -- always identical to
//      `recentEventsByTeams[<currently batting team>]` by construction.
//   2. `playerScorecardByTeam` -- always exactly what
//      `buildScorecardsFromEvents(teams, playerRosterByTeam, recentEventsByTeams)`
//      would compute.
//   3. Each ball event's `battingTeam`/`bowlingTeam` fields -- always equal
//      to (the team bucket it's stored under) and (the other entry of the
//      match's two-team `teams` array), respectively.
//
// The payload stays fully self-contained (nothing here depends on
// previously-received messages), so a viewer joining mid-match or resuming
// from a stored snapshot still gets a complete, correct ScoreState from a
// single message -- exactly as before this change.
import type { BallEvent, ScoreState } from "../types/cricket";
import { buildScorecardsFromEvents } from "./scorecard";

export type WireBallEvent = Omit<BallEvent, "battingTeam" | "bowlingTeam">;

export type WireEventsByTeam = {
  [team: string]: { [over: number]: WireBallEvent[] };
};

export type ScoreStateWirePayload = Omit<
  ScoreState,
  "recentEvents" | "playerScorecardByTeam" | "recentEventsByTeams"
> & {
  recentEventsByTeams: WireEventsByTeam;
};

const stripEvent = (event: BallEvent): WireBallEvent => {
  const { battingTeam, bowlingTeam, ...rest } = event;
  return rest;
};

const stripEventsByTeam = (eventsByTeams: {
  [team: string]: { [over: number]: BallEvent[] };
}): WireEventsByTeam => {
  const result: WireEventsByTeam = {};
  Object.entries(eventsByTeams).forEach(([team, overs]) => {
    const strippedOvers: { [over: number]: WireBallEvent[] } = {};
    Object.entries(overs).forEach(([over, events]) => {
      strippedOvers[Number(over)] = (events ?? []).map(stripEvent);
    });
    result[team] = strippedOvers;
  });
  return result;
};

export const encodeScoreStateForWire = (
  snapshot: ScoreState,
): ScoreStateWirePayload => {
  const {
    recentEvents,
    playerScorecardByTeam,
    recentEventsByTeams,
    ...rest
  } = snapshot;
  return {
    ...rest,
    recentEventsByTeams: stripEventsByTeam(recentEventsByTeams ?? {}),
  };
};

const restoreEvent = (
  event: WireBallEvent,
  battingTeam: string,
  bowlingTeam: string,
): BallEvent => ({
  ...event,
  battingTeam,
  bowlingTeam,
});

export const decodeScoreStateWire = (
  payload: ScoreStateWirePayload,
): ScoreState => {
  const teams = Array.isArray(payload.teams) ? payload.teams : [];
  const recentEventsByTeams: {
    [team: string]: { [over: number]: BallEvent[] };
  } = {};
  Object.entries(payload.recentEventsByTeams ?? {}).forEach(
    ([team, overs]) => {
      const bowlingTeam = teams.find((t) => t !== team) ?? "";
      const restoredOvers: { [over: number]: BallEvent[] } = {};
      Object.entries(overs ?? {}).forEach(([over, events]) => {
        restoredOvers[Number(over)] = (events ?? []).map((event) =>
          restoreEvent(event, team, bowlingTeam),
        );
      });
      recentEventsByTeams[team] = restoredOvers;
    },
  );

  const battingTeam = payload.targetScore ? teams[1] : teams[0];
  const recentEvents = recentEventsByTeams[battingTeam] ?? {};
  const playerScorecardByTeam = buildScorecardsFromEvents(
    teams,
    payload.playerRosterByTeam ?? {},
    recentEventsByTeams,
  );

  return {
    ...payload,
    teams,
    recentEvents,
    recentEventsByTeams,
    playerScorecardByTeam,
  };
};
