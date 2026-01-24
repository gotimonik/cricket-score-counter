import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { CloseSharp } from "@mui/icons-material";

interface PlayerListModalProps {
  open: boolean;
  onClose: () => void;
  teamNames: string[];
  onSave: (playersByTeam: { [team: string]: string[] }) => void;
}

const LOCALSTORAGE_KEY = "cricket-score-players-by-team";

const PlayerListModal: React.FC<PlayerListModalProps> = ({ open, onClose, teamNames, onSave }) => {
  const [playersByTeam, setPlayersByTeam] = useState<{ [team: string]: string[] }>(
    () => {
      // Try to load from localStorage
      try {
        const saved = localStorage.getItem(LOCALSTORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Only use teams that match current teamNames
          return Object.fromEntries(teamNames.map((t) => [t, parsed[t] || [""]]))
        }
      } catch {}
      return Object.fromEntries(teamNames.map((t) => [t, [""]]))
    }
  );

  // When teamNames change (e.g. new match), reload from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALSTORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setPlayersByTeam(Object.fromEntries(teamNames.map((t) => [t, parsed[t] || [""]])));
      } else {
        setPlayersByTeam(Object.fromEntries(teamNames.map((t) => [t, [""]])));
      }
    } catch {
      setPlayersByTeam(Object.fromEntries(teamNames.map((t) => [t, [""]])));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, teamNames.join(",")]);

  const handlePlayerChange = (team: string, idx: number, value: string) => {
    setPlayersByTeam((prev) => {
      const updated = { ...prev };
      updated[team][idx] = value;
      return updated;
    });
  };

  const handleAddPlayer = (team: string) => {
    setPlayersByTeam((prev) => {
      const updated = { ...prev };
      updated[team] = [...updated[team], ""];
      return updated;
    });
  };

  const handleRemovePlayer = (team: string, idx: number) => {
    setPlayersByTeam((prev) => {
      const updated = { ...prev };
      updated[team] = updated[team].filter((_, i) => i !== idx);
      return updated;
    });
  };

  const handleSave = () => {
    // Remove empty names
    const cleaned = Object.fromEntries(
      Object.entries(playersByTeam).map(([team, players]) => [team, players.filter((p) => p.trim() !== "")])
    );
    // Save to localStorage
    try {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(cleaned));
    } catch {}
    onSave(cleaned);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Add Players
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseSharp />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {teamNames.map((team) => (
          <Box key={team} sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, color: '#185a9d', fontWeight: 700 }}>{team}</Typography>
            {playersByTeam[team].map((player, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  label={`Player ${idx + 1}`}
                  value={player}
                  onChange={e => handlePlayerChange(team, idx, e.target.value)}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <IconButton onClick={() => handleRemovePlayer(team, idx)} disabled={playersByTeam[team].length === 1}>
                  <CloseSharp fontSize="small" />
                </IconButton>
              </Box>
            ))}
            <Button onClick={() => handleAddPlayer(team)} size="small" variant="outlined" sx={{ mt: 1 }}>
              Add Player
            </Button>
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSave} color="primary" variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlayerListModal;
