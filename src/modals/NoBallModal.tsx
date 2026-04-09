import React from "react";
import Dialog from "@mui/material/Dialog";
import { Box, Button, DialogTitle, Paper, Typography } from "@mui/material";
import { noBallScoringOptions } from "../utils/constant";
import { BallEvent } from "../types/cricket";
import { useTranslation } from "react-i18next";
import ModalInfoButton from "../components/ModalInfoButton";

const getOptionMeta = (option: BallEvent) => {
  if (option.type === "wicket") {
    return {
      label: "W",
      title: "Wicket",
      description: "No-ball + wicket",
      background: "linear-gradient(90deg, #e53935 0%, #b71c1c 100%)",
    };
  }
  if (option.value === 6) {
    return {
      label: "6",
      title: "Six",
      description: "No-ball + 6 runs",
      background: "linear-gradient(90deg, #2e7d32 0%, #1b5e20 100%)",
    };
  }
  if (option.value === 4) {
    return {
      label: "4",
      title: "Four",
      description: "No-ball + 4 runs",
      background: "linear-gradient(90deg, #2e7d32 0%, #1b5e20 100%)",
    };
  }
  return {
    label: option.value.toString(),
    title: option.value === 0 ? "No run" : `${option.value} run${option.value > 1 ? "s" : ""}`,
    description: `No-ball + ${option.value}`,
    background:
      "linear-gradient(90deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 30%, #90caf9 70%) 0%, #64b5f6 100%)",
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
        '& .MuiDialog-paper': {
          borderRadius: 5,
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)',
          boxShadow: '0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)',
          border: '2px solid var(--app-accent-start, #43cea2)',
          backdropFilter: 'blur(8px)',
          maxWidth: { xs: "calc(100vw - 16px)", sm: 360 },
          width: { xs: "98vw", sm: "auto" },
          margin: "8px",
          p: { xs: 1.5, sm: 3 },
        },
      }}
    >
      <Paper
        sx={{
          padding: 2,
          justifyContent: "center",
          flexWrap: "wrap",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          borderRadius: 2,
          minHeight: 98,
        }}
      >
        <Box>
          <DialogTitle textAlign="center" sx={{ fontWeight: 700, fontSize: "calc(20px * var(--app-font-scale, 1))", color: 'var(--app-accent-text, #185a9d)', mb: 1, position: "relative" }}>
            {t("No-Ball: Add Runs")}
            <ModalInfoButton
              title={t("No-ball")}
              description={t(
                "An illegal delivery (like overstepping or dangerous bowling). The batting team gets an extra run and a free hit next ball."
              )}
              iconSx={{ position: "absolute", right: 8, top: 8 }}
            />
          </DialogTitle>
        </Box>
        <Typography
          sx={{
            textAlign: "center",
            color: "var(--app-accent-text, #185a9d)",
            fontSize: "calc(13px * var(--app-font-scale, 1))",
            mb: 1.5,
          }}
        >
          {t("No-ball already adds 1 run. Select additional runs or wicket.")}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(3, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))" },
            gap: 1.2,
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
                  py: 1.2,
                  px: 1,
                  minHeight: 68,
                  border: "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
                  background: meta.background,
                  color: "#fff",
                  boxShadow: "0 6px 16px 0 color-mix(in srgb, #185a9d 18%, transparent 82%)",
                  "&:hover": {
                    filter: "brightness(0.95)",
                  },
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.4 }}>
                  <Box sx={{ fontWeight: 900, fontSize: "calc(18px * var(--app-font-scale, 1))" }}>{meta.label}</Box>
                  <Box sx={{ fontWeight: 700, fontSize: "calc(12px * var(--app-font-scale, 1))" }}>{t(meta.title)}</Box>
                  <Box sx={{ fontSize: "calc(11px * var(--app-font-scale, 1))", opacity: 0.9 }}>{t(meta.description)}</Box>
                </Box>
              </Button>
            );
          })}
        </Box>
      </Paper>
    </Dialog>
  );
}
