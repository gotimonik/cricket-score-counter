import { createTheme } from "@mui/material/styles";

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
        root: {
          borderRadius: 8,
          textTransform: "none",
          color: "#646464",
          ":hover": {
            backgroundColor: "#0000000d",
            color: "#646464",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          "& .MuiTabs-indicator": {
            backgroundColor: "#646464",
          },
          ".Mui-selected": {
            color: "#5a5a5a !important",
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
