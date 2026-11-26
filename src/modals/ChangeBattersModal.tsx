import React, { useEffect, useState } from "react";
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
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useTranslation } from "react-i18next";

export type ChangeBattersScope = "from-next-ball" | "whole-innings";

interface ChangeBattersModalProps {
  open: boolean;
  striker: string;
  nonStriker: string;
  /** Batters who can be picked: not out (includes the two at the crease). */
  candidates: string[];
  /** Batters who already appear in this innings' ball-by-ball log. */
  battedThisInnings: string[];
  /** Balls already scored with the current pair this innings. */
  hasBallsBowled: boolean;
  allowSinglePlayerMode?: boolean;
  onConfirm: (value: { striker: string; nonStriker: string; scope: ChangeBattersScope }) => void;
  onClose: () => void;
}

const sectionSx = {
  p: 1.4,
  borderRadius: 2,
  border: "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 46%, transparent 54%)",
  background:
    "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 10%, #ffffff 90%) 0%, #f8fffc 100%)",
} as const;

const choiceSx = (selected: boolean) => ({
  justifyContent: "flex-start",
  textTransform: "none",
  borderRadius: 2,
  minHeight: 44,
  px: 1.2,
  fontWeight: 800,
  textAlign: "left",
  color: selected ? "#fff" : "var(--app-accent-text, #185a9d)",
  borderColor: "color-mix(in srgb, var(--app-accent-start, #43cea2) 45%, transparent 55%)",
  background: selected
    ? "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)"
    : "color-mix(in srgb, var(--app-accent-start, #43cea2) 10%, #fff 90%)",
});

const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 900, mb: 1 }}>{children}</Typography>
);

/**
 * Fix the batters at the crease after the innings has started: swap who is
 * on strike, or pick different batters. When balls have already been bowled
 * the scorer says whether the change applies from the next ball, or whether
 * the batters were picked wrongly from the start (then the balls already
 * scored are moved to the right players).
 */
const ChangeBattersModal: React.FC<ChangeBattersModalProps> = ({
  open,
  striker,
  nonStriker,
  candidates,
  battedThisInnings,
  hasBallsBowled,
  allowSinglePlayerMode = false,
  onConfirm,
  onClose,
}) => {
  const { t } = useTranslation();
  const [nextStriker, setNextStriker] = useState(striker);
  const [nextNonStriker, setNextNonStriker] = useState(nonStriker);
  const [scope, setScope] = useState<ChangeBattersScope | "">("");

  useEffect(() => {
    if (!open) return;
    setNextStriker(striker);
    setNextNonStriker(nonStriker);
    setScope("");
  }, [open, striker, nonStriker]);

  const changed = nextStriker !== striker || nextNonStriker !== nonStriker;
  const isSwap = changed && nextStriker === nonStriker && nextNonStriker === striker;

  // Moving past balls to another name only works if that name hasn't batted
  // yet this innings (otherwise two players' innings would be merged), or if
  // it's a straight swap of the two batters at the crease.
  const newNames = [nextStriker, nextNonStriker].filter((n) => n && n !== striker && n !== nonStriker);
  const canFixHistory = isSwap || newNames.every((n) => !battedThisInnings.includes(n));
  const needsScope = hasBallsBowled && changed;

  const valid =
    Boolean(nextStriker) &&
    (Boolean(nextNonStriker) || allowSinglePlayerMode) &&
    nextStriker !== nextNonStriker &&
    changed &&
    (!needsScope || (scope && (scope !== "whole-innings" || canFixHistory)));

  const pick = (role: "striker" | "nonStriker", name: string) => {
    if (role === "striker") {
      if (name === nextNonStriker) setNextNonStriker(nextStriker);
      setNextStriker(name);
    } else {
      if (name === nextStriker) setNextStriker(nextNonStriker);
      setNextNonStriker(name);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      disableScrollLock
      sx={{ "& .MuiDialog-paper": { borderRadius: 4, m: { xs: "8px", sm: 2 }, maxHeight: "calc(100dvh - 16px)" } }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: "var(--app-accent-text, #185a9d)", fontWeight: 800, pb: 1 }}>
        <SwapVertIcon />
        {t("Change batters")}
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
        {striker && nonStriker && (
          <Button
            variant="outlined"
            startIcon={<SwapVertIcon />}
            onClick={() => {
              setNextStriker(nonStriker);
              setNextNonStriker(striker);
            }}
            sx={{ ...choiceSx(false), justifyContent: "center" }}
          >
            {t("Swap strike")}: {nonStriker} {t("faces next")}
          </Button>
        )}

        {(["striker", "nonStriker"] as const).map((role) => (
          <Box key={role} sx={sectionSx}>
            <Title>{role === "striker" ? t("On strike") : t("Non-striker")}</Title>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr) minmax(0, 1fr)", sm: "minmax(0, 1fr) minmax(0, 1fr)" }, gap: 0.8 }}>
              {candidates.map((name) => {
                const selected = (role === "striker" ? nextStriker : nextNonStriker) === name;
                return (
                  <Button
                    key={`${role}-${name}`}
                    variant={selected ? "contained" : "outlined"}
                    startIcon={selected ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                    onClick={() => pick(role, name)}
                    sx={choiceSx(selected)}
                  >
                    {name}
                  </Button>
                );
              })}
            </Box>
          </Box>
        ))}

        {needsScope && (
          <Box sx={sectionSx}>
            <Title>{t("What went wrong?")}</Title>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
              {([
                {
                  value: "whole-innings",
                  title: isSwap ? t("They were picked the wrong way round") : t("The wrong batter was picked"),
                  body: canFixHistory
                    ? t("Fix it from the start: the runs and balls already scored move to the right players.")
                    : t("Can't fix past balls: one of these players has already batted this innings."),
                  disabled: !canFixHistory,
                },
                {
                  value: "from-next-ball",
                  title: t("Only from the next ball"),
                  body: t("Balls already scored stay as they are, e.g. the strike got mixed up after a run."),
                  disabled: false,
                },
              ] as const).map((option) => {
                const selected = scope === option.value;
                return (
                  <Button
                    key={option.value}
                    variant={selected ? "contained" : "outlined"}
                    disabled={option.disabled}
                    startIcon={selected ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                    onClick={() => setScope(option.value)}
                    sx={{ ...choiceSx(selected), alignItems: "flex-start", py: 1 }}
                  >
                    <Box component="span" sx={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
                      <span>{option.title}</span>
                      <Box component="span" sx={{ fontSize: "calc(12px * var(--app-font-scale, 1))", fontWeight: 600, opacity: 0.85, mt: 0.25 }}>
                        {option.body}
                      </Box>
                    </Box>
                  </Button>
                );
              })}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none", fontWeight: 800 }}>
          {t("Cancel")}
        </Button>
        <Button
          variant="contained"
          disabled={!valid}
          data-ga-click="confirm_change_batters"
          onClick={() =>
            onConfirm({
              striker: nextStriker,
              nonStriker: nextNonStriker,
              scope: needsScope && scope ? scope : "from-next-ball",
            })
          }
          sx={{
            textTransform: "none",
            fontWeight: 800,
            borderRadius: 2,
            background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
          }}
        >
          {t("Save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeBattersModal;
