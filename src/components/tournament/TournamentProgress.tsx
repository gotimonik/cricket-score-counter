import type React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import {
  CheckRounded,
  EmojiEventsRounded,
  GroupAddRounded,
  PlayArrowRounded,
  SportsCricketRounded,
  FiberManualRecordRounded,
  LeaderboardRounded,
} from "@mui/icons-material";
import { primaryButtonSx } from "../player/buttonStyles";

export type TournamentTabKey = "overview" | "teams" | "matches" | "standings";

export interface FixtureSummary {
  key: string;
  team1Name: string;
  team2Name: string;
}

interface Props {
  isCompleted: boolean;
  teamsCount: number;
  completedCount: number;
  totalFixtures: number;
  liveFixture?: FixtureSummary;
  nextFixture?: FixtureSummary;
  leader?: { teamName: string; points: number };
  busy?: boolean;
  onTab: (tab: TournamentTabKey) => void;
  onAddTeam: () => void;
  onStartFixture: (key: string) => void;
}

type StepState = "done" | "current" | "todo";

/**
 * Guided header for a tournament: where it is in its life (Details → Teams →
 * Matches → Results) and the one thing to do next, with a button for it.
 */
const TournamentProgress: React.FC<Props> = ({
  isCompleted,
  teamsCount,
  completedCount,
  totalFixtures,
  liveFixture,
  nextFixture,
  leader,
  busy,
  onTab,
  onAddTeam,
  onStartFixture,
}) => {
  const teamsDone = teamsCount >= 2;
  const allPlayed = totalFixtures > 0 && completedCount >= totalFixtures;
  const matchesDone = teamsDone && allPlayed;
  const resultsDone = isCompleted || matchesDone;

  const steps: Array<{ key: TournamentTabKey; label: string; detail: string; state: StepState }> = [
    { key: "overview", label: "Details", detail: "Set up", state: "done" },
    {
      key: "teams",
      label: "Teams",
      detail: teamsCount === 0 ? "None yet" : `${teamsCount} added`,
      state: teamsDone ? "done" : "current",
    },
    {
      key: "matches",
      label: "Matches",
      detail: totalFixtures ? `${completedCount} of ${totalFixtures} played` : "Waiting for teams",
      state: matchesDone ? "done" : teamsDone ? "current" : "todo",
    },
    {
      key: "standings",
      label: "Results",
      detail: resultsDone ? "Final" : "After all matches",
      state: resultsDone ? "done" : "todo",
    },
  ];

  // The single next action.
  let next: { icon: React.ReactNode; eyebrow: string; title: string; hint: string; action: string; onClick: () => void; live?: boolean };
  if (teamsCount === 0) {
    next = { icon: <GroupAddRounded />, eyebrow: "Next step", title: "Add your first team", hint: "Pick one of your saved teams or create a new one. You need at least two teams to play.", action: "Add team", onClick: onAddTeam };
  } else if (teamsCount === 1) {
    next = { icon: <GroupAddRounded />, eyebrow: "Next step", title: "Add one more team", hint: "Matches can start as soon as two teams are registered.", action: "Add team", onClick: onAddTeam };
  } else if (liveFixture) {
    next = { icon: <SportsCricketRounded />, eyebrow: "Live now", title: `${liveFixture.team1Name} vs ${liveFixture.team2Name}`, hint: "This match is in progress. Pick up scoring where you left off.", action: "Resume match", onClick: () => onStartFixture(liveFixture.key), live: true };
  } else if (nextFixture && !isCompleted) {
    next = { icon: <PlayArrowRounded />, eyebrow: "Next match", title: `${nextFixture.team1Name} vs ${nextFixture.team2Name}`, hint: `${completedCount} of ${totalFixtures} matches played. Start this one, or choose another in Matches.`, action: "Start match", onClick: () => onStartFixture(nextFixture.key) };
  } else {
    next = {
      icon: <EmojiEventsRounded />,
      eyebrow: isCompleted ? "Tournament finished" : "All matches played",
      title: leader ? `${leader.teamName} top the table` : "See the final standings",
      hint: leader ? `${leader.points} points. Check the full points table, leaders and records.` : "Points table, leaders and records are ready.",
      action: "See standings",
      onClick: () => onTab("standings"),
    };
  }

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: "1px solid rgba(12,53,88,0.16)",
        background: "#fff",
        boxShadow: "0 10px 30px rgba(8, 26, 56, 0.08)",
        overflow: "hidden",
      }}
    >
      {/* Steps */}
      <Box
        role="list"
        aria-label="Tournament progress"
        sx={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", px: { xs: 0.5, sm: 2 }, pt: 2, pb: 1.5 }}
      >
        {steps.map((step, index) => (
          <Box
            key={step.key}
            role="listitem"
            component="button"
            type="button"
            onClick={() => onTab(step.key)}
            aria-label={`${step.label}: ${step.detail}`}
            sx={{
              all: "unset",
              cursor: "pointer",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              px: 0.5,
              "&:focus-visible .step-dot": { outline: "2px solid #185a9d", outlineOffset: 2 },
              // connector line to the next step
              "&::after":
                index < steps.length - 1
                  ? {
                      content: '""',
                      position: "absolute",
                      top: 15,
                      left: "calc(50% + 20px)",
                      right: "calc(-50% + 20px)",
                      height: 3,
                      borderRadius: 2,
                      background: step.state === "done" ? "#0b7f61" : "#e3e9ef",
                    }
                  : {},
            }}
          >
            <Box
              className="step-dot"
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                fontWeight: 900,
                fontSize: 14,
                color: step.state === "todo" ? "#7a8794" : "#fff",
                background:
                  step.state === "done"
                    ? "#0b7f61"
                    : step.state === "current"
                      ? "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)"
                      : "#eef2f5",
                boxShadow: step.state === "current" ? "0 0 0 4px rgba(67,206,162,0.25)" : "none",
              }}
            >
              {step.state === "done" ? <CheckRounded sx={{ fontSize: 19 }} /> : index + 1}
            </Box>
            <Typography sx={{ mt: 0.6, fontWeight: 900, fontSize: { xs: 12.5, sm: 14 }, color: step.state === "todo" ? "#7a8794" : "#0c3558" }}>
              {step.label}
            </Typography>
            <Typography sx={{ fontSize: { xs: 10.5, sm: 12 }, fontWeight: 650, color: "#6b7785", lineHeight: 1.25 }}>{step.detail}</Typography>
          </Box>
        ))}
      </Box>

      {/* Next action */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ xs: "stretch", sm: "center" }}
        sx={{
          px: { xs: 1.75, sm: 2.25 },
          py: 1.75,
          borderTop: "1px solid #edf1f4",
          background: next.live
            ? "linear-gradient(90deg, rgba(224,70,60,0.08) 0%, rgba(255,255,255,0) 70%)"
            : "linear-gradient(90deg, rgba(67,206,162,0.12) 0%, rgba(255,255,255,0) 70%)",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              flex: "none",
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              color: "#fff",
              background: next.live ? "#e0463c" : "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
            }}
          >
            {next.icon}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{ fontSize: 11.5, fontWeight: 900, letterSpacing: 0.5, textTransform: "uppercase", color: next.live ? "#c0352c" : "#0b7f61", display: "flex", alignItems: "center", gap: 0.4 }}
            >
              {next.live && <FiberManualRecordRounded sx={{ fontSize: 10 }} />}
              {next.eyebrow}
            </Typography>
            <Typography sx={{ fontWeight: 900, color: "#0c3558", fontSize: { xs: 16, sm: 18 }, lineHeight: 1.2 }}>{next.title}</Typography>
            <Typography sx={{ color: "#526274", fontSize: 13, fontWeight: 600 }}>{next.hint}</Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ flex: "none" }}>
          {teamsCount >= 2 && !next.live && next.action !== "See standings" && (
            <Button
              startIcon={<LeaderboardRounded />}
              onClick={() => onTab("matches")}
              sx={{ textTransform: "none", fontWeight: 800, borderRadius: 1.5 }}
            >
              All matches
            </Button>
          )}
          <Button
            variant="contained"
            disabled={busy}
            onClick={next.onClick}
            sx={{ ...primaryButtonSx, px: 2.5, minHeight: 42, flex: { xs: 1, sm: "none" }, ...(next.live ? { background: "#e0463c", "&:hover": { background: "#c0352c" } } : {}) }}
          >
            {next.action}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TournamentProgress;
