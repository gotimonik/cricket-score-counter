import React, { useEffect, useRef, useState } from "react";
import { Box as MuiBox } from "@mui/material";
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
  Chip,
} from "@mui/material";
import { Add, CloseSharp, DeleteOutline } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { toCurrentVersionPath } from "../utils/routes";
import { getStoredAppPreferences } from "../utils/appPreferences";


interface TeamNameModalProps {
  open: boolean;
  requirePlayerRoster?: boolean;
  onSubmit: (
    team1: string,
    team2: string,
    overs: number,
    team1Players: string[],
    team2Players: string[]
  ) => void;
}

const TeamNameModal: React.FC<TeamNameModalProps> = ({
  open,
  requirePlayerRoster = true,
  onSubmit,
}) => {
  const PREDEFINED_PLAYERS = [
    "Miral",
    "Monik",
    "Rajnikant",
    "Rajani H.",
    "Rajnish",
    "Milan C.",
    "Ashish C.",
    "Bapu",
    "Hardik B.",
    "Jay",
    "Rasik",
    "Sunil",
    "Tushar",
    "Venish",
    "Krishnam",
    "Aata",
    "Rutvik",
    "Anil",
  ];
  const { t } = useTranslation();
  const location = useLocation();
  const LOCAL_PLAYERS_KEY = "cricket-team-players";
  const LOCAL_LAST_TEAMS_KEY = "cricket-last-teams";
  const LOCAL_MATCH_STATE_KEY = "cricket-match-state";
  const MIN_PLAYERS_PER_TEAM = 5;
  const normalizePlayers = (players: string[]) =>
    Array.from(
      new Set(
        players
          .map((p) => p.trim())
          .filter(Boolean)
      )
    );
  const getSavedPlayersMap = (): Record<string, string[]> => {
    try {
      const saved = localStorage.getItem(LOCAL_PLAYERS_KEY);
      return saved ? (JSON.parse(saved) as Record<string, string[]>) : {};
    } catch {
      return {};
    }
  };
  const getSavedTeamNames = (): [string, string] | null => {
    try {
      const savedTeams = localStorage.getItem(LOCAL_LAST_TEAMS_KEY);
      if (savedTeams) {
        const parsed = JSON.parse(savedTeams) as string[];
        if (Array.isArray(parsed) && parsed.length >= 2) {
          const first = parsed[0]?.trim();
          const second = parsed[1]?.trim();
          if (first && second) return [first, second];
        }
      }
    } catch {
      // ignore invalid local data
    }

    try {
      const savedState = localStorage.getItem(LOCAL_MATCH_STATE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState) as { teams?: string[] };
        if (Array.isArray(parsed.teams) && parsed.teams.length >= 2) {
          const first = parsed.teams[0]?.trim();
          const second = parsed.teams[1]?.trim();
          if (first && second) return [first, second];
        }
      }
    } catch {
      // ignore invalid local data
    }

    const savedPlayers = getSavedPlayersMap();
    const savedTeamNames = Object.keys(savedPlayers).filter((name) => name.trim());
    if (savedTeamNames.length >= 2) {
      return [savedTeamNames[0], savedTeamNames[1]];
    }
    return null;
  };
  const [team1, setTeam1] = useState("INDIA A");
  const [team2, setTeam2] = useState("INDIA B");
  const [team1Players, setTeam1Players] = useState<string[]>([]);
  const [team2Players, setTeam2Players] = useState<string[]>([]);
  const [playerModalTeam, setPlayerModalTeam] = useState<"team1" | "team2" | null>(
    null
  );
  const [newPlayerName, setNewPlayerName] = useState("");
  const [playerModalError, setPlayerModalError] = useState("");
  const [overs, setOvers] = useState<number>(2);
  const [error, setError] = useState("");
  const [tossResult, setTossResult] = useState<null | "Heads" | "Tails">(null);
  const [tossTeam, setTossTeam] = useState<string>("");
  const [showCoin, setShowCoin] = useState(false);
  const [coinFlipped, setCoinFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTossOptions, setShowTossOptions] = useState(false);
  const [chosenSide, setChosenSide] = useState<null | "Heads" | "Tails">(null);
  // Stepper state: 0 = tip, 1 = form
  const [step, setStep] = useState(0);
  const playersSectionRef = React.useRef<HTMLDivElement | null>(null);
  const addPlayerInputRef = useRef<HTMLInputElement | null>(null);
  const showPredefinedPlayers = getStoredAppPreferences().predefinedPlayersEnabled;

  useEffect(() => {
    if (!playerModalTeam) return;
    const timer = window.setTimeout(() => {
      addPlayerInputRef.current?.focus();
    }, 140);
    return () => window.clearTimeout(timer);
  }, [playerModalTeam]);

  const scrollToPlayersSection = () => {
    requestAnimationFrame(() => {
      playersSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  };
  useEffect(() => {
    if (open) {
      const seen = localStorage.getItem("seenCricketTip");
      setStep(seen ? 1 : 0);
      const savedTeamNames = getSavedTeamNames();
      if (savedTeamNames) {
        setTeam1(savedTeamNames[0]);
        setTeam2(savedTeamNames[1]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const savedPlayers = getSavedPlayersMap();
    setTeam1Players(normalizePlayers(savedPlayers[team1] ?? []));
    setTeam2Players(normalizePlayers(savedPlayers[team2] ?? []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, team1, team2]);

  const handleNextFromTip = () => {
    setStep(1);
    localStorage.setItem("seenCricketTip", "1");
  };

  const navigate = useNavigate();
  const handleSubmit = () => {
    const nextTeam1Players = normalizePlayers(team1Players);
    const nextTeam2Players = normalizePlayers(team2Players);
    if (!team1.trim() || !team2.trim()) {
      setError(t("Please enter both team names."));
      return;
    }
    if (
      requirePlayerRoster &&
      (nextTeam1Players.length < MIN_PLAYERS_PER_TEAM ||
        nextTeam2Players.length < MIN_PLAYERS_PER_TEAM)
    ) {
      scrollToPlayersSection();
      setError(
        t("Please add at least {{count}} players for each team.", {
          count: MIN_PLAYERS_PER_TEAM,
        })
      );
      return;
    }
    if (!overs || overs < 1 || overs > 50) {
      setError(t("Please enter a valid number of overs (1-50)."));
      return;
    }
    if (requirePlayerRoster) {
      const map = getSavedPlayersMap();
      map[team1.trim()] = nextTeam1Players;
      map[team2.trim()] = nextTeam2Players;
      localStorage.setItem(LOCAL_PLAYERS_KEY, JSON.stringify(map));
    }
    localStorage.setItem(
      LOCAL_LAST_TEAMS_KEY,
      JSON.stringify([team1.trim(), team2.trim()])
    );
    setError("");
    onSubmit(
      team1.trim(),
      team2.trim(),
      overs,
      requirePlayerRoster ? nextTeam1Players : [],
      requirePlayerRoster ? nextTeam2Players : []
    );
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
    const nextTeam1Players = normalizePlayers(team1Players);
    const nextTeam2Players = normalizePlayers(team2Players);
    if (
      requirePlayerRoster &&
      (nextTeam1Players.length < MIN_PLAYERS_PER_TEAM ||
        nextTeam2Players.length < MIN_PLAYERS_PER_TEAM)
    ) {
      scrollToPlayersSection();
      setError(
        t("Please add at least {{count}} players for each team.", {
          count: MIN_PLAYERS_PER_TEAM,
        })
      );
      return;
    }
    if (requirePlayerRoster) {
      const map = getSavedPlayersMap();
      map[team1.trim()] = nextTeam1Players;
      map[team2.trim()] = nextTeam2Players;
      localStorage.setItem(LOCAL_PLAYERS_KEY, JSON.stringify(map));
    }
    localStorage.setItem(
      LOCAL_LAST_TEAMS_KEY,
      JSON.stringify([team1.trim(), team2.trim()])
    );
    // If tossTeam chooses to bat, they are team1, else swap order
    if (choice === "bat") {
      onSubmit(
        tossTeam,
        tossTeam === team1.trim() ? team2.trim() : team1.trim(),
        overs,
        tossTeam === team1.trim() ? nextTeam1Players : nextTeam2Players,
        tossTeam === team1.trim() ? nextTeam2Players : nextTeam1Players
      );
    } else {
      // tossTeam bowls, other team bats first
      onSubmit(
        tossTeam === team1.trim() ? team2.trim() : team1.trim(),
        tossTeam,
        overs,
        tossTeam === team1.trim() ? nextTeam2Players : nextTeam1Players,
        tossTeam === team1.trim() ? nextTeam1Players : nextTeam2Players
      );
    }
  };

  const currentModalPlayers = playerModalTeam === "team1" ? team1Players : team2Players;
  const setCurrentModalPlayers =
    playerModalTeam === "team1" ? setTeam1Players : setTeam2Players;
  const otherTeamPlayers = playerModalTeam === "team1" ? team2Players : team1Players;

  const handleAddPlayerFromModal = () => {
    const player = newPlayerName.trim();
    if (!player) {
      setPlayerModalError(t("Player name is required."));
      return;
    }
    if (currentModalPlayers.some((p) => p.toLowerCase() === player.toLowerCase())) {
      setPlayerModalError(t("Player already exists."));
      return;
    }
    setCurrentModalPlayers((prev: string[]) => normalizePlayers([...prev, player]));
    setNewPlayerName("");
    setPlayerModalError("");
    window.setTimeout(() => {
      addPlayerInputRef.current?.focus();
    }, 0);
  };

  const handleRemovePlayerFromModal = (player: string) => {
    setCurrentModalPlayers((prev: string[]) => prev.filter((p) => p !== player));
  };

  const handleTogglePredefinedPlayer = (player: string) => {
    const alreadyInCurrent = currentModalPlayers.some(
      (p) => p.toLowerCase() === player.toLowerCase()
    );
    if (alreadyInCurrent) {
      setCurrentModalPlayers((prev: string[]) =>
        prev.filter((p) => p.toLowerCase() !== player.toLowerCase())
      );
      setPlayerModalError("");
      return;
    }
    const existsInOtherTeam = otherTeamPlayers.some(
      (p) => p.toLowerCase() === player.toLowerCase()
    );
    if (existsInOtherTeam) {
      setPlayerModalError(
        t("Player already selected in the other team.")
      );
      return;
    }
    setCurrentModalPlayers((prev: string[]) => normalizePlayers([...prev, player]));
    setPlayerModalError("");
  };

  return (
    <Dialog
      open={open}
      disableScrollLock
      disableEscapeKeyDown
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 5,
          background: "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)",
          boxShadow: "0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
          border: "2px solid var(--app-accent-start, #43cea2)",
          backdropFilter: "blur(8px)",
          maxWidth: 420,
          width: { xs: "98vw", sm: "auto" },
          margin: "8px",
          p: { xs: 1, sm: 2 },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 900,
          fontSize: "calc(22px * var(--app-font-scale, 1))",
          color: "var(--app-accent-text, #185a9d)",
          mt: 2,
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
      {/* Stepper: Step 0 = Tip, Step 1 = Form */}
      {step === 0 && (
        <MuiBox sx={{ mb: 2, p: 1.5, background: '#fff', borderRadius: 2, boxShadow: '0 1px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)', border: '1.5px solid var(--app-accent-start, #43cea2)', position: 'relative' }}>
          <Box sx={{ mb: 1 }}>
            <strong>{t("How to Set Up Your Cricket Match:")}</strong>
            <ul style={{ margin: '8px 0 0 16px', padding: 0, fontSize: "calc(15px * var(--app-font-scale, 1))" }}>
              <li>{t("Enter unique team names for both sides.")}</li>
              <li>{t("Choose the number of overs (1-50) for your match.")}</li>
              <li>{t("Optionally, use the toss feature to decide who bats or bowls first.")}</li>
              <li>{t('Click "Start Match" to begin scoring live.')}</li>
            </ul>
          </Box>
          <Box sx={{ mb: 1 }}>
            <strong>{t("Cricket Match FAQ:")}</strong>
            <ul style={{ margin: '8px 0 0 16px', padding: 0, fontSize: "calc(15px * var(--app-font-scale, 1))" }}>
              <li><b>{t("What is an over?")}</b> {t("An over consists of 6 legal balls bowled by one bowler.")}</li>
              <li><b>{t("How do I score runs?")}</b> {t("Use the scoring keypad to add runs, wickets, and extras ball-by-ball.")}</li>
              <li><b>{t("Can I share my match?")}</b> {t("Yes! After setup, use the share link to invite friends and family.")}</li>
              <li><b>{t("Is my data private?")}</b> {t("Your scores are only visible to those with your match link.")}</li>
            </ul>
          </Box>
          <Box sx={{ color: 'var(--app-accent-text, #185a9d)', fontWeight: 500, fontSize: "calc(15px * var(--app-font-scale, 1))", mb: 2 }}>
            {t("Need help?")} {t("Contact")} <a href="mailto:support@cricketscorecounter.com">support@cricketscorecounter.com</a>.
          </Box>
          <Button
            data-ga-click="team_setup_next"
            variant="contained"
            color="primary"
            onClick={handleNextFromTip}
            sx={{ fontWeight: 800, borderRadius: 2, px: 3, py: 1, fontSize: "calc(15px * var(--app-font-scale, 1))", background: 'linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)', color: '#fff', boxShadow: '0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)', mt: 1 }}
          >
            {t("Next")}
          </Button>
        </MuiBox>
      )}
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
          data-ga-click="team_modal_close_to_home"
          aria-label="close"
          onClick={() => navigate(toCurrentVersionPath(location.pathname, "/"))}
          sx={{
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
          <CloseSharp fontSize="small" />
        </IconButton>
      </Box>
      <DialogContent sx={{ px: { xs: 0.5, sm: 2 }, pt: 0 }}>
        {step === 1 && (
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
              style={{ fontWeight: 600, fontSize: "calc(16px * var(--app-font-scale, 1))", marginBottom: 4 }}
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
                style: { fontWeight: 700, fontSize: "calc(18px * var(--app-font-scale, 1))", letterSpacing: 1 },
              }}
              sx={{
                background: "#fff",
                borderRadius: 2,
                boxShadow: "0 1px 4px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                "& .MuiInputLabel-root": { fontWeight: 600 },
              }}
            />
            <label
              htmlFor="team2-name"
              style={{ fontWeight: 600, fontSize: "calc(16px * var(--app-font-scale, 1))", marginBottom: 4 }}
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
                style: { fontWeight: 700, fontSize: "calc(18px * var(--app-font-scale, 1))", letterSpacing: 1 },
              }}
              sx={{
                background: "#fff",
                borderRadius: 2,
                boxShadow: "0 1px 4px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                "& .MuiInputLabel-root": { fontWeight: 600 },
              }}
            />
            <label
              htmlFor="overs-input"
              style={{ fontWeight: 600, fontSize: "calc(16px * var(--app-font-scale, 1))", marginBottom: 4 }}
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
                style: { fontWeight: 700, fontSize: "calc(18px * var(--app-font-scale, 1))", letterSpacing: 1, textAlign: 'center' },
              }}
              sx={{
                background: "#fff",
                borderRadius: 2,
                boxShadow: "0 1px 4px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
                "& .MuiInputLabel-root": { fontWeight: 600 },
                mt: 1,
              }}
            />
            {requirePlayerRoster && (
              <Box ref={playersSectionRef} sx={{ display: "flex", flexDirection: "column", gap: 1.1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Box sx={{ fontWeight: 600, fontSize: "calc(16px * var(--app-font-scale, 1))" }}>
                    {t("Team")} {team1 || t("Team 1")} {t("Players")} ({team1Players.length})
                  </Box>
                  <Button
                    data-ga-click="open_team1_players_modal"
                    variant="outlined"
                    onClick={() => {
                      setPlayerModalTeam("team1");
                      setNewPlayerName("");
                      setPlayerModalError("");
                    }}
                    aria-label={t("Add Players")}
                    sx={{
                      minWidth: 40,
                      width: 40,
                      height: 40,
                      borderRadius: 1.5,
                      p: 0,
                      color: "var(--app-accent-text, #185a9d)",
                      background:
                        "color-mix(in srgb, var(--app-accent-start, #43cea2) 12%, #ffffff 88%)",
                      border:
                        "1px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 40%, transparent 60%)",
                      "&:hover": {
                        color: "#fff",
                        background:
                          "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                        border:
                          "1px solid color-mix(in srgb, var(--app-accent-end, #185a9d) 55%, transparent 45%)",
                      },
                    }}
                  >
                    <Add />
                  </Button>
                </Box>
                <Box sx={{ color: "var(--app-accent-text, #185a9d)", fontSize: "calc(13px * var(--app-font-scale, 1))" }}>
                  {team1Players.length
                    ? team1Players.join(", ")
                    : t(
                        "No saved players found for {{team}}. Please add at least {{count}} players.",
                        { team: team1, count: MIN_PLAYERS_PER_TEAM }
                      )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Box sx={{ fontWeight: 600, fontSize: "calc(16px * var(--app-font-scale, 1))" }}>
                    {t("Team")} {team2 || t("Team 2")} {t("Players")} ({team2Players.length})
                  </Box>
                  <Button
                    data-ga-click="open_team2_players_modal"
                    variant="outlined"
                    onClick={() => {
                      setPlayerModalTeam("team2");
                      setNewPlayerName("");
                      setPlayerModalError("");
                    }}
                    aria-label={t("Add Players")}
                    sx={{
                      minWidth: 40,
                      width: 40,
                      height: 40,
                      borderRadius: 1.5,
                      p: 0,
                      color: "var(--app-accent-text, #185a9d)",
                      background:
                        "color-mix(in srgb, var(--app-accent-start, #43cea2) 12%, #ffffff 88%)",
                      border:
                        "1px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 40%, transparent 60%)",
                      "&:hover": {
                        color: "#fff",
                        background:
                          "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                        border:
                          "1px solid color-mix(in srgb, var(--app-accent-end, #185a9d) 55%, transparent 45%)",
                      },
                    }}
                  >
                    <Add />
                  </Button>
                </Box>
                <Box sx={{ color: "var(--app-accent-text, #185a9d)", fontSize: "calc(13px * var(--app-font-scale, 1))" }}>
                  {team2Players.length
                    ? team2Players.join(", ")
                    : t(
                        "No saved players found for {{team}}. Please add at least {{count}} players.",
                        { team: team2, count: MIN_PLAYERS_PER_TEAM }
                      )}
                </Box>
              </Box>
            )}
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
        )}
        {/* Single step toss: after Go with Toss, show Heads/Tails selection and coin to flip in one view */}
        {showTossOptions && !coinFlipped && (
          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Box
              sx={{ fontWeight: 700, fontSize: "calc(18px * var(--app-font-scale, 1))", mb: 2, textAlign: "center" }}
            >
              <span style={{ color: "var(--app-accent-start, #43cea2)" }}>
                {team1.trim() || t('Team 1')}
              </span>{" "}
              {t('will flip the coin')}
              <br />
              <span style={{ color: "var(--app-accent-text, #185a9d)" }}>
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
                  fontSize: "calc(15px * var(--app-font-scale, 1))",
                  background:
                    chosenSide === "Heads"
                      ? "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)"
                      : "#fff",
                  color: chosenSide === "Heads" ? "#fff" : "var(--app-accent-text, #185a9d)",
                  boxShadow:
                    chosenSide === "Heads"
                      ? "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)"
                      : "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
                  borderWidth: chosenSide === "Heads" ? 0 : 2,
                  borderColor: "var(--app-accent-start, #43cea2)",
                  transition: "all 0.2s",
                  "&:hover": {
                    background:
                      chosenSide === "Heads"
                        ? "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)"
                        : "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, #e0eafc 100%)",
                    color: "#fff",
                    borderColor: "var(--app-accent-text, #185a9d)",
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
                  fontSize: "calc(15px * var(--app-font-scale, 1))",
                  background:
                    chosenSide === "Tails"
                      ? "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)"
                      : "#fff",
                  color: chosenSide === "Tails" ? "#fff" : "var(--app-accent-text, #185a9d)",
                  boxShadow:
                    chosenSide === "Tails"
                      ? "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)"
                      : "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
                  borderWidth: chosenSide === "Tails" ? 0 : 2,
                  borderColor: "var(--app-accent-start, #43cea2)",
                  transition: "all 0.2s",
                  "&:hover": {
                    background:
                      chosenSide === "Tails"
                        ? "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)"
                        : "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, #e0eafc 100%)",
                    color: "#fff",
                    borderColor: "var(--app-accent-text, #185a9d)",
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
                    : "radial-gradient(circle, var(--app-accent-start, #43cea2) 60%, var(--app-accent-end, #185a9d) 100%)",
                  boxShadow: "0 4px 16px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 27%, transparent 73%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "calc(32px * var(--app-font-scale, 1))",
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
              sx={{ fontWeight: 500, fontSize: "calc(15px * var(--app-font-scale, 1))", color: "var(--app-accent-text, #185a9d)", mt: 1 }}
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
              sx={{ fontWeight: 700, fontSize: "calc(18px * var(--app-font-scale, 1))", color: "var(--app-accent-text, #185a9d)", mb: 1 }}
            >
              {t('Coin Flip Result:')} <span style={{ color: "var(--app-accent-start, #43cea2)" }}>{tossResult}</span>
            </Box>
            <Box
              sx={{ fontWeight: 600, fontSize: "calc(16px * var(--app-font-scale, 1))", color: "var(--app-accent-text, #185a9d)", mb: 1 }}
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
                  fontSize: "calc(15px * var(--app-font-scale, 1))",
                  background:
                    "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                  color: "#fff",
                  boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
                  transition: "all 0.2s",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
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
                  fontSize: "calc(15px * var(--app-font-scale, 1))",
                  borderWidth: 2,
                  background: "#fff",
                  color: "var(--app-accent-text, #185a9d)",
                  borderColor: "var(--app-accent-start, #43cea2)",
                  boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
                  transition: "all 0.2s",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, #e0eafc 100%)",
                    color: "var(--app-accent-text, #185a9d)",
                    borderColor: "var(--app-accent-text, #185a9d)",
                  },
                }}
              >
                {t('Ball First')}
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
      <Dialog
        open={Boolean(playerModalTeam)}
        onClose={() => setPlayerModalTeam(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: 500,
            width: { xs: "98vw", sm: "auto" },
            m: { xs: "8px", sm: 2 },
          },
        }}
      >
        <DialogTitle sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 800 }}>
          {playerModalTeam === "team1" ? team1 : team2} {t("Players")} ({currentModalPlayers.length})
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              color: "var(--app-accent-text, #185a9d)",
              fontWeight: 700,
              fontSize: "calc(13px * var(--app-font-scale, 1))",
              mb: 1,
            }}
          >
            {t("Selected Players")}: {currentModalPlayers.length}
          </Box>
          {showPredefinedPlayers && (
            <Box sx={{ mb: 1.5 }}>
              <Box
                sx={{
                  color: "var(--app-accent-text, #185a9d)",
                  fontWeight: 700,
                  fontSize: "calc(13px * var(--app-font-scale, 1))",
                  mb: 0.8,
                }}
              >
                {t("Predefined Players")}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.75,
                  maxHeight: 170,
                  overflowY: "auto",
                  pr: 0.5,
                }}
              >
                {PREDEFINED_PLAYERS.filter((player) => {
                  const selectedInCurrent = currentModalPlayers.some(
                    (p) => p.toLowerCase() === player.toLowerCase()
                  );
                  const selectedInOther = otherTeamPlayers.some(
                    (p) => p.toLowerCase() === player.toLowerCase()
                  );
                  return !selectedInCurrent && !selectedInOther;
                }).map((player) => (
                  <Chip
                    key={player}
                    label={player}
                    data-ga-click="toggle_predefined_player"
                    color="primary"
                    variant="outlined"
                    clickable
                    onClick={() => handleTogglePredefinedPlayer(player)}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 700,
                      px: 1.3,
                      py: 0.2,
                      minHeight: 28,
                      minWidth: "unset",
                      width: "auto",
                      background: "#fff",
                      color: "var(--app-accent-text, #185a9d)",
                      borderColor: "var(--app-accent-start, #43cea2)",
                      "& .MuiChip-label": {
                        px: 1.1,
                        fontWeight: 700,
                        fontSize: "calc(13px * var(--app-font-scale, 1))",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              autoFocus
              inputRef={addPlayerInputRef}
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder={t("Enter player name")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddPlayerFromModal();
                }
              }}
            />
            <Button
              data-ga-click="add_player_from_modal"
              variant="contained"
              onClick={handleAddPlayerFromModal}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
              }}
            >
              {t("Add")}
            </Button>
          </Box>
          {playerModalError && (
            <Box sx={{ color: "#e53935", mt: 1, fontSize: "calc(13px * var(--app-font-scale, 1))" }}>
              {playerModalError}
            </Box>
          )}
          <Box
            className="app-scrollable"
            sx={{
              mt: 2,
              height: 220,
              overflowY: "auto",
              border: "1px solid #e0eafc",
              borderRadius: 2,
              px: 1,
            }}
          >
            {currentModalPlayers.length === 0 ? (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  color: "var(--app-accent-text, #185a9d)",
                  opacity: 0.85,
                  px: 2,
                }}
              >
                <Box sx={{ fontWeight: 700, fontSize: "calc(14px * var(--app-font-scale, 1))" }}>
                  {t("No players selected yet")}
                </Box>
                <Box sx={{ mt: 0.5, fontSize: "calc(12px * var(--app-font-scale, 1))" }}>
                  {t("Select predefined players or add a player name above.")}
                </Box>
              </Box>
            ) : (
              currentModalPlayers.map((player) => (
                <Box
                  key={player}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 0.5,
                    borderBottom: "1px solid #e0eafc",
                  }}
                >
                  <Box sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 600 }}>{player}</Box>
                  <IconButton
                    data-ga-click="remove_player_from_modal"
                    size="small"
                    onClick={() => handleRemovePlayerFromModal(player)}
                    sx={{
                      borderRadius: 1.5,
                      color: "var(--app-accent-text, #185a9d)",
                      background:
                        "color-mix(in srgb, var(--app-accent-start, #43cea2) 12%, #ffffff 88%)",
                      border:
                        "1px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 40%, transparent 60%)",
                      "&:hover": {
                        color: "#fff",
                        background:
                          "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                      },
                    }}
                  >
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </Box>
              ))
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            data-ga-click="close_player_modal"
            onClick={() => setPlayerModalTeam(null)}
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              px: 2,
              py: 0.7,
              color: "#fff",
              background:
                "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
              boxShadow:
                "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
              "&:hover": {
                background:
                  "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
              },
            }}
          >
            {t("Done")}
          </Button>
        </DialogActions>
      </Dialog>
      <DialogActions
        sx={{
          justifyContent: "center",
          pb: 2,
          flexDirection: "row",
          gap: 1,
        }}
      >
        {!showCoin && !showTossOptions && step === 1 && (
          <>
            <Button
              data-ga-click="start_match"
              onClick={handleSubmit}
              color="primary"
              variant="contained"
              sx={{
                fontWeight: 800,
                borderRadius: 2,
                px: { xs: 2, sm: 3 },
                py: 1,
                fontSize: "calc(15px * var(--app-font-scale, 1))",
                whiteSpace: "nowrap",
                background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                color: "#fff",
                boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
                transition: "all 0.2s",
                "&:hover": {
                  background: "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
                  color: "#fff",
                },
              }}
            >
              {t('Start Match')}
            </Button>
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
                px: { xs: 2, sm: 3 },
                py: 1,
                fontSize: "calc(15px * var(--app-font-scale, 1))",
                whiteSpace: "nowrap",
                borderWidth: 2,
                background: "#fff",
                color: "var(--app-accent-text, #185a9d)",
                borderColor: "var(--app-accent-start, #43cea2)",
                boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
                transition: "all 0.2s",
                "&:hover": {
                  background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, #e0eafc 100%)",
                  color: "var(--app-accent-text, #185a9d)",
                  borderColor: "var(--app-accent-text, #185a9d)",
                },
              }}
            >
              {t('Go with Toss')}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TeamNameModal;
