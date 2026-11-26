import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { ChevronRightRounded, EmojiEventsRounded, RefreshRounded, PersonSearchRounded, PlaceRounded, SearchRounded } from "@mui/icons-material";
import AppBar from "./AppBar";
import AppSpinner from "./AppSpinner";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";
import ExploreService, { type LiveMatchSummary, type PageMeta, type PublicTournamentSummary } from "../services/ExploreService";
import type { PublicPlayer } from "../services/PlayerAccountService";
import { resolveApiMediaUrl } from "../utils/mediaUrl";
import { startAs } from "../utils/playerOnboarding";
import PlayerAvatar from "./player/PlayerAvatar";
import RegisteredBadge from "./player/RegisteredBadge";
import { primaryButtonSx } from "./player/buttonStyles";
import useSwipeTabs from "../hooks/useSwipeTabs";
import { formatDate, ink, muted, sectionSx } from "./profile/ProfileUi";

type Kind = "players" | "tournaments" | "live";
type StatusFilter = "" | "active" | "completed";
const KINDS: readonly Kind[] = ["players", "tournaments", "live"];
const KIND_PATH: Record<Kind, string> = { players: "/explore", tournaments: "/explore/tournaments", live: "/explore/live" };
const LIVE_REFRESH_MS = 10_000;

const kindFromPath = (pathname: string): Kind =>
  pathname.endsWith("/tournaments") ? "tournaments" : pathname.endsWith("/live") ? "live" : "players";

const pulseDotSx = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  bgcolor: "#e53935",
  flex: "none",
  animation: "explorePulse 1.4s ease-in-out infinite",
  "@keyframes explorePulse": { "0%, 100%": { opacity: 1 }, "50%": { opacity: 0.3 } },
} as const;

const useDebounced = <T,>(value: T, ms = 350) => {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
};

const statusChip = (status: string) => {
  const map: Record<string, { label: string; bg: string; fg: string }> = {
    active: { label: "Live", bg: "#dcf5e7", fg: "#0d6b3d" },
    completed: { label: "Completed", bg: "#edf1f4", fg: "#4a5560" },
    draft: { label: "Upcoming", bg: "#fff0c2", fg: "#6b4a00" },
  };
  const m = map[status] ?? map.draft;
  return <Chip size="small" label={m.label} sx={{ height: 20, fontSize: 11, fontWeight: 900, bgcolor: m.bg, color: m.fg }} />;
};

