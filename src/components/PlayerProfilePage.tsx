import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import AppBar from "./AppBar";
import AppSpinner from "./AppSpinner";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";
import AuthService from "../services/AuthService";
import PlayerStatsService, {
  type CareerRecentMatch,
  type PlayerCareerResponse,
} from "../services/PlayerStatsService";
import { formatOvers, type CareerStats } from "../utils/matchStats";
import { isPremiumFeatureUnlocked } from "../utils/premium";
import FormBarChart, { type FormBar } from "./stats/FormBarChart";
import PremiumBadge from "./stats/PremiumBadge";
import PremiumNote from "./stats/PremiumNote";
import PlayerAvatar from "./player/PlayerAvatar";
import RegisteredBadge from "./player/RegisteredBadge";
import { primaryButtonSx } from "./player/buttonStyles";

type Scope = "overall" | "tournament" | "friendly";

const sectionSx = {
  p: { xs: 1.75, sm: 2.5 },
  borderRadius: 3,
  border: "1px solid rgba(12,53,88,0.12)",
  background: "#fff",
  boxShadow: "0 10px 30px rgba(8, 26, 56, 0.06)",
} as const;

const dash = (v: number | null | undefined, digits = 2) =>
  v === null || v === undefined ? "–" : Number(v).toFixed(digits);

const shortName = (team: string) => {
  const words = team.split(/\s+/).filter(Boolean);
  return words.length > 1 ? words.map((w) => w[0]).join("").slice(0, 3).toUpperCase() : team.slice(0, 3).toUpperCase();
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};

const StatTile: React.FC<{ label: string; value: React.ReactNode; hint?: string; highlight?: boolean }> = ({ label, value, hint, highlight }) => (
  <Box
    sx={{
      p: 1.2,
      borderRadius: 2,
      background: highlight
        ? "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 18%, #ffffff 82%) 0%, color-mix(in srgb, var(--app-accent-end, #185a9d) 10%, #ffffff 90%) 100%)"
        : "#f6f9fb",
      border: "1px solid rgba(12,53,88,0.08)",
      minWidth: 0,
    }}
  >
    <Typography sx={{ fontSize: "calc(11px * var(--app-font-scale, 1))", fontWeight: 800, color: "#5b6976", letterSpacing: 0.4, textTransform: "uppercase" }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: "calc(22px * var(--app-font-scale, 1))", fontWeight: 900, color: "#0c3558", lineHeight: 1.15 }}>
      {value}
    </Typography>
    {hint && <Typography sx={{ fontSize: 11.5, color: "#6b7785", fontWeight: 600 }}>{hint}</Typography>}
  </Box>
);

const tileGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "repeat(3, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))", md: "repeat(6, minmax(0, 1fr))" },
  gap: 1,
} as const;

const SectionTitle: React.FC<{ children: React.ReactNode; premium?: boolean }> = ({ children, premium }) => (
  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
    <Typography variant="h6" sx={{ fontWeight: 900, color: "#0c3558", fontSize: "calc(18px * var(--app-font-scale, 1))" }}>
      {children}
    </Typography>
    {premium && <PremiumBadge />}
  </Stack>
);

const BattingTiles: React.FC<{ s: CareerStats }> = ({ s }) => {
  const b = s.batting;
  return (
    <Box sx={tileGridSx}>
      <StatTile label="Innings" value={b.innings} hint={`${b.notOuts} not out`} />
      <StatTile label="Runs" value={b.runs} highlight />
      <StatTile label="Highest" value={b.innings ? `${b.highest}${b.highestNotOut ? "*" : ""}` : "–"} />
      <StatTile label="Average" value={dash(b.average)} />
      <StatTile label="Strike rate" value={dash(b.strikeRate)} />
      <StatTile label="4s / 6s" value={`${b.fours} / ${b.sixes}`} />
      <StatTile label="30s" value={b.thirties} />
      <StatTile label="50s" value={b.fifties} />
      <StatTile label="100s" value={b.hundreds} />
      <StatTile label="Ducks" value={b.ducks} />
      <StatTile label="Balls" value={b.balls} />
      <StatTile label="Dot %" value={b.balls ? `${Math.round((b.dots / b.balls) * 100)}%` : "–"} />
    </Box>
  );
};

