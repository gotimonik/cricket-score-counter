import React from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import {
  EmojiEventsRounded,
  SportsCricketRounded,
  SportsBaseballRounded,
  BoltRounded,
  PanToolRounded,
} from "@mui/icons-material";
import AppSpinner from "../AppSpinner";
import PremiumBadge from "./PremiumBadge";
import PremiumNote from "./PremiumNote";
import PlayerStatsService, {
  type TournamentPlayerRow,
  type TournamentPlayerStatsResponse,
} from "../../services/PlayerStatsService";
import { formatOvers } from "../../utils/matchStats";
import { isPremiumFeatureUnlocked } from "../../utils/premium";
import ExploreService from "../../services/ExploreService";
import useSwipeTabs from "../../hooks/useSwipeTabs";

type View = "batting" | "bowling" | "records";

const MIN_BALLS_FOR_STRIKE_RATE = 20;
const MIN_BALLS_FOR_ECONOMY = 18;

const dash = (v: number | null | undefined, digits = 2) =>
  v === null || v === undefined ? "–" : Number(v).toFixed(digits);

const tableSx = {
  width: "100%",
  borderCollapse: "collapse",
  "& th, & td": {
    px: { xs: 0.75, sm: 1 },
    py: { xs: 0.8, sm: 0.9 },
    textAlign: "right",
    borderBottom: "1px solid #edf1f4",
    fontSize: { xs: 12.5, sm: 13.5 },
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums",
  },
  "& th": { color: "#5b6976", fontWeight: 800, fontSize: { xs: 10.5, sm: 11.5 }, textTransform: "uppercase", letterSpacing: 0.3, background: "#f6f9fb" },
  "& td:first-of-type, & th:first-of-type": {
    textAlign: "left",
    whiteSpace: "normal",
    // Keep the player name visible while swiping through columns on phones.
    position: "sticky",
    left: 0,
    zIndex: 1,
    background: "#fff",
    minWidth: { xs: 104, sm: 120 },
    maxWidth: { xs: 132, sm: 160 },
    boxShadow: "6px 0 8px -8px rgba(12,53,88,0.35)",
  },
  "& th:first-of-type": { background: "#f6f9fb" },
  "& tr:hover td:first-of-type": { background: "#f6f9fb" },
} as const;

interface Leader {
  key: string;
  title: string;
  icon: React.ReactNode;
  row?: TournamentPlayerRow;
  value: string;
  hint: string;
}

const PlayerCell: React.FC<{ row: { name: string; teamName: string } }> = ({ row }) => (
  <>
    <Typography sx={{ fontWeight: 800, color: "#0c3558", fontSize: { xs: 13, sm: 14 }, lineHeight: 1.25 }}>{row.name}</Typography>
    <Typography sx={{ color: "#6b7785", fontSize: { xs: 11, sm: 12 }, fontWeight: 600, lineHeight: 1.25 }}>{row.teamName}</Typography>
  </>
);

/** In-cell magnitude bar: value relative to the column leader. */
const ValueBar: React.FC<{ value: number; max: number }> = ({ value, max }) => (
  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.8 }}>
    <Box sx={{ width: 54, height: 6, borderRadius: 99, background: "#edf1f4", overflow: "hidden", display: { xs: "none", sm: "block" } }}>
      <Box sx={{ width: `${max > 0 ? (value / max) * 100 : 0}%`, height: "100%", borderRadius: 99, background: "var(--app-accent-end, #185a9d)" }} />
    </Box>
    <Box component="b" sx={{ minWidth: "3ch", textAlign: "right" }}>{value}</Box>
  </Box>
);

