import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { EditRounded, EmojiEventsRounded, VerifiedRounded } from "@mui/icons-material";
import { playerAvatarSrc, type PublicPlayer } from "../../services/PlayerAccountService";
import { visibilityIcon, visibilityLabel } from "../privacy/VisibilityPicker";
import { formatDate } from "./ProfileUi";
import { BOARD } from "../../utils/brand";
import ShareButton from "../share/ShareButton";

// The player's card, styled after a pavilion honours board: deep board green,
// gold-leaf lettering, and a ball-seam stitch under the name. This is
// the one bold element on the profile; everything around it stays quiet.
export { BOARD };

const goldText = {
  background: `linear-gradient(180deg, ${BOARD.goldLight} 0%, ${BOARD.gold} 70%, #b8923c 100%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
} as const;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

/** Gold rule with a red double stitch through the middle, like a ball seam. */
const SeamRule: React.FC = () => (
  <Box aria-hidden sx={{ position: "relative", height: 10, my: { xs: 1.75, sm: 2 } }}>
    <Box sx={{ position: "absolute", left: 0, right: 0, top: 4.5, height: "1px", background: `linear-gradient(90deg, transparent, ${BOARD.gold} 12%, ${BOARD.gold} 88%, transparent)`, opacity: 0.55 }} />
    <Box
      sx={{
        position: "absolute",
        left: "50%",
        top: 0,
        width: 92,
        height: 10,
        transform: "translateX(-50%)",
        background: BOARD.green,
        "&::before, &::after": {
          content: '""',
          position: "absolute",
          left: 8,
          right: 8,
          height: 2,
          backgroundImage: `repeating-linear-gradient(90deg, ${BOARD.seam} 0 5px, transparent 5px 9px)`,
        },
        "&::before": { top: 1.5 },
        "&::after": { bottom: 1.5 },
      }}
    />
  </Box>
);

export interface ProfileHeroStat {
  label: string;
  value: React.ReactNode;
}

const ProfileHero: React.FC<{
  player: PublicPlayer & { visibility?: string; memberSince?: string | null };
  stats: ProfileHeroStat[];
  achievements?: number;
  debut?: string | null;
  isOwner?: boolean;
  onShare?: () => void;
  onEdit?: () => void;
  onAchievements?: () => void;
  /** Replaces the default Share / Edit buttons. */
  actions?: React.ReactNode;
  /** Extra content under the board. */
  footer?: React.ReactNode;
}> = ({ player, stats, achievements = 0, debut, isOwner, onShare, onEdit, onAchievements, actions, footer }) => {
  const avatar = playerAvatarSrc(player.avatarUrl);
  const tags = [player.battingStyle, player.bowlingStyle].filter(Boolean);
  const meta = [player.role, player.city].filter(Boolean).join(", ");
  const since = [
    player.memberSince ? `Member since ${formatDate(player.memberSince)}` : "",
    debut ? `first match ${formatDate(debut)}` : "",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Box
      component="section"
      aria-label={`${player.name} player card`}
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: { xs: 3, sm: 4 },
        color: BOARD.chalk,
        px: { xs: 2, sm: 3.5 },
        pt: { xs: 2.25, sm: 3 },
        pb: { xs: 2, sm: 2.75 },
        border: `1px solid rgba(217,180,90,0.35)`,
        boxShadow: "0 18px 40px rgba(6, 26, 20, 0.28), inset 0 1px 0 rgba(241,214,138,0.18)",
        // Board panels: faint vertical planks over a lit-from-above green.
        background: `
          repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 88px),
          radial-gradient(120% 90% at 20% 0%, #1a4638 0%, ${BOARD.green} 45%, ${BOARD.greenDeep} 100%)`,
        // Inner gold frame, like the moulding round an honours board.
        "&::after": {
          content: '""',
          position: "absolute",
          inset: { xs: 6, sm: 8 },
          borderRadius: { xs: 2.5, sm: 3.5 },
          border: "1px solid rgba(217,180,90,0.22)",
          pointerEvents: "none",
        },
      }}
    >
      <Stack direction="row" spacing={{ xs: 1.75, sm: 2.5 }} alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            flex: "none",
            width: { xs: 76, sm: 104 },
            height: { xs: 76, sm: 104 },
            borderRadius: "50%",
            p: "3px",
            background: `conic-gradient(from 210deg, ${BOARD.goldLight}, ${BOARD.gold}, #8a6a22, ${BOARD.goldLight})`,
            boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              overflow: "hidden",
              display: "grid",
              placeItems: "center",
              background: `radial-gradient(circle at 30% 25%, #24584a, ${BOARD.greenDeep})`,
              border: `2px solid ${BOARD.greenDeep}`,
            }}
          >
            {avatar ? (
              <Box component="img" src={avatar} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <Typography sx={{ fontWeight: 900, fontSize: { xs: 26, sm: 36 }, ...goldText }}>{initials(player.name) || "?"}</Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            component="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "clamp(24px, 7.4vw, 30px)", sm: 38 },
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
              wordBreak: "break-word",
              ...goldText,
            }}
          >
            {player.name}
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: { xs: 13.5, sm: 15 }, fontWeight: 600, color: "rgba(237,233,220,0.78)" }}>
            @{player.username}
          </Typography>
          {meta && (
            <Typography sx={{ fontSize: { xs: 13, sm: 14 }, fontWeight: 600, color: "rgba(237,233,220,0.6)" }}>{meta}</Typography>
          )}
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
            {player.registered && (
              <Stack direction="row" spacing={0.4} alignItems="center" sx={{ color: BOARD.goldLight, fontSize: 12.5, fontWeight: 700 }}>
                <VerifiedRounded sx={{ fontSize: 15 }} />
                <span>Registered</span>
              </Stack>
            )}
            {tags.map((t) => (
              <Box key={t} sx={{ px: 1, py: 0.2, borderRadius: 99, fontSize: 12.5, fontWeight: 700, border: "1px solid rgba(237,233,220,0.22)", color: BOARD.chalk }}>
                {t}
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <SeamRule />

        {stats.length > 0 && (
        <Box component="dl" sx={{ m: 0, display: "grid", gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
          {stats.map((s, i) => (
            <Box
              key={s.label}
              sx={{
                textAlign: "center",
                px: 0.5,
                borderLeft: i ? "1px solid rgba(217,180,90,0.2)" : "none",
                display: "flex",
                flexDirection: "column-reverse",
              }}
            >
              <Box component="dt" sx={{ fontSize: { xs: 12, sm: 13 }, fontWeight: 600, color: "rgba(237,233,220,0.7)", mt: 0.25 }}>
                {s.label}
              </Box>
              <Box
                component="dd"
                sx={{ m: 0, fontWeight: 900, fontSize: { xs: 26, sm: 34 }, lineHeight: 1, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums", ...goldText }}
              >
                {s.value}
              </Box>
            </Box>
          ))}
        </Box>
        )}

        {(since || achievements > 0) && (
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mt: 2, minHeight: 24 }}>
            <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "rgba(237,233,220,0.6)" }}>{since}</Typography>
            {achievements > 0 && (
              <Box
                component={onAchievements ? "button" : "span"}
                type={onAchievements ? "button" : undefined}
                onClick={onAchievements}
                sx={{
                  all: "unset",
                  cursor: onAchievements ? "pointer" : "default",
                  flex: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  px: 1.1,
                  py: 0.35,
                  borderRadius: 99,
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: "#2a1f05",
                  background: `linear-gradient(180deg, ${BOARD.goldLight}, ${BOARD.gold})`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                  "&:focus-visible": { outline: `2px solid ${BOARD.goldLight}`, outlineOffset: 2 },
                }}
              >
                <EmojiEventsRounded sx={{ fontSize: 15 }} />
                {achievements} {achievements === 1 ? "achievement" : "achievements"}
              </Box>
            )}
          </Stack>
        )}

        {actions ? (
          <Stack direction="row" spacing={1} sx={{ mt: 2, "& > .MuiButton-root": { flex: { xs: 1, sm: "0 0 auto" }, px: { sm: 2.5 } } }}>
            {actions}
          </Stack>
        ) : (onShare || (isOwner && onEdit)) && (
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", mt: 2, "& > .MuiButton-root": { flex: { xs: "1 1 auto", sm: "0 0 auto" }, px: { sm: 2.5 } } }}>
            {onShare && player.visibility !== "hidden" && (
              <ShareButton onClick={onShare} sx={{ py: 0.9 }}>
                Share profile
              </ShareButton>
            )}
            {isOwner && onEdit && (
              <Button
                startIcon={<EditRounded />}
                onClick={onEdit}
                sx={{
                  textTransform: "none",
                  fontWeight: 800,
                  borderRadius: 2,
                  py: 0.9,
                  color: BOARD.chalk,
                  border: "1px solid rgba(237,233,220,0.3)",
                  "&:hover": { background: "rgba(237,233,220,0.08)" },
                  "&:focus-visible": { outline: `2px solid ${BOARD.goldLight}`, outlineOffset: 2 },
                }}
              >
                Edit profile
              </Button>
            )}
          </Stack>
        )}
        {isOwner && player.visibility && (
          <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" sx={{ mt: 1.25, color: "rgba(237,233,220,0.6)", fontSize: 12.5, fontWeight: 600 }}>
            {visibilityIcon(player.visibility, 14)}
            <span>
              {player.visibility === "public"
                ? "Public: anyone can find this profile"
                : player.visibility === "unlisted"
                  ? "Link only: people need your link to see it"
                  : `${visibilityLabel(player.visibility)}: only you can see it`}
            </span>
          </Stack>
        )}
        {footer}
      </Box>
    </Box>
  );
};

export default ProfileHero;

/** Button styles that match the card, for pages passing their own `actions`. */
export const boardButtonSx = {
  gold: {
    textTransform: "none",
    fontWeight: 800,
    borderRadius: 2,
    py: 0.9,
    whiteSpace: "nowrap",
    color: "#2a1f05",
    background: `linear-gradient(180deg, ${BOARD.goldLight}, ${BOARD.gold})`,
    "&:hover": { background: BOARD.goldLight },
    "&:focus-visible": { outline: `2px solid ${BOARD.goldLight}`, outlineOffset: 2 },
  },
  ghost: {
    textTransform: "none",
    fontWeight: 800,
    borderRadius: 2,
    py: 0.9,
    whiteSpace: "nowrap",
    color: BOARD.chalk,
    border: "1px solid rgba(237,233,220,0.3)",
    "&:hover": { background: "rgba(237,233,220,0.08)" },
    "&:focus-visible": { outline: `2px solid ${BOARD.goldLight}`, outlineOffset: 2 },
    "&.Mui-disabled": { color: "rgba(237,233,220,0.35)", borderColor: "rgba(237,233,220,0.15)" },
  },
} as const;
