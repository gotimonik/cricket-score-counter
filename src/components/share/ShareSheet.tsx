import React from "react";
import { Capacitor } from "@capacitor/core";
import {
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import {
  CheckRounded,
  CloseRounded,
  ContentCopyRounded,
  DownloadRounded,
  Instagram,
  IosShareRounded,
  LinkRounded,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { canShareNatively, copyText, shareNative } from "../../utils/share";

export interface ShareSheetProps {
  open: boolean;
  onClose: () => void;
  /** Sheet heading, e.g. "Share profile". */
  title: string;
  url: string;
  /** Message that goes with the link (also used as the image caption). */
  text?: string;
  /** Builds the story image (1080x1920). Omit for link-only sharing. */
  makeImage?: () => Promise<Blob>;
  /**
   * Shape of the generated image, for the preview box. Defaults to a 9:16
   * story; landscape images (e.g. certificates) pass their own ratio so the
   * preview shows the whole image instead of cropping its sides.
   */
  imageAspect?: { w: number; h: number };
  /** File name for the saved / shared image. */
  fileName?: string;
}

const optionSx = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  px: 1.75,
  py: 1.4,
  borderRadius: 2.5,
  textAlign: "left",
  justifyContent: "flex-start",
  border: "1px solid rgba(12,53,88,0.12)",
  background: "#fff",
  "&:hover": { background: "#f6f9fb" },
} as const;

const OptionIcon: React.FC<{ children: React.ReactNode; bg: string }> = ({ children, bg }) => (
  <Box sx={{ width: 42, height: 42, borderRadius: "50%", display: "grid", placeItems: "center", color: "#fff", background: bg, flex: "none" }}>
    {children}
  </Box>
);

/**
 * One place to share anything: a story-sized image (Instagram / WhatsApp
 * stories and posts), the link through the system share sheet, or a copy of
 * the link. In the Android and iOS apps both open the native share sheet.
 */
const ShareSheet: React.FC<ShareSheetProps> = ({ open, onClose, title, url, text, makeImage, fileName, imageAspect }) => {
  const aspect = imageAspect ?? { w: 9, h: 16 };
  const landscape = aspect.w > aspect.h;
  const { t } = useTranslation();
  const [image, setImage] = React.useState<Blob | null>(null);
  const [preview, setPreview] = React.useState("");
  const [building, setBuilding] = React.useState(false);
  const [busy, setBusy] = React.useState<"" | "image" | "link">("");
  const [copied, setCopied] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const native = Capacitor.isNativePlatform();
  const hasSheet = canShareNatively();

  React.useEffect(() => {
    if (!open || !makeImage) return undefined;
    let cancelled = false;
    let objectUrl = "";
    setBuilding(true);
    setImage(null);
    makeImage()
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setImage(blob);
        setPreview(objectUrl);
      })
      .catch(() => !cancelled && setMessage(t("Couldn't create the image. You can still share the link.")))
      .finally(() => !cancelled && setBuilding(false));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setPreview("");
    };
    // makeImage is recreated by callers on every render; rebuild only on open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      setCopied(false);
      setMessage("");
      setBusy("");
    }
  }, [open]);

  const doShare = async (withImage: boolean) => {
    setBusy(withImage ? "image" : "link");
    setMessage("");
    const outcome = await shareNative({
      title,
      text,
      url,
      image: withImage ? image ?? undefined : undefined,
      fileName,
    });
    setBusy("");
    if (outcome === "unsupported") {
      const ok = await copyText(url);
      setMessage(ok ? t("Sharing isn't available here, so the link was copied.") : t("Copy the link below to share it."));
    }
  };

  const copy = async () => {
    const ok = await copyText(url);
    setCopied(ok);
    if (ok) window.setTimeout(() => setCopied(false), 1800);
    else setMessage(t("Copy the link below to share it."));
  };

  const download = () => {
    if (!preview) return;
    const a = document.createElement("a");
    a.href = preview;
    a.download = fileName || "cricket-score.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}
    >
      <DialogTitle sx={{ fontWeight: 900, pr: 6 }}>
        {title}
        <IconButton onClick={onClose} aria-label={t("Close")} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseRounded />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: "16px !important", pb: 2.5, bgcolor: "#f3f6f8" }}>
        {makeImage && (
          <Box
            sx={{
              mx: "auto",
              mb: 2,
              width: landscape ? "min(100%, 420px)" : "min(52%, 200px)",
              aspectRatio: `${aspect.w} / ${aspect.h}`,
              borderRadius: 2.5,
              overflow: "hidden",
              display: "grid",
              placeItems: "center",
              background: "#0F2E25",
              boxShadow: "0 10px 26px rgba(8,26,56,0.25)",
            }}
          >
            {preview ? (
              <Box component="img" src={preview} alt={t("Share image preview")} sx={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
            ) : building ? (
              <CircularProgress size={28} sx={{ color: "#D9B45A" }} />
            ) : null}
          </Box>
        )}

        <Box sx={{ display: "grid", gap: 1 }}>
          {makeImage && hasSheet && (
            <ButtonBase data-ga-click="share_story_image" disabled={!image || Boolean(busy)} onClick={() => doShare(true)} sx={{ ...optionSx, opacity: image ? 1 : 0.6 }}>
              <OptionIcon bg="linear-gradient(45deg, #f9ce34 0%, #ee2a7b 50%, #6228d7 100%)">
                {busy === "image" ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : <Instagram />}
              </OptionIcon>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 900, color: "#0c3558 !important", fontSize: 15 }}>{t("Share to story or post")}</Typography>
                <Typography sx={{ fontWeight: 600, color: "#6b7785 !important", fontSize: 12.5 }}>
                  {t("Instagram, WhatsApp, Facebook, Snapchat…")}
                </Typography>
              </Box>
            </ButtonBase>
          )}
          {hasSheet && (
            <ButtonBase data-ga-click="share_link_native" disabled={Boolean(busy)} onClick={() => doShare(false)} sx={optionSx}>
              <OptionIcon bg="linear-gradient(135deg, #1f5443 0%, #0F2E25 100%)">
                {busy === "link" ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : <IosShareRounded />}
              </OptionIcon>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 900, color: "#0c3558 !important", fontSize: 15 }}>{t("Share link")}</Typography>
                <Typography sx={{ fontWeight: 600, color: "#6b7785 !important", fontSize: 12.5 }}>
                  {t("WhatsApp, Messages, email and more")}
                </Typography>
              </Box>
            </ButtonBase>
          )}
          {makeImage && !native && (
            <ButtonBase data-ga-click="share_download_image" disabled={!preview} onClick={download} sx={{ ...optionSx, opacity: preview ? 1 : 0.6 }}>
              <OptionIcon bg="#526274">
                <DownloadRounded />
              </OptionIcon>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 900, color: "#0c3558 !important", fontSize: 15 }}>{t("Download image")}</Typography>
                <Typography sx={{ fontWeight: 600, color: "#6b7785 !important", fontSize: 12.5 }}>
                  {t("Post it as a story from your phone")}
                </Typography>
              </Box>
            </ButtonBase>
          )}
        </Box>

        <Box
          sx={{
            mt: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            pl: 1.5,
            pr: 0.75,
            py: 0.75,
            borderRadius: 2.5,
            background: "#fff",
            border: "1px solid rgba(12,53,88,0.12)",
          }}
        >
          <LinkRounded sx={{ color: "#6b7785", flex: "none" }} />
          <Typography
            sx={{ flex: 1, minWidth: 0, fontWeight: 700, fontSize: 13.5, color: "#0c3558 !important", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", userSelect: "all" }}
          >
            {url.replace(/^https?:\/\/(www\.)?/, "")}
          </Typography>
          <Button
            data-ga-click="copy_share_link"
            onClick={copy}
            size="small"
            variant="contained"
            disableElevation
            startIcon={copied ? <CheckRounded /> : <ContentCopyRounded />}
            sx={{ flex: "none", borderRadius: 99, fontWeight: 800, px: 1.5 }}
          >
            {copied ? t("Copied") : t("Copy")}
          </Button>
        </Box>

        {message && (
          <Typography sx={{ mt: 1.25, textAlign: "center", fontWeight: 700, fontSize: 13, color: "#526274 !important" }}>{message}</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareSheet;
