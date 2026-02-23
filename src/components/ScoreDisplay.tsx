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
  currentStriker?: {
    name: string;
    runs: number;
    balls: number;
  };
  currentBowler?: {
    name: string;
    balls: number;
    runsConceded: number;
    wickets: number;
  };
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  wickets,
  overs,
  targetOvers,
  targetScore = 0,
  remainingBalls = 0,
  teamName,
  currentStriker,
  currentBowler,
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
        mb: 0.5,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: 4,
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.32) 0%, rgba(224,247,250,0.24) 100%)",
          border: "1.5px solid rgba(67,206,162,0.7)",
          boxShadow: "0 8px 24px 0 #185a9d33",
          width: "100%",
          maxWidth: 560,
          textAlign: "center",
        }}
      >
        {teamName && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              mb: 0.75,
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
          sx={{ fontWeight: 900, color: "#ffffff", textShadow: "0 2px 10px #00000025" }}
          fontSize={{ xs: 40, md: 52 }}
        >
          {score}/{wickets}
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: "#f6fbff", fontWeight: 700 }}
          fontSize={{ xs: 17, md: 21 }}
        >
          {overs.toFixed(1)}/{targetOvers} Overs
        </Typography>
        {(currentStriker?.name || currentBowler?.name) && (
          <Box
            sx={{
              mt: 1.3,
              p: { xs: 1, sm: 1.2 },
              borderRadius: 3,
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(234,249,253,0.9) 100%)",
              border: "1px solid rgba(67,206,162,0.7)",
              boxShadow: "0 8px 20px #185a9d1c",
              color: "#185a9d",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 1,
              textAlign: "left",
            }}
          >
            {currentStriker?.name && (
              <Box
                sx={{
                  borderRadius: 2.5,
                  px: 1.1,
                  py: 0.95,
                  background:
                    "linear-gradient(145deg, rgba(67,206,162,0.24) 0%, rgba(24,90,157,0.12) 100%)",
                  border: "1px solid rgba(67,206,162,0.62)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                      px: 0.9,
                      py: 0.2,
                      borderRadius: 99,
                      background: "rgba(24,90,157,0.13)",
                      fontSize: 10.5,
                      fontWeight: 900,
                      letterSpacing: 0.35,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#11ba68",
                        boxShadow: "0 0 0 0 rgba(17,186,104,0.55)",
                        animation: "pulse-dot 1.5s infinite",
                        "@keyframes pulse-dot": {
                          "0%": { boxShadow: "0 0 0 0 rgba(17,186,104,0.55)" },
                          "70%": { boxShadow: "0 0 0 6px rgba(17,186,104,0)" },
                          "100%": { boxShadow: "0 0 0 0 rgba(17,186,104,0)" },
                        },
                      }}
                    />
                    ON STRIKE
                  </Box>
                  <Box
                    sx={{
                      px: 0.9,
                      py: 0.18,
                      borderRadius: 99,
                      fontSize: 10.5,
                      fontWeight: 900,
                      color: "#0a8d51",
                      background: "rgba(17,186,104,0.12)",
                    }}
                  >
                    LIVE
                  </Box>
                </Box>
                <Typography sx={{ fontWeight: 900, fontSize: 16.5, lineHeight: 1.1 }}>
                  {currentStriker.name}
                </Typography>
                <Box sx={{ display: "flex", gap: 0.6, mt: 0.55, flexWrap: "wrap" }}>
                  <Box
                    sx={{
                      borderRadius: 99,
                      px: 0.9,
                      py: 0.2,
                      fontWeight: 900,
                      fontSize: 12.5,
                      color: "#ffffff",
                      background: "linear-gradient(135deg, #20b486 0%, #185a9d 100%)",
                    }}
                  >
                    {currentStriker.runs} R
                  </Box>
                  <Box
                    sx={{
                      borderRadius: 99,
                      px: 0.9,
                      py: 0.2,
                      fontWeight: 900,
                      fontSize: 12.5,
                      color: "#185a9d",
                      background: "rgba(24,90,157,0.12)",
                    }}
                  >
                    {currentStriker.balls} B
                  </Box>
                </Box>
              </Box>
            )}
            {currentBowler?.name && (
              <Box
                sx={{
                  borderRadius: 2.5,
                  px: 1.1,
                  py: 0.95,
                  background:
                    "linear-gradient(145deg, rgba(24,90,157,0.22) 0%, rgba(67,206,162,0.12) 100%)",
                  border: "1px solid rgba(24,90,157,0.4)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
                }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    mb: 0.5,
                    px: 0.9,
                    py: 0.2,
                    borderRadius: 99,
                    background: "rgba(24,90,157,0.14)",
                    fontSize: 10.5,
                    fontWeight: 900,
                    letterSpacing: 0.35,
                  }}
                >
                  CURRENT BOWLER
                </Box>
                <Typography sx={{ fontWeight: 900, fontSize: 16.5, lineHeight: 1.1 }}>
                  {currentBowler.name}
                </Typography>
                <Box sx={{ display: "flex", gap: 0.6, mt: 0.55, flexWrap: "wrap" }}>
                  <Box
                    sx={{
                      borderRadius: 99,
                      px: 0.9,
                      py: 0.2,
                      fontWeight: 900,
                      fontSize: 12.5,
                      color: "#ffffff",
                      background: "linear-gradient(135deg, #185a9d 0%, #43cea2 100%)",
                    }}
                  >
                    {Math.floor(currentBowler.balls / 6)}.{currentBowler.balls % 6} O
                  </Box>
                  <Box
                    sx={{
                      borderRadius: 99,
                      px: 0.9,
                      py: 0.2,
                      fontWeight: 900,
                      fontSize: 12.5,
                      color: "#185a9d",
                      background: "rgba(24,90,157,0.12)",
                    }}
                  >
                    {currentBowler.runsConceded} R
                  </Box>
                  <Box
                    sx={{
                      borderRadius: 99,
                      px: 0.9,
                      py: 0.2,
                      fontWeight: 900,
                      fontSize: 12.5,
                      color: "#185a9d",
                      background: "rgba(24,90,157,0.12)",
                    }}
                  >
                    {currentBowler.wickets} W
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        )}
        {/* Second Inning: Show both current and required run rate */}
        {targetScore > 0 ? (
          <>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#185a9d',
                px: 1.5,
                py: 0.4,
                borderRadius: 2,
                display: 'inline-block',
                mt: 1.1,
                background: "rgba(255,255,255,0.45)",
              }}
              fontSize={{ xs: 14, md: 17 }}
            >
              {targetScore - score > 0 ? targetScore - score : 0} runs needed in{' '}
              {Math.floor(remainingBalls / 6)}.{Math.floor(remainingBalls % 6)}{' '}
              overs
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#185a9d', fontWeight: 700, mt: 0.6 }}
              fontSize={{ xs: 13, md: 15 }}
            >
              CRR: {currentRunRate.toFixed(2)} &nbsp;|&nbsp; RRR: {requiredRunRate > 0 ? requiredRunRate.toFixed(2) : '--'}
            </Typography>
          </>
        ) : (
          // First Inning: Show only current run rate
          <Typography
            variant="body1"
            sx={{ color: '#185a9d', fontWeight: 700, mt: 1.1 }}
            fontSize={{ xs: 13, md: 15 }}
          >
            CRR: {currentRunRate.toFixed(2)}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ScoreDisplay;
