import AppSpinner from "../components/AppSpinner";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, IconButton, Stack } from "@mui/material";
import { CloseRounded, HomeRounded, IosShareRounded, TableChartRounded } from "@mui/icons-material";
import { goldButtonSx, ghostButtonSx } from "../components/ui/Pavilion";
import { useTranslation } from "react-i18next";
import ModalInfoButton from "../components/ModalInfoButton";

export default function MatchWinnerModal({
  open,
  teamName,
  resultText,
  handleSubmit,
  onClose,
  onViewScorecard,
  onShare,
  onHome,
}: {
  open: boolean;
  teamName: string;
  resultText?: string;
  handleSubmit?: () => void | Promise<void>;
  /** Viewers (not the scorer) can dismiss the result and move on. */
  onClose?: () => void;
  onViewScorecard?: () => void;
  onShare?: () => void;
  onHome?: () => void;
}) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinishClick = async () => {
    if (!handleSubmit || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await handleSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableScrollLock
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
          margin: "8px",
          p: { xs: 2, sm: 4 },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          fontSize: "calc(26px * var(--app-font-scale, 1))",
          color:
            teamName !== "Tied" ? "var(--app-accent-text, #185a9d)" : "#e53935",
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
        {onClose && (
          <IconButton
            aria-label={t("Close")}
            data-ga-click="close_match_winner"
            onClick={onClose}
            sx={{
              position: "absolute",
              left: 8,
              top: 8,
              color: "inherit",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.18)",
              "&:hover": { background: "rgba(255,255,255,0.16)" },
            }}
          >
            <CloseRounded />
          </IconButton>
        )}
        <ModalInfoButton
          title={t("Match winner")}
          description={t(
            "The team with the most runs at the end wins. If scores are tied, the match may be a tie or go to a super over.",
          )}
          iconSx={{ position: "absolute", right: 8, top: 8 }}
        />
        {teamName !== "Tied" ? (
          <>
            <span
              role="img"
              aria-label="trophy"
              style={{ fontSize: "calc(32px * var(--app-font-scale, 1))" }}
            >
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
            <Box
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 700,
                fontSize: "calc(20px * var(--app-font-scale, 1))",
              }}
            >
              {t("wins the match!")}
            </Box>
            {resultText ? (
              <Box
                sx={{
                  color: "#0d8a52",
                  fontWeight: 800,
                  fontSize: "calc(17px * var(--app-font-scale, 1))",
                  mt: 0.5,
                }}
              >
                {resultText}
              </Box>
            ) : null}
          </>
        ) : (
          <>
            <span
              role="img"
              aria-label="swords"
              style={{ fontSize: "calc(32px * var(--app-font-scale, 1))" }}
            >
              ⚔️
            </span>
            <Box
              sx={{
                color: "#e53935",
                fontWeight: 800,
                fontSize: "calc(22px * var(--app-font-scale, 1))",
                mt: 1,
              }}
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
            color:
              teamName !== "Tied"
                ? "var(--app-accent-text, #185a9d)"
                : "#e53935",
            mb: 1,
            textAlign: "center",
            fontSize: "calc(18px * var(--app-font-scale, 1))",
          }}
        >
          {teamName !== "Tied"
            ? `${teamName} ${t("has clinched victory! Celebrate the win and share the result.", { teamName })}`
            : t(
                "Both teams are tied. Get ready for a thrilling super over to decide the champion!",
              )}
        </DialogContentText>
      </DialogContent>
      {(onViewScorecard || onShare || onHome) && (
        <DialogActions sx={{ px: { xs: 1, sm: 2 }, pb: 2, pt: 0 }}>
          <Stack spacing={1} sx={{ width: "100%", maxWidth: 420, mx: "auto" }}>
            {onViewScorecard && (
              <Button
                data-ga-click="winner_view_scorecard"
                variant="contained"
                startIcon={<TableChartRounded />}
                onClick={onViewScorecard}
                sx={{ ...goldButtonSx, width: "100%" }}
              >
                {t("See full scorecard")}
              </Button>
            )}
            <Stack direction="row" spacing={1}>
              {onShare && (
                <Button
                  data-ga-click="winner_share_result"
                  startIcon={<IosShareRounded />}
                  onClick={onShare}
                  sx={{ ...ghostButtonSx, flex: 1 }}
                >
                  {t("Share result")}
                </Button>
              )}
              {onHome && (
                <Button
                  data-ga-click="winner_go_home"
                  startIcon={<HomeRounded />}
                  onClick={onHome}
                  sx={{ ...ghostButtonSx, flex: 1 }}
                >
                  {t("Home")}
                </Button>
              )}
            </Stack>
          </Stack>
        </DialogActions>
      )}
      {handleSubmit && (
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            data-ga-click="confirm_match_winner"
            onClick={handleFinishClick}
            disabled={isSubmitting}
            variant="contained"
            color={teamName !== "Tied" ? "primary" : "error"}
            startIcon={
              isSubmitting ? (
                <AppSpinner size={18} color="inherit" />
              ) : undefined
            }
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
              boxShadow:
                "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
              transition: "all 0.2s",
              "&:hover": {
                background:
                  teamName !== "Tied"
                    ? "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)"
                    : "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, #e53935 100%)",
                color: "#fff",
              },
              "&.Mui-disabled": {
                background:
                  teamName !== "Tied"
                    ? "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)"
                    : "linear-gradient(90deg, #e53935 0%, var(--app-accent-end, #185a9d) 100%)",
                color: "#fff",
                opacity: 0.75,
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
