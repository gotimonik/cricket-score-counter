import React from "react";
import { Box, Typography } from "@mui/material";
import AppLogo from "./AppLogo";

interface AppLoaderProps {
  /** "page" fills the screen with the theme gradient (route loading);
   *  "overlay" dims the current screen (data loading). */
  variant?: "page" | "overlay";
  label?: string;
}

/**
 * The app's single loading indicator: the logo inside a spinning,
 * theme-coloured ring.
 *
 * Built from plain CSS (a bordered circle rotated with a keyframe defined in
 * global.css) rather than MUI's SVG CircularProgress, because the SVG
 * dash-array animation stutters or freezes in iOS WKWebView while the JS
 * thread is busy, and it also inherited the dull grey primary colour.
 * The ring animation is compositor-only (transform), so it keeps spinning
 * smoothly on iOS even while a route chunk or match data is loading.
 */
const AppLoader: React.FC<AppLoaderProps> = ({
  variant = "overlay",
  label = "Loading…",
}) => (
  <Box
    role="status"
    aria-live="polite"
    aria-label={label}
    sx={{
      position: "fixed",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1.5,
      // Keep the indicator centred in the visible area on iOS, where the
      // web view extends under the status bar and home indicator.
      pt: "env(safe-area-inset-top, 0px)",
      pb: "env(safe-area-inset-bottom, 0px)",
      background:
        variant === "page"
          ? "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))"
          : "rgba(8, 26, 56, 0.28)",
      WebkitTapHighlightColor: "transparent",
    }}
  >
    <Box
      sx={{
        position: "relative",
        width: 112,
        height: 112,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.92)",
        boxShadow: "0 18px 40px rgba(8, 26, 56, 0.28)",
      }}
    >
      <Box
        className="app-loader-ring"
        aria-hidden="true"
        sx={{
          position: "absolute",
          inset: -6,
          borderRadius: "50%",
          border: "5px solid rgba(255,255,255,0.35)",
          borderTopColor: "var(--app-accent-start, #43cea2)",
          borderRightColor: "var(--app-accent-end, #185a9d)",
        }}
      />
      <Box
        className="app-loader-logo"
        sx={{ display: "flex", borderRadius: "50%", overflow: "hidden" }}
      >
        <AppLogo size={68} />
      </Box>
    </Box>
    <Typography
      sx={{
        color: "#fff",
        fontWeight: 700,
        fontSize: "calc(14px * var(--app-font-scale, 1))",
        textShadow: "0 1px 4px rgba(0,0,0,0.35)",
        letterSpacing: 0.3,
      }}
    >
      {label}
    </Typography>
  </Box>
);

export default AppLoader;
