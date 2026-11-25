import React from "react";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import PremiumBadge from "../stats/PremiumBadge";
import type { MatchResult } from "../../utils/matchStats";

export const sectionSx = {
  p: { xs: 2, sm: 2.75 },
  borderRadius: { xs: 3, sm: 4 },
  border: "1px solid rgba(12,53,88,0.08)",
  background: "#fff",
  boxShadow: "0 1px 2px rgba(8, 26, 56, 0.04), 0 8px 24px rgba(8, 26, 56, 0.05)",
} as const;

// Shared with the player card (ProfileHero): the headline tiles echo it.
const boardGreen = "linear-gradient(160deg, #1a4638 0%, #0F2E25 60%, #0A1F1A 100%)";
const goldInk = {
  background: "linear-gradient(180deg, #F1D68A 0%, #D9B45A 75%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
} as const;


export const ink = "#0c3558";
export const muted = "#6b7785";

export const dash = (v: number | null | undefined, digits = 2) =>
  v === null || v === undefined ? "–" : Number(v).toFixed(digits);

export const shortName = (team: string) => {
  const words = team.split(/\s+/).filter(Boolean);
  return words.length > 1 ? words.map((w) => w[0]).join("").slice(0, 3).toUpperCase() : team.slice(0, 3).toUpperCase();
};

export const formatDate = (iso?: string | null, withYear = true) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString(undefined, { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}) });
};

export const titleCase = (value: string) =>
  value.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const StatTile: React.FC<{ label: string; value: React.ReactNode; hint?: string; highlight?: boolean }> = ({
  label,
  value,
  hint,
  highlight,
}) => (
  <Box
    sx={{
      p: { xs: 1.25, sm: 1.5 },
      borderRadius: 2.5,
      background: highlight ? boardGreen : "#f5f8fa",
      border: highlight ? "1px solid rgba(217,180,90,0.4)" : "1px solid transparent",
      minWidth: 0,
    }}
  >
    <Typography sx={{ fontSize: "calc(12.5px * var(--app-font-scale, 1))", fontWeight: 600, color: highlight ? "rgba(237,233,220,0.75)" : "#5b6976" }}>
      {label}
    </Typography>
    <Typography
      sx={{
        fontSize: "calc(24px * var(--app-font-scale, 1))",
        fontWeight: 800,
        lineHeight: 1.15,
        mt: 0.25,
        fontVariantNumeric: "tabular-nums",
        ...(highlight ? goldInk : { color: ink }),
      }}
    >
      {value}
    </Typography>
    {hint && <Typography sx={{ fontSize: 12, color: highlight ? "rgba(237,233,220,0.6)" : muted, fontWeight: 600 }}>{hint}</Typography>}
  </Box>
);

export const tileGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "repeat(3, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))", md: "repeat(6, minmax(0, 1fr))" },
  gap: 1,
} as const;

export const SectionTitle: React.FC<{ children: React.ReactNode; premium?: boolean; icon?: React.ReactNode; action?: React.ReactNode }> = ({
  children,
  premium,
  icon,
  action,
}) => (
  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
    {icon && <Box sx={{ color: "#0F2E25", display: "flex", "& svg": { fontSize: 20 } }}>{icon}</Box>}
    <Typography variant="h6" component="h2" sx={{ fontWeight: 800, color: ink, fontSize: "calc(17px * var(--app-font-scale, 1))", letterSpacing: "-0.01em" }}>
      {children}
    </Typography>
    {premium && <PremiumBadge />}
    <Box sx={{ flex: 1 }} />
    {action}
  </Stack>
);

export const Section: React.FC<{
  title: React.ReactNode;
  icon?: React.ReactNode;
  premium?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, premium, action, children }) => (
  <Paper elevation={0} sx={sectionSx}>
    <SectionTitle icon={icon} premium={premium} action={action}>
      {title}
    </SectionTitle>
    {children}
  </Paper>
);

export const EmptyNote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography sx={{ color: muted, fontWeight: 600, fontSize: 14 }}>{children}</Typography>
);

export const resultChip = (result: MatchResult, short = false) => {
  const map = {
    won: { label: "Won", s: "W", color: "#0d6b3d", bg: "#dcf5e7" },
    lost: { label: "Lost", s: "L", color: "#8a1c1c", bg: "#fde3e3" },
    tied: { label: "Tied", s: "T", color: "#6b4a00", bg: "#fff0c2" },
    none: { label: "No result", s: "–", color: "#4a5560", bg: "#edf1f4" },
  } as const;
  const m = map[result] ?? map.none;
  return (
    <Chip
      size="small"
      label={short ? m.s : m.label}
      sx={{ fontWeight: 800, color: m.color, background: m.bg, height: 22, minWidth: short ? 28 : undefined, flex: "none" }}
    />
  );
};

/** "vs Opponent · Tournament · 12 Jan 2026" */
export const matchContext = (m: { opponent: string; tournamentName?: string; source?: string; date?: string }) =>
  [`vs ${m.opponent || "?"}`, m.source === "friendly" ? "Friendly" : m.tournamentName, formatDate(m.date)]
    .filter(Boolean)
    .join(" · ");

const BAR_COLORS = ["#185a9d", "#2f8fbf", "#43cea2", "#f0a73a", "#e2604f", "#8a6bd1", "#7c8b99"];

