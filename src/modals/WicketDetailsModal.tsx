import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

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
        Wicket Details
      </DialogTitle>
      <DialogContent sx={{ width: "100%", px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography sx={{ color: "#185a9d", fontWeight: 600 }}>
            Which batsman is out?
          </Typography>
          <Select
            size="small"
            fullWidth
            value={outBatsman}
            sx={{
              background: "#fff",
              borderRadius: 2,
              boxShadow: "0 1px 4px 0 #185a9d22",
            }}
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
          <Typography sx={{ color: "#185a9d", fontWeight: 600 }}>
            Wicket type
          </Typography>
          <Select
            size="small"
            fullWidth
            value={wicketType}
            disabled={lockWicketType}
            sx={{
              background: "#fff",
              borderRadius: 2,
              boxShadow: "0 1px 4px 0 #185a9d22",
            }}
            onChange={(e) => {
              if (lockWicketType) return;
              setError("");
              setWicketType(e.target.value as "bowled" | "caught" | "run-out");
            }}
          >
            <MenuItem value="bowled">Bowled</MenuItem>
            <MenuItem value="caught">Catch</MenuItem>
            <MenuItem value="run-out">Run Out</MenuItem>
          </Select>
          {(wicketType === "caught" || wicketType === "run-out") && (
            <Select
              size="small"
              fullWidth
              value={dismissalBy}
              sx={{
                background: "#fff",
                borderRadius: 2,
                boxShadow: "0 1px 4px 0 #185a9d22",
              }}
              onChange={(e) => {
                setError("");
                setDismissalBy(e.target.value);
              }}
            >
              {fieldingPlayers.map((name) => (
                <MenuItem key={`dismissal-by-${name}`} value={name}>
                  {wicketType === "caught" ? `Caught by ${name}` : `Run out by ${name}`}
                </MenuItem>
              ))}
            </Select>
          )}
          <Typography sx={{ color: "#185a9d", fontWeight: 600 }}>
            Select new batsman
          </Typography>
          <Select
            size="small"
            fullWidth
            value={incomingBatsman}
            sx={{
              background: "#fff",
              borderRadius: 2,
              boxShadow: "0 1px 4px 0 #185a9d22",
            }}
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
            <Typography sx={{ color: "#e53935", fontSize: 13 }}>
              No available incoming batsman left.
            </Typography>
          )}
          {error && (
            <Typography sx={{ color: "#e53935", fontSize: 13 }}>{error}</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="contained"
          onClick={() => {
            if (!canSubmit) {
              setError(
                "Please complete wicket details. Striker/non-striker replacement must be valid."
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
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WicketDetailsModal;
