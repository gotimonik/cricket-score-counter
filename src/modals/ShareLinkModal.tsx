import React from "react";
import { Box, Modal, Typography, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useTranslation } from "react-i18next";
import ModalInfoButton from "../components/ModalInfoButton";

interface ShareLinkModalProps {
  open: boolean;
  onClose: () => void;
  shareUrl: string;
}

const ShareLinkModal: React.FC<ShareLinkModalProps> = ({ open, onClose, shareUrl }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for older browsers and WebViews
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      alert(t("Failed to copy link. Please copy manually."));
    }
  };

  return (
    <Modal open={open} onClose={onClose} disableScrollLock>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: {
            xs: "max(10px, var(--app-safe-top, env(safe-area-inset-top, 0px)))",
            sm: 2,
          },
          pb: {
            xs: "max(10px, var(--app-safe-bottom, env(safe-area-inset-bottom, 0px)))",
            sm: 2,
          },
        }}
      >
      <Box
        className="app-scrollable"
        sx={{
          borderRadius: 5,
          background: "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)",
          boxShadow: "0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
          border: "2px solid var(--app-accent-start, #43cea2)",
          backdropFilter: "blur(8px)",
          maxWidth: 420,
          width: "100%",
          p: { xs: 2, sm: 4 },
          maxHeight: "calc(100dvh - 24px)",
          overflowY: "auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
            {t("Share Game Link")}
          </Typography>
          <ModalInfoButton
            title={t("Share your match")}
            description={t(
              "Copy the link and send it to friends or family. Anyone with the link can view live scores and match details in real time."
            )}
          />
        </Box>
        <label htmlFor="share-link" style={{fontWeight:600, fontSize: "calc(16px * var(--app-font-scale, 1))", marginBottom:4, position:'absolute', left:'-9999px'}}>{t("Share Game Link")}</label>
        <TextField
          id="share-link"
          aria-label={t("Share Game Link")}
          value={shareUrl}
          fullWidth
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  data-ga-click="copy_share_link_icon"
                  onClick={handleCopy}
                  edge="end"
                  aria-label="copy"
                >
                  <ContentCopyIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        <Button
          data-ga-click="copy_share_link"
          onClick={handleCopy}
          variant="contained"
          fullWidth
          sx={{
            mt: 0.5,
            py: 1.1,
            borderRadius: 2.4,
            fontWeight: 800,
            fontSize: "calc(15px * var(--app-font-scale, 1))",
            textTransform: "none",
            background:
              "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
            color: "#fff",
            boxShadow:
              "0 8px 20px color-mix(in srgb, var(--app-accent-end, #185a9d) 26%, transparent 74%)",
            "&:hover": {
              background:
                "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
              color: "#fff",
            },
          }}
        >
          {copied ? t("Copied!") : t("Copy Link")}
        </Button>
        <Button
          data-ga-click="close_share_link"
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{
            mt: 1,
            py: 1.05,
            borderRadius: 2.4,
            fontWeight: 700,
            fontSize: "calc(14px * var(--app-font-scale, 1))",
            textTransform: "none",
            color: "var(--app-accent-text, #185a9d)",
            borderColor: "color-mix(in srgb, var(--app-accent-end, #185a9d) 36%, transparent 64%)",
            background: "rgba(255,255,255,0.55)",
            "&:hover": {
              borderColor: "var(--app-accent-end, #185a9d)",
              background: "rgba(255,255,255,0.78)",
            },
          }}
        >
          {t("Close")}
        </Button>
      </Box>
      </Box>
    </Modal>
  );
};

export default ShareLinkModal;
