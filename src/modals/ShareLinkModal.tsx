import React from "react";
import { Box, Modal, Typography, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface ShareLinkModalProps {
  open: boolean;
  onClose: () => void;
  shareUrl: string;
}

const ShareLinkModal: React.FC<ShareLinkModalProps> = ({ open, onClose, shareUrl }) => {
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
      alert("Failed to copy link. Please copy manually.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          minWidth: 320,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Share Game Link
        </Typography>
        <TextField
          value={shareUrl}
          fullWidth
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleCopy} edge="end" aria-label="copy">
                  <ContentCopyIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        <Button onClick={handleCopy} variant="contained" fullWidth>
          {copied ? "Copied!" : "Copy Link"}
        </Button>
        <Button onClick={onClose} variant="text" fullWidth sx={{ mt: 1 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ShareLinkModal;
