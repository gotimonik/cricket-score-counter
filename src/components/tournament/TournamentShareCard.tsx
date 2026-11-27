import React from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Paper, Snackbar, Stack, Typography } from "@mui/material";
import { IosShareRounded, OpenInNewRounded, VisibilityRounded } from "@mui/icons-material";
import TournamentService from "../../services/TournamentService";
import type { TournamentRecord } from "../../types/tournament";
import { APP_URL } from "../../utils/constant";
import ShareSheet from "../share/ShareSheet";
import { tournamentStoryCard } from "../../utils/shareCards";
import VisibilityPicker, { TOURNAMENT_VISIBILITY_OPTIONS, type TournamentVisibility } from "../privacy/VisibilityPicker";

/**
 * Organizer-only card on the tournament page: who can see this tournament,
 * plus the public link to share with players and fans.
 */
const TournamentShareCard: React.FC<{
  tournament: TournamentRecord;
  onSaved: (tournament: TournamentRecord) => void;
}> = ({ tournament, onSaved }) => {
  const navigate = useNavigate();
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");
  const [shareOpen, setShareOpen] = React.useState(false);
  const visibility: TournamentVisibility = tournament.visibility ?? "public";
  const url = `${APP_URL}/t/${tournament.id}`;

  const change = async (next: TournamentVisibility) => {
    if (next === visibility || saving) return;
    setSaving(true);
    setError("");
    try {
      onSaved(await TournamentService.updateTournament(tournament.id, { visibility: next }));
      setNotice(next === "public" ? "Tournament is now public." : next === "unlisted" ? "Anyone with the link can now view it." : "Tournament is now private.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't change who can see this tournament.");
    } finally {
      setSaving(false);
    }
  };

  const share = () => setShareOpen(true);
  const statusLabel = tournament.status === "active" ? "Live" : tournament.status === "completed" ? "Completed" : "Upcoming";

  return (
    <Paper elevation={0} sx={{ p: { xs: 1.75, sm: 2.25 }, borderRadius: 3, border: "1px solid rgba(12,53,88,0.12)", background: "#fff" }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }} sx={{ flexWrap: "wrap", mb: 1.25 }} useFlexGap>
        <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flex: 1 }}>
          <VisibilityRounded sx={{ color: "#185a9d" }} />
          <Typography sx={{ fontWeight: 900, color: "#0c3558", fontSize: 17 }}>Who can see this tournament?</Typography>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {visibility !== "private" && (
            <Button size="small" startIcon={<IosShareRounded />} onClick={share} variant="outlined" sx={{ textTransform: "none", fontWeight: 900, borderRadius: 1.5 }}>
              Share
            </Button>
          )}
          <Button size="small" startIcon={<OpenInNewRounded />} onClick={() => navigate(`/t/${tournament.id}`)} sx={{ textTransform: "none", fontWeight: 900 }}>
            View public page
          </Button>
        </Stack>
      </Stack>
      <VisibilityPicker value={visibility} options={TOURNAMENT_VISIBILITY_OPTIONS} onChange={change} disabled={saving} />
      {visibility !== "private" && (
        <Box sx={{ mt: 1.25, px: 1.25, py: 0.75, borderRadius: 1.5, background: "#f6f9fb", border: "1px dashed rgba(12,53,88,0.2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          <Typography component="span" sx={{ fontSize: 13, fontWeight: 700, color: "#526274" }}>
            {url}
          </Typography>
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 1.25 }}>
          {error}
        </Alert>
      )}
      <Snackbar open={Boolean(notice)} autoHideDuration={3000} onClose={() => setNotice("")} message={notice} />
      <ShareSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title="Share tournament"
        url={url}
        text={`${tournament.name}: points table, results and live scores`}
        fileName="tournament.png"
        makeImage={() =>
          tournamentStoryCard({
            name: tournament.name,
            subtitle: [tournament.location, `${tournament.oversPerMatch} overs`].filter(Boolean).join(" · "),
            status: statusLabel,
            rows: [],
            url,
          })
        }
      />
    </Paper>
  );
};

export default TournamentShareCard;
