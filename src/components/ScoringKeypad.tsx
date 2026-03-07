"use client";

import React from "react";
import {
  Paper,
  Grid,
  Button,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UndoIcon from "@mui/icons-material/Undo";
import AddIcon from "@mui/icons-material/Add";
import ExposurePlusSharpIcon from "@mui/icons-material/ExposureSharp";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import CloseIcon from "@mui/icons-material/Close";
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
  const [widePickerOpen, setWidePickerOpen] = React.useState(false);
  const [runOutPickerOpen, setRunOutPickerOpen] = React.useState(false);
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
    setWidePickerOpen(false);
  };
  const handleThreeRuns = () => {
    onEvent("run", 3);
    handleClose();
  };
  const handleRunOut = (runs: number) => {
    onEvent("wicket", runs);
    handleClose();
    setRunOutPickerOpen(false);
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
              aria-label={
                option.type === "wicket"
                  ? t("Add wicket")
                  : option.type === "wide"
                  ? t("Add wide")
                  : option.type === "no-ball"
                  ? t("Add no-ball")
                  : t("Add {{runs}} runs", { runs: option.value })
              }
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
            aria-label={t("Open more scoring actions")}
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
                minWidth: { xs: 250, sm: 280 },
                color: "var(--app-accent-text, #185a9d)",
                fontFamily: 'Montserrat, Roboto, Arial, sans-serif',
                p: 1.2,
              },
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 1,
              }}
            >
              <Button
                data-ga-click="undo_from_more_menu"
                onClick={handleUndo}
                startIcon={<UndoIcon />}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 800,
                  minHeight: 50,
                  color: "#232526",
                  background: "rgba(255,255,255,0.72)",
                }}
              >
                {t("Undo")}
              </Button>
              <Button
                data-ga-click="score_three_runs"
                onClick={handleThreeRuns}
                startIcon={<SportsCricketIcon />}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 800,
                  minHeight: 50,
                  color: "var(--app-accent-text, #185a9d)",
                  background: "rgba(255,255,255,0.72)",
                }}
              >
                {t("3 runs")}
              </Button>
              <Button
                data-ga-click="wide_plus_extra_runs"
                onClick={() => {
                  handleClose();
                  setWidePickerOpen(true);
                }}
                startIcon={<AddIcon />}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 800,
                  minHeight: 50,
                  color: "var(--app-accent-text, #185a9d)",
                  background: "rgba(255,255,255,0.72)",
                }}
              >
                {t("Wide + Extra")}
              </Button>
              <Button
                data-ga-click="run_out_plus_runs"
                onClick={() => {
                  handleClose();
                  setRunOutPickerOpen(true);
                }}
                startIcon={<ExposurePlusSharpIcon />}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 800,
                  minHeight: 50,
                  color: "#b71c1c",
                  background: "rgba(255,255,255,0.72)",
                }}
              >
                {t("Run Out + Runs")}
              </Button>
            </Box>
          </Menu>
          <Dialog
            open={widePickerOpen}
            onClose={() => setWidePickerOpen(false)}
            disableScrollLock
            fullWidth
            maxWidth="xs"
            PaperProps={{
              sx: {
                borderRadius: 4,
                background:
                  "linear-gradient(120deg, #e3f2fd 0%, color-mix(in srgb, var(--app-accent-start, #43cea2) 75%, white 25%) 100%)",
                boxShadow:
                  "0 8px 32px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 32%, transparent 68%)",
                width: { xs: "98vw", sm: "100%" },
                maxWidth: { xs: "calc(100vw - 16px)", sm: "none" },
                m: { xs: "8px", sm: 2 },
              },
            }}
          >
            <DialogTitle
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 800,
                pr: 6,
              }}
            >
              {t("Wide + Extra Runs")}
              <IconButton
                data-ga-click="close_wide_extra_picker"
                onClick={() => setWidePickerOpen(false)}
                sx={{ position: "absolute", right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Typography
                sx={{
                  color: "var(--app-accent-text, #185a9d)",
                  fontWeight: 600,
                  fontSize: "calc(14px * var(--app-font-scale, 1))",
                  mb: 1.2,
                }}
              >
                {t("Select extra runs on this wide ball")}
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 1 }}>
                {[1, 2, 3, 4].map((extraRuns) => (
                  <Button
                    key={extraRuns}
                    data-ga-click={`wide_plus_${extraRuns}`}
                    variant="contained"
                    onClick={() => handleExtraRuns(extraRuns + 1)}
                    aria-label={t("Wide plus {{runs}} runs", { runs: extraRuns })}
                    sx={{
                      minWidth: 0,
                      borderRadius: 2,
                      py: 1.2,
                      fontSize: "calc(16px * var(--app-font-scale, 1))",
                      fontWeight: 800,
                      background: "linear-gradient(120deg, #f7971e 0%, #ffd200 100%)",
                      color: "#fff",
                      "&:hover": {
                        background: "linear-gradient(120deg, #ffd200 0%, #f7971e 100%)",
                      },
                    }}
                  >
                    +{extraRuns}
                  </Button>
                ))}
              </Box>
            </DialogContent>
          </Dialog>
          <Dialog
            open={runOutPickerOpen}
            onClose={() => setRunOutPickerOpen(false)}
            disableScrollLock
            fullWidth
            maxWidth="xs"
            PaperProps={{
              sx: {
                borderRadius: 4,
                background:
                  "linear-gradient(120deg, #e3f2fd 0%, color-mix(in srgb, var(--app-accent-start, #43cea2) 75%, white 25%) 100%)",
                boxShadow:
                  "0 8px 32px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 32%, transparent 68%)",
                width: { xs: "98vw", sm: "100%" },
                maxWidth: { xs: "calc(100vw - 16px)", sm: "none" },
                m: { xs: "8px", sm: 2 },
              },
            }}
          >
            <DialogTitle
              sx={{
                color: "#b71c1c",
                fontWeight: 800,
                pr: 6,
              }}
            >
              {t("Run Out + Runs")}
              <IconButton
                data-ga-click="close_run_out_picker"
                onClick={() => setRunOutPickerOpen(false)}
                sx={{ position: "absolute", right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Typography
                sx={{
                  color: "var(--app-accent-text, #185a9d)",
                  fontWeight: 600,
                  fontSize: "calc(14px * var(--app-font-scale, 1))",
                  mb: 1.2,
                }}
              >
                {t("Select runs completed before run out")}
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 1 }}>
                {[1, 2, 3].map((runs) => (
                  <Button
                    key={runs}
                    data-ga-click={`run_out_plus_${runs}`}
                    variant="contained"
                    onClick={() => handleRunOut(runs)}
                    aria-label={t("Run out plus {{runs}} runs", { runs })}
                    sx={{
                      minWidth: 0,
                      borderRadius: 2,
                      py: 1.2,
                      fontSize: "calc(16px * var(--app-font-scale, 1))",
                      fontWeight: 800,
                      background: "linear-gradient(120deg, #ff512f 0%, #dd2476 100%)",
                      color: "#fff",
                      "&:hover": {
                        background: "linear-gradient(120deg, #dd2476 0%, #ff512f 100%)",
                      },
                    }}
                  >
                    +{runs}
                  </Button>
                ))}
              </Box>
            </DialogContent>
          </Dialog>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default React.memo(ScoringKeypad);
