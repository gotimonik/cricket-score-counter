// Premium stat-table look shared by every scorecard, points table and stats
// table: a board-green header bar with gold letter-spaced labels, soft row
// stripes, a gold hover highlight, rounded corners and a fine border.
// Cell backgrounds are opaque so sticky first columns stay readable.

const HEAD_BG = "linear-gradient(160deg, #1d4b3b 0%, #0F2E25 70%, #0A1F1A 100%)";
const ROW = "#ffffff";
const ROW_ALT = "#f6faf8";
const ROW_HOVER = "#fdf6e3";
const LINE = "rgba(15,46,37,0.08)";
const RADIUS = 14;

export const premiumTableSx = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  borderRadius: `${RADIUS}px`,
  border: "1px solid rgba(15,46,37,0.12)",
  boxShadow: "0 1px 2px rgba(6,24,18,0.04), 0 8px 22px rgba(6,24,18,0.06)",
  background: ROW,
  "& th, & td": {
    borderBottom: `1px solid ${LINE}`,
    fontVariantNumeric: "tabular-nums",
    color: "#24332d",
    transition: "background-color 120ms ease",
  },
  "& th": {
    background: HEAD_BG,
    color: "#F1D68A",
    fontWeight: 800,
    letterSpacing: 1,
    textTransform: "uppercase",
    borderBottom: "2px solid #D9B45A",
  },
  "& tr:first-of-type th:first-of-type": { borderTopLeftRadius: `${RADIUS - 1}px` },
  "& tr:first-of-type th:last-of-type": { borderTopRightRadius: `${RADIUS - 1}px` },
  "& tbody tr td": { background: ROW },
  "& tbody tr:nth-of-type(even) td": { background: ROW_ALT },
  "& tbody tr:hover td": { background: ROW_HOVER },
  "& tbody tr:last-of-type td": { borderBottom: "none" },
  "& tbody tr:last-of-type td:first-of-type": { borderBottomLeftRadius: `${RADIUS - 1}px` },
  "& tbody tr:last-of-type td:last-of-type": { borderBottomRightRadius: `${RADIUS - 1}px` },
  "& td:first-of-type": { fontWeight: 800, color: "#0F2E25" },
} as const;
