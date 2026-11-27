import React from "react";
import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import { ChevronRightRounded } from "@mui/icons-material";
import type { LiveMatchSummary } from "../../services/ExploreService";
import { resolveApiMediaUrl } from "../../utils/mediaUrl";

// Shared by the Explore "Live" tab and the Home "Live now" strip.

export const livePulseDotSx = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  bgcolor: "#e53935",
  flex: "none",
  animation: "explorePulse 1.4s ease-in-out infinite",
  "@keyframes explorePulse": { "0%, 100%": { opacity: 1 }, "50%": { opacity: 0.3 } },
} as const;

const GOLD = "#D9B45A";
const GOLD_LIGHT = "#F1D68A";
const SEAM = "#B5382B";
const SCOREBOARD_FONT = 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace';

export const TeamBadge: React.FC<{ name: string; logoUrl: string }> = ({ name, logoUrl }) => (
  <Avatar
    src={resolveApiMediaUrl(logoUrl) || undefined}
    sx={{
      width: 24,
      height: 24,
      fontSize: 11,
      fontWeight: 900,
      flex: "none",
      bgcolor: "rgba(255,255,255,0.1)",
      color: GOLD_LIGHT,
      border: `1.5px solid rgba(217,180,90,0.55)`,
    }}
  >
    {name.trim()[0]?.toUpperCase() ?? "?"}
  </Avatar>
);

/** Little red cricket ball next to the team batting now. */
const BattingBall: React.FC = () => (
  <Box
    aria-hidden
    sx={{
      width: 8,
      height: 8,
      ml: 0.75,
      flex: "none",
      borderRadius: "50%",
      background: `radial-gradient(circle at 35% 35%, #ff8a7a 0%, ${SEAM} 60%, #7a1f16 100%)`,
      boxShadow: `0 0 6px rgba(255,90,70,0.8)`,
    }}
  />
);

/**
 * Live score card styled as a night-match scoreboard: pitch-green board with
 * mown-outfield stripes, a floodlight glow, gold trim and glowing scoreboard
 * digits that flash whenever the score changes.
 */
