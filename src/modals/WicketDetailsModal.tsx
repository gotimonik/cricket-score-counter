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
import HealingIcon from "@mui/icons-material/Healing";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useTranslation } from "react-i18next";
import type { RunOutEnd, WicketType } from "../types/cricket";
import { battersAfterRunOut } from "../utils/runOut";

/** Retired hurt isn't a wicket, but it is picked from the same dialog. */
export type WicketChoice = WicketType | "retired-hurt";

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
  /** True when this delivery completes the over (ends swap afterwards). */
  overEndsAfterThisBall?: boolean;
  onConfirm: (payload: {
    outBatsman: string;
    incomingBatsman?: string;
    wicketType: WicketChoice;
    dismissalBy?: string;
    runOutRuns?: number;
    runOutEnd?: RunOutEnd;
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
  overEndsAfterThisBall = false,
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
  const [wicketType, setWicketType] = useState<WicketChoice>("bowled");
  const [runOutEnd, setRunOutEnd] = useState<RunOutEnd | "">("");
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
    setRunOutEnd("");
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
  const isRetiring = wicketType === "retired-hurt";
  const isRunOut = wicketType === "run-out";
  // Retiring with nobody to replace them only works in single-batter mode.
  const cannotRetire = isRetiring && hasPlayerDetails && noIncomingBatter && !allowSinglePlayerMode;
  const canSubmit = useMemo(
    () =>
      Boolean(
        (!hasPlayerDetails ||
          (outBatsman &&
            (noIncomingBatter ||
              (incomingBatsman && outBatsman !== incomingBatsman)))) &&
        (!["caught", "run-out"].includes(wicketType) ||
          !hasFieldingPlayers ||
          dismissalBy.trim()) &&
        (!isRunOut || !hasPlayerDetails || runOutEnd) &&
        !cannotRetire,
      ),
    [
      cannotRetire,
      dismissalBy,
      hasFieldingPlayers,
      hasPlayerDetails,
      incomingBatsman,
      isRunOut,
      noIncomingBatter,
      outBatsman,
      runOutEnd,
      wicketType,
    ],
  );

  // Who stands where after a run out: the new batter comes in at the end
  // where the wicket was broken, the surviving batter is at the other end.
  // The batter at the striker's end faces next, unless the over is over.
  const runOutPreview = useMemo(() => {
    if (!isRunOut || !hasPlayerDetails || !runOutEnd || !outBatsman) return null;
    const placed = battersAfterRunOut({
      striker,
      nonStriker,
      outBatsman,
      incoming: noIncomingBatter ? undefined : incomingBatsman,
      end: runOutEnd,
    });
    const facing = overEndsAfterThisBall && placed.nonStriker ? placed.nonStriker : placed.striker;
    return { atStrikerEnd: placed.striker, atOtherEnd: placed.nonStriker, facing };
  }, [hasPlayerDetails, incomingBatsman, isRunOut, noIncomingBatter, nonStriker, outBatsman, overEndsAfterThisBall, runOutEnd, striker]);

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
        {isRetiring ? t("Retired hurt") : t("Wicket Details")}
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
                {isRetiring ? t("Who is retiring hurt?") : t("Which batsman is out?")}
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
                      <Box component="span" sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.2 }}>
                        <span>{name}</span>
                        <Box component="span" sx={{ fontSize: "calc(11px * var(--app-font-scale, 1))", fontWeight: 700, opacity: 0.8 }}>
                          {name === striker ? t("On strike") : t("Non-striker")}
                        </Box>
                      </Box>
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
              ...(hasPlayerDetails
                ? [
                    {
                      value: "retired-hurt",
                      label: t("Retired hurt"),
                      icon: <HealingIcon />,
                    },
                  ]
                : []),
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
                    setWicketType(option.value as WicketChoice);
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
          {isRetiring && (
            <Typography
              sx={{
                color: cannotRetire ? "#e53935" : "var(--app-accent-text, #185a9d)",
                fontSize: "calc(13px * var(--app-font-scale, 1))",
                fontWeight: 600,
                px: 0.5,
              }}
            >
              {cannotRetire
                ? t("There's no one left to come in, so this batter can't retire. Turn on single batter mode to let the other batter carry on alone.")
                : t("Not a wicket and no ball is bowled. The new batter takes their place at the same end, and they can come back in later.")}
            </Typography>
          )}
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
          {isRunOut && hasPlayerDetails && (
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
                <SwapVertIcon fontSize="small" />
                {t("Where was the wicket broken?")}
              </Typography>
              <Box sx={selectionGridSx}>
                {([
                  { value: "striker", label: t("Striker's end"), hint: t("the batting end") },
                  { value: "non-striker", label: t("Non-striker's end"), hint: t("the bowler's end") },
                ] as const).map((option) => {
                  const selected = runOutEnd === option.value;
                  return (
                    <Button
                      key={`run-out-end-${option.value}`}
                      variant={selected ? "contained" : "outlined"}
                      startIcon={selected ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                      onClick={() => {
                        setError("");
                        setRunOutEnd(option.value);
                      }}
                      sx={{
                        ...optionButtonSx,
                        color: selected ? "#fff" : "var(--app-accent-text, #185a9d)",
                        background: selected
                          ? "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)"
                          : "color-mix(in srgb, var(--app-accent-start, #43cea2) 10%, #fff 90%)",
                      }}
                    >
                      <Box component="span" sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.2 }}>
                        <span>{option.label}</span>
                        <Box component="span" sx={{ fontSize: "calc(11px * var(--app-font-scale, 1))", fontWeight: 700, opacity: 0.8 }}>
                          {option.hint}
                        </Box>
                      </Box>
                    </Button>
                  );
                })}
              </Box>
              {runOutPreview && (
                <Box
                  sx={{
                    mt: 1.1,
                    p: 1,
                    borderRadius: 1.5,
                    background: "#fff",
                    border: "1px dashed color-mix(in srgb, var(--app-accent-end, #185a9d) 40%, transparent 60%)",
                    fontSize: "calc(13px * var(--app-font-scale, 1))",
                    color: "#223140",
                  }}
                >
                  <div>
                    {t("Striker's end")}: <b>{runOutPreview.atStrikerEnd || t("nobody (single batter)")}</b>
                  </div>
                  <div>
                    {t("Non-striker's end")}: <b>{runOutPreview.atOtherEnd || t("nobody (single batter)")}</b>
                  </div>
                  <Box sx={{ mt: 0.5, fontWeight: 800, color: "var(--app-accent-text, #185a9d)" }}>
                    {t("Next ball")}: {runOutPreview.facing} {t("faces")}
                    {overEndsAfterThisBall ? ` (${t("the over ends, so the batters swap ends")})` : ""}
                  </Box>
                </Box>
              )}
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
                {isRetiring ? t("Who comes in?") : t("Select new batsman")}
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
                isRunOut && hasPlayerDetails && !runOutEnd
                  ? t("Choose the end where the run out happened.")
                  : t(
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
              runOutEnd: isRunOut && runOutEnd ? runOutEnd : undefined,
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
