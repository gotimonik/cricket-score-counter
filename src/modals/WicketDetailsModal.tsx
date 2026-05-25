import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import GavelIcon from "@mui/icons-material/Gavel";
import { useTranslation } from "react-i18next";
import type { WicketType } from "../types/cricket";

const primaryButtonSx = {
  textTransform: "none",
  fontWeight: 700,
  fontSize: "calc(14px * var(--app-font-scale, 1))",
  minHeight: 40,
  px: 2.25,
  py: 0.9,
  color: "#fff",
  borderRadius: 2,
  background:
    "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
  boxShadow:
    "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
  "&:hover": {
    background:
      "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
  },
};

const selectionGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
  gap: 0.9,
};

const optionButtonSx = {
  justifyContent: "flex-start",
  textTransform: "none",
  borderRadius: 2,
  minHeight: 44,
  px: 1.2,
  fontWeight: 800,
  color: "var(--app-accent-text, #185a9d)",
  background: "#fff",
  borderColor:
    "color-mix(in srgb, var(--app-accent-start, #43cea2) 45%, transparent 55%)",
  "& .MuiButton-startIcon": {
    mr: 0.8,
  },
};

const sectionSx = {
  p: 1.4,
  borderRadius: 2,
  border:
    "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 46%, transparent 54%)",
  background:
    "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 10%, #ffffff 90%) 0%, #f8fffc 100%)",
};

interface WicketDetailsModalProps {
  open: boolean;
  striker: string;
  nonStriker: string;
  fieldingPlayers: string[];
  availableIncomingBatters: string[];
  allowSinglePlayerMode?: boolean;
  initialWicketType?: WicketType;
  lockWicketType?: boolean;
  onConfirm: (payload: {
    outBatsman: string;
    incomingBatsman?: string;
    wicketType: WicketType;
    dismissalBy?: string;
    runOutRuns?: number;
  }) => void;
  onClose?: () => void;
}

