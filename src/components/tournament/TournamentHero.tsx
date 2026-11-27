import React from "react";
import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { EmojiEventsRounded, PlaceRounded, SettingsRounded } from "@mui/icons-material";
import ShareButton from "../share/ShareButton";
import { BOARD } from "../../utils/brand";
import { resolveApiMediaUrl } from "../../utils/mediaUrl";
import { formatDate } from "../profile/ProfileUi";
import { visibilityIcon, visibilityLabel } from "../privacy/VisibilityPicker";
import type { PublicTournamentResponse } from "../../services/ExploreService";

const SCOREBOARD_FONT = 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace';

type Tournament = PublicTournamentResponse["tournament"];

interface Props {
  t: Tournament;
  teamsCount: number;
  playedCount: number;
  liveCount: number;
  /** Top of the points table, once a match has been played. */
  leaderName?: string;
  onShare?: () => void;
  onManage?: () => void;
}

const glassChipSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 0.5,
  px: 1.1,
  height: { xs: 24, sm: 26 },
  borderRadius: 99,
  fontWeight: 800,
  fontSize: { xs: "calc(11.5px * var(--app-font-scale, 1))", sm: "calc(12.5px * var(--app-font-scale, 1))" },
  color: "rgba(255,255,255,0.92)",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(241,214,138,0.22)",
  backdropFilter: "blur(4px)",
  whiteSpace: "nowrap",
  maxWidth: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  textTransform: "capitalize",
} as const;

const StatusChip: React.FC<{ status: Tournament["status"] }> = ({ status }) => {
  if (status === "active") {
    return (
      <Box sx={{ ...glassChipSx, color: "#fff", background: BOARD.seam, border: "1px solid rgba(255,140,120,0.6)", boxShadow: "0 0 14px rgba(229,57,53,0.45)", textTransform: "none" }}>
        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            bgcolor: "#fff",
            animation: "heroLivePulse 1.4s ease-in-out infinite",
            "@keyframes heroLivePulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } },
            "@media (prefers-reduced-motion: reduce)": { animation: "none" },
          }}
        />
        Live
      </Box>
    );
  }
  if (status === "completed") {
    return (
      <Box sx={{ ...glassChipSx, color: "#2a1f05", background: `linear-gradient(180deg, ${BOARD.goldLight}, ${BOARD.gold})`, border: "1px solid rgba(255,240,200,0.6)" }}>
        <EmojiEventsRounded sx={{ fontSize: 14 }} /> Completed
      </Box>
    );
  }
  return <Box sx={glassChipSx}>Upcoming</Box>;
};

