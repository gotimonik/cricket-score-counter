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
  handleSubmit: () => void;
}) {
  return (
    <Dialog open={open}>
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
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button onClick={handleSubmit}>
          {teamName !== "Tied" ? "Finish Game" : "Start Super Over"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
