import React from "react";
import { Alert, Avatar, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { DeleteOutlineRounded, ImageRounded, LinkRounded } from "@mui/icons-material";
import { getTeamAvatarGradient } from "../../utils/teamAvatar";
import { LOGO_ACCEPTED_TYPES, resizeLogoToDataUrl } from "../../utils/imageResize";

export interface LogoValue {
  /** Existing logo link (uploaded logo endpoint or an external link). */
  logoUrl?: string;
  /** New upload as a data: URL; null = remove the current logo. */
  logoData?: string | null;
}

/**
 * Choose a logo from the device (gallery on phones) with a live preview.
 * Images are checked (PNG/JPG/WebP, up to 5 MB) and resized to fit 512px
 * before upload. Pasting an image link is still possible as a fallback.
 */
const LogoUploadField: React.FC<{
  name: string;
  value: LogoValue;
  onChange: (next: LogoValue) => void;
  label?: string;
}> = ({ name, value, onChange, label = "Logo" }) => {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [showLink, setShowLink] = React.useState(false);

  const preview =
    value.logoData === null ? "" : value.logoData || value.logoUrl || "";
  const isExternalLink = Boolean(value.logoUrl && !value.logoData && /^https?:/i.test(value.logoUrl) && !value.logoUrl.includes("/api/v1/tournaments/"));

  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const dataUrl = await resizeLogoToDataUrl(file);
      onChange({ logoUrl: value.logoUrl, logoData: dataUrl });
      setShowLink(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't use that image.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <Box>
      <Typography sx={{ fontWeight: 800, fontSize: 13.5, color: "#0c3558", mb: 0.75 }}>{label}</Typography>
      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
        <Avatar
          variant="rounded"
          src={preview || undefined}
          alt=""
          sx={{
            width: 72,
            height: 72,
            borderRadius: 2.5,
            fontSize: 28,
            fontWeight: 900,
            border: "1px solid rgba(12,53,88,0.12)",
            // Light tile behind real logos (keeps transparent PNGs readable);
            // if a pasted link fails to load, the initial still shows on it.
            color: preview ? "#185a9d" : "#fff",
            background: preview ? "#f3f6f8" : getTeamAvatarGradient(name || "tournament"),
            "& img": { objectFit: "contain" },
          }}
        >
          {(name || "T").slice(0, 1).toUpperCase()}
        </Avatar>
        <Stack spacing={0.5} alignItems="flex-start">
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button
              type="button"
              size="small"
              variant="outlined"
              startIcon={<ImageRounded />}
              disabled={busy}
              onClick={() => fileRef.current?.click()}
              sx={{ textTransform: "none", fontWeight: 800, borderRadius: 1.5 }}
            >
              {busy ? "Preparing…" : preview ? "Change logo" : "Choose logo"}
            </Button>
            {preview && (
              <Button
                type="button"
                size="small"
                color="inherit"
                startIcon={<DeleteOutlineRounded />}
                onClick={() => onChange({ logoUrl: undefined, logoData: null })}
                sx={{ textTransform: "none", fontWeight: 700, color: "#6b7785" }}
              >
                Remove
              </Button>
            )}
          </Stack>
          <Typography sx={{ fontSize: 12, color: "#6b7785" }}>
            PNG, JPG or WebP · up to 5 MB · square works best
          </Typography>
          {!showLink && !isExternalLink && (
            <Button
              type="button"
              size="small"
              startIcon={<LinkRounded />}
              onClick={() => setShowLink(true)}
              sx={{ textTransform: "none", fontWeight: 700, p: 0, minWidth: 0 }}
            >
              or paste an image link
            </Button>
          )}
        </Stack>
      </Stack>
      <input
        ref={fileRef}
        type="file"
        accept={LOGO_ACCEPTED_TYPES.join(",")}
        hidden
        onChange={(e) => pick(e.target.files?.[0])}
      />
      {(showLink || isExternalLink) && (
        <TextField
          size="small"
          fullWidth
          label="Image link"
          placeholder="https://example.com/logo.png"
          value={isExternalLink ? value.logoUrl : ""}
          onChange={(e) => onChange({ logoUrl: e.target.value, logoData: undefined })}
          sx={{ mt: 1.25, "& .MuiOutlinedInput-root": { borderRadius: 1.5, background: "#fff" } }}
        />
      )}
      {error && (
        <Alert severity="warning" sx={{ mt: 1 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default LogoUploadField;
