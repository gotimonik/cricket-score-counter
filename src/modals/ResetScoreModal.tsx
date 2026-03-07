import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTranslation } from "react-i18next";
import ModalInfoButton from "../components/ModalInfoButton";

export default function ResetScoreModal({
  open,
  handleClose,
  handleSubmit,
}: {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (noOfOvers: number) => void;
}) {
  const [overs, setOvers] = useState<number>(8);
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      disableScrollLock
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 5,
          background: "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)",
          boxShadow: "0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
          border: "2px solid var(--app-accent-start, #43cea2)",
          backdropFilter: "blur(8px)",
          maxWidth: { xs: "calc(100vw - 16px)", sm: 480 },
          width: "98vw",
          margin: "8px",
          p: { xs: 2, sm: 4 },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: "calc(22px * var(--app-font-scale, 1))",
          color: "var(--app-accent-text, #185a9d)",
          textAlign: "center",
          pb: 1,
          letterSpacing: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          position: "relative",
        }}
      >
        <ModalInfoButton
          title={t("Resetting the score")}
          description={t(
            "Lets you start a new match or fix mistakes. All previous runs, wickets, and overs will be cleared. This action cannot be undone."
          )}
          iconSx={{ position: "absolute", right: 8, top: 8 }}
        />
        <span role="img" aria-label="reset">
          🔄
        </span>{" "}
        {t("Restart Match?")}
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: 0,
        }}
      >
        <DialogContentText sx={{ color: "#333", mb: 2, textAlign: "center" }}>
          {t("Enter overs for the new match:")}
        </DialogContentText>
        <label
          htmlFor="nomberOfOvers"
          style={{
            fontWeight: 600,
            fontSize: "calc(16px * var(--app-font-scale, 1))",
            marginBottom: 4,
            display: "block",
          }}
        >
          {t("Overs")}
        </label>
        <TextField
          autoFocus
          required
          margin="dense"
          id="nomberOfOvers"
          aria-label="Overs"
          type="number"
          size="small"
          inputProps={{
            min: 1,
            max: 50,
            inputMode: "numeric",
            pattern: "[0-9]*",
            style: {
              textAlign: "center",
              fontWeight: 600,
              fontSize: "calc(24px * var(--app-font-scale, 1))",
              letterSpacing: 1,
              padding: "10px 0",
              touchAction: "manipulation",
            },
          }}
          fullWidth
          variant="outlined"
          value={overs}
          onChange={(e) => setOvers(Number(e.target.value))}
          sx={{
            mt: 2,
            mb: 1,
            borderRadius: 2,
            background: "#fff",
            boxShadow: "0 1px 4px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
            maxWidth: 340,
            minWidth: 220,
            width: "100%",
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
            "& .MuiInputLabel-root": {
              fontWeight: 600,
            },
            fontSize: { xs: "calc(22px * var(--app-font-scale, 1))", sm: "calc(24px * var(--app-font-scale, 1))" },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button
          data-ga-click="cancel_reset_score"
          onClick={handleClose}
          color="secondary"
          variant="outlined"
          sx={{
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            py: 1,
            fontSize: "calc(15px * var(--app-font-scale, 1))",
            borderWidth: 2,
            background: "#fff",
            transition: "all 0.2s",
            "&:hover": {
              background: "#f5f5f5",
              borderColor: "var(--app-accent-text, #185a9d)",
            },
          }}
        >
          {t("Cancel")}
        </Button>
        <Button
          data-ga-click="confirm_reset_score"
          type="submit"
          onClick={() => overs && handleSubmit(overs)}
          color="primary"
          variant="contained"
          sx={{
            fontWeight: 700,
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
          {t("Restart")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
