import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Button, Chip, Paper, Snackbar, Stack, Typography } from "@mui/material";
import { InsightsRounded, IosShareRounded, SportsCricketRounded } from "@mui/icons-material";
import AppSpinner from "./AppSpinner";
import BackToListButton from "./BackToListButton";
import MetaHelmet from "./MetaHelmet";
import PlayerAccountService, { type PublicProfileResponse } from "../services/PlayerAccountService";
import { formatOvers } from "../utils/matchStats";
import ProfileHero from "./profile/ProfileHero";
import ShareSheet from "./share/ShareSheet";
import { playerCardFromCareer } from "../utils/shareCards";
import { resolveApiMediaUrl } from "../utils/mediaUrl";
import { APP_URL } from "../utils/constant";
import { startAs } from "../utils/playerOnboarding";

const dash = (v: number | null | undefined, digits = 2) => (v === null || v === undefined ? "–" : Number(v).toFixed(digits));

/**
 * Public, login-free stats card a player shares (e.g. on WhatsApp):
 * /u/:username. Only exists for profiles that aren't hidden.
 */
const PublicPlayerPage: React.FC = () => {
  const { username = "" } = useParams();
  const navigate = useNavigate();
  const [data, setData] = React.useState<PublicProfileResponse | null>(null);
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");
  const [shareOpen, setShareOpen] = React.useState(false);

  React.useEffect(() => {
    PlayerAccountService.publicProfile(username)
      .then(setData)
      .catch(() => setError("This player profile doesn't exist or is private."));
  }, [username]);

  const s = data?.overall;
  const tiles = s
    ? [
        { label: "Matches", value: s.matches },
        { label: "Runs", value: s.batting.runs },
        { label: "Highest", value: s.batting.innings ? `${s.batting.highest}${s.batting.highestNotOut ? "*" : ""}` : "–" },
        { label: "Strike rate", value: dash(s.batting.strikeRate) },
        { label: "Wickets", value: s.bowling.wickets },
        { label: "Best", value: s.bowling.innings ? `${s.bowling.bestWickets}/${s.bowling.bestRuns}` : "–" },
        { label: "Economy", value: dash(s.bowling.economy) },
        { label: "Catches", value: s.fielding.catches },
      ]
    : [];

  return (
    <>
      <MetaHelmet
        pageTitle={data ? `${data.player.name} (@${data.player.username}) – Cricket stats` : "Player stats"}
        description={data && s ? `${data.player.name}: ${s.matches} matches, ${s.batting.runs} runs, ${s.bowling.wickets} wickets.` : "Cricket player stats"}
        canonical={`/u/${username}`}
        robots="noindex,follow"
      />
      <Box sx={{ flex: "1 0 auto", background: "radial-gradient(120% 80% at 50% 0%, #1d4a3c 0%, #0c2019 55%, #06110d 100%)", py: { xs: 2, sm: 5 }, px: 1.5 }}>
        <Box sx={{ maxWidth: 560, mx: "auto" }}>
          <BackToListButton sx={{ mb: 1.5 }} />
          {error ? (
            <Alert severity="info">{error}</Alert>
          ) : !data || !s ? (
            <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}><AppSpinner /></Box>
          ) : (
            <Stack spacing={1.5}>
            <ProfileHero
              player={data.player}
              stats={tiles.filter((t) => ["Matches", "Runs", "Wickets", "Highest"].includes(t.label))}
            />
            <Paper elevation={0} sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "1px", background: "#e6ecf1" }}>
                {tiles
                  .filter((t) => ["Strike rate", "Best", "Economy", "Catches"].includes(t.label))
                  .map((t) => (
                    <Box key={t.label} sx={{ background: "#f8fbfc", py: 1.5, px: 0.25, textAlign: "center", minWidth: 0 }}>
                      <Typography sx={{ fontSize: "clamp(17px, 5vw, 22px)", fontWeight: 800, color: "#0c3558", lineHeight: 1.1, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{t.value}</Typography>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#6b7785", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.label}</Typography>
                    </Box>
                  ))}
              </Box>
              <Box sx={{ p: 2.5, background: "#fff" }}>
                {data.recentMatches.length > 0 && (
                  <>
                    <Typography sx={{ fontWeight: 900, color: "#0c3558", mb: 1 }}>Recent matches</Typography>
                    <Stack spacing={0.75} sx={{ mb: 2 }}>
                      {data.recentMatches.map((m, i) => (
                        <Stack key={i} direction="row" spacing={1} alignItems="center" sx={{ fontSize: 13.5, py: 0.25 }}>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>vs {m.opponent}</Box>
                            <Box sx={{ color: "#8a96a3", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.tournamentName || "Friendly"}</Box>
                          </Box>
                          <Box sx={{ textAlign: "right", whiteSpace: "nowrap", flex: "none", lineHeight: 1.35 }}>
                            {m.batting && (
                              <Box>
                                <b>{m.batting.runs}{m.batting.out ? "" : "*"}</b> ({m.batting.balls})
                              </Box>
                            )}
                            {m.bowling && (
                              <Box sx={{ color: "#526274" }}>
                                {m.bowling.wickets}/{m.bowling.runs} ({formatOvers(m.bowling.balls)})
                              </Box>
                            )}
                          </Box>
                          <Chip size="small" label={m.result === "won" ? "W" : m.result === "lost" ? "L" : m.result === "tied" ? "T" : "–"} sx={{ height: 22, fontWeight: 900, minWidth: 30, flex: "none" }} />
                        </Stack>
                      ))}
                    </Stack>
                  </>
                )}
                {data.tournaments.length > 0 && (
                  <Typography sx={{ fontSize: 13, color: "#526274", mb: 2 }}>
                    <b>Tournaments:</b>{" "}
                    {data.tournaments.map((t, i) => (
                      <React.Fragment key={`${t.name}-${i}`}>
                        {i > 0 && ", "}
                        {t.tournamentId ? (
                          <Box component="span" onClick={() => navigate(`/t/${t.tournamentId}`)} sx={{ cursor: "pointer", color: "#185a9d", fontWeight: 700, "&:hover": { textDecoration: "underline" } }}>
                            {t.name}
                          </Box>
                        ) : (
                          t.name
                        )}
                      </React.Fragment>
                    ))}
                  </Typography>
                )}
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<InsightsRounded />}
                  onClick={() => navigate(`/players/${data.player.id}`)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 800,
                    borderRadius: 2,
                    mb: 1,
                    py: 1,
                    // Long label: let it wrap on narrow phones (theme buttons are nowrap).
                    whiteSpace: "normal",
                    lineHeight: 1.3,
                    textAlign: "center",
                    boxShadow: "none",
                    color: "#2a1f05",
                    background: "linear-gradient(180deg, #F1D68A, #D9B45A)",
                    "&:hover": { background: "#F1D68A", boxShadow: "none" },
                  }}
                >
                  Full profile: achievements, analysis & head-to-head
                </Button>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<IosShareRounded />}
                    onClick={() => setShareOpen(true)}
                    sx={{ textTransform: "none", fontWeight: 900, borderRadius: 2, flex: "1 1 130px", whiteSpace: "nowrap" }}
                  >
                    Share
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<SportsCricketRounded />}
                    onClick={() => navigate("/create-game")}
                    sx={{ textTransform: "none", fontWeight: 900, borderRadius: 2, flex: "1 1 150px", whiteSpace: "nowrap" }}
                  >
                    Score a match
                  </Button>
                </Stack>
              </Box>
            </Paper>
            </Stack>
          )}
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              data-ga-click="share_page_join_as_player"
              onClick={() => startAs(navigate, "player")}
              sx={{ color: "#fff", fontWeight: 800, textTransform: "none", textDecoration: "underline", whiteSpace: "normal", lineHeight: 1.3, textAlign: "center" }}
            >
              Play cricket? Create your own free player profile →
            </Button>
            <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: 12.5, mt: 0.5, fontWeight: 700 }}>
              Stats by Cricket Score Counter
            </Typography>
          </Box>
        </Box>
      </Box>
      <Snackbar open={Boolean(notice)} autoHideDuration={3000} onClose={() => setNotice("")} message={notice} />
      {data && (
        <ShareSheet
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          title="Share profile"
          url={`${APP_URL}/u/${data.player.username}`}
          text={`${data.player.name}'s cricket stats`}
          fileName={`${data.player.username}-cricket-profile.png`}
          makeImage={() =>
            playerCardFromCareer({
              name: data.player.name,
              username: data.player.username,
              role: data.player.role,
              city: data.player.city,
              avatarUrl: resolveApiMediaUrl(data.player.avatarUrl),
              stats: data.overall,
              url: `${APP_URL}/u/${data.player.username}`,
            })
          }
        />
      )}
    </>
  );
};

export default PublicPlayerPage;
