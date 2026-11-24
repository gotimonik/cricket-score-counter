import type React from "react";
import { Box } from "@mui/material";
import { VerifiedRounded } from "@mui/icons-material";

/** Marks a player who owns their profile (as opposed to a name an organizer typed). */
const RegisteredBadge: React.FC = () => (
  <Box
    component="span"
    title="Registered player"
    sx={{ display: "inline-flex", alignItems: "center", gap: 0.25, color: "#0b7f61", fontSize: 11.5, fontWeight: 800 }}
  >
    <VerifiedRounded sx={{ fontSize: 15 }} />
    Registered
  </Box>
);

export default RegisteredBadge;
