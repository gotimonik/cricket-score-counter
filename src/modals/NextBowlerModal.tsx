import React, { useEffect, useMemo, useState } from "react";
import {
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

interface NextBowlerModalProps {
  open: boolean;
  bowlers: string[];
  currentBowler: string;
  onConfirm: (bowler: string) => void;
}

const NextBowlerModal: React.FC<NextBowlerModalProps> = ({
  open,
  bowlers,
  currentBowler,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const [bowler, setBowler] = useState("");
  const [error, setError] = useState("");
  const allowedBowlers = useMemo(
    () => bowlers.filter((name) => name !== currentBowler),
    [bowlers, currentBowler]
  );

  useEffect(() => {
    if (!open) return;
    setBowler((prev) =>
      prev && allowedBowlers.includes(prev) ? prev : allowedBowlers[0] ?? ""
    );
    setError("");
  }, [open, allowedBowlers]);

  return (
    <Dialog
      open={open}
      disableScrollLock
      fullWidth
      maxWidth="xs"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 5,
          background: "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)",
          boxShadow: "0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
          border: "2px solid var(--app-accent-start, #43cea2)",
          backdropFilter: "blur(8px)",
          width: { xs: "98vw", sm: "100%" },
          maxWidth: { xs: "calc(100vw - 16px)", sm: "none" },
          m: { xs: "8px", sm: 2 },
          p: { xs: 1.5, sm: 2 },
        },
      }}
    >
      <DialogTitle sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 800 }}>
        {t("Select Next Bowler")}
      </DialogTitle>
      <DialogContent sx={{ width: "100%", px: { xs: 2, sm: 3 } }}>
        <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 600, mb: 1.5 }}>
          {t("Over completed. Choose bowler for next over.")}
        </Typography>
        <Select
          fullWidth
          value={bowler}
          variant="standard"
          input={<InputBase />}
          sx={modalSelectSx}
          MenuProps={sharedSelectMenuProps}
          onChange={(e) => {
            setError("");
            setBowler(e.target.value);
          }}
        >
          {allowedBowlers.map((name) => (
            <MenuItem key={`next-bowler-${name}`} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
        {!allowedBowlers.length && (
          <Typography sx={{ color: "#e53935", fontSize: "calc(13px * var(--app-font-scale, 1))", mt: 1 }}>
            {t(
              "No eligible bowler available. Previous over bowler cannot bowl consecutive overs."
            )}
          </Typography>
        )}
        {error && (
          <Typography sx={{ color: "#e53935", fontSize: "calc(13px * var(--app-font-scale, 1))", mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          data-ga-click="confirm_next_bowler"
          variant="contained"
          onClick={() => {
            if (!bowler) {
              setError(t("Please select a bowler."));
              return;
            }
            if (bowler === currentBowler) {
              setError(t("Same bowler cannot bowl the next over."));
              return;
            }
            onConfirm(bowler);
          }}
          disabled={!allowedBowlers.length}
          sx={primaryButtonSx}
        >
          {t("Confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NextBowlerModal;
