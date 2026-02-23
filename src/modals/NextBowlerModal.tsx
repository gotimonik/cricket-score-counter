import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const primaryButtonSx = {
  textTransform: "none",
  fontWeight: 700,
  fontSize: 14,
  minHeight: 40,
  px: 2.25,
  py: 0.9,
  color: "#fff",
  borderRadius: 2,
  background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
  boxShadow: "0 2px 8px 0 #185a9d33",
  "&:hover": {
    background: "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)",
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
          background: "linear-gradient(135deg, #e0eafc 0%, #f8fffc 100%)",
          boxShadow: "0 8px 32px 0 #43cea255",
          border: "2px solid #43cea2",
          backdropFilter: "blur(8px)",
          width: { xs: "calc(100% - 16px)", sm: "100%" },
          m: { xs: 1, sm: 2 },
          p: { xs: 1.5, sm: 2 },
        },
      }}
    >
      <DialogTitle sx={{ color: "#185a9d", fontWeight: 800 }}>
        {t("Select Next Bowler")}
      </DialogTitle>
      <DialogContent sx={{ width: "100%", px: { xs: 2, sm: 3 } }}>
        <Typography sx={{ color: "#185a9d", fontWeight: 600, mb: 1.5 }}>
          {t("Over completed. Choose bowler for next over.")}
        </Typography>
        <Select
          fullWidth
          size="small"
          value={bowler}
          sx={{
            background: "#fff",
            borderRadius: 2,
            boxShadow: "0 1px 4px 0 #185a9d22",
          }}
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
          <Typography sx={{ color: "#e53935", fontSize: 13, mt: 1 }}>
            {t(
              "No eligible bowler available. Previous over bowler cannot bowl consecutive overs."
            )}
          </Typography>
        )}
        {error && (
          <Typography sx={{ color: "#e53935", fontSize: 13, mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
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
