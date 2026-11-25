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
} from "@mui/material";
import {
  CloseRounded,
  EmojiEventsRounded,
  IosShareRounded,
  LockRounded,
  PlaceRounded,
  SettingsRounded,
  SportsCricketRounded,
} from "@mui/icons-material";
import AppBar from "./AppBar";
import AppSpinner from "./AppSpinner";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";
import ShareLinkModal from "../modals/ShareLinkModal";
import useSwipeTabs from "../hooks/useSwipeTabs";
import ExploreService, { type PublicScorecardResponse, type PublicTournamentResponse } from "../services/ExploreService";
import { APP_URL } from "../utils/constant";
import { shareOrCopyLink } from "../utils/copyLink";
import { formatOvers } from "../utils/matchStats";
import { resolveApiMediaUrl } from "../utils/mediaUrl";
import TournamentPlayerStatsPanel from "./stats/TournamentPlayerStatsPanel";
import PlayerAvatar from "./player/PlayerAvatar";
import { primaryButtonSx } from "./player/buttonStyles";
import { visibilityIcon, visibilityLabel } from "./privacy/VisibilityPicker";
import { formatDate, ink, muted, sectionSx, tableSx } from "./profile/ProfileUi";

type TabKey = "table" | "matches" | "stats" | "squads";
const TABS: readonly TabKey[] = ["table", "matches", "stats", "squads"];

