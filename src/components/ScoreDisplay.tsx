import type React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";

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
    fours: number;
    sixes: number;
  };
  currentBowler?: {
    name: string;
    balls: number;
    runsConceded: number;
    wickets: number;
  };
  resultText?: string;
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
  resultText,
}) => {
  const { t } = useTranslation();
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
          position: "relative",
          overflow: "hidden",
          p: { xs: 1.5, sm: 2 },
          borderRadius: 4,
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.42) 0%, rgba(232,246,255,0.35) 100%)",
          border: "1.5px solid rgba(67,206,162,0.75)",
          boxShadow: "0 10px 28px 0 #185a9d38",
          width: "100%",
          maxWidth: 560,
          textAlign: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -70,
            right: -70,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(67,206,162,0.28) 0%, rgba(67,206,162,0) 70%)",
            pointerEvents: "none",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -90,
            left: -80,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(24,90,157,0.2) 0%, rgba(24,90,157,0) 72%)",
            pointerEvents: "none",
          },
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
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            mt: 0.4,
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 0.8,
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              borderRadius: 2.5,
              px: 1,
              py: 0.8,
              textAlign: "left",
              border: "1px solid rgba(24,90,157,0.2)",
              borderTop: "4px solid #1b7659",
              background: "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(238,249,255,0.96) 100%)",
              boxShadow: "0 6px 14px rgba(24,90,157,0.14)",
            }}
          >
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#185a9d" }}>
              {t("Score")}
            </Typography>
            <Typography
              sx={{
                mt: 0.1,
                fontWeight: 900,
                color: "#185a9d",
                fontSize: { xs: 30, sm: 33 },
                lineHeight: 1.05,
              }}
            >
              {score}/{wickets}
            </Typography>
          </Box>

          <Box
            sx={{
              borderRadius: 2.5,
              px: 1,
              py: 0.8,
              textAlign: "left",
              border: "1px solid rgba(24,90,157,0.2)",
              borderTop: "4px solid #185a9d",
              background: "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(232,243,255,0.95) 100%)",
              boxShadow: "0 6px 14px rgba(24,90,157,0.14)",
            }}
          >
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#185a9d" }}>
              {t("Overs")}
            </Typography>
            <Typography
              sx={{
                mt: 0.15,
                fontWeight: 900,
                color: "#185a9d",
                fontSize: { xs: 26, sm: 28 },
                lineHeight: 1.05,
              }}
            >
              {overs.toFixed(1)}/{targetOvers}
            </Typography>
          </Box>

          <Box
            sx={{
              borderRadius: 2.5,
              px: 1,
              py: 0.8,
              textAlign: "left",
              border: "1px solid rgba(24,90,157,0.2)",
              borderTop: "4px solid #646464",
              background: "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(238,249,255,0.96) 100%)",
              boxShadow: "0 6px 14px rgba(24,90,157,0.14)",
            }}
          >
            <Typography sx={{ fontSize: 11, fontWeight: 800, color: "#185a9d" }}>
              {targetScore > 0 ? `${t("CRR")} / ${t("RRR")}` : t("CRR")}
            </Typography>
            <Typography
              sx={{
                mt: 0.15,
                fontWeight: 900,
                color: "#185a9d",
                fontSize: { xs: 16, sm: 17 },
                lineHeight: 1.1,
              }}
            >
              {targetScore > 0
                ? `${currentRunRate.toFixed(2)} / ${
                    requiredRunRate > 0 ? requiredRunRate.toFixed(2) : "--"
                  }`
                : currentRunRate.toFixed(2)}
            </Typography>
          </Box>
        </Box>
        {(currentStriker?.name || currentBowler?.name) && (
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              mt: 1.3,
              p: { xs: 1, sm: 1.2 },
              borderRadius: 3,
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.99) 0%, rgba(238,250,255,0.94) 100%)",
              border: "1px solid rgba(67,206,162,0.7)",
              boxShadow: "0 8px 22px #185a9d22",
              color: "#185a9d",
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
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
                    "linear-gradient(145deg, rgba(67,206,162,0.3) 0%, rgba(24,90,157,0.16) 100%)",
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
                    {t("ON STRIKE")}
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
                    {currentStriker.runs} {t("R")}
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
                    {currentStriker.balls} {t("B")}
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
                    {currentStriker.fours} {t("4s")}
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
                    {currentStriker.sixes} {t("6s")}
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
                    "linear-gradient(145deg, rgba(24,90,157,0.28) 0%, rgba(67,206,162,0.16) 100%)",
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
                  {t("CURRENT BOWLER")}
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
                    {Math.floor(currentBowler.balls / 6)}.{currentBowler.balls % 6} {t("O")}
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
                    {currentBowler.runsConceded} {t("R")}
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
                    {currentBowler.wickets} {t("W")}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        )}
        {resultText ? (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "#0d8a52",
              px: 1.5,
              py: 0.4,
              borderRadius: 2,
              display: "inline-block",
              mt: 1.1,
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(67,206,162,0.65)",
            }}
            fontSize={{ xs: 14, md: 17 }}
          >
            {resultText}
          </Typography>
        ) : targetScore > 0 ? (
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
            {targetScore - score > 0 ? targetScore - score : 0} {t("runs needed in")}{" "}
            {Math.floor(remainingBalls / 6)}.{Math.floor(remainingBalls % 6)}{" "}
            {t("overs")}
          </Typography>
        ) : null}
      </Paper>
    </Box>
  );
};

export default ScoreDisplay;
