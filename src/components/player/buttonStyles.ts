/**
 * Filled call-to-action button in the app's accent gradient. The app theme
 * doesn't style MUI's default "contained" button (it renders grey-on-grey),
 * so every filled button needs this.
 */
export const primaryButtonSx = {
  textTransform: "none",
  fontWeight: 900,
  borderRadius: 1.5,
  color: "#fff",
  background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
  boxShadow: "0 2px 8px color-mix(in srgb, var(--app-accent-end, #185a9d) 25%, transparent 75%)",
  "&:hover": {
    background: "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
  },
  "&.Mui-disabled": { background: "#d6dde3", color: "#fff" },
} as const;
