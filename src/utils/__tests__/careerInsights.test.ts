import {
  computeAchievements,
  computeAnalysis,
  computeCareerInsights,
  computeHeadToHead,
  computeHighlights,
  type CareerMatchRow,
} from "../careerInsights";
import { computeInnings, type PlayerMatchPerformance, type StatEvent } from "../matchStats";

const bat = (runs: number, balls: number, extra: Partial<NonNullable<PlayerMatchPerformance["batting"]>> = {}) => ({
  name: "Me",
  position: 1,
  runs,
  balls,
  fours: 0,
  sixes: 0,
  dots: 0,
  out: true,
  wicketType: "bowled",
  ...extra,
});

const bowl = (wickets: number, runs: number, balls: number, extra: Partial<NonNullable<PlayerMatchPerformance["bowling"]>> = {}) => ({
  name: "Me",
  balls,
  runs,
  wickets,
  dots: 0,
  maidens: 0,
  wides: 0,
  noBalls: 0,
  wicketTypes: wickets ? { bowled: wickets } : {},
  hatTricks: 0,
  ...extra,
});

let n = 0;
const row = (
  date: string,
  perf: Partial<PlayerMatchPerformance>,
  extra: Partial<CareerMatchRow> = {},
): CareerMatchRow => ({
  matchId: `m${++n}`,
  source: "tournament",
  date,
  team: "Lions",
  opponent: "Tigers",
  tournamentName: "Cup",
  perf: { team: "Lions", opponent: "Tigers", result: "won", fielding: { catches: 0, runOuts: 0 }, ...perf },
  ...extra,
});

describe("computeInnings hat-tricks and wicket types", () => {
  const ev = (type: string, extra: Partial<StatEvent> = {}): StatEvent => ({ type, value: 0, striker: "A", nonStriker: "B", bowler: "Bow", ...extra });

  it("counts three bowler wickets in a row as a hat-trick, across overs", () => {
    const inn = computeInnings(
      {
        "0": [ev("run"), ev("run"), ev("run"), ev("run"), ev("wicket", { wicketType: "bowled", outBatsman: "A" }), ev("wicket", { wicketType: "caught", striker: "C", outBatsman: "C" })],
        "1": [ev("wicket", { wicketType: "lbw", striker: "D", outBatsman: "D" })],
      },
      "X",
      "Y",
    );
    const b = inn.bowling.find((l) => l.name === "Bow")!;
    expect(b.hatTricks).toBe(1);
    expect(b.wicketTypes).toEqual({ bowled: 1, caught: 1, lbw: 1 });
  });

  it("a run-out or a dot ball breaks the streak", () => {
    const inn = computeInnings(
      {
        "0": [
          ev("wicket", { wicketType: "bowled", outBatsman: "A" }),
          ev("wicket", { wicketType: "bowled", striker: "C", outBatsman: "C" }),
          ev("wicket", { wicketType: "run-out", striker: "D", outBatsman: "D", dismissalBy: "F" }),
          ev("wicket", { wicketType: "bowled", striker: "E", outBatsman: "E" }),
        ],
      },
      "X",
      "Y",
    );
    expect(inn.bowling[0].hatTricks).toBe(0);
    expect(inn.bowling[0].wickets).toBe(3);
  });
});

describe("computeAchievements", () => {
  it("records the first match each feat and milestone was reached", () => {
    const rows = [
      row("2026-03-01", { batting: bat(60, 40, { out: false }) }),
      row("2026-01-01", { batting: bat(20, 15) }),
      row("2026-02-01", { batting: bat(55, 30), bowling: bowl(3, 12, 24) }),
    ];
    const { achievements, nextMilestones } = computeAchievements(rows);
    const fifty = achievements.find((a) => a.id === "first-fifty")!;
    expect(fifty.count).toBe(2);
    expect(fifty.date).toBe("2026-02-01");
    const hundredRuns = achievements.find((a) => a.id === "runs-100")!;
    expect(hundredRuns.date).toBe("2026-03-01"); // 20 + 55 = 75, then 135
    expect(achievements.find((a) => a.id === "three-fer")).toBeTruthy();
    expect(achievements.find((a) => a.id === "win-streak-3")?.date).toBe("2026-03-01");
    expect(achievements.find((a) => a.id === "century")).toBeUndefined();
    expect(nextMilestones.find((m) => m.id === "runs-500")).toEqual(expect.objectContaining({ current: 135, target: 500 }));
  });

  it("tiers climb with milestone size", () => {
    const rows = Array.from({ length: 25 }, (_, i) => row(`2026-01-${String(i + 1).padStart(2, "0")}`, { result: "lost" }));
    const { achievements } = computeAchievements(rows);
    expect(achievements.find((a) => a.id === "matches-10")?.tier).toBe("bronze");
    expect(achievements.find((a) => a.id === "matches-25")?.tier).toBe("silver");
  });

  it("returns nothing for an empty career", () => {
    expect(computeAchievements([]).achievements).toEqual([]);
  });
});

