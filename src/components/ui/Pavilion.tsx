import React from "react";
import { Box, ButtonBase, Stack, Typography, type SxProps, type Theme } from "@mui/material";
import { ChevronRightRounded } from "@mui/icons-material";
import { BOARD } from "../../utils/brand";
import { statCardBackground } from "../../utils/cardSurface";

/*
 * "Pavilion" design kit: the shared look for app screens. A dark board-green
 * hero with gold trim, light textured section cards, gold primary buttons,
 * glass chips and premium list rows. Use these instead of one-off styles so
 * every screen feels like the same app.
 */

const SCOREBOARD_FONT = 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace';

/** Page background behind pavilion cards. */
export const pavilionPageSx = {
  flex: "1 0 auto",
  background: [
    "radial-gradient(90% 40% at 50% 0%, color-mix(in srgb, var(--app-accent-start, #43cea2) 10%, transparent 90%) 0%, transparent 70%)",
    "linear-gradient(180deg, #f3f7f5 0%, #eef3f1 100%)",
  ].join(", "),
} as const;

export const darkBoardBackground = [
  "linear-gradient(90deg, rgba(217,180,90,0) 0%, rgba(241,214,138,0.95) 50%, rgba(217,180,90,0) 100%) top center / 80% 2px no-repeat",
  "radial-gradient(60% 120% at 100% 0%, rgba(241,214,138,0.22) 0%, rgba(241,214,138,0) 60%)",
  "radial-gradient(70% 120% at 0% 100%, color-mix(in srgb, var(--app-accent-start, #43cea2) 30%, transparent 70%) 0%, transparent 60%)",
  "repeating-linear-gradient(100deg, rgba(255,255,255,0.035) 0 26px, rgba(255,255,255,0) 26px 52px)",
  `linear-gradient(150deg, #1d4b3b 0%, ${BOARD.green} 50%, ${BOARD.greenDeep} 100%)`,
].join(", ");

/** Light textured card for page sections. */
export const pavilionSectionSx = {
  position: "relative",
  p: { xs: 2, sm: 2.75 },
  borderRadius: { xs: 4, sm: 5 },
  border: "1px solid rgba(15,46,37,0.1)",
  background: statCardBackground,
  boxShadow: "0 1px 2px rgba(6,24,18,0.05), 0 12px 32px rgba(6,24,18,0.08)",
} as const;

/** Gold primary call-to-action (matches "Create Game" on Home). */
export const goldButtonSx = {
  borderRadius: 99,
  minHeight: 46,
  px: 2.75,
  fontWeight: 900,
  fontSize: "calc(15px * var(--app-font-scale, 1))",
  textTransform: "none",
  color: "#2a1f05 !important",
  border: "1px solid rgba(255,240,200,0.7)",
  background: `linear-gradient(180deg, #F8E4A6 0%, ${BOARD.goldLight} 30%, ${BOARD.gold} 100%)`,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -2px 0 rgba(120,85,10,0.25), 0 8px 20px rgba(217,180,90,0.35)",
  transition: "transform 160ms ease, box-shadow 160ms ease",
  "&:hover": {
    background: `linear-gradient(180deg, #FCEBB8 0%, #F5DD98 35%, ${BOARD.gold} 100%)`,
    transform: "translateY(-1px)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -2px 0 rgba(120,85,10,0.25), 0 12px 26px rgba(217,180,90,0.45)",
  },
  "&:active": { transform: "translateY(0)" },
  "&.Mui-disabled": { color: "rgba(42,31,5,0.45) !important", filter: "grayscale(0.5)", opacity: 0.7 },
  "& .MuiButton-startIcon, & .MuiButton-endIcon, & .MuiSvgIcon-root": { color: "currentColor !important" },
  "&:focus-visible": { outline: `2px solid ${BOARD.gold}`, outlineOffset: 3 },
} as const;

