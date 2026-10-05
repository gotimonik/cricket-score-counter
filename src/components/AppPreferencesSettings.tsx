import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  ButtonBase,
  GlobalStyles,
  InputBase,
  Snackbar,
  Switch,
  Typography,
} from "@mui/material";
import {
  CheckRounded,
  PaletteRounded,
  RestartAltRounded,
  SportsCricketRounded,
  TextFieldsRounded,
  TuneRounded,
  LockOpenRounded,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  AppFontSize,
  AppPreferences,
  AppTheme,
  applyAppPreferences,
  defaultAppPreferences,
  getStoredAppPreferences,
  PREDEFINED_PLAYERS_UNLOCK_CODE,
  setStoredAppPreferences,
  themeGradients,
} from "../utils/appPreferences";

const accentText = "var(--app-accent-text, #185a9d)";

const THEME_OPTIONS: { value: AppTheme; label: string; recommended?: boolean }[] = [
  { value: "ocean", label: "Ocean" },
  { value: "midnight", label: "Midnight", recommended: true },
  { value: "forest", label: "Forest" },
  { value: "sky", label: "Sky" },
  { value: "aurora", label: "Aurora" },
  { value: "cricketbuzz", label: "Cricketbuzz" },
  { value: "rose", label: "Rose" },
  { value: "sand", label: "Sand" },
];

const FONT_OPTIONS: { value: AppFontSize; label: string; sample: number; scale: number }[] = [
  { value: "small", label: "Small", sample: 15, scale: 0.92 },
  { value: "medium", label: "Medium", sample: 19, scale: 1 },
  { value: "large", label: "Large", sample: 23, scale: 1.1 },
];

const primaryButtonSx = {
  textTransform: "none",
  fontWeight: 800,
  fontSize: "calc(15px * var(--app-font-scale, 1))",
  minHeight: 46,
  px: { xs: 2.25, sm: 3 },
  color: "#fff",
  borderRadius: 999,
  background:
    "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
  boxShadow:
    "0 6px 16px color-mix(in srgb, var(--app-accent-end, #185a9d) 30%, transparent 70%)",
  "&:hover": {
    background:
      "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
  },
  "&.Mui-disabled": {
    color: "rgba(255,255,255,0.9)",
    background: "rgba(24,90,157,0.35)",
    boxShadow: "none",
  },
} as const;

const sectionCardSx = {
  p: { xs: 1.5, sm: 2.25 },
  "@media (max-width: 359px)": { p: 1.25 },
  borderRadius: 3,
  border:
    "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 30%, transparent 70%)",
  background: "rgba(255,255,255,0.82)",
  boxShadow:
    "0 2px 10px color-mix(in srgb, var(--app-accent-end, #185a9d) 8%, transparent 92%)",
} as const;

const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}> = ({ icon, title, subtitle }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25, mb: 1.75 }}>
    <Box
      sx={{
        width: 36,
        height: 36,
        flexShrink: 0,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        background:
          "linear-gradient(135deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
      }}
    >
      {icon}
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography
        component="h2"
        sx={{
          color: accentText,
          fontWeight: 800,
          fontSize: "calc(17px * var(--app-font-scale, 1))",
          lineHeight: 1.3,
        }}
      >
        {title}
      </Typography>
      {subtitle ? (
        <Typography
          sx={{
            color: accentText,
            opacity: 0.8,
            fontSize: "calc(13px * var(--app-font-scale, 1))",
          }}
        >
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  </Box>
);

const ToggleRow: React.FC<{
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  gaKey: string;
  divider?: boolean;
}> = ({ label, description, checked, onChange, gaKey, divider }) => (
  <Box
    component="label"
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      py: 1.25,
      cursor: "pointer",
      borderTop: divider ? "1px solid rgba(24,90,157,0.1)" : "none",
    }}
  >
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        sx={{
          color: accentText,
          fontWeight: 700,
          fontSize: "calc(15px * var(--app-font-scale, 1))",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: accentText,
          opacity: 0.8,
          fontSize: "calc(13px * var(--app-font-scale, 1))",
          lineHeight: 1.45,
        }}
      >
        {description}
      </Typography>
    </Box>
    <Switch
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      inputProps={{ "aria-label": label, "data-ga-click": gaKey } as any}
    />
  </Box>
);

