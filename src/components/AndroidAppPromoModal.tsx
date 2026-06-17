import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseRounded from "@mui/icons-material/CloseRounded";
import DownloadRounded from "@mui/icons-material/DownloadRounded";
import PhoneAndroidRounded from "@mui/icons-material/PhoneAndroidRounded";
import SportsCricketRounded from "@mui/icons-material/SportsCricketRounded";
import { Capacitor } from "@capacitor/core";
import { ANDROID_APP_URL } from "../utils/constant";

const PROMO_SESSION_KEY = "cricket-score-counter-android-app-promo-seen";

const hasSeenPromoThisSession = () => {
  try {
    return window.sessionStorage.getItem(PROMO_SESSION_KEY) === "true";
  } catch {
    return false;
  }
};

const markPromoSeenThisSession = () => {
  try {
    window.sessionStorage.setItem(PROMO_SESSION_KEY, "true");
  } catch {
    // Some privacy modes can block sessionStorage; the modal can still close.
  }
};

const AndroidAppPromoModal: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (
      !ANDROID_APP_URL ||
      typeof window === "undefined" ||
      navigator.userAgent === "ReactSnap" ||
      Capacitor.isNativePlatform() ||
      hasSeenPromoThisSession()
    ) {
      return;
    }

    setOpen(true);
  }, []);

  const handleClose = () => {
    markPromoSeenThisSession();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          width: { xs: "calc(100% - 24px)", sm: 420 },
          m: { xs: 1.5, sm: 2 },
          background:
            "linear-gradient(180deg, #f8fffc 0%, #eef8ff 48%, #ffffff 100%)",
          boxShadow: "0 22px 70px rgba(4, 26, 58, 0.28)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          px: { xs: 2.2, sm: 3 },
          pt: { xs: 2.4, sm: 3 },
          pb: 1.2,
          background:
            "linear-gradient(135deg, rgba(67, 206, 162, 0.2) 0%, rgba(24, 90, 157, 0.14) 100%)",
        }}
      >
        <IconButton
          aria-label="Close app download prompt"
          onClick={handleClose}
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "#17436c",
            background: "rgba(255,255,255,0.72)",
            "&:hover": { background: "rgba(255,255,255,0.95)" },
          }}
        >
          <CloseRounded fontSize="small" />
        </IconButton>
        <Stack
          direction="row"
          spacing={1.4}
          alignItems="center"
          sx={{ pr: 4 }}
        >
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
              color: "#fff",
              background:
                "linear-gradient(135deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
              boxShadow: "0 10px 26px rgba(24, 90, 157, 0.24)",
              flex: "0 0 auto",
            }}
          >
            <SportsCricketRounded sx={{ fontSize: 30 }} />
          </Box>
          <Box>
            <Typography
              component="h2"
              sx={{
                color: "#082846",
                fontWeight: 900,
                lineHeight: 1.12,
                fontSize: {
                  xs: "calc(22px * var(--app-font-scale, 1))",
                  sm: "calc(25px * var(--app-font-scale, 1))",
                },
              }}
            >
              Get the Android app
            </Typography>
            <Typography
              sx={{
                mt: 0.4,
                color: "rgba(8, 40, 70, 0.74)",
                fontWeight: 700,
                fontSize: "calc(13px * var(--app-font-scale, 1))",
              }}
            >
              Cricket Score Counter is now on Google Play.
            </Typography>
          </Box>
        </Stack>
      </Box>
      <DialogContent sx={{ px: { xs: 2.2, sm: 3 }, pt: 2.2, pb: 1 }}>
        <Typography
          sx={{
            color: "#143a60",
            fontSize: "calc(15px * var(--app-font-scale, 1))",
            lineHeight: 1.6,
            fontWeight: 600,
          }}
        >
          Score local cricket matches faster with the Android app, built for
          quick taps, clear score visibility, and smoother match-day use.
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            mt: 1.8,
            px: 1.4,
            py: 1.1,
            borderRadius: 2,
            color: "#0f4d7b",
            background: "rgba(67, 206, 162, 0.1)",
            border: "1px solid rgba(24, 90, 157, 0.12)",
          }}
        >
          <PhoneAndroidRounded sx={{ fontSize: 22 }} />
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "calc(13px * var(--app-font-scale, 1))",
            }}
          >
            Open the Play Store listing and install it on your Android device.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          px: { xs: 2.2, sm: 3 },
          pb: { xs: 2.2, sm: 3 },
          pt: 1,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            minHeight: 46,
            borderRadius: 999,
            color: "#17436c",
            fontWeight: 800,
            textTransform: "none",
          }}
        >
          Maybe later
        </Button>
        <Button
          component="a"
          href={ANDROID_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClose}
          variant="contained"
          startIcon={<DownloadRounded />}
          data-ga-click="android_app_promo_download"
          sx={{
            position: "relative",
            overflow: "hidden",
            minHeight: 46,
            borderRadius: 999,
            px: 2.2,
            color: "#fff",
            fontWeight: 900,
            textTransform: "none",
            background:
              "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
            boxShadow:
              "0 14px 32px rgba(24, 90, 157, 0.28), 0 0 0 1px rgba(255,255,255,0.24) inset",
            animation: "promoCtaPulse 2.6s ease-in-out infinite",
            "& .MuiButton-startIcon": {
              position: "relative",
              zIndex: 1,
              animation: "promoCtaIconLift 1.8s ease-in-out infinite",
            },
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.38) 42%, transparent 68%)",
              transform: "translateX(-130%)",
              animation: "promoCtaShine 2.8s ease-in-out infinite",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 2,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.28)",
              pointerEvents: "none",
            },
            "& .promo-cta-label": {
              position: "relative",
              zIndex: 1,
            },
            "&:hover": {
              background:
                "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
              boxShadow:
                "0 18px 38px rgba(24, 90, 157, 0.34), 0 0 0 1px rgba(255,255,255,0.32) inset",
              transform: "translateY(-1px) scale(1.02)",
            },
            "&:focus-visible": {
              outline: "3px solid rgba(67, 206, 162, 0.42)",
              outlineOffset: 3,
            },
            "@keyframes promoCtaPulse": {
              "0%, 100%": {
                boxShadow:
                  "0 14px 32px rgba(24, 90, 157, 0.28), 0 0 0 1px rgba(255,255,255,0.24) inset",
              },
              "50%": {
                boxShadow:
                  "0 18px 42px rgba(24, 90, 157, 0.38), 0 0 0 5px rgba(67, 206, 162, 0.14)",
              },
            },
            "@keyframes promoCtaShine": {
              "0%": { transform: "translateX(-130%)" },
              "48%, 100%": { transform: "translateX(130%)" },
            },
            "@keyframes promoCtaIconLift": {
              "0%, 100%": { transform: "translateY(0)" },
              "50%": { transform: "translateY(-2px)" },
            },
          }}
        >
          <Box component="span" className="promo-cta-label">
            Open Play Store
          </Box>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AndroidAppPromoModal;
