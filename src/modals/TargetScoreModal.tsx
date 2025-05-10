import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/material";

export default function TargetScoreModal({
  open,
  handleSubmit,
  targetScore,
}: {
  open: boolean;
  targetScore: number;
  handleSubmit: () => void;
}) {
  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">
        🎯 Target Locked:
        <Box>
          <strong
            style={{
              textAlign: "center",
              color: "#646464",
              fontSize: "1.5rem",
            }}
          >
            {targetScore}
          </strong>
        </Box>
        Runs
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          The innings is over — now it’s your chance to chase it down.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button onClick={handleSubmit}>Begin Chase</Button>
      </DialogActions>
    </Dialog>
  );
}
