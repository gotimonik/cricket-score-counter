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
  onSubmit: (team1: string, team2: string, overs: number) => void;
}

const TeamNameModal: React.FC<TeamNameModalProps> = ({ open, onSubmit }) => {
  const { t } = useTranslation();
  const [team1, setTeam1] = useState("INDIA A");
  const [team2, setTeam2] = useState("INDIA B");
  const [overs, setOvers] = useState<number>(2);
  const [error, setError] = useState("");
  const [tossResult, setTossResult] = useState<null | "Heads" | "Tails">(null);
  const [tossTeam, setTossTeam] = useState<string>("");
  const [showCoin, setShowCoin] = useState(false);
  const [coinFlipped, setCoinFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTossOptions, setShowTossOptions] = useState(false);
  const [chosenSide, setChosenSide] = useState<null | "Heads" | "Tails">(null);
  // Player modal state
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
    // Pass openers to onSubmit as needed
    onSubmit(team1.trim(), team2.trim(), overs);
    // Optionally: pass openers and playersByTeam to parent via onSubmit or context
  };

  const handleCoinFlip = () => {
    setIsAnimating(true);
    setTimeout(() => {
      // Simulate coin flip
      const result = Math.random() < 0.5 ? "Heads" : "Tails";
      setTossResult(result);
      setCoinFlipped(true);
      // Decide toss winner based on Team 2's choice
      const winner = chosenSide === result ? team2.trim() : team1.trim();
      setTossTeam(winner);
      setIsAnimating(false);
      setTimeout(() => {
        setShowTossOptions(true);
      }, 400);
    }, 900); // animation duration
  };

  const handleChooseBatBall = (choice: "bat" | "ball") => {
    // If tossTeam chooses to bat, they are team1, else swap order
    if (choice === "bat") {
      onSubmit(
        tossTeam,
        tossTeam === team1.trim() ? team2.trim() : team1.trim(),
        overs
      );
    } else {
      // tossTeam bowls, other team bats first
      onSubmit(
        tossTeam === team1.trim() ? team2.trim() : team1.trim(),
        tossTeam,
        overs
      );
    }
  };

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 5,
          background: "linear-gradient(135deg, #e0eafc 0%, #f8fffc 100%)",
          boxShadow: "0 8px 32px 0 #43cea255",
          border: "2px solid #43cea2",
          backdropFilter: "blur(8px)",
          maxWidth: 360,
          width: "95vw",
          p: { xs: 1.5, sm: 2 },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 900,
          fontSize: 22,
          color: "#185a9d",
          mb: 1,
          letterSpacing: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {t('Enter Team Names')}
      </DialogTitle>
      <Box
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          display: "flex",
          gap: 1,
          zIndex: 11,
        }}
      >
        <IconButton
          aria-label="close"
          onClick={() => navigate("/")}
          sx={{
            color: "#185a9d",
            background: "#fff",
            border: "1.5px solid #43cea2",
            boxShadow: "0 2px 8px 0 #185a9d22",
            "&:hover": {
              background: "linear-gradient(90deg, #43cea2 0%, #e0eafc 100%)",
              color: "#185a9d",
              borderColor: "#185a9d",
            },
          }}
        >
          <CloseSharp fontSize="small" />
        </IconButton>
      </Box>
      <DialogContent
        sx={{ px: { xs: 0.5, sm: 2 }, pt: 0 }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 220,
            mt: 1,
          }}
        >
          <label
            htmlFor="team1-name"
            style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}
          >
            {t('Team 1 Name')}
          </label>
          <TextField
            id="team1-name"
            aria-label="Team 1 Name"
            value={team1}
            onChange={(e) => setTeam1(e.target.value)}
            autoFocus
            fullWidth
            placeholder={t('INDIA A')}
            inputProps={{
              maxLength: 24,
              style: { fontWeight: 700, fontSize: 18, letterSpacing: 1 },
            }}
            sx={{
              background: "#fff",
              borderRadius: 2,
              boxShadow: "0 1px 4px 0 #185a9d22",
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
              "& .MuiInputLabel-root": { fontWeight: 600 },
            }}
          />
          <label
            htmlFor="team2-name"
            style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}
          >
            {t('Team 2 Name')}
          </label>
          <TextField
            id="team2-name"
            aria-label="Team 2 Name"
            value={team2}
            onChange={(e) => setTeam2(e.target.value)}
            fullWidth
            placeholder={t('INDIA B')}
            inputProps={{
              maxLength: 24,
              style: { fontWeight: 700, fontSize: 18, letterSpacing: 1 },
            }}
            sx={{
              background: "#fff",
              borderRadius: 2,
              boxShadow: "0 1px 4px 0 #185a9d22",
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
              "& .MuiInputLabel-root": { fontWeight: 600 },
            }}
          />
          <label
            htmlFor="overs-input"
            style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}
          >
            {t('Number of Overs')}
          </label>
          <TextField
            id="overs-input"
            aria-label={t('Number of Overs')}
            type="number"
            value={overs}
            onChange={(e) => setOvers(Number(e.target.value))}
            fullWidth
            required
            inputProps={{
              min: 1,
              max: 50,
              style: { fontWeight: 700, fontSize: 18, letterSpacing: 1, textAlign: 'center' },
            }}
            sx={{
              background: "#fff",
              borderRadius: 2,
              boxShadow: "0 1px 4px 0 #185a9d22",
              "& .MuiOutlinedInput-root": { borderRadius: 2 },
              "& .MuiInputLabel-root": { fontWeight: 600 },
              mt: 1,
            }}
          />
          {error && (
            <Box
              sx={{
                color: "#e53935",
                fontWeight: 600,
                textAlign: "center",
                mt: 0.5,
              }}
            >
              {error}
            </Box>
          )}
        </Box>
        {/* Single step toss: after Go with Toss, show Heads/Tails selection and coin to flip in one view */}
        {showTossOptions && !coinFlipped && (
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Box
              sx={{ fontWeight: 700, fontSize: 18, mb: 2, textAlign: "center" }}
            >
              <span style={{ color: "#43cea2" }}>
                {team1.trim() || t('Team 1')}
              </span>{" "}
              {t('will flip the coin')}
              <br />
              <span style={{ color: "#185a9d" }}>
                {team2.trim() || t('Team 2')}
              </span>{" "}
              {t('will select Heads or Tails')}
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}
            >
              <Button
                data-ga-click="choose_heads"
                color="primary"
                variant={chosenSide === "Heads" ? "contained" : "outlined"}
                sx={{
                  fontWeight: 800,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontSize: 15,
                  background:
                    chosenSide === "Heads"
                      ? "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)"
                      : "#fff",
                  color: chosenSide === "Heads" ? "#fff" : "#185a9d",
                  boxShadow:
                    chosenSide === "Heads"
                      ? "0 2px 8px 0 #185a9d33"
                      : "0 2px 8px 0 #185a9d22",
                  borderWidth: chosenSide === "Heads" ? 0 : 2,
                  borderColor: "#43cea2",
                  transition: "all 0.2s",
                  "&:hover": {
                    background:
                      chosenSide === "Heads"
                        ? "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)"
                        : "linear-gradient(90deg, #43cea2 0%, #e0eafc 100%)",
                    color: "#fff",
                    borderColor: "#185a9d",
                  },
                }}
                onClick={() => setChosenSide("Heads")}
              >
                {t('Heads')}
              </Button>
              <Button
                data-ga-click="choose_tails"
                color="secondary"
                variant={chosenSide === "Tails" ? "contained" : "outlined"}
                sx={{
                  fontWeight: 800,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontSize: 15,
                  background:
                    chosenSide === "Tails"
                      ? "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)"
                      : "#fff",
                  color: chosenSide === "Tails" ? "#fff" : "#185a9d",
                  boxShadow:
                    chosenSide === "Tails"
                      ? "0 2px 8px 0 #185a9d33"
                      : "0 2px 8px 0 #185a9d22",
                  borderWidth: chosenSide === "Tails" ? 0 : 2,
                  borderColor: "#43cea2",
                  transition: "all 0.2s",
                  "&:hover": {
                    background:
                      chosenSide === "Tails"
                        ? "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)"
                        : "linear-gradient(90deg, #43cea2 0%, #e0eafc 100%)",
                    color: "#fff",
                    borderColor: "#185a9d",
                  },
                }}
                onClick={() => setChosenSide("Tails")}
              >
                {t('Tails')}
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Box
                onClick={
                  !chosenSide || isAnimating
                    ? undefined
                    : () => {
                        setIsAnimating(true);
                        setTimeout(() => {
                          setShowCoin(true);
                          setIsAnimating(false);
                          // Immediately flip the coin after showing
                          setTimeout(() => {
                            handleCoinFlip();
                          }, 400);
                        }, 400);
                      }
                }
                sx={{
                  borderRadius: "50%",
                  width: 80,
                  height: 80,
                  background: !chosenSide
                    ? "radial-gradient(circle, #e0eafc 60%, #bdbdbd 100%)"
                    : "radial-gradient(circle, #43cea2 60%, #185a9d 100%)",
                  boxShadow: "0 4px 16px 0 #185a9d44",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  color: "#fff",
                  cursor: !chosenSide ? "not-allowed" : "pointer",
                  opacity: !chosenSide ? 0.5 : 1,
                  userSelect: "none",
                  transition:
                    "background 0.3s, opacity 0.3s, transform 0.9s cubic-bezier(.68,-0.55,.27,1.55)",
                  transform: isAnimating ? "rotateY(720deg)" : "none",
                }}
                title={
                  !chosenSide
                    ? t('Select Heads or Tails first')
                    : t('Click to flip coin')
                }
              >
                🪙
              </Box>
            </Box>
            <Box
              sx={{ fontWeight: 500, fontSize: 15, color: "#185a9d", mt: 1 }}
            >
              {chosenSide
                ? t('Tap the coin to flip')
                : t('Select Heads or Tails to enable coin')}
            </Box>
          </Box>
        )}
        {coinFlipped && tossResult && showTossOptions && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Box
              sx={{ fontWeight: 700, fontSize: 18, color: "#185a9d", mb: 1 }}
            >
              {t('Coin Flip Result:')} <span style={{ color: "#43cea2" }}>{tossResult}</span>
            </Box>
            <Box
              sx={{ fontWeight: 600, fontSize: 16, color: "#185a9d", mb: 1 }}
            >
              {tossTeam} {t('won the toss!')}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                data-ga-click="choose_bat_first"
                onClick={() => handleChooseBatBall("bat")}
                color="primary"
                variant="contained"
                sx={{
                  fontWeight: 800,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontSize: 15,
                  background:
                    "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
                  color: "#fff",
                  boxShadow: "0 2px 8px 0 #185a9d33",
                  transition: "all 0.2s",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)",
                    color: "#fff",
                  },
                }}
              >
                {t('Bat First')}
              </Button>
              <Button
                data-ga-click="choose_ball_first"
                onClick={() => handleChooseBatBall("ball")}
                color="secondary"
                variant="outlined"
                sx={{
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontSize: 15,
                  borderWidth: 2,
                  background: "#fff",
                  color: "#185a9d",
                  borderColor: "#43cea2",
                  boxShadow: "0 2px 8px 0 #185a9d22",
                  transition: "all 0.2s",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #43cea2 0%, #e0eafc 100%)",
                    color: "#185a9d",
                    borderColor: "#185a9d",
                  },
                }}
              >
                {t('Ball First')}
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          pb: 2,
          flexDirection: "column",
          gap: 1,
        }}
      >
        {!showCoin && !showTossOptions && (
          <>
          <Button
            data-ga-click="start_match"
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            sx={{
              fontWeight: 800,
              borderRadius: 2,
              px: 3,
              py: 1,
              fontSize: 15,
              background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
              color: "#fff",
              boxShadow: "0 2px 8px 0 #185a9d33",
              transition: "all 0.2s",
              "&:hover": {
                background: "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)",
                color: "#fff",
              },
            }}
          >
            {t('Start Match')}
          </Button>
            <Button
              data-ga-click="start_match"
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              sx={{
                fontWeight: 800,
                borderRadius: 2,
                px: 3,
                py: 1,
                fontSize: 15,
                background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
                color: "#fff",
                boxShadow: "0 2px 8px 0 #185a9d33",
                transition: "all 0.2s",
                "&:hover": {
                  background: "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)",
                  color: "#fff",
                },
              }}
            >
              {t('Add Players')}
            </Button>
            <PlayerListModal
              open={playerModalOpen}
              onClose={() => setPlayerModalOpen(false)}
              teamNames={[team1.trim(), team2.trim()]}
              onSave={handlePlayersSave}
            />
          </>
        )}
        {!showCoin && !showTossOptions && (
          <Button
            data-ga-click="go_with_toss"
            onClick={() => {
              setShowCoin(false);
              setCoinFlipped(false);
              setTossResult(null);
              setShowTossOptions(true);
              setChosenSide(null);
            }}
            color="secondary"
            variant="outlined"
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              py: 1,
              fontSize: 15,
              borderWidth: 2,
              background: "#fff",
              color: "#185a9d",
              borderColor: "#43cea2",
              boxShadow: "0 2px 8px 0 #185a9d22",
              transition: "all 0.2s",
              "&:hover": {
                background: "linear-gradient(90deg, #43cea2 0%, #e0eafc 100%)",
                color: "#185a9d",
                borderColor: "#185a9d",
              },
            }}
          >
            {t('Go with Toss')}
          </Button>
        )}
      </DialogActions>
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
