"use client";

import React from "react";
import {
  Paper,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import CloseIcon from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import type { BallEvent } from "../types/cricket";
import { moreScoringOptions, scoringOptions } from "../utils/constant";
import { useTranslation } from "react-i18next";

interface ScoringKeypadProps {
  onEvent: (type: BallEvent["type"], value: number) => void;
  onUndo: () => void;
}

const runGradients: Record<number, string> = {
  0: "linear-gradient(120deg, #2f7d4d 0%, #1f6539 100%)",
  1: "linear-gradient(120deg, #3f9258 0%, #277043 100%)",
  2: "linear-gradient(120deg, #4fa86a 0%, #2c7b46 100%)",
  3: "linear-gradient(120deg, #4fa86a 0%, #2c7b46 100%)",
  4: "linear-gradient(120deg, #3d8ed0 0%, #2876b8 100%)",
  6: "linear-gradient(120deg, #b44be2 0%, #9536cf 100%)",
};

const stateStylesFor = (background: string, color: string) => ({
  "&:hover": {
    background,
    color,
    transform: "translateY(-1px)",
    boxShadow:
      "0 8px 20px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 38%, transparent 62%)",
  },
  "&:active": {
    background,
    color,
    transform: "translateY(0)",
  },
  "&:focus, &.Mui-focusVisible": {
    background,
    color,
  },
});

const eventColorFor = (option: BallEvent): Record<string, any> => {
  if (option.type === "wicket") {
    const background = "linear-gradient(120deg, #ff174f 0%, #e4003f 100%)";
    const color = "#fff";
    return {
      background,
      color,
      border: "none",
      textShadow: "0 2px 8px rgba(0,0,0,0.22)",
      ...stateStylesFor(background, color),
    };
  }
  if (option.type === "wide") {
    const background = "linear-gradient(120deg, #fde047 0%, #facc15 100%)";
    const color = "#1f2933";
    return {
      background,
      color,
      border: "none",
      textShadow: "0 1px 8px rgba(255, 255, 255, 0.45)",
      WebkitTapHighlightColor: "transparent",
      WebkitTouchCallout: "none",
      touchAction: "manipulation",
      userSelect: "none",
      ...stateStylesFor(background, color),
    };
  }
  if (option.type === "no-ball") {
    const background = "linear-gradient(120deg, #1fa2ff 0%, #12d8fa 100%)";
    const color = "#fff";
    return {
      background,
      color,
      border: "none",
      textShadow: "0 2px 8px rgba(0,0,0,0.18)",
      ...stateStylesFor(background, color),
    };
  }
  if (option.type === "run") {
    const background = runGradients[option.value] ?? runGradients[1];
    const color = "#fff";
    return {
      background,
      color,
      border: "1.5px solid rgba(255,255,255,0.24)",
      textShadow: "0 2px 8px rgba(0,0,0,0.18)",
      ...stateStylesFor(background, color),
    };
  }
  const background =
    "linear-gradient(120deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)";
  const color = "#fff";
  return {
    background,
    color,
    border: "none",
    textShadow: "0 2px 8px rgba(0,0,0,0.18)",
    ...stateStylesFor(background, color),
  };
};

const ScoringKeypad: React.FC<ScoringKeypadProps> = ({ onEvent, onUndo }) => {
  const { t } = useTranslation();
  const [widePickerOpen, setWidePickerOpen] = React.useState(false);
  const [morePickerOpen, setMorePickerOpen] = React.useState(false);
  const [extraPickerRuns, setExtraPickerRuns] = React.useState<number | null>(
    null,
  );
  const wideLongPressTimer = React.useRef<number | undefined>(undefined);
  const wideLongPressHandled = React.useRef(false);
  const widePointerActive = React.useRef(false);
  const suppressNextWideClick = React.useRef(false);
  const runLongPressTimer = React.useRef<number | undefined>(undefined);
  const runLongPressHandled = React.useRef(false);
  const runPointerActiveValue = React.useRef<number | null>(null);
  const suppressNextRunClick = React.useRef<Record<number, boolean>>({});
  const undoLongPressTimer = React.useRef<number | undefined>(undefined);
  const undoLongPressHandled = React.useRef(false);
  const undoPointerActive = React.useRef(false);
  const suppressNextUndoClick = React.useRef(false);

  const clearWideLongPressTimer = React.useCallback(() => {
    if (wideLongPressTimer.current !== undefined) {
      window.clearTimeout(wideLongPressTimer.current);
      wideLongPressTimer.current = undefined;
    }
  }, []);

  const clearRunLongPressTimer = React.useCallback(() => {
    if (runLongPressTimer.current !== undefined) {
      window.clearTimeout(runLongPressTimer.current);
      runLongPressTimer.current = undefined;
    }
  }, []);

  const clearUndoLongPressTimer = React.useCallback(() => {
    if (undoLongPressTimer.current !== undefined) {
      window.clearTimeout(undoLongPressTimer.current);
      undoLongPressTimer.current = undefined;
    }
  }, []);

  const handleWidePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!event.isPrimary) {
        return;
      }
      widePointerActive.current = true;
      wideLongPressHandled.current = false;
      clearWideLongPressTimer();
      wideLongPressTimer.current = window.setTimeout(() => {
        wideLongPressHandled.current = true;
        suppressNextWideClick.current = true;
        setWidePickerOpen(true);
      }, 500);
    },
    [clearWideLongPressTimer]
  );

  const handleWidePointerUp = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!event.isPrimary || !widePointerActive.current) {
        return;
      }
      clearWideLongPressTimer();
      widePointerActive.current = false;
      if (wideLongPressHandled.current) {
        wideLongPressHandled.current = false;
        return;
      }
    },
    [clearWideLongPressTimer]
  );

  const handleWidePointerCancel = React.useCallback(() => {
    clearWideLongPressTimer();
    widePointerActive.current = false;
    wideLongPressHandled.current = false;
  }, [clearWideLongPressTimer]);

  const handleRunPointerDown = React.useCallback(
    (value: number) => (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!event.isPrimary) {
        return;
      }
      runPointerActiveValue.current = value;
      runLongPressHandled.current = false;
      clearRunLongPressTimer();
      runLongPressTimer.current = window.setTimeout(() => {
        runLongPressHandled.current = true;
        suppressNextRunClick.current[value] = true;
        setExtraPickerRuns(value);
      }, 500);
    },
    [clearRunLongPressTimer],
  );

  const handleRunPointerUp = React.useCallback(
    (value: number) => (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!event.isPrimary || runPointerActiveValue.current !== value) {
        return;
      }
      clearRunLongPressTimer();
      runPointerActiveValue.current = null;
      if (runLongPressHandled.current) {
        runLongPressHandled.current = false;
        return;
      }
    },
    [clearRunLongPressTimer],
  );

  const handleRunPointerCancel = React.useCallback(() => {
    clearRunLongPressTimer();
    runPointerActiveValue.current = null;
    runLongPressHandled.current = false;
  }, [clearRunLongPressTimer]);

  const handleUndoPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!event.isPrimary) {
        return;
      }
      undoPointerActive.current = true;
      undoLongPressHandled.current = false;
      clearUndoLongPressTimer();
      undoLongPressTimer.current = window.setTimeout(() => {
        undoLongPressHandled.current = true;
        suppressNextUndoClick.current = true;
        setMorePickerOpen(true);
      }, 500);
    },
    [clearUndoLongPressTimer],
  );

  const handleUndoPointerUp = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!event.isPrimary || !undoPointerActive.current) {
        return;
      }
      clearUndoLongPressTimer();
      undoPointerActive.current = false;
      if (undoLongPressHandled.current) {
        undoLongPressHandled.current = false;
        return;
      }
    },
    [clearUndoLongPressTimer],
  );

  const handleUndoPointerCancel = React.useCallback(() => {
    clearUndoLongPressTimer();
    undoPointerActive.current = false;
    undoLongPressHandled.current = false;
  }, [clearUndoLongPressTimer]);

  React.useEffect(
    () => () => {
      clearWideLongPressTimer();
      clearRunLongPressTimer();
      clearUndoLongPressTimer();
    },
    [clearRunLongPressTimer, clearUndoLongPressTimer, clearWideLongPressTimer]
  );

  const handleUndo = () => {
    if (suppressNextUndoClick.current) {
      suppressNextUndoClick.current = false;
      return;
    }
    onUndo();
  };
  const handleExtraRuns = (runs: number) => {
    onEvent("wide", runs);
    setWidePickerOpen(false);
  };
  const handleMoreOption = (option: BallEvent) => {
    onEvent(option.type, option.value);
    setMorePickerOpen(false);
  };
  const handleExtraOption = (type: "bye" | "leg-bye") => {
    if (extraPickerRuns === null) return;
    onEvent(type, extraPickerRuns);
    setExtraPickerRuns(null);
  };
  const moreOptionMeta = (option: BallEvent) => {
    if (option.type === "bye") {
      return {
        label: option.value > 1 ? `B+${option.value}` : "B",
        title: option.value > 1 ? `Bye + ${option.value}` : "Bye",
        helper: "Team extra, legal ball",
        background: "linear-gradient(120deg, #fb923c 0%, #f97316 100%)",
        icon: <SportsCricketIcon sx={{ fontSize: 22 }} />,
      };
    }
    if (option.type === "leg-bye") {
      return {
        label: option.value > 1 ? `LB+${option.value}` : "LB",
        title: option.value > 1 ? `Leg Bye + ${option.value}` : "Leg Bye",
        helper: "Team extra, legal ball",
        background: "linear-gradient(120deg, #f59e0b 0%, #d97706 100%)",
        icon: <SportsCricketIcon sx={{ fontSize: 22 }} />,
      };
    }
    if (option.type === "penalty") {
      return {
        label: "+5",
        title: "Penalty Runs",
        helper: "Team extra only",
        background: "linear-gradient(120deg, #7c3aed 0%, #5b21b6 100%)",
        icon: <EmojiEventsIcon sx={{ fontSize: 22 }} />,
      };
    }
    return {
      label: option.value.toString(),
      title: `${option.value} Runs`,
      helper: "Batter runs",
      background: runGradients[option.value] ?? runGradients[1],
      icon: <SportsCricketIcon sx={{ fontSize: 22 }} />,
    };
  };
  const renderButtonLabel = (label: React.ReactNode, showLongPress = false) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.2,
        lineHeight: 1,
      }}
    >
      <Box>{label}</Box>
      {showLongPress ? (
        <Box
          sx={{
            fontSize: "calc(9px * var(--app-font-scale, 1))",
            fontWeight: 900,
            letterSpacing: 0.4,
            opacity: 0.92,
          }}
        >
          {t("LONG PRESS")}
        </Box>
      ) : null}
    </Box>
  );
  const buttonStyle = {
    height: { xs: 50, sm: 56, md: 62 },
    minWidth: 0,
    borderRadius: { xs: 2.4, sm: 3 },
    background:
      "linear-gradient(120deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
    color: "#fff",
    fontSize: { xs: "1.22rem", sm: "1.36rem", md: "1.5rem" },
    fontWeight: 800,
    boxShadow:
      "0 4px 16px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 28%, transparent 72%)",
    border: "none",
    transition:
      "background 0.2s, box-shadow 0.2s, transform 0.1s, opacity 0.2s",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    fontFamily: "Montserrat, Roboto, Arial, sans-serif",
    whiteSpace: "nowrap",
    px: { xs: 0.75, sm: 1 },
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow:
        "0 8px 20px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 38%, transparent 62%)",
    },
  };
  const actionButtonStyle = {
    ...buttonStyle,
    background: "rgba(255,255,255,0.82)",
    color: "var(--app-accent-text, #185a9d)",
    fontSize: { xs: "1.3rem" },
    fontWeight: 800,
    textShadow: "none",
    textTransform: "none",
    letterSpacing: 0,
    lineHeight: 1.05,
    whiteSpace: "normal",
    border: "1px solid rgba(255,255,255,0.78)",
    boxShadow:
      "0 3px 12px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 18%, transparent 82%)",
    "& .MuiButton-startIcon": {
      mr: { xs: 0.45, sm: 0.65 },
      ml: 0,
      flexShrink: 0,
      "& svg": {
        fontSize: { xs: 18, sm: 20, md: 22 },
      },
    },
    "&:hover": {
      transform: "translateY(-1px)",
      background: "#fff",
      color: "var(--app-accent-text, #185a9d)",
      boxShadow:
        "0 8px 18px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 24%, transparent 76%)",
    },
    "&:active, &:focus, &.Mui-focusVisible": {
      background: "#fff",
      color: "var(--app-accent-text, #185a9d)",
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
        border:
          "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 70%, transparent 30%)",
        boxShadow:
          "0 6px 20px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 30%, transparent 70%)",
        minHeight: { xs: 204, sm: 174, md: 138 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid
        container
        spacing={{ xs: 0.85, sm: 1, md: 1.1 }}
        justifyContent="center"
        alignItems="center"
      >
        {scoringOptions.map((option) => {
          const hasRunExtras =
            option.type === "run" && [1, 2, 4].includes(option.value);
          return (
            <Grid item xs={4} key={`${option.type}-${option.value}`}>
              <Button
                data-ga-click={`scoring_option_${option.type}_${option.value}`}
                fullWidth
                variant="contained"
                disableRipple={option.type === "wide" || hasRunExtras}
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
                  ...eventColorFor(option),
                }}
                onClick={() => {
                  if (option.type === "wide") {
                    if (suppressNextWideClick.current) {
                      suppressNextWideClick.current = false;
                      return;
                    }
                    onEvent(option.type, option.value);
                    return;
                  }
                  if (hasRunExtras) {
                    if (suppressNextRunClick.current[option.value]) {
                      suppressNextRunClick.current[option.value] = false;
                      return;
                    }
                  }
                  onEvent(option.type, option.value);
                }}
                onPointerDown={
                  option.type === "wide"
                    ? handleWidePointerDown
                    : hasRunExtras
                      ? handleRunPointerDown(option.value)
                      : undefined
                }
                onPointerUp={
                  option.type === "wide"
                    ? handleWidePointerUp
                    : hasRunExtras
                      ? handleRunPointerUp(option.value)
                      : undefined
                }
                onPointerLeave={
                  option.type === "wide"
                    ? handleWidePointerCancel
                    : hasRunExtras
                      ? handleRunPointerCancel
                      : undefined
                }
                onPointerCancel={
                  option.type === "wide"
                    ? handleWidePointerCancel
                    : hasRunExtras
                      ? handleRunPointerCancel
                      : undefined
                }
                onContextMenu={
                  option.type === "wide" || hasRunExtras
                    ? (event) => event.preventDefault()
                    : undefined
                }
              >
                {option.type === "wicket"
                  ? t("W")
                  : option.type === "wide"
                    ? renderButtonLabel(t("WD"), true)
                    : option.type === "no-ball"
                      ? t("NB")
                      : renderButtonLabel(
                          option.value.toString(),
                          hasRunExtras,
                        )}
              </Button>
            </Grid>
          );
        })}
        <Grid item xs={4}>
          <Button
            data-ga-click="undo_from_keypad"
            fullWidth
            variant="contained"
            onClick={handleUndo}
            onPointerDown={handleUndoPointerDown}
            onPointerUp={handleUndoPointerUp}
            onPointerLeave={handleUndoPointerCancel}
            onPointerCancel={handleUndoPointerCancel}
            onContextMenu={(event) => event.preventDefault()}
            startIcon={<UndoIcon />}
            sx={{
              ...actionButtonStyle,
              color: "#232526",
              "&:hover, &:active, &:focus, &.Mui-focusVisible": {
                background: "#fff",
                color: "#232526",
              },
            }}
            aria-label={t("Undo last scoring action")}
          >
            {renderButtonLabel(t("Undo"), true)}
          </Button>
        </Grid>
        <Grid item xs={12} sx={{ display: "contents" }}>
          <Dialog
            open={extraPickerRuns !== null}
            onClose={() => setExtraPickerRuns(null)}
            disableScrollLock
            sx={{
              "& .MuiDialog-paper": {
                borderRadius: 4,
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)",
                boxShadow:
                  "0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
                border: "2px solid var(--app-accent-start, #43cea2)",
                backdropFilter: "blur(8px)",
                maxWidth: "94vw",
                width: { xs: "94vw", md: "42vw", sm: "94vw" },
                maxHeight: "calc(100dvh - 16px)",
                margin: "8px",
                p: { xs: 1.2, sm: 2 },
              },
            }}
          >
            <DialogTitle
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 900,
                px: { xs: 1, sm: 1.5 },
                py: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                <SportsCricketIcon />
                {t("Extra Runs")}
              </Box>
              <IconButton
                data-ga-click="close_extra_run_picker"
                onClick={() => setExtraPickerRuns(null)}
                aria-label={t("Close")}
                sx={{
                  color: "var(--app-accent-text, #185a9d)",
                  background: "rgba(255,255,255,0.78)",
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ px: { xs: 1, sm: 1.5 }, pb: 1.5 }}>
              <Typography
                sx={{
                  color: "var(--app-accent-text, #185a9d)",
                  fontWeight: 800,
                  fontSize: "calc(12px * var(--app-font-scale, 1))",
                  mb: 1,
                }}
              >
                {t("Select bye or leg bye for this delivery")}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 0.9,
                  alignItems: "stretch",
                }}
              >
                {(["bye", "leg-bye"] as const).map((type) => {
                  const option: BallEvent = {
                    type,
                    value: extraPickerRuns ?? 0,
                  };
                  const meta = moreOptionMeta(option);
                  return (
                    <Button
                      key={type}
                      data-ga-click={`extra_run_${type}_${extraPickerRuns ?? 0}`}
                      onClick={() => handleExtraOption(type)}
                      aria-label={t(meta.title)}
                      sx={{
                        textTransform: "none",
                        minWidth: 0,
                        borderRadius: 2,
                        py: 1,
                        px: 0.8,
                        minHeight: { xs: 78, sm: 84 },
                        border:
                          "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
                        background: meta.background,
                        color: "#fff",
                        boxShadow:
                          "0 6px 16px 0 color-mix(in srgb, #185a9d 18%, transparent 82%)",
                        "&:hover": {
                          background: meta.background,
                          color: "#fff",
                          filter: "brightness(0.95)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.35,
                        }}
                      >
                        {meta.icon}
                        <Box
                          sx={{
                            fontWeight: 900,
                            fontSize: "calc(20px * var(--app-font-scale, 1))",
                            lineHeight: 1,
                          }}
                        >
                          {meta.label}
                        </Box>
                        <Box
                          sx={{
                            fontWeight: 800,
                            fontSize: "calc(11px * var(--app-font-scale, 1))",
                            lineHeight: 1.05,
                          }}
                        >
                          {t(meta.title)}
                        </Box>
                        <Box
                          sx={{
                            fontWeight: 700,
                            fontSize: "calc(9px * var(--app-font-scale, 1))",
                            lineHeight: 1.05,
                            opacity: 0.86,
                          }}
                        >
                          {t(meta.helper)}
                        </Box>
                      </Box>
                    </Button>
                  );
                })}
              </Box>
            </DialogContent>
          </Dialog>
          <Dialog
            open={morePickerOpen}
            onClose={() => setMorePickerOpen(false)}
            disableScrollLock
            sx={{
              "& .MuiDialog-paper": {
                borderRadius: 4,
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)",
                boxShadow:
                  "0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
                border: "2px solid var(--app-accent-start, #43cea2)",
                backdropFilter: "blur(8px)",
                maxWidth: "94vw",
                width: { xs: "94vw", md: "50vw", sm: "94vw" },
                maxHeight: "calc(100dvh - 16px)",
                margin: "8px",
                p: { xs: 1.2, sm: 2 },
              },
            }}
          >
            <DialogTitle
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 900,
                px: { xs: 1, sm: 1.5 },
                py: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                <MoreHorizIcon />
                {t("More Options")}
              </Box>
              <IconButton
                data-ga-click="close_more_scoring_options"
                onClick={() => setMorePickerOpen(false)}
                aria-label={t("Close")}
                sx={{
                  color: "var(--app-accent-text, #185a9d)",
                  background: "rgba(255,255,255,0.78)",
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ px: { xs: 1, sm: 1.5 }, pb: 1.5 }}>
              <Typography
                sx={{
                  color: "var(--app-accent-text, #185a9d)",
                  fontWeight: 800,
                  fontSize: "calc(12px * var(--app-font-scale, 1))",
                  mb: 1,
                }}
              >
                {t("Select the scoring event for this delivery")}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, minmax(0, 1fr))",
                    sm: "repeat(5, minmax(0, 1fr))",
                  },
                  gap: 0.9,
                  alignItems: "stretch",
                }}
              >
                {moreScoringOptions.map((option) => {
                  const meta = moreOptionMeta(option);
                  return (
                    <Button
                      key={`${option.type}-${option.value}`}
                      data-ga-click={`more_scoring_${option.type}_${option.value}`}
                      onClick={() => handleMoreOption(option)}
                      aria-label={t(meta.title)}
                      sx={{
                        textTransform: "none",
                        minWidth: 0,
                        borderRadius: 2,
                        py: 1,
                        px: 0.8,
                        minHeight: { xs: 78, sm: 84 },
                        border:
                          "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
                        background: meta.background,
                        color: "#fff",
                        boxShadow:
                          "0 6px 16px 0 color-mix(in srgb, #185a9d 18%, transparent 82%)",
                        "&:hover": {
                          background: meta.background,
                          color: "#fff",
                          filter: "brightness(0.95)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.35,
                        }}
                      >
                        {meta.icon}
                        <Box
                          sx={{
                            fontWeight: 900,
                            fontSize: "calc(20px * var(--app-font-scale, 1))",
                            lineHeight: 1,
                          }}
                        >
                          {meta.label}
                        </Box>
                        <Box
                          sx={{
                            fontWeight: 800,
                            fontSize: "calc(11px * var(--app-font-scale, 1))",
                            lineHeight: 1.05,
                          }}
                        >
                          {t(meta.title)}
                        </Box>
                        <Box
                          sx={{
                            fontWeight: 700,
                            fontSize: "calc(9px * var(--app-font-scale, 1))",
                            lineHeight: 1.05,
                            opacity: 0.86,
                          }}
                        >
                          {t(meta.helper)}
                        </Box>
                      </Box>
                    </Button>
                  );
                })}
              </Box>
            </DialogContent>
          </Dialog>
          <Dialog
            open={widePickerOpen}
            onClose={() => setWidePickerOpen(false)}
            disableScrollLock
            sx={{
              "& .MuiDialog-paper": {
                borderRadius: 4,
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)",
                boxShadow:
                  "0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
                border: "2px solid var(--app-accent-start, #43cea2)",
                backdropFilter: "blur(8px)",
                maxWidth: "94vw",
                width: { xs: "94vw", md: "50vw", sm: "94vw" },
                maxHeight: "calc(100dvh - 16px)",
                margin: "8px",
                p: { xs: 1.2, sm: 2 },
              },
            }}
          >
            <DialogTitle
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 900,
                px: { xs: 1, sm: 1.5 },
                py: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                <SportsCricketIcon />
                {t("Wide Runs")}
              </Box>
              <IconButton
                data-ga-click="close_wide_extra_picker"
                onClick={() => setWidePickerOpen(false)}
                aria-label={t("Close")}
                sx={{
                  color: "var(--app-accent-text, #185a9d)",
                  background: "rgba(255,255,255,0.78)",
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ px: { xs: 1, sm: 1.5 }, pb: 1.5 }}>
              <Typography
                sx={{
                  color: "var(--app-accent-text, #185a9d)",
                  fontWeight: 800,
                  fontSize: "calc(12px * var(--app-font-scale, 1))",
                  mb: 1,
                }}
              >
                {t("Select runs completed on this wide ball")}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(3, minmax(0, 1fr))",
                    sm: "repeat(5, minmax(0, 1fr))",
                  },
                  gap: 0.9,
                  alignItems: "stretch",
                }}
              >
                {[0, 1, 2, 3, 4].map((extraRuns) => (
                  <Button
                    key={extraRuns}
                    data-ga-click={`wide_plus_${extraRuns}`}
                    onClick={() => handleExtraRuns(extraRuns + 1)}
                    aria-label={t("Wide plus {{runs}} runs", {
                      runs: extraRuns,
                    })}
                    sx={{
                      textTransform: "none",
                      minWidth: 0,
                      borderRadius: 2,
                      py: 1,
                      px: 0.8,
                      minHeight: { xs: 70, sm: 78 },
                      border:
                        "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
                      background:
                        extraRuns === 0
                          ? "linear-gradient(120deg, #fde047 0%, #facc15 100%)"
                          : runGradients[extraRuns] ?? runGradients[1],
                      color: extraRuns === 0 ? "#1f2933" : "#fff",
                      boxShadow:
                        "0 6px 16px 0 color-mix(in srgb, #185a9d 18%, transparent 82%)",
                      "&:hover": {
                        background:
                          extraRuns === 0
                            ? "linear-gradient(120deg, #fde047 0%, #facc15 100%)"
                            : runGradients[extraRuns] ?? runGradients[1],
                        color: extraRuns === 0 ? "#1f2933" : "#fff",
                        filter: "brightness(0.95)",
                      },
                      "&:active, &:focus, &.Mui-focusVisible": {
                        background:
                          extraRuns === 0
                            ? "linear-gradient(120deg, #fde047 0%, #facc15 100%)"
                            : runGradients[extraRuns] ?? runGradients[1],
                        color: extraRuns === 0 ? "#1f2933" : "#fff",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.3,
                      }}
                    >
                      <SportsCricketIcon sx={{ fontSize: 22 }} />
                      <Box
                        sx={{
                          fontWeight: 900,
                          fontSize: "calc(20px * var(--app-font-scale, 1))",
                          lineHeight: 1,
                        }}
                      >
                        {extraRuns === 0 ? t("WD") : `+${extraRuns}`}
                      </Box>
                      <Box
                        sx={{
                          fontWeight: 700,
                          fontSize: "calc(11px * var(--app-font-scale, 1))",
                          lineHeight: 1.1,
                        }}
                      >
                        {extraRuns === 0
                          ? t("wide")
                          : `${extraRuns} ${t("run")}`}
                      </Box>
                    </Box>
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
