import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import { EmojiEventsRounded, WorkspacePremiumRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import AwardMedal, { TIER_META } from "../awards/AwardMedal";
import { ACHIEVEMENT_CATALOG, type AchievementTier } from "../../utils/careerInsights";
import { startAs } from "../../utils/playerOnboarding";
import { BOARD } from "../../utils/brand";
import { goldButtonSx, pavilionSectionSx } from "../ui/Pavilion";

const SHOWCASE_IDS = ["century", "five-fer", "hat-trick", "blitz", "player-of-the-match", "all-round-show", "first-fifty", "safe-hands"];
const TIERS: AchievementTier[] = ["bronze", "silver", "gold", "platinum"];
const SERIF = 'Georgia, "Times New Roman", Times, serif';

/** A small sample of the certificate players get for each award. */
const CertificatePreview: React.FC = () => {
  const { t } = useTranslation();
  const m = TIER_META.platinum;
  return (
    <Box
      aria-hidden
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 400,
        mx: "auto",
        aspectRatio: "1.414 / 1",
        transform: { md: "rotate(-2.5deg)" },
        borderRadius: 1.5,
        p: "10px",
        background: BOARD.green,
        boxShadow: "0 24px 48px rgba(6,24,18,0.3), 0 4px 10px rgba(6,24,18,0.2)",
      }}
    >
      <Box
        sx={{
          height: "100%",
          border: `2px solid ${BOARD.gold}`,
          outline: "1px solid rgba(154,117,32,0.5)",
          outlineOffset: "-7px",
          background: "radial-gradient(circle at 50% 45%, #fffdf6 0%, #f8f0dc 70%, #eadcb8 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
          color: BOARD.green,
          position: "relative",
        }}
      >
        <Typography sx={{ fontSize: { xs: 8, sm: 9 }, fontWeight: 800, letterSpacing: 2.5, color: "#9a7520" }}>CRICKET SCORE COUNTER</Typography>
        <Typography sx={{ fontFamily: SERIF, fontWeight: 700, fontSize: { xs: 17, sm: 20 }, lineHeight: 1.15, mt: 0.4 }}>
          {t("Certificate of Achievement")}
        </Typography>
        <Box sx={{ width: 120, height: 2, my: 0.6, background: `linear-gradient(90deg, transparent, ${BOARD.gold}, transparent)` }} />
        <Typography sx={{ fontFamily: SERIF, fontStyle: "italic", fontSize: { xs: 10, sm: 11 }, color: "#5d6b64" }}>
          {t("proudly presented to")}
        </Typography>
        <Typography sx={{ fontFamily: SERIF, fontWeight: 700, fontSize: { xs: 22, sm: 26 }, lineHeight: 1.1, borderBottom: `2px solid ${BOARD.gold}`, px: 2, mt: 0.2 }}>
          {t("Your Name")}
        </Typography>
        <Typography sx={{ fontFamily: SERIF, fontWeight: 700, fontSize: { xs: 15, sm: 17 }, color: m.dark, mt: 0.8 }}>{t("Century")}</Typography>
        <Typography sx={{ fontSize: { xs: 9.5, sm: 10.5 }, fontWeight: 600, color: "#2b3a34" }}>{t("Scored 100 or more in an innings")}</Typography>
        <Box sx={{ position: "absolute", right: { xs: 10, sm: 14 }, bottom: { xs: 6, sm: 8 } }}>
          <AwardMedal tier="platinum" category="batting" size={40} />
        </Box>
      </Box>
    </Box>
  );
};

/**
 * Home "trophy cabinet": the real medals players can win (from the same
 * catalog the profile uses), the four tiers and a sample certificate, to
 * make creating a player card feel worth it.
 */
const HomeAwardsShowcase: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const medals = SHOWCASE_IDS.map((id) => ACHIEVEMENT_CATALOG.find((a) => a.id === id)).filter(Boolean) as typeof ACHIEVEMENT_CATALOG[number][];

  return (
    <Box component="section" aria-label={t("Awards and certificates")} sx={{ ...pavilionSectionSx, width: "100%", maxWidth: 1080, mx: "auto", mb: 2, textAlign: "left", boxSizing: "border-box" }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 2.5, md: 4 }} alignItems={{ md: "center" }}>
        <Box sx={{ flex: 1.2, minWidth: 0 }}>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.5 }}>
            <EmojiEventsRounded sx={{ fontSize: 18, color: BOARD.gold }} />
            <Typography sx={{ fontWeight: 900, letterSpacing: 1.6, textTransform: "uppercase", fontSize: "calc(11px * var(--app-font-scale, 1))", color: "#9a7520" }}>
              {t("Trophy cabinet")}
            </Typography>
          </Stack>
          <Typography component="h2" sx={{ fontWeight: 900, color: BOARD.green, fontSize: { xs: "calc(22px * var(--app-font-scale, 1))", sm: "calc(28px * var(--app-font-scale, 1))" }, lineHeight: 1.15, letterSpacing: -0.3 }}>
            {t("Win medals and certificates every time you play")}
          </Typography>
          <Typography sx={{ mt: 0.75, color: "#55665f", fontWeight: 600, fontSize: { xs: 14, sm: 15.5 }, lineHeight: 1.45 }}>
            {t("Hit a fifty, take a hat-trick or win five in a row: the scorecard spots it and the award lands on your player card, with a certificate to share.")}
          </Typography>

          <Box
            sx={{
              mt: 2,
              display: "grid",
              gridTemplateColumns: { xs: "repeat(4, minmax(0, 1fr))", sm: "repeat(8, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
              rowGap: 1.5,
              columnGap: 1,
            }}
          >
            {medals.map((a) => (
              <Box key={a.id} sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", minWidth: 0 }}>
                <AwardMedal tier={a.tier} category={a.category} size={48} />
                <Typography sx={{ mt: 0.6, fontWeight: 900, fontSize: 11.5, lineHeight: 1.2, color: BOARD.green }}>{a.title}</Typography>
                <Typography sx={{ fontWeight: 800, fontSize: 9.5, letterSpacing: 0.6, textTransform: "uppercase", color: TIER_META[a.tier].dark }}>
                  {TIER_META[a.tier].label}
                </Typography>
              </Box>
            ))}
          </Box>

          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 1.75 }}>
            {TIERS.map((tier) => (
              <Box
                key={tier}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  px: 1,
                  height: 22,
                  borderRadius: 99,
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: 0.5,
                  color: TIER_META[tier].ink,
                  background: `linear-gradient(135deg, ${TIER_META[tier].light} 0%, ${TIER_META[tier].mid} 100%)`,
                }}
              >
                {"★".repeat(TIER_META[tier].stars)} {TIER_META[tier].label}
              </Box>
            ))}
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#55665f", alignSelf: "center" }}>
              {t("+ milestones: 500 runs, 50 wickets, 10-match win streaks…")}
            </Typography>
          </Stack>

          <Button
            startIcon={<WorkspacePremiumRounded />}
            onClick={() => startAs(navigate, "player")}
            sx={{ ...goldButtonSx, mt: 2.25, width: { xs: "100%", sm: "auto" } }}
            data-ga-click="home_awards_start"
          >
            {t("Start my trophy cabinet")}
          </Button>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, py: { md: 2 } }}>
          <CertificatePreview />
        </Box>
      </Stack>
    </Box>
  );
};

export default HomeAwardsShowcase;
