import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import {
  LockRounded,
  ShowChartRounded,
  SportsCricketRounded,
} from "@mui/icons-material";
import AppBar from "./AppBar";
import { CardSkeleton, HeroSkeleton, SkeletonGroup } from "./ui/Skeletons";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";
import PlayerStatsService, { type PlayerCareerResponse } from "../services/PlayerStatsService";
import { formatOvers, type CareerStats } from "../utils/matchStats";
import { isPremiumFeatureUnlocked } from "../utils/premium";
import { startAs } from "../utils/playerOnboarding";
import FormBarChart, { type FormBar } from "./stats/FormBarChart";
import PremiumNote from "./stats/PremiumNote";
import { primaryButtonSx } from "./player/buttonStyles";
import ShareSheet from "./share/ShareSheet";
import { playerCardFromCareer } from "../utils/shareCards";
import { resolveApiMediaUrl as resolveShareMedia } from "../utils/mediaUrl";
import { APP_URL as SHARE_APP_URL } from "../utils/constant";
import useSwipeTabs from "../hooks/useSwipeTabs";
import useCenterSelectedTab from "../hooks/useCenterSelectedTab";
import AchievementsSection from "./profile/AchievementsSection";
import AnalysisSection from "./profile/AnalysisSection";
import HeadToHeadSection from "./profile/HeadToHeadSection";
import HighlightsSection from "./profile/HighlightsSection";
import ProfileHero from "./profile/ProfileHero";
import {
  Section,
  StatTile,
  dash,
  formatDate,
  ink,
  muted,
  resultChip,
  sectionSx,
  shortName,
  segmentedTabsSx,
  tableSx,
  tileGridSx,
} from "./profile/ProfileUi";

type Scope = "overall" | "tournament" | "friendly";
type View = "overview" | "achievements" | "analysis" | "h2h" | "matches";
const VIEWS: readonly View[] = ["overview", "achievements", "analysis", "h2h", "matches"];

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

const LockedCard: React.FC<{ title: string }> = ({ title }) => (
  <Paper elevation={0} sx={{ ...sectionSx, textAlign: "center" }}>
    <LockRounded sx={{ color: "#c79a2a" }} />
    <Typography sx={{ fontWeight: 900, color: ink }}>{title} is part of Premium</Typography>
  </Paper>
);

