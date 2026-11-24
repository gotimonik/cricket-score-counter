import React from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ContentPasteRounded, BoltRounded, VerifiedRounded } from "@mui/icons-material";
import AuthService from "../../services/AuthService";
import PlayerAccountService, { type PublicPlayer } from "../../services/PlayerAccountService";
import type { PickedPlayer } from "./PlayerPicker";
import { primaryButtonSx } from "./buttonStyles";

/** Splits pasted text into clean, de-duplicated names (one per line or comma separated). */
export const parsePlayerNames = (text: string): string[] => {
  const seen = new Set<string>();
  return text
    .split(/[\n,;]+/)
    .map((line) =>
      line
        .replace(/^\s*(\d+[.)-]?|[-*•])\s*/, "") // "1. Name", "- Name", "• Name"
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter((name) => {
      const key = name.toLowerCase();
      if (!name || name.length > 60 || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

/**
 * Fast ways to fill a squad: paste a whole list of names at once, or tap
 * players you've used before. Sits above the player rows in team forms.
 */
const QuickAddPlayers: React.FC<{
  existing: PickedPlayer[];
  onAdd: (players: PickedPlayer[]) => void;
}> = ({ existing, onAdd }) => {
  const [pasteOpen, setPasteOpen] = React.useState(false);
  const [text, setText] = React.useState("");
  const [recent, setRecent] = React.useState<PublicPlayer[]>([]);

  React.useEffect(() => {
    if (!AuthService.isLoggedIn()) return;
    PlayerAccountService.recent()
      .then((r) => setRecent(Array.isArray(r?.players) ? r.players : []))
      .catch(() => undefined);
  }, []);

  const usedIds = new Set(existing.map((p) => p.playerId).filter(Boolean));
  const usedNames = new Set(existing.map((p) => p.name.trim().toLowerCase()).filter(Boolean));
  const suggestions = recent.filter((p) => !usedIds.has(p.id) && !usedNames.has(p.name.toLowerCase())).slice(0, 14);
  const parsed = parsePlayerNames(text).filter((n) => !usedNames.has(n.toLowerCase()));

  return (
    <Box
      sx={{
        p: 1.25,
        mb: 1.25,
        borderRadius: 2,
        border: "1px dashed rgba(12,53,88,0.22)",
        background: "rgba(24,90,157,0.03)",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Typography sx={{ fontWeight: 900, fontSize: 13, color: "#0c3558", display: "flex", alignItems: "center", gap: 0.4 }}>
          <BoltRounded sx={{ fontSize: 18, color: "#c69214" }} /> Quick add
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<ContentPasteRounded />}
          onClick={() => setPasteOpen(true)}
          sx={{ textTransform: "none", fontWeight: 800, borderRadius: 99 }}
        >
          Paste a list of names
        </Button>
      </Stack>
      {suggestions.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#526274", mb: 0.6 }}>
            Tap to add players you've used before:
          </Typography>
          <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap>
            {suggestions.map((p) => (
              <Chip
                key={p.id}
                size="small"
                label={p.name}
                icon={p.registered ? <VerifiedRounded sx={{ fontSize: 15, color: "#0b7f61 !important" }} /> : undefined}
                onClick={() => onAdd([{ name: p.name, playerId: p.id, username: p.username }])}
                title={`@${p.username}${p.city ? ` · ${p.city}` : ""}`}
                sx={{ fontWeight: 800, background: "#fff", border: "1px solid rgba(12,53,88,0.15)", "&:hover": { background: "#eef7f4" } }}
              />
            ))}
          </Stack>
        </Box>
      )}

      <Dialog open={pasteOpen} onClose={() => setPasteOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 900, color: "#0c3558" }}>Paste player names</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 13.5, color: "#526274", mb: 1.25 }}>
            One name per line, or separated by commas. Numbers and bullets are removed, e.g. a list copied from WhatsApp.
          </Typography>
          <TextField
            autoFocus
            multiline
            minRows={8}
            fullWidth
            placeholder={"1. Rohit Sharma\n2. Virat Kohli\n3. KL Rahul"}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {text.trim() && (
            <Typography sx={{ fontSize: 12.5, color: "#0b7f61", fontWeight: 800, mt: 1 }}>
              {parsed.length} new {parsed.length === 1 ? "player" : "players"} will be added
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPasteOpen(false)} sx={{ textTransform: "none", fontWeight: 800 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!parsed.length}
            onClick={() => {
              onAdd(parsed.map((name) => ({ name })));
              setText("");
              setPasteOpen(false);
            }}
            sx={primaryButtonSx}
          >
            Add {parsed.length || ""} players
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuickAddPlayers;
