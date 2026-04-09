import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

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
  const [activeBattingSlot, setActiveBattingSlot] = useState<"striker" | "nonStriker">("striker");

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
          width: { xs: "98vw", sm: "auto" },
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              p: 1.6,
              borderRadius: 2,
              border: "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 50%, transparent 50%)",
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 12%, #ffffff 88%) 0%, #f8fffc 100%)",
              boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 14%, transparent 86%)",
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: "calc(15px * var(--app-font-scale, 1))" }}>
              {t("Pick the Opening Batters")}
            </Typography>
            <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontSize: "calc(13px * var(--app-font-scale, 1))", mb: 1.2 }}>
              {t("Tap a slot, then choose a player.")}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1.2 }}>
              <Button
                variant={activeBattingSlot === "striker" ? "contained" : "outlined"}
                onClick={() => setActiveBattingSlot("striker")}
                sx={{
                  textTransform: "none",
                  borderRadius: 999,
                  px: 2,
                  fontWeight: 700,
                  borderColor: "color-mix(in srgb, var(--app-accent-start, #43cea2) 60%, transparent 40%)",
                  color: activeBattingSlot === "striker" ? "#fff" : "var(--app-accent-text, #185a9d)",
                }}
              >
                {t("Striker")}: {striker || t("Select")}
              </Button>
              <Button
                variant={activeBattingSlot === "nonStriker" ? "contained" : "outlined"}
                onClick={() => setActiveBattingSlot("nonStriker")}
                sx={{
                  textTransform: "none",
                  borderRadius: 999,
                  px: 2,
                  fontWeight: 700,
                  borderColor: "color-mix(in srgb, var(--app-accent-start, #43cea2) 60%, transparent 40%)",
                  color: activeBattingSlot === "nonStriker" ? "#fff" : "var(--app-accent-text, #185a9d)",
                }}
              >
                {t("Non-Striker")}: {nonStriker || t("Select")}
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  if (striker && nonStriker) {
                    onChange({ striker: nonStriker, nonStriker: striker, bowler });
                    setError("");
                  }
                }}
                disabled={!striker || !nonStriker}
                sx={{
                  textTransform: "none",
                  borderRadius: 999,
                  px: 2,
                  fontWeight: 700,
                  borderColor: "color-mix(in srgb, var(--app-accent-end, #185a9d) 40%, transparent 60%)",
                  color: "var(--app-accent-text, #185a9d)",
                }}
              >
                {t("Swap")}
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {battingPlayers.map((name) => {
                const selected = name === striker || name === nonStriker;
                return (
                  <Button
                    key={`batting-pick-${name}`}
                    variant={selected ? "contained" : "outlined"}
                    onClick={() => {
                      setError("");
                      if (activeBattingSlot === "striker") {
                        if (name === nonStriker) {
                          onChange({ striker: name, nonStriker: striker, bowler });
                        } else {
                          onChange({ striker: name, nonStriker, bowler });
                        }
                        setActiveBattingSlot("nonStriker");
                      } else {
                        if (name === striker) {
                          onChange({ striker: nonStriker, nonStriker: name, bowler });
                        } else {
                          onChange({ striker, nonStriker: name, bowler });
                        }
                        setActiveBattingSlot("striker");
                      }
                    }}
                    sx={{
                      textTransform: "none",
                      borderRadius: 999,
                      px: 1.6,
                      fontWeight: 700,
                      minHeight: 36,
                      borderColor: "color-mix(in srgb, var(--app-accent-start, #43cea2) 55%, transparent 45%)",
                      color: selected ? "#fff" : "var(--app-accent-text, #185a9d)",
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

          <Box
            sx={{
              p: 1.6,
              borderRadius: 2,
              border: "1.5px solid color-mix(in srgb, var(--app-accent-end, #185a9d) 45%, transparent 55%)",
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-end, #185a9d) 10%, #ffffff 90%) 0%, #f8fffc 100%)",
              boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 14%, transparent 86%)",
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: "calc(15px * var(--app-font-scale, 1))" }}>
              {t("Pick the Opening Bowler")}
            </Typography>
            <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontSize: "calc(13px * var(--app-font-scale, 1))", mb: 1.2 }}>
              {t("Tap one bowler to start the innings.")}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {bowlingPlayers.map((name) => {
                const selected = name === bowler;
                return (
                  <Button
                    key={`bowler-pick-${name}`}
                    variant={selected ? "contained" : "outlined"}
                    onClick={() => {
                      setError("");
                      onChange({ striker, nonStriker, bowler: name });
                    }}
                    sx={{
                      textTransform: "none",
                      borderRadius: 999,
                      px: 1.6,
                      fontWeight: 700,
                      minHeight: 36,
                      borderColor: "color-mix(in srgb, var(--app-accent-end, #185a9d) 55%, transparent 45%)",
                      color: selected ? "#fff" : "var(--app-accent-text, #185a9d)",
                      background: selected
                        ? "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)"
                        : "color-mix(in srgb, var(--app-accent-end, #185a9d) 10%, #fff 90%)",
                    }}
                  >
                    {name}
                  </Button>
                );
              })}
            </Box>
          </Box>
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
