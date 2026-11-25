import type { RunOutEnd } from "../types/cricket";

/**
 * Where the batters stand after a run out (Laws of Cricket 38): the new
 * batter comes in at the end where the wicket was broken, and the surviving
 * batter is at the other end, whoever was on strike before and however many
 * runs were completed. With no new batter (single-batter mode) the survivor
 * carries on alone. The batter at the striker's end faces next, unless the
 * over has just ended (the scorer swaps ends after that separately).
 */
export const battersAfterRunOut = ({
  striker,
  nonStriker,
  outBatsman,
  incoming,
  end,
}: {
  striker: string;
  nonStriker: string;
  outBatsman: string;
  incoming?: string;
  end: RunOutEnd;
}): { striker: string; nonStriker: string } => {
  const survivor = outBatsman === striker ? nonStriker : striker;
  const newcomer = incoming ?? "";
  if (!newcomer) return { striker: survivor, nonStriker: "" };
  return end === "striker"
    ? { striker: newcomer, nonStriker: survivor }
    : { striker: survivor, nonStriker: newcomer };
};
