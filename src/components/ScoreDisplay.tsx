import type React from "react";
import { Box, Typography, Paper } from "@mui/material";

interface ScoreDisplayProps {
  score: number;
  wickets: number;
  overs: number;
  targetOvers: number;
  targetScore?: number;
  remainingBalls?: number;
  teamName?: string;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  wickets,
  overs,
  targetOvers,
  targetScore = 0,
  remainingBalls = 0,
  teamName,
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
        {teamName && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              mb: 1,
              letterSpacing: 1.5,
              fontSize: { xs: 18, md: 22 },
              color: '#185a9d',
              background: '#fff',
              border: '2px solid #43cea2',
              boxShadow: '0 2px 8px #185a9d22',
              display: 'inline-block',
              borderRadius: 16,
              px: 2.5,
              py: 0.5,
              minWidth: 80,
              textAlign: 'center',
            }}
            fontSize={{ xs: 18, md: 22 }}
          >
            {teamName}
          </Typography>
        )}
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
              px: 2,
              py: 0.5,
              borderRadius: 2,
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
