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
  fontSize: 14,
  minHeight: 40,
  px: 2.25,
  py: 0.9,
  color: "#fff",
  borderRadius: 2,
  background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
  boxShadow: "0 2px 8px 0 #185a9d33",
  "&:hover": {
    background: "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)",
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
          border: "1px solid #43cea2",
          borderRadius: 2,
          p: 1.5,
          background: "rgba(255,255,255,0.75)",
        }}
      >
        <Typography sx={{ fontWeight: 800, color: "#185a9d", mb: 1 }}>
          {team} Players
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <TextField
            size="small"
            fullWidth
            value={newName}
            placeholder="Add player"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                background: "#fff",
                boxShadow: "0 1px 4px 0 #185a9d22",
              },
            }}
            onChange={(e) =>
              setNewPlayerByTeam((prev) => ({ ...prev, [team]: e.target.value }))
            }
          />
          <Button
            variant="contained"
            onClick={() => {
              onAddPlayer?.(team, newName);
              setNewPlayerByTeam((prev) => ({ ...prev, [team]: "" }));
            }}
            sx={primaryButtonSx}
          >
            Add
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          {players.map((player) => (
            <Button
              key={`${team}-${player}`}
              size="small"
              variant="outlined"
              disabled={!canRemovePlayer?.(team, player)}
              onClick={() => onRemovePlayer?.(team, player)}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: 12,
                minHeight: 32,
                px: 1.25,
                py: 0.35,
                borderRadius: 1.75,
                borderColor: "#185a9d",
                color: "#185a9d",
                background: "#fff",
                "&:hover": {
                  borderColor: "#43cea2",
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

    return (
      <Box key={`scorecard-${inning}`} sx={{ mb: 0.5 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 0.8,
            mb: 0.6,
          }}
        >
          <Box
            sx={{
              border: "1px solid #43cea2",
              borderRadius: 2,
              p: 0.8,
              background:
                "linear-gradient(135deg, rgba(67,206,162,0.12) 0%, rgba(224,234,252,0.5) 100%)",
            }}
          >
            <Typography sx={{ color: "#185a9d", fontSize: 11, fontWeight: 700 }}>
              Batting ({battingSide})
            </Typography>
            <Typography sx={{ color: "#185a9d", fontSize: 13, fontWeight: 900 }}>
              {battingTotals.runs}/{battingTotals.wickets}
            </Typography>
          </Box>
          <Box
            sx={{
              border: "1px solid #43cea2",
              borderRadius: 2,
              p: 0.8,
              background:
                "linear-gradient(135deg, rgba(24,90,157,0.12) 0%, rgba(224,234,252,0.5) 100%)",
            }}
          >
            <Typography sx={{ color: "#185a9d", fontSize: 11, fontWeight: 700 }}>
              Bowling ({bowlingSide})
            </Typography>
            <Typography sx={{ color: "#185a9d", fontSize: 13, fontWeight: 900 }}>
              {oversFromBalls(bowlingTotals.oversBalls)} • {bowlingTotals.runs}/
              {bowlingTotals.wickets}
            </Typography>
          </Box>
        </Box>
        <Typography sx={{ fontWeight: 800, color: "#185a9d", mt: 0.25, mb: 0.35, fontSize: 13 }}>
          Batting ({battingSide})
        </Typography>
        <TableContainer sx={{ width: "100%", overflowX: "auto", mb: 0.5 }}>
          <Table
            size="small"
            sx={{
              minWidth: 640,
              "& .MuiTableCell-root": {
                py: 0.25,
                px: 0.7,
                fontSize: { xs: 10.5, sm: 11.5 },
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
                  Player
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>R</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>B</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>4s</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>6s</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>SR</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>Status</TableCell>
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
                        color: "#185a9d",
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
                        title={stats.out ? stats.dismissalText || "out" : "Not out"}
                      >
                        {stats.out ? stats.dismissalText || "out" : "Not out"}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography sx={{ fontWeight: 800, color: "#185a9d", mt: 0.25, mb: 0.35, fontSize: 13 }}>
          Bowling ({bowlingSide})
        </Typography>
        <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
          <Table
            size="small"
            sx={{
              minWidth: 520,
              "& .MuiTableCell-root": {
                py: 0.25,
                px: 0.7,
                fontSize: { xs: 10.5, sm: 11.5 },
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
                  Bowler
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>O</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>R</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>W</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>Econ</TableCell>
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
                        color: "#185a9d",
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
        border: "1.5px solid #43cea2",
        boxShadow: "0 6px 22px 0 #185a9d22",
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
          <Typography sx={{ fontWeight: 900, color: "#185a9d", fontSize: 18 }}>
            Player Scorecard
          </Typography>
          {editable && !hidePreferencesButton && (
            <Button
              variant="contained"
              onClick={() => setPreferencesOpen(true)}
              sx={primaryButtonSx}
            >
              Player Preferences
            </Button>
          )}
        </Box>
      )}
      {!showHeader && editable && !hidePreferencesButton && (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 0.35 }}>
          <Button
            variant="contained"
            onClick={() => setPreferencesOpen(true)}
            sx={primaryButtonSx}
          >
            Player Preferences
          </Button>
        </Box>
      )}
      <Typography sx={{ color: "#185a9d", mb: 0.35, fontSize: 12 }}>
        Track individual match stats (batting and bowling) for this match only.
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
              color: "#185a9d",
              minHeight: { xs: 40, sm: 48 },
              borderRadius: 2,
              mx: 0.5,
            },
            "& .Mui-selected": {
              color: "#fff !important",
              background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
              boxShadow: "0 2px 8px 0 #43cea288",
            },
            "& .MuiTabs-indicator": {
              display: "none",
            },
          }}
        >
          <Tab label="1st Inning" value="first" />
          <Tab label="2nd Inning" value="second" />
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
            background: "linear-gradient(135deg, #e0eafc 0%, #f8fffc 100%)",
            boxShadow: "0 8px 32px 0 #43cea255",
            border: "2px solid #43cea2",
            backdropFilter: "blur(8px)",
            width: { xs: "calc(100% - 16px)", sm: "100%" },
            m: { xs: 1, sm: 2 },
            p: { xs: 1.5, sm: 2 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#185a9d" }}>
          Player Preferences
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25, mt: 0.5 }}>
            <Button
              variant="contained"
              onClick={() => {
                setPreferencesOpen(false);
                setManagePlayersOpen(true);
              }}
              sx={primaryButtonSx}
            >
              Manage Players
            </Button>
            <Button
              variant="contained"
              disabled={!canChangeBowler}
              onClick={() => {
                setPreferencesOpen(false);
                onChangeBowler?.();
              }}
              sx={primaryButtonSx}
            >
              Change Bowler
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setPreferencesOpen(false)}
            variant="contained"
            sx={primaryButtonSx}
          >
            Close
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
            background: "linear-gradient(135deg, #e0eafc 0%, #f8fffc 100%)",
            boxShadow: "0 8px 32px 0 #43cea255",
            border: "2px solid #43cea2",
            backdropFilter: "blur(8px)",
            width: { xs: "calc(100% - 16px)", sm: "100%" },
            m: { xs: 1, sm: 2 },
            p: { xs: 1.5, sm: 2 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#185a9d" }}>
          Manage Players
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
                  color: "#185a9d",
                  minHeight: { xs: 40, sm: 44 },
                  borderRadius: 2,
                  mx: 0.5,
                },
                "& .Mui-selected": {
                  color: "#fff !important",
                  background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
                },
                "& .MuiTabs-indicator": {
                  display: "none",
                },
              }}
            >
              {teams.map((team) => (
                <Tab key={`manage-tab-${team}`} value={team} label={team} />
              ))}
            </Tabs>
          </Box>
          {manageTeam ? renderTeamPlayerManager(manageTeam) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setManagePlayersOpen(false)}
            variant="contained"
            sx={primaryButtonSx}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PlayerScorecardPanel;