const PlayerProfilePage: React.FC = () => {
  const { playerId = "" } = useParams();
  const navigate = useNavigate();
  const [data, setData] = React.useState<PlayerCareerResponse | null>(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [scope, setScope] = React.useState<Scope>("overall");
  const [view, setView] = React.useState<View>("overview");
  const [notice, setNotice] = React.useState("");
  const [shareOpen, setShareOpen] = React.useState(false);
  const swipe = useSwipeTabs(VIEWS, view, setView);
  const viewTabsRef = useCenterSelectedTab(view);

  React.useEffect(() => {
    if (!playerId) return;
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
  }, [playerId, navigate]);

  const stats = data ? data[scope] : null;
  const insights = data?.insights?.[scope];
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
  const player = data?.player;
  const isOwner = Boolean(player?.isOwner);
  const isHiddenError = /private|hidden/i.test(error);

  const share = () => {
    if (player) setShareOpen(true);
  };

  const openTournament = (id?: string) => id && navigate(`/t/${id}`);

  const recentList = (
    <Section title="Recent matches" icon={<SportsCricketRounded />}>
      {scopedMatches.length === 0 ? (
        <Typography sx={{ color: muted, fontWeight: 600 }}>No matches yet.</Typography>
      ) : (
        <Stack divider={<Box sx={{ borderTop: "1px solid #edf1f4" }} />}>
          {scopedMatches.map((m) => (
            <Stack
              key={`${m.source}-${m.matchId}`}
              direction="row"
              spacing={1.5}
              alignItems="center"
              onClick={m.tournamentId ? () => openTournament(m.tournamentId) : undefined}
              sx={{ py: 1.1, cursor: m.tournamentId ? "pointer" : "default", "&:hover": m.tournamentId ? { background: "#f9fbfc" } : undefined }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 800, color: ink, fontSize: 14.5 }}>
                  {m.team} vs {m.opponent}
                </Typography>
                <Typography sx={{ color: muted, fontSize: 12.5, fontWeight: 600 }}>
                  {formatDate(m.date)} · {m.source === "tournament" ? m.tournamentName || "Tournament" : "Friendly"}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right", fontSize: 13.5, color: "#223" }}>
                {m.batting && (
                  <div>
                    <b>
                      {m.batting.runs}
                      {m.batting.out ? "" : "*"}
                    </b>{" "}
                    ({m.batting.balls})
                  </div>
                )}
                {m.bowling && (
                  <div>
                    <b>
                      {m.bowling.wickets}/{m.bowling.runs}
                    </b>{" "}
                    ({formatOvers(m.bowling.balls)})
                  </div>
                )}
                {!m.batting && !m.bowling && <span style={{ color: "#8a96a3" }}>DNB</span>}
              </Box>
              {resultChip(m.result)}
            </Stack>
          ))}
        </Stack>
      )}
    </Section>
  );

  return (
    <>
      <MetaHelmet
        pageTitle={player ? `${player.name} (@${player.username}) – Cricket stats & achievements` : "Player profile"}
        description={
          player && data
            ? `${player.name}: ${data.overall.matches} matches, ${data.overall.batting.runs} runs, ${data.overall.bowling.wickets} wickets, ${data.achievements?.length ?? 0} achievements.`
            : "Career batting, bowling and fielding stats across tournaments and matches."
        }
        canonical={`/players/${playerId}`}
        robots={player?.visibility === "public" ? "index,follow" : "noindex,follow"}
      />
      <AppBar showHomeMenuItem />
      <Box sx={{ flex: "1 0 auto", bgcolor: "#eef5f7", pb: 6 }}>
        <Box sx={{ maxWidth: 1080, mx: "auto", px: { xs: 1.4, md: 3 }, pt: 2 }}>
          <PageTitleWithBack
            fallbackTo="/explore"
            titleSx={{ fontSize: { xs: "calc(24px * var(--app-font-scale, 1))", sm: "calc(32px * var(--app-font-scale, 1))" }, fontWeight: 900, color: "var(--app-accent-text, #185a9d)" }}
          >
            Player profile
          </PageTitleWithBack>

          {loading ? (
            <SkeletonGroup label="Loading player">
              <Stack spacing={2}>
                <HeroSkeleton />
                <CardSkeleton height={180} />
              </Stack>
            </SkeletonGroup>
          ) : error || !data || !stats || !player ? (
            <Paper elevation={0} sx={{ ...sectionSx, textAlign: "center", py: 4 }}>
              {isHiddenError ? <LockRounded sx={{ fontSize: 40, color: "#8a96a3" }} /> : null}
              <Typography sx={{ fontWeight: 900, color: ink, fontSize: 18, mt: 1 }}>
                {isHiddenError ? "This profile is private" : "Player not found"}
              </Typography>
              <Typography sx={{ color: muted, fontWeight: 600, mt: 0.5, mb: 2 }}>
                {isHiddenError ? "The player has chosen to keep their stats to themselves." : error || "This player doesn't exist."}
              </Typography>
              <Button variant="contained" onClick={() => navigate("/explore")} sx={primaryButtonSx}>
                Explore players
              </Button>
            </Paper>
          ) : (
            <Stack spacing={2}>
              <ProfileHero
                player={player}
                isOwner={isOwner}
                achievements={data.achievements?.length ?? 0}
                debut={insights?.highlights.firstMatch?.date ?? null}
                stats={[
                  { label: "Matches", value: stats.matches },
                  { label: "Runs", value: stats.batting.runs },
                  { label: "Wickets", value: stats.bowling.wickets },
                  { label: "Won", value: winPct === null ? "–" : `${winPct}%` },
                ]}
                onShare={share}
                onEdit={() => navigate("/me")}
                onAchievements={() => setView("achievements")}
              />

              {isOwner && player.visibility === "hidden" && (
                <Alert severity="info">
                  Your profile is hidden, so only you can see this page. Switch to Public or Link only under <b>Edit & privacy</b> to share it.
                </Alert>
              )}
              {isOwner && (data.privacy?.privateMatches ?? 0) > 0 && (
                <Alert
                  severity="info"
                  icon={<LockRounded />}
                  sx={{ borderRadius: 2.5, background: "#e9f0ed", color: "#23453b", "& .MuiAlert-icon": { color: "#0F2E25" } }}
                >
                  {data.privacy!.privateMatches} {data.privacy!.privateMatches === 1 ? "match is" : "matches are"} from private tournaments. You can see them here,
                  but they're left out of what other people see.
                </Alert>
              )}

              <Tabs
                value={scope}
                onChange={(_, v: Scope) => setScope(v)}
                variant="fullWidth"
                aria-label="Which matches to count"
                sx={segmentedTabsSx}
              >
                <Tab disableRipple value="overall" label={`All ${data.overall.matches}`} />
                <Tab disableRipple value="tournament" label={`Tournaments ${data.tournament.matches}`} />
                <Tab disableRipple value="friendly" label={`Friendly ${data.friendly.matches}`} />
              </Tabs>

              <Tabs
                ref={viewTabsRef}
                value={view}
                onChange={(_, v: View) => setView(v)}
                variant="scrollable"
                scrollButtons={false}
                sx={{
                  minHeight: 40,
                  // No arrow buttons (they reserve empty space on phones): the row
                  // scrolls by touch, and a fade on the right hints at more tabs.
                  "& .MuiTabs-scroller": {
                    maskImage: { xs: "linear-gradient(to right, #000 calc(100% - 28px), transparent)", sm: "none" },
                    WebkitMaskImage: { xs: "linear-gradient(to right, #000 calc(100% - 28px), transparent)", sm: "none" },
                  },
                  // A real spacer: scroll containers ignore end padding.
                  "& .MuiTabs-flexContainer::after": { content: '""', flex: { xs: "0 0 28px", sm: "0 0 0px" } },
                  "& .MuiTabs-indicator": { display: "none" },
                  "& .MuiTab-root": {
                    minHeight: 34,
                    mr: 0.75,
                    px: 1.6,
                    borderRadius: 99,
                    textTransform: "none",
                    fontWeight: 800,
                    background: "#fff",
                    border: "1px solid rgba(12,53,88,0.12)",
                  },
                  // Matches the player card: board green with gold lettering.
                  "& .Mui-selected": {
                    background: "linear-gradient(160deg, #1a4638 0%, #0F2E25 70%)",
                    color: "#F1D68A !important",
                    borderColor: "rgba(217,180,90,0.5)",
                  },
                }}
              >
                <Tab value="overview" label="Overview" />
                <Tab value="achievements" label="Achievements" />
                <Tab value="analysis" label="Analysis" />
                <Tab value="h2h" label="Head-to-head" />
                <Tab value="matches" label="Matches" />
              </Tabs>

              <Stack spacing={2} {...swipe.handlers} key={view} sx={{ ...swipe.enterSx, minHeight: "55vh" }}>
              {stats.matches === 0 && view !== "achievements" ? (
                <Alert severity="info">
                  No completed matches here yet. Stats appear once a match this player is in is completed and saved.
                </Alert>
              ) : view === "overview" ? (
                <>
                  <Section title="Batting">
                    <BattingTiles s={stats} />
                  </Section>
                  <Section title="Bowling & fielding">
                    <BowlingTiles s={stats} />
                  </Section>
                  {chartsUnlocked && (
                    <Section title="Recent form" icon={<ShowChartRounded />} premium>
                      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 1fr)" }, gap: 3 }}>
                        <FormBarChart title="Runs – last 10 innings" bars={battingForm} emptyText="No innings yet." emphasisNote="Not out" />
                        <FormBarChart title="Wickets – last 10 bowling innings" bars={bowlingForm} emptyText="Hasn't bowled yet." />
                      </Box>
                    </Section>
                  )}
                  {scope === "overall" && (
                    <AchievementsSection
                      achievements={data.achievements ?? []}
                      nextMilestones={data.nextMilestones ?? []}
                      limit={6}
                      onSeeAll={() => setView("achievements")}
                      playerName={player?.name}
                      profileUrl={player ? `${SHARE_APP_URL}/u/${player.username}` : undefined}
                    />
                  )}
                  {insights && (careerUnlocked ? <HighlightsSection h={insights.highlights} premium /> : <LockedCard title="Career highlights" />)}
                  {careerUnlocked && scope !== "friendly" && data.tournaments.length > 0 && (
                    <Section title="By tournament" premium>
                      <Box sx={{ overflowX: "auto" }}>
                        <Box component="table" sx={tableSx}>
                          <thead>
                            <tr>
                              <th>Tournament</th>
                              <th>M</th>
                              <th>Runs</th>
                              <th>HS</th>
                              <th>Avg</th>
                              <th>SR</th>
                              <th>Wkts</th>
                              <th>Best</th>
                              <th>Econ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.tournaments.map((t) => (
                              <Box
                                component="tr"
                                key={t.tournamentId}
                                onClick={() => openTournament(t.tournamentId)}
                                sx={{ cursor: "pointer", "&:hover td": { background: "#f6f9fb" } }}
                              >
                                <td>
                                  <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Typography sx={{ fontWeight: 800, color: ink, fontSize: 14 }}>{t.name}</Typography>
                                    {t.visibility === "private" && <LockRounded titleAccess="Private tournament" sx={{ fontSize: 14, color: "#8a96a3" }} />}
                                  </Stack>
                                  <Typography sx={{ color: muted, fontSize: 12, fontWeight: 600 }}>{t.teamName}</Typography>
                                </td>
                                <td>{t.stats.matches}</td>
                                <td>
                                  <b>{t.stats.batting.runs}</b>
                                </td>
                                <td>{t.stats.batting.innings ? `${t.stats.batting.highest}${t.stats.batting.highestNotOut ? "*" : ""}` : "–"}</td>
                                <td>{dash(t.stats.batting.average)}</td>
                                <td>{dash(t.stats.batting.strikeRate)}</td>
                                <td>
                                  <b>{t.stats.bowling.wickets}</b>
                                </td>
                                <td>{t.stats.bowling.innings ? `${t.stats.bowling.bestWickets}/${t.stats.bowling.bestRuns}` : "–"}</td>
                                <td>{dash(t.stats.bowling.economy)}</td>
                              </Box>
                            ))}
                          </tbody>
                        </Box>
                      </Box>
                    </Section>
                  )}
                </>
              ) : view === "achievements" ? (
                <>
                  {scope !== "overall" && (
                    <Alert severity="info">
                      Achievements count every match, so they're the same on all three tabs.
                    </Alert>
                  )}
                  <AchievementsSection
                    achievements={data.achievements ?? []}
                    nextMilestones={data.nextMilestones ?? []}
                    playerName={player?.name}
                    profileUrl={player ? `${SHARE_APP_URL}/u/${player.username}` : undefined}
                  />
                </>
              ) : view === "analysis" ? (
                insights && careerUnlocked ? <AnalysisSection a={insights.analysis} premium /> : <LockedCard title="Analysis" />
              ) : view === "h2h" ? (
                insights && careerUnlocked ? (
                  <HeadToHeadSection opponents={insights.headToHead.opponents} teams={insights.headToHead.teams} premium />
                ) : (
                  <LockedCard title="Head-to-head" />
                )
              ) : (
                recentList
              )}
              </Stack>

              {careerUnlocked && <PremiumNote sx={{ px: 0.5 }} />}

              {!isOwner && (
                <Paper elevation={0} sx={{ ...sectionSx, textAlign: "center" }}>
                  <Typography sx={{ fontWeight: 900, color: ink, fontSize: 17 }}>Play cricket too?</Typography>
                  <Typography sx={{ color: muted, fontWeight: 600, mb: 1.5 }}>
                    Get your own free profile with career stats, achievements and a link to share.
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
                    <Button variant="contained" onClick={() => startAs(navigate, "player")} sx={primaryButtonSx}>
                      Create my player profile
                    </Button>
                    <Button onClick={() => navigate("/explore")} sx={{ textTransform: "none", fontWeight: 900 }}>
                      Explore players & tournaments
                    </Button>
                  </Stack>
                </Paper>
              )}
            </Stack>
          )}
        </Box>
      </Box>
      <Snackbar open={Boolean(notice)} autoHideDuration={3000} onClose={() => setNotice("")} message={notice} />
      {player && data && (
        <ShareSheet
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          title="Share profile"
          url={`${SHARE_APP_URL}/u/${player.username}`}
          text={`${player.name}'s cricket stats and achievements`}
          fileName={`${player.username}-cricket-profile.png`}
          makeImage={() =>
            playerCardFromCareer({
              name: player.name,
              username: player.username,
              role: player.role,
              city: player.city,
              avatarUrl: resolveShareMedia(player.avatarUrl),
              stats: data.overall,
              achievements: data.achievements?.length ?? 0,
              url: `${SHARE_APP_URL}/u/${player.username}`,
            })
          }
        />
      )}
    </>
  );
};

export default PlayerProfilePage;
