import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { computeInnings, type OversMap } from "../utils/matchStats";

const sectionTitleSx = {
  fontWeight: 800,
  fontSize: "calc(15px * var(--app-font-scale, 1))",
  color: "var(--app-accent-text, #185a9d)",
  mb: 0.75,
};

/**
 * Partnerships (with each batter's share) and fall of wickets for one
 * innings, derived from its ball-by-ball log.
 */
const InningsPartnerships: React.FC<{
  overs: OversMap | undefined;
  battingTeam: string;
  bowlingTeam: string;
  ballsPerOver: number;
}> = ({ overs, battingTeam, bowlingTeam, ballsPerOver }) => {
  const { t } = useTranslation();
  const innings = React.useMemo(
    () => computeInnings(overs ?? {}, battingTeam, bowlingTeam, ballsPerOver),
    [overs, battingTeam, bowlingTeam, ballsPerOver],
  );
  const stands = innings.partnerships.filter((p) => p.batter1 && p.batter2);
  if (stands.length === 0 && innings.fallOfWickets.length === 0) return null;
  const maxRuns = Math.max(1, ...stands.map((p) => p.runs));
  const bestRuns = Math.max(0, ...stands.map((p) => p.runs));

  return (
    <Box
      sx={{
        mt: 1.25,
        border: "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
        borderRadius: 3,
        p: { xs: 1, sm: 1.5 },
        background: "rgba(255,255,255,0.96)",
      }}
    >
      {stands.length > 0 && (
        <>
          <Typography sx={sectionTitleSx}>{t("Partnerships")}</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {stands.map((p) => (
              <Box key={`${p.number}-${p.batter1}-${p.batter2}`}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 1 }}>
                  <Typography sx={{ fontSize: "calc(12.5px * var(--app-font-scale, 1))", fontWeight: 700, color: "#334" }}>
                    {p.unbroken ? t("Unbroken") : t("{{n}} wkt", { n: p.number })}
                    {p.runs === bestRuns && p.runs > 0 && stands.length > 1 ? (
                      <Box component="span" sx={{ ml: 0.75, px: 0.6, borderRadius: 1, fontSize: "0.8em", fontWeight: 800, color: "#7a5600", background: "#ffe9a8" }}>
                        {t("Best")}
                      </Box>
                    ) : null}
                  </Typography>
                  <Typography sx={{ fontWeight: 900, color: "var(--app-accent-text, #185a9d)", fontSize: "calc(14px * var(--app-font-scale, 1))" }}>
                    {p.runs}
                    {p.unbroken ? "*" : ""}{" "}
                    <Box component="span" sx={{ fontWeight: 600, opacity: 0.7, fontSize: "0.85em" }}>
                      ({p.balls})
                    </Box>
                  </Typography>
                </Box>
                {/* Bar length = stand size relative to the biggest stand; segments = each batter's share. */}
                <Box sx={{ width: `${Math.max(4, (p.runs / maxRuns) * 100)}%`, display: "flex", height: 8, borderRadius: 99, overflow: "hidden", gap: "2px", mt: 0.4, background: p.runs === 0 ? "#e6ecf2" : "transparent" }}>
                  {p.runs > 0 && (
                    <>
                      <Box sx={{ flex: p.batter1Runs, background: "var(--app-accent-start, #43cea2)" }} />
                      <Box sx={{ flex: p.batter2Runs, background: "var(--app-accent-end, #185a9d)" }} />
                      <Box sx={{ flex: p.extras, background: "#b8c2cc" }} />
                    </>
                  )}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mt: 0.3, fontSize: "calc(12px * var(--app-font-scale, 1))", color: "#445" }}>
                  <span>
                    {p.batter1} {p.batter1Runs} ({p.batter1Balls})
                  </span>
                  <span style={{ textAlign: "right" }}>
                    {p.batter2} {p.batter2Runs} ({p.batter2Balls})
                  </span>
                </Box>
              </Box>
            ))}
          </Box>
        </>
      )}

      {innings.fallOfWickets.length > 0 && (
        <Box sx={{ mt: stands.length > 0 ? 1.75 : 0 }}>
          <Typography sx={sectionTitleSx}>{t("Fall of wickets")}</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
            {innings.fallOfWickets.map((f) => (
              <Box
                key={f.wicket}
                sx={{
                  px: 1,
                  py: 0.4,
                  borderRadius: 2,
                  fontSize: "calc(12px * var(--app-font-scale, 1))",
                  background: "color-mix(in srgb, var(--app-accent-end, #185a9d) 8%, #ffffff 92%)",
                  border: "1px solid color-mix(in srgb, var(--app-accent-end, #185a9d) 18%, transparent 82%)",
                  color: "#334",
                }}
              >
                <b>
                  {f.score}-{f.wicket}
                </b>{" "}
                {f.batter} · {f.overs} {t("ov")}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default InningsPartnerships;
