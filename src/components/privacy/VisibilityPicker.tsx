import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import {
  LinkRounded,
  LockRounded,
  PublicRounded,
  VisibilityOffRounded,
} from "@mui/icons-material";

export type PlayerVisibility = "public" | "unlisted" | "hidden";
export type TournamentVisibility = "public" | "unlisted" | "private";

export interface VisibilityOption<V extends string> {
  value: V;
  title: string;
  body: string;
  icon: React.ReactNode;
}

export const PLAYER_VISIBILITY_OPTIONS: VisibilityOption<PlayerVisibility>[] = [
  {
    value: "public",
    title: "Public",
    body: "Anyone can find you on Explore and in organizer search, and see your stats.",
    icon: <PublicRounded />,
  },
  {
    value: "unlisted",
    title: "Link only",
    body: "Not listed or searchable by name. Anyone you send your link (or exact @username) to can see your stats.",
    icon: <LinkRounded />,
  },
  {
    value: "hidden",
    title: "Hidden",
    body: "Only you can see your profile and stats. Your share link is turned off.",
    icon: <VisibilityOffRounded />,
  },
];

export const TOURNAMENT_VISIBILITY_OPTIONS: VisibilityOption<TournamentVisibility>[] = [
  {
    value: "public",
    title: "Public",
    body: "Listed on Explore. Anyone can follow the points table, results, scorecards and player stats.",
    icon: <PublicRounded />,
  },
  {
    value: "unlisted",
    title: "Link only",
    body: "Not listed. Anyone with the link can view scores and stats: good for sharing in a team group.",
    icon: <LinkRounded />,
  },
  {
    value: "private",
    title: "Private",
    body: "Only you and the registered players in its squads can see it. Its matches don't show on players' public stats.",
    icon: <LockRounded />,
  },
];

export const visibilityLabel = (value?: string) =>
  value === "public" ? "Public" : value === "unlisted" ? "Link only" : value === "hidden" ? "Hidden" : "Private";

export const visibilityIcon = (value?: string, size = 16) => {
  const sx = { fontSize: size };
  if (value === "public") return <PublicRounded sx={sx} />;
  if (value === "unlisted") return <LinkRounded sx={sx} />;
  if (value === "hidden") return <VisibilityOffRounded sx={sx} />;
  return <LockRounded sx={sx} />;
};

/** Radio-style cards for choosing who can see a profile or tournament. */
function VisibilityPicker<V extends string>({
  value,
  options,
  onChange,
  disabled,
  compact,
}: {
  value: V;
  options: VisibilityOption<V>[];
  onChange: (value: V) => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  return (
    <Box
      role="radiogroup"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: `repeat(${options.length}, minmax(0, 1fr))` },
        gap: 1,
      }}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Box
            key={option.value}
            component="button"
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => !disabled && onChange(option.value)}
            sx={{
              all: "unset",
              boxSizing: "border-box",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled && !selected ? 0.5 : 1,
              p: compact ? 1.1 : 1.4,
              borderRadius: 2,
              border: "2px solid",
              borderColor: selected ? "#185a9d" : "rgba(12,53,88,0.14)",
              background: selected ? "rgba(67,206,162,0.1)" : "#fff",
              transition: "border-color 120ms, background 120ms",
              "&:focus-visible": { outline: "3px solid rgba(24,90,157,0.35)", outlineOffset: 2 },
            }}
          >
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ color: selected ? "#185a9d" : "#0c3558" }}>
              {option.icon}
              <Typography sx={{ fontWeight: 900, fontSize: 14.5 }}>{option.title}</Typography>
            </Stack>
            {!compact && (
              <Typography sx={{ fontSize: 12.5, color: "#526274", fontWeight: 600, mt: 0.4, lineHeight: 1.35 }}>
                {option.body}
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export default VisibilityPicker;
