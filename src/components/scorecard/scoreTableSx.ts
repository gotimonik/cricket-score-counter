import { premiumTableSx } from "../ui/premiumTable";

/**
 * Compact, Cricbuzz-style score table used for batting / bowling cards and
 * points tables. Mobile-first: the first column (name) takes all spare width
 * and wraps, number columns shrink to their content, so a 6-column scorecard
 * fits a 360px phone without horizontal scrolling.
 */
export const scoreTableSx = {
  ...premiumTableSx,
  tableLayout: "auto",
  "& th, & td": {
    ...premiumTableSx["& th, & td"],
    px: { xs: 0.6, sm: 1 },
    py: { xs: 0.9, sm: 1 },
    textAlign: "right",
    fontSize: { xs: "calc(13px * var(--app-font-scale, 1))", sm: "calc(14px * var(--app-font-scale, 1))" },
    whiteSpace: "nowrap",
    verticalAlign: "top",
  },
  "& th": {
    ...premiumTableSx["& th"],
    py: { xs: 0.8, sm: 0.9 },
    fontSize: { xs: "calc(10.5px * var(--app-font-scale, 1))", sm: "calc(11.5px * var(--app-font-scale, 1))" },
    verticalAlign: "middle",
  },
  "& th:first-of-type, & td:first-of-type": {
    textAlign: "left",
    whiteSpace: "normal",
    width: "100%",
    pl: { xs: 1, sm: 1.5 },
    wordBreak: "break-word",
  },
  "& th:last-of-type, & td:last-of-type": { pr: { xs: 1, sm: 1.5 } },
  "& td.strong, & th.strong": { fontWeight: 900, color: "#0F2E25" },
  "& td.muted": { color: "#6b7785" },
  "& tbody tr.subtle td": { background: "#f1f5f3" },
} as const;

/** Name line + small grey dismissal / detail line under it (Cricbuzz style). */
export const scoreNameSx = {
  fontWeight: 700,
  color: "var(--app-accent-text, #185a9d)",
  fontSize: { xs: "calc(13.5px * var(--app-font-scale, 1))", sm: "calc(14px * var(--app-font-scale, 1))" },
  lineHeight: 1.25,
} as const;

export const scoreDetailSx = {
  display: "block",
  mt: 0.25,
  color: "#6b7785",
  fontWeight: 500,
  fontSize: { xs: "calc(11.5px * var(--app-font-scale, 1))", sm: "calc(12px * var(--app-font-scale, 1))" },
  lineHeight: 1.25,
} as const;
