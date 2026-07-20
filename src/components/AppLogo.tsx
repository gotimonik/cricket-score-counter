import React from "react";
import { Box } from "@mui/material";

interface AppLogoProps {
  size?: number | string;
  label?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({
  size = 56,
  label = "Cricket Score Counter",
}) => {
  const inlineSize = typeof size === "number" ? `${size}px` : size;

  return (
    <Box
      component="img"
      src="/images/new_logo.png"
      alt={label}
      loading="eager"
      draggable={false}
      sx={{
        width: size,
        height: size,
        display: "block",
        flexShrink: 0,
        objectFit: "contain",
        userSelect: "none",
        borderRadius: "10px",
      }}
      style={{
        width: inlineSize,
        height: inlineSize,
      }}
    />
  );
};

export default AppLogo;
