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
import CampaignRounded from "@mui/icons-material/CampaignRounded";
import SportsCricketRounded from "@mui/icons-material/SportsCricketRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import GetAppRounded from "@mui/icons-material/GetAppRounded";
import { Capacitor } from "@capacitor/core";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ANDROID_APP_URL } from "../utils/constant";

// Bump this whenever a new announcement should be shown again to everyone,
// even people who already dismissed a previous one — it's part of the
// storage key, so an old "seen" flag from a previous announcement simply
// won't match and the modal opens again under the new key.
const ANNOUNCEMENT_ID = "by-balls-match-mode";
const ANNOUNCEMENT_SEEN_KEY = `cricket-score-counter-announcement-${ANNOUNCEMENT_ID}-seen`;
const APP_PROMO_SESSION_KEY = "cricket-score-counter-android-app-promo-seen";

// A short delay before opening, rather than showing instantly on mount, so
// it doesn't flash in before the page underneath has settled.
const OPEN_DELAY_MS = 500;

const hasSeenAnnouncement = () => {
  try {
    return window.localStorage.getItem(ANNOUNCEMENT_SEEN_KEY) === "true";
  } catch {
    return false;
  }
};

const markAnnouncementSeen = () => {
  try {
    window.localStorage.setItem(ANNOUNCEMENT_SEEN_KEY, "true");
  } catch {
    // Some privacy modes can block localStorage; the modal can still close.
  }
};

const hasSeenAppPromoThisSession = () => {
  try {
    return window.sessionStorage.getItem(APP_PROMO_SESSION_KEY) === "true";
  } catch {
    return false;
  }
};

const markAppPromoSeenThisSession = () => {
  try {
    window.sessionStorage.setItem(APP_PROMO_SESSION_KEY, "true");
  } catch {
    // Some privacy modes can block sessionStorage; the modal can still close.
  }
};

// A small self-contained "what's new" item: icon, eyebrow label, headline,
// one line of copy, and its own single action — rather than long shared
// paragraphs plus a crowded row of buttons at the bottom, each item reads
// like one clean card in a short list.
const AnnouncementItem: React.FC<{
  icon: React.ReactNode;
  eyebrow: string;
  headline: string;
  body: string;
  actionLabel: string;
  actionIcon: React.ReactNode;
  onAction: () => void;
  actionHref?: string;
}> = ({ icon, eyebrow, headline, body, actionLabel, actionIcon, onAction, actionHref }) => (
  <Box
    sx={{
      display: "flex",
      gap: 1.4,
      alignItems: "flex-start",
      p: 1.6,
      borderRadius: 3,
      border: "1px solid rgba(24, 90, 157, 0.14)",
      background: "#ffffff",
    }}
  >
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: 2.5,
        display: "grid",
        placeItems: "center",
        color: "#fff",
        flex: "0 0 auto",
        background:
          "linear-gradient(135deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
      }}
    >
      {icon}
    </Box>
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography
        sx={{
          fontSize: "calc(10.5px * var(--app-font-scale, 1))",
          fontWeight: 900,
          letterSpacing: 0.6,
          textTransform: "uppercase",
          color: "var(--app-accent-text, #185a9d)",
          mb: 0.2,
        }}
      >
        {eyebrow}
      </Typography>
      <Typography
        sx={{
          color: "#082846",
          fontWeight: 800,
          lineHeight: 1.25,
          fontSize: "calc(15.5px * var(--app-font-scale, 1))",
        }}
      >
        {headline}
      </Typography>
      <Typography
        sx={{
          mt: 0.4,
          color: "rgba(20, 58, 96, 0.82)",
          fontWeight: 500,
          lineHeight: 1.5,
          fontSize: "calc(13px * var(--app-font-scale, 1))",
        }}
      >
        {body}
      </Typography>
      <Button
        {...(actionHref
          ? { component: "a", href: actionHref, target: "_blank", rel: "noopener noreferrer" }
          : {})}
        onClick={onAction}
        size="small"
        startIcon={actionIcon}
        sx={{
          mt: 1,
          minHeight: 34,
          px: 1.4,
          borderRadius: 999,
          fontWeight: 800,
          textTransform: "none",
          fontSize: "calc(12.5px * var(--app-font-scale, 1))",
          color: "#fff",
          background:
            "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
          "&:hover": {
            background:
              "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
          },
        }}
      >
        {actionLabel}
      </Button>
    </Box>
  </Box>
);

