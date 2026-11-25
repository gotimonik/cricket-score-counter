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
import { EmojiEventsRounded, PersonSearchRounded, PlaceRounded, SearchRounded } from "@mui/icons-material";
import AppBar from "./AppBar";
import AppSpinner from "./AppSpinner";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";
import ExploreService, { type PageMeta, type PublicTournamentSummary } from "../services/ExploreService";
import type { PublicPlayer } from "../services/PlayerAccountService";
import { resolveApiMediaUrl } from "../utils/mediaUrl";
import { startAs } from "../utils/playerOnboarding";
import PlayerAvatar from "./player/PlayerAvatar";
import RegisteredBadge from "./player/RegisteredBadge";
import { primaryButtonSx } from "./player/buttonStyles";
import useSwipeTabs from "../hooks/useSwipeTabs";
import { formatDate, ink, muted, sectionSx } from "./profile/ProfileUi";

type Kind = "players" | "tournaments";
type StatusFilter = "" | "active" | "completed";
const KINDS: readonly Kind[] = ["players", "tournaments"];

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
    sx={{ ...sectionSx, p: 1.5, cursor: "pointer", transition: "transform 120ms, box-shadow 120ms", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 14px 34px rgba(8,26,56,0.12)" } }}
  >
    <Stack direction="row" spacing={1.25} alignItems="center">
      <PlayerAvatar name={p.name} avatarUrl={p.avatarUrl} size={52} />
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography sx={{ fontWeight: 900, color: ink, fontSize: 15.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</Typography>
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
    sx={{ ...sectionSx, p: 1.5, cursor: "pointer", transition: "transform 120ms, box-shadow 120ms", "&:hover": { transform: "translateY(-2px)", boxShadow: "0 14px 34px rgba(8,26,56,0.12)" } }}
  >
    <Stack direction="row" spacing={1.25} alignItems="center">
      <Avatar
        src={resolveApiMediaUrl(t.logoUrl) || undefined}
        variant="rounded"
        sx={{ width: 52, height: 52, borderRadius: 2, background: "linear-gradient(135deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)" }}
      >
        <EmojiEventsRounded />
      </Avatar>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Typography sx={{ fontWeight: 900, color: ink, fontSize: 15.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</Typography>
          {statusChip(t.status)}
        </Stack>
        <Stack direction="row" spacing={0.4} alignItems="center" sx={{ color: muted }}>
          <PlaceRounded sx={{ fontSize: 14 }} />
          <Typography sx={{ fontWeight: 700, fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {t.location} · {formatDate(t.startDate, false)} – {formatDate(t.endDate)}
          </Typography>
        </Stack>
        <Typography sx={{ color: "#526274", fontWeight: 700, fontSize: 12.5 }}>
          {t.teamsCount ?? 0} teams · {t.matchesCompleted ?? 0} matches played · {t.oversPerMatch} overs · by {t.organizerName}
        </Typography>
      </Box>
    </Stack>
  </Paper>
);

/** /explore — find public players and tournaments, no login needed. */
const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialKind: Kind = location.pathname.endsWith("/tournaments") ? "tournaments" : "players";
  const [kind, setKind] = React.useState<Kind>(initialKind);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<StatusFilter>("");
  const q = useDebounced(query.trim());
  const [players, setPlayers] = React.useState<PublicPlayer[]>([]);
  const [tournaments, setTournaments] = React.useState<PublicTournamentSummary[]>([]);
  const [meta, setMeta] = React.useState<PageMeta | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [error, setError] = React.useState("");

  const load = React.useCallback(
    async (page: number) => {
      const searchTerm = q.length >= 2 ? q : "";
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
    navigate(next === "players" ? "/explore" : "/explore/tournaments", { replace: true });
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

  const list = kind === "players" ? players : tournaments;
  const swipe = useSwipeTabs(KINDS, kind, switchKind);

  return (
    <>
      <MetaHelmet
        pageTitle={kind === "players" ? "Explore cricket players – stats & achievements" : "Explore cricket tournaments – points tables & results"}
        description="Browse public cricket player profiles and tournaments: career stats, achievements, points tables, results and leaders."
        canonical={kind === "players" ? "/explore" : "/explore/tournaments"}
      />
      <AppBar showHomeMenuItem />
      <Box sx={{ minHeight: "100vh", bgcolor: "#eef5f7", pb: 6 }}>
        <Box sx={{ maxWidth: 1080, mx: "auto", px: { xs: 1.4, md: 3 }, pt: 2 }}>
          <PageTitleWithBack
            titleSx={{ fontSize: { xs: "calc(24px * var(--app-font-scale, 1))", sm: "calc(32px * var(--app-font-scale, 1))" }, fontWeight: 900, color: "var(--app-accent-text, #185a9d)" }}
          >
            Explore
          </PageTitleWithBack>
          <Typography sx={{ color: "#526274", fontWeight: 600, mb: 1.5 }}>
            Find players and follow tournaments. Only profiles and tournaments set to <b>Public</b> are listed here.
          </Typography>

          <Paper elevation={0} sx={{ ...sectionSx, p: 1.25, mb: 2 }}>
            <Tabs
              value={kind}
              onChange={(_, v: Kind) => switchKind(v)}
              variant="fullWidth"
              sx={{
                mb: 1,
                "& .MuiTab-root": { fontWeight: 900, textTransform: "none", color: "#5f6b66" },
                "& .MuiTab-root.Mui-selected": { color: "#0F2E25" },
                "& .MuiTabs-indicator": { height: 3, borderRadius: 3, background: "#D9B45A" },
              }}
            >
              <Tab value="players" icon={<PersonSearchRounded />} iconPosition="start" label="Players" />
              <Tab value="tournaments" icon={<EmojiEventsRounded />} iconPosition="start" label="Tournaments" />
            </Tabs>
            <TextField
              fullWidth
              size="small"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={kind === "players" ? "Search by name, @username or city" : "Search by tournament, city or organizer"}
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
                {q ? "No matches for that search" : kind === "players" ? "No public players yet" : "No public tournaments yet"}
              </Typography>
              <Typography sx={{ color: muted, fontWeight: 600, mt: 0.5, mb: 2 }}>
                {kind === "players"
                  ? "Players set to Link only can still be found by their exact @username."
                  : "Organizers can make a tournament public from its page."}
              </Typography>
              {kind === "players" && (
                <Button variant="contained" onClick={() => startAs(navigate, "player")} sx={primaryButtonSx}>
                  Create my player profile
                </Button>
              )}
            </Paper>
          ) : (
            <>
              <Typography
                component="h2"
                sx={{ fontWeight: 900, color: ink, fontSize: "calc(15px * var(--app-font-scale, 1))", mb: 1 }}
              >
                {q.length >= 2
                  ? `Results for “${q}”`
                  : kind === "players"
                    ? "Latest public players"
                    : status === "active"
                      ? "Latest live tournaments"
                      : status === "completed"
                        ? "Latest completed tournaments"
                        : "Latest public tournaments"}
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: kind === "players" ? "repeat(3, minmax(0, 1fr))" : "1fr 1fr" }, gap: 1.25 }}>
                {kind === "players"
                  ? players.map((p) => <PlayerCard key={p.id} p={p} onOpen={() => navigate(`/players/${p.id}`)} />)
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