export const LiveMatchCard: React.FC<{ m: LiveMatchSummary; onOpen: () => void }> = ({ m, onOpen }) => {
  const rows = [
    { name: m.team1Name, logo: m.team1LogoUrl },
    { name: m.team2Name, logo: m.team2LogoUrl },
  ];
  const status =
    m.statusText ||
    (m.target > 0 ? `${m.battingTeam} need ${m.target} to win` : m.scorerOnline ? "Innings in progress" : "Waiting for the next update");
  return (
    <Paper
      elevation={0}
      onClick={onOpen}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      sx={{
        position: "relative",
        isolation: "isolate",
        minWidth: 0,
        overflow: "hidden",
        cursor: "pointer",
        p: { xs: 1.4, sm: 1.6 },
        pl: { xs: 1.9, sm: 2.1 },
        borderRadius: 4,
        color: "#fff",
        border: "1px solid rgba(217,180,90,0.32)",
        background: [
          // Floodlight glow over the top-right corner.
          "radial-gradient(120% 90% at 100% 0%, rgba(181,56,43,0.42) 0%, rgba(181,56,43,0) 55%)",
          // Warm gold haze rising from the bottom-left.
          "radial-gradient(90% 80% at 0% 100%, rgba(217,180,90,0.2) 0%, rgba(217,180,90,0) 60%)",
          // Mown outfield stripes.
          "repeating-linear-gradient(100deg, rgba(255,255,255,0.035) 0 22px, rgba(255,255,255,0) 22px 44px)",
          "linear-gradient(160deg, #1a4636 0%, #0F2E25 48%, #0A1F1A 100%)",
        ].join(", "),
        boxShadow: "0 10px 28px rgba(4,16,12,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
        transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
        // Seam-red to gold accent down the left edge.
        "&::before": {
          content: '""',
          position: "absolute",
          inset: "0 auto 0 0",
          width: 4,
          background: `linear-gradient(180deg, #ff5a46 0%, ${SEAM} 45%, ${GOLD} 100%)`,
          boxShadow: "0 0 12px rgba(255,90,70,0.55)",
        },
        // Light sheen that sweeps across on hover.
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          zIndex: -1,
          background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.1) 50%, transparent 65%)",
          transform: "translateX(-120%)",
          transition: "transform 900ms ease",
          pointerEvents: "none",
        },
        "&:hover, &:focus-visible": {
          transform: "translateY(-3px)",
          borderColor: "rgba(241,214,138,0.7)",
          boxShadow: "0 16px 36px rgba(4,16,12,0.55), 0 0 0 1px rgba(241,214,138,0.25), 0 0 26px rgba(217,180,90,0.22)",
          outline: "none",
        },
        "&:hover::after, &:focus-visible::after": { transform: "translateX(120%)" },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          "&::after": { display: "none" },
          "& .score-led": { animation: "none" },
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={0.9} sx={{ mb: 1, minWidth: 0 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            flex: "none",
            px: 0.8,
            py: 0.2,
            borderRadius: 99,
            bgcolor: SEAM,
            boxShadow: "0 0 12px rgba(229,57,53,0.55)",
          }}
        >
          <Box sx={{ ...livePulseDotSx, width: 6, height: 6, bgcolor: "#fff" }} />
          <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: 10.5, letterSpacing: 1, lineHeight: 1.4 }}>LIVE</Typography>
        </Box>
        <Typography
          sx={{
            color: "rgba(241,214,138,0.85)",
            fontWeight: 700,
            fontSize: 12,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {m.tournament ? `${m.tournament.name}${m.tournament.location ? ` · ${m.tournament.location}` : ""}` : "Friendly match"}
        </Typography>
        <ChevronRightRounded sx={{ fontSize: 20, color: GOLD, flex: "none" }} />
      </Stack>
      {rows.map((r) => {
        const inn = m.innings.find((i) => i.team === r.name);
        const batting = r.name === m.battingTeam;
        return (
          <Stack key={r.name} direction="row" alignItems="center" spacing={1} sx={{ py: 0.45, minWidth: 0 }}>
            <TeamBadge name={r.name} logoUrl={r.logo} />
            <Stack direction="row" alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  minWidth: 0,
                  fontWeight: batting ? 900 : 700,
                  color: batting ? "#fff" : "rgba(255,255,255,0.68)",
                  fontSize: { xs: 14, sm: 14.5 },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {r.name}
              </Typography>
              {batting && <BattingBall />}
            </Stack>
            {inn ? (
              <Box
                // Re-mounts when the score changes, replaying the flash.
                key={`${inn.runs}-${inn.wickets}-${inn.overs}`}
                className="score-led"
                sx={{
                  flex: "none",
                  display: "inline-flex",
                  alignItems: "baseline",
                  gap: 0.5,
                  px: 0.9,
                  py: 0.25,
                  borderRadius: 1.5,
                  whiteSpace: "nowrap",
                  fontFamily: SCOREBOARD_FONT,
                  fontVariantNumeric: "tabular-nums",
                  background: "rgba(0,0,0,0.34)",
                  border: "1px solid rgba(241,214,138,0.18)",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)",
                  animation: batting ? "liveScoreFlash 900ms ease-out" : "none",
                  "@keyframes liveScoreFlash": {
                    "0%": { boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5), 0 0 0 0 rgba(241,214,138,0.9)", background: "rgba(241,214,138,0.28)" },
                    "100%": { boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5), 0 0 0 8px rgba(241,214,138,0)", background: "rgba(0,0,0,0.34)" },
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: 14.5, sm: 15 },
                    color: batting ? GOLD_LIGHT : "rgba(255,255,255,0.78)",
                    textShadow: batting ? "0 0 8px rgba(241,214,138,0.55)" : "none",
                  }}
                >
                  {inn.runs}-{inn.wickets}
                </Box>
                {inn.overs && (
                  <Box component="span" sx={{ fontWeight: 600, fontSize: 11.5, color: "rgba(255,255,255,0.55)" }}>
                    {inn.overs}
                  </Box>
                )}
              </Box>
            ) : (
              <Typography sx={{ flex: "none", whiteSpace: "nowrap", fontWeight: 600, fontSize: 12, fontStyle: "italic", color: "rgba(255,255,255,0.5)" }}>
                Yet to bat
              </Typography>
            )}
          </Stack>
        );
      })}
      <Typography
        sx={{
          mt: 1,
          pt: 0.9,
          borderTop: "1px dashed rgba(241,214,138,0.28)",
          color: GOLD_LIGHT,
          fontSize: 12.5,
          fontWeight: 800,
          lineHeight: 1.35,
        }}
      >
        {status}
        {!m.scorerOnline && (
          <Box component="span" sx={{ color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>
            {m.tournament ? " · last saved over" : " · scorer reconnecting"}
          </Box>
        )}
      </Typography>
    </Paper>
  );
};

export default LiveMatchCard;
