import React from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from "@mui/material";
import { SystemUpdateRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { API_ROOT_URL } from "../services/AuthService";

/** GET /api/v1/app-config (values come from the backend's environment). */
type PlatformConfig = { latestVersion: string; minVersion: string; storeUrl: string };
type AppConfig = { android?: PlatformConfig; ios?: PlatformConfig; message?: string };

type Prompt = { kind: "required" | "available"; latest: string; storeUrl: string; message: string };

const DISMISS_KEY = "app-update-dismissed";
/** "Later" hides the card for this version for a few days, then asks again. */
const SNOOZE_MS = 3 * 24 * 60 * 60 * 1000;
/** Re-check when the app comes back to the foreground, at most this often. */
const RECHECK_MS = 6 * 60 * 60 * 1000;

/** -1 / 0 / 1 for dotted numeric versions ("1.1.9" < "1.1.38"). */
export const compareVersions = (a: string, b: string): number => {
  const pa = a.split(".").map((n) => parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d < 0 ? -1 : 1;
  }
  return 0;
};

const snoozed = (latest: string) => {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const { version, at } = JSON.parse(raw) as { version?: string; at?: number };
    return version === latest && typeof at === "number" && Date.now() - at < SNOOZE_MS;
  } catch {
    return false;
  }
};

/** Decides what to show for this install, or null for nothing. */
export const pickPrompt = (config: AppConfig, platform: string, installed: string): Prompt | null => {
  const p = platform === "android" ? config.android : platform === "ios" ? config.ios : undefined;
  if (!p || !installed) return null;
  const message = config.message ?? "";
  if (p.minVersion && compareVersions(installed, p.minVersion) < 0) {
    return { kind: "required", latest: p.latestVersion || p.minVersion, storeUrl: p.storeUrl, message };
  }
  if (p.latestVersion && compareVersions(installed, p.latestVersion) < 0) {
    return { kind: "available", latest: p.latestVersion, storeUrl: p.storeUrl, message };
  }
  return null;
};

/**
 * Native apps only: asks people on an older version to update. "Update
 * available" can be put off; "Update required" (below the minimum version
 * set on the backend) can't be closed. Web visitors always get the latest
 * site, so nothing shows there.
 */
const AppUpdatePrompt: React.FC = () => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = React.useState<Prompt | null>(null);
  const lastCheckRef = React.useRef(0);

  const check = React.useCallback(async () => {
    lastCheckRef.current = Date.now();
    try {
      const [info, res] = await Promise.all([
        CapacitorApp.getInfo(),
        fetch(`${API_ROOT_URL}/api/v1/app-config`),
      ]);
      if (!res.ok) return;
      const config = (await res.json()) as AppConfig;
      const next = pickPrompt(config, Capacitor.getPlatform(), info.version);
      if (next?.kind === "available" && snoozed(next.latest)) return;
      setPrompt(next);
    } catch {
      // offline or old server: never block the app over this
    }
  }, []);

  React.useEffect(() => {
    if (!Capacitor.isNativePlatform()) return undefined;
    // Let the splash screen and first page settle first.
    const timer = window.setTimeout(check, 2500);
    const listener = CapacitorApp.addListener("resume", () => {
      if (Date.now() - lastCheckRef.current > RECHECK_MS) check();
    });
    return () => {
      window.clearTimeout(timer);
      void listener.then((l) => l.remove());
    };
  }, [check]);

  if (!prompt) return null;
  const required = prompt.kind === "required";

  const later = () => {
    try {
      localStorage.setItem(DISMISS_KEY, JSON.stringify({ version: prompt.latest, at: Date.now() }));
    } catch {
      // ignore
    }
    setPrompt(null);
  };
  const openStore = () => {
    window.open(prompt.storeUrl, "_blank");
  };

  return (
    <Dialog
      open
      onClose={required ? undefined : later}
      disableEscapeKeyDown={required}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}
    >
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2.25,
          textAlign: "center",
          color: "#fff",
          background: "radial-gradient(120% 140% at 50% 0%, #1d4a3c 0%, #0F2E25 55%, #0A1F1A 100%)",
          borderBottom: "3px solid #D9B45A",
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            mx: "auto",
            mb: 1.25,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            background: "rgba(217,180,90,0.16)",
            border: "1px solid rgba(217,180,90,0.55)",
            color: "#F1D68A",
          }}
        >
          <SystemUpdateRounded sx={{ fontSize: 34 }} />
        </Box>
        <Typography sx={{ color: "#fff !important", fontWeight: 900, fontSize: 20, lineHeight: 1.2 }}>
          {required ? t("Update required") : t("A new version is available")}
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.8) !important", fontWeight: 700, fontSize: 13.5, mt: 0.5 }}>
          {t("Version {{v}}", { v: prompt.latest })}
        </Typography>
      </Box>
      <DialogContent sx={{ pt: 2.25, pb: 1, textAlign: "center" }}>
        <Typography sx={{ color: "#0c3558 !important", fontWeight: 600, fontSize: 15, lineHeight: 1.5 }}>
          {prompt.message ||
            (required
              ? t("This version is no longer supported. Please update to keep scoring and watching matches.")
              : t("Update for the latest features and fixes, like live matches in Browse and a faster scoreboard."))}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 2.5, pb: 2.5, pt: 1.5, flexDirection: "column", gap: 1, "& > :not(style) ~ :not(style)": { ml: 0 } }}>
        <Button
          fullWidth
          variant="contained"
          onClick={openStore}
          data-ga-click={required ? "app_update_required" : "app_update_available"}
          sx={{ minHeight: 46, borderRadius: 99, fontWeight: 900, fontSize: 15 }}
        >
          {t("Update now")}
        </Button>
        {!required && (
          <Button fullWidth onClick={later} data-ga-click="app_update_later" sx={{ minHeight: 40, borderRadius: 99, fontWeight: 800 }}>
            {t("Later")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AppUpdatePrompt;