const BowlingTiles: React.FC<{ s: CareerStats }> = ({ s }) => {
  const w = s.bowling;
  return (
    <Box sx={tileGridSx}>
      <StatTile label="Innings" value={w.innings} />
      <StatTile label="Wickets" value={w.wickets} highlight />
      <StatTile label="Best" value={w.innings ? `${w.bestWickets}/${w.bestRuns}` : "–"} />
      <StatTile label="Overs" value={formatOvers(w.balls)} />
      <StatTile label="Economy" value={dash(w.economy)} />
      <StatTile label="Average" value={dash(w.average)} />
      <StatTile label="Strike rate" value={dash(w.strikeRate, 1)} />
      <StatTile label="3W / 5W" value={`${w.threeWickets} / ${w.fiveWickets}`} />
      <StatTile label="Maidens" value={w.maidens} />
      <StatTile label="Dot balls" value={w.dots} />
      <StatTile label="Catches" value={s.fielding.catches} />
      <StatTile label="Run outs" value={s.fielding.runOuts} />
    </Box>
  );
};

const resultChip = (result: CareerRecentMatch["result"]) => {
  const map = {
    won: { label: "Won", color: "#0d6b3d", bg: "#dcf5e7" },
    lost: { label: "Lost", color: "#8a1c1c", bg: "#fde3e3" },
    tied: { label: "Tied", color: "#6b4a00", bg: "#fff0c2" },
    none: { label: "No result", color: "#4a5560", bg: "#edf1f4" },
  } as const;
  const m = map[result] ?? map.none;
  return <Chip size="small" label={m.label} sx={{ fontWeight: 800, color: m.color, background: m.bg, height: 22 }} />;
};

