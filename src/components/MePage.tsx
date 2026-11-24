import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Alert,
  Badge,
  Box,
  Button,
  Chip,
  Dialog,
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
  EditRounded,
  IosShareRounded,
  InsightsRounded,
  SearchRounded,
  VisibilityOffRounded,
} from "@mui/icons-material";
import AppBar from "./AppBar";
import AppSpinner from "./AppSpinner";
import ConfirmDialog from "./ConfirmDialog";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";
import AuthService from "../services/AuthService";
import PlayerAccountService, {
  type ClaimRequest,
  type ClaimSearchResult,
  type MyPlayer,
  type MyTournament,
  type PlayerProfileInput,
} from "../services/PlayerAccountService";
import { APP_URL } from "../utils/constant";
import PlayerAvatar from "./player/PlayerAvatar";
import PlayerProfileForm from "./player/PlayerProfileForm";
import ShareLinkModal from "../modals/ShareLinkModal";
import { primaryButtonSx } from "./player/buttonStyles";
import { startAs } from "../utils/playerOnboarding";

type TabKey = "tournaments" | "records" | "requests";

const sectionSx = {
  p: { xs: 1.75, sm: 2.5 },
  borderRadius: 3,
  border: "1px solid rgba(12,53,88,0.12)",
  background: "#fff",
  boxShadow: "0 10px 30px rgba(8, 26, 56, 0.06)",
} as const;

const statusChip = (status: ClaimRequest["status"]) => {
  const map = {
    pending: { label: "Waiting for organizer", color: "#6b4a00", bg: "#fff0c2" },
    approved: { label: "Linked", color: "#0d6b3d", bg: "#dcf5e7" },
    rejected: { label: "Declined", color: "#8a1c1c", bg: "#fde3e3" },
    cancelled: { label: "Cancelled", color: "#4a5560", bg: "#edf1f4" },
  } as const;
  const m = map[status];
  return <Chip size="small" label={m.label} sx={{ fontWeight: 800, color: m.color, background: m.bg }} />;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

/**
 * Copies the profile link (just the URL, no message) to the clipboard.
 * Returns "copied", or the URL itself if the clipboard isn't available so
 * the caller can show it for manual copying.
 */
export const shareProfileLink = async (username: string) => {
  const url = `${APP_URL}/u/${username}`;
  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = url;
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(area);
      if (ok) return "copied";
    } catch {
      /* show the link instead */
    }
    return url;
  }
};

// ---------------------------------------------------------------- tabs

