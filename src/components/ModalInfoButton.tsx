import React from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";

interface ModalInfoButtonProps {
  title: string;
  description?: string;
  points?: string[];
  iconSx?: Record<string, unknown>;
}

const ModalInfoButton: React.FC<ModalInfoButtonProps> = ({
  title,
  description,
  points = [],
  iconSx,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <IconButton
        aria-label="modal-info"
        onClick={() => setOpen(true)}
        sx={{
          color: "var(--app-accent-text, #185a9d)",
          ...iconSx,
        }}
      >
        <InfoOutlinedIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xs"
        disableScrollLock
        PaperProps={{
          sx: {
            borderRadius: 5,
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)",
            boxShadow:
              "0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
            border: "2px solid var(--app-accent-start, #43cea2)",
            width: { xs: "98vw", sm: "100%" },
            maxWidth: { xs: "calc(100vw - 16px)", sm: "none" },
            m: { xs: "8px", sm: 2 },
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "var(--app-accent-text, #185a9d)",
            fontWeight: 800,
            pr: 6,
          }}
        >
          {title}
          <IconButton
            aria-label="close-modal-info"
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {description ? (
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontSize: "calc(15px * var(--app-font-scale, 1))",
                fontWeight: 500,
              }}
            >
              {description}
            </Typography>
          ) : null}
          {points.length ? (
            <Box
              component="ul"
              sx={{
                mt: description ? 1 : 0,
                mb: 0,
                pl: 2.2,
                color: "var(--app-accent-text, #185a9d)",
              }}
            >
              {points.map((point) => (
                <li key={point}>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "calc(14px * var(--app-font-scale, 1))",
                      fontWeight: 500,
                    }}
                  >
                    {point}
                  </Typography>
                </li>
              ))}
            </Box>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalInfoButton;
