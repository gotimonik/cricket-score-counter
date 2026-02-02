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

interface ScoringKeypadProps {
  onEvent: (type: BallEvent["type"], value: number) => void;
  onUndo: () => void;
}

const ScoringKeypad: React.FC<ScoringKeypadProps> = ({ onEvent, onUndo }) => {
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
    height: { xs: 64, sm: 72, md: 80 },
    minWidth: { xs: 64, sm: 72, md: 80 },
    borderRadius: 16,
    background: "linear-gradient(120deg, #43cea2 0%, #185a9d 100%)",
    color: "#fff",
    fontSize: { xs: "1.5rem", sm: "1.7rem", md: "2rem" },
    fontWeight: 700,
    boxShadow: "0 6px 24px 0 #185a9d33",
    border: "none",
    transition: "background 0.2s, box-shadow 0.2s, transform 0.1s",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontFamily: "Montserrat, Roboto, Arial, sans-serif",
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1200,
        padding: { xs: 2.5, sm: 3.5 },
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        background: "linear-gradient(120deg, #e3f2fd 0%, #43cea2 100%)",
        boxShadow: "0 -2px 24px 0 #43cea255",
        minHeight: { xs: 200, sm: 180, md: 160 },
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
            More
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
                background: 'linear-gradient(120deg, #e3f2fd 0%, #43cea2 100%)',
                borderRadius: 3,
                boxShadow: '0 6px 24px 0 #185a9d33',
                minWidth: 220,
                color: '#185a9d',
                fontFamily: 'Montserrat, Roboto, Arial, sans-serif',
                p: 1,
              },
            }}
          >
            <MenuItem
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
              <ListItemText primary="Undo" />
            </MenuItem>
            {[2,3,4,5].map((runs, idx) => (
              <MenuItem
                key={runs}
                onClick={() => handleExtraRuns(runs)}
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: '#185a9d',
                  mb: idx !== 3 ? 0.5 : 0,
                  '&:hover': {
                    background: 'linear-gradient(120deg, #f7971e 0%, #ffd200 100%)',
                    color: '#fff',
                  },
                }}
              >
                <ListItemIcon><AddIcon fontSize="small" sx={{ color: 'inherit' }} /></ListItemIcon>
                <ListItemText primary={`Wide + ${runs-1} runs`} />
              </MenuItem>
            ))}
            <MenuItem
              onClick={handleThreeRuns}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#185a9d',
                '&:hover': {
                  background: 'linear-gradient(120deg, #43cea2 0%, #185a9d 100%)',
                  color: '#fff',
                },
              }}
            >
              <ListItemIcon><SportsCricketIcon fontSize="small" sx={{ color: 'inherit' }} /></ListItemIcon>
              <ListItemText primary="3 runs" />
            </MenuItem>
            <MenuItem
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
              <ListItemText primary="Run Out + 1 run" />
            </MenuItem>
            <MenuItem
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
              <ListItemText primary="Run Out + 2 runs" />
            </MenuItem>
            <MenuItem
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
              <ListItemText primary="Run Out + 3 runs" />
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ScoringKeypad;
