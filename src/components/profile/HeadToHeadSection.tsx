import React from "react";
import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { CompareArrowsRounded } from "@mui/icons-material";
import type { HeadToHeadRow } from "../../utils/careerInsights";
import { EmptyNote, Section, dash, muted, tableSx } from "./ProfileUi";

const HeadToHeadSection: React.FC<{
  opponents: HeadToHeadRow[];
  teams: HeadToHeadRow[];
  premium?: boolean;
}> = ({ opponents, teams, premium }) => {
  const [view, setView] = React.useState<"opponents" | "teams">("opponents");
  const rows = view === "opponents" ? opponents : teams;
  return (
    <Section
      title="Head-to-head"
      icon={<CompareArrowsRounded />}
      premium={premium}
      action={
        <ToggleButtonGroup
          size="small"
          exclusive
          value={view}
          onChange={(_, v) => v && setView(v)}
          sx={{ "& .MuiToggleButton-root": { textTransform: "none", fontWeight: 800, px: 1.25, py: 0.25 } }}
        >
          <ToggleButton value="opponents">Against</ToggleButton>
          <ToggleButton value="teams">Playing for</ToggleButton>
        </ToggleButtonGroup>
      }
    >
      <Typography sx={{ color: muted, fontSize: 13, fontWeight: 600, mb: 1 }}>
        {view === "opponents" ? "Record against every team they've faced." : "Record for every team they've played for."}
      </Typography>
      {rows.length === 0 ? (
        <EmptyNote>No matches yet.</EmptyNote>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <Box component="table" sx={{ ...tableSx, minWidth: 640 }}>
            <thead>
              <tr>
                <th>Team</th>
                <th>M</th>
                <th>W-L</th>
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
              {rows.map((r) => (
                <tr key={r.name}>
                  <td>
                    <b>{r.name}</b>
                  </td>
                  <td>{r.matches}</td>
                  <td>
                    {r.wins}-{r.losses}
                  </td>
                  <td>
                    <b>{r.runs}</b>
                  </td>
                  <td>{r.matches ? `${r.highest}${r.highestNotOut ? "*" : ""}` : "–"}</td>
                  <td>{dash(r.battingAverage)}</td>
                  <td>{dash(r.strikeRate)}</td>
                  <td>
                    <b>{r.wickets}</b>
                  </td>
                  <td>{r.best || "–"}</td>
                  <td>{dash(r.economy)}</td>
                </tr>
              ))}
            </tbody>
          </Box>
        </Box>
      )}
    </Section>
  );
};

export default HeadToHeadSection;
