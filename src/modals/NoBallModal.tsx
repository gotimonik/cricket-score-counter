import React from "react";
import Dialog from "@mui/material/Dialog";
import { Box, DialogTitle, Paper } from "@mui/material";
import { noBallScoringOptions } from "../utils/constant";
import { BallEvent } from "../types/cricket";
import { useTranslation } from "react-i18next";

const getRunOptions = ({
  type,
  value,
}: {
  type: BallEvent["type"];
  value: number;
}) => {
  let backgroundColor = "#7e7e7e";
  let textColor = "#000000";

  if (value === 6) {
    backgroundColor = "#008800";
    textColor = "#FFFFFF";
  } else if (value === 4) {
    backgroundColor = "#008800";
    textColor = "#FFFFFF";
  }

  return (
    <Box
      key={value}
      sx={{
        width: 50,
        height: 50,
        borderRadius: "50%",
        backgroundColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 1,
        color: textColor,
        fontWeight: "bold",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#000000",
          color: "#FFFFFF",
        },
      }}
    >
      {type === "wicket" ? "W" : value.toString()}
    </Box>
  );
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
          maxWidth: 360,
          width: '95vw',
          p: { xs: 1.5, sm: 3 },
        },
      }}
    >
      {/* Brief info at top for user context */}
      <Box sx={{ mb: 2, p: 1, background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)', color: 'var(--app-accent-text, #185a9d)', fontWeight: 500, fontSize: "calc(15px * var(--app-font-scale, 1))" }}>
        <strong>{t("No-ball")}</strong>: {t("An illegal delivery (like overstepping or dangerous bowling). The batting team gets an extra run and a free hit next ball.")}
      </Box>
      <Paper
        sx={{
          padding: 2,
          justifyContent: "center",
          flexWrap: "wrap",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          borderRadius: 0,
          minHeight: 98,
        }}
      >
        <Box>
          <DialogTitle textAlign="center" sx={{ fontWeight: 700, fontSize: "calc(20px * var(--app-font-scale, 1))", color: 'var(--app-accent-text, #185a9d)', mb: 1 }}>
            {t("No-Ball: Add Runs")}
          </DialogTitle>
        </Box>
        <Box display="flex" justifyContent="center" flexWrap="wrap" sx={{ mt: 1 }}>
          {noBallScoringOptions.map((value) => (
            <Box
              key={`${value.type}-${value.value}`}
              data-ga-click={`no_ball_option_${value.type}_${value.value}`}
              onClick={() => handleSubmit(value)}
              sx={{ cursor: 'pointer' }}
            >
              {getRunOptions(value)}
            </Box>
          ))}
        </Box>
      </Paper>
    </Dialog>
  );
}
