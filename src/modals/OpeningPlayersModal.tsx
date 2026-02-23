import React, { useMemo, useState } from "react";
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

interface OpeningPlayersModalProps {
  open: boolean;
  battingTeam: string;
  bowlingTeam: string;
  battingPlayers: string[];
  bowlingPlayers: string[];
  striker: string;
  nonStriker: string;
  bowler: string;
  onChange: (value: { striker: string; nonStriker: string; bowler: string }) => void;
  onConfirm: () => void;
}

const OpeningPlayersModal: React.FC<OpeningPlayersModalProps> = ({
  open,
  battingTeam,
  bowlingTeam,
  battingPlayers,
  bowlingPlayers,
  striker,
  nonStriker,
  bowler,
  onChange,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState("");

  const canSubmit = useMemo(
    () =>
      Boolean(
        striker &&
          nonStriker &&
          bowler &&
          striker !== nonStriker &&
          battingPlayers.includes(striker) &&
          battingPlayers.includes(nonStriker) &&
          bowlingPlayers.includes(bowler)
      ),
    [striker, nonStriker, bowler, battingPlayers, bowlingPlayers]
  );

  return (
    <Dialog
      open={open}
      disableScrollLock
      disableEscapeKeyDown
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
      <DialogTitle sx={{ fontWeight: 800, color: "#185a9d" }}>
        {t("Select Opening Players")}
      </DialogTitle>
      <DialogContent sx={{ width: "100%", px: { xs: 2, sm: 3 } }}>
        <Typography sx={{ mb: 1, color: "#185a9d", fontWeight: 600 }}>
          {t("Batting")}: {battingTeam} | {t("Bowling")}: {bowlingTeam}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
            {t("Opening Striker")} ({battingTeam})
          </Typography>
          <Select
            size="small"
            fullWidth
            value={striker}
            sx={{
              background: "#fff",
              borderRadius: 2,
              boxShadow: "0 1px 4px 0 #185a9d22",
            }}
            onChange={(e) => {
              setError("");
              onChange({ striker: e.target.value, nonStriker, bowler });
            }}
          >
            {battingPlayers.map((name) => (
              <MenuItem key={`open-striker-${name}`} value={name}>
                {t("Batting")} - {name}
              </MenuItem>
            ))}
          </Select>

          <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
            {t("Opening Non-Striker")} ({battingTeam})
          </Typography>
          <Select
            size="small"
            fullWidth
            value={nonStriker}
            sx={{
              background: "#fff",
              borderRadius: 2,
              boxShadow: "0 1px 4px 0 #185a9d22",
            }}
            onChange={(e) => {
              setError("");
              onChange({ striker, nonStriker: e.target.value, bowler });
            }}
          >
            {battingPlayers.map((name) => (
              <MenuItem
                key={`open-nonstriker-${name}`}
                value={name}
                disabled={name === striker}
              >
                {t("Batting")} - {name}
              </MenuItem>
            ))}
          </Select>

          <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
            {t("Opening Bowler")}
          </Typography>
          <Select
            size="small"
            fullWidth
            value={bowler}
            sx={{
              background: "#fff",
              borderRadius: 2,
              boxShadow: "0 1px 4px 0 #185a9d22",
            }}
            onChange={(e) => {
              setError("");
              onChange({ striker, nonStriker, bowler: e.target.value });
            }}
          >
            {bowlingPlayers.map((name) => (
              <MenuItem key={`open-bowler-${name}`} value={name}>
                {t("Bowling")} - {name}
              </MenuItem>
            ))}
          </Select>
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
                t(
                  "Please select striker, non-striker and bowler. Striker and non-striker must be different."
                )
              );
              return;
            }
            onConfirm();
          }}
          sx={primaryButtonSx}
        >
          {t("Start Scoring")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OpeningPlayersModal;