const TournamentPlayerStatsPanel: React.FC<{
  tournamentId: string;
  refreshKey?: string | number;
  /** "public" reads the login-free endpoint used by the shared tournament page. */
  source?: "organizer" | "public";
}> = ({ tournamentId, refreshKey, source = "organizer" }) => {
  const navigate = useNavigate();
  const [data, setData] = React.useState<TournamentPlayerStatsResponse | null>(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [view, setView] = React.useState<View>("batting");

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    (source === "public"
      ? ExploreService.tournamentPlayerStats(tournamentId)
      : PlayerStatsService.getTournamentPlayerStats(tournamentId)
    )
      .then((res) => !cancelled && setData(res))
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "Unable to load player stats."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [tournamentId, refreshKey, source]);

  const openPlayer = (playerId?: string) => {
    if (playerId) navigate(`/players/${playerId}`);
  };

  const advanced = isPremiumFeatureUnlocked("tournamentAdvancedStats");
  const recordsUnlocked = isPremiumFeatureUnlocked("tournamentRecords");
  const viewOrder = React.useMemo<View[]>(() => (recordsUnlocked ? ["batting", "bowling", "records"] : ["batting", "bowling"]), [recordsUnlocked]);
  const swipe = useSwipeTabs(viewOrder, view, setView);

  const played = React.useMemo(() => (data?.players ?? []).filter((p) => p.stats.matches > 0), [data]);
  const batters = React.useMemo(
    () =>
      played
        .filter((p) => p.stats.batting.innings > 0)
        .sort((a, b) => b.stats.batting.runs - a.stats.batting.runs || (b.stats.batting.strikeRate ?? 0) - (a.stats.batting.strikeRate ?? 0)),
    [played],
  );
  const bowlers = React.useMemo(
    () =>
      played
        .filter((p) => p.stats.bowling.balls > 0)
        .sort(
          (a, b) =>
            b.stats.bowling.wickets - a.stats.bowling.wickets ||
            (a.stats.bowling.economy ?? 99) - (b.stats.bowling.economy ?? 99),
        ),
    [played],
  );

  const leaders: Leader[] = React.useMemo(() => {
    const maxBy = (rows: TournamentPlayerRow[], score: (r: TournamentPlayerRow) => number) =>
      rows.reduce<TournamentPlayerRow | undefined>((best, r) => (score(r) > 0 && (!best || score(r) > score(best)) ? r : best), undefined);
    const topRuns = batters[0];
    const topWkts = bowlers[0]?.stats.bowling.wickets ? bowlers[0] : undefined;
    const topSixes = maxBy(batters, (r) => r.stats.batting.sixes);
    const srPool = batters.filter((r) => r.stats.batting.balls >= MIN_BALLS_FOR_STRIKE_RATE);
    const topSr = maxBy(srPool, (r) => r.stats.batting.strikeRate ?? 0);
    const topCatches = maxBy(played, (r) => r.stats.fielding.catches);
    return [
      { key: "runs", title: "Most runs", icon: <SportsCricketRounded />, row: topRuns, value: topRuns ? String(topRuns.stats.batting.runs) : "–", hint: topRuns ? `SR ${dash(topRuns.stats.batting.strikeRate)}` : "" },
      { key: "wkts", title: "Most wickets", icon: <SportsBaseballRounded />, row: topWkts, value: topWkts ? String(topWkts.stats.bowling.wickets) : "–", hint: topWkts ? `Econ ${dash(topWkts.stats.bowling.economy)}` : "" },
      { key: "sixes", title: "Most sixes", icon: <EmojiEventsRounded />, row: topSixes, value: topSixes ? String(topSixes.stats.batting.sixes) : "–", hint: topSixes ? `${topSixes.stats.batting.fours} fours` : "" },
      { key: "sr", title: "Best strike rate", icon: <BoltRounded />, row: topSr, value: topSr ? dash(topSr.stats.batting.strikeRate, 1) : "–", hint: topSr ? `${topSr.stats.batting.balls} balls` : `min ${MIN_BALLS_FOR_STRIKE_RATE} balls` },
      { key: "catches", title: "Most catches", icon: <PanToolRounded />, row: topCatches, value: topCatches ? String(topCatches.stats.fielding.catches) : "–", hint: topCatches ? `${topCatches.stats.fielding.runOuts} run outs` : "" },
    ];
  }, [batters, bowlers, played]);

  if (loading) {
    return (
      <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
        <AppSpinner />
      </Box>
    );
  }
  if (error || !data) return <Alert severity="error" sx={{ borderRadius: 2 }}>{error || "Unable to load player stats."}</Alert>;
  if (data.matchesCounted === 0 || played.length === 0) {
    return (
      <Alert severity="info" sx={{ borderRadius: 2 }}>
        Leaders and records appear after the first completed match scored with player names.
      </Alert>
    );
  }

  const maxRuns = batters[0]?.stats.batting.runs ?? 0;
  const maxWkts = bowlers[0]?.stats.bowling.wickets ?? 0;

  return (
    <Box {...swipe.handlers}>
      {/* Leader cards */}
      {/* Phones: one swipeable strip (Cricbuzz-style); larger screens: grid. */}
      <Box
        sx={{
          display: { xs: "flex", sm: "grid" },
          gridTemplateColumns: { sm: "repeat(3, minmax(0,1fr))", md: "repeat(5, minmax(0,1fr))" },
          gap: 1,
          mb: { xs: 1.5, sm: 2 },
          overflowX: { xs: "auto", sm: "visible" },
          scrollSnapType: { xs: "x mandatory", sm: "none" },
          mx: { xs: -1.5, sm: 0 },
          px: { xs: 1.5, sm: 0 },
          pb: { xs: 0.5, sm: 0 },
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          "& > *": { flex: { xs: "0 0 44%", sm: "initial" }, minWidth: { xs: 148, sm: 0 }, scrollSnapAlign: "start" },
        }}
      >
        {leaders.map((l) => (
          <Box
            key={l.key}
            onClick={() => openPlayer(l.row?.playerId)}
            sx={{
              p: { xs: 1.1, sm: 1.3 },
              borderRadius: 2.5,
              cursor: l.row?.playerId ? "pointer" : "default",
              border: "1px solid rgba(12,53,88,0.1)",
              background: "linear-gradient(145deg, #ffffff 0%, color-mix(in srgb, var(--app-accent-start, #43cea2) 10%, #ffffff 90%) 100%)",
              transition: "transform .15s, box-shadow .15s",
              "&:hover": l.row?.playerId ? { transform: "translateY(-2px)", boxShadow: "0 8px 18px rgba(12,53,88,0.12)" } : {},
            }}
          >
            <Stack direction="row" spacing={0.6} alignItems="center" sx={{ color: "var(--app-accent-text, #185a9d)", "& svg": { fontSize: 18 } }}>
              {l.icon}
              <Typography sx={{ fontSize: { xs: 10.5, sm: 11.5 }, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.4, whiteSpace: "nowrap" }}>{l.title}</Typography>
            </Stack>
            <Typography sx={{ fontSize: { xs: "calc(22px * var(--app-font-scale, 1))", sm: "calc(26px * var(--app-font-scale, 1))" }, fontWeight: 900, color: "#0c3558", lineHeight: 1.1, mt: 0.5 }}>{l.value}</Typography>
            <Typography sx={{ fontWeight: 800, fontSize: 13.5, color: "#1f2933", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {l.row?.name ?? "—"}
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: "#6b7785", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {l.row ? `${l.row.teamName}${l.hint ? ` · ${l.hint}` : ""}` : l.hint}
            </Typography>
          </Box>
        ))}
      </Box>

      <Tabs
        value={view}
        onChange={(_, v: View) => setView(v)}
        variant="scrollable"
        scrollButtons={false}
        sx={{ mb: 1, "& .MuiTab-root": { fontWeight: 800, textTransform: "none", minHeight: 40, minWidth: 0, px: { xs: 1.25, sm: 2 } } }}
      >
        <Tab value="batting" label="Batting" />
        <Tab value="bowling" label="Bowling" />
        {recordsUnlocked && <Tab value="records" label={<Stack direction="row" spacing={0.6} alignItems="center"><span>Records</span><PremiumBadge compact /></Stack>} />}
      </Tabs>
      {view === "records" && <PremiumNote sx={{ mb: 1.5 }} />}

      {view === "batting" && (
        <Box sx={{ overflowX: "auto" }}>
          <Box component="table" sx={tableSx}>
            <thead>
              <tr>
                <th>Batter</th><th>M</th><th>Inn</th><th>Runs</th><th>HS</th>
                {advanced && <><th>Avg</th><th>SR</th></>}
                <th>4s</th><th>6s</th>
                {advanced && <th>50s</th>}
              </tr>
            </thead>
            <tbody>
              {batters.map((r) => {
                const b = r.stats.batting;
                return (
                  <Box component="tr" key={r.playerKey} onClick={() => openPlayer(r.playerId)} sx={{ cursor: r.playerId ? "pointer" : "default", "&:hover": { background: "#f6f9fb" } }}>
                    <td><PlayerCell row={r} /></td>
                    <td>{r.stats.matches}</td>
                    <td>{b.innings}</td>
                    <td><ValueBar value={b.runs} max={maxRuns} /></td>
                    <td>{b.highest}{b.highestNotOut ? "*" : ""}</td>
                    {advanced && <><td>{dash(b.average)}</td><td>{dash(b.strikeRate)}</td></>}
                    <td>{b.fours}</td>
                    <td>{b.sixes}</td>
                    {advanced && <td>{b.fifties + b.hundreds}</td>}
                  </Box>
                );
              })}
            </tbody>
          </Box>
        </Box>
      )}

      {view === "bowling" && (
        <Box sx={{ overflowX: "auto" }}>
          <Box component="table" sx={tableSx}>
            <thead>
              <tr>
                <th>Bowler</th><th>M</th><th>Overs</th><th>Wkts</th><th>Best</th>
                {advanced && <><th>Econ</th><th>Avg</th><th>Dots</th></>}
              </tr>
            </thead>
            <tbody>
              {bowlers.map((r) => {
                const w = r.stats.bowling;
                return (
                  <Box component="tr" key={r.playerKey} onClick={() => openPlayer(r.playerId)} sx={{ cursor: r.playerId ? "pointer" : "default", "&:hover": { background: "#f6f9fb" } }}>
                    <td><PlayerCell row={r} /></td>
                    <td>{r.stats.matches}</td>
                    <td>{formatOvers(w.balls)}</td>
                    <td><ValueBar value={w.wickets} max={maxWkts} /></td>
                    <td>{w.bestWickets}/{w.bestRuns}</td>
                    {advanced && (
                      <>
                        <td title={w.balls < MIN_BALLS_FOR_ECONOMY ? "Small sample" : undefined}>{dash(w.economy)}</td>
                        <td>{dash(w.average)}</td>
                        <td>{w.dots}</td>
                      </>
                    )}
                  </Box>
                );
              })}
            </tbody>
          </Box>
        </Box>
      )}

      {view === "records" && recordsUnlocked && (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0,1fr))" }, gap: 2 }}>
          <RecordList
            title="Highest scores"
            rows={data.records.topInnings.map((r) => ({
              key: `${r.matchId}-${r.playerKey}`,
              primary: r.name,
              secondary: `${r.teamName} vs ${r.opponent}`,
              value: `${r.runs}${r.notOut ? "*" : ""}`,
              detail: `${r.balls} balls · ${r.fours}×4 ${r.sixes}×6`,
              onClick: r.playerId ? () => openPlayer(r.playerId) : undefined,
            }))}
          />
          <RecordList
            title="Best bowling"
            rows={data.records.bestBowling.map((r) => ({
              key: `${r.matchId}-${r.playerKey}`,
              primary: r.name,
              secondary: `${r.teamName} vs ${r.opponent}`,
              value: `${r.wickets}/${r.runs}`,
              detail: `${formatOvers(r.balls)} overs`,
              onClick: r.playerId ? () => openPlayer(r.playerId) : undefined,
            }))}
          />
          <RecordList
            title="Highest partnerships"
            rows={data.records.partnerships.map((r, i) => ({
              key: `${r.matchId}-${r.wicket}-${i}`,
              primary: `${r.batter1} & ${r.batter2}`,
              secondary: `${r.teamName} vs ${r.opponent}`,
              value: `${r.runs}${r.unbroken ? "*" : ""}`,
              detail: `${r.balls} balls · ${r.batter1Runs} + ${r.batter2Runs}${r.extras ? ` + ${r.extras} extras` : ""}`,
            }))}
          />
        </Box>
      )}
    </Box>
  );
};