/** Dark board-green button for secondary actions on light cards. */
export const boardButtonSx = {
  borderRadius: 99,
  minHeight: 44,
  px: 2.5,
  fontWeight: 900,
  textTransform: "none",
  color: "#fff !important",
  border: "1px solid rgba(217,180,90,0.35)",
  background: `linear-gradient(150deg, #1d4b3b 0%, ${BOARD.green} 60%, ${BOARD.greenDeep} 100%)`,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 6px 16px rgba(6,24,18,0.25)",
  "&:hover": { background: `linear-gradient(150deg, #245a47 0%, #13392d 60%, ${BOARD.greenDeep} 100%)`, borderColor: BOARD.goldLight },
  "&.Mui-disabled": { color: "rgba(255,255,255,0.6) !important", opacity: 0.6 },
  "& .MuiButton-startIcon, & .MuiButton-endIcon, & .MuiSvgIcon-root": { color: `${BOARD.goldLight} !important` },
} as const;

/** Quiet outlined pill for tertiary actions on light cards. */
export const ghostButtonSx = {
  borderRadius: 99,
  minHeight: 42,
  px: 2.25,
  fontWeight: 850,
  textTransform: "none",
  color: `${BOARD.green} !important`,
  border: "1px solid rgba(15,46,37,0.22)",
  background: "rgba(255,255,255,0.7)",
  "&:hover": { background: "#fff", borderColor: BOARD.gold },
  "& .MuiButton-startIcon, & .MuiSvgIcon-root": { color: "currentColor !important" },
} as const;

/** Glass pill for use on the dark hero. */
export const GlassChip: React.FC<{ icon?: React.ReactNode; children: React.ReactNode; tone?: "glass" | "gold" | "live" }> = ({
  icon,
  children,
  tone = "glass",
}) => (
  <Box
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 0.6,
      px: 1.2,
      height: { xs: 26, sm: 28 },
      borderRadius: 99,
      fontWeight: 800,
      fontSize: { xs: "calc(12px * var(--app-font-scale, 1))", sm: "calc(13px * var(--app-font-scale, 1))" },
      whiteSpace: "nowrap",
      maxWidth: "100%",
      "& svg": { fontSize: 16 },
      ...(tone === "gold"
        ? { color: "#2a1f05", background: `linear-gradient(180deg, ${BOARD.goldLight}, ${BOARD.gold})`, border: "1px solid rgba(255,240,200,0.6)" }
        : tone === "live"
          ? { color: "#fff", background: BOARD.seam, border: "1px solid rgba(255,140,120,0.6)", boxShadow: "0 0 14px rgba(229,57,53,0.45)" }
          : {
              color: "rgba(255,255,255,0.92)",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(241,214,138,0.24)",
              backdropFilter: "blur(4px)",
              "& svg": { fontSize: 16, color: BOARD.goldLight },
            }),
    }}
  >
    {icon}
    {children}
  </Box>
);

export interface HeroStatItem {
  label: string;
  value: React.ReactNode;
  live?: boolean;
}

/**
 * Dark board-green page hero with gold trim, floodlight glow, outfield
 * stripes and a faded watermark icon. Optional chips, scoreboard stats and
 * actions.
 */
