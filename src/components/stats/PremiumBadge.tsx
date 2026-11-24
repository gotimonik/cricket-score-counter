import type React from "react";
import { Box } from "@mui/material";
import { WorkspacePremiumRounded } from "@mui/icons-material";

/** Small marker on sections that will be part of Premium (free until it launches). */
const PremiumBadge: React.FC<{ title?: string; compact?: boolean }> = ({
  title = "Free while we launch. This will be part of Premium later.",
  compact = false,
}) => (
  <Box
    component="span"
    title={title}
    sx={{
      display: "inline-flex",
      alignItems: "center",
      gap: 0.3,
      px: 0.8,
      py: 0.15,
      borderRadius: 99,
      fontSize: "calc(10.5px * var(--app-font-scale, 1))",
      fontWeight: 900,
      letterSpacing: 0.3,
      color: "#6b4a00",
      background: "linear-gradient(135deg, #ffe7a3 0%, #ffd36b 100%)",
      border: "1px solid #f0c04f",
      verticalAlign: "middle",
    }}
  >
    <WorkspacePremiumRounded sx={{ fontSize: 13 }} />
    {compact ? "PREMIUM" : "PREMIUM · FREE NOW"}
  </Box>
);

export default PremiumBadge;
