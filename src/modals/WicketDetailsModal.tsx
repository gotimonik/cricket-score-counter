import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputBase,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { modalSelectSx, sharedSelectMenuProps } from "../utils/selectStyles";

const primaryButtonSx = {
  textTransform: "none",
  fontWeight: 700,
  fontSize: "calc(14px * var(--app-font-scale, 1))",
  minHeight: 40,
  px: 2.25,
  py: 0.9,
  color: "#fff",
  borderRadius: 2,
  background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
  boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
  "&:hover": {
    background: "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
  },
};

interface WicketDetailsModalProps {
  open: boolean;
  striker: string;
  nonStriker: string;
  fieldingPlayers: string[];
  availableIncomingBatters: string[];
  initialWicketType?: "bowled" | "caught" | "run-out";
  lockWicketType?: boolean;
  onConfirm: (payload: {
    outBatsman: string;
    incomingBatsman: string;
    wicketType: "bowled" | "caught" | "run-out";
    dismissalBy?: string;
  }) => void;
  onClose?: () => void;
}

const WicketDetailsModal: React.FC<WicketDetailsModalProps> = ({
  open,
  striker,
  nonStriker,
  fieldingPlayers,
  availableIncomingBatters,
  initialWicketType,
  lockWicketType = false,
  onConfirm,
  onClose,
}) => {
  const { t } = useTranslation();
  const [outBatsman, setOutBatsman] = useState(striker);
  const [incomingBatsman, setIncomingBatsman] = useState(
    availableIncomingBatters[0] ?? ""
  );
  const [wicketType, setWicketType] = useState<"bowled" | "caught" | "run-out">(
    "bowled"
  );
  const [dismissalBy, setDismissalBy] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setOutBatsman(striker);
    setIncomingBatsman(availableIncomingBatters[0] ?? "");
    setWicketType(initialWicketType ?? "bowled");
    setDismissalBy(fieldingPlayers[0] ?? "");
    setError("");
  }, [open, striker, availableIncomingBatters, fieldingPlayers, initialWicketType]);

  const canSubmit = useMemo(
    () =>
      Boolean(
        outBatsman &&
          incomingBatsman &&
          outBatsman !== incomingBatsman &&
          (wicketType === "bowled" || dismissalBy.trim())
      ),
    [outBatsman, incomingBatsman, wicketType, dismissalBy]
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
          background: "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)",
          boxShadow: "0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
          border: "2px solid var(--app-accent-start, #43cea2)",
          backdropFilter: "blur(8px)",
          width: { xs: "calc(100% - 16px)", sm: "100%" },
          m: { xs: 1, sm: 2 },
          p: { xs: 1.5, sm: 2 },
        },
      }}
    >
      <DialogTitle sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 800 }}>
        {t("Wicket Details")}
      </DialogTitle>
      <DialogContent sx={{ width: "100%", px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 600 }}>
            {t("Which batsman is out?")}
          </Typography>
          <Select
            fullWidth
            value={outBatsman}
            variant="standard"
            input={<InputBase />}
            sx={modalSelectSx}
            MenuProps={sharedSelectMenuProps}
            onChange={(e) => {
              setError("");
              setOutBatsman(e.target.value);
            }}
          >
            {[striker, nonStriker].map((name) => (
              <MenuItem key={`out-${name}`} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
          <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 600 }}>
            {t("Wicket type")}
          </Typography>
          <Select
            fullWidth
            value={wicketType}
            disabled={lockWicketType}
            variant="standard"
            input={<InputBase />}
            sx={modalSelectSx}
            MenuProps={sharedSelectMenuProps}
            onChange={(e) => {
              if (lockWicketType) return;
              setError("");
              setWicketType(e.target.value as "bowled" | "caught" | "run-out");
            }}
          >
            <MenuItem value="bowled">{t("Bowled")}</MenuItem>
            <MenuItem value="caught">{t("Catch")}</MenuItem>
            <MenuItem value="run-out">{t("Run Out")}</MenuItem>
          </Select>
          {(wicketType === "caught" || wicketType === "run-out") && (
            <Select
              fullWidth
              value={dismissalBy}
              variant="standard"
              input={<InputBase />}
              sx={modalSelectSx}
              MenuProps={sharedSelectMenuProps}
              onChange={(e) => {
                setError("");
                setDismissalBy(e.target.value);
              }}
            >
              {fieldingPlayers.map((name) => (
                <MenuItem key={`dismissal-by-${name}`} value={name}>
                  {wicketType === "caught"
                    ? t("Caught by {{name}}", { name })
                    : t("Run out by {{name}}", { name })}
                </MenuItem>
              ))}
            </Select>
          )}
          <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 600 }}>
            {t("Select new batsman")}
          </Typography>
          <Select
            fullWidth
            value={incomingBatsman}
            variant="standard"
            input={<InputBase />}
            sx={modalSelectSx}
            MenuProps={sharedSelectMenuProps}
            onChange={(e) => {
              setError("");
              setIncomingBatsman(e.target.value);
            }}
          >
            {availableIncomingBatters.map((name) => (
              <MenuItem key={`new-bat-${name}`} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
          {!availableIncomingBatters.length && (
            <Typography sx={{ color: "#e53935", fontSize: "calc(13px * var(--app-font-scale, 1))" }}>
              {t("No available incoming batsman left.")}
            </Typography>
          )}
          {error && (
            <Typography sx={{ color: "#e53935", fontSize: "calc(13px * var(--app-font-scale, 1))" }}>{error}</Typography>
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
                  "Please complete wicket details. Striker/non-striker replacement must be valid."
                )
              );
              return;
            }
            onConfirm({
              outBatsman,
              incomingBatsman,
              wicketType,
              dismissalBy: dismissalBy.trim(),
            });
          }}
          disabled={!availableIncomingBatters.length}
          sx={primaryButtonSx}
        >
          {t("Continue")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WicketDetailsModal;
