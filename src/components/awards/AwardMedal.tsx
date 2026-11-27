import React from "react";
import { Box } from "@mui/material";
import {
  BoltRounded,
  FlagRounded,
  GroupsRounded,
  LockRounded,
  PanToolRounded,
  SportsBaseballRounded,
  SportsCricketRounded,
  StarRounded,
} from "@mui/icons-material";
import type { AchievementCategory, AchievementTier } from "../../utils/careerInsights";

/** Metallic finishes per tier, shared by medals, chips and certificates. */
export const TIER_META: Record<
  AchievementTier,
  { label: string; light: string; mid: string; dark: string; ink: string; ribbon: [string, string]; stars: number }
> = {
  bronze: { label: "Bronze", light: "#f6d2a8", mid: "#c98a4b", dark: "#7a4a1c", ink: "#5a3410", ribbon: ["#2f6b52", "#1d4b3b"], stars: 1 },
  silver: { label: "Silver", light: "#ffffff", mid: "#c3ccd6", dark: "#6f7d8b", ink: "#36424e", ribbon: ["#2c5f9e", "#1b3f6e"], stars: 2 },
  gold: { label: "Gold", light: "#fff2b8", mid: "#e0aa1f", dark: "#8a6200", ink: "#5c4100", ribbon: ["#b5382b", "#7e2318"], stars: 3 },
  platinum: { label: "Platinum", light: "#f4f7ff", mid: "#a9b8ff", dark: "#5d55c9", ink: "#2a2a6b", ribbon: ["#3a2f8f", "#211a5e"], stars: 4 },
};

export const CATEGORY_ICON: Record<AchievementCategory, React.ReactElement> = {
  batting: <SportsCricketRounded />,
  bowling: <SportsBaseballRounded />,
  fielding: <PanToolRounded />,
  allround: <BoltRounded />,
  matches: <FlagRounded />,
  team: <GroupsRounded />,
};

/**
 * A medal on a ribbon: metallic ring and disc in the tier's finish, the
 * award's category icon in the centre and 1-4 stars for the tier.
 * `locked` shows it greyed out with a padlock (not earned yet).
 */
const AwardMedal: React.FC<{
  tier: AchievementTier;
  category: AchievementCategory;
  size?: number;
  locked?: boolean;
  shine?: boolean;
}> = ({ tier, category, size = 64, locked, shine = true }) => {
  const m = TIER_META[tier];
  const ribbonW = size * 0.3;
  return (
    <Box
      aria-hidden
      sx={{
        position: "relative",
        width: size,
        height: size * 1.32,
        flex: "none",
        filter: locked ? "grayscale(1) opacity(0.45)" : "drop-shadow(0 6px 10px rgba(0,0,0,0.22))",
      }}
    >
      {/* Ribbon tails */}
      {[-1, 1].map((side) => (
        <Box
          key={side}
          sx={{
            position: "absolute",
            top: 0,
            left: size / 2 - ribbonW / 2 + side * ribbonW * 0.42,
            width: ribbonW,
            height: size * 0.62,
            transform: `skewX(${side * -14}deg)`,
            background: `linear-gradient(180deg, ${m.ribbon[0]} 0%, ${m.ribbon[1]} 100%)`,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 84%, 0 100%)",
            "&::after": {
              content: '""',
              position: "absolute",
              inset: `0 ${ribbonW * 0.38}px`,
              background: "rgba(255,255,255,0.28)",
            },
          }}
        />
      ))}
      {/* Medal */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: size,
          height: size,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
          background: `conic-gradient(from 210deg, ${m.light}, ${m.mid}, ${m.dark}, ${m.mid}, ${m.light}, ${m.mid}, ${m.dark}, ${m.light})`,
          boxShadow: `inset 0 0 0 ${Math.max(1, size * 0.025)}px rgba(255,255,255,0.5)`,
          ...(shine && !locked
            ? {
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.55) 50%, transparent 65%)",
                  transform: "translateX(-120%)",
                  animation: "medalShine 5s ease-in-out infinite",
                },
                "@keyframes medalShine": { "0%, 70%": { transform: "translateX(-120%)" }, "90%, 100%": { transform: "translateX(120%)" } },
                "@media (prefers-reduced-motion: reduce)": { "&::after": { display: "none" } },
              }
            : {}),
        }}
      >
        <Box
          sx={{
            width: "76%",
            height: "76%",
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            color: m.ink,
            background: `radial-gradient(circle at 35% 30%, ${m.light} 0%, ${m.mid} 62%, ${m.dark} 100%)`,
            boxShadow: `inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -3px 6px rgba(0,0,0,0.25)`,
            "& > svg": { fontSize: size * 0.36, filter: "drop-shadow(0 1px 0 rgba(255,255,255,0.5))" },
          }}
        >
          {locked ? <LockRounded /> : CATEGORY_ICON[category]}
        </Box>
        {/* Tier stars */}
        <Box
          sx={{
            position: "absolute",
            bottom: size * 0.06,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 0,
            "& svg": { fontSize: Math.max(8, size * 0.15), color: m.ink, opacity: 0.85 },
          }}
        >
          {Array.from({ length: m.stars }).map((_, i) => (
            <StarRounded key={i} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default AwardMedal;