const ScorecardDialog: React.FC<{ tournamentId: string; matchId: string; onClose: () => void }> = ({ tournamentId, matchId, onClose }) => {
  const [data, setData] = React.useState<PublicScorecardResponse | null>(null);
  const [error, setError] = React.useState("");
  React.useEffect(() => {
    ExploreService.scorecard(tournamentId, matchId)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Couldn't load the scorecard."));
  }, [tournamentId, matchId]);
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 900, color: ink, pr: 6 }}>
        {data ? `${data.team1Name} vs ${data.team2Name}` : "Scorecard"}
        {data?.resultText && <Typography sx={{ color: "#0d6b3d", fontWeight: 800, fontSize: 14 }}>{data.resultText}</Typography>}
        <IconButton onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }} aria-label="Close">
          <CloseRounded />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : !data ? (
          <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
            <AppSpinner />
          </Box>
        ) : (
          <Stack spacing={3}>
            {data.innings.map((inn) => (
              <Box key={inn.battingTeam}>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 1 }}>
                  <Typography sx={{ fontWeight: 900, color: ink, fontSize: 16 }}>{inn.battingTeam}</Typography>
                  <Typography sx={{ fontWeight: 900, color: ink }}>
                    {inn.runs}/{inn.wickets} <span style={{ color: muted, fontWeight: 700 }}>({inn.oversText} ov)</span>
                  </Typography>
                </Stack>
                <Box sx={{ overflowX: "auto" }}>
                  <Box component="table" sx={{ ...tableSx, minWidth: 420 }}>
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
                            <b>{b.name}</b>
                            <Typography component="div" sx={{ fontSize: 11.5, color: muted, fontWeight: 600 }}>
                              {b.out ? [b.wicketType?.replace(/-/g, " "), b.fielder && `c ${b.fielder}`, b.bowler && `b ${b.bowler}`].filter(Boolean).join(" ") : "not out"}
                            </Typography>
                          </td>
                          <td>
                            <b>{b.runs}</b>
                          </td>
                          <td>{b.balls}</td>
                          <td>{b.fours}</td>
                          <td>{b.sixes}</td>
                          <td>{b.balls ? ((b.runs * 100) / b.balls).toFixed(1) : "–"}</td>
                        </tr>
                      ))}
                      <tr>
                        <td>Extras</td>
                        <td>{inn.extras}</td>
                        <td colSpan={4} />
                      </tr>
                    </tbody>
                  </Box>
                  <Box component="table" sx={{ ...tableSx, minWidth: 420, mt: 1 }}>
                    <thead>
                      <tr>
                        <th>Bowler</th>
                        <th>O</th>
                        <th>M</th>
                        <th>R</th>
                        <th>W</th>
                        <th>Econ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inn.bowling.map((w) => (
                        <tr key={w.name}>
                          <td>
                            <b>{w.name}</b>
                          </td>
                          <td>{formatOvers(w.balls, inn.ballsPerOver)}</td>
                          <td>{w.maidens}</td>
                          <td>{w.runs}</td>
                          <td>
                            <b>{w.wickets}</b>
                          </td>
                          <td>{w.balls ? ((w.runs * 6) / w.balls).toFixed(2) : "–"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
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
  const [fallbackUrl, setFallbackUrl] = React.useState("");
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

  const share = async () => {
    if (!t) return;
    const r = await shareOrCopyLink(`${APP_URL}/t/${t.id}`, t.name);
    if (r === "copied") setNotice("Tournament link copied.");
    else if (r !== "shared") setFallbackUrl(r);
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
            <Stack spacing={2}>
              <Paper
                elevation={0}
                sx={{
                  ...sectionSx,
                  color: "#fff",
                  border: "none",
                  background: "linear-gradient(135deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                }}
              >
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }}>
                  <Avatar src={resolveApiMediaUrl(t.logoUrl) || undefined} variant="rounded" sx={{ width: 76, height: 76, borderRadius: 2.5, background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.7)" }}>
                    <EmojiEventsRounded sx={{ fontSize: 40, color: "#fff" }} />
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: "calc(26px * var(--app-font-scale, 1))", fontWeight: 900, lineHeight: 1.1 }}>{t.name}</Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ opacity: 0.92, mt: 0.25 }}>
                      <PlaceRounded sx={{ fontSize: 16 }} />
                      <Typography sx={{ fontWeight: 700 }}>
                        {t.location} · {formatDate(t.startDate, false)} – {formatDate(t.endDate)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 0.75 }}>
                      {[
                        t.status === "active" ? "Live" : t.status === "completed" ? "Completed" : "Upcoming",
                        t.format === "knockout" ? "Knockout" : "League",
                        `${t.oversPerMatch} overs`,
                        `${t.ballType} ball`,
                        `by ${t.organizerName}`,
                      ].map((x) => (
                        <Chip key={x} size="small" label={x} sx={{ color: "#fff", background: "rgba(255,255,255,0.18)", fontWeight: 800, height: 22, textTransform: "capitalize" }} />
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
                  </Box>
                  <Stack direction={{ xs: "row", sm: "column" }} spacing={1}>
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
              </Paper>

              {live.map((m) => (
                <Alert
                  key={m.id}
                  severity="success"
                  icon={<SportsCricketRounded />}
                  sx={{ borderRadius: 2, fontWeight: 700 }}
                  action={
                    m.liveCode ? (
                      <Button color="inherit" size="small" onClick={() => navigate(`/join-game/${m.liveCode}`)} sx={{ fontWeight: 900 }}>
                        Watch live
                      </Button>
                    ) : undefined
                  }
                >
                  Live now: {m.team1Name} vs {m.team2Name}
                </Alert>
              ))}

              <Tabs
                value={tab}
                onChange={(_, v: TabKey) => setTab(v)}
                variant="fullWidth"
                sx={{ "& .MuiTab-root": { fontWeight: 800, textTransform: "none", minWidth: 0, px: 0.5 } }}
              >
                <Tab value="table" label="Table" />
                <Tab value="matches" label={`Matches (${completed.length})`} />
                <Tab value="stats" label="Stats" />
                <Tab value="squads" label="Squads" />
              </Tabs>

              <Box {...swipe.handlers} key={tab} sx={{ ...swipe.enterSx, minHeight: "55vh" }}>
              {tab === "table" && (
                <Paper elevation={0} sx={sectionSx}>
                  {data.pointsTable.length === 0 ? (
                    <Typography sx={{ color: muted, fontWeight: 600 }}>No teams yet.</Typography>
                  ) : (
                    <Box sx={{ overflowX: "auto" }}>
                      <Box component="table" sx={{ ...tableSx, minWidth: 480 }}>
                        <thead>
                          <tr>
                            <th>Team</th>
                            <th>P</th>
                            <th>W</th>
                            <th>L</th>
                            <th>T/NR</th>
                            <th>NRR</th>
                            <th>Pts</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.pointsTable.map((row) => (
                            <tr key={row.teamId}>
                              <td>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Typography sx={{ fontWeight: 900, color: muted, width: 18 }}>{row.rank}</Typography>
                                  <Avatar src={resolveApiMediaUrl(row.logoUrl) || undefined} sx={{ width: 26, height: 26, fontSize: 12, fontWeight: 900 }}>
                                    {row.name[0]}
                                  </Avatar>
                                  <b>{row.name}</b>
                                </Stack>
                              </td>
                              <td>{row.played}</td>
                              <td>{row.won}</td>
                              <td>{row.lost}</td>
                              <td>{row.tied + row.noResult}</td>
                              <td>{row.netRunRate >= 0 ? "+" : ""}{Number(row.netRunRate).toFixed(3)}</td>
                              <td>
                                <b>{row.points}</b>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Box>
                    </Box>
                  )}
                </Paper>
              )}

              {tab === "matches" && (
                <Paper elevation={0} sx={sectionSx}>
                  {data.matches.length === 0 ? (
                    <Typography sx={{ color: muted, fontWeight: 600 }}>No matches yet.</Typography>
                  ) : (
                    <Stack divider={<Box sx={{ borderTop: "1px solid #edf1f4" }} />}>
                      {data.matches.map((m) => (
                        <Stack
                          key={m.id}
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                          onClick={() => (m.hasScorecard ? setScorecardId(m.id) : m.liveCode ? navigate(`/join-game/${m.liveCode}`) : undefined)}
                          sx={{ py: 1.25, cursor: m.hasScorecard || m.liveCode ? "pointer" : "default", "&:hover": { background: m.hasScorecard ? "#f9fbfc" : undefined } }}
                        >
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            {[m.team1Name, m.team2Name].map((name) => {
                              const inn = m.innings.find((i) => i.team === name);
                              const won = m.status === "completed" && m.winnerTeamId && (m.winnerTeamId === m.team1Id ? m.team1Name : m.team2Name) === name;
                              return (
                                <Stack key={name} direction="row" justifyContent="space-between" sx={{ maxWidth: 420 }}>
                                  <Typography sx={{ fontWeight: won ? 900 : 700, color: won ? ink : "#405060", fontSize: 14.5 }}>{name}</Typography>
                                  <Typography sx={{ fontWeight: won ? 900 : 700, color: won ? ink : "#405060", fontSize: 14.5 }}>
                                    {inn ? `${inn.runs}/${inn.wickets} (${inn.overs})` : m.status === "scheduled" ? "" : "–"}
                                  </Typography>
                                </Stack>
                              );
                            })}
                            <Typography sx={{ color: m.status === "completed" ? "#0d6b3d" : muted, fontSize: 12.5, fontWeight: 700, mt: 0.25 }}>
                              {m.status === "completed" ? m.resultText || "Completed" : m.status === "in_progress" ? "Live now" : "Scheduled"} · {formatDate(m.date)}
                            </Typography>
                          </Box>
                          {m.hasScorecard && (
                            <Chip size="small" label="Scorecard" sx={{ fontWeight: 800, height: 22, bgcolor: "#eef5f7", color: "#185a9d" }} />
                          )}
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </Paper>
              )}

              {tab === "stats" && (
                <Paper elevation={0} sx={sectionSx}>
                  <Typography sx={{ color: "#526274", fontWeight: 600, mb: 2 }}>
                    Worked out ball by ball from every completed match. Tap a player to open their profile.
                  </Typography>
                  <TournamentPlayerStatsPanel tournamentId={t.id} source="public" refreshKey={completed.length} />
                </Paper>
              )}

              {tab === "squads" && (
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.5 }}>
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
                              <Typography sx={{ fontWeight: 800, color: p.player ? "#185a9d" : ink, fontSize: 14, flex: 1 }}>{p.name}</Typography>
                              {p.role && <Typography sx={{ color: muted, fontSize: 12, fontWeight: 700 }}>{p.role}</Typography>}
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
      <ShareLinkModal open={Boolean(fallbackUrl)} onClose={() => setFallbackUrl("")} shareUrl={fallbackUrl} title="Share this tournament" />
    </>
  );
};

export default PublicTournamentPage;
