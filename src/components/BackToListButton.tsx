import type React from "react";
import { ArrowBackRounded } from "@mui/icons-material";
import { Box, ButtonBase } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

/** Router state a listing passes when it opens a detail screen. */
export type BackState = { backLabel?: string };

/** True when this screen was reached by navigating inside the app (not opened from a shared link). */
export const useCameFromApp = () => {
  const location = useLocation();
  return location.key !== "default";
};

/**
 * "← Live matches" pill for detail screens that have no page title (the live
 * watch page, a shared profile). Shown only when the user got here from a
 * screen inside the app, and goes back to it, keeping its scroll position
 * and filters. Opened from a shared link, there is nothing to go back to.
 */
const BackToListButton: React.FC<{ fallbackLabel?: string; sx?: SxProps<Theme>; tone?: "light" | "dark" }> = ({
  fallbackLabel,
  sx,
  tone = "light",
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const cameFromApp = useCameFromApp();
  if (!cameFromApp) return null;
  const label = (location.state as BackState | null)?.backLabel || fallbackLabel || t("Back");
  const light = tone === "light";
  return (
    <Box sx={[{ width: "100%", display: "flex" }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
      <ButtonBase
        onClick={() => navigate(-1)}
        aria-label={t("Go back")}
        data-ga-click="detail_back"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.6,
          pl: 0.75,
          pr: 1.4,
          py: 0.55,
          borderRadius: 99,
          fontWeight: 800,
          fontSize: "calc(13.5px * var(--app-font-scale, 1))",
          color: light ? "#fff" : "#0c3558",
          background: light ? "rgba(255,255,255,0.16)" : "#fff",
          border: light ? "1px solid rgba(255,255,255,0.35)" : "1px solid rgba(12,53,88,0.12)",
          backdropFilter: light ? "blur(6px)" : undefined,
          "&:hover": { background: light ? "rgba(255,255,255,0.24)" : "#f3f6f8" },
          "&:focus-visible": { outline: "2px solid #D9B45A", outlineOffset: 2 },
        }}
      >
        <ArrowBackRounded sx={{ fontSize: 19 }} />
        {label}
      </ButtonBase>
    </Box>
  );
};

export default BackToListButton;
