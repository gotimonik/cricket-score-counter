import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Button, Chip, Paper, Snackbar, Stack, Typography } from "@mui/material";
import { IosShareRounded, SportsCricketRounded } from "@mui/icons-material";
import AppSpinner from "./AppSpinner";
import MetaHelmet from "./MetaHelmet";
import PlayerAccountService, { type PublicProfileResponse } from "../services/PlayerAccountService";
import { formatOvers } from "../utils/matchStats";
import PlayerAvatar from "./player/PlayerAvatar";
import RegisteredBadge from "./player/RegisteredBadge";
import ShareLinkModal from "../modals/ShareLinkModal";
import { shareProfileLink } from "./MePage";
import { primaryButtonSx } from "./player/buttonStyles";
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
  const [shareFallbackUrl, setShareFallbackUrl] = React.useState("");

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
      <Box sx={{ minHeight: "100vh", background: "linear-gradient(160deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 55%, #0c3558 100%)", py: { xs: 2, sm: 5 }, px: 1.5 }}>
        <Box sx={{ maxWidth: 560, mx: "auto" }}>
          {error ? (
            <Alert severity="info" sx={{ borderRadius: 2 }}>{error}</Alert>
          ) : !data || !s ? (
            <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}><AppSpinner /></Box>
          ) : (
            <Paper elevation={0} sx={{ borderRadius: 4, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
              <Box sx={{ p: 3, pb: 2, textAlign: "center", background: "#fff" }}>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 1.5 }}>
                  <PlayerAvatar name={data.player.name} avatarUrl={data.player.avatarUrl} size={104} />
                </Box>
                <Typography sx={{ fontSize: 26, fontWeight: 900, color: "#0c3558", lineHeight: 1.1 }}>{data.player.name}</Typography>
                <Typography sx={{ color: "#6b7785", fontWeight: 700, mt: 0.25 }}>
                  @{data.player.username}
                  {data.player.city ? ` · ${data.player.city}` : ""}
                </Typography>
                <Box sx={{ mt: 0.5 }}><RegisteredBadge /></Box>
                <Stack direction="row" spacing={0.75} justifyContent="center" flexWrap="wrap" useFlexGap sx={{ mt: 1.25 }}>
                  {[data.player.role, data.player.battingStyle, data.player.bowlingStyle].filter(Boolean).map((x) => (
                    <Chip key={x} size="small" label={x} sx={{ fontWeight: 800, background: "#eef5f7", color: "#185a9d" }} />
                  ))}
                </Stack>
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "#e6ecf1" }}>
                {tiles.map((t) => (
                  <Box key={t.label} sx={{ background: "#f8fbfc", py: 1.5, px: 0.25, textAlign: "center", minWidth: 0 }}>
                    <Typography sx={{ fontSize: "clamp(16px, 5vw, 22px)", fontWeight: 900, color: "#0c3558", lineHeight: 1.1, whiteSpace: "nowrap" }}>{t.value}</Typography>
                    <Typography sx={{ fontSize: "clamp(9px, 2.6vw, 10.5px)", fontWeight: 800, color: "#6b7785", textTransform: "uppercase", letterSpacing: 0.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.label}</Typography>
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
                    <b>Tournaments:</b> {data.tournaments.map((t) => t.name).join(", ")}
                  </Typography>
                )}
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<IosShareRounded />}
                    onClick={async () => {
                      const r = await shareProfileLink(data.player.username);
                      if (r === "copied") setNotice("Link copied.");
                      else setShareFallbackUrl(r);
                    }}
                    sx={{ textTransform: "none", fontWeight: 900, borderRadius: 2, flex: "1 1 130px", whiteSpace: "nowrap" }}
                  >
                    Share
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<SportsCricketRounded />}
                    onClick={() => navigate("/create-game")}
                    sx={{ ...primaryButtonSx, borderRadius: 2, flex: "1 1 150px", whiteSpace: "nowrap" }}
                  >
                    Score a match
                  </Button>
                </Stack>
              </Box>
            </Paper>
          )}
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              data-ga-click="share_page_join_as_player"
              onClick={() => startAs(navigate, "player")}
              sx={{ color: "#fff", fontWeight: 800, textTransform: "none", textDecoration: "underline" }}
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
      <ShareLinkModal
        open={Boolean(shareFallbackUrl)}
        onClose={() => setShareFallbackUrl("")}
        shareUrl={shareFallbackUrl}
        title="Share this profile"
      />
    </>
  );
};

export default PublicPlayerPage;