const HeroStat: React.FC<{ label: string; value: React.ReactNode; live?: boolean }> = ({ label, value, live }) => (
  <Box sx={{ minWidth: 0, px: { xs: 0.5, sm: 1.5 }, textAlign: { xs: "center", sm: "left" } }}>
    <Typography
      sx={{
        fontFamily: SCOREBOARD_FONT,
        fontVariantNumeric: "tabular-nums",
        fontWeight: 800,
        lineHeight: 1.1,
        fontSize: { xs: "calc(20px * var(--app-font-scale, 1))", sm: "calc(26px * var(--app-font-scale, 1))" },
        color: live ? "#ff8a7a" : BOARD.goldLight,
        textShadow: live ? "0 0 12px rgba(255,90,70,0.5)" : "0 0 12px rgba(241,214,138,0.35)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </Typography>
    <Typography
      sx={{
        mt: 0.35,
        fontWeight: 800,
        letterSpacing: 1,
        textTransform: "uppercase",
        fontSize: { xs: "calc(9.5px * var(--app-font-scale, 1))", sm: "calc(10.5px * var(--app-font-scale, 1))" },
        color: "rgba(255,255,255,0.6)",
      }}
    >
      {label}
    </Typography>
  </Box>
);

const manageButtonSx = {
  textTransform: "none",
  fontWeight: 900,
  borderRadius: 99,
  minHeight: 38,
  px: 2,
  color: "#fff",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.35)",
  backdropFilter: "blur(4px)",
  "&:hover": { background: "rgba(255,255,255,0.14)", borderColor: BOARD.goldLight },
  "&:focus-visible": { outline: `2px solid ${BOARD.goldLight}`, outlineOffset: 3 },
} as const;

/**
 * Premium tournament header: a pavilion honours board in deep green with gold
 * trim, a floodlight glow, outfield stripes and a trophy watermark; the logo
 * in a gold-framed medallion; and a scoreboard strip of headline numbers.
 */
const TournamentHero: React.FC<Props> = ({ t, teamsCount, playedCount, liveCount, leaderName, onShare, onManage }) => {
  const canShare = t.visibility !== "private" && Boolean(onShare);
  const actions = (fullWidth: boolean) => (
    <>
      {canShare && <ShareButton fullWidth={fullWidth} onClick={onShare} />}
      {t.isOrganizer && onManage && (
        <Button fullWidth={fullWidth} startIcon={<SettingsRounded />} onClick={onManage} sx={manageButtonSx}>
          Manage
        </Button>
      )}
    </>
  );
  const hasActions = canShare || (t.isOrganizer && Boolean(onManage));

  return (
    <Box
      component="header"
      sx={{
        position: "relative",
        isolation: "isolate",
        overflow: "hidden",
        color: "#fff",
        borderRadius: { xs: 4, sm: 5 },
        p: { xs: 2, sm: 3 },
        border: "1px solid rgba(217,180,90,0.38)",
        background: [
          // Gold trim along the top edge.
          "linear-gradient(90deg, rgba(217,180,90,0) 0%, rgba(241,214,138,0.95) 50%, rgba(217,180,90,0) 100%) top center / 80% 2px no-repeat",
          // Floodlight glow, top right.
          "radial-gradient(60% 120% at 100% 0%, rgba(241,214,138,0.22) 0%, rgba(241,214,138,0) 60%)",
          // Theme accent glow, bottom left.
          "radial-gradient(70% 120% at 0% 100%, color-mix(in srgb, var(--app-accent-start, #43cea2) 30%, transparent 70%) 0%, transparent 60%)",
          // Mown outfield stripes.
          "repeating-linear-gradient(100deg, rgba(255,255,255,0.035) 0 26px, rgba(255,255,255,0) 26px 52px)",
          `linear-gradient(150deg, #1d4b3b 0%, ${BOARD.green} 50%, ${BOARD.greenDeep} 100%)`,
        ].join(", "),
        boxShadow:
          "0 18px 44px rgba(6,24,18,0.35), 0 2px 6px rgba(6,24,18,0.2), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.03)",
      }}
    >
      {/* Trophy watermark. */}
      <EmojiEventsRounded
        aria-hidden
        sx={{
          position: "absolute",
          zIndex: -1,
          right: { xs: -36, sm: 24 },
          bottom: { xs: -28, sm: -46 },
          fontSize: { xs: 170, sm: 240 },
          color: BOARD.goldLight,
          opacity: 0.07,
          transform: "rotate(-12deg)",
          pointerEvents: "none",
        }}
      />

      <Stack direction="row" spacing={{ xs: 1.5, sm: 2.25 }} alignItems="center">
        {/* Gold-framed medallion for the logo. */}
        <Box
          sx={{
            flex: "none",
            p: "3px",
            borderRadius: { xs: 3, sm: 3.5 },
            background: `linear-gradient(145deg, #FBEBBE 0%, ${BOARD.gold} 45%, #8a6a22 100%)`,
            boxShadow: "0 6px 18px rgba(0,0,0,0.35), 0 0 22px rgba(217,180,90,0.25)",
          }}
        >
          <Avatar
            src={resolveApiMediaUrl(t.logoUrl) || undefined}
            variant="rounded"
            sx={{
              width: { xs: 58, sm: 84 },
              height: { xs: 58, sm: 84 },
              borderRadius: { xs: 2.5, sm: 3 },
              background: `radial-gradient(circle at 30% 25%, #2a5c4a 0%, ${BOARD.green} 60%, ${BOARD.greenDeep} 100%)`,
            }}
          >
            <EmojiEventsRounded sx={{ fontSize: { xs: 30, sm: 44 }, color: BOARD.goldLight, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }} />
          </Avatar>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 900,
              letterSpacing: 1.6,
              textTransform: "uppercase",
              fontSize: { xs: "calc(10px * var(--app-font-scale, 1))", sm: "calc(11.5px * var(--app-font-scale, 1))" },
              color: BOARD.goldLight,
              opacity: 0.9,
            }}
          >
            {t.format === "knockout" ? "Knockout" : "League"} · {t.oversPerMatch} overs
          </Typography>
          <Typography
            component="h1"
            sx={{
              mt: 0.25,
              fontSize: { xs: "calc(24px * var(--app-font-scale, 1))", sm: "calc(34px * var(--app-font-scale, 1))" },
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: -0.3,
              wordBreak: "break-word",
              textShadow: "0 2px 12px rgba(0,0,0,0.3)",
            }}
          >
            {t.name}
          </Typography>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.6, minWidth: 0, color: "rgba(255,255,255,0.82)" }}>
            <PlaceRounded sx={{ fontSize: 16, flex: "none", color: BOARD.gold }} />
            <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 15 }, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {t.location} · {formatDate(t.startDate, false)} – {formatDate(t.endDate)}
            </Typography>
          </Stack>
        </Box>

        {hasActions && (
          <Stack spacing={1} sx={{ flex: "none", display: { xs: "none", sm: "flex" }, alignItems: "stretch" }}>
            {actions(false)}
          </Stack>
        )}
      </Stack>

      <Stack direction="row" columnGap={0.75} rowGap={0.75} flexWrap="wrap" useFlexGap sx={{ mt: { xs: 1.75, sm: 2 } }}>
        <StatusChip status={t.status} />
        <Box sx={glassChipSx}>{t.ballType} ball</Box>
        {t.organizerName && <Box sx={{ ...glassChipSx, textTransform: "none" }}>by {t.organizerName}</Box>}
        {t.visibility !== "public" && (
          <Box sx={{ ...glassChipSx, background: "rgba(0,0,0,0.25)", "& svg": { fontSize: 14 } }}>
            {visibilityIcon(t.visibility, 14)} {visibilityLabel(t.visibility)}
          </Box>
        )}
      </Stack>

      {/* Scoreboard strip. */}
      <Box
        sx={{
          mt: { xs: 1.75, sm: 2.25 },
          pt: { xs: 1.5, sm: 1.75 },
          borderTop: "1px dashed rgba(241,214,138,0.3)",
          display: "grid",
          gridTemplateColumns: leaderName ? { xs: "repeat(3, minmax(0, 1fr))", sm: "auto auto auto minmax(0, 1fr)" } : "repeat(3, minmax(0, 1fr))",
          rowGap: 1.25,
          "& > *:not(:first-of-type)": { borderLeft: { sm: "1px solid rgba(241,214,138,0.18)" } },
        }}
      >
        <HeroStat label="Teams" value={teamsCount} />
        <HeroStat label="Played" value={playedCount} />
        <HeroStat label="Live now" value={liveCount} live={liveCount > 0} />
        {leaderName && (
          <Box sx={{ gridColumn: { xs: "1 / -1", sm: "auto" }, minWidth: 0 }}>
            <HeroStat label="Top of the table" value={<Box component="span" sx={{ fontFamily: "inherit", fontSize: "0.8em" }}>{leaderName}</Box>} />
          </Box>
        )}
      </Box>

      {hasActions && (
        <Stack direction="row" spacing={1} sx={{ mt: 1.75, display: { xs: "flex", sm: "none" } }}>
          {actions(true)}
        </Stack>
      )}
    </Box>
  );
};

export default TournamentHero;