const prefsKey = (p: AppPreferences, predefinedEnabled: boolean) =>
  JSON.stringify({
    theme: p.theme,
    fontSize: p.fontSize,
    reducedMotion: p.reducedMotion,
    compactMode: p.compactMode,
    singlePlayerModeEnabled: p.singlePlayerModeEnabled,
    predefinedEnabled,
    predefinedPlayersEnabled: p.predefinedPlayersEnabled,
  });

interface AppPreferencesSettingsProps {
  /** "page": /app-preferences (fixed bottom bar, goes home after saving).
   *  "dialog": opened over a live game (bar sticks to the dialog bottom,
   *  calls onSaved instead of navigating so the game is never left). */
  variant?: "page" | "dialog";
  onSaved?: () => void;
}

const AppPreferencesSettings: React.FC<AppPreferencesSettingsProps> = ({
  variant = "page",
  onSaved,
}) => {
  const isDialog = variant === "dialog";
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [savedPreferences, setSavedPreferences] = useState<AppPreferences>(
    defaultAppPreferences,
  );
  const [preferences, setPreferences] = useState<AppPreferences>(
    defaultAppPreferences,
  );
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [enablePredefinedPlayers, setEnablePredefinedPlayers] = useState(false);
  const [predefinedPlayersCode, setPredefinedPlayersCode] = useState("");
  const [predefinedPlayersCodeError, setPredefinedPlayersCodeError] =
    useState("");
  const [predefinedPlayersStatus, setPredefinedPlayersStatus] = useState("");

  useEffect(() => {
    const stored = getStoredAppPreferences();
    setSavedPreferences(stored);
    setPreferences(stored);
    setEnablePredefinedPlayers(stored.predefinedPlayersEnabled);
    setPredefinedPlayersCode(stored.predefinedPlayersCode ?? "");
  }, []);

  const isDirty = useMemo(
    () =>
      prefsKey(preferences, enablePredefinedPlayers) !==
        prefsKey(savedPreferences, savedPreferences.predefinedPlayersEnabled) ||
      (enablePredefinedPlayers &&
        predefinedPlayersCode.trim() !==
          (savedPreferences.predefinedPlayersCode ?? "")),
    [preferences, enablePredefinedPlayers, savedPreferences, predefinedPlayersCode],
  );

  const isDefault =
    prefsKey(preferences, enablePredefinedPlayers) ===
    prefsKey(defaultAppPreferences, false);

  const previewTheme = themeGradients[preferences.theme] ?? themeGradients.ocean;
  const previewFontScale =
    FONT_OPTIONS.find((option) => option.value === preferences.fontSize)?.scale ?? 1;

  const update = (patch: Partial<AppPreferences>) =>
    setPreferences((prev) => ({ ...prev, ...patch }));

  const save = () => {
    let nextPreferences: AppPreferences = {
      ...preferences,
      predefinedPlayersEnabled: false,
      predefinedPlayersCode: "",
    };
    const enteredCode = predefinedPlayersCode.trim();

    if (enablePredefinedPlayers) {
      const alreadyEnabled = savedPreferences.predefinedPlayersEnabled;
      const codeMatched = enteredCode === PREDEFINED_PLAYERS_UNLOCK_CODE;
      if ((!alreadyEnabled && !codeMatched) || (enteredCode && !codeMatched)) {
        setPredefinedPlayersCodeError(
          t("Invalid code. Please enter the correct access code."),
        );
        setPredefinedPlayersStatus("");
        setToast(t("Please check the access code before saving."));
        return;
      }
      nextPreferences = {
        ...preferences,
        predefinedPlayersEnabled: alreadyEnabled || codeMatched,
        predefinedPlayersCode:
          alreadyEnabled && !enteredCode
            ? savedPreferences.predefinedPlayersCode
            : enteredCode,
      };
    }

    setSaving(true);
    setStoredAppPreferences(nextPreferences);
    applyAppPreferences(nextPreferences);
    setSavedPreferences(nextPreferences);
    setPreferences(nextPreferences);
    setToast(t("Preferences saved"));

    window.setTimeout(
      () => {
        setSaving(false);
        if (onSaved) onSaved();
        else navigate("/");
      },
      onSaved ? 500 : 900,
    );
  };

  const reset = () => {
    setPreferences({ ...defaultAppPreferences });
    setEnablePredefinedPlayers(false);
    setPredefinedPlayersCode("");
    setPredefinedPlayersCodeError("");
    setPredefinedPlayersStatus("");
    setToast(t("Defaults restored. Tap Save to apply."));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
      {/* Appearance */}
      <Box component="section" sx={sectionCardSx}>
        <SectionHeader
          icon={<PaletteRounded fontSize="small" />}
          title={t("Theme")}
          subtitle={t("Pick the colours used across the app.")}
        />
        <Box
          role="radiogroup"
          aria-label={t("Theme")}
          sx={{
            display: "grid",
            // minmax(0, 1fr): columns can shrink on very narrow phones (320px)
            // instead of the long "Cricketbuzz" label pushing the grid wider
            // than the card.
            // Phones fit as many 72px+ columns as there is room for (3 on a
            // 320px screen, 4 on most phones) so names never wrap mid-word.
            gridTemplateColumns: {
              xs: "repeat(auto-fill, minmax(72px, 1fr))",
              sm: "repeat(8, minmax(0, 1fr))",
            },
            gap: { xs: 0.75, sm: 1.25 },
          }}
        >
          {THEME_OPTIONS.map((option) => {
            const swatch = themeGradients[option.value];
            const selected = preferences.theme === option.value;
            return (
              <ButtonBase
                key={option.value}
                role="radio"
                aria-checked={selected}
                data-ga-click={`select_theme_${option.value}`}
                onClick={() => update({ theme: option.value })}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 0.6,
                  py: { xs: 0.5, sm: 0.75 },
                  px: { xs: 0.25, sm: 0.75 },
                  minWidth: 0,
                  borderRadius: 2.5,
                  border: selected
                    ? "2px solid var(--app-accent-end, #185a9d)"
                    : "2px solid transparent",
                  background: selected ? "rgba(24,90,157,0.06)" : "transparent",
                  transition: "background 0.2s ease",
                }}
              >
                <Box
                  sx={{
                    width: "clamp(36px, 11vw, 48px)",
                    height: "clamp(36px, 11vw, 48px)",
                    borderRadius: "50%",
                    background: swatch.page,
                    border: `3px solid ${swatch.accentStart}`,
                    boxShadow: "0 3px 8px rgba(8,26,56,0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  {selected ? (
                    <CheckRounded sx={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }} />
                  ) : null}
                </Box>
                <Typography
                  sx={{
                    color: accentText,
                    fontWeight: selected ? 800 : 600,
                    fontSize: {
                      xs: "calc(11px * var(--app-font-scale, 1))",
                      sm: "calc(12px * var(--app-font-scale, 1))",
                    },
                    lineHeight: 1.2,
                    textAlign: "center",
                    maxWidth: "100%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {t(option.label)}
                </Typography>
                {option.recommended ? (
                  <Typography
                    sx={{
                      mt: -0.4,
                      color: accentText,
                      opacity: 0.75,
                      fontSize: {
                        xs: "calc(9px * var(--app-font-scale, 1))",
                        sm: "calc(10px * var(--app-font-scale, 1))",
                      },
                      fontWeight: 700,
                      maxWidth: "100%",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t("Recommended")}
                  </Typography>
                ) : null}
              </ButtonBase>
            );
          })}
        </Box>
      </Box>

      {/* Text size */}
      <Box component="section" sx={sectionCardSx}>
        <SectionHeader
          icon={<TextFieldsRounded fontSize="small" />}
          title={t("Text Size")}
          subtitle={t("Make text easier to read on your screen.")}
        />
        <Box
          role="radiogroup"
          aria-label={t("Text Size")}
          sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}
        >
          {FONT_OPTIONS.map((option) => {
            const selected = preferences.fontSize === option.value;
            return (
              <ButtonBase
                key={option.value}
                role="radio"
                aria-checked={selected}
                data-ga-click={`select_font_${option.value}`}
                onClick={() => update({ fontSize: option.value })}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  py: 1.25,
                  borderRadius: 2.5,
                  border: selected
                    ? "2px solid var(--app-accent-end, #185a9d)"
                    : "1.5px solid rgba(24,90,157,0.2)",
                  background: selected
                    ? "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-start, #43cea2) 18%, #fff 82%) 0%, #fff 100%)"
                    : "#fff",
                }}
              >
                <Typography
                  sx={{ color: accentText, fontWeight: 900, fontSize: option.sample, lineHeight: 1.2 }}
                >
                  Aa
                </Typography>
                <Typography
                  sx={{
                    color: accentText,
                    fontWeight: selected ? 800 : 600,
                    fontSize: "calc(13px * var(--app-font-scale, 1))",
                  }}
                >
                  {t(option.label)}
                </Typography>
              </ButtonBase>
            );
          })}
        </Box>

        {/* Live preview of theme + text size together */}
        <Box
          aria-label={t("Preview")}
          sx={{
            mt: 2,
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
              fontSize: `${14 * previewFontScale}px`,
              background: previewTheme.appBar,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{t("Preview")}</span>
            <span>{t("Live")}</span>
          </Box>
          <Box sx={{ p: 1.5 }}>
            <Box
              sx={{
                p: 1.25,
                borderRadius: 2,
                background: "rgba(255,255,255,0.9)",
              }}
            >
              <Typography
                sx={{ color: previewTheme.accentText, fontWeight: 800, fontSize: `${17 * previewFontScale}px` }}
              >
                {t("Lions 87/3")}
              </Typography>
              <Typography
                sx={{ color: previewTheme.accentText, fontWeight: 600, fontSize: `${13 * previewFontScale}px`, opacity: 0.9 }}
              >
                {t("11.4 overs · Run rate 7.46")}
              </Typography>
              <Box sx={{ display: "flex", gap: 0.75, mt: 1 }}>
                {["1", "4", "•", "W", "6"].map((ball, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 30 * previewFontScale,
                      height: 30 * previewFontScale,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: `${12 * previewFontScale}px`,
                      color: ball === "4" || ball === "6" ? "#fff" : previewTheme.accentText,
                      background:
                        ball === "4" || ball === "6"
                          ? `linear-gradient(90deg, ${previewTheme.accentStart} 0%, ${previewTheme.accentEnd} 100%)`
                          : "#fff",
                      border: `1px solid ${previewTheme.accentStart}`,
                    }}
                  >
                    {ball}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Display & accessibility */}
      <Box component="section" sx={sectionCardSx}>
        <SectionHeader
          icon={<TuneRounded fontSize="small" />}
          title={t("Display & Accessibility")}
        />
        <ToggleRow
          label={t("Reduce Motion")}
          description={t(
            "Minimizes animations and transitions for a steadier, more comfortable experience.",
          )}
          checked={preferences.reducedMotion}
          onChange={(checked) => update({ reducedMotion: checked })}
          gaKey="toggle_reduce_motion"
        />
        <ToggleRow
          divider
          label={t("Compact Mode")}
          description={t(
            "Reduces spacing and component height to fit more controls and scores on screen.",
          )}
          checked={preferences.compactMode}
          onChange={(checked) => update({ compactMode: checked })}
          gaKey="toggle_compact_mode"
        />
      </Box>

      {/* Scoring */}
      <Box component="section" sx={sectionCardSx}>
        <SectionHeader
          icon={<SportsCricketRounded fontSize="small" />}
          title={t("Scoring")}
        />
        <ToggleRow
          label={t("Allow Single Player Mode")}
          description={t(
            "Enables Extra Player (Dummy) as non-striker/replacement when only one real batter is left.",
          )}
          checked={preferences.singlePlayerModeEnabled}
          onChange={(checked) => update({ singlePlayerModeEnabled: checked })}
          gaKey="toggle_single_player_mode"
        />
      </Box>

      {/* Advanced */}
      <Box component="section" sx={sectionCardSx}>
        <SectionHeader
          icon={<LockOpenRounded fontSize="small" />}
          title={t("Advanced")}
        />
        <ToggleRow
          label={t("Load Predefined Players")}
          description={t(
            "Unlock private predefined player list and quickly add players while creating teams.",
          )}
          checked={enablePredefinedPlayers}
          onChange={(checked) => {
            setEnablePredefinedPlayers(checked);
            setPredefinedPlayersCodeError("");
            setPredefinedPlayersStatus("");
          }}
          gaKey="toggle_predefined_players"
        />
        {enablePredefinedPlayers && (
          <Box sx={{ mt: 0.5 }}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
              <InputBase
                value={predefinedPlayersCode}
                onChange={(event) => {
                  setPredefinedPlayersCode(event.target.value);
                  update({ predefinedPlayersCode: event.target.value });
                  setPredefinedPlayersCodeError("");
                  setPredefinedPlayersStatus("");
                }}
                placeholder={t("Enter access code")}
                inputProps={{ "aria-label": t("Enter access code") }}
                fullWidth
                sx={{
                  px: 1.5,
                  py: 0.8,
                  borderRadius: 2,
                  background: "#fff",
                  border: predefinedPlayersCodeError
                    ? "1.5px solid #e53935"
                    : "1px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 40%, transparent 60%)",
                  fontWeight: 600,
                }}
              />
              <Button
                data-ga-click="load_predefined_players_code"
                variant="outlined"
                onClick={() => {
                  if (predefinedPlayersCode.trim() === PREDEFINED_PLAYERS_UNLOCK_CODE) {
                    update({
                      predefinedPlayersEnabled: true,
                      predefinedPlayersCode: predefinedPlayersCode.trim(),
                    });
                    setPredefinedPlayersCodeError("");
                    setPredefinedPlayersStatus(t("Predefined players unlocked. Click Save."));
                  } else {
                    setPredefinedPlayersCodeError(
                      t("Invalid code. Please enter the correct access code."),
                    );
                    setPredefinedPlayersStatus("");
                  }
                }}
                sx={{
                  flexShrink: 0,
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 2,
                  borderColor: "var(--app-accent-start, #43cea2)",
                  color: accentText,
                }}
              >
                {t("Load Players")}
              </Button>
              <Button
                data-ga-click="clear_predefined_players_code"
                variant="text"
                onClick={() => {
                  setPredefinedPlayersCode("");
                  update({ predefinedPlayersEnabled: false, predefinedPlayersCode: "" });
                  setPredefinedPlayersCodeError("");
                  setPredefinedPlayersStatus("");
                }}
                sx={{ flexShrink: 0, textTransform: "none", fontWeight: 600, color: accentText }}
              >
                {t("Clear")}
              </Button>
            </Box>
            <Typography
              role={predefinedPlayersCodeError ? "alert" : undefined}
              sx={{
                mt: 0.75,
                color: predefinedPlayersCodeError ? "#e53935" : accentText,
                opacity: predefinedPlayersCodeError ? 1 : 0.85,
                fontSize: "calc(12px * var(--app-font-scale, 1))",
              }}
            >
              {predefinedPlayersCodeError ||
                predefinedPlayersStatus ||
                t("Enter your private access code to enable predefined players.")}
            </Typography>
          </Box>
        )}
      </Box>

      {/*
        Action bar, docked edge-to-edge at the bottom of the screen so Reset
        and Save are visible as soon as the page opens.
        - Opaque background, so page content scrolls cleanly underneath
          instead of showing through around a floating bar.
        - In the native app the bar's bottom padding reserves room for the
          AdMob banner (--app-ad-banner-height, published by useAdMob) plus
          the bottom safe area / home indicator (--app-bottom-inset). The banner is drawn on top of that padded
          strip, so nothing is ever visible between the bar, the ad and the
          bottom edge of the screen.
      */}
      {/* Keep the footer's last lines (copyright, cookie note) clear of the
          docked bar while this page is open. */}
      {isDialog ? null : <GlobalStyles
        styles={{
          ".app-footer": {
            paddingBottom:
              "calc(96px + var(--app-ad-banner-height, 0px) + var(--app-bottom-inset, 0px)) !important",
          },
        }}
      />}
      <Box
        role="region"
        aria-label={t("Save preferences")}
        sx={{
          ...(isDialog
            ? {
                position: "sticky",
                bottom: 0,
                mx: { xs: -1.5, sm: -3 },
                pb: 1.5,
              }
            : {
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                pb: "calc(12px + var(--app-ad-banner-height, 0px) + var(--app-bottom-inset, 0px))",
              }),
          zIndex: 1200,
          pt: 1.25,
          px: { xs: 1.5, sm: 2.5 },
          background: "#ffffff",
          borderTop:
            "1.5px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 40%, transparent 60%)",
          boxShadow: "0 -8px 24px rgba(8, 26, 56, 0.16)",
        }}
      >
        <Box
          sx={{
            maxWidth: 860,
            mx: "auto",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            aria-live="polite"
            sx={{
              flex: 1,
              minWidth: 0,
              color: accentText,
              fontWeight: 700,
              fontSize: "calc(13px * var(--app-font-scale, 1))",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {isDirty ? (
              <>
                <Box
                  component="span"
                  sx={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#f59e0b",
                    mr: 0.75,
                    verticalAlign: "middle",
                  }}
                />
                <Box component="span" sx={{ "@media (max-width: 399px)": { display: "none" } }}>
                  {t("Unsaved changes")}
                </Box>
                <Box component="span" sx={{ display: "none", "@media (max-width: 399px)": { display: "inline" } }}>
                  {t("Unsaved")}
                </Box>
              </>
            ) : (
              <>
                <Box component="span" sx={{ "@media (max-width: 399px)": { display: "none" } }}>
                  {t("All changes saved")}
                </Box>
                <Box component="span" sx={{ display: "none", "@media (max-width: 399px)": { display: "inline" } }}>
                  {t("Saved")}
                </Box>
              </>
            )}
          </Typography>
          <Button
            data-ga-click="reset_app_preferences"
            onClick={reset}
            disabled={isDefault || saving}
            startIcon={<RestartAltRounded />}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 999,
              minHeight: 46,
              px: { xs: 1.25, sm: 2 },
              minWidth: 0,
              color: accentText,
            }}
          >
            {t("Reset")}
          </Button>
          <Button
            data-ga-click="save_app_preferences"
            variant="contained"
            onClick={save}
            sx={primaryButtonSx}
            disabled={!isDirty || saving}
          >
            {saving ? t("Saving...") : t("Save")}
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={2500}
        onClose={() => setToast("")}
        message={toast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
    </Box>
  );
};

export default AppPreferencesSettings;
