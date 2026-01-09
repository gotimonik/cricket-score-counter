import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/material";

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
  return (
    <Dialog
      open={open}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 5,
          background: "linear-gradient(135deg, #e0eafc 0%, #f8fffc 100%)",
          boxShadow: "0 8px 32px 0 #43cea255",
          border: "2px solid #43cea2",
          backdropFilter: "blur(8px)",
          maxWidth: 360,
          width: "95vw",
          p: { xs: 1.5, sm: 3 },
        },
      }}
    >
      <DialogTitle
        textAlign="center"
        sx={{
          fontWeight: 900,
          fontSize: 22,
          color: "#185a9d",
          mb: 1,
          letterSpacing: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        Target Ready!
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 0.5, sm: 2 }, pt: 0 }}>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          {teamName && (
            <Box
              sx={{ mt: 1, fontWeight: 700, fontSize: 18, color: "#43cea2" }}
            >
              {teamName} needs {targetScore} runs to win
            </Box>
          )}
        </Box>
        <DialogContentText
          sx={{
            fontWeight: 600,
            color: "#185a9d",
            textAlign: "center",
            fontSize: 16,
          }}
        >
          First innings complete. Start the chase when you’re ready.
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
            Begin Chase
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default TargetScoreModal;