// Combines every first-visit popup (the "by balls" match-mode announcement
// and the Android app promo) into a single Dialog, so a person never has to
// close two separate modals back to back. Each piece only appears if it's
// still applicable (not already seen, app promo only outside the native
// app, etc.) — if neither applies, nothing opens at all.
const FirstVisitModal: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [showAnnouncement, setShowAnnouncement] = React.useState(false);
  const [showAppPromo, setShowAppPromo] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined" || navigator.userAgent === "ReactSnap") {
      return undefined;
    }

    const announcementApplicable = !hasSeenAnnouncement();
    const appPromoApplicable =
      Boolean(ANDROID_APP_URL) &&
      !Capacitor.isNativePlatform() &&
      !hasSeenAppPromoThisSession();

    if (!announcementApplicable && !appPromoApplicable) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setShowAnnouncement(announcementApplicable);
      setShowAppPromo(appPromoApplicable);
      setOpen(true);
    }, OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const dismissAll = () => {
    if (showAnnouncement) markAnnouncementSeen();
    if (showAppPromo) markAppPromoSeenThisSession();
    setOpen(false);
  };

  const handleTryBallsMode = () => {
    dismissAll();
    // Preselect the "Balls" toggle on the match setup screen so the person
    // doesn't have to switch it themselves right after asking to try it.
    navigate("/create-game", { state: { defaultMatchLengthMode: "balls" } });
  };

  const bothShown = showAnnouncement && showAppPromo;
  const title = bothShown
    ? t("What's new")
    : showAnnouncement
      ? t("New match mode")
      : t("Get the Android app");
  const subtitle = bothShown
    ? t("A couple of quick updates")
    : showAnnouncement
      ? t("Start a match by balls")
      : t("Now available on Google Play");

  return (
    <Dialog
      open={open}
      onClose={dismissAll}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          width: { xs: "calc(100% - 24px)", sm: 420 },
          m: { xs: 1.5, sm: 2 },
          background: "#ffffff",
          boxShadow: "0 22px 70px rgba(4, 26, 58, 0.28)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          px: { xs: 2.2, sm: 3 },
          py: { xs: 2, sm: 2.4 },
          background:
            "linear-gradient(135deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
        }}
      >
        <IconButton
          aria-label={t("Close")}
          onClick={dismissAll}
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "#fff",
            background: "rgba(255,255,255,0.18)",
            "&:hover": { background: "rgba(255,255,255,0.3)" },
          }}
        >
          <CloseRounded fontSize="small" />
        </IconButton>
        <Stack direction="row" spacing={1.2} alignItems="center" sx={{ pr: 4 }}>
          <CampaignRounded sx={{ color: "#fff", fontSize: 26 }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="h2"
              sx={{
                color: "#fff",
                fontWeight: 900,
                lineHeight: 1.15,
                fontSize: {
                  xs: "calc(18px * var(--app-font-scale, 1))",
                  sm: "calc(20px * var(--app-font-scale, 1))",
                },
              }}
            >
              {title}
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.85)",
                fontWeight: 600,
                fontSize: "calc(12.5px * var(--app-font-scale, 1))",
              }}
            >
              {subtitle}
            </Typography>
          </Box>
        </Stack>
      </Box>
      <DialogContent
        sx={{
          px: { xs: 1.8, sm: 2.2 },
          py: 1.8,
          background: "#f4f8fb",
        }}
      >
        <Stack spacing={1.2}>
          {showAnnouncement && (
            <AnnouncementItem
              icon={<SportsCricketRounded fontSize="small" />}
              eyebrow={t("NEW MATCH MODE")}
              headline={t("Start a match by balls")}
              body={t(
                "Play in sets of 5 balls instead of 6-ball overs, just like The Hundred."
              )}
              actionLabel={t("Try it now")}
              actionIcon={<PlayArrowRounded fontSize="small" />}
              onAction={handleTryBallsMode}
            />
          )}
          {showAppPromo && (
            <AnnouncementItem
              icon={<GetAppRounded fontSize="small" />}
              eyebrow={t("ANDROID APP")}
              headline={t("Get the Android app")}
              body={t("Score matches faster with our free Android app.")}
              actionLabel={t("Open Play Store")}
              actionIcon={<GetAppRounded fontSize="small" />}
              onAction={dismissAll}
              actionHref={ANDROID_APP_URL}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: { xs: 1.8, sm: 2.2 }, pb: 2, pt: 0, background: "#f4f8fb" }}>
        <Button
          onClick={dismissAll}
          fullWidth
          sx={{
            color: "rgba(20, 58, 96, 0.65)",
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          {t("Got it")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FirstVisitModal;
