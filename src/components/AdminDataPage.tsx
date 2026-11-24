import React from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import {
  BlockRounded,
  DeleteOutlineRounded,
  EmailOutlined,
  LockOpenRounded,
  PhoneOutlined,
  SearchRounded,
  VisibilityOutlined,
} from "@mui/icons-material";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import AppSpinner from "./AppSpinner";
import AuthService, { ApiError } from "../services/AuthService";
import AdminService, {
  type AdminContact,
  type AdminMatch,
  type AdminOverview,
  type AdminPlayer,
  type AdminTournament,
} from "../services/AdminService";
import { resolveApiMediaUrl } from "../utils/mediaUrl";
import { getTeamAvatarGradient } from "../utils/teamAvatar";

type TabId = "overview" | "tournaments" | "players" | "matches";
const NAVY = "#0c3558";
const MUTED = "#526274";
// Set explicitly: the app theme otherwise greys out text buttons.
const actionSx = {
  fontWeight: 800,
  textTransform: "none",
  borderRadius: 2,
  color: "#185a9d",
  "&:hover": { background: "rgba(24,90,157,0.08)" },
} as const;
const dangerSx = {
  ...actionSx,
  color: "#c0352c",
  "&:hover": { background: "rgba(224,70,60,0.08)" },
} as const;

const fmtDate = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};
const num = (n: number | undefined) => (n ?? 0).toLocaleString();

const useDebounced = (value: string, ms = 300) => {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value.trim()), ms);
    return () => window.clearTimeout(timer);
  }, [value, ms]);
  return debounced;
};

const StatCard: React.FC<{ label: string; value: number; detail?: string }> = ({ label, value, detail }) => (
  <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid rgba(12,53,88,0.1)" }}>
    <Typography sx={{ fontSize: 12.5, fontWeight: 800, color: MUTED, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</Typography>
    <Typography sx={{ fontSize: 28, fontWeight: 900, color: NAVY, lineHeight: 1.2 }}>{num(value)}</Typography>
    {detail && <Typography sx={{ fontSize: 13, color: MUTED, fontWeight: 600 }}>{detail}</Typography>}
  </Paper>
);

const ContactLine: React.FC<{ label: string; contact: AdminContact; extraPhone?: string }> = ({ label, contact, extraPhone }) => {
  const phone = contact?.phone || extraPhone;
  if (!contact && !phone) return null;
  const linkSx = { color: "#185a9d", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 0.4, wordBreak: "break-all" } as const;
  return (
    <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mt: 0.5, fontSize: 13, color: MUTED }}>
      <span>
        {label}: <b style={{ color: NAVY }}>{contact?.name || "—"}</b>
      </span>
      {contact?.email && (
        <Box component="a" href={`mailto:${contact.email}`} sx={linkSx}>
          <EmailOutlined sx={{ fontSize: 15 }} /> {contact.email}
        </Box>
      )}
      {phone && (
        <Box component="a" href={`tel:${phone.replace(/\s+/g, "")}`} sx={linkSx}>
          <PhoneOutlined sx={{ fontSize: 15 }} /> {phone}
        </Box>
      )}
    </Stack>
  );
};

const StatusChip: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, [string, string, string]> = {
    active: ["Active", "rgba(11,127,97,0.12)", "#0b7f61"],
    in_progress: ["Live / in progress", "rgba(224,70,60,0.1)", "#c0352c"],
    completed: ["Completed", "rgba(24,90,157,0.12)", "#185a9d"],
    draft: ["Draft", "rgba(198,146,20,0.14)", "#8a6200"],
    scheduled: ["Scheduled", "rgba(12,53,88,0.08)", MUTED],
  };
  const [label, bg, fg] = map[status] ?? [status, "rgba(12,53,88,0.08)", MUTED];
  return <Chip size="small" label={label} sx={{ fontWeight: 800, bgcolor: bg, color: fg }} />;
};

const Row: React.FC<{ children: React.ReactNode; actions?: React.ReactNode; muted?: boolean }> = ({ children, actions, muted }) => (
  <Box
    sx={{
      p: 1.75,
      borderRadius: 2.5,
      border: "1px solid rgba(12,53,88,0.1)",
      background: muted ? "#fbf3f2" : "#fff",
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      gap: 1.5,
      alignItems: { sm: "center" },
    }}
  >
    <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
    {actions && (
      <Stack direction="row" spacing={1} sx={{ flex: "none" }}>
        {actions}
      </Stack>
    )}
  </Box>
);

