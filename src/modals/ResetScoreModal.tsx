import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ResetScoreModal({
  open,
  handleClose,
  handleSubmit,
}: {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (noOfOvers: number) => void;
}) {
  const [overs, setOvers] = useState<number>(0);
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 4,
            background: "linear-gradient(135deg, #f8fffc 0%, #e0eafc 100%)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
          },
        }}
      >
        <DialogTitle>🕹️ Ready to Restart?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will wipe your current match progress.
          </DialogContentText>
          <DialogContentText>
            Start fresh and set a new challenge. Enter the number of overs to
            begin again!
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="nomberOfOvers"
            label="Number of Overs"
            type="number"
            fullWidth
            variant="standard"
            value={overs}
            onChange={(e) => setOvers(Number(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" onClick={() => handleSubmit(overs)}>
            Restart Game
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
