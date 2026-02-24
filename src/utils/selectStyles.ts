export const sharedSelectMenuProps = {
  PaperProps: {
    sx: {
      borderRadius: 2,
      mt: 1,
      minWidth: 120,
      background: "linear-gradient(135deg, #f8fffc 0%, #e0eafc 100%)",
      color: "var(--app-accent-text, #185a9d)",
      fontWeight: 700,
      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
      "& .MuiMenuItem-root": {
        color: "var(--app-accent-text, #185a9d) !important",
        fontWeight: 700,
        fontSize: 15,
      },
      "& .MuiMenuItem-root.Mui-selected": {
        background: "rgba(24,90,157,0.12)",
      },
      "& .MuiMenuItem-root.Mui-selected:hover": {
        background: "rgba(24,90,157,0.16)",
      },
    },
  },
};

export const appBarSelectSx = {
  color: "#fff !important",
  fontWeight: 700,
  fontSize: { xs: 14, sm: 16 },
  background: "rgba(255,255,255,0.10) !important",
  borderRadius: 2,
  px: 1.5,
  py: 0.5,
  "&.MuiInputBase-root": {
    color: "#fff !important",
    background: "rgba(255,255,255,0.10) !important",
    borderRadius: 2,
    border: "1.5px solid var(--app-accent-start, #43cea2) !important",
    boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
  },
  "&.Mui-focused": {
    background: "rgba(255,255,255,0.18) !important",
    border: "1.5px solid var(--app-accent-start, #43cea2) !important",
    boxShadow: "0 2px 12px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 52%, transparent 48%) !important",
  },
  "& .MuiInputBase-input:focus": {
    backgroundColor: "transparent !important",
  },
  "& .MuiSelect-select": {
    color: "#fff !important",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
  },
  "& .MuiSelect-icon": { color: "#fff !important" },
  "& .MuiInputBase-input": { color: "#fff !important", fontWeight: "700 !important" },
  "&::before": {
    borderBottom: "none !important",
  },
  "&::after": {
    borderBottom: "none !important",
  },
  backdropFilter: "blur(6px)",
  transition: "background 0.3s",
  "&:hover": { background: "rgba(255,255,255,0.18) !important" },
};

export const modalSelectSx = {
  color: "#185a9d !important",
  fontWeight: 700,
  fontSize: { xs: 14, sm: 16 },
  background: "rgba(255,255,255,0.92) !important",
  borderRadius: 2,
  px: 1.5,
  py: 0.5,
  minWidth: 80,
  "&.MuiInputBase-root": {
    color: "var(--app-accent-text, #185a9d) !important",
    background: "rgba(255,255,255,0.92) !important",
    borderRadius: 2,
    border: "1.5px solid var(--app-accent-start, #43cea2) !important",
    boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
  },
  "&.Mui-focused": {
    background: "rgba(255,255,255,1) !important",
    border: "1.5px solid var(--app-accent-start, #43cea2) !important",
    boxShadow: "0 2px 12px 0 color-mix(in srgb, var(--app-accent-start, #43cea2) 52%, transparent 48%) !important",
  },
  "& .MuiSelect-select": {
    color: "var(--app-accent-text, #185a9d) !important",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
  },
  "& .MuiSelect-icon": { color: "var(--app-accent-text, #185a9d) !important" },
  "& .MuiInputBase-input": {
    color: "var(--app-accent-text, #185a9d) !important",
    fontWeight: "700 !important",
  },
  "& .MuiInputBase-input:focus": {
    backgroundColor: "transparent !important",
  },
  "&::before": {
    borderBottom: "none !important",
  },
  "&::after": {
    borderBottom: "none !important",
  },
  boxShadow: "0 2px 8px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)",
  border: "1.5px solid var(--app-accent-start, #43cea2)",
  backdropFilter: "blur(6px)",
  transition: "background 0.3s",
  "&:hover": { background: "rgba(255,255,255,1) !important" },
};
