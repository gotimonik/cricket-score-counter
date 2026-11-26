import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ChevronRightRounded,
  CloseRounded,
  EmojiEventsRounded,
  IosShareRounded,
  LockRounded,
  PlaceRounded,
  SettingsRounded,
} from "@mui/icons-material";
import AppBar from "./AppBar";
import AppSpinner from "./AppSpinner";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";
import ShareSheet from "./share/ShareSheet";
import { tournamentStoryCard } from "../utils/shareCards";
import useSwipeTabs from "../hooks/useSwipeTabs";
import ExploreService, { type PublicScorecardResponse, type PublicTournamentResponse } from "../services/ExploreService";
import { APP_URL } from "../utils/constant";
import { formatOvers } from "../utils/matchStats";
import { resolveApiMediaUrl } from "../utils/mediaUrl";
import TournamentPlayerStatsPanel from "./stats/TournamentPlayerStatsPanel";
import PlayerAvatar from "./player/PlayerAvatar";
import { primaryButtonSx } from "./player/buttonStyles";
import { visibilityIcon, visibilityLabel } from "./privacy/VisibilityPicker";
import { formatDate, ink, muted, sectionSx } from "./profile/ProfileUi";
import { scoreDetailSx, scoreNameSx, scoreTableSx } from "./scorecard/scoreTableSx";

type TabKey = "table" | "matches" | "stats" | "squads";
const TABS: readonly TabKey[] = ["table", "matches", "stats", "squads"];

/** Standard short dismissal text: "b Bumrah", "c Gill b Bumrah", "lbw b Bumrah". */
const dismissalText = (b: { out?: boolean; wicketType?: string; fielder?: string; bowler?: string }) => {
  if (!b.out) return "not out";
  const type = (b.wicketType ?? "").toLowerCase();
  if (type === "bowled") return b.bowler ? `b ${b.bowler}` : "bowled";
  if (type === "caught") {
    if (b.fielder && b.bowler && b.fielder === b.bowler) return `c & b ${b.bowler}`;
    return [b.fielder && `c ${b.fielder}`, b.bowler && `b ${b.bowler}`].filter(Boolean).join(" ") || "caught";
  }
  if (type === "lbw") return b.bowler ? `lbw b ${b.bowler}` : "lbw";
  if (type === "run-out" || type === "run out") return b.fielder ? `run out (${b.fielder})` : "run out";
  if (type.startsWith("retired")) return "retired hurt";
  return [type.replace(/-/g, " "), b.fielder && `c ${b.fielder}`, b.bowler && `b ${b.bowler}`].filter(Boolean).join(" ") || "out";
};

