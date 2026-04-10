import React from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CloseSharp } from "@mui/icons-material";
import { BallEvent, PlayerRosterByTeam, PlayerScorecard } from "../types/cricket";
import PlayerScorecardPanel from "../components/PlayerScorecardPanel";
import { useTranslation } from "react-i18next";

interface PlayerScorecardModalProps {
  open: boolean;
  onClose: () => void;
  teams: string[];
  targetScore: number;
  playerRosterByTeam: PlayerRosterByTeam;
  playerScorecardByTeam: { [team: string]: PlayerScorecard };
  recentEventsByTeams?: { [team: string]: { [key: number]: BallEvent[] } };
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
  preferencesOnly?: boolean;
  onClosePreferencesOnly?: () => void;
}

const PlayerScorecardModal: React.FC<PlayerScorecardModalProps> = ({
  open,
  onClose,
  teams,
  targetScore,
  playerRosterByTeam,
  playerScorecardByTeam,
  recentEventsByTeams,
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
  preferencesOnly = false,
  onClosePreferencesOnly,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (preferencesOnly) {
    if (!open) {
      return null;
    }
    return (
      <PlayerScorecardPanel
        teams={teams}
        targetScore={targetScore}
        playerRosterByTeam={playerRosterByTeam}
        playerScorecardByTeam={playerScorecardByTeam}
        recentEventsByTeams={recentEventsByTeams}
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
        preferencesOnly
        onClosePreferencesOnly={onClosePreferencesOnly}
      />
    );
  }

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
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 16%, #e0eafc 84%) 0%, #f8fffc 100%)",
          boxShadow:
            "0 12px 36px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
          border: isMobile ? "none" : "2px solid var(--app-accent-start, #43cea2)",
          backdropFilter: "blur(10px)",
          width: { xs: "100%", sm: "calc(100% - 32px)" },
          maxHeight: { xs: "100%", sm: "calc(100% - 32px)" },
        },
      }}
    >
      <DialogTitle
        sx={{
          position: "relative",
          py: { xs: 1.2, sm: 1.6 },
          px: { xs: 1.2, sm: 2 },
          borderBottom: "1px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 22%, transparent 78%)",
          background:
            "linear-gradient(90deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 12%, #ffffff 88%) 0%, #f8fffc 100%)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.4,
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              px: 1.6,
              py: 0.5,
              borderRadius: 999,
              fontWeight: 900,
              fontSize: "calc(18px * var(--app-font-scale, 1))",
              letterSpacing: 0.8,
              color: "var(--app-accent-text, #185a9d)",
              background:
                "linear-gradient(90deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 18%, #e0eafc 82%) 0%, #f8fffc 100%)",
              border:
                "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 45%, transparent 55%)",
              boxShadow:
                "0 2px 10px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 18%, transparent 82%)",
            }}
          >
            {t("Scorecard")}
          </Box>
          <Box
            sx={{
              color: "var(--app-accent-text, #185a9d)",
              fontSize: "calc(12px * var(--app-font-scale, 1))",
              fontWeight: 600,
              opacity: 0.9,
              px: 0.4,
            }}
          >
            {t("Track batting and bowling stats for this match")}
          </Box>
        </Box>
        <IconButton
          data-ga-click="close_player_scorecard_modal"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
            color: "var(--app-accent-text, #185a9d)",
            background: "#fff",
            border: "1.5px solid var(--app-accent-start, #43cea2)",
            boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
            "&:hover": {
              background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, #e0eafc 100%)",
              color: "var(--app-accent-text, #185a9d)",
              borderColor: "var(--app-accent-text, #185a9d)",
            },
          }}
        >
          <CloseSharp />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 1, sm: 2 }, pb: { xs: 1.5, sm: 2 }, pt: { xs: 1.2, sm: 1.5 } }}>
        <PlayerScorecardPanel
          teams={teams}
          targetScore={targetScore}
          playerRosterByTeam={playerRosterByTeam}
          playerScorecardByTeam={playerScorecardByTeam}
          recentEventsByTeams={recentEventsByTeams}
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
          preferencesOnly={preferencesOnly}
          onClosePreferencesOnly={onClosePreferencesOnly}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PlayerScorecardModal;
