import React from "react";
import {
  EmojiEventsRounded,
  MilitaryTechRounded,
  PersonRounded,
  ShieldRounded,
  SportsBaseballRounded,
  SportsCricketRounded,
  StarRounded,
} from "@mui/icons-material";

// Full set of selectable player roles, shared between My Teams and Tournament
// team registration so both use the identical dropdown experience.
export const PLAYER_ROLE_OPTIONS = [
  "Captain",
  "Vice Captain",
  "Batsman",
  "Bowler",
  "Wicket Keeper",
  "All Rounder",
  "WC",
];

const playerRoleIconSx = {
  fontSize: "16px !important",
  color: "#185a9d !important",
} as const;

export const getPlayerRoleIcon = (role?: string) => {
  const normalizedRole = role?.trim().toLowerCase();
  if (normalizedRole === "captain") {
    return <EmojiEventsRounded sx={playerRoleIconSx} />;
  }
  if (normalizedRole === "vice captain") {
    return <MilitaryTechRounded sx={playerRoleIconSx} />;
  }
  if (normalizedRole === "batsman") {
    return <SportsCricketRounded sx={playerRoleIconSx} />;
  }
  if (normalizedRole === "bowler") {
    return <SportsBaseballRounded sx={playerRoleIconSx} />;
  }
  if (normalizedRole === "wicket keeper" || normalizedRole === "wc") {
    return <ShieldRounded sx={playerRoleIconSx} />;
  }
  if (normalizedRole === "all rounder") {
    return <StarRounded sx={playerRoleIconSx} />;
  }
  return <PersonRounded sx={playerRoleIconSx} />;
};

// Roles that can only belong to one player per team at a time.
export const UNIQUE_PLAYER_ROLES = ["Captain", "Vice Captain"];

interface RoleHolder {
  role?: string;
}

/**
 * Returns the role options a given player row should show, hiding any
 * unique role (Captain, Vice Captain) that another player on the same
 * team has already been assigned. The current player's own role is
 * always kept in the list so their existing selection still renders.
 */
export const getAvailableRoleOptions = (
  players: RoleHolder[],
  currentIndex: number,
  allOptions: string[] = PLAYER_ROLE_OPTIONS,
) =>
  allOptions.filter((role) => {
    if (!UNIQUE_PLAYER_ROLES.includes(role)) return true;
    if (players[currentIndex]?.role === role) return true;
    return !players.some(
      (player, index) => index !== currentIndex && player.role === role,
    );
  });
