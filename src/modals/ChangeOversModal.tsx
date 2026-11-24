import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { AddRounded, RemoveRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { getBallsPerOver, type MatchLengthMode } from "../types/cricket";

const MAX_OVERS = 50;
const MIN_BALLS = 5;
const MAX_BALLS = 300;

/**
 * Lets the scorer raise or lower the match length while the FIRST innings is
 * still in progress (e.g. a rain-shortened game). The caller is responsible
 * for only offering this during the first innings; this modal just makes sure
 * the new limit is never at or below what has already been bowled, so
 * changing it can't accidentally end the innings — "End Inning" does that.
 *
 * In "overs" mode the value is whole overs; in "balls" mode it is the total
 * number of legal deliveries per innings.
 */
export default function ChangeOversModal({
  open,
  matchLengthMode,
  targetOvers,
  totalBalls,
  currentOver,
  currentBallOfOver,
  onClose,
  onSubmit,
}: {
  open: boolean;
  matchLengthMode: MatchLengthMode;
  targetOvers: number;
  totalBalls: number;
  currentOver: number;
  currentBallOfOver: number;
  onClose: () => void;
  onSubmit: (next: { targetOvers: number; totalBalls: number }) => void;
}) {
  const { t } = useTranslation();
  const isBallsMode = matchLengthMode === "balls";
  const ballsPerOver = getBallsPerOver(matchLengthMode);
  const ballsBowled = currentOver * ballsPerOver + currentBallOfOver;

  // At least one more over / ball must remain to be bowled.
  const minValue = isBallsMode
    ? Math.max(MIN_BALLS, ballsBowled + 1)
    : Math.max(1, currentOver + 1);
  const maxValue = isBallsMode ? MAX_BALLS : MAX_OVERS;
  const currentValue = isBallsMode ? totalBalls : targetOvers;

  const [value, setValue] = useState<number>(currentValue);
  const [input, setInput] = useState<string>(String(currentValue));

  useEffect(() => {
    if (open) {
      setValue(currentValue);
      setInput(String(currentValue));
    }
  }, [open, currentValue]);

  const clamp = (n: number) => Math.min(maxValue, Math.max(minValue, n));
  const setBoth = (n: number) => {
    setValue(n);
    setInput(String(n));
  };

  const parsed = Number(input);
  const isValid =
    input.trim() !== "" &&
    Number.isInteger(parsed) &&
    parsed >= minValue &&
    parsed <= maxValue;
  const isUnchanged = isValid && parsed === currentValue;

  const handleSave = () => {
    if (!isValid || isUnchanged) return;
    if (isBallsMode) {
      onSubmit({ targetOvers: Math.ceil(parsed / ballsPerOver), totalBalls: parsed });
    } else {
      onSubmit({ targetOvers: parsed, totalBalls: parsed * ballsPerOver });
    }
  };

  const stepButtonSx = {
    width: 52,
    height: 52,
    color: "#fff",
    background:
      "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
    boxShadow:
      "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
    "&:hover": {
      background:
        "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
    },
    "&.Mui-disabled": { background: "#d6dde3", color: "#fff" },
  };

  return (
    <Dialog
      open={open}
      disableScrollLock
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 5,
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)",
          boxShadow:
            "0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
          border: "2px solid var(--app-accent-start, #43cea2)",
          maxWidth: "94vw",
          width: { xs: "94vw", sm: "420px" },
          margin: "8px",
          p: { xs: 1.5, sm: 3 },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: "calc(22px * var(--app-font-scale, 1))",
          color: "var(--app-accent-text, #185a9d)",
          textAlign: "center",
          pb: 1,
        }}
      >
        {isBallsMode ? t("Change Balls") : t("Change Overs")}
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 0 }}
      >
        <Typography
          sx={{
            fontWeight: 500,
            color: "var(--app-accent-text, #185a9d)",
            textAlign: "center",
            mb: 2,
          }}
        >
          {t("Adjust the match length while the first innings is in progress.")}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            data-ga-click="change_overs_decrease"
            aria-label={t("Decrease")}
            disabled={(isValid ? parsed : value) <= minValue}
            onClick={() => setBoth(clamp((isValid ? parsed : value) - 1))}
            sx={stepButtonSx}
          >
            <RemoveRounded fontSize="large" />
          </IconButton>
          <TextField
            id="change-overs-input"
            type="number"
            size="small"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              const n = Number(e.target.value);
              if (Number.isInteger(n)) setValue(n);
            }}
            onBlur={() => {
              const n = Number(input);
              setBoth(clamp(Number.isFinite(n) ? Math.round(n) : currentValue));
            }}
            inputProps={{
              min: minValue,
              max: maxValue,
              inputMode: "numeric",
              pattern: "[0-9]*",
              "aria-label": isBallsMode ? t("Balls") : t("Overs"),
              style: {
                textAlign: "center",
                fontWeight: 700,
                fontSize: "calc(28px * var(--app-font-scale, 1))",
                padding: "8px 0",
                width: 80,
              },
            }}
            sx={{
              background: "#fff",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
            }}
          />
          <IconButton
            data-ga-click="change_overs_increase"
            aria-label={t("Increase")}
            disabled={(isValid ? parsed : value) >= maxValue}
            onClick={() => setBoth(clamp((isValid ? parsed : value) + 1))}
            sx={stepButtonSx}
          >
            <AddRounded fontSize="large" />
          </IconButton>
        </Box>

        <Typography sx={{ mt: 1.5, fontSize: "calc(13px * var(--app-font-scale, 1))", color: "#555", textAlign: "center" }}>
          {isBallsMode
            ? t("Balls bowled: {{bowled}} · Allowed: {{min}}–{{max}}", {
                bowled: ballsBowled,
                min: minValue,
                max: maxValue,
              })
            : t("Overs bowled: {{bowled}} · Allowed: {{min}}–{{max}}", {
                bowled: `${currentOver}.${currentBallOfOver}`,
                min: minValue,
                max: maxValue,
              })}
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: "calc(13px * var(--app-font-scale, 1))", color: "#555", textAlign: "center" }}>
          {t("The second innings will use the same match length.")}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button
          data-ga-click="cancel_change_overs"
          onClick={onClose}
          color="secondary"
          variant="outlined"
          sx={{ fontWeight: 600, borderRadius: 2, px: 3, borderWidth: 2, background: "#fff" }}
        >
          {t("Cancel")}
        </Button>
        <Button
          data-ga-click="save_change_overs"
          onClick={handleSave}
          disabled={!isValid || isUnchanged}
          variant="contained"
          sx={{
            fontWeight: 700,
            borderRadius: 2,
            px: 3,
            color: "#fff",
            background:
              "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
            "&.Mui-disabled": { background: "#d6dde3", color: "#ffffff" },
          }}
        >
          {t("Update")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
