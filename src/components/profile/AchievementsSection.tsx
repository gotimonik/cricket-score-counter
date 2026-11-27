import React from "react";
import { Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import { EmojiEventsRounded, StarsRounded, WorkspacePremiumRounded } from "@mui/icons-material";
import type { Achievement, AchievementTier, MilestoneProgress } from "../../utils/careerInsights";
import { EmptyNote, Section, formatDate, ink, muted } from "./ProfileUi";
import AwardMedal, { TIER_META } from "../awards/AwardMedal";
import ShareSheet from "../share/ShareSheet";
import { drawCertificate } from "../../utils/certificateCard";

const TIER_ORDER: AchievementTier[] = ["platinum", "gold", "silver", "bronze"];

const tierChipSx = (t: AchievementTier) => {
  const m = TIER_META[t];
  return {
    color: m.ink,
    background: `linear-gradient(135deg, ${m.light} 0%, ${m.mid} 100%)`,
    border: `1px solid ${m.dark}55`,
  };
};

const matchLineOf = (a: Achievement) =>
  [a.opponent ? `vs ${a.opponent}` : "", a.tournamentName ?? ""].filter(Boolean).join(" · ");

const Badge: React.FC<{ a: Achievement; onCertificate?: () => void }> = ({ a, onCertificate }) => {
  const m = TIER_META[a.tier];
  return (
    <Box
      sx={{
        p: 1.25,
        borderRadius: 3,
        position: "relative",
        minWidth: 0,
        display: "flex",
        gap: 1.25,
        alignItems: "center",
        border: `1px solid ${m.mid}88`,
        background: `radial-gradient(120% 120% at 0% 0%, ${m.light} 0%, transparent 60%), linear-gradient(135deg, #ffffff 0%, ${m.light}66 100%)`,
        boxShadow: "0 4px 14px rgba(6,24,18,0.06)",
      }}
    >
      <AwardMedal tier={a.tier} category={a.category} size={52} />
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Stack direction="row" spacing={0.6} alignItems="center" sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 900, fontSize: 15, lineHeight: 1.15, color: ink, minWidth: 0 }}>
            {a.title}
            {a.count > 1 && <span style={{ fontWeight: 800, color: m.dark }}> ×{a.count}</span>}
          </Typography>
        </Stack>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: muted, lineHeight: 1.3, mt: 0.2 }}>{a.description}</Typography>
        <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: 0.6 }}>
          <Box component="span" sx={{ ...tierChipSx(a.tier), px: 0.8, height: 20, display: "inline-flex", alignItems: "center", borderRadius: 99, fontSize: 10.5, fontWeight: 900, letterSpacing: 0.6, textTransform: "uppercase" }}>
            {m.label}
          </Box>
          {a.date && (
            <Typography component="span" sx={{ fontSize: 11, fontWeight: 700, color: muted }}>
              {a.count > 1 ? "First" : "Earned"} {formatDate(a.date)}
              {a.opponent ? ` vs ${a.opponent}` : ""}
            </Typography>
          )}
        </Stack>
      </Box>
      {onCertificate && (
        <Button
          size="small"
          onClick={onCertificate}
          startIcon={<WorkspacePremiumRounded />}
          aria-label={`Certificate for ${a.title}`}
          data-ga-click="achievement_certificate"
          sx={{
            flex: "none",
            alignSelf: "center",
            borderRadius: 99,
            px: 1.25,
            fontWeight: 900,
            fontSize: 12.5,
            color: "#0F2E25 !important",
            border: "1px solid rgba(217,180,90,0.7)",
            background: "linear-gradient(180deg, #fff6d8 0%, #f6e3a6 100%)",
            "&:hover": { background: "linear-gradient(180deg, #fff2c8 0%, #f1d68a 100%)" },
            "& .MuiButton-startIcon": { mr: 0.4 },
            "& .MuiSvgIcon-root": { color: "#9a7520" },
          }}
        >
          Certificate
        </Button>
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
  /** When set, each award gets a shareable certificate made out to this name. */
  playerName?: string;
  /** Profile link printed on the certificate and shared with it. */
  profileUrl?: string;
}> = ({ achievements, nextMilestones, limit, onSeeAll, playerName, profileUrl }) => {
  const [certFor, setCertFor] = React.useState<Achievement | null>(null);
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
        <EmptyNote>No awards yet. Score a fifty, take three wickets or win a few in a row to win your first medal and certificate.</EmptyNote>
      ) : (
        <>
          {!limit && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
              {tierCounts.map(({ t, n }) => (
                <Stack key={t} direction="row" spacing={0.5} alignItems="center" sx={{ px: 1, py: 0.3, borderRadius: 99, ...tierChipSx(t) }}>
                  <StarsRounded sx={{ fontSize: 15 }} />
                  <Typography sx={{ fontWeight: 900, fontSize: 12.5 }}>
                    {n} {TIER_META[t].label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))" }, gap: 1 }}>
            {shown.map((a) => (
              <Badge key={a.id} a={a} onCertificate={playerName && profileUrl ? () => setCertFor(a) : undefined} />
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
      {playerName && profileUrl && certFor && (
        <ShareSheet
          open={Boolean(certFor)}
          onClose={() => setCertFor(null)}
          title={`${certFor.title} certificate`}
          url={profileUrl}
          text={`${playerName} earned the ${certFor.title} award: ${certFor.description}.`}
          fileName={`${certFor.id}-certificate.png`}
          imageAspect={{ w: 1600, h: 1131 }}
          makeImage={() =>
            drawCertificate({
              playerName,
              awardTitle: certFor.title,
              awardDescription: certFor.description,
              tier: certFor.tier,
              matchLine: matchLineOf(certFor),
              date: certFor.date,
              url: profileUrl,
              count: certFor.count,
            })
          }
        />
      )}
    </Section>
  );
};

export default AchievementsSection;
