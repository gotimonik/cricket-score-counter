export type AppTheme =
  | "ocean"
  | "forest"
  | "sky"
  | "midnight"
  | "rose"
  | "aurora"
  | "sand"
  | "cricketbuzz";
export type AppFontSize = "small" | "medium" | "large";

export interface AppPreferences {
  theme: AppTheme;
  fontSize: AppFontSize;
  reducedMotion: boolean;
  compactMode: boolean;
  singlePlayerModeEnabled: boolean;
  predefinedPlayersEnabled: boolean;
  predefinedPlayersCode: string;
}

export const APP_PREFERENCES_KEY = "app-preferences";
export const PREDEFINED_PLAYERS_UNLOCK_CODE = "LOAD_MONIKS_PLAYERS";

export const defaultAppPreferences: AppPreferences = {
  theme: "ocean",
  fontSize: "medium",
  reducedMotion: false,
  compactMode: false,
  singlePlayerModeEnabled: false,
  predefinedPlayersEnabled: false,
  predefinedPlayersCode: "",
};

export const themeGradients: Record<
  AppTheme,
  {
    page: string;
    appBar: string;
    accentStart: string;
    accentEnd: string;
    accentText: string;
  }
> = {
  ocean: {
    page: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
    appBar: "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)",
    accentStart: "#43cea2",
    accentEnd: "#185a9d",
    accentText: "#185a9d",
  },
  forest: {
    page: "linear-gradient(135deg, #5ba96b 0%, #1e5631 100%)",
    appBar: "linear-gradient(90deg, #1e5631 0%, #5ba96b 100%)",
    accentStart: "#5ba96b",
    accentEnd: "#1e5631",
    accentText: "#1e5631",
  },
  sky: {
    page: "linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%)",
    appBar: "linear-gradient(90deg, #2f80ed 0%, #56ccf2 100%)",
    accentStart: "#56ccf2",
    accentEnd: "#2f80ed",
    accentText: "#1f5fb3",
  },
  midnight: {
    page: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    appBar: "linear-gradient(90deg, #1e293b 0%, #334155 100%)",
    accentStart: "#38bdf8",
    accentEnd: "#6366f1",
    accentText: "#2563eb",
  },
  rose: {
    page: "linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)",
    appBar: "linear-gradient(90deg, #fb7185 0%, #f43f5e 100%)",
    accentStart: "#fb7185",
    accentEnd: "#e11d48",
    accentText: "#be123c",
  },
  aurora: {
    page: "linear-gradient(135deg, #0f172a 0%, #1f2937 45%, #2dd4bf 100%)",
    appBar: "linear-gradient(90deg, #2dd4bf 0%, #0ea5e9 100%)",
    accentStart: "#2dd4bf",
    accentEnd: "#0ea5e9",
    accentText: "#0f766e",
  },
  sand: {
    page: "linear-gradient(135deg, #fff1e6 0%, #fde68a 55%, #f59e0b 100%)",
    appBar: "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)",
    accentStart: "#f59e0b",
    accentEnd: "#fbbf24",
    accentText: "#92400e",
  },
  cricketbuzz: {
    page: "linear-gradient(135deg, #0f2d2c 0%, #1b4f4a 45%, #2aa66a 100%)",
    appBar: "linear-gradient(90deg, #1b5e20 0%, #2aa66a 100%)",
    accentStart: "#2aa66a",
    accentEnd: "#f5b301",
    accentText: "#0f5132",
  },
};

const hexToRgb = (hex: string): [number, number, number] | null => {
  const normalized = hex.trim().replace("#", "");
  if (!/^[\da-fA-F]{3}([\da-fA-F]{3})?$/.test(normalized)) return null;
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;
  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ];
};

const toRelativeLuminance = (channel: number): number => {
  const normalized = channel / 255;
  return normalized <= 0.03928
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
};

const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const [r, g, b] = rgb;
  return (
    0.2126 * toRelativeLuminance(r) +
    0.7152 * toRelativeLuminance(g) +
    0.0722 * toRelativeLuminance(b)
  );
};

const contrastRatio = (hexA: string, hexB: string): number => {
  const l1 = getLuminance(hexA);
  const l2 = getLuminance(hexB);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

const pickAccessibleAccentText = (accentStart: string, accentEnd: string): string => {
  const white = "#ffffff";
  const dark = "#0f172a";
  const whiteMinContrast = Math.min(
    contrastRatio(white, accentStart),
    contrastRatio(white, accentEnd)
  );
  const darkMinContrast = Math.min(
    contrastRatio(dark, accentStart),
    contrastRatio(dark, accentEnd)
  );
  return darkMinContrast > whiteMinContrast ? dark : white;
};

const fontPxMap: Record<AppFontSize, number> = {
  small: 14,
  medium: 16,
  large: 18,
};

export const getStoredAppPreferences = (): AppPreferences => {
  try {
    const raw = localStorage.getItem(APP_PREFERENCES_KEY);
    if (!raw) return defaultAppPreferences;
    const parsed = JSON.parse(raw) as Partial<AppPreferences>;
    return {
      theme:
        parsed.theme && parsed.theme in themeGradients
          ? parsed.theme
          : defaultAppPreferences.theme,
      fontSize:
        parsed.fontSize && parsed.fontSize in fontPxMap
          ? parsed.fontSize
          : defaultAppPreferences.fontSize,
      reducedMotion: Boolean(parsed.reducedMotion),
      compactMode: Boolean(parsed.compactMode),
      singlePlayerModeEnabled: Boolean(parsed.singlePlayerModeEnabled),
      predefinedPlayersEnabled: Boolean(parsed.predefinedPlayersEnabled),
      predefinedPlayersCode:
        typeof parsed.predefinedPlayersCode === "string"
          ? parsed.predefinedPlayersCode
          : defaultAppPreferences.predefinedPlayersCode,
    };
  } catch {
    return defaultAppPreferences;
  }
};

export const setStoredAppPreferences = (preferences: AppPreferences): void => {
  try {
    localStorage.setItem(APP_PREFERENCES_KEY, JSON.stringify(preferences));
  } catch {
    // ignore storage failures
  }
};

export const applyAppPreferences = (preferences: AppPreferences): void => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const theme = themeGradients[preferences.theme] ?? themeGradients.ocean;
  const accentContrastText = pickAccessibleAccentText(
    theme.accentStart,
    theme.accentEnd
  );
  root.style.setProperty("--app-page-gradient", theme.page);
  root.style.setProperty("--app-appbar-gradient", theme.appBar);
  root.style.setProperty("--app-accent-start", theme.accentStart);
  root.style.setProperty("--app-accent-end", theme.accentEnd);
  root.style.setProperty("--app-accent-text", theme.accentText);
  root.style.setProperty("--app-accent-contrast-text", accentContrastText);
  root.style.setProperty("--app-space-scale", preferences.compactMode ? "0.94" : "1");
  root.style.setProperty("--app-font-size", `${fontPxMap[preferences.fontSize]}px`);
  root.style.setProperty(
    "--app-font-scale",
    preferences.fontSize === "small" ? "0.92" : preferences.fontSize === "large" ? "1.1" : "1"
  );
  root.setAttribute("data-app-font-size", preferences.fontSize);
  root.setAttribute("data-reduced-motion", String(preferences.reducedMotion));
  root.setAttribute("data-compact-mode", String(preferences.compactMode));
};
