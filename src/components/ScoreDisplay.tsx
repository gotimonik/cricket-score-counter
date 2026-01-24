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
  // Calculate run rates
  const ballsBowled = overs ? Math.floor(overs) * 6 + Math.round((overs % 1) * 10) : 0;
  const currentRunRate = ballsBowled > 0 ? (score / (ballsBowled / 6)) : 0;
  const requiredRunRate = targetScore && remainingBalls > 0
    ? ((targetScore - score) / (remainingBalls / 6))
    : 0;

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
              fontWeight: 800,
              mb: 0.5,
              letterSpacing: 1.2,
              fontSize: { xs: 14, md: 16 },
              color: '#185a9d',
              background: '#fff',
              border: '1.5px solid #43cea2',
              boxShadow: '0 2px 8px #185a9d22',
              display: 'inline-block',
              borderRadius: 12,
              px: 1.5,
              py: 0.2,
              minWidth: 60,
              textAlign: 'center',
            }}
            fontSize={{ xs: 14, md: 16 }}
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
        {/* Second Inning: Show both current and required run rate */}
        {targetScore > 0 ? (
          <>
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
            <Typography
              variant="body1"
              sx={{ color: '#185a9d', fontWeight: 600, mt: 0.5 }}
              fontSize={{ xs: 15, md: 17 }}
            >
              CRR: {currentRunRate.toFixed(2)} &nbsp;|&nbsp; RRR: {requiredRunRate > 0 ? requiredRunRate.toFixed(2) : '--'}
            </Typography>
          </>
        ) : (
          // First Inning: Show only current run rate
          <Typography
            variant="body1"
            sx={{ color: '#185a9d', fontWeight: 600, mt: 1 }}
            fontSize={{ xs: 15, md: 17 }}
          >
            CRR: {currentRunRate.toFixed(2)}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ScoreDisplay;
