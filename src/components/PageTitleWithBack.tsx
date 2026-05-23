import React from "react";
import { ArrowBackRounded } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { toCurrentVersionPath } from "../utils/routes";

interface PageTitleWithBackProps {
  children: React.ReactNode;
  component?: React.ElementType;
  iconColor?: string;
  sx?: SxProps<Theme>;
  titleSx?: SxProps<Theme>;
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const PageTitleWithBack: React.FC<PageTitleWithBackProps> = ({
  children,
  component,
  iconColor = "var(--app-accent-text, #185a9d)",
  sx,
  titleSx,
  variant = "h1",
}) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const titleComponent = component || variant;

  const handleBackClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(toCurrentVersionPath(location.pathname, "/"));
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
          width: { xs: 40, sm: 44 },
          height: { xs: 40, sm: 44 },
          color: iconColor,
          background: "rgba(24,90,157,0.08)",
          border: "1px solid rgba(24,90,157,0.14)",
          flexShrink: 0,
          "&:hover": {
            background: "rgba(24,90,157,0.16)",
          },
          "&:focus-visible": {
            outline: "3px solid rgba(24,90,157,0.32)",
            outlineOffset: "2px",
          },
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
        ]}
      >
        {children}
      </Typography>
    </Stack>
  );
};

export default PageTitleWithBack;