const MyTournamentsTab: React.FC<{ onNotice: (m: string) => void }> = ({ onNotice }) => {
  const navigate = useNavigate();
  const [list, setList] = React.useState<MyTournament[] | null>(null);
  const [leaving, setLeaving] = React.useState<MyTournament | null>(null);
  const load = React.useCallback(() => {
    PlayerAccountService.myTournaments().then((r) => setList(r.tournaments)).catch(() => setList([]));
  }, []);
  React.useEffect(load, [load]);

  if (!list) return <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}><AppSpinner /></Box>;
  if (!list.length)
    return (
      <Alert severity="info" sx={{ borderRadius: 2 }}>
        You're not in any tournament squad yet. When an organizer adds you, it shows up here and you'll get a notification.
      </Alert>
    );

  return (
    <Stack spacing={1.5}>
      {list.map((t) => {
        const live = t.matches.filter((m) => m.status !== "completed");
        const done = t.matches.filter((m) => m.status === "completed");
        const wins = done.filter((m) => m.outcome === "won").length;
        return (
          <Paper key={`${t.tournamentId}-${t.teamId}`} elevation={0} sx={sectionSx}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.25 }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  onClick={() => navigate(`/tournaments/${t.tournamentId}`)}
                  sx={{ fontWeight: 900, color: "#0c3558", fontSize: 17, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                >
                  {t.name}
                </Typography>
                <Typography sx={{ color: "#6b7785", fontSize: 13, fontWeight: 600 }}>
                  {t.teamName}
                  {t.organizerName ? ` · by ${t.organizerName}` : ""} · {t.status}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontWeight: 900, color: "#0c3558", fontSize: 20, lineHeight: 1 }}>
                  {wins}–{done.length - wins}
                </Typography>
                <Typography sx={{ fontSize: 11, color: "#6b7785", fontWeight: 800 }}>W–L</Typography>
              </Box>
            </Stack>
            {live.length > 0 && (
              <Stack spacing={0.75} sx={{ mb: 1 }}>
                {live.map((m) => (
                  <Stack key={m.id} direction="row" spacing={1} alignItems="center">
                    <Chip size="small" label={m.status === "in_progress" ? "Live" : "Scheduled"} color={m.status === "in_progress" ? "error" : "default"} sx={{ fontWeight: 800, height: 22 }} />
                    <Typography sx={{ fontSize: 14, fontWeight: 700 }}>vs {m.opponent}</Typography>
                  </Stack>
                ))}
              </Stack>
            )}
            {done.length > 0 && (
              <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                {done.slice(0, 6).map((m) => (
                  <Chip
                    key={m.id}
                    size="small"
                    label={`${m.outcome === "won" ? "W" : m.outcome === "lost" ? "L" : "T"} vs ${m.opponent}`}
                    sx={{
                      fontWeight: 800,
                      color: m.outcome === "won" ? "#0d6b3d" : m.outcome === "lost" ? "#8a1c1c" : "#6b4a00",
                      background: m.outcome === "won" ? "#dcf5e7" : m.outcome === "lost" ? "#fde3e3" : "#fff0c2",
                    }}
                    title={`${m.resultText} · ${formatDate(m.date)}`}
                  />
                ))}
              </Stack>
            )}
            {t.yetToPlay.length > 0 && (
              <Typography sx={{ fontSize: 13, color: "#526274" }}>
                <b>Still to play:</b> {t.yetToPlay.join(", ")}
              </Typography>
            )}
            <Button size="small" color="inherit" onClick={() => setLeaving(t)} sx={{ mt: 1, textTransform: "none", color: "#8a96a3", fontWeight: 700 }}>
              Not your squad? Leave
            </Button>
          </Paper>
        );
      })}
      <ConfirmDialog
        open={Boolean(leaving)}
        title="Leave this squad?"
        content={leaving ? `You'll be unlinked from ${leaving.teamName} in ${leaving.name}, and the organizer will be told. Your name stays on their scorecards but won't count in your stats.` : ""}
        confirmText="Leave squad"
        onClose={() => setLeaving(null)}
        onConfirm={async () => {
          const t = leaving;
          setLeaving(null);
          if (!t) return;
          try {
            await PlayerAccountService.leaveTeam(t.teamId);
            onNotice(`You left ${t.teamName}.`);
            load();
          } catch (e) {
            onNotice(e instanceof Error ? e.message : "Couldn't leave the squad.");
          }
        }}
      />
    </Stack>
  );
};

