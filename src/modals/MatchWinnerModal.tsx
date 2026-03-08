import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import ModalInfoButton from "../components/ModalInfoButton";

export default function MatchWinnerModal({
  open,
  teamName,
  resultText,
  handleSubmit,
}: {
  open: boolean;
  teamName: string;
  resultText?: string;
  handleSubmit?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      disableScrollLock
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 5,
          background: "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)",
          boxShadow: "0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
          border: "2px solid var(--app-accent-start, #43cea2)",
          backdropFilter: "blur(8px)",
          maxWidth: { xs: "calc(100vw - 16px)", sm: 420 },
          width: { xs: "98vw", sm: "auto" },
          margin: "8px",
          p: { xs: 2, sm: 4 },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          fontSize: "calc(26px * var(--app-font-scale, 1))",
          color: teamName !== "Tied" ? "var(--app-accent-text, #185a9d)" : "#e53935",
          textAlign: "center",
          pb: 1,
          letterSpacing: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          position: "relative",
        }}
      >
        <ModalInfoButton
          title={t("Match winner")}
          description={t(
            "The team with the most runs at the end wins. If scores are tied, the match may be a tie or go to a super over."
          )}
          iconSx={{ position: "absolute", right: 8, top: 8 }}
        />
        {teamName !== "Tied" ? (
          <>
            <span role="img" aria-label="trophy" style={{ fontSize: "calc(32px * var(--app-font-scale, 1))" }}>
              🏆
            </span>{" "}
            {t("Congratulations!")}
            <Box
              sx={{
                fontWeight: 900,
                color: "var(--app-accent-start, #43cea2)",
                fontSize: "calc(32px * var(--app-font-scale, 1))",
                mt: 1,
                mb: 0.5,
              }}
            >
              {teamName}
            </Box>
            <Box sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 700, fontSize: "calc(20px * var(--app-font-scale, 1))" }}>
              {t("wins the match!")}
            </Box>
            {resultText ? (
              <Box sx={{ color: "#0d8a52", fontWeight: 800, fontSize: "calc(17px * var(--app-font-scale, 1))", mt: 0.5 }}>
                {resultText}
              </Box>
            ) : null}
          </>
        ) : (
          <>
            <span role="img" aria-label="swords" style={{ fontSize: "calc(32px * var(--app-font-scale, 1))" }}>
              ⚔️
            </span>
            <Box
              sx={{ color: "#e53935", fontWeight: 800, fontSize: "calc(22px * var(--app-font-scale, 1))", mt: 1 }}
            >
              {t("It's a Tie! Super Over Time!")}
            </Box>
          </>
        )}
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 0,
        }}
      >
        <DialogContentText
          sx={{
            fontWeight: 500,
            color: teamName !== "Tied" ? "var(--app-accent-text, #185a9d)" : "#e53935",
            mb: 1,
            textAlign: "center",
            fontSize: "calc(18px * var(--app-font-scale, 1))",
          }}
        >
          {teamName !== "Tied"
            ? t("{teamName} has clinched victory! Celebrate the win and share the result.", { teamName })
            : t("Both teams are tied. Get ready for a thrilling super over to decide the champion!")}
        </DialogContentText>
      </DialogContent>
      {handleSubmit && (
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            data-ga-click="confirm_match_winner"
            onClick={handleSubmit}
            variant="contained"
            color={teamName !== "Tied" ? "primary" : "error"}
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              py: 1,
              fontSize: "calc(16px * var(--app-font-scale, 1))",
              background:
                teamName !== "Tied"
                  ? "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)"
                  : "linear-gradient(90deg, #e53935 0%, var(--app-accent-end, #185a9d) 100%)",
              color: "#fff",
              boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
              transition: "all 0.2s",
              "&:hover": {
                background:
                  teamName !== "Tied"
                    ? "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)"
                    : "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, #e53935 100%)",
                color: "#fff",
              },
            }}
          >
            {teamName !== "Tied" ? t("Finish Game") : t("Start Super Over")}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
