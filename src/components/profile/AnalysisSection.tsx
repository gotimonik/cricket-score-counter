import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { QueryStatsRounded, SportsBaseballRounded, SportsCricketRounded, ThumbsUpDownRounded } from "@mui/icons-material";
import type { CareerAnalysis } from "../../utils/careerInsights";
import { BarList, EmptyNote, MiniHistogram, Section, StackedBar, StatTile, dash, ink, muted, titleCase } from "./ProfileUi";

const SubTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography sx={{ fontWeight: 900, color: "#526274", fontSize: 12.5, textTransform: "uppercase", letterSpacing: 0.4, mb: 1 }}>{children}</Typography>
);

const pctText = (v: number | null) => (v === null ? "–" : `${Math.round(v)}%`);

const Compare: React.FC<{ label: string; win: string; loss: string }> = ({ label, win, loss }) => (
  <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 1.5, alignItems: "center", py: 0.75, borderBottom: "1px solid #edf1f4" }}>
    <Typography sx={{ fontWeight: 700, color: "#526274", fontSize: 13.5 }}>{label}</Typography>
    <Typography sx={{ fontWeight: 900, color: "#0d6b3d", fontSize: 14.5, minWidth: 56, textAlign: "right" }}>{win}</Typography>
    <Typography sx={{ fontWeight: 900, color: "#8a1c1c", fontSize: 14.5, minWidth: 56, textAlign: "right" }}>{loss}</Typography>
  </Box>
);

const AnalysisSection: React.FC<{ a: CareerAnalysis; premium?: boolean }> = ({ a, premium }) => {
  const b = a.batting;
  const w = a.bowling;
  return (
    <>
      <Section title="Batting analysis" icon={<SportsCricketRounded />} premium={premium}>
        {b.innings === 0 ? (
          <EmptyNote>No innings yet.</EmptyNote>
        ) : (
          <Stack spacing={2.5}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))" }, gap: 1 }}>
              <StatTile label="Boundary runs" value={pctText(b.boundaryPct)} hint="share of all runs" highlight />
              <StatTile label="Dot balls" value={pctText(b.dotPct)} hint="of balls faced" />
              <StatTile label="Balls / boundary" value={dash(b.ballsPerBoundary, 1)} />
              <StatTile label="30s → 50s" value={pctText(b.conversionPct)} hint="conversion rate" />
            </Box>
            <Box>
              <SubTitle>Where the runs come from</SubTitle>
              <StackedBar
                parts={[
                  { label: "Fours", value: b.runsFromFours, color: "#2f8fbf" },
                  { label: "Sixes", value: b.runsFromSixes, color: "#185a9d" },
                  { label: "Running", value: b.runsRunning, color: "#43cea2" },
                ]}
              />
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
              <Box>
                <SubTitle>How they get out</SubTitle>
                <BarList
                  items={Object.entries(b.dismissals)
                    .sort((x, y) => y[1] - x[1])
                    .map(([k, v]) => ({ label: titleCase(k), value: v }))}
                  emptyText="Never been dismissed."
                />
              </Box>
              <Box>
                <SubTitle>Scores</SubTitle>
                <MiniHistogram bins={b.scoreBands.map((s) => ({ label: s.label, count: s.count }))} />
              </Box>
            </Box>
            {b.byPosition.length > 0 && (
              <Box>
                <SubTitle>
                  By batting position{b.averagePosition ? ` · usually #${Math.round(b.averagePosition)}` : ""}
                </SubTitle>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: `repeat(${b.byPosition.length}, minmax(0, 1fr))` }, gap: 1 }}>
                  {b.byPosition.map((p) => (
                    <Box key={p.key} sx={{ p: 1.25, borderRadius: 2, background: "#f6f9fb", border: "1px solid rgba(12,53,88,0.08)" }}>
                      <Typography sx={{ fontWeight: 900, color: ink, fontSize: 14 }}>{p.label}</Typography>
                      <Typography sx={{ color: muted, fontSize: 12.5, fontWeight: 700 }}>
                        {p.innings} inns · {p.runs} runs · avg {dash(p.average)} · SR {dash(p.strikeRate)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Stack>
        )}
      </Section>

      <Section title="Bowling analysis" icon={<SportsBaseballRounded />} premium={premium}>
        {w.innings === 0 ? (
          <EmptyNote>Hasn't bowled yet.</EmptyNote>
        ) : (
          <Stack spacing={2.5}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))" }, gap: 1 }}>
              <StatTile label="Dot balls" value={pctText(w.dotPct)} hint="of balls bowled" highlight />
              <StatTile label="Balls / wicket" value={dash(w.ballsPerWicket, 1)} />
              <StatTile label="Wides + no-balls" value={w.wides + w.noBalls} hint={`${dash(w.extrasPerOver)} per over`} />
              <StatTile label="Maidens" value={w.maidens} />
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
              <Box>
                <SubTitle>How the wickets come</SubTitle>
                <BarList
                  items={Object.entries(w.wicketTypes)
                    .sort((x, y) => y[1] - x[1])
                    .map(([k, v]) => ({ label: titleCase(k), value: v }))}
                  emptyText="No wickets yet."
                />
              </Box>
              <Box>
                <SubTitle>Wickets per spell</SubTitle>
                <MiniHistogram bins={w.wicketBands} color="#43cea2" />
              </Box>
            </Box>
          </Stack>
        )}
      </Section>

      {(a.inWins.matches > 0 || a.inLosses.matches > 0) && (
        <Section title="In wins vs losses" icon={<ThumbsUpDownRounded />} premium={premium}>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 1.5, pb: 0.5 }}>
            <span />
            <Typography sx={{ fontWeight: 900, fontSize: 12, color: "#0d6b3d", textTransform: "uppercase", minWidth: 56, textAlign: "right" }}>
              Won ({a.inWins.matches})
            </Typography>
            <Typography sx={{ fontWeight: 900, fontSize: 12, color: "#8a1c1c", textTransform: "uppercase", minWidth: 56, textAlign: "right" }}>
              Lost ({a.inLosses.matches})
            </Typography>
          </Box>
          <Compare label="Runs per match" win={dash(a.inWins.runsPerMatch, 1)} loss={dash(a.inLosses.runsPerMatch, 1)} />
          <Compare label="Batting average" win={dash(a.inWins.battingAverage)} loss={dash(a.inLosses.battingAverage)} />
          <Compare label="Strike rate" win={dash(a.inWins.strikeRate)} loss={dash(a.inLosses.strikeRate)} />
          <Compare label="Wickets" win={String(a.inWins.wickets)} loss={String(a.inLosses.wickets)} />
          <Compare label="Economy" win={dash(a.inWins.economy)} loss={dash(a.inLosses.economy)} />
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 1.25, color: muted }}>
            <QueryStatsRounded sx={{ fontSize: 16 }} />
            <Typography sx={{ fontSize: 12.5, fontWeight: 600 }}>Shows how much the team leans on this player when it wins.</Typography>
          </Stack>
        </Section>
      )}
    </>
  );
};

export default AnalysisSection;
