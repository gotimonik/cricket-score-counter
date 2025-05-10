import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

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
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>🎯 Plan Your Game!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Decide the number of overs for this match.
        </DialogContentText>
        <DialogContentText>
          Your input will help set the pace, target, and tension. Ready to hit
          it out of the park?
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="nomberOfOvers"
          label="Enter Overs:"
          type="number"
          fullWidth
          variant="standard"
          value={overs}
          onChange={(e) => setOvers(Number(e.target.value))}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" onClick={() => overs && handleSubmit(overs)}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
