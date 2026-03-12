import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputBase,
  MenuItem,
  Popover,
  Select,
  SelectChangeEvent,
  Switch,
  Typography,
} from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { supportedLanguages } from "../i18n";
import {
  AppPreferences,
  applyAppPreferences,
  defaultAppPreferences,
  getStoredAppPreferences,
  PREDEFINED_PLAYERS_UNLOCK_CODE,
  setStoredAppPreferences,
  themeGradients,
} from "../utils/appPreferences";
import {
  APP_VERSION_OLD,
  APP_VERSION_V1,
  AppVersion,
  getStoredAppVersion,
  setStoredAppVersion,
} from "../utils/constant";
import { modalSelectSx, sharedSelectMenuProps } from "../utils/selectStyles";

const primaryButtonSx = {
  textTransform: "none",
  fontWeight: 700,
  fontSize: "calc(14px * var(--app-font-scale, 1))",
  minHeight: 40,
  px: 2.25,
  py: 0.9,
  color: "#fff",
  borderRadius: 2,
  background:
    "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
  boxShadow:
    "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
  "&:hover": {
    background:
      "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
  },
};

const AppPreferencesDialog: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { i18n, t } = useTranslation();
  const [preferences, setPreferences] = useState<AppPreferences>(
    defaultAppPreferences,
  );
  const [enablePredefinedPlayers, setEnablePredefinedPlayers] = useState(false);
  const [predefinedPlayersCode, setPredefinedPlayersCode] = useState("");
  const [predefinedPlayersCodeError, setPredefinedPlayersCodeError] =
    useState("");
  const [predefinedPlayersStatus, setPredefinedPlayersStatus] = useState("");
  const [lang, setLang] = useState(i18n.language);
  const [appVersionInfoAnchor, setAppVersionInfoAnchor] =
    useState<HTMLElement | null>(null);
  const currentVersion: AppVersion = getStoredAppVersion();
  const [selectedVersion, setSelectedVersion] = useState<AppVersion>(
    getStoredAppVersion(),
  );
  const previewTheme =
    themeGradients[preferences.theme] ?? themeGradients.ocean;
  const previewFontScale =
    preferences.fontSize === "small"
      ? 0.92
      : preferences.fontSize === "large"
        ? 1.1
        : 1;

  useEffect(() => {
    if (!open) return;
    const stored = getStoredAppPreferences();
    setPreferences(stored);
    setEnablePredefinedPlayers(stored.predefinedPlayersEnabled);
    setPredefinedPlayersCode(stored.predefinedPlayersCode ?? "");
    setPredefinedPlayersCodeError("");
    setPredefinedPlayersStatus("");
    setLang(i18n.language);
    setSelectedVersion(currentVersion);
  }, [open, i18n.language, currentVersion]);

  const save = () => {
    let nextPreferences: AppPreferences = {
      ...preferences,
      predefinedPlayersEnabled: false,
      predefinedPlayersCode: "",
    };
    const enteredCode = predefinedPlayersCode.trim();

    if (enablePredefinedPlayers) {
      const alreadyEnabled = preferences.predefinedPlayersEnabled;
      const codeMatched = enteredCode === PREDEFINED_PLAYERS_UNLOCK_CODE;
      if (!alreadyEnabled && !codeMatched) {
        setPredefinedPlayersCodeError(
          t("Invalid code. Please enter the correct access code."),
        );
        setPredefinedPlayersStatus("");
        return;
      }
      if (enteredCode && !codeMatched) {
        setPredefinedPlayersCodeError(
          t("Invalid code. Please enter the correct access code."),
        );
        setPredefinedPlayersStatus("");
        return;
      }
      nextPreferences = {
        ...preferences,
        predefinedPlayersEnabled: alreadyEnabled || codeMatched,
        predefinedPlayersCode:
          alreadyEnabled && !enteredCode
            ? preferences.predefinedPlayersCode
            : enteredCode,
      };
    }

    setStoredAppPreferences(nextPreferences);
    applyAppPreferences(nextPreferences);
    const languageChanged = lang !== i18n.language;
    const versionChanged = selectedVersion !== currentVersion;

    if (languageChanged) {
      if (typeof window.gtag === "function") {
        window.gtag("event", "language_change", {
          event_category: "settings",
          event_label: lang,
        });
      }
      localStorage.setItem("selectedLang", lang);
    }

    if (versionChanged) {
      if (typeof window.gtag === "function") {
        window.gtag("event", "app_version_change", {
          event_category: "settings",
          event_label: selectedVersion,
        });
      }
      setStoredAppVersion(selectedVersion);
    }

    onClose();

    if (versionChanged) {
      window.location.reload();
      return;
    }

    if (languageChanged) {
      window.location.reload();
    }
  };

  const reset = () => {
    setPreferences(defaultAppPreferences);
    setEnablePredefinedPlayers(false);
    setPredefinedPlayersCode("");
    setPredefinedPlayersCodeError("");
    setPredefinedPlayersStatus("");
    setStoredAppPreferences(defaultAppPreferences);
    applyAppPreferences(defaultAppPreferences);
    onClose();
  };

  const recommendedChip = (
    <Chip
      label={t("Recommended")}
      size="small"
      sx={{
        ml: 1,
        height: 20,
        fontWeight: 700,
        color: "#fff",
        background:
          "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
      }}
    />
  );
  const latestChip = (
    <Chip
      label={t("Latest")}
      size="small"
      sx={{
        ml: 1,
        height: 20,
        fontWeight: 700,
        color: "#fff",
        background:
          "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
      }}
    />
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableScrollLock
      fullWidth
      maxWidth="xs"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 5,
          background:
            "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 14%, #e0eafc 86%) 0%, #f8fffc 100%)",
          boxShadow:
            "0 8px 32px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
          border: "2px solid var(--app-accent-start, #43cea2)",
          backdropFilter: "blur(8px)",
          width: { xs: "98vw", sm: "auto" },
          m: { xs: "8px", sm: 2 },
          p: { xs: 1.5, sm: 2 },
        },
      }}
    >
      <DialogTitle
        sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 800 }}
      >
        {t("App Preferences")}
      </DialogTitle>
      <DialogContent sx={{ width: "100%", px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Typography
              sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 600 }}
            >
              {t("App Version")}
            </Typography>
            <IconButton
              size="small"
              aria-label={t("App version info")}
              onClick={(event) => setAppVersionInfoAnchor(event.currentTarget)}
              sx={{
                p: 0.4,
                color: "var(--app-accent-text, #185a9d)",
                border:
                  "1px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 35%, transparent 65%)",
                background: "rgba(255,255,255,0.7)",
              }}
            >
              <InfoOutlined fontSize="small" />
            </IconButton>
          </Box>
          <Popover
            open={Boolean(appVersionInfoAnchor)}
            anchorEl={appVersionInfoAnchor}
            onClose={() => setAppVersionInfoAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{
              sx: {
                p: 1.25,
                borderRadius: 2,
                maxWidth: 260,
                background: "linear-gradient(135deg, #f8fffc 0%, #e0eafc 100%)",
                border:
                  "1px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 30%, transparent 70%)",
                boxShadow: "0 8px 24px rgba(8, 26, 56, 0.18)",
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "calc(12px * var(--app-font-scale, 1))",
              }}
            >
              {t("New")}
            </Typography>
            <Typography
              sx={{ fontSize: "calc(12px * var(--app-font-scale, 1))", mb: 1 }}
            >
              {t("Modern UI, enhanced player tools, and improved match flows.")}
            </Typography>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "calc(12px * var(--app-font-scale, 1))",
              }}
            >
              {t("Legacy")}
            </Typography>
            <Typography
              sx={{ fontSize: "calc(12px * var(--app-font-scale, 1))" }}
            >
              {t("Classic layout with simpler screens and familiar controls.")}
            </Typography>
          </Popover>
          <Select
            fullWidth
            variant="standard"
            input={<InputBase />}
            value={selectedVersion}
            sx={modalSelectSx}
            MenuProps={sharedSelectMenuProps}
            onChange={(e: SelectChangeEvent<string>) =>
              setSelectedVersion(e.target.value as AppVersion)
            }
          >
            <MenuItem value={APP_VERSION_V1}>
              <Box
                sx={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <span>{t("New")}</span>
                {latestChip}
              </Box>
            </MenuItem>
            <MenuItem value={APP_VERSION_OLD}>{t("Legacy")}</MenuItem>
          </Select>

          <Typography
            sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 600 }}
          >
            {t("Language")}
          </Typography>
          <Select
            fullWidth
            variant="standard"
            input={<InputBase />}
            value={lang}
            sx={modalSelectSx}
            MenuProps={sharedSelectMenuProps}
            onChange={(e: SelectChangeEvent<string>) =>
              setLang(e.target.value as string)
            }
          >
            {Object.entries(supportedLanguages).map(([code, name]) => (
              <MenuItem key={code} value={code}>
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <span>{name}</span>
                  {code === "en" ? recommendedChip : null}
                </Box>
              </MenuItem>
            ))}
          </Select>

          <Typography
            sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 600 }}
          >
            {t("Theme")}
          </Typography>
          <Select
            fullWidth
            variant="standard"
            input={<InputBase />}
            value={preferences.theme}
            sx={modalSelectSx}
            MenuProps={sharedSelectMenuProps}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                theme: e.target.value as AppPreferences["theme"],
              }))
            }
          >
            <MenuItem value="ocean">{t("Ocean")} </MenuItem>
            <MenuItem value="forest">{t("Forest")}</MenuItem>
            <MenuItem value="sky">{t("Sky")}</MenuItem>
            <MenuItem value="midnight">
              <Box
                sx={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <span>{t("Midnight")}</span>
                {recommendedChip}
              </Box>
            </MenuItem>
            <MenuItem value="rose">{t("Rose")}</MenuItem>
            <MenuItem value="aurora">{t("Aurora")}</MenuItem>
            <MenuItem value="sand">{t("Sand")}</MenuItem>
            <MenuItem value="cricketbuzz">{t("Cricketbuzz")}</MenuItem>
          </Select>

          <Box
            sx={{
              p: 1.25,
              borderRadius: 3,
              border:
                "1px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 45%, transparent 55%)",
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 12%, #f7fbff 88%) 0%, #f9fcff 100%)",
            }}
          >
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 700,
                fontSize: "calc(13px * var(--app-font-scale, 1))",
                mb: 1,
              }}
            >
              {t("Theme Preview")}
            </Typography>
            <Box
              sx={{
                borderRadius: 2.5,
                overflow: "hidden",
                border: `1px solid ${previewTheme.accentStart}`,
                background: previewTheme.page,
              }}
            >
              <Box
                sx={{
                  px: 1.5,
                  py: 1,
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: `${15 * previewFontScale}px`,
                  background: previewTheme.appBar,
                }}
              >
                {t("Cricket Score Counter")}
              </Box>
              <Box sx={{ p: 1.5 }}>
                <Typography
                  sx={{
                    color: previewTheme.accentText,
                    fontWeight: 700,
                    fontSize: `${14 * previewFontScale}px`,
                  }}
                >
                  {t("Score Preview")}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Box
                    sx={{
                      px: 1.25,
                      py: 0.6,
                      borderRadius: 1.5,
                      fontWeight: 700,
                      fontSize: `${13 * previewFontScale}px`,
                      color: "#fff",
                      background: `linear-gradient(90deg, ${previewTheme.accentStart} 0%, ${previewTheme.accentEnd} 100%)`,
                    }}
                  >
                    4
                  </Box>
                  <Box
                    sx={{
                      px: 1.25,
                      py: 0.6,
                      borderRadius: 1.5,
                      fontWeight: 700,
                      fontSize: `${13 * previewFontScale}px`,
                      color: previewTheme.accentText,
                      border: `1px solid ${previewTheme.accentStart}`,
                      background: "rgba(255,255,255,0.78)",
                    }}
                  >
                    W
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          <Typography
            sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 600 }}
          >
            {t("Font Size")}
          </Typography>
          <Select
            fullWidth
            variant="standard"
            input={<InputBase />}
            value={preferences.fontSize}
            sx={modalSelectSx}
            MenuProps={sharedSelectMenuProps}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                fontSize: e.target.value as AppPreferences["fontSize"],
              }))
            }
          >
            <MenuItem value="small">{t("Small")}</MenuItem>
            <MenuItem value="medium">
              <Box
                sx={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <span>{t("Medium")}</span>
                {recommendedChip}
              </Box>
            </MenuItem>
            <MenuItem value="large">{t("Large")}</MenuItem>
          </Select>

          <Box
            sx={{
              p: 1.25,
              borderRadius: 3,
              border:
                "1px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 45%, transparent 55%)",
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 10%, #f7fbff 90%) 0%, #f9fcff 100%)",
            }}
          >
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 700,
                fontSize: "calc(13px * var(--app-font-scale, 1))",
                mb: 0.75,
              }}
            >
              {t("Font Size Preview")}
            </Typography>
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 800,
                fontSize: `${18 * previewFontScale}px`,
                lineHeight: 1.25,
              }}
            >
              {t("Match Summary")}
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 600,
                fontSize: `${14 * previewFontScale}px`,
                opacity: 0.95,
              }}
            >
              {t("Score: 36/2 in 4.0 overs")}
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                color: "var(--app-accent-text, #185a9d)",
                fontSize: `${12 * previewFontScale}px`,
                opacity: 0.88,
              }}
            >
              {t("This preview shows how text will appear across the app.")}
            </Typography>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={preferences.reducedMotion}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    reducedMotion: e.target.checked,
                  }))
                }
              />
            }
            label={t("Reduce Motion")}
            sx={{
              color: "var(--app-accent-text, #185a9d)",
              "& .MuiFormControlLabel-label": { fontWeight: 600 },
            }}
          />
          <Typography
            sx={{
              mt: -1,
              color: "var(--app-accent-text, #185a9d)",
              opacity: 0.88,
              fontSize: "calc(12px * var(--app-font-scale, 1))",
              pl: 0.5,
            }}
          >
            {t(
              "Minimizes animations and transitions for a steadier, more comfortable experience.",
            )}
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={preferences.compactMode}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    compactMode: e.target.checked,
                  }))
                }
              />
            }
            label={t("Compact Mode")}
            sx={{
              color: "var(--app-accent-text, #185a9d)",
              "& .MuiFormControlLabel-label": { fontWeight: 600 },
            }}
          />
          <Typography
            sx={{
              mt: -1,
              color: "var(--app-accent-text, #185a9d)",
              opacity: 0.88,
              fontSize: "calc(12px * var(--app-font-scale, 1))",
              pl: 0.5,
            }}
          >
            {t(
              "Reduces spacing and component height to fit more controls and scores on screen.",
            )}
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={preferences.singlePlayerModeEnabled}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    singlePlayerModeEnabled: e.target.checked,
                  }))
                }
              />
            }
            label={t("Allow Single Player Mode")}
            sx={{
              color: "var(--app-accent-text, #185a9d)",
              "& .MuiFormControlLabel-label": { fontWeight: 600 },
            }}
          />
          <Typography
            sx={{
              mt: -1,
              color: "var(--app-accent-text, #185a9d)",
              opacity: 0.88,
              fontSize: "calc(12px * var(--app-font-scale, 1))",
              pl: 0.5,
            }}
          >
            {t(
              "Enables Extra Player (Dummy) as non-striker/replacement when only one real batter is left.",
            )}
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={enablePredefinedPlayers}
                onChange={(e) => {
                  setEnablePredefinedPlayers(e.target.checked);
                  setPredefinedPlayersCodeError("");
                  setPredefinedPlayersStatus("");
                }}
              />
            }
            label={t("Load Predefined Players")}
            sx={{
              color: "var(--app-accent-text, #185a9d)",
              "& .MuiFormControlLabel-label": { fontWeight: 600 },
            }}
          />
          <Typography
            sx={{
              mt: -1,
              color: "var(--app-accent-text, #185a9d)",
              opacity: 0.88,
              fontSize: "calc(12px * var(--app-font-scale, 1))",
              pl: 0.5,
            }}
          >
            {t(
              "Unlock private predefined player list and quickly add players while creating teams.",
            )}
          </Typography>
          {enablePredefinedPlayers && (
            <Box sx={{ mt: -1 }}>
              <InputBase
                value={predefinedPlayersCode}
                onChange={(e) => {
                  setPredefinedPlayersCode(e.target.value);
                  setPreferences((prev) => ({
                    ...prev,
                    predefinedPlayersCode: e.target.value,
                  }));
                  if (predefinedPlayersCodeError) {
                    setPredefinedPlayersCodeError("");
                  }
                  if (predefinedPlayersStatus) {
                    setPredefinedPlayersStatus("");
                  }
                }}
                placeholder={t("Enter access code")}
                fullWidth
                sx={{
                  px: 1.25,
                  py: 0.8,
                  borderRadius: 2,
                  background: "#fff",
                  border:
                    "1px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 40%, transparent 60%)",
                  fontWeight: 600,
                }}
              />
              <Typography
                sx={{
                  mt: 0.6,
                  color: predefinedPlayersCodeError
                    ? "#e53935"
                    : "var(--app-accent-text, #185a9d)",
                  opacity: predefinedPlayersCodeError ? 1 : 0.88,
                  fontSize: "calc(12px * var(--app-font-scale, 1))",
                  pl: 0.4,
                }}
              >
                {predefinedPlayersCodeError ||
                  predefinedPlayersStatus ||
                  t(
                    "Enter your private access code to enable predefined players.",
                  )}
              </Typography>
              <Button
                data-ga-click="load_predefined_players_code"
                variant="outlined"
                onClick={() => {
                  if (
                    predefinedPlayersCode.trim() ===
                    PREDEFINED_PLAYERS_UNLOCK_CODE
                  ) {
                    setPreferences((prev) => ({
                      ...prev,
                      predefinedPlayersEnabled: true,
                      predefinedPlayersCode: predefinedPlayersCode.trim(),
                    }));
                    setPredefinedPlayersCodeError("");
                    setPredefinedPlayersStatus(
                      t("Predefined players unlocked. Click Save."),
                    );
                  } else {
                    setPredefinedPlayersCodeError(
                      t("Invalid code. Please enter the correct access code."),
                    );
                    setPredefinedPlayersStatus("");
                  }
                }}
                sx={{
                  mt: 1,
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 2,
                  borderColor: "var(--app-accent-start, #43cea2)",
                  color: "var(--app-accent-text, #185a9d)",
                }}
              >
                {t("Load Players")}
              </Button>
              <Button
                data-ga-click="clear_predefined_players_code"
                variant="text"
                onClick={() => {
                  setPredefinedPlayersCode("");
                  setPreferences((prev) => ({
                    ...prev,
                    predefinedPlayersEnabled: false,
                    predefinedPlayersCode: "",
                  }));
                  setPredefinedPlayersCodeError("");
                  setPredefinedPlayersStatus("");
                }}
                sx={{
                  mt: 0.5,
                  ml: 0.5,
                  textTransform: "none",
                  fontWeight: 600,
                  color: "var(--app-accent-text, #185a9d)",
                }}
              >
                {t("Clear")}
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: "space-between" }}>
        <Button data-ga-click="reset_app_preferences" onClick={reset}>
          {t("Reset")}
        </Button>
        <Button
          data-ga-click="save_app_preferences"
          variant="contained"
          onClick={save}
          sx={primaryButtonSx}
        >
          {t("Save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppPreferencesDialog;
