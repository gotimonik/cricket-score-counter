import { createTheme } from "@mui/material/styles";

// Alert colours. Info follows the theme accent chosen in App Preferences;
// warning uses the brand gold and error the cricket-ball seam red.
const ALERT_TONES = {
  info: { main: "var(--app-accent-end, #185a9d)", ink: "#12324a" },
  success: { main: "#1b8a5a", ink: "#0f3d2a" },
  warning: { main: "#c9901c", ink: "#4a3205" },
  error: { main: "#c2412d", ink: "#5a1a10" },
} as const;
type AlertTone = keyof typeof ALERT_TONES;
const toneOf = (severity: unknown): (typeof ALERT_TONES)[AlertTone] =>
  ALERT_TONES[(severity as AlertTone) in ALERT_TONES ? (severity as AlertTone) : "info"];
const mix = (color: string, pct: number, other = "#ffffff") => `color-mix(in srgb, ${color} ${pct}%, ${other} ${100 - pct}%)`;

export const theme = createTheme({
  palette: {
    primary: {
      main: "#646464",
    },
    secondary: {
      main: "#FF5733",
    },
    background: {
      default: "#646464",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  components: {
    // Every warning / error / info / success message: a tinted card with a
    // colour strip down the left edge and the icon in a glowing round badge.
    // The filled variant (toasts) is a dark board-green card instead.
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => {
          const tone = toneOf(ownerState.severity);
          const filled = ownerState.variant === "filled";
          return {
            position: "relative",
            overflow: "hidden",
            alignItems: "center",
            gap: 4,
            padding: "10px 14px 10px 18px",
            borderRadius: 14,
            fontWeight: 600,
            lineHeight: 1.45,
            color: filled ? "#ffffff" : tone.ink,
            border: `1px solid ${filled ? "rgba(217,180,90,0.35)" : mix(tone.main, 26, "transparent")}`,
            background: filled
              ? [
                  `radial-gradient(90% 140% at 0% 0%, ${mix(tone.main, 40, "transparent")} 0%, transparent 60%)`,
                  "linear-gradient(150deg, #1d4b3b 0%, #0F2E25 55%, #0A1F1A 100%)",
                ].join(", ")
              : [
                  `radial-gradient(70% 160% at 0% 0%, ${mix(tone.main, 16, "transparent")} 0%, transparent 65%)`,
                  `linear-gradient(135deg, ${mix(tone.main, 9)} 0%, ${mix(tone.main, 3)} 100%)`,
                ].join(", "),
            boxShadow: filled
              ? "0 12px 30px rgba(6,24,18,0.35), inset 0 1px 0 rgba(255,255,255,0.08)"
              : `0 6px 18px ${mix(tone.main, 12, "transparent")}, inset 0 1px 0 rgba(255,255,255,0.7)`,
            // Colour strip down the left edge.
            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              background: `linear-gradient(180deg, ${mix(tone.main, 70)} 0%, ${tone.main} 100%)`,
              boxShadow: `0 0 10px ${mix(tone.main, 45, "transparent")}`,
            },
            "& .MuiAlertTitle-root": {
              fontWeight: 900,
              marginBottom: 2,
              color: filled ? "#ffffff" : tone.ink,
            },
            "& a": { color: "inherit", fontWeight: 800 },
          };
        },
        icon: ({ ownerState }) => {
          const tone = toneOf(ownerState.severity);
          return {
            flex: "none",
            alignSelf: "flex-start",
            width: 30,
            height: 30,
            padding: 0,
            marginRight: 8,
            marginTop: 1,
            opacity: 1,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            color: "#ffffff !important",
            background: `radial-gradient(circle at 30% 25%, ${mix(tone.main, 65)} 0%, ${tone.main} 70%)`,
            boxShadow: `0 3px 10px ${mix(tone.main, 40, "transparent")}, inset 0 1px 0 rgba(255,255,255,0.35)`,
            "& .MuiSvgIcon-root": { fontSize: 18 },
          };
        },
        message: { padding: "4px 0", minWidth: 0, overflowWrap: "anywhere" },
        action: { alignSelf: "center", paddingTop: 0, marginRight: -4 },
      },
    },
    // All toasts/snackbars appear at the top centre, where they're easy to
    // read and never sit under the bottom AdMob banner, the iOS home
    // indicator or the scoring keypad. (Vertical position is fine-tuned in
    // global.css so they clear the status bar in the native apps.)
    MuiSnackbar: {
      defaultProps: {
        anchorOrigin: { vertical: "top", horizontal: "center" },
      },
    },
    // Remaining inline spinners (buttons, tournament lists). disableShrink
    // makes the animation rotation-only, which WebKit runs on the
    // compositor, so it doesn't freeze on iOS while JS is busy. Default
    // (primary) spinners use the theme accent instead of grey.
    MuiCircularProgress: {
      defaultProps: {
        disableShrink: true,
      },
      styleOverrides: {
        colorPrimary: {
          color: "var(--app-accent-end, #185a9d)",
        },
      },
    },
    // One themed switch for the whole app: a pill track that fills with the
    // current theme's accent gradient when on, a soft tinted track when off,
    // and a white thumb with a subtle shadow. Uses the --app-accent-* CSS
    // variables, so it follows whichever colour theme the user picks.
    MuiSwitch: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          width: 50,
          height: 30,
          padding: 0,
          margin: 4,
          overflow: "visible",
          flexShrink: 0,
        },
        switchBase: {
          padding: 3,
          color: "#fff",
          transition: "transform 200ms ease",
          "&.Mui-checked": {
            transform: "translateX(20px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
              background:
                "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
              border: "1px solid transparent",
              opacity: 1,
            },
            "& .MuiSwitch-thumb": {
              boxShadow:
                "0 3px 8px color-mix(in srgb, var(--app-accent-end, #185a9d) 35%, transparent 65%)",
            },
          },
          "&:hover": {
            backgroundColor: "transparent",
          },
          "&.Mui-focusVisible + .MuiSwitch-track": {
            outline:
              "3px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 45%, transparent 55%)",
            outlineOffset: 2,
          },
          "&.Mui-disabled": {
            color: "#f4f6f8",
            "& + .MuiSwitch-track": {
              opacity: 0.45,
            },
          },
        },
        thumb: {
          width: 24,
          height: 24,
          boxShadow: "0 2px 5px rgba(8, 26, 56, 0.25)",
        },
        track: {
          borderRadius: 999,
          opacity: 1,
          backgroundColor:
            "color-mix(in srgb, var(--app-accent-end, #185a9d) 16%, #dfe6ec 84%)",
          border:
            "1px solid color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
          boxSizing: "border-box",
          transition: "background-color 200ms ease, border-color 200ms ease",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        // Text and outlined buttons sit on light backgrounds: grey text.
        // Filled (contained) buttons always have a dark or coloured fill, so
        // their text is white -- the grey used to be applied to them too and
        // read as grey-on-colour (e.g. the red "Watch" button).
        // Labels always stay on one line. minWidth "auto" means a button in a
        // flex row never shrinks below its one-line label, so a row that
        // can't fit its buttons wraps them onto the next line instead of
        // breaking the text over two lines.
        root: ({ ownerState }) => ({
          borderRadius: 8,
          textTransform: "none",
          whiteSpace: "nowrap",
          minWidth: "auto",
          lineHeight: 1.25,
          "& .MuiButton-startIcon, & .MuiButton-endIcon": { flexShrink: 0 },
          ...(ownerState.variant === "contained"
            ? // No hover colour: a button's own sx colour (e.g. dark text on
              // a white or gold fill) must win on hover too.
              { color: "#fff" }
            : {
                color: "#646464",
                ":hover": {
                  backgroundColor: "#0000000d",
                  color: "#646464",
                },
              }),
        }),
      },
    },
    // Dialog button bars wrap onto a second row on narrow phones instead of
    // squeezing button labels.
    MuiDialogActions: {
      styleOverrides: {
        root: { flexWrap: "wrap", gap: 8, "& > :not(style) ~ :not(style)": { marginLeft: 0 } },
      },
    },
    // Pavilion segmented control: filter / option toggles across the app.
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          padding: 3,
          gap: 2,
          borderRadius: 999,
          background: "rgba(15,46,37,0.06)",
          border: "1px solid rgba(15,46,37,0.1)",
          maxWidth: "100%",
        },
        grouped: {
          border: "0 !important",
          margin: "0 !important",
          borderRadius: "999px !important",
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 800,
          whiteSpace: "nowrap",
          color: "#4a5a54",
          padding: "5px 14px",
          lineHeight: 1.3,
          transition: "background 160ms ease, color 160ms ease, box-shadow 160ms ease",
          "&:hover": { background: "rgba(15,46,37,0.07)" },
          "&.Mui-selected, &.Mui-selected:hover": {
            color: "#F1D68A",
            background: "linear-gradient(150deg, #1d4b3b 0%, #0F2E25 70%, #0A1F1A 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 8px rgba(6,24,18,0.25)",
          },
        },
      },
    },
    // Text and search fields: rounded, white, gold focus ring.
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: "#fff",
          transition: "box-shadow 160ms ease",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(15,46,37,0.2)" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(15,46,37,0.4)" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#D9B45A", borderWidth: 2 },
          "&.Mui-focused": { boxShadow: "0 0 0 4px rgba(217,180,90,0.18)" },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": { borderColor: "#c2412d" },
        },
      },
    },
    // Placeholder avatars (no photo/logo): white icon or initial. MUI's
    // default uses palette.background.default (#646464), which read as a
    // muddy grey on the green and gradient avatar fills.
    MuiAvatar: {
      styleOverrides: {
        colorDefault: { color: "#ffffff" },
      },
    },
    // MUI <Table>s (guide articles, analytics): same premium look as the
    // app's stat tables (components/ui/premiumTable.ts).
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: "1px solid rgba(15,46,37,0.12)",
          background: "#ffffff",
          boxShadow: "0 1px 2px rgba(6,24,18,0.04), 0 8px 22px rgba(6,24,18,0.06)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(15,46,37,0.08)",
          color: "#24332d",
          fontVariantNumeric: "tabular-nums",
          transition: "background-color 120ms ease",
        },
        head: {
          background: "linear-gradient(160deg, #1d4b3b 0%, #0F2E25 70%, #0A1F1A 100%)",
          color: "#F1D68A",
          fontWeight: 800,
          fontSize: 11.5,
          letterSpacing: 1,
          textTransform: "uppercase",
          borderBottom: "2px solid #D9B45A",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(even) > td": { background: "#f6faf8" },
          "&:hover > td": { background: "#fdf6e3" },
          "&:last-of-type > td": { borderBottom: "none" },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          // Pavilion: gold underline, green selected label. No !important,
          // so a tab bar can still style its own selected tab.
          "& .MuiTabs-indicator": {
            backgroundColor: "#D9B45A",
          },
          "& .MuiTab-root.Mui-selected": {
            color: "#0F2E25",
          },
          ".MuiTabs-scroller": {
            marginBottom: "10px !important",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#2d2d2d !important",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          ":after": {
            borderBottom: "2px solid #646464 !important",
            borderRadius: "0px !important",
          },
        },
      },
    },
  },
});