const RecordList: React.FC<{
  title: string;
  rows: Array<{ key: string; primary: string; secondary: string; value: string; detail: string; onClick?: () => void }>;
}> = ({ title, rows }) => (
  <Box sx={{ border: "1px solid rgba(12,53,88,0.1)", borderRadius: 2.5, p: 1.5, background: "#fff" }}>
    <Typography sx={{ fontWeight: 900, color: "#0c3558", mb: 1 }}>{title}</Typography>
    {rows.length === 0 ? (
      <Typography sx={{ color: "#6b7785", fontSize: 13 }}>Nothing yet.</Typography>
    ) : (
      <Stack spacing={1}>
        {rows.slice(0, 5).map((r, i) => (
          <Stack
            key={r.key}
            direction="row"
            spacing={1}
            alignItems="center"
            onClick={r.onClick}
            sx={{ cursor: r.onClick ? "pointer" : "default", borderRadius: 1.5, p: 0.5, "&:hover": r.onClick ? { background: "#f6f9fb" } : {} }}
          >
            <Box sx={{ width: 22, height: 22, borderRadius: "50%", flex: "none", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 900, color: i === 0 ? "#6b4a00" : "#4a5560", background: i === 0 ? "#ffe39a" : "#edf1f4" }}>
              {i + 1}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 13.5, color: "#1f2933", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.primary}</Typography>
              <Typography sx={{ fontSize: 11.5, color: "#6b7785", fontWeight: 600 }}>{r.secondary} · {r.detail}</Typography>
            </Box>
            <Typography sx={{ fontWeight: 900, color: "#0c3558", fontSize: 17 }}>{r.value}</Typography>
          </Stack>
        ))}
      </Stack>
    )}
  </Box>
);

export default TournamentPlayerStatsPanel;
