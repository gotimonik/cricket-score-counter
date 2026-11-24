import type React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { computeInnings, normalizeName, type OversMap } from "../utils/matchStats";

export interface LivePartnership {
  batter1: string;
  batter2: string;
  runs: number;
  balls: number;
  batter1Runs: number;
  batter1Balls: number;
  batter2Runs: number;
  batter2Balls: number;
  extras: number;
}

/**
 * The stand between the two batters currently at the crease, derived from the
 * batting team's ball-by-ball log. Returns a zeroed stand for a new pair that
 * hasn't faced a ball yet, and undefined when the pair isn't known.
 */
export const getLivePartnership = (
  overs: OversMap | undefined,
  battingTeam: string,
  bowlingTeam: string,
  ballsPerOver: number,
  striker: string,
  nonStriker: string,
): LivePartnership | undefined => {
  if (!battingTeam || !striker || !nonStriker) return undefined;
  const innings = computeInnings(overs ?? {}, battingTeam, bowlingTeam, ballsPerOver);
  const pairKey = (a: string, b: string) => [a, b].map(normalizeName).sort().join("|");
  const last = innings.partnerships[innings.partnerships.length - 1];
  if (last && last.unbroken && pairKey(last.batter1, last.batter2) === pairKey(striker, nonStriker)) {
    return last;
  }
  return {
    batter1: striker, batter2: nonStriker, runs: 0, balls: 0,
    batter1Runs: 0, batter1Balls: 0, batter2Runs: 0, batter2Balls: 0, extras: 0,
  };
};

/**
 * Current stand between the two batters at the crease: total runs (balls),
 * and a split bar showing how much each batter (and extras) contributed.
 */
const PartnershipStrip: React.FC<{ partnership: LivePartnership }> = ({ partnership: p }) => {
  const { t } = useTranslation();
  const total = Math.max(p.runs, 1);
  const pct = (n: number) => `${Math.max(0, (n / total) * 100)}%`;
  const empty = p.runs === 0;

  return (
    <Box
      data-testid="live-partnership"
      sx={{
        gridColumn: "1 / -1",
        borderRadius: 2.5,
        px: 1.1,
        py: 0.9,
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, color-mix(in srgb, var(--app-accent-start, #43cea2) 10%, #ffffff 90%) 100%)",
        border:
          "1px solid color-mix(in srgb, var(--app-accent-end, #185a9d) 20%, transparent 80%)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 1 }}>
        <Box
          sx={{
            px: 0.9,
            py: 0.2,
            borderRadius: 99,
            background: "color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
            fontSize: "calc(10.5px * var(--app-font-scale, 1))",
            fontWeight: 900,
            letterSpacing: 0.35,
          }}
        >
          {t("PARTNERSHIP")}
        </Box>
        <Typography sx={{ fontWeight: 900, fontSize: "calc(18px * var(--app-font-scale, 1))", lineHeight: 1 }}>
          {p.runs}
          <Box component="span" sx={{ fontWeight: 700, fontSize: "0.72em", opacity: 0.75, ml: 0.4 }}>
            ({p.balls})
          </Box>
        </Typography>
      </Box>

      <Box
        role="img"
        aria-label={t("{{a}} {{ar}}, {{b}} {{br}}, extras {{x}}", {
          a: p.batter1, ar: p.batter1Runs, b: p.batter2, br: p.batter2Runs, x: p.extras,
        })}
        sx={{
          display: "flex",
          height: 8,
          mt: 0.8,
          borderRadius: 99,
          overflow: "hidden",
          gap: "2px",
          background: empty ? "color-mix(in srgb, var(--app-accent-end, #185a9d) 10%, transparent 90%)" : "transparent",
        }}
      >
        {!empty && (
          <>
            <Box sx={{ width: pct(p.batter1Runs), background: "var(--app-accent-start, #43cea2)", transition: "width .4s" }} />
            <Box sx={{ width: pct(p.batter2Runs), background: "var(--app-accent-end, #185a9d)", transition: "width .4s" }} />
            <Box sx={{ width: pct(p.extras), background: "#b8c2cc", transition: "width .4s" }} />
          </>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 0.6,
          fontSize: "calc(12px * var(--app-font-scale, 1))",
          fontWeight: 700,
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "var(--app-accent-start, #43cea2)", flex: "none" }} />
          <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {p.batter1} {p.batter1Runs} ({p.batter1Balls})
          </Box>
        </Box>
        {p.extras > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flex: "none", opacity: 0.8 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "#b8c2cc" }} />
            {t("Extras")} {p.extras}
          </Box>
        )}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0, justifyContent: "flex-end" }}>
          <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {p.batter2} {p.batter2Runs} ({p.batter2Balls})
          </Box>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: "var(--app-accent-end, #185a9d)", flex: "none" }} />
        </Box>
      </Box>
    </Box>
  );
};

export default PartnershipStrip;
