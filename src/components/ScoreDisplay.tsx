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
        mb: 1,
        "& .MuiPaper-root": {
          p: { xs: 1.5, sm: 2 },
          borderRadius: 5,
          background: "rgba(255,255,255,0.22)",
          boxShadow: "0 4px 24px 0 #185a9d22",
          color: "#185a9d",
        },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          borderRadius: 4,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          width: "80%",
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "white" }}
          fontSize={{ xs: 32, md: 40 }}
        >
          {score}/{wickets}
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: "white" }}
          fontSize={{ xs: 16, md: 20 }}
        >
          {overs.toFixed(1)}/{targetOvers} Overs
        </Typography>
        {targetScore > 0 && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#185a9d',
              // background: 'linear-gradient(90deg, #43cea2 0%, #e0eafc 100%)',
              px: 2,
              py: 0.5,
              borderRadius: 2,
              // boxShadow: '0 2px 8px 0 #185a9d22',
              display: 'inline-block',
              mt: 1,
            }}
            fontSize={{ xs: 16, md: 20 }}
          >
            {targetScore - score > 0 ? targetScore - score : 0} runs needed in{' '}
            {Math.floor(remainingBalls / 6)}.{Math.floor(remainingBalls % 6)}{' '}
            overs
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ScoreDisplay;
