import React from "react";
import { Avatar, Box, ButtonBase, CircularProgress, Stack, Tooltip, Typography } from "@mui/material";
import { PhotoCameraRounded } from "@mui/icons-material";
import { getTeamAvatarGradient } from "../../utils/teamAvatar";
import { LOGO_ACCEPTED_TYPES, resizeLogoToDataUrl } from "../../utils/imageResize";
import MediaService from "../../services/MediaService";

/**
 * Square logo tile: tap to choose a photo (gallery or camera on phones).
 * The image is checked (PNG/JPG/WebP, up to 5 MB), shrunk to fit 512px and
 * uploaded straight away; the resulting link is passed to onChange.
 */
const TeamLogoPicker: React.FC<{
  name: string;
  value?: string;
  onChange: (logoUrl: string) => void;
  size?: number;
}> = ({ name, value, onChange, size = 88 }) => {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const dataUrl = await resizeLogoToDataUrl(file);
      onChange(await MediaService.uploadImage(dataUrl));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't use that image.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <Stack alignItems="center" spacing={0.5} sx={{ width: size + 16, flex: "none" }}>
      <Tooltip title={value ? "Change logo" : "Add a team logo"}>
        <ButtonBase
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          aria-label={value ? "Change team logo" : "Add team logo"}
          sx={{ position: "relative", borderRadius: 3, "&:focus-visible": { outline: "2px solid #185a9d", outlineOffset: 2 } }}
        >
          <Avatar
            variant="rounded"
            src={value || undefined}
            alt=""
            sx={{
              width: size,
              height: size,
              borderRadius: 3,
              fontSize: size * 0.4,
              fontWeight: 900,
              color: value ? "#185a9d" : "#fff",
              background: value ? "#f3f6f8" : getTeamAvatarGradient(name || "team"),
              border: "1px solid rgba(12,53,88,0.12)",
              "& img": { objectFit: "contain" },
            }}
          >
            {(name || "T").trim().slice(0, 1).toUpperCase() || "T"}
          </Avatar>
          <Box
            sx={{
              position: "absolute",
              right: -6,
              bottom: -6,
              width: 30,
              height: 30,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
              border: "2px solid #fff",
              boxShadow: "0 2px 6px rgba(12,53,88,0.25)",
            }}
          >
            {busy ? <CircularProgress size={14} sx={{ color: "#fff" }} /> : <PhotoCameraRounded sx={{ fontSize: 16 }} />}
          </Box>
        </ButtonBase>
      </Tooltip>
      {value ? (
        <Typography
          component="button"
          type="button"
          onClick={() => onChange("")}
          sx={{ all: "unset", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#6b7785", "&:hover": { color: "#b42318" } }}
        >
          Remove
        </Typography>
      ) : (
        <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "#6b7785", textAlign: "center", lineHeight: 1.2 }}>
          Logo
          <br />
          (optional)
        </Typography>
      )}
      {error && (
        <Typography role="alert" sx={{ fontSize: 11.5, color: "#b42318", textAlign: "center", lineHeight: 1.25 }}>
          {error}
        </Typography>
      )}
      <input ref={fileRef} type="file" accept={LOGO_ACCEPTED_TYPES.join(",")} hidden onChange={(e) => pick(e.target.files?.[0])} />
    </Stack>
  );
};

export default TeamLogoPicker;