export const PavilionHero: React.FC<{
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  watermark?: React.ReactNode;
  chips?: React.ReactNode;
  stats?: HeroStatItem[];
  actions?: React.ReactNode;
  sx?: SxProps<Theme>;
}> = ({ eyebrow, title, subtitle, watermark, chips, stats, actions, sx }) => (
  <Box
    component="section"
    sx={[
      {
        position: "relative",
        isolation: "isolate",
        overflow: "hidden",
        color: "#fff",
        borderRadius: { xs: 4, sm: 5 },
        p: { xs: 2, sm: 3 },
        border: "1px solid rgba(217,180,90,0.38)",
        background: darkBoardBackground,
        boxShadow: "0 18px 44px rgba(6,24,18,0.3), 0 2px 6px rgba(6,24,18,0.18), inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
    ]}
  >
    {watermark && (
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          zIndex: -1,
          right: { xs: -30, sm: 20 },
          bottom: { xs: -30, sm: -44 },
          color: BOARD.goldLight,
          opacity: 0.07,
          transform: "rotate(-12deg)",
          pointerEvents: "none",
          "& svg": { fontSize: { xs: 160, sm: 230 } },
        }}
      >
        {watermark}
      </Box>
    )}
    <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 1.75, md: 3 }} alignItems={{ md: "center" }} justifyContent="space-between">
      <Box sx={{ minWidth: 0 }}>
        {eyebrow && (
          <Typography
            sx={{
              fontWeight: 900,
              letterSpacing: 1.6,
              textTransform: "uppercase",
              fontSize: { xs: "calc(10.5px * var(--app-font-scale, 1))", sm: "calc(11.5px * var(--app-font-scale, 1))" },
              color: BOARD.goldLight,
              mb: 0.5,
            }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: "calc(22px * var(--app-font-scale, 1))", sm: "calc(30px * var(--app-font-scale, 1))" },
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: -0.3,
            textShadow: "0 2px 12px rgba(0,0,0,0.3)",
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ mt: 0.75, color: "rgba(255,255,255,0.78)", fontWeight: 600, fontSize: { xs: 14, sm: 15.5 }, lineHeight: 1.45, maxWidth: 620 }}>
            {subtitle}
          </Typography>
        )}
        {chips && (
          <Stack direction="row" columnGap={0.75} rowGap={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
            {chips}
          </Stack>
        )}
      </Box>
      {actions && (
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ flex: "none", "& > *": { flex: { xs: "1 1 auto", md: "0 0 auto" } } }}>
          {actions}
        </Stack>
      )}
    </Stack>
    {stats && stats.length > 0 && (
      <Box
        sx={{
          mt: { xs: 1.75, sm: 2.25 },
          pt: { xs: 1.5, sm: 1.75 },
          borderTop: "1px dashed rgba(241,214,138,0.3)",
          display: "grid",
          gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
          "& > *:not(:first-of-type)": { borderLeft: "1px solid rgba(241,214,138,0.18)" },
        }}
      >
        {stats.map((s) => (
          <Box key={s.label} sx={{ minWidth: 0, px: { xs: 0.75, sm: 1.5 }, textAlign: { xs: "center", sm: "left" } }}>
            <Typography
              sx={{
                fontFamily: SCOREBOARD_FONT,
                fontVariantNumeric: "tabular-nums",
                fontWeight: 800,
                lineHeight: 1.1,
                fontSize: { xs: "calc(20px * var(--app-font-scale, 1))", sm: "calc(26px * var(--app-font-scale, 1))" },
                color: s.live ? "#ff8a7a" : BOARD.goldLight,
                textShadow: s.live ? "0 0 12px rgba(255,90,70,0.5)" : "0 0 12px rgba(241,214,138,0.35)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {s.value}
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
              {s.label}
            </Typography>
          </Box>
        ))}
      </Box>
    )}
  </Box>
);

/** Section title with a small gold accent bar and optional count / action. */
export const PavilionSectionTitle: React.FC<{
  children: React.ReactNode;
  count?: number;
  icon?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}> = ({ children, count, icon, subtitle, action }) => (
  <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "stretch", sm: "center" }} justifyContent="space-between" spacing={1.25} sx={{ mb: 1.75 }}>
    <Box sx={{ minWidth: 0 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box sx={{ width: 4, height: 22, borderRadius: 99, flex: "none", background: `linear-gradient(180deg, ${BOARD.goldLight}, ${BOARD.gold})` }} />
        {icon && <Box sx={{ display: "flex", color: BOARD.gold, "& svg": { fontSize: 22 } }}>{icon}</Box>}
        <Typography component="h2" sx={{ fontWeight: 900, color: BOARD.green, fontSize: { xs: "calc(19px * var(--app-font-scale, 1))", sm: "calc(21px * var(--app-font-scale, 1))" }, lineHeight: 1.2 }}>
          {children}
        </Typography>
        {typeof count === "number" && (
          <Box
            sx={{
              minWidth: 26,
              height: 24,
              px: 0.9,
              borderRadius: 99,
              display: "grid",
              placeItems: "center",
              fontFamily: SCOREBOARD_FONT,
              fontWeight: 800,
              fontSize: 13,
              color: BOARD.goldLight,
              background: `linear-gradient(150deg, #1d4b3b 0%, ${BOARD.green} 100%)`,
              boxShadow: "0 2px 6px rgba(6,24,18,0.25)",
            }}
          >
            {count}
          </Box>
        )}
      </Stack>
      {subtitle && (
        <Typography sx={{ mt: 0.6, ml: 1.5, color: "#55665f", fontWeight: 600, fontSize: { xs: 14, sm: 15 }, lineHeight: 1.45 }}>{subtitle}</Typography>
      )}
    </Box>
    {action && <Box sx={{ flex: "none" }}>{action}</Box>}
  </Stack>
);

/** Clickable list row: avatar, title, meta line, chevron. Text wraps normally. */
export const PavilionListRow: React.FC<{
  avatar: React.ReactNode;
  title: React.ReactNode;
  meta?: React.ReactNode;
  accent?: string;
  onClick: () => void;
}> = ({ avatar, title, meta, accent, onClick }) => (
  <ButtonBase
    onClick={onClick}
    sx={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 1.4,
      textAlign: "left",
      p: { xs: 1.25, sm: 1.5 },
      pl: { xs: 1.6, sm: 1.9 },
      borderRadius: 3,
      position: "relative",
      overflow: "hidden",
      border: "1px solid rgba(15,46,37,0.1)",
      background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, color-mix(in srgb, var(--app-accent-start, #43cea2) 5%, #ffffff 95%) 100%)",
      boxShadow: "0 1px 2px rgba(6,24,18,0.04)",
      transition: "transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease",
      "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        background: accent ?? `linear-gradient(180deg, ${BOARD.goldLight}, ${BOARD.gold})`,
      },
      "&:hover, &:focus-visible": {
        transform: "translateY(-2px)",
        borderColor: "rgba(217,180,90,0.6)",
        boxShadow: "0 10px 24px rgba(6,24,18,0.1)",
      },
      "&:hover .row-chevron": { transform: "translateX(3px)", color: BOARD.gold },
    }}
  >
    <Box sx={{ flex: "none" }}>{avatar}</Box>
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography sx={{ fontWeight: 900, color: BOARD.green, fontSize: { xs: 15, sm: 16 }, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {title}
      </Typography>
      {meta && <Box sx={{ mt: 0.4 }}>{meta}</Box>}
    </Box>
    <ChevronRightRounded className="row-chevron" sx={{ flex: "none", color: "#9aa8a2", transition: "transform 140ms ease, color 140ms ease" }} />
  </ButtonBase>
);

/** Status pill used in lists (Live / Active / Draft / Completed ...). */
export const StatusPill: React.FC<{ status: string; label: string }> = ({ status, label }) => {
  const tones: Record<string, { bg: string; fg: string; dot?: string }> = {
    active: { bg: "rgba(27,138,90,0.12)", fg: "#126b45", dot: "#1b8a5a" },
    live: { bg: "rgba(181,56,43,0.12)", fg: "#9a2f22", dot: BOARD.seam },
    completed: { bg: "rgba(217,180,90,0.2)", fg: "#6b4a00" },
    draft: { bg: "rgba(15,46,37,0.07)", fg: "#4a5a54" },
  };
  const t = tones[status] ?? tones.draft;
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 0.9,
        height: 22,
        borderRadius: 99,
        fontWeight: 850,
        fontSize: 11.5,
        letterSpacing: 0.2,
        color: t.fg,
        background: t.bg,
        whiteSpace: "nowrap",
      }}
    >
      {t.dot && <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: t.dot }} />}
      {label}
    </Box>
  );
};
