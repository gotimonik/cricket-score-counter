import React from "react";
import { Box, Typography, Paper } from "@mui/material";

interface PlayerStatsProps {
  batsmanStats: { [name: string]: { runs: number; balls: number; wickets: number } };
  bowlerStats: { [name: string]: { runs: number; balls: number; wickets: number } };
  striker: string;
  nonStriker: string;
  currentBowler: string;
}

const PlayerStatsDisplay: React.FC<PlayerStatsProps> = ({ batsmanStats, bowlerStats, striker, nonStriker, currentBowler }) => {
  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Paper elevation={2} sx={{ p: 2, borderRadius: 4, background: "#f8fffc", maxWidth: 400, mx: "auto" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#185a9d', mb: 1 }}>Batsmen</Typography>
        {[striker, nonStriker].map((name) => (
          <Box key={name} sx={{ mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: name === striker ? '#43cea2' : '#185a9d' }}>
              {name} {name === striker ? '(Striker)' : '(Non-Striker)'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#185a9d' }}>
              Runs: {batsmanStats[name]?.runs || 0} | Balls: {batsmanStats[name]?.balls || 0} | Wickets: {batsmanStats[name]?.wickets || 0}
            </Typography>
          </Box>
        ))}
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#185a9d', mt: 2, mb: 1 }}>Bowler</Typography>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#185a9d' }}>{currentBowler}</Typography>
          <Typography variant="body2" sx={{ color: '#185a9d' }}>
            Runs: {bowlerStats[currentBowler]?.runs || 0} | Balls: {bowlerStats[currentBowler]?.balls || 0} | Wickets: {bowlerStats[currentBowler]?.wickets || 0}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default PlayerStatsDisplay;
