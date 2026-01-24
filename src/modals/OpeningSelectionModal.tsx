import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, MenuItem, Select, Typography } from "@mui/material";

interface OpeningSelectionModalProps {
  open: boolean;
  onClose: () => void;
  battingTeam: string;
  bowlingTeam: string;
  playersByTeam: { [team: string]: string[] };
  onSave: (openers: { batsman1: string; batsman2: string; bowler: string }) => void;
}

const OpeningSelectionModal: React.FC<OpeningSelectionModalProps> = ({ open, onClose, battingTeam, bowlingTeam, playersByTeam, onSave }) => {
  const [batsman1, setBatsman1] = useState("");
  const [batsman2, setBatsman2] = useState("");
  const [bowler, setBowler] = useState("");

  const battingPlayers = playersByTeam[battingTeam] || [];
  const bowlingPlayers = playersByTeam[bowlingTeam] || [];

  const handleSave = () => {
    if (batsman1 && batsman2 && bowler && batsman1 !== batsman2) {
      onSave({ batsman1, batsman2, bowler });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Select Opening Players</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#185a9d' }}>{battingTeam} - Opening Batsmen</Typography>
          <Select
            value={batsman1}
            onChange={e => setBatsman1(e.target.value)}
            fullWidth
            displayEmpty
            sx={{ mb: 2 }}
          >
            <MenuItem value="" disabled>Select Batsman 1</MenuItem>
            {battingPlayers.map((p, i) => (
              <MenuItem key={i} value={p}>{p}</MenuItem>
            ))}
          </Select>
          <Select
            value={batsman2}
            onChange={e => setBatsman2(e.target.value)}
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>Select Batsman 2</MenuItem>
            {battingPlayers.filter(p => p !== batsman1).map((p, i) => (
              <MenuItem key={i} value={p}>{p}</MenuItem>
            ))}
          </Select>
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#185a9d' }}>{bowlingTeam} - Opening Bowler</Typography>
          <Select
            value={bowler}
            onChange={e => setBowler(e.target.value)}
            fullWidth
            displayEmpty
          >
            <MenuItem value="" disabled>Select Bowler</MenuItem>
            {bowlingPlayers.map((p, i) => (
              <MenuItem key={i} value={p}>{p}</MenuItem>
            ))}
          </Select>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSave} color="primary" variant="contained" disabled={!batsman1 || !batsman2 || !bowler || batsman1 === batsman2}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OpeningSelectionModal;
