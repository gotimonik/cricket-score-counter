import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";
import SportsBaseballIcon from "@mui/icons-material/SportsBaseball";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
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
  background:
    "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
  boxShadow:
    "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
  "&:hover": {
    background:
      "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
  },
};

const roleCardSx = {
  flex: "1 1 150px",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  textAlign: "left",
  textTransform: "none",
  borderRadius: 2,
  p: 1.2,
  minHeight: 74,
  borderWidth: 1.5,
  color: "var(--app-accent-text, #185a9d)",
  background: "#fff",
  "& .MuiButton-startIcon": {
    mt: 0.2,
  },
};

const playerButtonSx = {
  justifyContent: "flex-start",
  textTransform: "none",
  borderRadius: 2,
  minHeight: 44,
  px: 1.2,
  fontWeight: 800,
  color: "var(--app-accent-text, #185a9d)",
  background: "#fff",
  borderColor:
    "color-mix(in srgb, var(--app-accent-start, #43cea2) 42%, transparent 58%)",
  "& .MuiButton-startIcon": {
    mr: 0.8,
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
  onChange: (value: {
    striker: string;
    nonStriker: string;
    bowler: string;
  }) => void;
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
  const [activeSelection, setActiveSelection] = useState<
    "striker" | "nonStriker" | "bowler"
  >("striker");

  const canSubmit = useMemo(
    () =>
      Boolean(
        striker &&
        nonStriker &&
        bowler &&
        striker !== nonStriker &&
        battingPlayers.includes(striker) &&
        battingPlayers.includes(nonStriker) &&
        bowlingPlayers.includes(bowler),
      ),
    [striker, nonStriker, bowler, battingPlayers, bowlingPlayers],
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
          fontWeight: 800,
          color: "var(--app-accent-text, #185a9d)",
          pb: 1,
        }}
      >
        <SportsCricketIcon />
        {t("Select Opening Players")}
      </DialogTitle>
      <DialogContent
        sx={{
          width: "100%",
          px: { xs: 1.5, sm: 3 },
          overflowY: "auto",
          scrollbarGutter: "stable",
        }}
      >
        <Typography
          sx={{
            mb: 1.4,
            color: "var(--app-accent-text, #185a9d)",
            fontWeight: 800,
            fontSize: "calc(13px * var(--app-font-scale, 1))",
          }}
        >
          {t("Batting")}: {battingTeam} | {t("Bowling")}: {bowlingTeam}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.4 }}>
          <Box
            sx={{
              p: 1.2,
              borderRadius: 2,
              border:
                "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 50%, transparent 50%)",
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 12%, #ffffff 88%) 0%, #f8fffc 100%)",
              boxShadow:
                "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 14%, transparent 86%)",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant={activeSelection === "striker" ? "contained" : "outlined"}
                onClick={() => setActiveSelection("striker")}
                startIcon={<SportsCricketIcon />}
                sx={{
                  ...roleCardSx,
                  borderColor:
                    "color-mix(in srgb, var(--app-accent-start, #43cea2) 60%, transparent 40%)",
                  color:
                    activeSelection === "striker"
                      ? "#fff"
                      : "var(--app-accent-text, #185a9d)",
                  background:
                    activeSelection === "striker"
                      ? "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)"
                      : "#fff",
                }}
              >
                <Box>
                  <Box sx={{ fontSize: "calc(12px * var(--app-font-scale, 1))", opacity: 0.82 }}>
                    {t("Striker")}
                  </Box>
                  <Box sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                    {striker || t("Select")}
                  </Box>
                </Box>
              </Button>
              <Button
                variant={
                  activeSelection === "nonStriker" ? "contained" : "outlined"
                }
                onClick={() => setActiveSelection("nonStriker")}
                startIcon={<SportsCricketIcon />}
                sx={{
                  ...roleCardSx,
                  borderColor:
                    "color-mix(in srgb, var(--app-accent-start, #43cea2) 60%, transparent 40%)",
                  color:
                    activeSelection === "nonStriker"
                      ? "#fff"
                      : "var(--app-accent-text, #185a9d)",
                  background:
                    activeSelection === "nonStriker"
                      ? "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)"
                      : "#fff",
                }}
              >
                <Box>
                  <Box sx={{ fontSize: "calc(12px * var(--app-font-scale, 1))", opacity: 0.82 }}>
                    {t("Non-Striker")}
                  </Box>
                  <Box sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                    {nonStriker || t("Select")}
                  </Box>
                </Box>
              </Button>
              <Button
                variant={activeSelection === "bowler" ? "contained" : "outlined"}
                onClick={() => setActiveSelection("bowler")}
                startIcon={<SportsBaseballIcon />}
                sx={{
                  ...roleCardSx,
                  borderColor:
                    "color-mix(in srgb, var(--app-accent-end, #185a9d) 55%, transparent 45%)",
                  color:
                    activeSelection === "bowler"
                      ? "#fff"
                      : "var(--app-accent-text, #185a9d)",
                  background:
                    activeSelection === "bowler"
                      ? "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)"
                      : "#fff",
                }}
              >
                <Box>
                  <Box sx={{ fontSize: "calc(12px * var(--app-font-scale, 1))", opacity: 0.82 }}>
                    {t("Bowler")}
                  </Box>
                  <Box sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                    {bowler || t("Select")}
                  </Box>
                </Box>
              </Button>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button
                variant="outlined"
                startIcon={<SwapHorizIcon />}
                onClick={() => {
                  if (striker && nonStriker) {
                    onChange({
                      striker: nonStriker,
                      nonStriker: striker,
                      bowler,
                    });
                    setError("");
                  }
                }}
                disabled={!striker || !nonStriker}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: 1.5,
                  fontWeight: 800,
                  minHeight: 36,
                  borderColor:
                    "color-mix(in srgb, var(--app-accent-end, #185a9d) 40%, transparent 60%)",
                  color: "var(--app-accent-text, #185a9d)",
                }}
              >
                {t("Swap")}
              </Button>
            </Box>
          </Box>

          {activeSelection !== "bowler" ? (
            <Box
              sx={{
                p: 1.4,
                borderRadius: 2,
                border:
                  "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 50%, transparent 50%)",
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 10%, #ffffff 90%) 0%, #f8fffc 100%)",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: "calc(14px * var(--app-font-scale, 1))",
                  mb: 1,
                  color: "var(--app-accent-text, #185a9d)",
                }}
              >
                {activeSelection === "striker" ? t("Striker") : t("Non-Striker")}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 0.9,
                }}
              >
              {battingPlayers.map((name) => {
                const selected = name === striker || name === nonStriker;
                const selectedForActiveSlot =
                  activeSelection === "striker"
                    ? name === striker
                    : name === nonStriker;
                const roleText =
                  name === striker
                    ? t("Striker")
                    : name === nonStriker
                      ? t("Non-Striker")
                      : "";
                return (
                  <Button
                    key={`batting-pick-${name}`}
                    variant={selected ? "contained" : "outlined"}
                    startIcon={
                      selectedForActiveSlot ? (
                        <CheckCircleIcon />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )
                    }
                    onClick={() => {
                      setError("");
                      if (activeSelection === "striker") {
                        if (name === nonStriker) {
                          onChange({
                            striker: name,
                            nonStriker: striker,
                            bowler,
                          });
                        } else {
                          onChange({ striker: name, nonStriker, bowler });
                        }
                        setActiveSelection(nonStriker ? "bowler" : "nonStriker");
                      } else {
                        if (name === striker) {
                          onChange({
                            striker: nonStriker,
                            nonStriker: name,
                            bowler,
                          });
                        } else {
                          onChange({ striker, nonStriker: name, bowler });
                        }
                        setActiveSelection(striker ? "bowler" : "striker");
                      }
                    }}
                    sx={{
                      ...playerButtonSx,
                      borderColor:
                        "color-mix(in srgb, var(--app-accent-start, #43cea2) 55%, transparent 45%)",
                      color: selected
                        ? "#fff"
                        : "var(--app-accent-text, #185a9d)",
                      background: selected
                        ? "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)"
                        : "color-mix(in srgb, var(--app-accent-start, #43cea2) 10%, #fff 90%)",
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Box sx={{ lineHeight: 1.1 }}>{name}</Box>
                      {roleText ? (
                        <Box sx={{ fontSize: "calc(11px * var(--app-font-scale, 1))", opacity: 0.82 }}>
                          {roleText}
                        </Box>
                      ) : null}
                    </Box>
                  </Button>
                );
              })}
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                p: 1.4,
                borderRadius: 2,
                border:
                  "1.5px solid color-mix(in srgb, var(--app-accent-end, #185a9d) 45%, transparent 55%)",
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-end, #185a9d) 10%, #ffffff 90%) 0%, #f8fffc 100%)",
              }}
            >
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.7,
                  fontWeight: 900,
                  fontSize: "calc(14px * var(--app-font-scale, 1))",
                  mb: 1,
                  color: "var(--app-accent-text, #185a9d)",
                }}
              >
                <SportsBaseballIcon fontSize="small" />
                {t("Bowler")}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 0.9,
                }}
              >
              {bowlingPlayers.map((name) => {
                const selected = name === bowler;
                return (
                  <Button
                    key={`bowler-pick-${name}`}
                    variant={selected ? "contained" : "outlined"}
                    startIcon={
                      selected ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />
                    }
                    onClick={() => {
                      setError("");
                      onChange({ striker, nonStriker, bowler: name });
                    }}
                    sx={{
                      ...playerButtonSx,
                      borderColor:
                        "color-mix(in srgb, var(--app-accent-end, #185a9d) 55%, transparent 45%)",
                      color: selected
                        ? "#fff"
                        : "var(--app-accent-text, #185a9d)",
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
          )}
          <Divider />
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
          data-ga-click="confirm_opening_players"
          variant="contained"
          onClick={() => {
            if (!canSubmit) {
              setError(
                t(
                  "Please select striker, non-striker and bowler. Striker and non-striker must be different.",
                ),
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