describe("computeHighlights", () => {
  it("ranks innings, bowling, partnerships and streaks", () => {
    const rows = [
      row("2025-06-01", { batting: bat(30, 20), result: "lost" }, { partnerships: [{ partner: "Ana", wicket: 1, runs: 70, balls: 40, ownRuns: 30, unbroken: false }] }),
      row("2026-01-01", { batting: bat(45, 25, { out: false }), bowling: bowl(2, 10, 18) }),
      row("2026-02-01", { batting: bat(45, 20), bowling: bowl(2, 8, 18) }),
      row("2026-03-01", { batting: bat(5, 6), bowling: bowl(0, 30, 24) }),
    ];
    const h = computeHighlights(rows);
    expect(h.bestInnings[0]).toEqual(expect.objectContaining({ runs: 45, notOut: true }));
    expect(h.bestBowling[0]).toEqual(expect.objectContaining({ wickets: 2, runs: 8 }));
    expect(h.topPartnerships[0]).toEqual(expect.objectContaining({ partner: "Ana", runs: 70 }));
    expect(h.streaks).toEqual({ longestWinStreak: 3, currentWinStreak: 3, longestDoubleFigureStreak: 3, longestWicketStreak: 2 });
    expect(h.seasons.map((s) => s.year)).toEqual([2026, 2025]);
    expect(h.firstMatch?.date).toBe("2025-06-01");
  });
});

describe("computeAnalysis", () => {
  it("breaks down runs, dismissals, positions and wins vs losses", () => {
    const rows = [
      row("2026-01-01", { batting: bat(40, 30, { fours: 4, sixes: 2, dots: 10, position: 2, wicketType: "caught" }), result: "won" }),
      row("2026-01-02", { batting: bat(10, 10, { fours: 1, dots: 4, position: 5, wicketType: "bowled" }), result: "lost" }),
      row("2026-01-03", { batting: bat(52, 30, { position: 1, out: false }), bowling: bowl(1, 20, 12, { wides: 2, wicketTypes: { lbw: 1 } }), result: "won" }),
    ];
    const a = computeAnalysis(rows);
    expect(a.batting.runsFromFours).toBe(20);
    expect(a.batting.runsFromSixes).toBe(12);
    expect(a.batting.runsRunning).toBe(70);
    expect(a.batting.dismissals).toEqual({ caught: 1, bowled: 1 });
    expect(a.batting.byPosition.map((p) => p.key)).toEqual(["top", "middle"]);
    expect(a.batting.conversionPct).toBe(50);
    expect(a.batting.scoreBands.find((b) => b.label === "50–99")?.count).toBe(1);
    expect(a.bowling.wicketTypes).toEqual({ lbw: 1 });
    expect(a.bowling.extrasPerOver).toBe(1);
    expect(a.inWins.matches).toBe(2);
    expect(a.inWins.runsPerMatch).toBe(46);
    expect(a.inLosses.runsPerMatch).toBe(10);
  });
});

describe("computeHeadToHead", () => {
  it("groups by opponent and team, case-insensitively", () => {
    const rows = [
      row("2026-01-01", { batting: bat(10, 10) }, { opponent: "Tigers" }),
      row("2026-01-02", { batting: bat(20, 10), result: "lost" }, { opponent: "tigers " }),
      row("2026-01-03", { batting: bat(5, 10) }, { opponent: "Hawks", team: "Eagles" }),
    ];
    const h = computeHeadToHead(rows);
    expect(h.opponents[0]).toEqual(expect.objectContaining({ name: "Tigers", matches: 2, wins: 1, losses: 1, runs: 30 }));
    expect(h.teams.map((t) => t.name).sort()).toEqual(["Eagles", "Lions"]);
  });

  it("computeCareerInsights bundles everything", () => {
    const out = computeCareerInsights([]);
    expect(out.highlights.bestInnings).toEqual([]);
    expect(out.headToHead.opponents).toEqual([]);
    expect(out.analysis.batting.boundaryPct).toBeNull();
  });
});