const PlayerProfilePage: React.FC = () => {
  const { playerId = "" } = useParams();
  const navigate = useNavigate();
  const [data, setData] = React.useState<PlayerCareerResponse | null>(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [scope, setScope] = React.useState<Scope>("overall");
  const isLoggedIn = AuthService.isLoggedIn();

  React.useEffect(() => {
    if (!isLoggedIn || !playerId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError("");
    PlayerStatsService.getCareer(playerId)
      .then((res) => {
        if (cancelled) return;
        if (res.redirectTo && res.redirectTo !== playerId) {
          navigate(`/players/${res.redirectTo}`, { replace: true });
          return;
        }
        setData(res);
      })
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "Unable to load player stats."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, playerId, navigate]);

  const stats = data ? data[scope] : null;
  const scopedMatches = React.useMemo(
    () =>
      (data?.recentMatches ?? []).filter(
        (m) => scope === "overall" || (scope === "tournament" ? m.source === "tournament" : m.source === "friendly"),
      ),
    [data, scope],
  );

  const battingForm: FormBar[] = React.useMemo(
    () =>
      scopedMatches
        .filter((m) => m.batting)
        .slice(0, 10)
        .reverse()
        .map((m) => ({
          key: `${m.source}-${m.matchId}`,
          value: m.batting!.runs,
          label: shortName(m.opponent),
          emphasis: !m.batting!.out,
          tooltip: `${m.batting!.runs}${m.batting!.out ? "" : "*"} (${m.batting!.balls}) vs ${m.opponent}`,
        })),
    [scopedMatches],
  );
  const bowlingForm: FormBar[] = React.useMemo(
    () =>
      scopedMatches
        .filter((m) => m.bowling)
        .slice(0, 10)
        .reverse()
        .map((m) => ({
          key: `${m.source}-${m.matchId}`,
          value: m.bowling!.wickets,
          label: shortName(m.opponent),
          tooltip: `${m.bowling!.wickets}/${m.bowling!.runs} (${formatOvers(m.bowling!.balls)} ov) vs ${m.opponent}`,
        })),
    [scopedMatches],
  );

  const chartsUnlocked = isPremiumFeatureUnlocked("playerCharts");
  const careerUnlocked = isPremiumFeatureUnlocked("playerCareerProfile");
  const winPct = stats && stats.matches > 0 ? Math.round((stats.wins / stats.matches) * 100) : null;

  return (
    <>
      <MetaHelmet
        pageTitle={data ? `${data.player.name} – Player stats` : "Player stats"}
        description="Career batting, bowling and fielding stats across tournaments and matches."
        canonical={`/players/${playerId}`}
        robots="noindex,follow"
      />
      <AppBar showHomeMenuItem />
      <Box sx={{ minHeight: "100vh", bgcolor: "#eef5f7", pb: 6 }}>
        <Box sx={{ maxWidth: 1080, mx: "auto", px: { xs: 1.4, md: 3 }, pt: 2 }}>
          <PageTitleWithBack
            titleSx={{ fontSize: { xs: "calc(24px * var(--app-font-scale, 1))", sm: "calc(32px * var(--app-font-scale, 1))" }, fontWeight: 900, color: "var(--app-accent-text, #185a9d)" }}
          >
            Player profile
          </PageTitleWithBack>
          {isLoggedIn && <PremiumNote sx={{ mb: 1.5 }} />}

          {!isLoggedIn ? (
            <Paper elevation={0} sx={sectionSx}>
              <Alert severity="info" sx={{ borderRadius: 2, mb: 2 }}>
                Log in to see player stats.
              </Alert>
              <Button variant="contained" onClick={() => navigate("/login")} sx={primaryButtonSx}>Log in</Button>
            </Paper>
          ) : loading ? (
            <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
              <AppSpinner />
            </Box>
          ) : error || !data || !stats ? (
            <Alert severity="error" sx={{ borderRadius: 2 }}>{error || "Player not found."}</Alert>
          ) : (
            <Stack spacing={2}>
              {/* Hero */}
              <Paper
                elevation={0}
                sx={{
                  ...sectionSx,
                  color: "#fff",
                  border: "none",
                  background: "linear-gradient(135deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Box aria-hidden sx={{ position: "absolute", left: { xs: "55%", sm: "38%" }, top: -30, fontSize: 150, opacity: 0.08, transform: "rotate(-18deg)", pointerEvents: "none" }}>🏏</Box>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }}>
                  <PlayerAvatar name={data.player.name} avatarUrl={data.player.avatarUrl} size={76} ring />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: "calc(26px * var(--app-font-scale, 1))", fontWeight: 900, lineHeight: 1.1 }}>{data.player.name}</Typography>
                    <Typography sx={{ opacity: 0.9, fontWeight: 700 }}>
                      @{data.player.username}
                      {[data.player.role, data.player.city].filter(Boolean).map((x) => ` · ${x}`).join("")}
                    </Typography>
                    {(data.player.battingStyle || data.player.bowlingStyle || data.player.registered) && (
                      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 0.75 }}>
                        {data.player.registered && (
                          <Box sx={{ px: 0.9, py: 0.15, borderRadius: 99, background: "rgba(255,255,255,0.92)" }}>
                            <RegisteredBadge />
                          </Box>
                        )}
                        {[data.player.battingStyle, data.player.bowlingStyle].filter(Boolean).map((x) => (
                          <Chip key={x} size="small" label={x} sx={{ color: "#fff", background: "rgba(255,255,255,0.18)", fontWeight: 800, height: 22 }} />
                        ))}
                        {data.player.isOwner && (
                          <Chip size="small" label="Edit my profile" onClick={() => navigate("/me")} sx={{ color: "#0c3558", background: "#fff", fontWeight: 900, height: 22 }} />
                        )}
                      </Stack>
                    )}
                  </Box>
                  <Stack direction="row" spacing={{ xs: 2.5, sm: 3.5 }}>
                    {[
                      { label: "Matches", value: stats.matches },
                      { label: "Runs", value: stats.batting.runs },
                      { label: "Wickets", value: stats.bowling.wickets },
                      { label: "Win %", value: winPct === null ? "–" : `${winPct}%` },
                    ].map((h) => (
                      <Box key={h.label}>
                        <Typography sx={{ fontSize: "calc(26px * var(--app-font-scale, 1))", fontWeight: 900, lineHeight: 1 }}>{h.value}</Typography>
                        <Typography sx={{ fontSize: 12, fontWeight: 800, opacity: 0.85, textTransform: "uppercase", letterSpacing: 0.4 }}>{h.label}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </Paper>

              <Tabs
                value={scope}
                onChange={(_, v: Scope) => setScope(v)}
                variant="fullWidth"
                sx={{ "& .MuiTab-root": { fontWeight: 800, textTransform: "none", minWidth: 0, px: { xs: 0.5, sm: 2 }, fontSize: { xs: 13.5, sm: 14 } } }}
              >
                <Tab value="overall" label={`All (${data.overall.matches})`} />
                <Tab value="tournament" label={`Tournaments (${data.tournament.matches})`} />
                <Tab value="friendly" label={`Friendly (${data.friendly.matches})`} />
              </Tabs>

              {stats.matches === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  No completed matches yet. Stats appear once a match this player is in is completed and saved.
                </Alert>
              ) : (
                <>
                  <Paper elevation={0} sx={sectionSx}>
                    <SectionTitle>Batting</SectionTitle>
                    <BattingTiles s={stats} />
                  </Paper>
                  <Paper elevation={0} sx={sectionSx}>
                    <SectionTitle>Bowling & fielding</SectionTitle>
                    <BowlingTiles s={stats} />
                  </Paper>

                  {chartsUnlocked && (
                    <Paper elevation={0} sx={sectionSx}>
                      <SectionTitle premium>Recent form</SectionTitle>
                      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
                        <FormBarChart
                          title="Runs – last 10 innings"
                          bars={battingForm}
                          emptyText="No innings yet."
                          emphasisNote="Not out"
                        />
                        <FormBarChart
                          title="Wickets – last 10 bowling innings"
                          bars={bowlingForm}
                          emptyText="Hasn't bowled yet."
                        />
                      </Box>
                    </Paper>
                  )}
                </>
              )}

              {careerUnlocked && scope !== "friendly" && data.tournaments.length > 0 && (
                <Paper elevation={0} sx={sectionSx}>
                  <SectionTitle premium>By tournament</SectionTitle>
                  <Box sx={{ overflowX: "auto" }}>
                    <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", minWidth: 560, "& th, & td": { px: 1, py: 1, textAlign: "right", borderBottom: "1px solid #edf1f4", fontSize: 13.5 }, "& th": { color: "#5b6976", fontWeight: 800, fontSize: 12, textTransform: "uppercase" }, "& td:first-of-type, & th:first-of-type": { textAlign: "left" } }}>
                      <thead>
                        <tr>
                          <th>Tournament</th><th>M</th><th>Runs</th><th>HS</th><th>Avg</th><th>SR</th><th>Wkts</th><th>Best</th><th>Econ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.tournaments.map((t) => (
                          <Box
                            component="tr"
                            key={t.tournamentId}
                            onClick={() => navigate(`/tournaments/${t.tournamentId}`)}
                            sx={{ cursor: "pointer", "&:hover": { background: "#f6f9fb" } }}
                          >
                            <td>
                              <Typography sx={{ fontWeight: 800, color: "#0c3558", fontSize: 14 }}>{t.name}</Typography>
                              <Typography sx={{ color: "#6b7785", fontSize: 12, fontWeight: 600 }}>{t.teamName}</Typography>
                            </td>
                            <td>{t.stats.matches}</td>
                            <td><b>{t.stats.batting.runs}</b></td>
                            <td>{t.stats.batting.innings ? `${t.stats.batting.highest}${t.stats.batting.highestNotOut ? "*" : ""}` : "–"}</td>
                            <td>{dash(t.stats.batting.average)}</td>
                            <td>{dash(t.stats.batting.strikeRate)}</td>
                            <td><b>{t.stats.bowling.wickets}</b></td>
                            <td>{t.stats.bowling.innings ? `${t.stats.bowling.bestWickets}/${t.stats.bowling.bestRuns}` : "–"}</td>
                            <td>{dash(t.stats.bowling.economy)}</td>
                          </Box>
                        ))}
                      </tbody>
                    </Box>
                  </Box>
                </Paper>
              )}

              {scopedMatches.length > 0 && (
                <Paper elevation={0} sx={sectionSx}>
                  <SectionTitle>Recent matches</SectionTitle>
                  <Stack divider={<Box sx={{ borderTop: "1px solid #edf1f4" }} />}>
                    {scopedMatches.map((m) => (
                      <Stack key={`${m.source}-${m.matchId}`} direction="row" spacing={1.5} alignItems="center" sx={{ py: 1.1 }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 800, color: "#0c3558", fontSize: 14.5 }}>
                            {m.team} vs {m.opponent}
                          </Typography>
                          <Typography sx={{ color: "#6b7785", fontSize: 12.5, fontWeight: 600 }}>
                            {formatDate(m.date)} · {m.source === "tournament" ? m.tournamentName || "Tournament" : "Friendly"}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "right", fontSize: 13.5, color: "#223" }}>
                          {m.batting && (
                            <div>
                              <b>{m.batting.runs}{m.batting.out ? "" : "*"}</b> ({m.batting.balls})
                            </div>
                          )}
                          {m.bowling && (
                            <div>
                              <b>{m.bowling.wickets}/{m.bowling.runs}</b> ({formatOvers(m.bowling.balls)})
                            </div>
                          )}
                          {!m.batting && !m.bowling && <span style={{ color: "#8a96a3" }}>DNB</span>}
                        </Box>
                        {resultChip(m.result)}
                      </Stack>
                    ))}
                  </Stack>
                </Paper>
              )}
            </Stack>
          )}
        </Box>
      </Box>
    </>
  );
};

export default PlayerProfilePage;
