"use client";

import type React from "react";
import { Paper, Grid, Button } from "@mui/material";
import type { BallEvent } from "../types/cricket";
import { scoringOptions } from "../utils/constant";

interface ScoringKeypadProps {
  onEvent: (type: BallEvent["type"], value: number) => void;
  onUndo: () => void;
}

const ScoringKeypad: React.FC<ScoringKeypadProps> = ({ onEvent, onUndo }) => {
  const buttonStyle = {
    height: 60,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
    color: "black",
    fontSize: "1.2rem",
    border: "1px solid #46464646",
    "&:hover": {
      backgroundColor: "#e0e0e0",
      borderColor: "#46464646",
    },
    "&:active": {
      backgroundColor: "#d0d0d0",
      borderColor: "#46464646",
    },
    "&:focus": {
      backgroundColor: "#d0d0d0",
      borderColor: "#46464646",
    },
  };

  return (
    <Paper
      sx={{
        padding: 2,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: "auto",
        p: { xs: 1.5, sm: 2.5 },
        borderRadius: 4,
        background: "rgba(255,255,255,0.18)",
        boxShadow: "0 2px 12px 0 #43cea255",
      }}
    >
      <Grid container spacing={2}>
        {scoringOptions.map((option) => (
          <Grid item xs={4} key={`${option.type}-${option.value}`}>
            <Button
              fullWidth
              variant="outlined"
              sx={buttonStyle}
              onClick={() => onEvent(option.type, option.value)}
            >
              {option.type === "wicket"
                ? "W"
                : option.type === "wide"
                ? "WD"
                : option.type === "no-ball"
                ? "NB"
                : option.value.toString()}
            </Button>
          </Grid>
        ))}
        <Grid item xs={4}>
          <Button
            fullWidth
            variant="outlined"
            sx={buttonStyle}
            onClick={onUndo}
          >
            UNDO
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ScoringKeypad;
