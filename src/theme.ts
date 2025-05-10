import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#0052CC",
    },
    secondary: {
      main: "#FF5733",
    },
    background: {
      default: "#0052CC",
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
