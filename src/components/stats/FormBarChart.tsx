import React from "react";
import { Box, Typography } from "@mui/material";

export interface FormBar {
  key: string;
  value: number;
  /** Short label under the bar (e.g. opponent initials). */
  label: string;
  /** Full tooltip text. */
  tooltip: string;
  /** Draws the bar hollow-topped with a marker, e.g. a not-out innings. */
  emphasis?: boolean;
}

/**
 * Single-series vertical bar chart (oldest → newest, left → right) in plain
 * SVG: thin bars with rounded tops anchored to the baseline, a recessive
 * grid, and a hover/focus tooltip. One series, so no legend — the title
 * names it.
 */
const FormBarChart: React.FC<{
  title: string;
  bars: FormBar[];
  emptyText: string;
  emphasisNote?: string;
  height?: number;
}> = ({ title, bars, emptyText, emphasisNote, height = 150 }) => {
  const [active, setActive] = React.useState<number | null>(null);
  const width = 340;
  const pad = { top: 14, right: 8, bottom: 22, left: 28 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const max = Math.max(1, ...bars.map((b) => b.value));
  const niceMax = max <= 4 ? 4 : max <= 10 ? 10 : Math.ceil(max / 20) * 20;
  const ticks = [0, niceMax / 2, niceMax];
  const slot = bars.length > 0 ? plotW / bars.length : plotW;
  const barW = Math.max(6, Math.min(22, slot - 6));
  const y = (v: number) => pad.top + plotH - (v / niceMax) * plotH;

  return (
    <Box sx={{ position: "relative" }}>
      <Typography sx={{ fontWeight: 800, color: "#0c3558", fontSize: "calc(14px * var(--app-font-scale, 1))", mb: 0.5 }}>
        {title}
      </Typography>
      {bars.length === 0 ? (
        <Typography sx={{ color: "#6b7785", fontSize: 13, py: 3, textAlign: "center" }}>{emptyText}</Typography>
      ) : (
        <>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            width="100%"
            role="img"
            aria-label={`${title}: ${bars.map((b) => `${b.label} ${b.value}`).join(", ")}`}
            style={{ display: "block", overflow: "visible" }}
            onMouseLeave={() => setActive(null)}
          >
            {ticks.map((t) => (
              <g key={t}>
                <line x1={pad.left} x2={width - pad.right} y1={y(t)} y2={y(t)} stroke="#e3e9ef" strokeWidth={1} />
                <text x={pad.left - 6} y={y(t) + 3.5} textAnchor="end" fontSize={10} fill="#7a8794">
                  {t}
                </text>
              </g>
            ))}
            {bars.map((b, i) => {
              const cx = pad.left + slot * i + slot / 2;
              const top = y(b.value);
              const h = Math.max(b.value > 0 ? 2 : 0, pad.top + plotH - top);
              const r = Math.min(4, barW / 2, h);
              const x = cx - barW / 2;
              const base = pad.top + plotH;
              // Rounded data-end, square at the baseline.
              const path =
                h <= 0
                  ? ""
                  : `M${x},${base} V${base - h + r} Q${x},${base - h} ${x + r},${base - h} H${x + barW - r} Q${x + barW},${base - h} ${x + barW},${base - h + r} V${base} Z`;
              const isActive = active === i;
              return (
                <g
                  key={b.key}
                  tabIndex={0}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  style={{ cursor: "default", outline: "none" }}
                >
                  {/* Hit target larger than the mark. */}
                  <rect x={pad.left + slot * i} y={pad.top} width={slot} height={plotH + pad.bottom} fill="transparent" />
                  {path && (
                    <path
                      d={path}
                      fill="var(--app-accent-end, #185a9d)"
                      opacity={active === null || isActive ? 1 : 0.45}
                    />
                  )}
                  {b.emphasis && (
                    <circle cx={cx} cy={top - 6} r={2.6} fill="var(--app-accent-start, #43cea2)" />
                  )}
                  {b.value === 0 && <line x1={x} x2={x + barW} y1={base - 1} y2={base - 1} stroke="#9aa7b4" strokeWidth={2} strokeLinecap="round" />}
                  <text x={cx} y={height - 6} textAnchor="middle" fontSize={9.5} fill="#7a8794">
                    {b.label}
                  </text>
                </g>
              );
            })}
          </svg>
          {active !== null && bars[active] && (
            <Box
              role="tooltip"
              sx={{
                position: "absolute",
                left: `${((pad.left + slot * active + slot / 2) / width) * 100}%`,
                top: 30,
                transform: "translateX(-50%)",
                px: 1,
                py: 0.5,
                borderRadius: 1.5,
                background: "#0c3558",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: "nowrap",
                pointerEvents: "none",
                boxShadow: "0 4px 14px rgba(12,53,88,0.25)",
                zIndex: 2,
              }}
            >
              {bars[active].tooltip}
            </Box>
          )}
          {emphasisNote && bars.some((b) => b.emphasis) && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mt: 0.25, fontSize: 11.5, color: "#5b6976" }}>
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: "var(--app-accent-start, #43cea2)" }} />
              {emphasisNote}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default FormBarChart;