const WicketDetailsModal: React.FC<WicketDetailsModalProps> = ({
  open,
  striker,
  nonStriker,
  fieldingPlayers,
  availableIncomingBatters,
  allowSinglePlayerMode = false,
  initialWicketType,
  lockWicketType = false,
  onConfirm,
  onClose,
}) => {
  const { t } = useTranslation();
  const incomingOptions = useMemo(
    () => availableIncomingBatters,
    [availableIncomingBatters],
  );
  const [outBatsman, setOutBatsman] = useState(striker);
  const [incomingBatsman, setIncomingBatsman] = useState(
    availableIncomingBatters[0] ?? "",
  );
  const [wicketType, setWicketType] = useState<WicketType>("bowled");
  const [dismissalBy, setDismissalBy] = useState("");
  const [runOutRuns, setRunOutRuns] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setOutBatsman(striker);
    setIncomingBatsman(availableIncomingBatters[0] ?? "");
    setWicketType(initialWicketType ?? "bowled");
    setDismissalBy(fieldingPlayers[0] ?? "");
    setRunOutRuns(0);
    setError("");
  }, [
    open,
    striker,
    availableIncomingBatters,
    fieldingPlayers,
    initialWicketType,
    allowSinglePlayerMode,
  ]);

  const activeBatters = useMemo(
    () => [striker, nonStriker].filter(Boolean),
    [striker, nonStriker],
  );
  const hasPlayerDetails = activeBatters.length > 0;
  const hasFieldingPlayers = fieldingPlayers.length > 0;
  const noIncomingBatter = availableIncomingBatters.length === 0;
  const canSubmit = useMemo(
    () =>
      Boolean(
        (!hasPlayerDetails ||
          (outBatsman &&
            (noIncomingBatter ||
              (incomingBatsman && outBatsman !== incomingBatsman)))) &&
        (!["caught", "run-out"].includes(wicketType) ||
          !hasFieldingPlayers ||
          dismissalBy.trim()),
      ),
    [
      dismissalBy,
      hasFieldingPlayers,
      hasPlayerDetails,
      incomingBatsman,
      noIncomingBatter,
      outBatsman,
      wicketType,
    ],
  );

  return (
    <Dialog
      open={open}
      disableScrollLock
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 5,
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)",
          boxShadow:
            "0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
          border: "2px solid var(--app-accent-start, #43cea2)",
          backdropFilter: "blur(8px)",
          maxWidth: "94vw",
          width: { xs: "94vw", md: "50vw", sm: "94vw" },
          maxHeight: "calc(100dvh - 16px)",
          m: { xs: "8px", sm: 2 },
          p: { xs: 1.5, sm: 2 },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "var(--app-accent-text, #185a9d)",
          fontWeight: 800,
          pb: 1,
        }}
      >
        <PersonOffIcon />
        {t("Wicket Details")}
      </DialogTitle>
      <DialogContent
        sx={{
          width: "100%",
          px: { xs: 1.5, sm: 3 },
          overflowY: "auto",
          scrollbarGutter: "stable",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
          {hasPlayerDetails && (
            <Box sx={sectionSx}>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.7,
                  color: "var(--app-accent-text, #185a9d)",
                  fontWeight: 900,
                  mb: 1,
                }}
              >
                <PersonOffIcon fontSize="small" />
                {t("Which batsman is out?")}
              </Typography>
              <Box sx={selectionGridSx}>
                {activeBatters.map((name) => {
                  const selected = outBatsman === name;
                  return (
                    <Button
                      key={`out-${name}`}
                      variant={selected ? "contained" : "outlined"}
                      startIcon={
                        selected ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />
                      }
                      onClick={() => {
                        setError("");
                        setOutBatsman(name);
                      }}
                      sx={{
                        ...optionButtonSx,
                        color: selected
                          ? "#fff"
                          : "var(--app-accent-text, #185a9d)",
                        background: selected
                          ? "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)"
                          : "color-mix(in srgb, var(--app-accent-start, #43cea2) 10%, #fff 90%)",
                      }}
                    >
                      {name}
                    </Button>
                  );
                })}
              </Box>
            </Box>
          )}
          <Box sx={sectionSx}>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              color: "var(--app-accent-text, #185a9d)",
              fontWeight: 900,
              mb: 1,
            }}
          >
            <SportsCricketIcon fontSize="small" />
            {t("Wicket type")}
          </Typography>
          <Box sx={selectionGridSx}>
            {[
              {
                value: "bowled",
                label: t("Bowled"),
                icon: <SportsCricketIcon />,
              },
              {
                value: "caught",
                label: t("Catch"),
                icon: <SportsBaseballIcon />,
              },
              {
                value: "lbw",
                label: t("LBW"),
                icon: <GavelIcon />,
              },
              {
                value: "run-out",
                label: t("Run Out"),
                icon: <PersonOffIcon />,
              },
            ].map((option) => {
              const selected = wicketType === option.value;
              return (
                <Button
                  key={`wicket-${option.value}`}
                  variant={selected ? "contained" : "outlined"}
                  disabled={lockWicketType}
                  startIcon={option.icon}
                  onClick={() => {
                    if (lockWicketType) return;
                    setError("");
                    setWicketType(option.value as WicketType);
                  }}
                  sx={{
                    ...optionButtonSx,
                    borderColor:
                      "color-mix(in srgb, var(--app-accent-end, #185a9d) 50%, transparent 50%)",
                    color: selected
                      ? "#fff"
                      : "var(--app-accent-text, #185a9d)",
                    background: selected
                      ? "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)"
                      : "color-mix(in srgb, var(--app-accent-end, #185a9d) 10%, #fff 90%)",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                    }}
                  >
                    <Box component="span">{option.label}</Box>
                    {selected ? (
                      <CheckCircleIcon fontSize="small" />
                    ) : (
                      <RadioButtonUncheckedIcon fontSize="small" />
                    )}
                  </Box>
                </Button>
              );
            })}
          </Box>
          </Box>
          {(wicketType === "caught" || wicketType === "run-out") &&
            hasFieldingPlayers && (
            <Box sx={{ ...sectionSx, display: "flex", flexDirection: "column", gap: 0.8 }}>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.7,
                  color: "var(--app-accent-text, #185a9d)",
                  fontWeight: 900,
                }}
              >
                {wicketType === "caught" ? (
                  <SportsBaseballIcon fontSize="small" />
                ) : (
                  <PersonOffIcon fontSize="small" />
                )}
                {wicketType === "caught" ? t("Caught by") : t("Run out by")}
              </Typography>
              <Box sx={selectionGridSx}>
                {fieldingPlayers.map((name) => {
                  const selected = dismissalBy === name;
                  return (
                    <Button
                      key={`dismissal-by-${name}`}
                      variant={selected ? "contained" : "outlined"}
                      startIcon={
                        wicketType === "caught" ? (
                          <SportsBaseballIcon />
                        ) : (
                          <PersonOffIcon />
                        )
                      }
                      onClick={() => {
                        setError("");
                        setDismissalBy(name);
                      }}
                      sx={{
                        ...optionButtonSx,
                        borderColor:
                          "color-mix(in srgb, var(--app-accent-end, #185a9d) 50%, transparent 50%)",
                        color: selected
                          ? "#fff"
                          : "var(--app-accent-text, #185a9d)",
                        background: selected
                          ? "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)"
                          : "color-mix(in srgb, var(--app-accent-end, #185a9d) 10%, #fff 90%)",
                      }}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 1,
                        }}
                      >
                        <Box component="span">{name}</Box>
                        {selected ? (
                          <CheckCircleIcon fontSize="small" />
                        ) : (
                          <RadioButtonUncheckedIcon fontSize="small" />
                        )}
                      </Box>
                    </Button>
                  );
                })}
              </Box>
            </Box>
          )}
          {wicketType === "run-out" && (
            <Box sx={sectionSx}>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.7,
                  color: "var(--app-accent-text, #185a9d)",
                  fontWeight: 900,
                  mb: 1,
                }}
              >
                <SportsCricketIcon fontSize="small" />
                {t("Runs completed")}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: 0.9,
                }}
              >
                {[0, 1, 2, 3].map((runs) => {
                  const selected = runOutRuns === runs;
                  return (
                    <Button
                      key={`run-out-runs-${runs}`}
                      variant={selected ? "contained" : "outlined"}
                      startIcon={
                        selected ? (
                          <CheckCircleIcon />
                        ) : (
                          <RadioButtonUncheckedIcon />
                        )
                      }
                      onClick={() => {
                        setError("");
                        setRunOutRuns(runs);
                      }}
                      sx={{
                        ...optionButtonSx,
                        justifyContent: "center",
                        color: selected
                          ? "#fff"
                          : "var(--app-accent-text, #185a9d)",
                        background: selected
                          ? "linear-gradient(90deg, #ff512f 0%, #dd2476 100%)"
                          : "color-mix(in srgb, #dd2476 8%, #fff 92%)",
                      }}
                    >
                      {runs}
                    </Button>
                  );
                })}
              </Box>
            </Box>
          )}
          {hasPlayerDetails && (
            <Box sx={sectionSx}>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.7,
                  color: "var(--app-accent-text, #185a9d)",
                  fontWeight: 900,
                  mb: 1,
                }}
              >
                <PersonAddAlt1Icon fontSize="small" />
                {t("Select new batsman")}
              </Typography>
              {incomingOptions.length > 0 ? (
                <Box sx={selectionGridSx}>
                  {incomingOptions.map((name) => {
                    const selected = incomingBatsman === name;
                    return (
                      <Button
                        key={`new-bat-${name}`}
                        variant={selected ? "contained" : "outlined"}
                        startIcon={
                          selected ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />
                        }
                        onClick={() => {
                          setError("");
                          setIncomingBatsman(name);
                        }}
                        sx={{
                          ...optionButtonSx,
                          color: selected
                            ? "#fff"
                            : "var(--app-accent-text, #185a9d)",
                          background: selected
                            ? "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)"
                            : "color-mix(in srgb, var(--app-accent-start, #43cea2) 10%, #fff 90%)",
                        }}
                      >
                        {name}
                      </Button>
                    );
                  })}
                </Box>
              ) : null}
            </Box>
          )}
          {hasPlayerDetails && !availableIncomingBatters.length && allowSinglePlayerMode && (
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontSize: "calc(13px * var(--app-font-scale, 1))",
              }}
            >
              {t(
                "No next batsman available. Continue with single batter mode.",
              )}
            </Typography>
          )}
          {hasPlayerDetails && !availableIncomingBatters.length && !allowSinglePlayerMode && (
            <Typography
              sx={{
                color: "#e53935",
                fontSize: "calc(13px * var(--app-font-scale, 1))",
              }}
            >
              {t(
                "No available incoming batsman left. Innings will end after this wicket.",
              )}
            </Typography>
          )}
          {error && (
            <Typography
              sx={{
                color: "#e53935",
                fontSize: "calc(13px * var(--app-font-scale, 1))",
              }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          data-ga-click="confirm_wicket_details"
          variant="contained"
          onClick={() => {
            if (!canSubmit) {
              setError(
                t(
                  "Please complete wicket details. Striker/non-striker replacement must be valid.",
                ),
              );
              return;
            }
            onConfirm({
              outBatsman,
              incomingBatsman: noIncomingBatter ? undefined : incomingBatsman,
              wicketType,
              dismissalBy: dismissalBy.trim(),
              runOutRuns: wicketType === "run-out" ? runOutRuns : 0,
            });
          }}
          sx={primaryButtonSx}
        >
          {t("Continue")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WicketDetailsModal;
