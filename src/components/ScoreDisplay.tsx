import type React from "react";
import { Box, Typography, Paper } from "@mui/material";

interface ScoreDisplayProps {
  score: number;
  wickets: number;
  overs: number;
  targetOvers: number;
  targetScore?: number;
  remainingBalls?: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  wickets,
  overs,
  targetOvers,
  targetScore = 0,
  remainingBalls = 0,
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 4,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          width: "80%",
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "white" }}>
          {score}/{wickets}
        </Typography>
        <Typography variant="h6" sx={{ color: "white" }}>
          {overs.toFixed(1)}/{targetOvers} Overs
        </Typography>
        {targetScore > 0 && (
          <Typography variant="h6" sx={{ color: "white" }}>
            {targetScore - score} runs needed in{" "}
            {Math.floor(remainingBalls / 6)}.{Math.floor(remainingBalls % 6)}{" "}
            overs
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ScoreDisplay;