const ScorecardDialog: React.FC<{ tournamentId: string; matchId: string; onClose: () => void }> = ({ tournamentId, matchId, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [data, setData] = React.useState<PublicScorecardResponse | null>(null);
  const [error, setError] = React.useState("");
  const [inningsTab, setInningsTab] = React.useState<string>("0");
  const inningsKeys = React.useMemo(
    () => (data?.innings ?? []).map((_, i) => String(i)),
    [data],
  );
  const swipe = useSwipeTabs(inningsKeys, inningsTab, setInningsTab, { disabled: inningsKeys.length < 2 });
  React.useEffect(() => {
    ExploreService.scorecard(tournamentId, matchId)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Couldn't load the scorecard."));
  }, [tournamentId, matchId]);
  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={fullScreen}
      PaperProps={{ sx: { bgcolor: "#f3f6f8", borderRadius: fullScreen ? 0 : 3 } }}
    >
      <DialogTitle
        sx={{
          position: "relative",
          fontWeight: 900,
          color: "#fff",
          pr: 6,
          py: { xs: 1.25, sm: 1.75 },
          px: { xs: 1.5, sm: 2.5 },
          fontSize: { xs: 17, sm: 20 },
          lineHeight: 1.25,
          background: "linear-gradient(135deg, #1a4638 0%, #0F2E25 60%, #0A1F1A 100%)",
        }}
      >
        {data ? `${data.team1Name} vs ${data.team2Name}` : "Scorecard"}
        {data?.resultText && (
          <Box component="span" sx={{ display: "block", mt: 0.4, fontSize: { xs: 13, sm: 14 }, fontWeight: 800, color: "#9fe0bd" }}>
            {data.resultText}
          </Box>
        )}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 6, top: 6, color: "#fff" }}
          aria-label="Close"
        >
          <CloseRounded />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 0, sm: 2 }, bgcolor: "#f3f6f8" }}>
        {error ? (
          <Alert severity="error" sx={{ m: 1.5 }}>{error}</Alert>
        ) : !data ? (
          <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
            <AppSpinner />
          </Box>
        ) : (
          <>
            {data.innings.length > 1 && (
              <Tabs
                value={inningsTab}
                onChange={(_, v: string) => setInningsTab(v)}
                variant="fullWidth"
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 3,
                  minHeight: 0,
                  bgcolor: "#fff",
                  borderBottom: "1px solid #e3e9ee",
                  "& .MuiTabs-indicator": { height: 3, background: "#0F2E25" },
                  "& .MuiTab-root": {
                    minHeight: 0,
                    minWidth: 0,
                    py: 1,
                    px: 0.75,
                    textTransform: "none",
                    fontWeight: 800,
                    color: "#5f6b66",
                    lineHeight: 1.2,
                  },
                  "& .MuiTab-root.Mui-selected": { color: "#0F2E25" },
                }}
              >
                {data.innings.map((inn, i) => (
                  <Tab
                    key={inn.battingTeam + i}
                    value={String(i)}
                    label={
                      <Box component="span" sx={{ display: "block", textAlign: "center", minWidth: 0, maxWidth: "100%" }}>
                        <Box component="span" sx={{ display: "block", fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {inn.battingTeam}
                        </Box>
                        <Box component="span" sx={{ display: "block", fontSize: 12.5, fontWeight: 700, opacity: 0.85 }}>
                          {inn.runs}-{inn.wickets} ({inn.oversText})
                        </Box>
                      </Box>
                    }
                  />
                ))}
              </Tabs>
            )}
            <Box {...swipe.handlers} key={inningsTab} sx={{ ...swipe.enterSx, pb: 2 }}>
            {data.innings.filter((_, i) => String(i) === inningsTab || data.innings.length < 2).map((inn) => {
              const bpo = inn.ballsPerOver || 6;
              const rr = inn.legalBalls ? ((inn.runs * bpo) / inn.legalBalls).toFixed(2) : "0.00";
              const fow = inn.fallOfWickets ?? [];
              return (
              <Box key={inn.battingTeam} sx={{ mt: { xs: 1, sm: 1.5 } }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="baseline"
                  spacing={1}
                  sx={{ px: { xs: 1.5, sm: 2 }, py: 1, bgcolor: "#dfe8ee", borderRadius: { xs: 0, sm: "12px 12px 0 0" } }}
                >
                  <Typography sx={{ fontWeight: 900, color: ink, fontSize: 15, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {inn.battingTeam}
                  </Typography>
                  <Typography sx={{ fontWeight: 900, color: ink, fontSize: 16, whiteSpace: "nowrap" }}>
                    {inn.runs}-{inn.wickets} <Box component="span" sx={{ color: muted, fontWeight: 700, fontSize: 13.5 }}>({inn.oversText} Ov)</Box>
                  </Typography>
                </Stack>
                <Box sx={{ bgcolor: "#fff", borderRadius: { xs: 0, sm: "0 0 12px 12px" }, overflow: "hidden" }}>
                  <Box component="table" sx={scoreTableSx}>
                    <thead>
                      <tr>
                        <th>Batter</th>
                        <th>R</th>
                        <th>B</th>
                        <th>4s</th>
                        <th>6s</th>
                        <th>SR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inn.batting.map((b) => (
                        <tr key={b.name}>
                          <td>
                            <Box component="span" sx={scoreNameSx}>{b.name}</Box>
                            <Box component="span" sx={scoreDetailSx}>{dismissalText(b)}</Box>
                          </td>
                          <td className="strong">{b.runs}</td>
                          <td>{b.balls}</td>
                          <td>{b.fours}</td>
                          <td>{b.sixes}</td>
                          <td>{b.balls ? ((b.runs * 100) / b.balls).toFixed(2) : "–"}</td>
                        </tr>
                      ))}
                      <tr className="subtle">
                        <td><b>Extras</b></td>
                        <td className="strong">{inn.extras}</td>
                        <td colSpan={4} />
                      </tr>
                      <tr className="subtle">
                        <td><b>Total</b></td>
                        <td colSpan={5} className="strong">
                          {inn.runs}-{inn.wickets}{" "}
                          <Box component="span" sx={{ fontWeight: 600, color: muted }}>({inn.oversText} Ov, RR {rr})</Box>
                        </td>
                      </tr>
                    </tbody>
                  </Box>
                  <Box component="table" sx={{ ...scoreTableSx, mt: 1, borderTop: "6px solid #f3f6f8" }}>
                    <thead>
                      <tr>
                        <th>Bowler</th>
                        <th>O</th>
                        <th>M</th>
                        <th>R</th>
                        <th>W</th>
                        <th>ER</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inn.bowling.map((w) => (
                        <tr key={w.name}>
                          <td>
                            <Box component="span" sx={scoreNameSx}>{w.name}</Box>
                          </td>
                          <td>{formatOvers(w.balls, bpo)}</td>
                          <td>{w.maidens}</td>
                          <td>{w.runs}</td>
                          <td className="strong">{w.wickets}</td>
                          <td>{w.balls ? ((w.runs * bpo) / w.balls).toFixed(2) : "–"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Box>
                  {fow.length > 0 && (
                    <Box sx={{ borderTop: "6px solid #f3f6f8" }}>
                      <Stack direction="row" justifyContent="space-between" sx={{ px: { xs: 1, sm: 1.5 }, py: 0.7, bgcolor: "#f3f6f8", color: "#5b6976", fontWeight: 800, fontSize: 11.5 }}>
                        <span>Fall of wickets</span>
                        <span>Score (Over)</span>
                      </Stack>
                      {fow.map((f) => (
                        <Stack
                          key={f.wicket}
                          direction="row"
                          justifyContent="space-between"
                          spacing={1}
                          sx={{ px: { xs: 1, sm: 1.5 }, py: 0.8, borderBottom: "1px solid #edf1f4", fontSize: 13 }}
                        >
                          <Box component="span" sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 700, minWidth: 0 }}>{f.batter}</Box>
                          <Box component="span" sx={{ whiteSpace: "nowrap", color: "#1f2d3a", fontWeight: 700 }}>
                            {f.score}-{f.wicket} <Box component="span" sx={{ color: muted, fontWeight: 600 }}>({f.overs})</Box>
                          </Box>
                        </Stack>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
              );
            })}
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

/**
 * /t/:tournamentId — read-only tournament page anyone can open when the
 * tournament is public or unlisted (private ones: organizer and squad players).
 */
const PublicTournamentPage: React.FC = () => {
  const { tournamentId = "" } = useParams();
  const navigate = useNavigate();
  const [data, setData] = React.useState<PublicTournamentResponse | null>(null);
  const [error, setError] = React.useState("");
  const [tab, setTab] = React.useState<TabKey>("table");
  const [scorecardId, setScorecardId] = React.useState("");
  const [notice, setNotice] = React.useState("");
  const [shareOpen, setShareOpen] = React.useState(false);
  const swipe = useSwipeTabs(TABS, tab, setTab, { disabled: Boolean(scorecardId) });

  React.useEffect(() => {
    setData(null);
    setError("");
    ExploreService.tournament(tournamentId)
      .then(setData)
      .catch(() => setError("This tournament doesn't exist or is private."));
  }, [tournamentId]);

  const t = data?.tournament;
  const completed = (data?.matches ?? []).filter((m) => m.status === "completed");
  const live = (data?.matches ?? []).filter((m) => m.status === "in_progress");

  const share = () => {
    if (t) setShareOpen(true);
  };

  return (
    <>
      <MetaHelmet
        pageTitle={t ? `${t.name} – Points table, results & stats` : "Tournament"}
        description={t ? `${t.name} in ${t.location}: live points table, match results, scorecards, top run-scorers and wicket-takers.` : "Cricket tournament"}
        canonical={`/t/${tournamentId}`}
        robots={t?.visibility === "public" ? "index,follow" : "noindex,follow"}
      />
      <AppBar showHomeMenuItem />
      <Box sx={{ minHeight: "100vh", bgcolor: "#eef5f7", pb: 6 }}>
        <Box sx={{ maxWidth: 1080, mx: "auto", px: { xs: 1.4, md: 3 }, pt: 2 }}>
          <PageTitleWithBack
            fallbackTo="/explore/tournaments"
            titleSx={{ fontSize: { xs: "calc(24px * var(--app-font-scale, 1))", sm: "calc(32px * var(--app-font-scale, 1))" }, fontWeight: 900, color: "var(--app-accent-text, #185a9d)" }}
          >
            Tournament
          </PageTitleWithBack>

          {error ? (
            <Paper elevation={0} sx={{ ...sectionSx, textAlign: "center", py: 4 }}>
              <LockRounded sx={{ fontSize: 40, color: "#8a96a3" }} />
              <Typography sx={{ fontWeight: 900, color: ink, fontSize: 18, mt: 1 }}>{error}</Typography>
              <Typography sx={{ color: muted, fontWeight: 600, mt: 0.5, mb: 2 }}>
                If you organize it or play in it, log in to see it.
              </Typography>
              <Button variant="contained" onClick={() => navigate("/explore/tournaments")} sx={primaryButtonSx}>
                Explore tournaments
              </Button>
            </Paper>
          ) : !data || !t ? (
            <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
              <AppSpinner />
            </Box>
          ) : (
            <Stack spacing={{ xs: 1.5, sm: 2 }}>
              <Paper
                elevation={0}
                sx={{
                  ...sectionSx,
                  p: { xs: 1.5, sm: 2.75 },
                  color: "#fff",
                  border: "none",
                  background: "linear-gradient(135deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                }}
              >
                <Stack direction="row" spacing={{ xs: 1.25, sm: 2 }} alignItems="center">
                  <Avatar
                    src={resolveApiMediaUrl(t.logoUrl) || undefined}
                    variant="rounded"
                    sx={{ width: { xs: 52, sm: 76 }, height: { xs: 52, sm: 76 }, flex: "none", borderRadius: 2.5, background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.7)" }}
                  >
                    <EmojiEventsRounded sx={{ fontSize: { xs: 28, sm: 40 }, color: "#fff" }} />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography component="h1" sx={{ fontSize: { xs: "calc(20px * var(--app-font-scale, 1))", sm: "calc(26px * var(--app-font-scale, 1))" }, fontWeight: 900, lineHeight: 1.15, wordBreak: "break-word" }}>
                      {t.name}
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ opacity: 0.92, mt: 0.25, minWidth: 0 }}>
                      <PlaceRounded sx={{ fontSize: 15, flex: "none" }} />
                      <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, sm: 15 }, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {t.location} · {formatDate(t.startDate, false)} – {formatDate(t.endDate)}
                      </Typography>
                    </Stack>
                  </Box>
                  <Stack direction={{ xs: "row", sm: "column" }} spacing={1} sx={{ flex: "none", display: { xs: "none", sm: "flex" } }}>
                    {t.visibility !== "private" && (
                      <Button size="small" startIcon={<IosShareRounded />} onClick={share} sx={{ color: "#0c3558", background: "#fff", fontWeight: 900, textTransform: "none", borderRadius: 1.5, "&:hover": { background: "#eef5f7" } }}>
                        Share
                      </Button>
                    )}
                    {t.isOrganizer && (
                      <Button size="small" startIcon={<SettingsRounded />} onClick={() => navigate(`/tournaments/${t.id}`)} sx={{ color: "#fff", border: "1px solid rgba(255,255,255,0.7)", fontWeight: 900, textTransform: "none", borderRadius: 1.5 }}>
                        Manage
                      </Button>
                    )}
                  </Stack>
                </Stack>
                <Stack direction="row" columnGap={0.6} rowGap={0.6} flexWrap="wrap" useFlexGap sx={{ mt: { xs: 1.25, sm: 1.5 } }}>
                  {[
                    t.status === "active" ? "Live" : t.status === "completed" ? "Completed" : "Upcoming",
                    t.format === "knockout" ? "Knockout" : "League",
                    `${t.oversPerMatch} overs`,
                    `${t.ballType} ball`,
                    `by ${t.organizerName}`,
                  ].map((x) => (
                    <Chip
                      key={x}
                      size="small"
                      label={x}
                      sx={{ color: "#fff", background: "rgba(255,255,255,0.18)", fontWeight: 800, height: { xs: 22, sm: 24 }, fontSize: { xs: 11.5, sm: 12.5 }, textTransform: "capitalize", maxWidth: "100%" }}
                    />
                  ))}
                  {t.visibility !== "public" && (
                    <Chip
                      size="small"
                      icon={visibilityIcon(t.visibility, 14)}
                      label={visibilityLabel(t.visibility)}
                      sx={{ color: "#fff", background: "rgba(0,0,0,0.2)", fontWeight: 800, height: 22, "& .MuiChip-icon": { color: "#fff" } }}
                    />
                  )}
                </Stack>
                <Stack direction="row" spacing={1} sx={{ mt: 1.25, display: { xs: "flex", sm: "none" } }}>
                  {t.visibility !== "private" && (
                    <Button fullWidth size="small" startIcon={<IosShareRounded />} onClick={share} sx={{ color: "#0c3558", background: "#fff", fontWeight: 900, textTransform: "none", borderRadius: 1.5, minHeight: 36, "&:hover": { background: "#eef5f7" } }}>
                      Share
                    </Button>
                  )}
                  {t.isOrganizer && (
                    <Button fullWidth size="small" startIcon={<SettingsRounded />} onClick={() => navigate(`/tournaments/${t.id}`)} sx={{ color: "#fff", border: "1px solid rgba(255,255,255,0.7)", fontWeight: 900, textTransform: "none", borderRadius: 1.5, minHeight: 36 }}>
                      Manage
                    </Button>
                  )}
                </Stack>
              </Paper>

              {live.map((m) => (
                <Paper
                  key={m.id}
                  elevation={0}
                  onClick={m.liveCode ? () => navigate(`/join-game/${m.liveCode}`, { state: { backLabel: t.name } }) : undefined}
                  sx={{
                    ...sectionSx,
                    p: { xs: 1.25, sm: 1.5 },
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    cursor: m.liveCode ? "pointer" : "default",
                    borderLeft: "4px solid #e53935",
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={0.6} alignItems="center" sx={{ mb: 0.25 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#e53935", animation: "pulse 1.4s infinite", "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } } }} />
                      <Typography sx={{ color: "#e53935", fontWeight: 900, fontSize: 11.5, letterSpacing: 0.6 }}>LIVE</Typography>
                    </Stack>
                    <Typography sx={{ fontWeight: 900, color: ink, fontSize: { xs: 14.5, sm: 15.5 }, lineHeight: 1.25 }}>
                      {m.team1Name} vs {m.team2Name}
                    </Typography>
                    {m.innings.length > 0 && (
                      <Typography sx={{ color: muted, fontWeight: 700, fontSize: 12.5, mt: 0.25 }}>
                        {m.innings.map((i) => `${i.team} ${i.runs}-${i.wickets} (${i.overs})`).join("  ·  ")}
                      </Typography>
                    )}
                  </Box>
                  {m.liveCode && (
                    <Button size="small" variant="contained" disableElevation sx={{ flex: "none", whiteSpace: "nowrap", fontWeight: 900, textTransform: "none", borderRadius: 1.5, bgcolor: "#e53935", "&:hover": { bgcolor: "#c62828" } }}>
                      Watch
                    </Button>
                  )}
                </Paper>
              ))}

              <Tabs
                value={tab}
                onChange={(_, v: TabKey) => setTab(v)}
                variant="fullWidth"
                sx={{
                  minHeight: 0,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  border: "1px solid rgba(12,53,88,0.08)",
                  "& .MuiTabs-indicator": { height: 3, borderRadius: 3, background: "#D9B45A" },
                  "& .MuiTab-root": {
                    fontWeight: 800,
                    textTransform: "none",
                    minWidth: 0,
                    minHeight: { xs: 44, sm: 48 },
                    px: 0.5,
                    fontSize: { xs: 13.5, sm: 14.5 },
                    whiteSpace: "nowrap",
                    color: "#5f6b66",
                  },
                  "& .MuiTab-root.Mui-selected": { color: "#0F2E25" },
                }}
              >
                <Tab value="table" label="Table" />
                <Tab
                  value="matches"
                  label={
                    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                      Matches
                      <Box component="span" sx={{ px: 0.6, borderRadius: 99, bgcolor: "#eef2f4", fontSize: 11, fontWeight: 900, lineHeight: "18px" }}>
                        {data.matches.length}
                      </Box>
                    </Box>
                  }
                />
                <Tab value="stats" label="Stats" />
                <Tab value="squads" label="Squads" />
              </Tabs>

              <Box {...swipe.handlers} key={tab} sx={{ ...swipe.enterSx, minHeight: "55vh" }}>
              {tab === "table" && (
                <Paper elevation={0} sx={{ ...sectionSx, p: 0, overflow: "hidden" }}>
                  {data.pointsTable.length === 0 ? (
                    <Typography sx={{ color: muted, fontWeight: 600, p: 2 }}>No teams yet.</Typography>
                  ) : (
                    <Box component="table" sx={scoreTableSx}>
                      <thead>
                        <tr>
                          <th>Team</th>
                          <th>P</th>
                          <th>W</th>
                          <th>L</th>
                          <th title="Tied / No result">NR</th>
                          <th className="strong">Pts</th>
                          <th>NRR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.pointsTable.map((row) => (
                          <tr key={row.teamId}>
                            <td style={{ verticalAlign: "middle" }}>
                              <Stack direction="row" spacing={{ xs: 0.75, sm: 1 }} alignItems="center" sx={{ minWidth: 0 }}>
                                <Typography sx={{ fontWeight: 900, color: muted, width: 16, flex: "none", fontSize: 13, textAlign: "center" }}>{row.rank}</Typography>
                                <Avatar src={resolveApiMediaUrl(row.logoUrl) || undefined} sx={{ width: 24, height: 24, fontSize: 11, fontWeight: 900, flex: "none" }}>
                                  {row.name[0]}
                                </Avatar>
                                <Typography sx={{ fontWeight: 800, color: ink, fontSize: { xs: 13, sm: 14 }, lineHeight: 1.2, minWidth: 0, wordBreak: "break-word" }}>
                                  {row.name}
                                </Typography>
                              </Stack>
                            </td>
                            <td style={{ verticalAlign: "middle" }}>{row.played}</td>
                            <td style={{ verticalAlign: "middle" }}>{row.won}</td>
                            <td style={{ verticalAlign: "middle" }}>{row.lost}</td>
                            <td style={{ verticalAlign: "middle" }}>{row.tied + row.noResult}</td>
                            <td className="strong" style={{ verticalAlign: "middle" }}>{row.points}</td>
                            <td style={{ verticalAlign: "middle", color: row.netRunRate >= 0 ? "#0d6b3d" : "#b3261e" }}>
                              {row.netRunRate >= 0 ? "+" : ""}{Number(row.netRunRate).toFixed(3)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Box>
                  )}
                </Paper>
              )}

              {tab === "matches" && (
                data.matches.length === 0 ? (
                  <Paper elevation={0} sx={sectionSx}>
                    <Typography sx={{ color: muted, fontWeight: 600 }}>No matches yet.</Typography>
                  </Paper>
                ) : (
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(2, minmax(0, 1fr))" }, gap: { xs: 1, sm: 1.25 } }}>
                    {data.matches.map((m, idx) => {
                      const clickable = m.hasScorecard || Boolean(m.liveCode);
                      const isLive = m.status === "in_progress";
                      const winnerName = m.status === "completed" && m.winnerTeamId ? (m.winnerTeamId === m.team1Id ? m.team1Name : m.team2Name) : "";
                      return (
                        <Paper
                          key={m.id}
                          elevation={0}
                          onClick={() => (m.hasScorecard ? setScorecardId(m.id) : m.liveCode ? navigate(`/join-game/${m.liveCode}`, { state: { backLabel: t.name } }) : undefined)}
                          sx={{
                            ...sectionSx,
                            p: { xs: 1.25, sm: 1.5 },
                            cursor: clickable ? "pointer" : "default",
                            transition: "box-shadow 120ms",
                            "&:hover": clickable ? { boxShadow: "0 10px 24px rgba(8,26,56,0.1)" } : undefined,
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
                            <Typography sx={{ color: muted, fontWeight: 700, fontSize: 12, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              Match {data.matches.length - idx} · {formatDate(m.date)}
                            </Typography>
                            {isLive ? (
                              <Chip size="small" label="LIVE" sx={{ height: 20, fontSize: 10.5, fontWeight: 900, bgcolor: "#e53935", color: "#fff", flex: "none" }} />
                            ) : m.hasScorecard ? (
                              <Stack direction="row" alignItems="center" sx={{ color: "#185a9d", flex: "none" }}>
                                <Typography sx={{ fontWeight: 800, fontSize: 12 }}>Scorecard</Typography>
                                <ChevronRightRounded sx={{ fontSize: 18 }} />
                              </Stack>
                            ) : m.status === "scheduled" ? (
                              <Chip size="small" label="Upcoming" sx={{ height: 20, fontSize: 10.5, fontWeight: 900, bgcolor: "#fff0c2", color: "#6b4a00", flex: "none" }} />
                            ) : null}
                          </Stack>
                          {[m.team1Name, m.team2Name].map((name) => {
                            const inn = m.innings.find((i) => i.team === name);
                            const won = winnerName === name;
                            const lost = Boolean(winnerName) && !won;
                            return (
                              <Stack key={name} direction="row" justifyContent="space-between" alignItems="baseline" spacing={1.5} sx={{ py: 0.2 }}>
                                <Typography sx={{ fontWeight: won ? 900 : 700, color: lost ? "#7b8794" : ink, fontSize: { xs: 14, sm: 14.5 }, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {name}
                                </Typography>
                                <Typography sx={{ fontWeight: won ? 900 : 700, color: lost ? "#7b8794" : ink, fontSize: { xs: 14, sm: 14.5 }, whiteSpace: "nowrap", flex: "none", fontVariantNumeric: "tabular-nums" }}>
                                  {inn ? (
                                    <>
                                      {inn.runs}-{inn.wickets}{" "}
                                      <Box component="span" sx={{ fontWeight: 600, color: muted, fontSize: "0.88em" }}>({inn.overs})</Box>
                                    </>
                                  ) : m.status === "scheduled" ? "" : "Yet to bat"}
                                </Typography>
                              </Stack>
                            );
                          })}
                          <Typography sx={{ color: m.status === "completed" ? "#185a9d" : isLive ? "#c62828" : muted, fontSize: 12.5, fontWeight: 700, mt: 0.6, lineHeight: 1.3 }}>
                            {m.status === "completed" ? m.resultText || "Completed" : isLive ? "Live now · tap to watch" : "Scheduled"}
                          </Typography>
                        </Paper>
                      );
                    })}
                  </Box>
                )
              )}

              {tab === "stats" && (
                <Paper elevation={0} sx={sectionSx}>
                  <Typography sx={{ color: "#526274", fontWeight: 600, mb: { xs: 1.5, sm: 2 }, fontSize: { xs: 13, sm: 14.5 } }}>
                    Worked out ball by ball from every completed match. Tap a player to open their profile.
                  </Typography>
                  <TournamentPlayerStatsPanel tournamentId={t.id} source="public" refreshKey={completed.length} />
                </Paper>
              )}

              {tab === "squads" && (
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" }, gap: { xs: 1, sm: 1.5 } }}>
                  {data.teams.map((team) => (
                    <Paper key={team.id} elevation={0} sx={sectionSx}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Avatar src={resolveApiMediaUrl(team.logoUrl) || undefined} sx={{ width: 34, height: 34, fontWeight: 900 }}>
                          {team.name[0]}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 900, color: ink }}>{team.name}</Typography>
                          {team.captainName && <Typography sx={{ color: muted, fontSize: 12.5, fontWeight: 600 }}>Captain: {team.captainName}</Typography>}
                        </Box>
                      </Stack>
                      {team.players.length === 0 ? (
                        <Typography sx={{ color: muted, fontSize: 13, fontWeight: 600 }}>No squad listed.</Typography>
                      ) : (
                        <Stack spacing={0.5}>
                          {team.players.map((p, i) => (
                            <Stack
                              key={`${p.name}-${i}`}
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              onClick={p.player ? () => navigate(`/players/${p.player!.id}`) : undefined}
                              sx={{ py: 0.4, px: 0.5, borderRadius: 1.5, cursor: p.player ? "pointer" : "default", "&:hover": p.player ? { background: "#f6f9fb" } : undefined }}
                            >
                              <PlayerAvatar name={p.name} avatarUrl={p.player?.avatarUrl} size={28} />
                              <Typography sx={{ fontWeight: 800, color: p.player ? "#185a9d" : ink, fontSize: 14, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</Typography>
                              {p.role && <Typography sx={{ color: muted, fontSize: 12, fontWeight: 700, flex: "none", textTransform: "capitalize" }}>{p.role}</Typography>}
                            </Stack>
                          ))}
                        </Stack>
                      )}
                    </Paper>
                  ))}
                </Box>
              )}
              </Box>
            </Stack>
          )}
        </Box>
      </Box>
      {scorecardId && <ScorecardDialog tournamentId={tournamentId} matchId={scorecardId} onClose={() => setScorecardId("")} />}
      <Snackbar open={Boolean(notice)} autoHideDuration={3000} onClose={() => setNotice("")} message={notice} />
      {t && data && (
        <ShareSheet
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          title="Share tournament"
          url={`${APP_URL}/t/${t.id}`}
          text={`${t.name}: points table, results and live scores`}
          fileName="tournament.png"
          makeImage={() =>
            tournamentStoryCard({
                  name: t.name,
                  subtitle: [t.location, `${t.oversPerMatch} overs`].filter(Boolean).join(" · "),
                  status: t.status === "active" ? "Live" : t.status === "completed" ? "Completed" : "Upcoming",
                  rows: data.pointsTable.map((r) => ({ rank: r.rank, name: r.name, played: r.played, won: r.won, points: r.points })),
                  url: `${APP_URL}/t/${t.id}`,
                })
          }
        />
      )}
    </>
  );
};

export default PublicTournamentPage;
