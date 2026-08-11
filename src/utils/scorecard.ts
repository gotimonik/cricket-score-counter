// Pure, side-effect-free helpers for turning a ball-by-ball event log into
// batting/bowling scorecards. Extracted out of CricketScorer.tsx so the same
// logic can be reused to *reconstruct* a scorecard on the receiving end of a
// live WebSocket broadcast, instead of sending the (fully derivable) computed
// scorecard object over the wire on every single ball. See utils/scoreStateWire.ts.
import type {
  BallEvent,
  PlayerBattingStats,
  PlayerBowlingStats,
  PlayerRosterByTeam,
  PlayerScorecard,
} from "../types/cricket";

export const isLegalDelivery = (event: BallEvent) =>
  event.type !== "wide" &&
  event.type !== "no-ball" &&
  event.type !== "no-ball-extra" &&
  event.type !== "penalty" &&
  event.extra_type !== "no-ball-extra";

const countsAsBatterBall = (event: BallEvent) => isLegalDelivery(event);

const countsAsBowlerBall = (event: BallEvent) => isLegalDelivery(event);

export const getEventTotalRuns = (event: BallEvent) =>
  event.extra_type === "no-ball-extra" ? event.value + 1 : event.value;

const getBatterRuns = (event: BallEvent) => {
  if (event.type === "run") {
    return event.value;
  }
  if (event.type === "wicket" && event.value > 0) {
    return event.value;
  }
  return 0;
};

const getBowlerRunsConceded = (event: BallEvent) => {
  if (
    event.type === "bye" ||
    event.type === "leg-bye" ||
    event.type === "penalty"
  ) {
    return 0;
  }
  return getEventTotalRuns(event);
};

const emptyBatting = (): PlayerBattingStats => ({
  runs: 0,
  balls: 0,
  fours: 0,
  sixes: 0,
  out: false,
  dismissalText: "",
});

const emptyBowling = (): PlayerBowlingStats => ({
  balls: 0,
  runsConceded: 0,
  wickets: 0,
});

const dismissalTextForEvent = (event: BallEvent): string => {
  if (event.wicketType === "caught") {
    const catcher = event.dismissalBy?.trim();
    return catcher
      ? `c ${catcher} b ${event.bowler ?? ""}`
      : `c & b ${event.bowler ?? ""}`;
  }
  if (event.wicketType === "run-out") {
    const fielder = event.dismissalBy?.trim();
    return fielder ? `run out (${fielder})` : "run out";
  }
  if (event.wicketType === "lbw") {
    return `lbw b ${event.bowler ?? ""}`;
  }
  return `b ${event.bowler ?? ""}`;
};

const createBaseScorecard = (
  roster: PlayerRosterByTeam,
  teams: string[],
): { [team: string]: PlayerScorecard } => {
  const result: { [team: string]: PlayerScorecard } = {};
  teams.forEach((team) => {
    const batting: Record<string, PlayerBattingStats> = {};
    const bowling: Record<string, PlayerBowlingStats> = {};
    (roster[team] ?? []).forEach((player) => {
      batting[player] = emptyBatting();
      bowling[player] = emptyBowling();
    });
    result[team] = { batting, bowling };
  });
  return result;
};

export const buildScorecardsFromEvents = (
  teams: string[],
  roster: PlayerRosterByTeam,
  recentEventsByTeams: { [team: string]: { [key: number]: BallEvent[] } },
) => {
  const scorecards = createBaseScorecard(roster, teams);
  teams.forEach((team) => {
    const overs = recentEventsByTeams[team] ?? {};
    Object.values(overs).forEach((events) => {
      events.forEach((event) => {
        if (!event.battingTeam || !event.bowlingTeam || !event.striker) {
          return;
        }
        const battingTeam = event.battingTeam;
        const bowlingTeam = event.bowlingTeam;
        const striker = event.striker;
        const bowler = event.bowler ?? "";
        if (!scorecards[battingTeam]) {
          scorecards[battingTeam] = { batting: {}, bowling: {} };
        }
        if (!scorecards[bowlingTeam]) {
          scorecards[bowlingTeam] = { batting: {}, bowling: {} };
        }
        if (!scorecards[battingTeam].batting[striker]) {
          scorecards[battingTeam].batting[striker] = emptyBatting();
        }
        const strikerStats = scorecards[battingTeam].batting[striker];
        const batterRuns = getBatterRuns(event);
        if (batterRuns > 0) {
          strikerStats.runs += batterRuns;
        }
        if (event.type === "run") {
          if (event.value === 4) strikerStats.fours += 1;
          if (event.value === 6) strikerStats.sixes += 1;
        }
        if (countsAsBatterBall(event)) {
          strikerStats.balls += 1;
        }
        if (event.type === "wicket") {
          const outName = event.outBatsman ?? striker;
          if (!scorecards[battingTeam].batting[outName]) {
            scorecards[battingTeam].batting[outName] = emptyBatting();
          }
          scorecards[battingTeam].batting[outName].out = true;
          scorecards[battingTeam].batting[outName].dismissalText =
            dismissalTextForEvent(event);
        }
        if (bowler) {
          if (!scorecards[bowlingTeam].bowling[bowler]) {
            scorecards[bowlingTeam].bowling[bowler] = emptyBowling();
          }
          const bowlerStats = scorecards[bowlingTeam].bowling[bowler];
          bowlerStats.runsConceded += getBowlerRunsConceded(event);
          if (countsAsBowlerBall(event)) {
            bowlerStats.balls += 1;
          }
          if (
            event.type === "wicket" &&
            event.extra_type !== "no-ball-extra" &&
            event.wicketType !== "run-out"
          ) {
            bowlerStats.wickets += 1;
          }
        }
      });
    });
  });
  return scorecards;
};
