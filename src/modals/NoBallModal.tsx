import React from "react";
import Dialog from "@mui/material/Dialog";
import { Box, Button, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { noBallScoringOptions } from "../utils/constant";
import { BallEvent } from "../types/cricket";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import SportsCricketIcon from "@mui/icons-material/SportsCricket";

const getOptionMeta = (option: BallEvent) => {
  if (option.type === "wicket") {
    return {
      label: "W",
      title: "Wicket",
      background: "linear-gradient(90deg, #e53935 0%, #b71c1c 100%)",
      icon: "wicket",
    };
  }
  if (option.value === 6) {
    return {
      label: "6",
      title: "Six",
      background: "linear-gradient(90deg, #2e7d32 0%, #1b5e20 100%)",
      icon: "run",
    };
  }
  if (option.value === 4) {
    return {
      label: "4",
      title: "Four",
      background: "linear-gradient(90deg, #2e7d32 0%, #1b5e20 100%)",
      icon: "run",
    };
  }
  return {
    label: option.value === 0 ? "NB" : `+${option.value}`,
    title:
      option.value === 0
        ? "No run"
        : `${option.value} run${option.value > 1 ? "s" : ""}`,
    background:
      option.value === 0
        ? "linear-gradient(90deg, #1fa2ff 0%, #12d8fa 100%)"
        : "linear-gradient(90deg, #3f9258 0%, #277043 100%)",
    icon: "run",
  };
};

export default function NoBallModal({
  open,
  handleClose,
  handleSubmit,
}: {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (event: BallEvent) => void;
}) {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      disableScrollLock
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 4,
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)",
          boxShadow:
            "0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
          border: "2px solid var(--app-accent-start, #43cea2)",
          backdropFilter: "blur(8px)",
          maxWidth: "94vw",
          width: { xs: "94vw", md: "50vw", sm: "94vw" },
          maxHeight: "calc(100dvh - 16px)",
          margin: "8px",
          p: { xs: 1.2, sm: 2 },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          color: "var(--app-accent-text, #185a9d)",
          fontWeight: 900,
          px: { xs: 1, sm: 1.5 },
          py: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
          <SportsCricketIcon />
          {t("No-Ball")}
        </Box>
        <IconButton
          data-ga-click="close_no_ball_modal"
          onClick={handleClose}
          aria-label={t("Close")}
          sx={{
            color: "var(--app-accent-text, #185a9d)",
            background: "rgba(255,255,255,0.78)",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 1, sm: 1.5 }, pb: 1.5 }}>
        <Typography
          sx={{
            color: "var(--app-accent-text, #185a9d)",
            fontSize: "calc(12px * var(--app-font-scale, 1))",
            fontWeight: 800,
            mb: 1,
          }}
        >
          {t("Base no-ball run is already included.")}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(3, minmax(0, 1fr))",
              sm: "repeat(6, minmax(0, 1fr))",
            },
            gap: 0.9,
            alignItems: "stretch",
          }}
        >
          {noBallScoringOptions.map((option) => {
            const meta = getOptionMeta(option);
            return (
              <Button
                key={`${option.type}-${option.value}`}
                data-ga-click={`no_ball_option_${option.type}_${option.value}`}
                onClick={() => handleSubmit(option)}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  py: 1,
                  px: 0.8,
                  minHeight: { xs: 70, sm: 78 },
                  border:
                    "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
                  background: meta.background,
                  color: "#fff",
                  boxShadow:
                    "0 6px 16px 0 color-mix(in srgb, #185a9d 18%, transparent 82%)",
                  "&:hover": {
                    filter: "brightness(0.95)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.3,
                  }}
                >
                  {meta.icon === "wicket" ? (
                    <PersonOffIcon sx={{ fontSize: 22 }} />
                  ) : (
                    <SportsCricketIcon sx={{ fontSize: 22 }} />
                  )}
                  <Box
                    sx={{
                      fontWeight: 900,
                      fontSize: "calc(20px * var(--app-font-scale, 1))",
                      lineHeight: 1,
                    }}
                  >
                    {meta.label}
                  </Box>
                  <Box
                    sx={{
                      fontWeight: 700,
                      fontSize: "calc(11px * var(--app-font-scale, 1))",
                      lineHeight: 1.1,
                    }}
                  >
                    {t(meta.title)}
                  </Box>
                </Box>
              </Button>
            );
          })}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
