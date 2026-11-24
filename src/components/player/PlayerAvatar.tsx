import type React from "react";
import { Avatar } from "@mui/material";
import { playerAvatarSrc } from "../../services/PlayerAccountService";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

/** Player photo, falling back to initials on the app's accent gradient. */
const PlayerAvatar: React.FC<{ name: string; avatarUrl?: string; size?: number; ring?: boolean }> = ({
  name,
  avatarUrl,
  size = 36,
  ring,
}) => (
  <Avatar
    src={playerAvatarSrc(avatarUrl) || undefined}
    alt={name}
    sx={{
      width: size,
      height: size,
      fontSize: size * 0.38,
      fontWeight: 900,
      color: "#fff",
      background: "linear-gradient(135deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
      border: ring ? "2px solid rgba(255,255,255,0.85)" : undefined,
      flex: "none",
    }}
  >
    {initials(name) || "?"}
  </Avatar>
);

export default PlayerAvatar;
