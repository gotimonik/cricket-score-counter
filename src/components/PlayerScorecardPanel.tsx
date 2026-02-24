import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  PlayerBattingStats,
  PlayerBowlingStats,
  PlayerRosterByTeam,
  PlayerScorecard,
} from "../types/cricket";

interface PlayerScorecardPanelProps {
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
  showHeader?: boolean;
  hidePreferencesButton?: boolean;
  openPreferencesTrigger?: number;
}

const oversFromBalls = (balls: number) =>
  `${Math.floor(balls / 6)}.${balls % 6}`;

const strikeRate = (stats: PlayerBattingStats) =>
  stats.balls > 0 ? ((stats.runs / stats.balls) * 100).toFixed(1) : "0.0";

const economy = (stats: PlayerBowlingStats) => {
  const overs = stats.balls / 6;
  return overs > 0 ? (stats.runsConceded / overs).toFixed(2) : "0.00";
};

const primaryButtonSx = {
  textTransform: "none",
  fontWeight: 700,
  fontSize: "calc(14px * var(--app-font-scale, 1))",
  minHeight: 40,
  px: 2.25,
  py: 0.9,
  color: "#fff",
  borderRadius: 2,
  background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
  boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
  "&:hover": {
    background: "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
  },
};

const PlayerScorecardPanel: React.FC<PlayerScorecardPanelProps> = ({
  teams,
  targetScore,
  playerRosterByTeam,
  playerScorecardByTeam,
  striker,
  bowler,
  editable = true,
  onChangeBowler,
  canChangeBowler = true,
  onAddPlayer,
  onRemovePlayer,
  canRemovePlayer,
  showHeader = true,
  hidePreferencesButton = false,
  openPreferencesTrigger = 0,
}) => {
  const { t } = useTranslation();
  const [newPlayerByTeam, setNewPlayerByTeam] = useState<Record<string, string>>(
    {}
  );
  const [isPreferencesOpen, setPreferencesOpen] = useState(false);
  const [isManagePlayersOpen, setManagePlayersOpen] = useState(false);
  const [manageTeam, setManageTeam] = useState<string>(teams[0] ?? "");
  const [selectedInning, setSelectedInning] = useState<"first" | "second">(
    targetScore > 0 ? "second" : "first"
  );

  React.useEffect(() => {
    setSelectedInning(targetScore > 0 ? "second" : "first");
  }, [targetScore]);

  React.useEffect(() => {
    if (!teams.length) {
      setManageTeam("");
      return;
    }
    if (!teams.includes(manageTeam)) {
      setManageTeam(teams[0]);
    }
  }, [teams, manageTeam]);

  React.useEffect(() => {
    if (!editable) return;
    if (openPreferencesTrigger > 0) {
      setPreferencesOpen(true);
    }
  }, [openPreferencesTrigger, editable]);

  const renderTeamPlayerManager = (team: string) => {
    const players = playerRosterByTeam[team] ?? [];
    const newName = newPlayerByTeam[team] ?? "";
    return (
      <Box
        key={team}
        sx={{
          flex: 1,
          minWidth: { xs: "100%", sm: 260 },
          border: "1px solid var(--app-accent-start, #43cea2)",
          borderRadius: 2,
          p: 1.5,
          background: "rgba(255,255,255,0.75)",
        }}
      >
        <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
          {team} {t("Players")}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <TextField
            size="small"
            fullWidth
            value={newName}
            placeholder={t("Add player")}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                background: "#fff",
                boxShadow: "0 1px 4px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
              },
            }}
            onChange={(e) =>
              setNewPlayerByTeam((prev) => ({ ...prev, [team]: e.target.value }))
            }
          />
          <Button
            data-ga-click="add_player"
            variant="contained"
            onClick={() => {
              onAddPlayer?.(team, newName);
              setNewPlayerByTeam((prev) => ({ ...prev, [team]: "" }));
            }}
            sx={primaryButtonSx}
          >
            {t("Add")}
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          {players.map((player) => (
            <Button
              key={`${team}-${player}`}
              data-ga-click="remove_player"
              size="small"
              variant="outlined"
              disabled={!canRemovePlayer?.(team, player)}
              onClick={() => onRemovePlayer?.(team, player)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: "calc(12px * var(--app-font-scale, 1))",
                minHeight: 32,
                px: 1.25,
                py: 0.35,
                borderRadius: 1.75,
                borderColor: "var(--app-accent-text, #185a9d)",
                color: "var(--app-accent-text, #185a9d)",
                background: "#fff",
                "&:hover": {
                  borderColor: "var(--app-accent-start, #43cea2)",
                  background: "#f7fcff",
                },
              }}
            >
              {player} {canRemovePlayer?.(team, player) ? "x" : ""}
            </Button>
          ))}
        </Box>
      </Box>
    );
  };

  const renderInningScorecard = (inning: "first" | "second") => {
    const battingSide = inning === "first" ? teams[0] : teams[1];
    const bowlingSide = inning === "first" ? teams[1] : teams[0];
    const currentBattingSide = targetScore > 0 ? teams[1] : teams[0];
    const currentBowlingSide = targetScore > 0 ? teams[0] : teams[1];
    const showLiveMarkers =
      battingSide === currentBattingSide && bowlingSide === currentBowlingSide;

    const battingPlayersByInning = playerRosterByTeam[battingSide] ?? [];
    const bowlingPlayersByInning = playerRosterByTeam[bowlingSide] ?? [];
    const battingStats = playerScorecardByTeam[battingSide]?.batting ?? {};
    const bowlingStats = playerScorecardByTeam[bowlingSide]?.bowling ?? {};
    const battingTotals = battingPlayersByInning.reduce(
      (acc, player) => {
        const stats = battingStats[player];
        if (!stats) return acc;
        acc.runs += stats.runs;
        if (stats.out) acc.wickets += 1;
        return acc;
      },
      { runs: 0, wickets: 0 }
    );
    const bowlingTotals = bowlingPlayersByInning.reduce(
      (acc, player) => {
        const stats = bowlingStats[player];
        if (!stats) return acc;
        acc.oversBalls += stats.balls;
        acc.runs += stats.runsConceded;
        acc.wickets += stats.wickets;
        return acc;
      },
      { oversBalls: 0, runs: 0, wickets: 0 }
    );
    const inningsTotalRuns = Math.max(battingTotals.runs, bowlingTotals.runs);
    const extras = Math.max(inningsTotalRuns - battingTotals.runs, 0);

    return (
      <Box key={`scorecard-${inning}`} sx={{ mb: 0.5 }}>
        <Box
          sx={{
            border: "1px solid var(--app-accent-start, #43cea2)",
            borderRadius: 2.2,
            p: { xs: 0.95, sm: 1.05 },
            mb: 0.75,
            background:
              "linear-gradient(135deg, rgba(67,206,162,0.13) 0%, rgba(24,90,157,0.09) 100%)",
            boxShadow: "0 2px 10px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 12%, transparent 88%)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1.1,
            }}
          >
            <Box sx={{ minWidth: 170 }}>
              <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontSize: "calc(11px * var(--app-font-scale, 1))", fontWeight: 700 }}>
                {t("Batting")} ({battingSide})
              </Typography>
              <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontSize: "calc(19px * var(--app-font-scale, 1))", fontWeight: 900, lineHeight: 1.1 }}>
                {inningsTotalRuns}/{battingTotals.wickets}
              </Typography>
              {extras > 0 ? (
                <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontSize: "calc(10.5px * var(--app-font-scale, 1))", fontWeight: 700, opacity: 0.85, mt: 0.2 }}>
                  {t("Extras")}: {extras}
                </Typography>
              ) : null}
            </Box>
            <Box sx={{ minWidth: 170, textAlign: { xs: "left", sm: "right" } }}>
              <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontSize: "calc(11px * var(--app-font-scale, 1))", fontWeight: 700 }}>
                {t("Bowling")} ({bowlingSide})
              </Typography>
              <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontSize: "calc(19px * var(--app-font-scale, 1))", fontWeight: 900, lineHeight: 1.1 }}>
                {oversFromBalls(bowlingTotals.oversBalls)} • {bowlingTotals.runs}/
                {bowlingTotals.wickets}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mt: 0.25, mb: 0.35, fontSize: "calc(13px * var(--app-font-scale, 1))" }}>
          {t("Batting")} ({battingSide})
        </Typography>
        <TableContainer sx={{ width: "100%", overflowX: "auto", mb: 0.5 }}>
          <Table
            size="small"
            sx={{
              minWidth: 640,
              "& .MuiTableCell-root": {
                py: 0.25,
                px: 0.7,
                fontSize: { xs: "calc(10.5px * var(--app-font-scale, 1))", sm: "calc(11.5px * var(--app-font-scale, 1))" },
                lineHeight: 1.15,
                whiteSpace: "nowrap",
              },
              "& .MuiTableRow-root": {
                height: 28,
              },
              "& .MuiTableRow-root:nth-of-type(odd)": {
                backgroundColor: "rgba(24,90,157,0.03)",
              },
              "& .MuiTableRow-root:hover": {
                backgroundColor: "rgba(67,206,162,0.12)",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    position: "sticky",
                    left: 0,
                    zIndex: 3,
                    backgroundColor: "#f6fbff",
                    fontWeight: 800,
                  }}
                >
                  {t("Player")}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>{t("R")}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>{t("B")}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>4s</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>6s</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>{t("SR")}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>{t("Status")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {battingPlayersByInning.map((player) => {
                const stats = battingStats[player] ?? {
                  runs: 0,
                  balls: 0,
                  fours: 0,
                  sixes: 0,
                  out: false,
                  dismissalText: "",
                };
                return (
                  <TableRow key={`bat-${inning}-${player}`}>
                    <TableCell
                      sx={{
                        position: "sticky",
                        left: 0,
                        zIndex: 2,
                        backgroundColor: "rgba(255,255,255,0.97)",
                        borderRight: "1px solid #e8eef7",
                        fontWeight: 700,
                        color: "var(--app-accent-text, #185a9d)",
                      }}
                    >
                      {player}
                      {showLiveMarkers && striker === player ? " *" : ""}
                    </TableCell>
                    <TableCell align="right">{stats.runs}</TableCell>
                    <TableCell align="right">{stats.balls}</TableCell>
                    <TableCell align="right">{stats.fours}</TableCell>
                    <TableCell align="right">{stats.sixes}</TableCell>
                    <TableCell align="right">{strikeRate(stats)}</TableCell>
                    <TableCell align="right" sx={{ maxWidth: 130 }}>
                      <Box
                        component="span"
                        sx={{
                          display: "inline-block",
                          maxWidth: 125,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          verticalAlign: "bottom",
                        }}
                        title={stats.out ? stats.dismissalText || t("out") : t("Not out")}
                      >
                        {stats.out ? stats.dismissalText || t("out") : t("Not out")}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mt: 0.25, mb: 0.35, fontSize: "calc(13px * var(--app-font-scale, 1))" }}>
          {t("Bowling")} ({bowlingSide})
        </Typography>
        <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
          <Table
            size="small"
            sx={{
              minWidth: 520,
              "& .MuiTableCell-root": {
                py: 0.25,
                px: 0.7,
                fontSize: { xs: "calc(10.5px * var(--app-font-scale, 1))", sm: "calc(11.5px * var(--app-font-scale, 1))" },
                lineHeight: 1.15,
                whiteSpace: "nowrap",
              },
              "& .MuiTableRow-root": {
                height: 28,
              },
              "& .MuiTableRow-root:nth-of-type(odd)": {
                backgroundColor: "rgba(24,90,157,0.03)",
              },
              "& .MuiTableRow-root:hover": {
                backgroundColor: "rgba(67,206,162,0.12)",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    position: "sticky",
                    left: 0,
                    zIndex: 3,
                    backgroundColor: "#f6fbff",
                    fontWeight: 800,
                  }}
                >
                  {t("Bowler")}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>{t("O")}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>{t("R")}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>{t("W")}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>{t("Econ")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bowlingPlayersByInning.map((player) => {
                const stats = bowlingStats[player] ?? {
                  balls: 0,
                  runsConceded: 0,
                  wickets: 0,
                };
                return (
                  <TableRow key={`bowl-${inning}-${player}`}>
                    <TableCell
                      sx={{
                        position: "sticky",
                        left: 0,
                        zIndex: 2,
                        backgroundColor: "rgba(255,255,255,0.97)",
                        borderRight: "1px solid #e8eef7",
                        fontWeight: 700,
                        color: "var(--app-accent-text, #185a9d)",
                      }}
                    >
                      {player}
                      {showLiveMarkers && bowler === player ? " *" : ""}
                    </TableCell>
                    <TableCell align="right">{oversFromBalls(stats.balls)}</TableCell>
                    <TableCell align="right">{stats.runsConceded}</TableCell>
                    <TableCell align="right">{stats.wickets}</TableCell>
                    <TableCell align="right">{economy(stats)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Paper
      elevation={6}
      sx={{
        width: "100%",
        mt: 0.5,
        mb: editable ? { xs: 0.75, sm: 1 } : 0.35,
        p: { xs: 0.75, sm: 1 },
        borderRadius: 3,
        background: "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(248,255,252,0.94) 100%)",
        border: "1.5px solid var(--app-accent-start, #43cea2)",
        boxShadow: "0 6px 22px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
      }}
    >
      {showHeader && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 1,
            mb: 0.35,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Typography sx={{ fontWeight: 900, color: "var(--app-accent-text, #185a9d)", fontSize: "calc(18px * var(--app-font-scale, 1))" }}>
            {t("Player Scorecard")}
          </Typography>
          {editable && !hidePreferencesButton && (
            <Button
              data-ga-click="open_player_preferences"
              variant="contained"
              onClick={() => setPreferencesOpen(true)}
              sx={primaryButtonSx}
            >
              {t("Player Preferences")}
            </Button>
          )}
        </Box>
      )}
      {!showHeader && editable && !hidePreferencesButton && (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 0.35 }}>
          <Button
            data-ga-click="open_player_preferences"
            variant="contained"
            onClick={() => setPreferencesOpen(true)}
            sx={primaryButtonSx}
          >
            {t("Player Preferences")}
          </Button>
        </Box>
      )}
      <Typography sx={{ color: "var(--app-accent-text, #185a9d)", mb: 0.35, fontSize: "calc(12px * var(--app-font-scale, 1))" }}>
        {t("Track individual match stats (batting and bowling) for this match only.")}
      </Typography>

      {editable && <Divider sx={{ my: 0.6 }} />}

      <Box sx={{ borderBottom: "1px solid #d7e7fa", mb: 0.35 }}>
        <Tabs
          value={selectedInning}
          onChange={(_, nextInning) => setSelectedInning(nextInning)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              color: "var(--app-accent-text, #185a9d)",
              minHeight: { xs: 40, sm: 48 },
              borderRadius: 2,
              mx: 0.5,
            },
            "& .Mui-selected": {
              color: "#fff !important",
              background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
              boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 52%, transparent 48%)",
            },
            "& .MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          <Tab
            data-ga-click="select_first_inning"
            label={t("1st Inning")}
            value="first"
          />
          <Tab
            data-ga-click="select_second_inning"
            label={t("2nd Inning")}
            value="second"
          />
        </Tabs>
      </Box>

      {renderInningScorecard(selectedInning)}

      <Dialog
        open={isPreferencesOpen}
        onClose={() => setPreferencesOpen(false)}
        fullWidth
        maxWidth="xs"
        disableScrollLock
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 5,
            background: "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)",
            boxShadow: "0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
            border: "2px solid var(--app-accent-start, #43cea2)",
            backdropFilter: "blur(8px)",
            width: { xs: "calc(100% - 16px)", sm: "100%" },
            m: { xs: 1, sm: 2 },
            p: { xs: 1.5, sm: 2 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)" }}>
          {t("Player Preferences")}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, mt: 0.5 }}>
            <Button
              data-ga-click="open_manage_players"
              variant="contained"
              onClick={() => {
                setPreferencesOpen(false);
                setManagePlayersOpen(true);
              }}
              sx={primaryButtonSx}
            >
              {t("Manage Players")}
            </Button>
            <Button
              data-ga-click="change_bowler_from_preferences"
              variant="contained"
              disabled={!canChangeBowler}
              onClick={() => {
                setPreferencesOpen(false);
                onChangeBowler?.();
              }}
              sx={primaryButtonSx}
            >
              {t("Change Bowler")}
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            data-ga-click="close_player_preferences"
            onClick={() => setPreferencesOpen(false)}
            variant="contained"
            sx={primaryButtonSx}
          >
            {t("Close")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isManagePlayersOpen}
        onClose={() => setManagePlayersOpen(false)}
        fullWidth
        maxWidth="sm"
        disableScrollLock
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 5,
            background: "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)",
            boxShadow: "0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
            border: "2px solid var(--app-accent-start, #43cea2)",
            backdropFilter: "blur(8px)",
            width: { xs: "calc(100% - 16px)", sm: "100%" },
            m: { xs: 1, sm: 2 },
            p: { xs: 1.5, sm: 2 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)" }}>
          {t("Manage Players")}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: "1px solid #d7e7fa", mb: 1 }}>
            <Tabs
              value={manageTeam}
              onChange={(_, nextTeam) => setManageTeam(nextTeam)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 700,
                  color: "var(--app-accent-text, #185a9d)",
                  minHeight: { xs: 40, sm: 44 },
                  borderRadius: 2,
                  mx: 0.5,
                },
                "& .Mui-selected": {
                  color: "#fff !important",
                  background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                },
                "& .MuiTabs-indicator": {
                  display: "none",
                },
              }}
            >
              {teams.map((team) => (
                <Tab
                  key={`manage-tab-${team}`}
                  value={team}
                  label={team}
                  data-ga-click="manage_players_tab"
                />
              ))}
            </Tabs>
          </Box>
          {manageTeam ? renderTeamPlayerManager(manageTeam) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            data-ga-click="done_manage_players"
            onClick={() => setManagePlayersOpen(false)}
            variant="contained"
            sx={primaryButtonSx}
          >
            {t("Done")}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PlayerScorecardPanel;
