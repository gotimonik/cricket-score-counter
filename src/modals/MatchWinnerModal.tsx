import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/material";

export default function MatchWinnerModal({
  open,
  teamName,
  handleSubmit,
}: {
  open: boolean;
  teamName: string;
  handleSubmit?: () => void;
}) {
  return (
    <Dialog
      open={open}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f8fffc 0%, #e0eafc 100%)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          border: '1.5px solid #43cea2',
          backdropFilter: 'blur(6px)',
        },
      }}
    >
      <DialogTitle textAlign="center">
        {teamName !== "Tied" ? (
          <>
            👏 Well Done!
            <Box>
              <strong
                style={{
                  textAlign: "center",
                  color: "#646464",
                  fontSize: "1.5rem",
                }}
              >
                {teamName}
              </strong>
            </Box>
            <Box>is the Champion!</Box>
          </>
        ) : (
          <>
            <Box>⚔️ Deadlock! Let the Super Over Begin!</Box>
          </>
        )}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {teamName !== "Tied"
            ? "Victory belongs to them. What a performance!"
            : "Two teams, one last chance. The winner will be decided by a nail-biting super over!"}
        </DialogContentText>
      </DialogContent>
      {handleSubmit && (
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={handleSubmit}>
            {teamName !== "Tied" ? "Finish Game" : "Start Super Over"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
