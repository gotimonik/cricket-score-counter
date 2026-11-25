import { battersInEvents, relabelBatters, relabelBowlerInOver } from "../relabelBatters";
import { buildScorecardsFromEvents } from "../scorecard";
import type { BallEvent } from "../../types/cricket";

const ev = (type: BallEvent["type"], value: number, striker: string, nonStriker: string, extra: Partial<BallEvent> = {}): BallEvent => ({
  type,
  value,
  striker,
  nonStriker,
  bowler: "Tara",
  battingTeam: "Lions",
  bowlingTeam: "Tigers",
  ...extra,
});

describe("relabelBatters", () => {
  // Scored as if Asha opened on strike, but it was really Bina.
  const overs = {
    0: [ev("run", 4, "Asha", "Bina"), ev("run", 1, "Asha", "Bina"), ev("run", 2, "Bina", "Asha")],
    1: [ev("wicket", 0, "Bina", "Asha", { outBatsman: "Bina", wicketType: "bowled" })],
  };

  it("swaps two batters everywhere, so runs and dismissals move with them", () => {
    const fixed = relabelBatters(overs, { Asha: "Bina", Bina: "Asha" });
    const card = buildScorecardsFromEvents(["Lions", "Tigers"], {}, { Lions: fixed }).Lions.batting;
    expect(card.Bina).toEqual(expect.objectContaining({ runs: 5, balls: 2, out: false }));
    expect(card.Asha).toEqual(expect.objectContaining({ runs: 2, balls: 2, out: true }));
  });

  it("replaces a wrongly picked batter with someone who hasn't batted", () => {
    const fixed = relabelBatters(overs, { Asha: "Chetan" });
    expect(battersInEvents(fixed).sort()).toEqual(["Bina", "Chetan"]);
  });

  it("leaves the log untouched for an empty mapping", () => {
    expect(relabelBatters(overs, {})).toBe(overs);
  });
});

describe("relabelBowlerInOver", () => {
  const overs = {
    0: [ev("run", 1, "Asha", "Bina", { bowler: "Tara" })],
    1: [ev("run", 4, "Asha", "Bina", { bowler: "Uma" }), ev("wicket", 0, "Asha", "Bina", { bowler: "Uma", outBatsman: "Asha", wicketType: "bowled" })],
  };

  it("moves only that over's balls, runs and wickets to the right bowler", () => {
    const fixed = relabelBowlerInOver(overs, 1, "Uma", "Vik");
    const bowling = buildScorecardsFromEvents(["Lions", "Tigers"], {}, { Lions: fixed }).Tigers.bowling;
    expect(bowling.Vik).toEqual(expect.objectContaining({ balls: 2, runsConceded: 4, wickets: 1 }));
    expect(bowling.Uma).toBeUndefined();
    expect(bowling.Tara).toEqual(expect.objectContaining({ balls: 1, runsConceded: 1 }));
  });
});
