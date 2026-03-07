import React, { useMemo, useState } from "react";
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
      <DialogTitle sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)" }}>
        {t("Select Opening Players")}
      </DialogTitle>
      <DialogContent sx={{ width: "100%", px: { xs: 2, sm: 3 } }}>
        <Typography sx={{ mb: 1, color: "var(--app-accent-text, #185a9d)", fontWeight: 600 }}>
          {t("Batting")}: {battingTeam} | {t("Bowling")}: {bowlingTeam}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "calc(14px * var(--app-font-scale, 1))" }}>
            {t("Opening Striker")} ({battingTeam})
          </Typography>
          <Select
            fullWidth
            value={striker}
            variant="standard"
            input={<InputBase />}
            sx={modalSelectSx}
            MenuProps={sharedSelectMenuProps}
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

          <Typography sx={{ fontWeight: 700, fontSize: "calc(14px * var(--app-font-scale, 1))" }}>
            {t("Opening Non-Striker")} ({battingTeam})
          </Typography>
          <Select
            fullWidth
            value={nonStriker}
            variant="standard"
            input={<InputBase />}
            sx={modalSelectSx}
            MenuProps={sharedSelectMenuProps}
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

          <Typography sx={{ fontWeight: 700, fontSize: "calc(14px * var(--app-font-scale, 1))" }}>
            {t("Opening Bowler")}
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
            <Typography sx={{ color: "#e53935", fontSize: "calc(13px * var(--app-font-scale, 1))" }}>{error}</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          data-ga-click="confirm_opening_players"
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
