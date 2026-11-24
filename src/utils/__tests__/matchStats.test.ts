import {
  aggregatePerformances,
  computeInnings,
  extractInnings,
  getPlayerPerformance,
  type StatEvent,
} from "../matchStats";

const ev = (
  type: string,
  value: number,
  striker: string,
  nonStriker: string,
  bowler: string,
  extra: Partial<StatEvent> = {},
): StatEvent => ({ type, value, striker, nonStriker, bowler, ...extra });

// Team A innings: 2 overs (6-ball).
const teamAOvers = {
  0: [
    ev("run", 4, "Ana", "Ben", "Xi"),
    ev("run", 1, "Ana", "Ben", "Xi"),
    ev("wide", 1, "Ben", "Ana", "Xi"),
    ev("run", 0, "Ben", "Ana", "Xi"),
    ev("run", 6, "Ben", "Ana", "Xi"),
    ev("wicket", 0, "Ben", "Ana", "Xi", { wicketType: "caught", dismissalBy: "Yo" }),
    ev("run", 2, "Cal", "Ana", "Xi"),
  ],
  1: [
    ev("run", 0, "Ana", "Cal", "Zed"),
    ev("run", 0, "Ana", "Cal", "Zed"),
    ev("run", 0, "Ana", "Cal", "Zed"),
    ev("run", 0, "Ana", "Cal", "Zed"),
    ev("run", 0, "Ana", "Cal", "Zed"),
    ev("bye", 1, "Ana", "Cal", "Zed"),
  ],
};

describe("computeInnings", () => {
  const inn = computeInnings(teamAOvers, "A", "B");

  it("totals runs, wickets, balls and extras", () => {
    expect(inn.runs).toBe(4 + 1 + 1 + 0 + 6 + 0 + 2 + 1);
    expect(inn.wickets).toBe(1);
    expect(inn.legalBalls).toBe(12);
    expect(inn.extras).toBe(2); // wide + bye
  });

  it("builds batting lines in order", () => {
    expect(inn.batting.map((b) => b.name)).toEqual(["Ana", "Ben", "Cal"]);
    const ben = inn.batting[1];
    expect(ben).toMatchObject({ runs: 6, balls: 3, sixes: 1, out: true, wicketType: "caught", fielder: "Yo", bowler: "Xi" });
    expect(inn.batting[0]).toMatchObject({ runs: 5, balls: 8, fours: 1, out: false });
  });

  it("bowling lines include maidens (byes do not spoil them)", () => {
    const zed = inn.bowling.find((b) => b.name === "Zed")!;
    expect(zed).toMatchObject({ balls: 6, runs: 0, maidens: 1 });
    const xi = inn.bowling.find((b) => b.name === "Xi")!;
    expect(xi).toMatchObject({ balls: 6, runs: 14, wickets: 1, wides: 1, maidens: 0 });
  });

  it("tracks partnerships and fall of wickets", () => {
    expect(inn.partnerships).toHaveLength(2);
    expect(inn.partnerships[0]).toMatchObject({ number: 1, runs: 12, balls: 5, unbroken: false, batter1: "Ana", batter1Runs: 5, batter2Runs: 6, extras: 1 });
    expect(inn.partnerships[1]).toMatchObject({ number: 2, runs: 3, balls: 7, unbroken: true });
    expect(inn.fallOfWickets).toEqual([{ wicket: 1, score: 12, overs: "0.5", batter: "Ben" }]);
    expect(inn.fielding).toEqual([{ name: "Yo", catches: 1, runOuts: 0 }]);
  });

  it("summarises overs", () => {
    expect(inn.overs).toEqual([
      { over: 1, runs: 14, wickets: 1, cumulativeRuns: 14 },
      { over: 2, runs: 1, wickets: 0, cumulativeRuns: 15 },
    ]);
  });
});

describe("player performance and career", () => {
  const snapshot = {
    teams: ["A", "B"],
    winningTeam: "B",
    playerRosterByTeam: { A: ["Ana", "Ben", "Cal", "Dee"], B: ["Xi", "Yo", "Zed"] },
    recentEventsByTeams: {
      A: teamAOvers,
      B: { 0: [ev("run", 4, "Xi", "Yo", "Ana"), ev("run", 4, "Xi", "Yo", "Ana"), ev("wicket", 0, "Xi", "Yo", "Ana", { wicketType: "bowled" }), ev("run", 6, "Zed", "Yo", "Ana"), ev("run", 2, "Zed", "Yo", "Ana")] },
    },
  };

  it("extracts both innings", () => {
    expect(extractInnings(snapshot).map((i) => i.battingTeam)).toEqual(["A", "B"]);
  });

  it("finds a player's batting, bowling, and result (case-insensitive)", () => {
    const ana = getPlayerPerformance(snapshot, "a", " ana ")!;
    expect(ana.result).toBe("lost");
    expect(ana.batting).toMatchObject({ runs: 5, out: false });
    expect(ana.bowling).toMatchObject({ wickets: 1, runs: 16, balls: 5 });
    expect(getPlayerPerformance(snapshot, "A", "Dee")).toMatchObject({ batting: undefined, bowling: undefined });
    expect(getPlayerPerformance(snapshot, "A", "Nobody")).toBeNull();
  });

  it("aggregates career figures", () => {
    const yo = getPlayerPerformance(snapshot, "B", "Yo")!;
    expect(yo.fielding.catches).toBe(1);
    const perfs = [
      getPlayerPerformance(snapshot, "A", "Ana")!,
      { team: "A", opponent: "B", result: "won" as const, batting: { name: "Ana", position: 1, runs: 55, balls: 30, fours: 5, sixes: 2, dots: 8, out: true }, bowling: { name: "Ana", balls: 12, runs: 10, wickets: 3, dots: 6, maidens: 0, wides: 0, noBalls: 0 }, fielding: { catches: 2, runOuts: 0 } },
    ];
    const c = aggregatePerformances(perfs);
    expect(c.matches).toBe(2);
    expect(c.wins).toBe(1);
    expect(c.batting).toMatchObject({ innings: 2, notOuts: 1, runs: 60, highest: 55, highestNotOut: false, average: 60, fifties: 1 });
    expect(c.batting.strikeRate).toBeCloseTo((60 * 100) / 38, 2);
    expect(c.bowling).toMatchObject({ wickets: 4, bestWickets: 3, bestRuns: 10, threeWickets: 1, economy: round2((26 * 6) / 17) });
    expect(c.fielding.catches).toBe(2);
  });
});

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
