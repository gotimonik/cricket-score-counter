import React from "react";
import { Box } from "@mui/material";

const VideoSection: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      sx={{
        width: { xs: "100%", md: "100%" },
        height: "auto",
        maxWidth: "100%",
        overflow: "hidden",
        borderRadius: 2,
      }}
    >
      <video
        muted
        loop
        controls
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          objectFit: "cover",
          borderRadius: "12px",
        }}
      >
        <source src="/cricket-score-counter.mp4" type="video/mp4" />
      </video>
    </Box>
  );
};

export default VideoSection;
