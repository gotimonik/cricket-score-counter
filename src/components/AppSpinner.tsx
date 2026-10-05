import React from "react";
import { Box } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

interface AppSpinnerProps {
  /** Diameter in px. */
  size?: number;
  /** "primary" uses the theme accent colours; "inherit" uses the current
   *  text colour (for spinners inside buttons). */
  color?: "primary" | "inherit";
  /** Accepted for drop-in compatibility with MUI CircularProgress. */
  thickness?: number;
  sx?: SxProps<Theme>;
  "aria-label"?: string;
}

/**
 * Small inline version of the app's loader ring (see AppLoader). Uses the
 * same compositor-only `appLoaderSpin` keyframe from global.css, so it keeps
 * spinning on iOS and respects Reduce Motion the same way everywhere.
 */
const AppSpinner: React.FC<AppSpinnerProps> = ({
  size = 40,
  color = "primary",
  thickness,
  sx,
  "aria-label": ariaLabel = "Loading",
}) => {
  const borderWidth = Math.max(
    2,
    Math.round(thickness ? (size * thickness) / 44 : size / 10),
  );
  const ringColors =
    color === "inherit"
      ? {
          border: `${borderWidth}px solid currentColor`,
          borderLeftColor: "transparent",
          borderBottomColor: "transparent",
          opacity: 0.9,
        }
      : {
          border: `${borderWidth}px solid color-mix(in srgb, var(--app-accent-end, #185a9d) 15%, transparent 85%)`,
          borderTopColor: "var(--app-accent-start, #43cea2)",
          borderRightColor: "var(--app-accent-end, #185a9d)",
        };

  return (
    <Box
      component="span"
      role="progressbar"
      aria-label={ariaLabel}
      className="app-loader-ring"
      sx={[
        {
          display: "inline-block",
          flexShrink: 0,
          width: size,
          height: size,
          borderRadius: "50%",
          boxSizing: "border-box",
          verticalAlign: "middle",
          ...ringColors,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  );
};

export default AppSpinner;