const FindRecordsTab: React.FC<{ me: MyPlayer; onNotice: (m: string) => void }> = ({ me, onNotice }) => {
  const [q, setQ] = React.useState(me.name.split(" ")[0] ?? "");
  const [results, setResults] = React.useState<ClaimSearchResult[] | null>(null);
  const [claims, setClaims] = React.useState<ClaimRequest[]>([]);
  const [busy, setBusy] = React.useState("");

  const loadClaims = React.useCallback(() => {
    PlayerAccountService.myClaims().then((r) => setClaims(r.claims)).catch(() => undefined);
  }, []);
  React.useEffect(loadClaims, [loadClaims]);

  React.useEffect(() => {
    if (q.trim().length < 2) {
      setResults(null);
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(() => {
      PlayerAccountService.searchUnclaimed(q.trim())
        .then((r) => !cancelled && setResults(r.players))
        .catch(() => !cancelled && setResults([]));
    }, 300);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [q]);

  const pendingIds = new Set(claims.filter((c) => c.status === "pending").map((c) => c.record?.id));

  const claim = async (r: ClaimSearchResult) => {
    setBusy(r.id);
    try {
      const res = await PlayerAccountService.claim(r.id);
      onNotice(res.claim.status === "approved" ? `"${r.name}" is now linked to you.` : `Request sent to ${r.addedBy || "the organizer"}.`);
      loadClaims();
      setResults((list) => (res.claim.status === "approved" ? list?.filter((x) => x.id !== r.id) ?? null : list));
    } catch (e) {
      onNotice(e instanceof Error ? e.message : "Couldn't send the request.");
    } finally {
      setBusy("");
    }
  };

  return (
    <Stack spacing={2}>
      <Paper elevation={0} sx={sectionSx}>
        <Typography sx={{ fontWeight: 900, color: "#0c3558", fontSize: 17 }}>Find your past match records</Typography>
        <Typography sx={{ color: "#526274", fontSize: 14, mt: 0.5, mb: 1.5 }}>
          Organizers may have added you to teams before you signed up. Find those records and ask to link them, and their match stats join your profile once the organizer confirms.
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by the name organizers used for you"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded /></InputAdornment> }}
        />
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          {results === null ? null : results.length === 0 ? (
            <Typography sx={{ color: "#6b7785", fontSize: 14, py: 1 }}>No unlinked records match "{q}".</Typography>
          ) : (
            results.map((r) => (
              <Stack key={r.id} direction="row" spacing={1.5} alignItems="center" sx={{ p: 1.25, borderRadius: 2, border: "1px solid #edf1f4" }}>
                <PlayerAvatar name={r.name} size={38} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 800, color: "#0c3558" }}>{r.name}</Typography>
                  <Typography sx={{ fontSize: 12.5, color: "#6b7785", fontWeight: 600 }}>
                    {r.addedBy ? `Added by ${r.addedBy}` : "Added by an organizer"}
                    {r.teams.length ? ` · ${r.teams.join(", ")}` : ""}
                  </Typography>
                </Box>
                {pendingIds.has(r.id) ? (
                  <Chip size="small" label="Requested" sx={{ fontWeight: 800 }} />
                ) : (
                  <Button size="small" variant="contained" disabled={busy === r.id} onClick={() => claim(r)} sx={{ ...primaryButtonSx, whiteSpace: "nowrap" }}>
                    This is me
                  </Button>
                )}
              </Stack>
            ))
          )}
        </Stack>
      </Paper>
      {claims.length > 0 && (
        <Paper elevation={0} sx={sectionSx}>
          <Typography sx={{ fontWeight: 900, color: "#0c3558", mb: 1 }}>Your requests</Typography>
          <Stack spacing={1}>
            {claims.map((c) => (
              <Stack key={c.id} direction="row" spacing={1.25} alignItems="center">
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 14 }}>{c.record?.name ?? "Player record"}</Typography>
                  <Typography sx={{ fontSize: 12.5, color: "#6b7785" }}>Asked {c.approverName || "the organizer"} · {formatDate(c.createdAt)}</Typography>
                </Box>
                {statusChip(c.status)}
                {c.status === "pending" && (
                  <Button
                    size="small"
                    color="inherit"
                    onClick={() => PlayerAccountService.decideClaim(c.id, "cancel").then(loadClaims).catch(() => undefined)}
                    sx={{ textTransform: "none", color: "#8a96a3" }}
                  >
                    Cancel
                  </Button>
                )}
              </Stack>
            ))}
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};

const RequestsTab: React.FC<{ claims: ClaimRequest[] | null; reload: () => void; onNotice: (m: string) => void }> = ({ claims, reload, onNotice }) => {
  if (!claims) return <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}><AppSpinner /></Box>;
  if (!claims.length)
    return <Alert severity="info" sx={{ borderRadius: 2 }}>No requests. When a player says a record you created is them, you'll confirm it here.</Alert>;
  const decide = async (c: ClaimRequest, d: "approve" | "reject") => {
    try {
      await PlayerAccountService.decideClaim(c.id, d);
      onNotice(d === "approve" ? `Linked ${c.record?.name} to @${c.requester?.username}.` : "Request declined.");
      reload();
    } catch (e) {
      onNotice(e instanceof Error ? e.message : "Couldn't update the request.");
    }
  };
  return (
    <Stack spacing={1.25}>
      {claims.map((c) => (
        <Paper key={c.id} elevation={0} sx={sectionSx}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
              <PlayerAvatar name={c.requester?.name ?? "?"} avatarUrl={c.requester?.avatarUrl} size={44} />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 800, color: "#0c3558" }}>
                  {c.requester?.name} <span style={{ color: "#6b7785", fontWeight: 600 }}>@{c.requester?.username}</span>
                </Typography>
                <Typography sx={{ fontSize: 13.5, color: "#334" }}>
                  says your player record <b>"{c.record?.name}"</b> is them
                  {c.requester?.city ? ` · ${c.requester.city}` : ""}
                </Typography>
                {c.message && <Typography sx={{ fontSize: 13, color: "#526274", fontStyle: "italic", mt: 0.25 }}>"{c.message}"</Typography>}
              </Box>
            </Stack>
            {c.status === "pending" ? (
              <Stack direction="row" spacing={1}>
                <Button size="small" onClick={() => decide(c, "reject")} sx={{ textTransform: "none", fontWeight: 800 }}>
                  Not them
                </Button>
                <Button size="small" variant="contained" onClick={() => decide(c, "approve")} sx={primaryButtonSx}>
                  Yes, link stats
                </Button>
              </Stack>
            ) : (
              <Box sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}>{statusChip(c.status)}</Box>
            )}
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
};

// ---------------------------------------------------------------- page

const MePage: React.FC = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const isLoggedIn = AuthService.isLoggedIn();
  const [me, setMe] = React.useState<MyPlayer | null | undefined>(undefined);
  const [error, setError] = React.useState("");
  const [editing, setEditing] = React.useState(false);
  const [notice, setNotice] = React.useState("");
  const [shareFallbackUrl, setShareFallbackUrl] = React.useState("");
  const [incoming, setIncoming] = React.useState<ClaimRequest[] | null>(null);
  const tab = (params.get("tab") as TabKey) || "tournaments";
  const setTab = (t: TabKey) => setParams({ tab: t }, { replace: true });

  React.useEffect(() => {
    if (!isLoggedIn) return;
    PlayerAccountService.getMyPlayer()
      .then((r) => setMe(r.player))
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Couldn't load your profile.");
        setMe(null);
      });
  }, [isLoggedIn]);

  const loadIncoming = React.useCallback(() => {
    if (!isLoggedIn) return;
    PlayerAccountService.incomingClaims().then((r) => setIncoming(r.claims)).catch(() => setIncoming([]));
  }, [isLoggedIn]);
  React.useEffect(loadIncoming, [loadIncoming]);
  const pendingIncoming = (incoming ?? []).filter((c) => c.status === "pending").length;

  const save = async (input: PlayerProfileInput) => {
    const r = me ? await PlayerAccountService.update(input) : await PlayerAccountService.register(input);
    setMe(r.player);
    setEditing(false);
    setNotice(me ? "Profile updated." : "Welcome! Your player profile is ready.");
    if (!me) setTab("records");
  };

  const share = async () => {
    if (!me) return;
    const result = await shareProfileLink(me.username);
    if (result === "copied") setNotice("Profile link copied.");
    else setShareFallbackUrl(result); // clipboard blocked (e.g. some in-app browsers): show copy box
  };

  const authUserName = (AuthService.getUser() as { name?: string } | null)?.name ?? "";

  return (
    <>
      <MetaHelmet pageTitle="My player profile" description="Your cricket player profile, squads and stats." canonical="/me" robots="noindex,follow" />
      <AppBar showHomeMenuItem />
      <Box sx={{ minHeight: "100vh", bgcolor: "#eef5f7", pb: 6 }}>
        <Box sx={{ maxWidth: 900, mx: "auto", px: { xs: 1.4, md: 3 }, pt: 2 }}>
          <PageTitleWithBack titleSx={{ fontSize: { xs: "calc(24px * var(--app-font-scale, 1))", sm: "calc(32px * var(--app-font-scale, 1))" }, fontWeight: 900, color: "var(--app-accent-text, #185a9d)" }}>
            My player profile
          </PageTitleWithBack>

          {!isLoggedIn ? (
            <Paper elevation={0} sx={sectionSx}>
              <Typography sx={{ fontWeight: 900, color: "#0c3558", fontSize: 20 }}>Your player profile</Typography>
              <Typography sx={{ color: "#526274", mt: 0.5, mb: 2 }}>
                Create a free account to get a player profile: organizers can add you to squads, every match you play builds your career stats, and you get a link to share them.
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={() => startAs(navigate, "player")} sx={primaryButtonSx}>Sign up as a player</Button>
                <Button onClick={() => startAs(navigate, "player", "login")} sx={{ textTransform: "none", fontWeight: 800 }}>Log in</Button>
              </Stack>
            </Paper>
          ) : me === undefined ? (
            <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}><AppSpinner /></Box>
          ) : error ? (
            <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
          ) : me === null ? (
            <Stack spacing={2}>
              <Paper elevation={0} sx={sectionSx}>
                <Typography sx={{ fontWeight: 900, color: "#0c3558", fontSize: 20 }}>
                  {params.get("welcome") ? "Welcome! Let's set up your player profile" : "Create your player profile"}
                </Typography>
                <Typography sx={{ color: "#526274", mt: 0.5, mb: 2 }}>
                  Organizers can find you and add you to squads, every match you play adds to your stats, and you get a profile link to share.
                </Typography>
                <PlayerProfileForm defaultName={authUserName} submitLabel="Create profile" onSubmit={save} />
              </Paper>
              {incoming && incoming.length > 0 && (
                <>
                  <Typography sx={{ fontWeight: 900, color: "#0c3558" }}>Requests from players ({pendingIncoming})</Typography>
                  <RequestsTab claims={incoming} reload={loadIncoming} onNotice={setNotice} />
                </>
              )}
            </Stack>
          ) : (
            <Stack spacing={2}>
              <Paper
                elevation={0}
                sx={{
                  ...sectionSx,
                  border: "none",
                  color: "#fff",
                  background: "linear-gradient(135deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                }}
              >
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "flex-start", sm: "center" }}>
                  <PlayerAvatar name={me.name} avatarUrl={me.avatarUrl} size={84} ring />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: "calc(26px * var(--app-font-scale, 1))", fontWeight: 900, lineHeight: 1.1 }}>{me.name}</Typography>
                    <Typography sx={{ opacity: 0.9, fontWeight: 700 }}>
                      @{me.username}
                      {me.city ? ` · ${me.city}` : ""}
                    </Typography>
                    <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                      {[me.role, me.battingStyle, me.bowlingStyle].filter(Boolean).map((x) => (
                        <Chip key={x} size="small" label={x} sx={{ color: "#fff", background: "rgba(255,255,255,0.18)", fontWeight: 800 }} />
                      ))}
                      {me.visibility === "hidden" && (
                        <Chip size="small" icon={<VisibilityOffRounded sx={{ color: "#fff !important" }} />} label={me.suspended ? "Suspended by admin" : "Hidden from search"} sx={{ color: "#fff", background: "rgba(0,0,0,0.2)", fontWeight: 800 }} />
                      )}
                    </Stack>
                  </Box>
                  <Stack direction={{ xs: "row", sm: "column" }} spacing={1}>
                    <Button size="small" startIcon={<InsightsRounded />} onClick={() => navigate(`/players/${me.id}`)} sx={{ color: "#0c3558", background: "#fff", fontWeight: 900, textTransform: "none", borderRadius: 1.5, "&:hover": { background: "#eef5f7" } }}>
                      My stats
                    </Button>
                    <Button size="small" startIcon={<IosShareRounded />} onClick={share} disabled={me.visibility === "hidden"} sx={{ color: "#fff", border: "1px solid rgba(255,255,255,0.7)", fontWeight: 900, textTransform: "none", borderRadius: 1.5 }}>
                      Share
                    </Button>
                    <Button size="small" startIcon={<EditRounded />} onClick={() => setEditing(true)} sx={{ color: "#fff", fontWeight: 800, textTransform: "none" }}>
                      Edit
                    </Button>
                  </Stack>
                </Stack>
              </Paper>

              <Tabs
                value={tab}
                onChange={(_, v: TabKey) => setTab(v)}
                variant="fullWidth"
                sx={{ "& .MuiTab-root": { fontWeight: 800, textTransform: "none", minWidth: 0, px: { xs: 0.5, sm: 2 }, fontSize: { xs: 13.5, sm: 14 } } }}
              >
                <Tab value="tournaments" label="Tournaments" />
                <Tab value="records" label="Past records" />
                <Tab
                  value="requests"
                  label={
                    <Badge color="error" badgeContent={pendingIncoming} sx={{ "& .MuiBadge-badge": { right: -12 } }}>
                      Requests
                    </Badge>
                  }
                />
              </Tabs>

              {tab === "tournaments" && <MyTournamentsTab onNotice={setNotice} />}
              {tab === "records" && <FindRecordsTab me={me} onNotice={setNotice} />}
              {tab === "requests" && <RequestsTab claims={incoming} reload={loadIncoming} onNotice={setNotice} />}
            </Stack>
          )}
        </Box>
      </Box>

      <Dialog open={editing} onClose={() => setEditing(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900, color: "#0c3558" }}>Edit profile</DialogTitle>
        <DialogContent>
          {me && <PlayerProfileForm initial={me} submitLabel="Save" onSubmit={save} onCancel={() => setEditing(false)} />}
        </DialogContent>
      </Dialog>
      <Snackbar open={Boolean(notice)} autoHideDuration={4000} onClose={() => setNotice("")} message={notice} />
      <ShareLinkModal
        open={Boolean(shareFallbackUrl)}
        onClose={() => setShareFallbackUrl("")}
        shareUrl={shareFallbackUrl}
        title="Share your profile link"
      />
    </>
  );
};

export default MePage;
