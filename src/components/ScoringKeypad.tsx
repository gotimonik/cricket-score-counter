"use client";

import React from "react";
import { Paper, Grid, Button, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UndoIcon from "@mui/icons-material/Undo";
import AddIcon from "@mui/icons-material/Add";
import ExposurePlusSharpIcon from "@mui/icons-material/ExposureSharp";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import type { BallEvent } from "../types/cricket";
import { scoringOptions } from "../utils/constant";
import { useTranslation } from "react-i18next";

interface ScoringKeypadProps {
  onEvent: (type: BallEvent["type"], value: number) => void;
  onUndo: () => void;
}

const ScoringKeypad: React.FC<ScoringKeypadProps> = ({ onEvent, onUndo }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleUndo = () => {
    onUndo();
    handleClose();
  };
  const handleExtraRuns = (runs: number) => {
    onEvent("wide", runs);
    handleClose();
  };
  const handleThreeRuns = () => {
    onEvent("run", 3);
    handleClose();
  };
  const handleRunOut = (runs: number) => {
    onEvent("wicket", runs);
    handleClose();
  };
  const buttonStyle = {
    height: { xs: 62, sm: 66, md: 72 },
    minWidth: { xs: 62, sm: 66, md: 72 },
    borderRadius: 14,
    background:
      "linear-gradient(120deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
    color: "#fff",
    fontSize: { xs: "1.45rem", sm: "1.55rem", md: "1.75rem" },
    fontWeight: 800,
    boxShadow:
      "0 4px 16px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 28%, transparent 72%)",
    border: "none",
    transition: "background 0.2s, box-shadow 0.2s, transform 0.1s, opacity 0.2s",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontFamily: "Montserrat, Roboto, Arial, sans-serif",
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow:
        "0 8px 20px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 38%, transparent 62%)",
    },
  };

  return (
    <Paper
      className="app-scoring-keypad"
      sx={{
        width: "100%",
        padding: { xs: 1.4, sm: 1.8 },
        borderRadius: { xs: 4, sm: 5 },
        background:
          "linear-gradient(120deg, #e3f2fd 0%, color-mix(in srgb, var(--app-accent-start, #43cea2) 75%, white 25%) 100%)",
        border: "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 70%, transparent 30%)",
        boxShadow:
          "0 6px 20px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 30%, transparent 70%)",
        minHeight: { xs: 168, sm: 156, md: 150 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid
        container
        spacing={{ xs: 1, sm: 1.2 }}
        justifyContent="center"
        alignItems="center"
      >
        {scoringOptions.map((option) => (
          <Grid item xs={4} key={`${option.type}-${option.value}`}>
            <Button
              data-ga-click={`scoring_option_${option.type}_${option.value}`}
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
                border:
                  option.type === "run"
                    ? "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 65%, transparent 35%)"
                    : "none",
              }}
              onClick={() => onEvent(option.type, option.value)}
          >
              {option.type === "wicket"
                ? t("W")
                : option.type === "wide"
                ? t("WD")
                : option.type === "no-ball"
                ? t("NB")
                : option.value.toString()}
            </Button>
          </Grid>
        ))}
        <Grid item xs={4}>
          <Button
            data-ga-click="more-options"
            fullWidth
            variant="contained"
            sx={{
              ...buttonStyle,
              background: "linear-gradient(120deg, #232526 0%, #414345 100%)",
              color: "#fff",
              fontWeight: 700,
              textShadow: "0 2px 8px #0004",
            }}
            onClick={handleMoreClick}
            endIcon={<MoreVertIcon />}
          >
            {t("More")}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            disableScrollLock
            PaperProps={{
              sx: {
                background:
                  "linear-gradient(120deg, #e3f2fd 0%, color-mix(in srgb, var(--app-accent-start, #43cea2) 75%, white 25%) 100%)",
                borderRadius: 3,
                boxShadow:
                  "0 6px 24px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 32%, transparent 68%)",
                minWidth: 220,
                color: "var(--app-accent-text, #185a9d)",
                fontFamily: 'Montserrat, Roboto, Arial, sans-serif',
                p: 1,
              },
            }}
          >
            <MenuItem
              data-ga-click="undo_from_more_menu"
              onClick={handleUndo}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#232526',
                mb: 0.5,
                '&:hover': {
                  background: 'linear-gradient(120deg, #232526 0%, #414345 100%)',
                  color: '#fff',
                },
              }}
            >
              <ListItemIcon><UndoIcon fontSize="small" sx={{ color: 'inherit' }} /></ListItemIcon>
              <ListItemText primary={t("Undo")} />
            </MenuItem>
            {[2,3,4,5].map((runs, idx) => (
              <MenuItem
                key={runs}
                data-ga-click={`wide_plus_${runs - 1}`}
                onClick={() => handleExtraRuns(runs)}
                sx={{
                borderRadius: 2,
                fontWeight: 700,
                fontSize: '1.1rem',
                color: "var(--app-accent-text, #185a9d)",
                mb: idx !== 3 ? 0.5 : 0,
                '&:hover': {
                  background: 'linear-gradient(120deg, #f7971e 0%, #ffd200 100%)',
                    color: '#fff',
                  },
                }}
              >
                <ListItemIcon><AddIcon fontSize="small" sx={{ color: 'inherit' }} /></ListItemIcon>
                <ListItemText primary={t("Wide + {{runs}} runs", { runs: runs - 1 })} />
              </MenuItem>
            ))}
            <MenuItem
              data-ga-click="score_three_runs"
              onClick={handleThreeRuns}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                fontSize: '1.1rem',
                color: "var(--app-accent-text, #185a9d)",
                '&:hover': {
                  background:
                    "linear-gradient(120deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                  color: '#fff',
                },
              }}
            >
              <ListItemIcon><SportsCricketIcon fontSize="small" sx={{ color: 'inherit' }} /></ListItemIcon>
              <ListItemText primary={t("3 runs")} />
            </MenuItem>
            <MenuItem
              data-ga-click="run_out_plus_1"
              onClick={() => handleRunOut(1)}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#b71c1c',
                '&:hover': {
                  background: 'linear-gradient(120deg, #ff512f 0%, #dd2476 100%)',
                  color: '#fff',
                },
              }}
            >
              <ListItemIcon><ExposurePlusSharpIcon fontSize="small" sx={{ color: 'inherit' }} /></ListItemIcon>
              <ListItemText primary={t("Run Out + 1 run")} />
            </MenuItem>
            <MenuItem
              data-ga-click="run_out_plus_2"
              onClick={() => handleRunOut(2)}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#b71c1c',
                '&:hover': {
                  background: 'linear-gradient(120deg, #ff512f 0%, #dd2476 100%)',
                  color: '#fff',
                },
              }}
            >
              <ListItemIcon><ExposurePlusSharpIcon fontSize="small" sx={{ color: 'inherit' }} /></ListItemIcon>
              <ListItemText primary={t("Run Out + 2 runs")} />
            </MenuItem>
            <MenuItem
              data-ga-click="run_out_plus_3"
              onClick={() => handleRunOut(3)}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#b71c1c',
                '&:hover': {
                  background: 'linear-gradient(120deg, #ff512f 0%, #dd2476 100%)',
                  color: '#fff',
                },
              }}
            >
              <ListItemIcon><ExposurePlusSharpIcon fontSize="small" sx={{ color: 'inherit' }} /></ListItemIcon>
              <ListItemText primary={t("Run Out + 3 runs")} />
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default React.memo(ScoringKeypad);
