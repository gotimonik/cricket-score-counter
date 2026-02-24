import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CloseSharp } from "@mui/icons-material";
import { PlayerRosterByTeam, PlayerScorecard } from "../types/cricket";
import PlayerScorecardPanel from "../components/PlayerScorecardPanel";
import { useTranslation } from "react-i18next";

interface PlayerScorecardModalProps {
  open: boolean;
  onClose: () => void;
  teams: string[];
  targetScore: number;
  playerRosterByTeam: PlayerRosterByTeam;
  playerScorecardByTeam: { [team: string]: PlayerScorecard };
  striker?: string;
  bowler?: string;
  editable?: boolean;
  onChangeBowler?: () => void;
  canChangeBowler?: boolean;
  onAddPlayer?: (team: string, name: string) => void;
  onRemovePlayer?: (team: string, name: string) => void;
  canRemovePlayer?: (team: string, name: string) => boolean;
  hidePreferencesButton?: boolean;
  openPreferencesTrigger?: number;
}

const PlayerScorecardModal: React.FC<PlayerScorecardModalProps> = ({
  open,
  onClose,
  teams,
  targetScore,
  playerRosterByTeam,
  playerScorecardByTeam,
  striker,
  bowler,
  editable = false,
  onChangeBowler,
  canChangeBowler = true,
  onAddPlayer,
  onRemovePlayer,
  canRemovePlayer,
  hidePreferencesButton = false,
  openPreferencesTrigger = 0,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
  <Dialog
    open={open}
    onClose={onClose}
    disableScrollLock
    fullWidth
    maxWidth="lg"
    fullScreen={isMobile}
    sx={{
      "& .MuiDialog-paper": {
        borderRadius: isMobile ? 0 : 5,
        background: "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)",
        boxShadow: "0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
        border: isMobile ? "none" : "2px solid var(--app-accent-start, #43cea2)",
        backdropFilter: "blur(8px)",
        width: { xs: "100%", sm: "calc(100% - 32px)" },
        maxHeight: { xs: "100%", sm: "calc(100% - 32px)" },
      },
    }}
  >
    <DialogTitle sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)" }}>
      {t("Player Scorecard")}
      <IconButton
        data-ga-click="close_player_scorecard_modal"
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <CloseSharp />
      </IconButton>
    </DialogTitle>
    <DialogContent sx={{ px: { xs: 1, sm: 2 }, pb: { xs: 1.5, sm: 2 } }}>
      <PlayerScorecardPanel
        teams={teams}
        targetScore={targetScore}
        playerRosterByTeam={playerRosterByTeam}
        playerScorecardByTeam={playerScorecardByTeam}
        striker={striker}
        bowler={bowler}
        editable={editable}
        onChangeBowler={onChangeBowler}
        canChangeBowler={canChangeBowler}
        onAddPlayer={onAddPlayer}
        onRemovePlayer={onRemovePlayer}
        canRemovePlayer={canRemovePlayer}
        showHeader={false}
        hidePreferencesButton={hidePreferencesButton}
        openPreferencesTrigger={openPreferencesTrigger}
      />
    </DialogContent>
  </Dialog>
  );
};

export default PlayerScorecardModal;
