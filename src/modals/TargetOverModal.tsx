import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTranslation } from "react-i18next";

export default function TargetOverModal({
  open,
  handleClose,
  handleSubmit,
}: {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (noOfOvers: number) => void;
}) {
  const [overs, setOvers] = useState<number>(2);
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      disableScrollLock
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 5,
          background: "linear-gradient(135deg, #e0eafc 0%, #f8fffc 100%)",
          boxShadow: "0 8px 32px 0 #43cea255",
          border: "2px solid #43cea2",
          backdropFilter: "blur(8px)",
          maxWidth: 480,
          width: "98vw",
          p: { xs: 2, sm: 4 },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: 22,
          color: "#185a9d",
          textAlign: "center",
          pb: 1,
          letterSpacing: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <span role="img" aria-label="target">
          🎯
        </span>{" "}
        {t("Set Number of Overs")}
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
          sx={{ fontWeight: 500, color: "#185a9d", mb: 1, textAlign: "center" }}
        >
          {t("How many overs will this match have?")}
        </DialogContentText>
        <label
          htmlFor="nomberOfOvers"
          style={{
            fontWeight: 600,
            fontSize: 16,
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
              fontSize: 24,
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
            boxShadow: "0 1px 4px 0 #185a9d22",
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
            "& .MuiInputLabel-root": {
              fontWeight: 600,
            },
            fontSize: { xs: 22, sm: 24 },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button
          data-ga-click="cancel_target_over"
          onClick={handleClose}
          color="secondary"
          variant="outlined"
          sx={{
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            py: 1,
            fontSize: 15,
            borderWidth: 2,
            background: "#fff",
            transition: "all 0.2s",
            "&:hover": {
              background: "#f5f5f5",
              borderColor: "#185a9d",
            },
          }}
        >
          {t("Cancel")}
        </Button>
        <Button
          data-ga-click="set_target_over"
          type="submit"
          onClick={() => overs && handleSubmit(overs)}
          color="primary"
          variant="contained"
          sx={{
            fontWeight: 700,
            borderRadius: 2,
            px: 3,
            py: 1,
            fontSize: 15,
            background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
            color: "#fff",
            boxShadow: "0 2px 8px 0 #185a9d33",
            transition: "all 0.2s",
            "&:hover": {
              background: "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)",
              color: "#fff",
            },
          }}
        >
          {t("Set Overs")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
