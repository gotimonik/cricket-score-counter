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

interface TargetScoreModalProps {
  open: boolean;
  targetScore: number;
  teamName?: string;
  handleSubmit?: () => void;
}

const TargetScoreModal: React.FC<TargetScoreModalProps> = ({
  open,
  targetScore,
  teamName,
  handleSubmit,
}) => {
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
          maxWidth: { xs: "calc(100vw - 16px)", sm: 360 },
          width: { xs: "98vw", sm: "auto" },
          margin: "8px",
          p: { xs: 1.5, sm: 3 },
        },
      }}
    >
      <DialogTitle
        textAlign="center"
        sx={{
          fontWeight: 900,
          fontSize: "calc(22px * var(--app-font-scale, 1))",
          color: "var(--app-accent-text, #185a9d)",
          mb: 1,
          letterSpacing: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          position: "relative",
        }}
      >
        {t("Target Ready!")}
        <ModalInfoButton
          title={t("Target score")}
          description={t(
            "The runs the chasing team must reach to win, set after the first team bats. The chasing team must score at least one more run than the target."
          )}
          iconSx={{ position: "absolute", right: 8, top: 8 }}
        />
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 0.5, sm: 2 }, pt: 0 }}>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          {teamName && (
            <Box
              sx={{ mt: 1, fontWeight: 700, fontSize: "calc(18px * var(--app-font-scale, 1))", color: "var(--app-accent-start, #43cea2)" }}
            >
              {teamName} {t("needs")} {targetScore} {t("runs to win")}
            </Box>
          )}
        </Box>
        <DialogContentText
          sx={{
            fontWeight: 600,
            color: "var(--app-accent-text, #185a9d)",
            textAlign: "center",
            fontSize: "calc(16px * var(--app-font-scale, 1))",
          }}
        >
          {t("First innings complete. Start the chase when you’re ready.")}
        </DialogContentText>
      </DialogContent>
      {handleSubmit && (
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            data-ga-click="begin_chase"
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            sx={{
              fontWeight: 800,
              borderRadius: 2,
              px: 3,
              py: 1,
              fontSize: "calc(15px * var(--app-font-scale, 1))",
              background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
              color: "#fff",
              boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
              transition: "all 0.2s",
              "&:hover": {
                background: "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
                color: "#fff",
              },
            }}
          >
            {t("Begin Chase")}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default TargetScoreModal;
