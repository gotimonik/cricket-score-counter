import React from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { PhotoCameraRounded } from "@mui/icons-material";
import type { MyPlayer, PlayerProfileInput } from "../../services/PlayerAccountService";
import { resizeImageToDataUrl } from "../../utils/imageResize";
import PlayerAvatar from "./PlayerAvatar";
import { primaryButtonSx } from "./buttonStyles";

export const ROLE_OPTIONS = ["Batter", "Bowler", "All-rounder", "Wicket-keeper", "Wicket-keeper batter"];
export const BATTING_OPTIONS = ["Right-hand bat", "Left-hand bat"];
export const BOWLING_OPTIONS = [
  "Right-arm fast",
  "Right-arm medium",
  "Right-arm off-spin",
  "Right-arm leg-spin",
  "Left-arm fast",
  "Left-arm medium",
  "Left-arm orthodox",
  "Left-arm wrist-spin",
  "Doesn't bowl",
];

const fieldSx = { "& .MuiOutlinedInput-root": { borderRadius: 1.5, background: "#fff" } } as const;

const SelectField: React.FC<{ label: string; value: string; options: string[]; onChange: (v: string) => void }> = ({
  label,
  value,
  options,
  onChange,
}) => (
  <FormControl size="small" fullWidth sx={fieldSx}>
    <InputLabel>{label}</InputLabel>
    <Select label={label} value={value} onChange={(e) => onChange(String(e.target.value))}>
      <MenuItem value="">
        <em>Not set</em>
      </MenuItem>
      {options.map((o) => (
        <MenuItem key={o} value={o}>
          {o}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

/** Shared form for registering and editing a player profile. */
const PlayerProfileForm: React.FC<{
  initial?: MyPlayer | null;
  defaultName?: string;
  submitLabel: string;
  onSubmit: (input: PlayerProfileInput) => Promise<void>;
  onCancel?: () => void;
}> = ({ initial, defaultName = "", submitLabel, onSubmit, onCancel }) => {
  const [form, setForm] = React.useState({
    name: initial?.name ?? defaultName,
    username: initial?.username ?? "",
    role: initial?.role ?? "",
    city: initial?.city ?? "",
    battingStyle: initial?.battingStyle ?? "",
    bowlingStyle: initial?.bowlingStyle ?? "",
    hidden: initial?.visibility === "hidden",
  });
  const [photo, setPhoto] = React.useState<string | null | undefined>(undefined); // undefined = unchanged
  const [error, setError] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const set = (k: keyof typeof form) => (v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const pickPhoto = async (file?: File) => {
    if (!file) return;
    try {
      setPhoto(await resizeImageToDataUrl(file));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't use that image.");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit({
        name: form.name.trim(),
        username: form.username.trim() || undefined,
        role: form.role,
        city: form.city.trim(),
        battingStyle: form.battingStyle,
        bowlingStyle: form.bowlingStyle,
        visibility: form.hidden ? "hidden" : "public",
        ...(photo !== undefined ? { avatarData: photo } : {}),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save your profile.");
    } finally {
      setSaving(false);
    }
  };

  const shownPhoto = photo === undefined ? initial?.avatarUrl : photo ?? "";

  return (
    <Box component="form" onSubmit={submit} noValidate>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          {photo ? (
            <Box component="img" src={photo} alt="" sx={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover" }} />
          ) : (
            <PlayerAvatar name={form.name || "?"} avatarUrl={shownPhoto} size={72} />
          )}
          <Stack spacing={0.5} alignItems="flex-start">
            <Button
              size="small"
              variant="outlined"
              startIcon={<PhotoCameraRounded />}
              onClick={() => fileRef.current?.click()}
              sx={{ textTransform: "none", fontWeight: 800, borderRadius: 1.5 }}
            >
              {shownPhoto ? "Change photo" : "Add photo"}
            </Button>
            {shownPhoto ? (
              <Button size="small" color="inherit" onClick={() => setPhoto(null)} sx={{ textTransform: "none", color: "#6b7785" }}>
                Remove photo
              </Button>
            ) : null}
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => pickPhoto(e.target.files?.[0])} />
          </Stack>
        </Stack>

        <TextField label="Full name" required size="small" value={form.name} onChange={(e) => set("name")(e.target.value)} sx={fieldSx} inputProps={{ maxLength: 60 }} />
        <TextField
          label="Username"
          size="small"
          value={form.username}
          onChange={(e) => set("username")(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ""))}
          helperText={form.username ? `Your share link: cricket-score-counter.com/u/${form.username}` : "Leave blank and we'll pick one from your name."}
          InputProps={{ startAdornment: <Typography sx={{ color: "#8a96a3", mr: 0.3 }}>@</Typography> }}
          inputProps={{ maxLength: 24 }}
          sx={fieldSx}
        />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
          <SelectField label="Role" value={form.role} options={ROLE_OPTIONS} onChange={set("role")} />
          <TextField label="City" size="small" value={form.city} onChange={(e) => set("city")(e.target.value)} sx={fieldSx} inputProps={{ maxLength: 60 }} />
          <SelectField label="Batting" value={form.battingStyle} options={BATTING_OPTIONS} onChange={set("battingStyle")} />
          <SelectField label="Bowling" value={form.bowlingStyle} options={BOWLING_OPTIONS} onChange={set("bowlingStyle")} />
        </Box>
        <FormControlLabel
          control={<Switch checked={form.hidden} onChange={(e) => set("hidden")(e.target.checked)} />}
          label={
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: 14 }}>Hide me from search</Typography>
              <Typography sx={{ fontSize: 12.5, color: "#6b7785" }}>
                Organizers won't find you by name, and your share link and stats page are turned off. Your phone number is never shown.
              </Typography>
            </Box>
          }
          sx={{ alignItems: "flex-start", "& .MuiSwitch-root": { mt: -0.5 } }}
        />
        {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          {onCancel && (
            <Button onClick={onCancel} sx={{ textTransform: "none", fontWeight: 800 }}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            sx={{ ...primaryButtonSx, px: 3 }}
          >
            {saving ? "Saving…" : submitLabel}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default PlayerProfileForm;