/** Labelled horizontal bars, e.g. how a batter gets out. */
export const BarList: React.FC<{
  items: Array<{ label: string; value: number; hint?: string }>;
  emptyText?: string;
  unit?: string;
}> = ({ items, emptyText = "Nothing yet.", unit = "" }) => {
  const shown = items.filter((i) => i.value > 0);
  if (!shown.length) return <EmptyNote>{emptyText}</EmptyNote>;
  const max = Math.max(...shown.map((i) => i.value));
  const total = shown.reduce((n, i) => n + i.value, 0);
  return (
    <Stack spacing={0.9}>
      {shown.map((item, i) => (
        <Box key={item.label}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.3 }}>
            <Typography sx={{ fontSize: 13.5, fontWeight: 800, color: ink }}>{item.label}</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#526274" }}>
              {item.value}
              {unit} <span style={{ color: "#8a96a3" }}>· {Math.round((item.value * 100) / total)}%</span>
            </Typography>
          </Stack>
          <Box sx={{ height: 9, borderRadius: 99, background: "#edf1f4", overflow: "hidden" }}>
            <Box
              sx={{
                width: `${Math.max(4, (item.value * 100) / max)}%`,
                height: "100%",
                borderRadius: 99,
                background: BAR_COLORS[i % BAR_COLORS.length],
              }}
            />
          </Box>
        </Box>
      ))}
    </Stack>
  );
};

/** One stacked bar split into coloured segments with a legend. */
export const StackedBar: React.FC<{ parts: Array<{ label: string; value: number; color: string }> }> = ({ parts }) => {
  const total = parts.reduce((n, p) => n + p.value, 0);
  if (!total) return <EmptyNote>No runs yet.</EmptyNote>;
  return (
    <Box>
      <Box sx={{ display: "flex", height: 16, borderRadius: 99, overflow: "hidden", background: "#edf1f4" }}>
        {parts
          .filter((p) => p.value > 0)
          .map((p) => (
            <Box key={p.label} title={`${p.label}: ${p.value}`} sx={{ width: `${(p.value * 100) / total}%`, background: p.color }} />
          ))}
      </Box>
      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
        {parts.map((p) => (
          <Stack key={p.label} direction="row" spacing={0.6} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: 99, background: p.color }} />
            <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: "#526274" }}>
              {p.label} <b style={{ color: ink }}>{p.value}</b> ({Math.round((p.value * 100) / total)}%)
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

/** Small column histogram, e.g. how often a batter makes 0–9, 10–29, ... */
export const MiniHistogram: React.FC<{ bins: Array<{ label: string; count: number }>; color?: string }> = ({
  bins,
  color = "var(--app-accent-end, #185a9d)",
}) => {
  const max = Math.max(1, ...bins.map((b) => b.count));
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: `repeat(${bins.length}, minmax(0, 1fr))`, gap: 1, alignItems: "end", height: 120 }}>
      {bins.map((b) => (
        <Stack key={b.label} alignItems="center" justifyContent="flex-end" sx={{ height: "100%" }}>
          <Typography sx={{ fontSize: 12.5, fontWeight: 900, color: ink }}>{b.count}</Typography>
          <Box sx={{ width: "70%", maxWidth: 46, height: `${(b.count * 72) / max}px`, minHeight: 3, borderRadius: "6px 6px 2px 2px", background: color, opacity: b.count ? 1 : 0.25 }} />
          <Typography sx={{ fontSize: 11, fontWeight: 800, color: muted, mt: 0.5, whiteSpace: "nowrap" }}>{b.label}</Typography>
        </Stack>
      ))}
    </Box>
  );
};

export const tableSx = {
  width: "100%",
  borderCollapse: "collapse",
  "& th, & td": { px: 1, py: 0.9, textAlign: "right", borderBottom: "1px solid #edf1f4", fontSize: 13.5, whiteSpace: "nowrap" },
  "& th": { color: "#5b6976", fontWeight: 800, fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.3 },
  "& td:first-of-type, & th:first-of-type": {
    textAlign: "left",
    whiteSpace: "normal",
    position: "sticky",
    left: 0,
    zIndex: 1,
    background: "#fff",
    minWidth: 110,
    boxShadow: "6px 0 8px -8px rgba(12,53,88,0.35)",
  },
} as const;

/** Segmented control look for MUI <Tabs variant="fullWidth"> (profile + Me pages). */
export const segmentedTabsSx = {
  minHeight: 0,
  p: 0.5,
  borderRadius: 99,
  background: "#e1e9ee",
  "& .MuiTabs-indicator": {
    height: "100%",
    borderRadius: 99,
    background: "#fff",
    boxShadow: "0 1px 3px rgba(12,53,88,0.16)",
  },
  "& .MuiTab-root": {
    zIndex: 1,
    minHeight: 36,
    py: 0.5,
    minWidth: 0,
    flex: "1 1 auto",
    px: { xs: 0.75, sm: 2 },
    borderRadius: 99,
    textTransform: "none",
    fontWeight: 700,
    fontSize: { xs: 13, sm: 14 },
    whiteSpace: "nowrap",
    color: "#526274",
    overflow: "visible",
  },
  "& .Mui-selected": { color: `${ink} !important`, fontWeight: 800 },
} as const;
