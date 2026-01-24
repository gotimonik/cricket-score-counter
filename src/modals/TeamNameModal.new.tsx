import React, { useState } from "react";
import PlayerListModal from "./PlayerListModal";
import OpeningSelectionModal from "./OpeningSelectionModal";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import { CloseSharp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface TeamNameModalProps {
  open: boolean;
  onSubmit: (
    team1: string,
    team2: string,
    overs: number,
    openers: { batsman1: string; batsman2: string; bowler: string },
    playersByTeam: { [team: string]: string[] }
  ) => void;
}

const TeamNameModal: React.FC<TeamNameModalProps> = ({ open, onSubmit }) => {
  const { t } = useTranslation();
  const [team1, setTeam1] = useState("INDIA A");
  const [team2, setTeam2] = useState("INDIA B");
  const [overs, setOvers] = useState<number>(2);
  const [error, setError] = useState("");
  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  const [playersByTeam, setPlayersByTeam] = useState<{ [team: string]: string[] }>({});
  const [openingModalOpen, setOpeningModalOpen] = useState(false);
  const [openers, setOpeners] = useState<{ batsman1: string; batsman2: string; bowler: string } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!team1.trim() || !team2.trim()) {
      setError(t("Please enter both team names."));
      return;
    }
    if (!overs || overs < 1 || overs > 50) {
      setError(t("Please enter a valid number of overs (1-50)."));
      return;
    }
    setError("");
    setPlayerModalOpen(true);
  };

  const handlePlayersSave = (players: { [team: string]: string[] }) => {
    setPlayersByTeam(players);
    setOpeningModalOpen(true);
  };

  const handleOpenersSave = (selected: { batsman1: string; batsman2: string; bowler: string }) => {
    setOpeners(selected);
    setOpeningModalOpen(false);
    onSubmit(team1.trim(), team2.trim(), overs, selected, playersByTeam);
  };

  return (
    <Dialog open={open} disableEscapeKeyDown>
      <DialogTitle>{t('Enter Team Names')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 220, mt: 1 }}>
          <TextField
            id="team1-name"
            aria-label="Team 1 Name"
            value={team1}
            onChange={(e) => setTeam1(e.target.value)}
            autoFocus
            fullWidth
            placeholder={t('INDIA A')}
            inputProps={{ maxLength: 24, style: { fontWeight: 700, fontSize: 18, letterSpacing: 1 } }}
          />
          <TextField
            id="team2-name"
            aria-label="Team 2 Name"
            value={team2}
            onChange={(e) => setTeam2(e.target.value)}
            fullWidth
            placeholder={t('INDIA B')}
            inputProps={{ maxLength: 24, style: { fontWeight: 700, fontSize: 18, letterSpacing: 1 } }}
          />
          <TextField
            id="overs-input"
            aria-label={t('Number of Overs')}
            type="number"
            value={overs}
            onChange={(e) => setOvers(Number(e.target.value))}
            fullWidth
            required
            inputProps={{ min: 1, max: 50, style: { fontWeight: 700, fontSize: 18, letterSpacing: 1, textAlign: 'center' } }}
          />
          {error && (
            <Box sx={{ color: "#e53935", fontWeight: 600, textAlign: "center", mt: 0.5 }}>{error}</Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary" variant="contained">Next</Button>
        <IconButton aria-label="close" onClick={() => navigate("/")}> <CloseSharp fontSize="small" /> </IconButton>
      </DialogActions>
      <PlayerListModal
        open={playerModalOpen}
        onClose={() => setPlayerModalOpen(false)}
        teamNames={[team1.trim(), team2.trim()]}
        onSave={handlePlayersSave}
      />
      <OpeningSelectionModal
        open={openingModalOpen}
        onClose={() => setOpeningModalOpen(false)}
        battingTeam={team1.trim()}
        bowlingTeam={team2.trim()}
        playersByTeam={playersByTeam}
        onSave={handleOpenersSave}
      />
    </Dialog>
  );
};

export default TeamNameModal;
