import React from "react";
import { Autocomplete, Box, CircularProgress, IconButton, InputAdornment, TextField, Tooltip, Typography } from "@mui/material";
import { LinkOffRounded, VerifiedRounded } from "@mui/icons-material";
import type { SxProps, Theme } from "@mui/material/styles";
import AuthService from "../../services/AuthService";
import PlayerAccountService, { type PublicPlayer } from "../../services/PlayerAccountService";
import PlayerAvatar from "./PlayerAvatar";
import RegisteredBadge from "./RegisteredBadge";

export interface PickedPlayer {
  name: string;
  playerId?: string;
  username?: string;
}

// Shared across every picker on the page: players seen in results (so a
// linked row can show who it's linked to) and one fetch of recent players.
const seenPlayers = new Map<string, PublicPlayer>();
let recentPromise: Promise<PublicPlayer[]> | null = null;
const loadRecent = () => {
  if (!recentPromise) {
    recentPromise = PlayerAccountService.recent()
      .then((r) => {
        r.players.forEach((p) => seenPlayers.set(p.id, p));
        return r.players;
      })
      .catch(() => {
        recentPromise = null;
        return [];
      });
  }
  return recentPromise;
};

const describe = (p: PublicPlayer) =>
  [`@${p.username}`, p.role, p.city].filter(Boolean).join(" · ");

/**
 * Player name field that also searches registered players and the
 * organizer's recent players. Picking one links the roster row to that
 * player's profile; typing a new name links nothing (a plain roster name).
 */
const PlayerPicker: React.FC<{
  label: string;
  value: PickedPlayer;
  onChange: (next: PickedPlayer) => void;
  required?: boolean;
  excludeIds?: string[];
  sx?: SxProps<Theme>;
}> = ({ label, value, onChange, required, excludeIds = [], sx }) => {
  const enabled = AuthService.isLoggedIn();
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<PublicPlayer[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [mode, setMode] = React.useState<"recent" | "search">("recent");
  const linked = value.playerId ? seenPlayers.get(value.playerId) : undefined;
  const [, rerender] = React.useReducer((x: number) => x + 1, 0);

  // A row loaded already linked (e.g. editing a saved team): look the player
  // up in the organizer's recent players so the "registered" tick shows.
  React.useEffect(() => {
    if (enabled && value.playerId && !seenPlayers.has(value.playerId)) {
      loadRecent().then(() => rerender());
    }
  }, [enabled, value.playerId]);

  React.useEffect(() => {
    if (!open || !enabled) return;
    const q = value.name.trim();
    let cancelled = false;
    if (q.length < 2 || (value.playerId && linked && linked.name === value.name)) {
      setMode("recent");
      setLoading(true);
      loadRecent().then((recent) => {
        if (cancelled) return;
        const needle = q.toLowerCase();
        setOptions(recent.filter((p) => !needle || p.name.toLowerCase().includes(needle) || p.username.includes(needle)));
        setLoading(false);
      });
      return () => {
        cancelled = true;
      };
    }
    setMode("search");
    setLoading(true);
    const timer = window.setTimeout(() => {
      PlayerAccountService.search(q)
        .then((r) => {
          if (cancelled) return;
          r.players.forEach((p) => seenPlayers.set(p.id, p));
          setOptions(r.players);
        })
        .catch(() => !cancelled && setOptions([]))
        .finally(() => !cancelled && setLoading(false));
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [open, enabled, value.name, value.playerId, linked]);

  const visible = options.filter((p) => p.id === value.playerId || !excludeIds.includes(p.id));

  if (!enabled) {
    return (
      <TextField
        label={label}
        value={value.name}
        required={required}
        size="small"
        onChange={(e) => onChange({ name: e.target.value, playerId: value.playerId, username: value.username })}
        sx={sx}
      />
    );
  }

  return (
    <Autocomplete<PublicPlayer, false, false, true>
      freeSolo
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={visible}
      loading={loading}
      filterOptions={(x) => x}
      getOptionLabel={(o) => (typeof o === "string" ? o : o.name)}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      inputValue={value.name}
      value={null}
      onInputChange={(_, text, reason) => {
        if (reason !== "input") return;
        // Typing over a registered player unlinks them; typing over an
        // unregistered record just renames this roster entry.
        const keepLink = value.playerId && !(linked?.registered);
        onChange({ name: text, playerId: keepLink ? value.playerId : undefined, username: keepLink ? value.username : undefined });
      }}
      onChange={(_, picked) => {
        if (picked && typeof picked !== "string") {
          onChange({ name: picked.name, playerId: picked.id, username: picked.username });
        }
      }}
      ListboxProps={{ style: { maxHeight: 320 } }}
      renderOption={(props, p) => {
        const { key, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & { key: string };
        return (
          <Box component="li" key={p.id} {...rest} sx={{ display: "flex", gap: 1.2, alignItems: "center", py: "8px !important" }}>
            <PlayerAvatar name={p.name} avatarUrl={p.avatarUrl} size={34} />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 14, color: "#0c3558", display: "flex", alignItems: "center", gap: 0.8 }}>
                {p.name} {p.registered && <RegisteredBadge />}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#6b7785", fontWeight: 600 }}>{describe(p)}</Typography>
            </Box>
          </Box>
        );
      }}
      noOptionsText={
        mode === "recent"
          ? "Type 2+ letters to search players"
          : `No player found — "${value.name.trim()}" will be added as a new name`
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          size="small"
          InputProps={{
            ...params.InputProps,
            startAdornment:
              linked?.registered ? (
                <InputAdornment position="start" sx={{ ml: 0.5 }}>
                  <Tooltip title={`Linked to @${linked.username}'s profile`}>
                    <VerifiedRounded sx={{ fontSize: 18, color: "#0b7f61" }} />
                  </Tooltip>
                </InputAdornment>
              ) : undefined,
            endAdornment: (
              <>
                {loading && open ? <CircularProgress size={16} /> : null}
                {linked?.registered && (
                  <Tooltip title="Unlink player">
                    <IconButton
                      size="small"
                      aria-label="Unlink player"
                      onClick={() => onChange({ name: value.name })}
                      sx={{ p: 0.4 }}
                    >
                      <LinkOffRounded sx={{ fontSize: 17 }} />
                    </IconButton>
                  </Tooltip>
                )}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      sx={sx}
    />
  );
};

export default PlayerPicker;
