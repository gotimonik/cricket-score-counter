import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import {
  HandshakeRounded,
  LocalFireDepartmentRounded,
  SportsBaseballRounded,
  SportsCricketRounded,
  TimelineRounded,
} from "@mui/icons-material";
import type { CareerHighlights } from "../../utils/careerInsights";
import { formatOvers } from "../../utils/matchStats";
import { EmptyNote, Section, dash, ink, matchContext, muted, tableSx } from "./ProfileUi";
import { statTileBackground } from "../../utils/cardSurface";

const RankRow: React.FC<{ rank: number; main: React.ReactNode; sub: string; side?: React.ReactNode }> = ({ rank, main, sub, side }) => (
  <Stack direction="row" spacing={1.25} alignItems="center" sx={{ py: 0.9 }}>
    <Box
      sx={{
        width: 26,
        height: 26,
        borderRadius: "50%",
        flex: "none",
        display: "grid",
        placeItems: "center",
        fontWeight: 900,
        fontSize: 12.5,
        color: rank === 1 ? "#6b4a00" : "#526274",
        background: rank === 1 ? "linear-gradient(135deg, #fff3c4 0%, #ffd66b 100%)" : "#edf1f4",
      }}
    >
      {rank}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontWeight: 900, color: ink, fontSize: 15.5, lineHeight: 1.2 }}>{main}</Typography>
      <Typography sx={{ color: muted, fontSize: 12.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub}</Typography>
    </Box>
    {side}
  </Stack>
);

const Column: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <Box sx={{ minWidth: 0 }}>
    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.5, color: "#526274" }}>
      {icon}
      <Typography sx={{ fontWeight: 900, fontSize: 12.5, textTransform: "uppercase", letterSpacing: 0.4 }}>{title}</Typography>
    </Stack>
    <Stack divider={<Box sx={{ borderTop: "1px solid #edf1f4" }} />}>{children}</Stack>
  </Box>
);

const StreakTile: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <Box sx={{ p: 1.2, borderRadius: 2, background: statTileBackground, border: "1px solid rgba(12,53,88,0.08)", textAlign: "center" }}>
    <Typography sx={{ fontWeight: 900, fontSize: 24, color: ink, lineHeight: 1.1 }}>{value}</Typography>
    <Typography sx={{ fontWeight: 800, fontSize: 11.5, color: muted, textTransform: "uppercase", letterSpacing: 0.3 }}>{label}</Typography>
  </Box>
);

const HighlightsSection: React.FC<{ h: CareerHighlights; premium?: boolean; showSeasons?: boolean }> = ({ h, premium, showSeasons = true }) => {
  const nothing = !h.bestInnings.length && !h.bestBowling.length;
  return (
    <>
      <Section title="Career highlights" icon={<LocalFireDepartmentRounded />} premium={premium}>
        {nothing ? (
          <EmptyNote>Highlights appear after the first completed match.</EmptyNote>
        ) : (
          <>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" }, gap: { xs: 2, md: 3 } }}>
              <Column title="Best innings" icon={<SportsCricketRounded sx={{ fontSize: 17 }} />}>
                {h.bestInnings.length ? (
                  h.bestInnings.map((b, i) => (
                    <RankRow
                      key={`${b.matchId}-${i}`}
                      rank={i + 1}
                      main={
                        <>
                          {b.runs}
                          {b.notOut ? "*" : ""} <span style={{ fontWeight: 700, color: muted, fontSize: 13 }}>({b.balls})</span>
                        </>
                      }
                      sub={matchContext(b)}
                    />
                  ))
                ) : (
                  <EmptyNote>No innings yet.</EmptyNote>
                )}
              </Column>
              <Column title="Best bowling" icon={<SportsBaseballRounded sx={{ fontSize: 17 }} />}>
                {h.bestBowling.length ? (
                  h.bestBowling.map((b, i) => (
                    <RankRow
                      key={`${b.matchId}-${i}`}
                      rank={i + 1}
                      main={
                        <>
                          {b.wickets}/{b.runs} <span style={{ fontWeight: 700, color: muted, fontSize: 13 }}>({formatOvers(b.balls)} ov)</span>
                        </>
                      }
                      sub={matchContext(b)}
                    />
                  ))
                ) : (
                  <EmptyNote>Hasn't bowled yet.</EmptyNote>
                )}
              </Column>
              <Column title="Top partnerships" icon={<HandshakeRounded sx={{ fontSize: 17 }} />}>
                {h.topPartnerships.length ? (
                  h.topPartnerships.map((p, i) => (
                    <RankRow
                      key={`${p.matchId}-${p.wicket}-${i}`}
                      rank={i + 1}
                      main={
                        <>
                          {p.runs}
                          {p.unbroken ? "*" : ""} <span style={{ fontWeight: 700, color: muted, fontSize: 13 }}>with {p.partner}</span>
                        </>
                      }
                      sub={`Own ${p.ownRuns} · ${p.balls} balls · ${matchContext(p)}`}
                    />
                  ))
                ) : (
                  <EmptyNote>No partnerships yet.</EmptyNote>
                )}
              </Column>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))" }, gap: 1, mt: 2 }}>
              <StreakTile value={h.streaks.longestWinStreak} label="Longest win streak" />
              <StreakTile value={h.streaks.currentWinStreak} label="Current win streak" />
              <StreakTile value={h.streaks.longestDoubleFigureStreak} label="Innings in a row 10+" />
              <StreakTile value={h.streaks.longestWicketStreak} label="Spells in a row with a wicket" />
            </Box>
          </>
        )}
      </Section>

      {showSeasons && h.seasons.length > 0 && (
        <Section title="Season by season" icon={<TimelineRounded />} premium={premium}>
          <Box sx={{ overflowX: "auto" }}>
            <Box component="table" sx={tableSx}>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>M</th>
                  <th>W</th>
                  <th>Runs</th>
                  <th>HS</th>
                  <th>Avg</th>
                  <th>SR</th>
                  <th>Wkts</th>
                  <th>Best</th>
                  <th>Econ</th>
                </tr>
              </thead>
              <tbody>
                {h.seasons.map(({ year, stats: s }) => (
                  <tr key={year}>
                    <td>
                      <b>{year}</b>
                    </td>
                    <td>{s.matches}</td>
                    <td>{s.wins}</td>
                    <td>
                      <b>{s.batting.runs}</b>
                    </td>
                    <td>{s.batting.innings ? `${s.batting.highest}${s.batting.highestNotOut ? "*" : ""}` : "–"}</td>
                    <td>{dash(s.batting.average)}</td>
                    <td>{dash(s.batting.strikeRate)}</td>
                    <td>
                      <b>{s.bowling.wickets}</b>
                    </td>
                    <td>{s.bowling.innings ? `${s.bowling.bestWickets}/${s.bowling.bestRuns}` : "–"}</td>
                    <td>{dash(s.bowling.economy)}</td>
                  </tr>
                ))}
              </tbody>
            </Box>
          </Box>
        </Section>
      )}
    </>
  );
};

export default HighlightsSection;