const PlayerCard: React.FC<{ p: PublicPlayer; onOpen: () => void }> = ({ p, onOpen }) => (
  <Paper
    elevation={0}
    onClick={onOpen}
    sx={{ ...sectionSx, p: { xs: 1.25, sm: 1.5 }, cursor: "pointer", transition: "transform 120ms, box-shadow 120ms", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 14px 34px rgba(8,26,56,0.12)" } }}
  >
    <Stack direction="row" spacing={1.25} alignItems="center">
      <PlayerAvatar name={p.name} avatarUrl={p.avatarUrl} size={52} />
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 900, color: ink, fontSize: 15.5, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</Typography>
          {p.registered && <RegisteredBadge />}
        </Stack>
        <Typography sx={{ color: muted, fontWeight: 700, fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          @{p.username}
          {p.city ? ` · ${p.city}` : ""}
        </Typography>
        <Stack direction="row" spacing={0.5} sx={{ mt: 0.4 }} flexWrap="wrap" useFlexGap>
          {[p.role, p.battingStyle, p.bowlingStyle].filter(Boolean).slice(0, 2).map((x) => (
            <Chip key={x} size="small" label={x} sx={{ height: 20, fontSize: 11, fontWeight: 800, background: "#eef5f7", color: "#185a9d" }} />
          ))}
        </Stack>
      </Box>
    </Stack>
  </Paper>
);

const TournamentCard: React.FC<{ t: PublicTournamentSummary; onOpen: () => void }> = ({ t, onOpen }) => (
  <Paper
    elevation={0}
    onClick={onOpen}
    sx={{ ...sectionSx, p: { xs: 1.25, sm: 1.5 }, cursor: "pointer", transition: "transform 120ms, box-shadow 120ms", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 14px 34px rgba(8,26,56,0.12)" } }}
  >
    <Stack direction="row" spacing={1.25} alignItems="center">
      <Avatar
        src={resolveApiMediaUrl(t.logoUrl) || undefined}
        variant="rounded"
        sx={{ width: { xs: 46, sm: 52 }, height: { xs: 46, sm: 52 }, flex: "none", borderRadius: 2, background: "linear-gradient(135deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)" }}
      >
        <EmojiEventsRounded />
      </Avatar>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 900, color: ink, fontSize: { xs: 15, sm: 15.5 }, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</Typography>
          <Box sx={{ flex: "none" }}>{statusChip(t.status)}</Box>
        </Stack>
        <Stack direction="row" spacing={0.4} alignItems="center" sx={{ color: muted, minWidth: 0 }}>
          <PlaceRounded sx={{ fontSize: 14, flex: "none" }} />
          <Typography sx={{ fontWeight: 700, fontSize: 12.5, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {t.location} · {formatDate(t.startDate, false)} – {formatDate(t.endDate)}
          </Typography>
        </Stack>
        <Typography sx={{ color: "#526274", fontWeight: 700, fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {t.teamsCount ?? 0} teams · {t.matchesCompleted ?? 0} played · {t.oversPerMatch} ov
        </Typography>
        {t.organizerName && (
          <Typography sx={{ color: muted, fontWeight: 600, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            by {t.organizerName}
          </Typography>
        )}
      </Box>
    </Stack>
  </Paper>
);

const TeamBadge: React.FC<{ name: string; logoUrl: string }> = ({ name, logoUrl }) => (
  <Avatar
    src={resolveApiMediaUrl(logoUrl) || undefined}
    sx={{ width: 22, height: 22, fontSize: 11, fontWeight: 900, flex: "none", bgcolor: "#cfd8de", color: "#0c3558" }}
  >
    {name.trim()[0]?.toUpperCase() ?? "?"}
  </Avatar>
);

/** Cricbuzz-style live score card: context line, one row per team, status line. */
const LiveMatchCard: React.FC<{ m: LiveMatchSummary; onOpen: () => void }> = ({ m, onOpen }) => {
  const rows = [
    { name: m.team1Name, logo: m.team1LogoUrl },
    { name: m.team2Name, logo: m.team2LogoUrl },
  ];
  const status =
    m.statusText ||
    (m.target > 0 ? `${m.battingTeam} need ${m.target} to win` : m.scorerOnline ? "Innings in progress" : "Waiting for the next update");
  return (
    <Paper
      elevation={0}
      onClick={onOpen}
      sx={{
        ...sectionSx,
        p: { xs: 1.25, sm: 1.5 },
        cursor: "pointer",
        borderLeft: "4px solid #e53935",
        transition: "box-shadow 120ms, transform 120ms",
        "&:hover": { transform: "translateY(-2px)", boxShadow: "0 14px 34px rgba(8,26,56,0.12)" },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.75, minWidth: 0 }}>
        <Box sx={pulseDotSx} />
        <Typography sx={{ color: "#e53935", fontWeight: 900, fontSize: 11, letterSpacing: 0.6, flex: "none" }}>LIVE</Typography>
        <Typography sx={{ color: muted, fontWeight: 700, fontSize: 12, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
          {m.tournament ? `${m.tournament.name}${m.tournament.location ? ` · ${m.tournament.location}` : ""}` : "Friendly match"}
        </Typography>
        <ChevronRightRounded sx={{ fontSize: 18, color: "#9aa6b2", flex: "none" }} />
      </Stack>
      {rows.map((r) => {
        const inn = m.innings.find((i) => i.team === r.name);
        const batting = r.name === m.battingTeam;
        return (
          <Stack key={r.name} direction="row" alignItems="center" spacing={1} sx={{ py: 0.3 }}>
            <TeamBadge name={r.name} logoUrl={r.logo} />
            <Typography
              sx={{
                flex: 1,
                minWidth: 0,
                fontWeight: batting ? 900 : 700,
                color: batting ? ink : "#4a5866",
                fontSize: { xs: 14, sm: 14.5 },
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {r.name}
            </Typography>
            <Typography
              sx={{
                flex: "none",
                whiteSpace: "nowrap",
                fontWeight: batting ? 900 : 700,
                color: batting ? ink : "#4a5866",
                fontSize: { xs: 14, sm: 14.5 },
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {inn ? (
                <>
                  {inn.runs}-{inn.wickets}
                  {inn.overs && (
                    <Box component="span" sx={{ fontWeight: 600, color: muted, fontSize: "0.88em" }}>
                      {" "}({inn.overs})
                    </Box>
                  )}
                </>
              ) : (
                <Box component="span" sx={{ fontWeight: 600, color: muted, fontSize: "0.88em" }}>Yet to bat</Box>
              )}
            </Typography>
          </Stack>
        );
      })}
      <Typography sx={{ color: "#c62828", fontSize: 12.5, fontWeight: 700, mt: 0.6, lineHeight: 1.3 }}>
        {status}
        {!m.scorerOnline && (
          <Box component="span" sx={{ color: muted, fontWeight: 600 }}>
            {m.tournament ? " · last saved over" : " · scorer reconnecting"}
          </Box>
        )}
      </Typography>
    </Paper>
  );
};

/** /explore — find public players and tournaments, no login needed. */
const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialKind: Kind = kindFromPath(location.pathname);
  const [kind, setKind] = React.useState<Kind>(initialKind);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<StatusFilter>("");
  const q = useDebounced(query.trim());
  const [players, setPlayers] = React.useState<PublicPlayer[]>([]);
  const [tournaments, setTournaments] = React.useState<PublicTournamentSummary[]>([]);
  const [liveMatches, setLiveMatches] = React.useState<LiveMatchSummary[] | null>(null);
  const [liveUpdatedAt, setLiveUpdatedAt] = React.useState<number | null>(null);
  const [liveRefreshing, setLiveRefreshing] = React.useState(false);
  const [meta, setMeta] = React.useState<PageMeta | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [error, setError] = React.useState("");

  const load = React.useCallback(
    async (page: number) => {
      const searchTerm = q.length >= 2 ? q : "";
      if (kind === "live") {
        const res = await ExploreService.live();
        setLiveMatches(res.matches ?? []);
        setLiveUpdatedAt(Date.now());
        setMeta(null);
        return;
      }
      if (kind === "players") {
        const res = await ExploreService.players(searchTerm, page);
        setPlayers((prev) => (page === 1 ? res.players : [...prev, ...res.players]));
        setMeta(res.pagination);
      } else {
        const res = await ExploreService.tournaments(searchTerm, status, page);
        setTournaments((prev) => (page === 1 ? res.tournaments : [...prev, ...res.tournaments]));
        setMeta(res.pagination);
      }
    },
    [kind, q, status],
  );

  // The Live tab's count shows on every tab, so fetch it once up front.
  React.useEffect(() => {
    if (kind === "live") return;
    ExploreService.live()
      .then((res) => setLiveMatches(res.matches ?? []))
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep live scores fresh while the Live tab is open and visible, and
  // refresh straight away when the tab comes back into view (e.g. after
  // scoring a few balls in another tab) instead of waiting for the next tick.
  const refreshLive = React.useCallback(() => {
    setLiveRefreshing(true);
    return ExploreService.live()
      .then((res) => {
        setLiveMatches(res.matches ?? []);
        setLiveUpdatedAt(Date.now());
      })
      .catch(() => undefined)
      .finally(() => setLiveRefreshing(false));
  }, []);
  React.useEffect(() => {
    if (kind !== "live") return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") refreshLive();
    }, LIVE_REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") refreshLive();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [kind, refreshLive]);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    load(1)
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "Couldn't load results."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [load]);

  const switchKind = (next: Kind) => {
    setKind(next);
    setMeta(null);
    navigate(KIND_PATH[next], { replace: true });
  };

  const loadMore = async () => {
    if (!meta?.hasMore) return;
    setLoadingMore(true);
    try {
      await load(meta.page + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load more.");
    } finally {
      setLoadingMore(false);
    }
  };

  const liveFiltered = React.useMemo(() => {
    const all = liveMatches ?? [];
    const needle = q.length >= 2 ? q.toLowerCase() : "";
    if (!needle) return all;
    return all.filter((m) =>
      [m.team1Name, m.team2Name, m.tournament?.name ?? "", m.tournament?.location ?? ""].some((v) => v.toLowerCase().includes(needle)),
    );
  }, [liveMatches, q]);
  const liveCount = liveMatches?.length ?? 0;
  const list: unknown[] = kind === "players" ? players : kind === "tournaments" ? tournaments : liveFiltered;
  const swipe = useSwipeTabs(KINDS, kind, switchKind);

  return (
    <>
      <MetaHelmet
        pageTitle={
          kind === "players"
            ? "Explore cricket players – stats & achievements"
            : kind === "live"
              ? "Live cricket matches – scores ball by ball"
              : "Explore cricket tournaments – points tables & results"
        }
        description="Browse public cricket player profiles and tournaments: career stats, achievements, points tables, results and leaders."
        canonical={KIND_PATH[kind]}
      />
      <AppBar showHomeMenuItem />
      <Box sx={{ minHeight: "100vh", bgcolor: "#eef5f7", pb: 6 }}>
        <Box sx={{ maxWidth: 1080, mx: "auto", px: { xs: 1.4, md: 3 }, pt: 2 }}>
          <PageTitleWithBack
            titleSx={{ fontSize: { xs: "calc(24px * var(--app-font-scale, 1))", sm: "calc(32px * var(--app-font-scale, 1))" }, fontWeight: 900, color: "var(--app-accent-text, #185a9d)" }}
          >
            Explore
          </PageTitleWithBack>
          <Typography sx={{ color: "#526274", fontWeight: 600, mb: 1.5, fontSize: { xs: 14, sm: 16 } }}>
            Find players, follow tournaments and watch matches live. Only profiles and tournaments set to <b>Public</b> are listed here.
          </Typography>

          <Paper elevation={0} sx={{ ...sectionSx, p: 1.25, mb: 2 }}>
            <Tabs
              value={kind}
              onChange={(_, v: Kind) => switchKind(v)}
              variant="fullWidth"
              sx={{
                mb: 1,
                minHeight: 0,
                "& .MuiTab-root": {
                  fontWeight: 900,
                  textTransform: "none",
                  color: "#5f6b66",
                  minHeight: { xs: 44, sm: 52 },
                  minWidth: 0,
                  py: 0.5,
                  px: { xs: 0.5, sm: 2 },
                  fontSize: { xs: 13.5, sm: 14.5 },
                  whiteSpace: "nowrap",
                },
                "& .MuiTab-iconWrapper": { display: { xs: "none", sm: "inline-flex" } },
                "& .MuiTab-root.Mui-selected": { color: "#0F2E25" },
                "& .MuiTabs-indicator": { height: 3, borderRadius: 3, background: "#D9B45A" },
              }}
            >
              <Tab value="players" icon={<PersonSearchRounded />} iconPosition="start" label="Players" />
              <Tab value="tournaments" icon={<EmojiEventsRounded />} iconPosition="start" label="Tournaments" />
              <Tab
                value="live"
                label={
                  <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.6 }}>
                    <Box component="span" sx={{ ...pulseDotSx, opacity: liveCount ? undefined : 0.35, animation: liveCount ? pulseDotSx.animation : "none" }} />
                    Live
                    {liveCount > 0 && (
                      <Box component="span" sx={{ px: 0.7, borderRadius: 99, bgcolor: "#e53935", color: "#fff", fontSize: 11, fontWeight: 900, lineHeight: "18px" }}>
                        {liveCount}
                      </Box>
                    )}
                  </Box>
                }
              />
            </Tabs>
            <TextField
              fullWidth
              size="small"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                kind === "players"
                  ? "Search by name, @username or city"
                  : kind === "live"
                    ? "Search by team, tournament or city"
                    : "Search by tournament, city or organizer"
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded />
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2, background: "#fff" } }}
            />
            {kind === "tournaments" && (
              <Stack direction="row" spacing={0.75} sx={{ mt: 1 }}>
                {([
                  ["", "All"],
                  ["active", "Live"],
                  ["completed", "Completed"],
                ] as const).map(([value, label]) => (
                  <Chip
                    key={value || "all"}
                    label={label}
                    onClick={() => setStatus(value)}
                    sx={{
                      fontWeight: 800,
                      bgcolor: status === value ? "#0F2E25" : "#f1eee4",
                      color: status === value ? "#EDE9DC" : "#0F2E25",
                      "&:hover": { bgcolor: status === value ? "#0F2E25" : "#e8e3d4" },
                    }}
                  />
                ))}
              </Stack>
            )}
          </Paper>

          <Box {...swipe.handlers} key={kind} sx={{ ...swipe.enterSx, minHeight: "50vh" }}>
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
              <AppSpinner />
            </Box>
          ) : list.length === 0 ? (
            <Paper elevation={0} sx={{ ...sectionSx, textAlign: "center", py: 4 }}>
              <Typography sx={{ fontWeight: 900, color: ink, fontSize: 17 }}>
                {q
                  ? "No matches for that search"
                  : kind === "players"
                    ? "No public players yet"
                    : kind === "live"
                      ? "No matches live right now"
                      : "No public tournaments yet"}
              </Typography>
              <Typography sx={{ color: muted, fontWeight: 600, mt: 0.5, mb: 2 }}>
                {kind === "players"
                  ? "Players set to Link only can still be found by their exact @username."
                  : kind === "live"
                    ? "Matches show up here as soon as the first ball is scored. This list refreshes on its own."
                    : "Organizers can make a tournament public from its page."}
              </Typography>
              {kind === "live" && (
                <Button variant="contained" onClick={() => navigate("/create-game")} sx={primaryButtonSx}>
                  Score a match
                </Button>
              )}
              {kind === "players" && (
                <Button variant="contained" onClick={() => startAs(navigate, "player")} sx={primaryButtonSx}>
                  Create my player profile
                </Button>
              )}
            </Paper>
          ) : (
            <>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ mb: 1 }}>
              <Typography
                component="h2"
                sx={{ fontWeight: 900, color: ink, fontSize: "calc(15px * var(--app-font-scale, 1))" }}
              >
                {q.length >= 2
                  ? `Results for “${q}”`
                  : kind === "live"
                    ? `${liveFiltered.length} ${liveFiltered.length === 1 ? "match" : "matches"} live now`
                    : kind === "players"
                    ? "Latest public players"
                    : status === "active"
                      ? "Latest live tournaments"
                      : status === "completed"
                        ? "Latest completed tournaments"
                        : "Latest public tournaments"}
              </Typography>
              {kind === "live" && (
                <Button
                  size="small"
                  onClick={() => refreshLive()}
                  disabled={liveRefreshing}
                  startIcon={<RefreshRounded sx={{ animation: liveRefreshing ? "exploreSpin 0.8s linear infinite" : "none", "@keyframes exploreSpin": { to: { transform: "rotate(360deg)" } } }} />}
                  sx={{ textTransform: "none", fontWeight: 800, color: muted, flex: "none", minWidth: 0 }}
                >
                  {liveUpdatedAt ? `Updated ${new Date(liveUpdatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" })}` : "Refresh"}
                </Button>
              )}
              </Stack>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))", md: kind === "tournaments" ? "repeat(2, minmax(0, 1fr))" : "repeat(3, minmax(0, 1fr))" }, gap: 1.25 }}>
                {kind === "players"
                  ? players.map((p) => <PlayerCard key={p.id} p={p} onOpen={() => navigate(`/players/${p.id}`)} />)
                  : kind === "live"
                    ? liveFiltered.map((m) => <LiveMatchCard key={m.code} m={m} onOpen={() => navigate(`/join-game/${m.code}`, { state: { backLabel: "Live matches" } })} />)
                    : tournaments.map((t) => <TournamentCard key={t.id} t={t} onOpen={() => navigate(`/t/${t.id}`)} />)}
              </Box>
              {meta?.hasMore && (
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Button onClick={loadMore} disabled={loadingMore} variant="outlined" sx={{ textTransform: "none", fontWeight: 900, borderRadius: 2 }}>
                    {loadingMore ? "Loading…" : "Show more"}
                  </Button>
                </Box>
              )}
            </>
          )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ExplorePage;
