import React from "react";
import { Box } from "@mui/material";

interface AppLogoProps {
  size?: number | string;
  label?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({
  size = 56,
  label = "Cricket Score Counter",
}) => (
  <Box
    component="svg"
    role="img"
    aria-label={label}
    viewBox="0 0 128 128"
    sx={{ width: size, height: size, display: "block" }}
  >
    <defs>
      <linearGradient id="appLogoBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="var(--app-accent-start, #43cea2)" />
        <stop offset="100%" stopColor="var(--app-accent-end, #185a9d)" />
      </linearGradient>
      <linearGradient id="appLogoBat" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="var(--app-accent-start, #43cea2)" />
        <stop offset="100%" stopColor="var(--app-accent-end, #185a9d)" />
      </linearGradient>
    </defs>

    <rect x="2" y="2" width="124" height="124" rx="30" fill="url(#appLogoBg)" />
    <circle cx="64" cy="64" r="50" fill="rgba(255,255,255,0.93)" />
    <circle
      cx="64"
      cy="64"
      r="50"
      fill="none"
      stroke="var(--app-accent-end, #185a9d)"
      strokeWidth="2.2"
    />

    <rect x="51" y="36" width="7" height="52" rx="2.5" fill="#f4cf3b" />
    <rect x="61" y="36" width="7" height="52" rx="2.5" fill="#f4cf3b" />
    <rect x="71" y="36" width="7" height="52" rx="2.5" fill="#f4cf3b" />
    <rect x="50" y="33" width="20" height="4" rx="2" fill="#f4cf3b" />
    <rect x="60" y="33" width="20" height="4" rx="2" fill="#f4cf3b" />

    <g transform="rotate(-42 67 73)">
      <rect x="40" y="69" width="56" height="10" rx="3" fill="url(#appLogoBat)" />
      <rect x="90" y="62" width="13" height="5" rx="2" fill="#8d5a3b" />
    </g>

    <circle cx="37" cy="49" r="12" fill="#e32838" />
    <path d="M34 40c6 7 6 16 0 23" fill="none" stroke="#ffe6e6" strokeWidth="1.8" />
    <path d="M40 40c-6 7-6 16 0 23" fill="none" stroke="#ffe6e6" strokeWidth="1.8" />
  </Box>
);

export default AppLogo;
