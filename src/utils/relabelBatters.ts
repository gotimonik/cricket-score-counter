import type { BallEvent } from "../types/cricket";

/**
 * Moves an innings' balls from one batter's name to another's, applying the
 * whole mapping at once, so a swap ({ A: "B", B: "A" }) works. Used when the
 * batters were picked wrongly at the start: their runs, balls faced and
 * dismissals then belong to the right players.
 */
export const relabelBatters = (
  overs: { [over: number]: BallEvent[] },
  mapping: Record<string, string>,
): { [over: number]: BallEvent[] } => {
  const keys = Object.keys(mapping).filter((k) => k && mapping[k] !== k);
  if (!keys.length) return overs;
  const rename = (name?: string) => (name && name in mapping ? mapping[name] : name);
  const result: { [over: number]: BallEvent[] } = {};
  Object.entries(overs).forEach(([over, events]) => {
    result[Number(over)] = (events ?? []).map((event) => ({
      ...event,
      striker: rename(event.striker),
      nonStriker: rename(event.nonStriker),
      ...(event.outBatsman ? { outBatsman: rename(event.outBatsman) } : {}),
    }));
  });
  return result;
};

/** Every batter named anywhere in an innings' ball-by-ball log. */
export const battersInEvents = (overs: { [over: number]: BallEvent[] }): string[] => {
  const names = new Set<string>();
  Object.values(overs).forEach((events) =>
    (events ?? []).forEach((e) => {
      [e.striker, e.nonStriker, e.outBatsman].forEach((n) => n && names.add(n));
    }),
  );
  return Array.from(names);
};

/**
 * Moves one over's balls from one bowler to another (the wrong bowler was
 * picked for that over). Other overs are left alone.
 */
export const relabelBowlerInOver = (
  overs: { [over: number]: BallEvent[] },
  over: number,
  from: string,
  to: string,
): { [over: number]: BallEvent[] } => {
  if (!from || !to || from === to || !overs[over]) return overs;
  return {
    ...overs,
    [over]: overs[over].map((event) => (event.bowler === from ? { ...event, bowler: to } : event)),
  };
};