const Toolbar: React.FC<{
  search: string;
  onSearch: (v: string) => void;
  placeholder: string;
  filters: { id: string; label: string }[];
  filter: string;
  onFilter: (v: string) => void;
  total?: number;
  extra?: React.ReactNode;
}> = ({ search, onSearch, placeholder, filters, filter, onFilter, total, extra }) => (
  <Stack spacing={1.25} sx={{ mb: 1.75 }}>
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} alignItems={{ sm: "center" }}>
      <TextField
        size="small"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={placeholder}
        sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 2, background: "#fff" } }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded fontSize="small" /></InputAdornment> }}
      />
      {extra}
    </Stack>
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
      {filters.map((f) => (
        <Chip
          key={f.id}
          label={f.label}
          onClick={() => onFilter(f.id)}
          sx={{
            fontWeight: 800,
            bgcolor: filter === f.id ? NAVY : "rgba(12,53,88,0.07)",
            color: filter === f.id ? "#fff" : NAVY,
            "&:hover": { bgcolor: filter === f.id ? NAVY : "rgba(12,53,88,0.14)" },
          }}
        />
      ))}
      {total !== undefined && (
        <Typography sx={{ ml: "auto !important", fontSize: 13, fontWeight: 800, color: MUTED }}>{num(total)} found</Typography>
      )}
    </Stack>
  </Stack>
);

/** Paged list fetched with useSWRInfinite; returns flattened items + controls. */
function usePagedList<T>(key: string | null, fetchPage: (page: number) => Promise<{ items: T[]; total: number; hasMore: boolean }>) {
  const swr = useSWRInfinite(
    (index, prev: { hasMore: boolean } | null) => (key && (!prev || prev.hasMore) ? [key, index + 1] : null),
    ([, page]: [string, number]) => fetchPage(page),
    { keepPreviousData: true, revalidateFirstPage: false },
  );
  const pages = swr.data ?? [];
  return {
    items: pages.flatMap((p) => p.items),
    total: pages[0]?.total,
    hasMore: Boolean(pages[pages.length - 1]?.hasMore),
    loading: swr.isLoading,
    loadingMore: swr.isValidating && swr.size > 1,
    error: swr.error as Error | undefined,
    loadMore: () => swr.setSize(swr.size + 1),
    refresh: () => swr.mutate(),
  };
}

const LoadMore: React.FC<{ show: boolean; loading: boolean; onClick: () => void }> = ({ show, loading, onClick }) =>
  show ? (
    <Button onClick={onClick} disabled={loading} sx={{ mt: 1.5, alignSelf: "center", fontWeight: 800, textTransform: "none" }}>
      {loading ? "Loading…" : "Load more"}
    </Button>
  ) : null;

type Confirm = { title: string; body: string; action: string; run: () => Promise<string> } | null;

const AdminDataPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = React.useState<TabId>("overview");
  const [access, setAccess] = React.useState<"checking" | "denied" | "ok">("checking");
  const [confirm, setConfirm] = React.useState<Confirm>(null);
  const [working, setWorking] = React.useState(false);
  const [toast, setToast] = React.useState<{ message: string; severity: "success" | "error" } | null>(null);

  // Filters per tab
  const [tSearch, setTSearch] = React.useState("");
  const [tStatus, setTStatus] = React.useState("all");
  const [pSearch, setPSearch] = React.useState("");
  const [pType, setPType] = React.useState("all");
  const [mSearch, setMSearch] = React.useState("");
  const [mKind, setMKind] = React.useState<"tournament" | "friendly">("tournament");
  const [mStatus, setMStatus] = React.useState("all");
  const tQ = useDebounced(tSearch);
  const pQ = useDebounced(pSearch);
  const mQ = useDebounced(mSearch);

  React.useEffect(() => {
    if (!AuthService.isLoggedIn()) navigate("/login", { state: { next_redirect: location.pathname } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The server decides who's an admin (ADMIN_EMAILS); a 403 means not you.
  const overview = useSWR<AdminOverview>(AuthService.isLoggedIn() ? "admin-overview" : null, AdminService.overview, {
    onSuccess: () => setAccess("ok"),
    onError: (error) => setAccess(error instanceof ApiError && error.status === 403 ? "denied" : "ok"),
  });

  const ready = access === "ok";
  const tournaments = usePagedList<AdminTournament>(
    ready && tab === "tournaments" ? `admin-t|${tQ}|${tStatus}` : null,
    async (page) => {
      const r = await AdminService.tournaments({ page, q: tQ, status: tStatus });
      return { items: r.tournaments, total: r.pagination.total, hasMore: r.pagination.hasMore };
    },
  );
  const players = usePagedList<AdminPlayer>(ready && tab === "players" ? `admin-p|${pQ}|${pType}` : null, async (page) => {
    const r = await AdminService.players({ page, q: pQ, type: pType });
    return { items: r.players, total: r.pagination.total, hasMore: r.pagination.hasMore };
  });
  const matches = usePagedList<AdminMatch>(
    ready && tab === "matches" ? `admin-m|${mKind}|${mQ}|${mStatus}` : null,
    async (page) => {
      const r = await AdminService.matches({ page, kind: mKind, q: mQ, status: mStatus });
      return { items: r.matches, total: r.pagination.total, hasMore: r.pagination.hasMore };
    },
  );

  const runConfirm = async () => {
    if (!confirm) return;
    setWorking(true);
    try {
      const message = await confirm.run();
      setToast({ message, severity: "success" });
      overview.mutate();
      setConfirm(null);
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : "Something went wrong.", severity: "error" });
    } finally {
      setWorking(false);
    }
  };

  const o = overview.data;

  const renderOverview = () =>
    !o ? (
      <Stack alignItems="center" sx={{ py: 4 }}><AppSpinner /></Stack>
    ) : (
      <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" } }}>
        <StatCard label="Accounts" value={o.users.total} detail={`+${num(o.users.newThisWeek)} this week`} />
        <StatCard label="Registered players" value={o.players.registered} detail={`${num(o.players.records)} organizer-made records`} />
        <StatCard
          label="Tournaments"
          value={o.tournaments.total}
          detail={`${num(o.tournaments.byStatus.active)} active · ${num(o.tournaments.byStatus.draft)} draft · +${num(o.tournaments.newThisWeek)} this week`}
        />
        <StatCard label="Connected now" value={o.connectedNow} detail="Open app sessions" />
        <StatCard
          label="Tournament matches"
          value={o.matches.tournament.total}
          detail={`${num(o.matches.tournament.byStatus.in_progress)} in progress · ${num(o.matches.tournament.byStatus.completed)} completed`}
        />
        <StatCard
          label="Friendly matches"
          value={o.matches.friendly.total}
          detail={`${num(o.matches.friendly.byStatus.completed)} completed (saved by logged-in scorers)`}
        />
        <StatCard label="Matches this week" value={o.matches.newThisWeek} />
        <StatCard label="Suspended players" value={o.players.suspended} />
      </Box>
    );

  const listState = (l: { loading: boolean; error?: Error; items: unknown[] }, empty: string) =>
    l.loading ? (
      <Stack alignItems="center" sx={{ py: 4 }}><AppSpinner /></Stack>
    ) : l.error ? (
      <Alert severity="error" sx={{ borderRadius: 2 }}>{l.error.message}</Alert>
    ) : l.items.length === 0 ? (
      <Alert severity="info" sx={{ borderRadius: 2 }}>{empty}</Alert>
    ) : null;

  const renderTournaments = () => (
    <>
      <Toolbar
        search={tSearch}
        onSearch={setTSearch}
        placeholder="Search name, place, organizer name, email or phone"
        filters={[
          { id: "all", label: "All" },
          { id: "active", label: "Active" },
          { id: "draft", label: "Draft" },
          { id: "completed", label: "Completed" },
        ]}
        filter={tStatus}
        onFilter={setTStatus}
        total={tournaments.total}
      />
      {listState(tournaments, "No tournaments found.") ?? (
        <Stack spacing={1}>
          {tournaments.items.map((t) => (
            <Row
              key={t.id}
              actions={
                <Button
                  size="small"
                  startIcon={<DeleteOutlineRounded />}
                  sx={dangerSx}
                  onClick={() =>
                    setConfirm({
                      title: `Delete “${t.name}”?`,
                      body: `This permanently deletes the tournament with its ${t.teamsCount} team(s) and ${Object.values(t.matches).reduce((a, b) => a + b, 0)} match(es). The organizer loses it too. This can't be undone.`,
                      action: "Delete tournament",
                      run: async () => {
                        const r = await AdminService.deleteTournament(t.id);
                        tournaments.refresh();
                        return `Deleted “${t.name}” (${r.teams} teams, ${r.matches} matches).`;
                      },
                    })
                  }
                >
                  Delete
                </Button>
              }
            >
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Avatar
                  variant="rounded"
                  src={t.logoUrl ? resolveApiMediaUrl(t.logoUrl) : undefined}
                  sx={{ width: 40, height: 40, borderRadius: 2, fontWeight: 900, background: t.logoUrl ? "#fff" : getTeamAvatarGradient(t.id) }}
                >
                  {t.name.slice(0, 1).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                    <Typography sx={{ fontWeight: 900, color: NAVY }}>{t.name}</Typography>
                    <StatusChip status={t.status} />
                  </Stack>
                  <Typography sx={{ fontSize: 13, color: MUTED, fontWeight: 600 }}>
                    {[t.location, `${t.teamsCount} teams`, `${num(t.matches.completed)} played`, t.matches.in_progress ? `${t.matches.in_progress} live` : "", `${t.oversPerMatch} overs`, `created ${fmtDate(t.createdAt)}`]
                      .filter(Boolean)
                      .join(" · ")}
                  </Typography>
                </Box>
              </Stack>
              <ContactLine label="Organizer" contact={t.organizer} />
            </Row>
          ))}
          <LoadMore show={tournaments.hasMore} loading={tournaments.loadingMore} onClick={tournaments.loadMore} />
        </Stack>
      )}
    </>
  );

  const renderPlayers = () => (
    <>
      <Toolbar
        search={pSearch}
        onSearch={setPSearch}
        placeholder="Search name, @username, city, email or phone"
        filters={[
          { id: "all", label: "All" },
          { id: "registered", label: "Registered" },
          { id: "records", label: "Organizer-made" },
          { id: "suspended", label: "Suspended" },
        ]}
        filter={pType}
        onFilter={setPType}
        total={players.total}
      />
      {listState(players, "No players found.") ?? (
        <Stack spacing={1}>
          {players.items.map((p) => (
            <Row
              key={p.id}
              muted={p.suspended}
              actions={
                <>
                  {p.registered && p.visibility !== "hidden" && (
                    <Button size="small" startIcon={<VisibilityOutlined />} sx={actionSx} onClick={() => navigate(`/u/${p.username}`)}>
                      Profile
                    </Button>
                  )}
                  <Button
                    size="small"
                    startIcon={p.suspended ? <LockOpenRounded /> : <BlockRounded />}
                    sx={p.suspended ? actionSx : dangerSx}
                    onClick={() =>
                      setConfirm({
                        title: p.suspended ? `Lift the suspension on ${p.name}?` : `Suspend ${p.name}?`,
                        body: p.suspended
                          ? "Their profile goes back to how it was before (public or private) and shows up in searches again."
                          : "Their profile is hidden from search, public pages and organizers, and they can't make it public again until you lift it. Their account and match history are kept.",
                        action: p.suspended ? "Lift suspension" : "Suspend player",
                        run: async () => {
                          await AdminService.setSuspended(p.id, !p.suspended);
                          players.refresh();
                          return p.suspended ? `${p.name} is no longer suspended.` : `${p.name} is suspended.`;
                        },
                      })
                    }
                  >
                    {p.suspended ? "Unsuspend" : "Suspend"}
                  </Button>
                </>
              }
            >
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Avatar src={p.avatarUrl ? resolveApiMediaUrl(p.avatarUrl) : undefined} sx={{ width: 40, height: 40, fontWeight: 900, background: getTeamAvatarGradient(p.id) }}>
                  {p.name.slice(0, 1).toUpperCase()}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                    <Typography sx={{ fontWeight: 900, color: NAVY }}>{p.name}</Typography>
                    <Typography sx={{ fontSize: 13, color: MUTED, fontWeight: 700 }}>@{p.username}</Typography>
                    {p.suspended ? (
                      <Chip size="small" label="Suspended" sx={{ fontWeight: 800, bgcolor: "rgba(224,70,60,0.12)", color: "#c0352c" }} />
                    ) : p.registered ? (
                      <Chip size="small" label="Registered" sx={{ fontWeight: 800, bgcolor: "rgba(11,127,97,0.12)", color: "#0b7f61" }} />
                    ) : (
                      <Chip size="small" label="Organizer-made" sx={{ fontWeight: 800, bgcolor: "rgba(12,53,88,0.08)", color: MUTED }} />
                    )}
                    {!p.suspended && p.visibility === "hidden" && <Chip size="small" label="Private" sx={{ fontWeight: 800 }} />}
                  </Stack>
                  <Typography sx={{ fontSize: 13, color: MUTED, fontWeight: 600 }}>
                    {[p.role, p.city, `joined ${fmtDate(p.createdAt)}`].filter(Boolean).join(" · ")}
                  </Typography>
                </Box>
              </Stack>
              {p.registered ? (
                <ContactLine label="Account" contact={p.account} extraPhone={p.contactNumber} />
              ) : (
                <>
                  {p.contactNumber && <ContactLine label="Player phone" contact={{ id: "", name: p.name, email: "", phone: p.contactNumber }} />}
                  <ContactLine label="Added by" contact={p.createdBy} />
                </>
              )}
            </Row>
          ))}
          <LoadMore show={players.hasMore} loading={players.loadingMore} onClick={players.loadMore} />
        </Stack>
      )}
    </>
  );

  const renderMatches = () => (
    <>
      <Toolbar
        search={mSearch}
        onSearch={setMSearch}
        placeholder={mKind === "tournament" ? "Search team, tournament or watch code" : "Search team, result or scorer email/phone"}
        filters={[
          { id: "all", label: "All" },
          { id: "in_progress", label: "In progress" },
          { id: "completed", label: "Completed" },
        ]}
        filter={mStatus}
        onFilter={setMStatus}
        total={matches.total}
        extra={
          <Stack direction="row" spacing={0.5} sx={{ p: 0.4, borderRadius: 99, background: "rgba(12,53,88,0.07)", flex: "none" }}>
            {(["tournament", "friendly"] as const).map((k) => (
              <Button
                key={k}
                size="small"
                onClick={() => setMKind(k)}
                sx={{
                  borderRadius: 99,
                  px: 1.75,
                  fontWeight: 900,
                  textTransform: "none",
                  color: mKind === k ? NAVY : MUTED,
                  background: mKind === k ? "#fff" : "transparent",
                  boxShadow: mKind === k ? "0 2px 6px rgba(12,53,88,0.15)" : "none",
                  "&:hover": { background: mKind === k ? "#fff" : "rgba(12,53,88,0.06)" },
                }}
              >
                {k === "tournament" ? "Tournament" : "Friendly"}
              </Button>
            ))}
          </Stack>
        }
      />
      {listState(matches, "No matches found.") ?? (
        <Stack spacing={1}>
          {matches.items.map((m) => (
            <Row
              key={m.id}
              actions={
                <>
                  {m.liveCode && (
                    <Button size="small" startIcon={<VisibilityOutlined />} sx={actionSx} onClick={() => navigate(`/join-game/${m.liveCode}`)}>
                      Watch
                    </Button>
                  )}
                  <Button
                    size="small"
                    startIcon={<DeleteOutlineRounded />}
                    sx={dangerSx}
                    onClick={() =>
                      setConfirm({
                        title: `Delete ${m.title}?`,
                        body:
                          m.kind === "tournament"
                            ? `This permanently deletes the match from “${m.tournamentName}”. If it was completed, the points table and team stats are recalculated without it. This can't be undone.`
                            : "This permanently deletes the saved match from the scorer's history. This can't be undone.",
                        action: "Delete match",
                        run: async () => {
                          await AdminService.deleteMatch(m.kind, m.id);
                          matches.refresh();
                          return `Deleted ${m.title}.`;
                        },
                      })
                    }
                  >
                    Delete
                  </Button>
                </>
              }
            >
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Typography sx={{ fontWeight: 900, color: NAVY }}>{m.title}</Typography>
                <StatusChip status={m.status} />
                {m.liveCode && <Chip size="small" label={m.liveCode} sx={{ fontWeight: 800, fontFamily: "monospace" }} />}
              </Stack>
              <Typography sx={{ fontSize: 13, color: MUTED, fontWeight: 600 }}>
                {[m.tournamentName, m.resultText, `updated ${fmtDate(m.updatedAt)}`].filter(Boolean).join(" · ")}
              </Typography>
              <ContactLine label="Scorer" contact={m.scorer} />
            </Row>
          ))}
          <LoadMore show={matches.hasMore} loading={matches.loadingMore} onClick={matches.loadMore} />
        </Stack>
      )}
    </>
  );

  return (
    <>
      <MetaHelmet pageTitle="Platform data" canonical={location.pathname} description="Admin view of tournaments, players and matches." robots="noindex,nofollow" />
      <AppBar showHomeMenuItem />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          px: { xs: 1.25, sm: 2.5 },
          py: { xs: 2, sm: 3 },
          background: "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))",
        }}
      >
        <Paper elevation={0} sx={{ width: "100%", maxWidth: 1040, borderRadius: 4, p: { xs: 1.75, sm: 3 }, background: "#f6f9fb", alignSelf: "flex-start" }}>
          <Typography component="h1" sx={{ fontWeight: 900, color: NAVY, fontSize: { xs: 22, sm: 26 } }}>
            Platform data
          </Typography>
          <Typography sx={{ color: MUTED, fontWeight: 600, fontSize: 14, mb: 1.5 }}>
            Every tournament, player and match on Cricket Score Counter. Admin only.
          </Typography>

          {access === "checking" ? (
            <Stack alignItems="center" sx={{ py: 5 }}><AppSpinner /></Stack>
          ) : access === "denied" ? (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              This page is only for platform admins. Ask for your email to be added to ADMIN_EMAILS on the server.
            </Alert>
          ) : (
            <>
              <Tabs
                value={tab}
                onChange={(_e, v: TabId) => setTab(v)}
                variant="scrollable"
                allowScrollButtonsMobile
                sx={{ mb: 2, borderBottom: "1px solid rgba(12,53,88,0.12)", "& .MuiTab-root": { fontWeight: 900, textTransform: "none", fontSize: 15 } }}
              >
                <Tab value="overview" label="Overview" />
                <Tab value="tournaments" label={`Tournaments${o ? ` (${num(o.tournaments.total)})` : ""}`} />
                <Tab value="players" label={`Players${o ? ` (${num(o.players.registered + o.players.records)})` : ""}`} />
                <Tab value="matches" label={`Matches${o ? ` (${num(o.matches.tournament.total + o.matches.friendly.total)})` : ""}`} />
              </Tabs>
              {tab === "overview" && renderOverview()}
              {tab === "tournaments" && renderTournaments()}
              {tab === "players" && renderPlayers()}
              {tab === "matches" && renderMatches()}
            </>
          )}
        </Paper>
      </Box>

      <Dialog open={Boolean(confirm)} onClose={() => !working && setConfirm(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, color: NAVY }}>{confirm?.title}</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: MUTED }}>{confirm?.body}</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirm(null)} disabled={working} sx={{ ...actionSx, color: MUTED }}>
            Cancel
          </Button>
          {/* Not "contained": global.css paints every contained dialog button
              with the accent gradient, and this one must read as destructive. */}
          <Button
            disabled={working}
            onClick={runConfirm}
            sx={{
              fontWeight: 900,
              textTransform: "none",
              borderRadius: 2,
              px: 2.25,
              color: "#fff",
              backgroundColor: "#c0352c",
              "&:hover": { backgroundColor: "#a52a22" },
              "&.Mui-disabled": { opacity: 0.6 },
            }}
          >
            {working ? "Working…" : confirm?.action}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={Boolean(toast)} autoHideDuration={3500} onClose={() => setToast(null)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity={toast?.severity ?? "success"} variant="filled" onClose={() => setToast(null)} sx={{ fontWeight: 800 }}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminDataPage;
