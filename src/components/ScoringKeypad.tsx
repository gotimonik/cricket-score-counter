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
    height: { md: 64 },
    minWidth: { md: 64 },
    borderRadius: 16,
    background: "linear-gradient(120deg, #43cea2 0%, #185a9d 100%)",
    color: "#fff",
    fontSize: { xs: "1.1rem", sm: "1.35rem", md: "1.7rem" },
    fontWeight: 700,
    boxShadow: "0 6px 24px 0 #185a9d33",
    border: "none",
    transition: "background 0.2s, box-shadow 0.2s, transform 0.1s",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontFamily: "Montserrat, Roboto, Arial, sans-serif",
    mb: 1,
    "&:hover": {
      background: "linear-gradient(120deg, #43cea2 40%, #185a9d 100%)",
      boxShadow: "0 8px 32px 0 #185a9d44",
      transform: "scale(1.05)",
    },
    "&:active": {
      background: "linear-gradient(120deg, #185a9d 0%, #43cea2 100%)",
      boxShadow: "0 4px 16px 0 #185a9d33",
      transform: "scale(0.98)",
    },
    "&:focus": {
      outline: "2px solid #43cea2",
    },
  };

  return (
    <Paper
      sx={{
        padding: { xs: 2, sm: 3 },
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        marginTop: "auto",
        borderRadius: 12,
        background: "linear-gradient(120deg, #e3f2fd 0%, #43cea2 100%)",
        boxShadow: "0 8px 32px 0 #43cea255",
        minHeight: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid
        container
        spacing={{ xs: 1, sm: 2 }}
        justifyContent="center"
        alignItems="center"
      >
        {scoringOptions.map((option) => (
          <Grid item xs={4} key={`${option.type}-${option.value}`}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                ...buttonStyle,
                background:
                  option.type === "wicket"
                    ? "linear-gradient(120deg, #ff512f 0%, #dd2476 100%)"
                    : option.type === "wide"
                    ? "linear-gradient(120deg, #f7971e 0%, #ffd200 100%)"
                    : option.type === "no-ball"
                    ? "linear-gradient(120deg, #1fa2ff 0%, #12d8fa 100%)"
                    : buttonStyle.background,
                color: "#fff",
                textShadow: "0 2px 8px #0002",
              }}
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
            variant="contained"
            sx={{
              ...buttonStyle,
              background: "linear-gradient(120deg, #232526 0%, #414345 100%)",
              color: "#fff",
              fontWeight: 700,
              textShadow: "0 2px 8px #0004",
            }}
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
