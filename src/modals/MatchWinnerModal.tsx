import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function MatchWinnerModal({
  open,
  teamName,
  handleSubmit,
}: {
  open: boolean;
  teamName: string;
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
          background: "linear-gradient(135deg, #e0eafc 0%, #f8fffc 100%)",
          boxShadow: "0 8px 32px 0 #43cea255",
          border: "2px solid #43cea2",
          backdropFilter: "blur(8px)",
          maxWidth: 420,
          width: "96vw",
          p: { xs: 2, sm: 4 },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          fontSize: 26,
          color: teamName !== "Tied" ? "#185a9d" : "#e53935",
          textAlign: "center",
          pb: 1,
          letterSpacing: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        {teamName !== "Tied" ? (
          <>
            <span role="img" aria-label="trophy" style={{ fontSize: 32 }}>
              🏆
            </span>{" "}
            {t("Congratulations!")}
            <Box
              sx={{
                fontWeight: 900,
                color: "#43cea2",
                fontSize: 32,
                mt: 1,
                mb: 0.5,
              }}
            >
              {teamName}
            </Box>
            <Box sx={{ color: "#185a9d", fontWeight: 700, fontSize: 20 }}>
              {t("wins the match!")}
            </Box>
          </>
        ) : (
          <>
            <span role="img" aria-label="swords" style={{ fontSize: 32 }}>
              ⚔️
            </span>
            <Box
              sx={{ color: "#e53935", fontWeight: 800, fontSize: 22, mt: 1 }}
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
            color: teamName !== "Tied" ? "#185a9d" : "#e53935",
            mb: 1,
            textAlign: "center",
            fontSize: 18,
          }}
        >
          {teamName !== "Tied"
            ? `${teamName} has clinched victory! Celebrate the win and share the result.`
            : "Both teams are tied. Get ready for a thrilling super over to decide the champion!"}
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
              fontSize: 16,
              background:
                teamName !== "Tied"
                  ? "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)"
                  : "linear-gradient(90deg, #e53935 0%, #185a9d 100%)",
              color: "#fff",
              boxShadow: "0 2px 8px 0 #185a9d33",
              transition: "all 0.2s",
              "&:hover": {
                background:
                  teamName !== "Tied"
                    ? "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)"
                    : "linear-gradient(90deg, #185a9d 0%, #e53935 100%)",
                color: "#fff",
              },
            }}
          >
            {teamName !== "Tied" ? "Finish Game" : "Start Super Over"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
