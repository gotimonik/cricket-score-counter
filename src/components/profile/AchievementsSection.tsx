import React from "react";
import { Box, LinearProgress, Stack, Typography } from "@mui/material";
import {
  BoltRounded,
  EmojiEventsRounded,
  FlagRounded,
  GroupsRounded,
  PanToolRounded,
  SportsBaseballRounded,
  SportsCricketRounded,
  StarsRounded,
} from "@mui/icons-material";
import type { Achievement, AchievementCategory, AchievementTier, MilestoneProgress } from "../../utils/careerInsights";
import { EmptyNote, Section, formatDate, ink, muted } from "./ProfileUi";

const TIERS: Record<AchievementTier, { ring: string; bg: string; fg: string; label: string }> = {
  bronze: { ring: "#c98a4b", bg: "linear-gradient(135deg, #fbe7d3 0%, #f0c9a0 100%)", fg: "#6e3f12", label: "Bronze" },
  silver: { ring: "#9aa6b2", bg: "linear-gradient(135deg, #f3f6f9 0%, #d6dee6 100%)", fg: "#3c4a58", label: "Silver" },
  gold: { ring: "#e0aa1f", bg: "linear-gradient(135deg, #fff3c4 0%, #ffd66b 100%)", fg: "#6b4a00", label: "Gold" },
  platinum: { ring: "#5f7cff", bg: "linear-gradient(135deg, #e6ebff 0%, #b9c6ff 55%, #f1d5ff 100%)", fg: "#26306b", label: "Platinum" },
};

const ICONS: Record<AchievementCategory, React.ReactNode> = {
  batting: <SportsCricketRounded />,
  bowling: <SportsBaseballRounded />,
  fielding: <PanToolRounded />,
  allround: <BoltRounded />,
  matches: <FlagRounded />,
  team: <GroupsRounded />,
};

const TIER_ORDER: AchievementTier[] = ["platinum", "gold", "silver", "bronze"];

const Badge: React.FC<{ a: Achievement }> = ({ a }) => {
  const tier = TIERS[a.tier];
  return (
    <Box
      sx={{
        p: 1.25,
        borderRadius: 2.5,
        border: `1px solid ${tier.ring}`,
        background: tier.bg,
        color: tier.fg,
        position: "relative",
        minWidth: 0,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            flex: "none",
            display: "grid",
            placeItems: "center",
            background: "rgba(255,255,255,0.7)",
            border: `2px solid ${tier.ring}`,
            "& svg": { fontSize: 21 },
          }}
        >
          {ICONS[a.category]}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 900, fontSize: 14.5, lineHeight: 1.15 }}>
            {a.title}
            {a.count > 1 && <span style={{ fontWeight: 800, opacity: 0.75 }}> ×{a.count}</span>}
          </Typography>
          <Typography sx={{ fontSize: 11.5, fontWeight: 700, opacity: 0.85, lineHeight: 1.3 }}>{a.description}</Typography>
        </Box>
      </Stack>
      {a.date && (
        <Typography sx={{ fontSize: 11, fontWeight: 700, opacity: 0.75, mt: 0.75 }}>
          {a.count > 1 ? "First" : "Earned"} {formatDate(a.date)}
          {a.opponent ? ` vs ${a.opponent}` : ""}
        </Typography>
      )}
    </Box>
  );
};

const AchievementsSection: React.FC<{
  achievements: Achievement[];
  nextMilestones: MilestoneProgress[];
  /** Show only the best few (used on the overview). */
  limit?: number;
  onSeeAll?: () => void;
}> = ({ achievements, nextMilestones, limit, onSeeAll }) => {
  const sorted = React.useMemo(
    () =>
      [...achievements].sort(
        (a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier) || (b.date ?? "").localeCompare(a.date ?? ""),
      ),
    [achievements],
  );
  const shown = limit ? sorted.slice(0, limit) : sorted;
  const tierCounts = TIER_ORDER.map((t) => ({ t, n: achievements.filter((a) => a.tier === t).length })).filter((x) => x.n);

  return (
    <Section
      title="Achievements"
      icon={<EmojiEventsRounded />}
      action={
        limit && achievements.length > limit && onSeeAll ? (
          <Typography component="button" onClick={onSeeAll} sx={{ all: "unset", cursor: "pointer", fontWeight: 900, fontSize: 13.5, color: "var(--app-accent-text, #185a9d)" }}>
            See all {achievements.length}
          </Typography>
        ) : undefined
      }
    >
      {achievements.length === 0 ? (
        <EmptyNote>No achievements yet. Score a fifty, take three wickets or win a few in a row to start the collection.</EmptyNote>
      ) : (
        <>
          {!limit && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
              {tierCounts.map(({ t, n }) => (
                <Stack key={t} direction="row" spacing={0.5} alignItems="center" sx={{ px: 1, py: 0.3, borderRadius: 99, background: TIERS[t].bg, border: `1px solid ${TIERS[t].ring}`, color: TIERS[t].fg }}>
                  <StarsRounded sx={{ fontSize: 15 }} />
                  <Typography sx={{ fontWeight: 900, fontSize: 12.5 }}>
                    {n} {TIERS[t].label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))" }, gap: 1 }}>
            {shown.map((a) => (
              <Badge key={a.id} a={a} />
            ))}
          </Box>
        </>
      )}

      {!limit && nextMilestones.length > 0 && (
        <Box sx={{ mt: 2.5 }}>
          <Typography sx={{ fontWeight: 900, color: ink, mb: 1 }}>Next milestones</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "minmax(0, 1fr) minmax(0, 1fr)" }, gap: 1.5 }}>
            {nextMilestones.map((m) => (
              <Box key={m.id}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.4 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 13.5, color: ink }}>{m.title}</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: 12.5, color: muted }}>
                    {m.current} / {m.target}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, (m.current * 100) / m.target)}
                  sx={{
                    height: 8,
                    borderRadius: 99,
                    background: "#edf1f4",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 99,
                      background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                    },
                  }}
                />
                <Typography sx={{ fontSize: 11.5, color: muted, fontWeight: 600, mt: 0.3 }}>{m.target - m.current} to go</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Section>
  );
};

export default AchievementsSection;
