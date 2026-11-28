import React from "react";
import { Box, Stack, type SxProps, type Theme } from "@mui/material";

/*
 * Pavilion skeletons: placeholders shaped like the content they stand in
 * for, so a screen keeps its layout while data loads and nothing jumps when
 * it arrives. "light" sits on the pale pavilion page / white cards, "dark"
 * on board-green surfaces (Home, live cards, player card).
 *
 * The shimmer is a transform-only animation (cheap on iOS web views) and is
 * switched off for Reduce Motion.
 */

export type SkeletonTone = "light" | "dark";

const shimmerKeyframes = {
  "@keyframes pavilionShimmer": {
    "0%": { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(100%)" },
  },
} as const;

const toneColors: Record<SkeletonTone, { base: string; sheen: string }> = {
  light: { base: "rgba(15,46,37,0.08)", sheen: "rgba(255,255,255,0.65)" },
  dark: { base: "rgba(241,214,138,0.1)", sheen: "rgba(255,255,255,0.09)" },
};

const mergeSx = (base: SxProps<Theme>, sx?: SxProps<Theme>): SxProps<Theme> =>
  [base, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])] as SxProps<Theme>;

/** One shimmering block. Size it with width / height / radius. */
export const SkeletonBlock: React.FC<{
  tone?: SkeletonTone;
  width?: number | string | Record<string, number | string>;
  height?: number | string | Record<string, number | string>;
  radius?: number | string;
  sx?: SxProps<Theme>;
}> = ({ tone = "light", width = "100%", height = 14, radius = 8, sx }) => {
  const c = toneColors[tone];
  return (
    <Box
      aria-hidden
      sx={mergeSx(
        {
          position: "relative",
          overflow: "hidden",
          flex: "none",
          width,
          height,
          maxWidth: "100%",
          borderRadius: radius,
          background: c.base,
          ...shimmerKeyframes,
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, transparent 0%, ${c.sheen} 50%, transparent 100%)`,
            transform: "translateX(-100%)",
            animation: "pavilionShimmer 1.4s ease-in-out infinite",
          },
          "@media (prefers-reduced-motion: reduce)": { "&::after": { animation: "none", display: "none" } },
        },
        sx,
      )}
    />
  );
};

export const SkeletonCircle: React.FC<{ tone?: SkeletonTone; size?: number; sx?: SxProps<Theme> }> = ({ tone, size = 40, sx }) => (
  <SkeletonBlock tone={tone} width={size} height={size} radius="50%" sx={sx} />
);

/** A few lines of text; the last one is shorter, like a real paragraph. */
export const SkeletonText: React.FC<{ tone?: SkeletonTone; lines?: number; lineHeight?: number; lastWidth?: string; sx?: SxProps<Theme> }> = ({
  tone,
  lines = 2,
  lineHeight = 12,
  lastWidth = "60%",
  sx,
}) => (
  <Stack spacing={0.9} sx={sx}>
    {Array.from({ length: lines }, (_, i) => (
      <SkeletonBlock key={i} tone={tone} height={lineHeight} width={i === lines - 1 && lines > 1 ? lastWidth : "100%"} />
    ))}
  </Stack>
);

/**
 * Screen-reader friendly wrapper: announces "Loading" once and hides the
 * placeholder shapes themselves.
 */
export const SkeletonGroup: React.FC<{ label?: string; children: React.ReactNode; sx?: SxProps<Theme> }> = ({ label = "Loading", children, sx }) => (
  <Box role="status" aria-live="polite" aria-busy="true" aria-label={label} sx={sx}>
    {children}
  </Box>
);

/**
 * Fades and lifts its content in when it mounts. Wrap the real content that
 * replaces a skeleton so the swap feels smooth instead of a hard cut.
 */
export const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; sx?: SxProps<Theme> }> = ({ children, delay = 0, sx }) => (
  <Box
    sx={mergeSx(
      {
        "@keyframes pavilionFadeIn": {
          from: { opacity: 0, transform: "translateY(6px)" },
          to: { opacity: 1, transform: "none" },
        },
        // "backwards", not "both": once it finishes, the element's own styles
        // (e.g. a dimmed opacity while refreshing) apply again.
        animation: `pavilionFadeIn 280ms ease-out ${delay}ms backwards`,
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
      },
      sx,
    )}
  >
    {children}
  </Box>
);

/* ---------- Shaped skeletons for common Pavilion pieces ---------- */

/** Matches LiveMatchCard (dark scoreboard card). */
export const LiveMatchCardSkeleton: React.FC = () => (
  <Box
    sx={{
      position: "relative",
      overflow: "hidden",
      p: { xs: 1.4, sm: 1.6 },
      pl: { xs: 1.9, sm: 2.1 },
      borderRadius: 4,
      border: "1px solid rgba(217,180,90,0.22)",
      background: "linear-gradient(160deg, #1a4636 0%, #0F2E25 48%, #0A1F1A 100%)",
      boxShadow: "0 10px 28px rgba(4,16,12,0.35)",
      "&::before": {
        content: '""',
        position: "absolute",
        inset: "0 auto 0 0",
        width: 4,
        background: "rgba(241,214,138,0.25)",
      },
    }}
  >
    <Stack direction="row" alignItems="center" spacing={0.9} sx={{ mb: 1.25 }}>
      <SkeletonBlock tone="dark" width={46} height={18} radius={99} />
      <SkeletonBlock tone="dark" width="45%" height={11} />
    </Stack>
    {[0, 1].map((i) => (
      <Stack key={i} direction="row" alignItems="center" spacing={1} sx={{ py: 0.55 }}>
        <SkeletonCircle tone="dark" size={24} />
        <SkeletonBlock tone="dark" width={i ? "38%" : "48%"} height={13} />
        <Box sx={{ flex: 1 }} />
        <SkeletonBlock tone="dark" width={58} height={18} radius={6} />
      </Stack>
    ))}
    <Box sx={{ mt: 1.1, pt: 1.25, borderTop: "1px dashed rgba(241,214,138,0.2)" }}>
      <SkeletonBlock tone="dark" width="40%" height={11} />
    </Box>
  </Box>
);

/** Matches PavilionListRow (light list row with avatar and chevron). */
export const ListRowSkeleton: React.FC<{ tone?: SkeletonTone }> = ({ tone = "light" }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.4,
      p: { xs: 1.25, sm: 1.5 },
      pl: { xs: 1.6, sm: 1.9 },
      borderRadius: 3,
      position: "relative",
      overflow: "hidden",
      border: tone === "light" ? "1px solid rgba(15,46,37,0.08)" : "1px solid rgba(241,214,138,0.16)",
      background: tone === "light" ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.04)",
      "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        background: tone === "light" ? "rgba(217,180,90,0.35)" : "rgba(241,214,138,0.25)",
      },
    }}
  >
    <SkeletonCircle tone={tone} size={40} />
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <SkeletonBlock tone={tone} width="55%" height={14} />
      <SkeletonBlock tone={tone} width="35%" height={11} sx={{ mt: 0.9 }} />
    </Box>
    <SkeletonBlock tone={tone} width={14} height={14} radius={4} />
  </Box>
);

export const ListSkeleton: React.FC<{ rows?: number; tone?: SkeletonTone; label?: string }> = ({ rows = 4, tone, label }) => (
  <SkeletonGroup label={label}>
    <Stack spacing={1}>
      {Array.from({ length: rows }, (_, i) => (
        <ListRowSkeleton key={i} tone={tone} />
      ))}
    </Stack>
  </SkeletonGroup>
);

/** A light card with a title line, text and a footer button. */
export const CardSkeleton: React.FC<{ height?: number; sx?: SxProps<Theme> }> = ({ height, sx }) => (
  <Box
    sx={mergeSx(
      {
        p: { xs: 1.6, sm: 2 },
        minHeight: height,
        borderRadius: 4,
        border: "1px solid rgba(15,46,37,0.08)",
        background: "rgba(255,255,255,0.85)",
        display: "flex",
        flexDirection: "column",
        gap: 1.2,
      },
      sx,
    )}
  >
    <Stack direction="row" spacing={1.2} alignItems="center">
      <SkeletonCircle size={44} />
      <Box sx={{ flex: 1 }}>
        <SkeletonBlock width="60%" height={15} />
        <SkeletonBlock width={80} height={18} radius={99} sx={{ mt: 0.8 }} />
      </Box>
    </Stack>
    <SkeletonText lines={2} />
    <Box sx={{ flex: 1 }} />
    <SkeletonBlock height={36} radius={99} />
  </Box>
);

/** Row of stat tiles (scoreboard numbers + label). */
export const StatTilesSkeleton: React.FC<{ count?: number; tone?: SkeletonTone }> = ({ count = 4, tone = "light" }) => (
  <Box sx={{ display: "grid", gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`, gap: 1 }}>
    {Array.from({ length: count }, (_, i) => (
      <Stack key={i} alignItems="center" spacing={0.7} sx={{ py: 1.25 }}>
        <SkeletonBlock tone={tone} width="55%" height={22} radius={6} />
        <SkeletonBlock tone={tone} width="70%" height={9} />
      </Stack>
    ))}
  </Box>
);

/** Dark board-green hero placeholder (player card / tournament hero). */
export const HeroSkeleton: React.FC<{ withAvatar?: boolean; withStats?: boolean; sx?: SxProps<Theme> }> = ({ withAvatar = true, withStats = true, sx }) => (
  <Box
    sx={mergeSx(
      {
        borderRadius: { xs: 4, sm: 5 },
        p: { xs: 2, sm: 3 },
        border: "1px solid rgba(217,180,90,0.3)",
        background: "linear-gradient(150deg, #1d4b3b 0%, #0F2E25 50%, #0A1F1A 100%)",
        boxShadow: "0 18px 44px rgba(6,24,18,0.25)",
      },
      sx,
    )}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      {withAvatar && <SkeletonCircle tone="dark" size={72} />}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <SkeletonBlock tone="dark" width={90} height={10} />
        <SkeletonBlock tone="dark" width="65%" height={24} sx={{ mt: 1 }} />
        <SkeletonBlock tone="dark" width="40%" height={12} sx={{ mt: 1 }} />
      </Box>
    </Stack>
    {withStats && (
      <Box sx={{ mt: 2.25, pt: 1.5, borderTop: "1px dashed rgba(241,214,138,0.25)" }}>
        <StatTilesSkeleton tone="dark" />
      </Box>
    )}
  </Box>
);
