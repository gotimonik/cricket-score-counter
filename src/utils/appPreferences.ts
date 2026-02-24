export type AppTheme =
  | "ocean"
  | "forest"
  | "sunset"
  | "sky"
  | "copper"
  | "midnight"
  | "rose"
  | "emerald";
export type AppFontSize = "small" | "medium" | "large";

export interface AppPreferences {
  theme: AppTheme;
  fontSize: AppFontSize;
  reducedMotion: boolean;
  compactMode: boolean;
}

export const APP_PREFERENCES_KEY = "app-preferences";

export const defaultAppPreferences: AppPreferences = {
  theme: "ocean",
  fontSize: "medium",
  reducedMotion: false,
  compactMode: false,
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
  sunset: {
    page: "linear-gradient(135deg, #ff9a44 0%, #fc6076 100%)",
    appBar: "linear-gradient(90deg, #fc6076 0%, #ff9a44 100%)",
    accentStart: "#ff9a44",
    accentEnd: "#fc6076",
    accentText: "#b64052",
  },
  sky: {
    page: "linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%)",
    appBar: "linear-gradient(90deg, #2f80ed 0%, #56ccf2 100%)",
    accentStart: "#56ccf2",
    accentEnd: "#2f80ed",
    accentText: "#1f5fb3",
  },
  copper: {
    page: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    appBar: "linear-gradient(90deg, #fda085 0%, #f6d365 100%)",
    accentStart: "#f6d365",
    accentEnd: "#fda085",
    accentText: "#ad5d47",
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
  emerald: {
    page: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
    appBar: "linear-gradient(90deg, #10b981 0%, #059669 100%)",
    accentStart: "#34d399",
    accentEnd: "#059669",
    accentText: "#047857",
  },
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
  root.style.setProperty("--app-page-gradient", theme.page);
  root.style.setProperty("--app-appbar-gradient", theme.appBar);
  root.style.setProperty("--app-accent-start", theme.accentStart);
  root.style.setProperty("--app-accent-end", theme.accentEnd);
  root.style.setProperty("--app-accent-text", theme.accentText);
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
