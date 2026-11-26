import React from "react";
import { ArrowBackRounded } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { BOARD } from "../utils/brand";

interface PageTitleWithBackProps {
  children: React.ReactNode;
  component?: React.ElementType;
  iconColor?: string;
  sx?: SxProps<Theme>;
  titleSx?: SxProps<Theme>;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /** Where back goes when the page was opened directly (shared link, new tab). */
  fallbackTo?: string;
}

const PageTitleWithBack: React.FC<PageTitleWithBackProps> = ({
  children,
  component,
  iconColor = BOARD.goldLight,
  sx,
  titleSx,
  variant = "h1",
  fallbackTo = "/",
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const titleComponent = component || variant;

  const handleBackClick = () => {
    // Reached from another screen of the app: go back to it (keeps the
    // list's tab, filters and scroll). Opened from a shared link or a new
    // tab: history.back() would leave the site, so go to the parent list.
    if (location.key !== "default") {
      navigate(-1);
      return;
    }
    navigate(fallbackTo, { replace: true });
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={[
        { mb: 1, minWidth: 0 },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <IconButton
        type="button"
        onClick={handleBackClick}
        aria-label={t("Go back")}
        sx={{
          // Same family as the header and the player card: board green
          // with a gold-leaf arrow and rim.
          width: { xs: 40, sm: 44 },
          height: { xs: 40, sm: 44 },
          color: iconColor,
          background: `radial-gradient(circle at 30% 25%, #24584a 0%, ${BOARD.green} 70%)`,
          border: "1px solid rgba(217,180,90,0.55)",
          boxShadow: "0 2px 6px rgba(10,31,26,0.25)",
          flexShrink: 0,
          transition: "transform 120ms ease, box-shadow 120ms ease",
          "&:hover": {
            background: `radial-gradient(circle at 30% 25%, #2b6654 0%, ${BOARD.green} 70%)`,
            boxShadow: "0 4px 10px rgba(10,31,26,0.3)",
          },
          "&:active": { transform: "scale(0.96)" },
          "&:focus-visible": {
            outline: `3px solid ${BOARD.gold}`,
            outlineOffset: "2px",
          },
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        }}
      >
        <ArrowBackRounded />
      </IconButton>
      <Typography
        component={titleComponent}
        variant={variant}
        sx={[
          {
            minWidth: 0,
            wordBreak: "break-word",
          },
          ...(Array.isArray(titleSx) ? titleSx : titleSx ? [titleSx] : []),
          // Brand colour wins over each page's own; pages keep their sizes.
          // Same font as the rest of the app.
          {
            color: BOARD.green,
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
          },
        ]}
      >
        {children}
      </Typography>
    </Stack>
  );
};

export default PageTitleWithBack;
