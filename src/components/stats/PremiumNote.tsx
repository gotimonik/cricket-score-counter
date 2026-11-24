import type React from "react";
import { Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import PremiumBadge from "./PremiumBadge";

/** One-line explanation of the Premium badge, linking to /premium. */
const PremiumNote: React.FC<{ sx?: object }> = ({ sx }) => (
  <Typography sx={{ fontSize: "calc(13px * var(--app-font-scale, 1))", color: "#5b6976", fontWeight: 600, ...sx }}>
    <PremiumBadge /> Sections marked like this are free for everyone while we launch, and will be part of an optional Premium plan later.{" "}
    <Box component={RouterLink} to="/premium" sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 800 }}>
      What's coming
    </Box>
  </Typography>
);

export default PremiumNote;
