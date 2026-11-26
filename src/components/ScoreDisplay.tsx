import type React from "react";
import { Box, Typography, Paper } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { useTranslation } from "react-i18next";
import { getBallsPerOver, type MatchLengthMode } from "../types/cricket";
import type { LivePartnership } from "./PartnershipStrip";
import { scoreTableSx } from "./scorecard/scoreTableSx";

interface BatterSummary {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
}

/** Small "Change" button in a table header (batters / bowler). Icon only on phones. */
const ChangeChip: React.FC<{ label: string; ariaLabel: string; gaClick: string; onClick: () => void }> = ({
  label,
  ariaLabel,
  gaClick,
  onClick,
}) => (
  <Box
    component="button"
    type="button"
    data-ga-click={gaClick}
    onClick={onClick}
    aria-label={ariaLabel}
    sx={{
      all: "unset",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 0.3,
      ml: 0.75,
      px: { xs: 0, sm: 0.8 },
      width: { xs: 24, sm: "auto" },
      height: 22,
      borderRadius: 99,
      verticalAlign: "middle",
      fontSize: "calc(11px * var(--app-font-scale, 1))",
      fontWeight: 800,
      textTransform: "none",
      letterSpacing: 0,
      color: "var(--app-accent-text, #185a9d)",
      background: "#fff",
      border: "1px solid color-mix(in srgb, var(--app-accent-end, #185a9d) 28%, transparent 72%)",
      "&:focus-visible": { outline: "2px solid var(--app-accent-end, #185a9d)", outlineOffset: 2 },
      "& .change-chip-label": { display: { xs: "none", sm: "inline" } },
    }}
  >
    <SwapVertIcon sx={{ fontSize: 15 }} />
    <span className="change-chip-label">{label}</span>
  </Box>
);

interface ScoreDisplayProps {
  score: number;
  wickets: number;
  overs: number;
  targetOvers: number;
  matchLengthMode?: MatchLengthMode;
  totalBalls?: number;
  targetScore?: number;
  remainingBalls?: number;
  teamName?: string;
  currentStriker?: BatterSummary;
  currentNonStriker?: BatterSummary;
  currentBowler?: {
    name: string;
    balls: number;
    runsConceded: number;
    wickets: number;
  };
  resultText?: string;
  /** Current stand at the crease (rostered matches only). */
  partnership?: LivePartnership;
  /** Opens "Change batters" (fix striker / non-striker after the start). */
  onEditBatters?: () => void;
  /** Opens "Change bowler". */
  onEditBowler?: () => void;
}

const sr = (runs: number, balls: number) => (balls > 0 ? ((runs * 100) / balls).toFixed(1) : "0.0");

/** Scoreboard tables are a touch denser than full scorecards. */
const boardTableSx = {
  ...scoreTableSx,
  "& th, & td": {
    ...scoreTableSx["& th, & td"],
    py: { xs: 0.7, sm: 0.85 },
  },
  "& th": {
    ...scoreTableSx["& th"],
    py: { xs: 0.5, sm: 0.6 },
    background: "color-mix(in srgb, var(--app-accent-end, #185a9d) 7%, #f6f8fa 93%)",
  },
} as const;

/**
 * Live scoreboard used by the scorer and by viewers. Cricbuzz-style: a dark
 * header with the team, score, overs and run rates, then compact batter and
 * bowler tables and the current partnership, so everything fits on one phone
 * screen without horizontal scrolling or wrapped stat chips.
 */
const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  onEditBatters,
  onEditBowler,
  score,
  wickets,
  overs,
  targetOvers,
  matchLengthMode = "overs",
  totalBalls = 0,
  targetScore = 0,
  remainingBalls = 0,
  teamName,
  currentStriker,
  currentNonStriker,
  currentBowler,
  resultText,
  partnership,
}) => {
  const { t } = useTranslation();
  const isBallsMode = matchLengthMode === "balls";
  // "By balls" matches use 5-ball overs instead of the standard 6, so the
  // over.ball notation (and every rate derived from it) needs to use that
  // shorter over length too.
  const ballsPerOver = getBallsPerOver(matchLengthMode);
  const ballsBowled = overs ? Math.floor(overs) * ballsPerOver + Math.round((overs % 1) * 10) : 0;
  const currentRunRate = ballsBowled > 0 ? score / (ballsBowled / ballsPerOver) : 0;
  const runsNeeded = Math.max(targetScore - score, 0);
  const requiredRunRate = targetScore && remainingBalls > 0 ? runsNeeded / (remainingBalls / ballsPerOver) : 0;
  const oversText = isBallsMode ? `${ballsBowled}/${totalBalls} ${t("balls")}` : `${overs.toFixed(1)}/${targetOvers} ${t("ov")}`;

  const remainingText = (() => {
    // Under 5 overs to go, broadcasts switch to a plain ball count.
    const showBallsCount = isBallsMode || remainingBalls / ballsPerOver < 5;
    return showBallsCount
      ? `${remainingBalls} ${t("balls")}`
      : `${Math.floor(remainingBalls / ballsPerOver)}.${remainingBalls % ballsPerOver} ${t("overs")}`;
  })();

  const batters = [
    currentStriker?.name ? { b: currentStriker, onStrike: true } : null,
    currentNonStriker?.name ? { b: currentNonStriker, onStrike: false } : null,
  ].filter(Boolean) as Array<{ b: BatterSummary; onStrike: boolean }>;
  const hasPlayers = batters.length > 0 || Boolean(currentBowler?.name);

  const p = partnership;
  const pTotal = Math.max(p?.runs ?? 0, 1);
  const pct = (n: number) => `${Math.max(0, (n / pTotal) * 100)}%`;

  return (
    <Box className="app-score-display-root" sx={{ flex: 1, width: "100%", mb: 0.5 }}>
      <Paper
        className="app-score-display-paper"
        elevation={0}
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: { xs: 3, sm: 4 },
          background: "#fff",
          border: "1px solid color-mix(in srgb, var(--app-accent-end, #185a9d) 18%, transparent 82%)",
          boxShadow: "0 10px 28px color-mix(in srgb, var(--app-accent-end, #185a9d) 22%, transparent 78%)",
          textAlign: "left",
        }}
      >
        {/* Header: team · score · overs · run rates */}
        <Box
          data-testid="scoreboard-header"
          sx={{
            position: "relative",
            px: { xs: 1.5, sm: 2 },
            pt: { xs: 1.1, sm: 1.4 },
            pb: { xs: 1.1, sm: 1.3 },
            color: "#fff",
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--app-accent-end, #185a9d) 78%, #06140f 22%) 0%, color-mix(in srgb, var(--app-accent-start, #43cea2) 55%, #06140f 45%) 100%)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 1.5 }}>
            <Box sx={{ minWidth: 0 }}>
              {teamName && (
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.82)",
                    fontWeight: 800,
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                    fontSize: { xs: "calc(12px * var(--app-font-scale, 1))", sm: "calc(13px * var(--app-font-scale, 1))" },
                    lineHeight: 1.2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {teamName}
                </Typography>
              )}
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.8, flexWrap: "wrap", mt: 0.15 }}>
                <Typography
                  component="span"
                  sx={{
                    color: "#fff",
                    fontWeight: 900,
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                    fontSize: { xs: "calc(34px * var(--app-font-scale, 1))", sm: "calc(40px * var(--app-font-scale, 1))" },
                  }}
                >
                  {score}/{wickets}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    color: "rgba(255,255,255,0.85)",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    fontVariantNumeric: "tabular-nums",
                    fontSize: { xs: "calc(15px * var(--app-font-scale, 1))", sm: "calc(17px * var(--app-font-scale, 1))" },
                  }}
                >
                  ({oversText})
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: { xs: 1.25, sm: 2 }, flex: "none", textAlign: "right" }}>
              {[
                { label: t("CRR"), value: currentRunRate.toFixed(2) },
                ...(targetScore > 0 ? [{ label: t("RRR"), value: requiredRunRate > 0 ? requiredRunRate.toFixed(2) : "--" }] : []),
              ].map((r) => (
                <Box key={r.label}>
                  <Typography sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 800, fontSize: "calc(10.5px * var(--app-font-scale, 1))", letterSpacing: 0.5 }}>
                    {r.label}
                  </Typography>
                  <Typography sx={{ color: "#fff", fontWeight: 900, fontVariantNumeric: "tabular-nums", fontSize: { xs: "calc(17px * var(--app-font-scale, 1))", sm: "calc(19px * var(--app-font-scale, 1))" }, lineHeight: 1.15 }}>
                    {r.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {(resultText || targetScore > 0) && (
            <Box
              sx={{
                mt: 1,
                px: 1,
                py: 0.5,
                borderRadius: 1.5,
                background: resultText ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.14)",
                color: resultText ? "#0d6b3d" : "#fff",
                fontWeight: 800,
                fontSize: { xs: "calc(13px * var(--app-font-scale, 1))", sm: "calc(14px * var(--app-font-scale, 1))" },
                lineHeight: 1.3,
              }}
            >
              {resultText ? (
                resultText
              ) : (
                <>
                  {runsNeeded} {t("runs needed in")} {remainingText}
                  <Box component="span" sx={{ opacity: 0.75, fontWeight: 700 }}>
                    {" · "}
                    {t("Target")} {targetScore}
                  </Box>
                </>
              )}
            </Box>
          )}
        </Box>

        {hasPlayers && (
          <Box data-testid="scoreboard-players">
            {batters.length > 0 && (
              <Box component="table" sx={boardTableSx}>
                <thead>
                  <tr>
                    <th>
                      {t("Batter")}
                      {onEditBatters ? (
                        <ChangeChip label={t("Change")} ariaLabel={t("Change batters")} gaClick="open_change_batters" onClick={onEditBatters} />
                      ) : null}
                    </th>
                    <th>{t("R")}</th>
                    <th>{t("B")}</th>
                    <th>4s</th>
                    <th>6s</th>
                    <th>{t("SR")}</th>
                  </tr>
                </thead>
                <tbody>
                  {batters.map(({ b, onStrike }) => (
                    <tr key={b.name}>
                      <td>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, minWidth: 0 }}>
                          <Box
                            aria-label={onStrike ? t("ON STRIKE") : undefined}
                            sx={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              flex: "none",
                              background: onStrike ? "#11ba68" : "transparent",
                              ...(onStrike
                                ? {
                                    animation: "pulse-dot 1.5s infinite",
                                    "@keyframes pulse-dot": {
                                      "0%": { boxShadow: "0 0 0 0 rgba(17,186,104,0.55)" },
                                      "70%": { boxShadow: "0 0 0 5px rgba(17,186,104,0)" },
                                      "100%": { boxShadow: "0 0 0 0 rgba(17,186,104,0)" },
                                    },
                                  }
                                : {}),
                            }}
                          />
                          <Box
                            component="span"
                            sx={{
                              fontWeight: onStrike ? 900 : 700,
                              color: "var(--app-accent-text, #185a9d)",
                              fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(15px * var(--app-font-scale, 1))" },
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {b.name}
                            {onStrike ? " *" : ""}
                          </Box>
                        </Box>
                      </td>
                      <td className="strong">{b.runs}</td>
                      <td>{b.balls}</td>
                      <td>{b.fours}</td>
                      <td>{b.sixes}</td>
                      <td>{sr(b.runs, b.balls)}</td>
                    </tr>
                  ))}
                </tbody>
              </Box>
            )}

            {currentBowler?.name && (
              <Box component="table" sx={boardTableSx}>
                <thead>
                  <tr>
                    <th>
                      {t("Bowler")}
                      {onEditBowler ? (
                        <ChangeChip label={t("Change")} ariaLabel={t("Change bowler")} gaClick="open_change_bowler" onClick={onEditBowler} />
                      ) : null}
                    </th>
                    <th>{t("O")}</th>
                    <th>{t("R")}</th>
                    <th>{t("W")}</th>
                    <th>{t("ECO")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Box
                        component="span"
                        sx={{
                          display: "block",
                          pl: "13px",
                          fontWeight: 800,
                          color: "var(--app-accent-text, #185a9d)",
                          fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(15px * var(--app-font-scale, 1))" },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {currentBowler.name}
                      </Box>
                    </td>
                    <td>
                      {Math.floor(currentBowler.balls / ballsPerOver)}.{currentBowler.balls % ballsPerOver}
                    </td>
                    <td>{currentBowler.runsConceded}</td>
                    <td className="strong">{currentBowler.wickets}</td>
                    <td>
                      {currentBowler.balls > 0
                        ? ((currentBowler.runsConceded * ballsPerOver) / currentBowler.balls).toFixed(2)
                        : "0.00"}
                    </td>
                  </tr>
                </tbody>
              </Box>
            )}

            {p && (
              <Box
                data-testid="live-partnership"
                sx={{
                  px: { xs: 1, sm: 1.5 },
                  py: 0.8,
                  borderTop: "1px solid #edf1f4",
                  background: "color-mix(in srgb, var(--app-accent-start, #43cea2) 5%, #ffffff 95%)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: "#5b6976", fontSize: "calc(12px * var(--app-font-scale, 1))" }}>
                    {t("Partnership")}{" "}
                    <Box component="span" sx={{ color: "#0c3558", fontWeight: 900, fontSize: "calc(14px * var(--app-font-scale, 1))" }}>
                      {p.runs}
                    </Box>{" "}
                    ({p.balls})
                  </Typography>
                  <Typography
                    sx={{
                      color: "#5b6976",
                      fontWeight: 700,
                      fontSize: "calc(11.5px * var(--app-font-scale, 1))",
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.batter1} {p.batter1Runs}({p.batter1Balls}) · {p.batter2} {p.batter2Runs}({p.batter2Balls})
                    {p.extras > 0 ? ` · ${t("Extras")} ${p.extras}` : ""}
                  </Typography>
                </Box>
                <Box
                  role="img"
                  aria-label={t("{{a}} {{ar}}, {{b}} {{br}}, extras {{x}}", {
                    a: p.batter1,
                    ar: p.batter1Runs,
                    b: p.batter2,
                    br: p.batter2Runs,
                    x: p.extras,
                  })}
                  sx={{ display: "flex", height: 5, mt: 0.6, borderRadius: 99, overflow: "hidden", gap: "2px", background: p.runs === 0 ? "#e6ecf0" : "transparent" }}
                >
                  {p.runs > 0 && (
                    <>
                      <Box sx={{ width: pct(p.batter1Runs), background: "var(--app-accent-start, #43cea2)", transition: "width .4s" }} />
                      <Box sx={{ width: pct(p.batter2Runs), background: "var(--app-accent-end, #185a9d)", transition: "width .4s" }} />
                      <Box sx={{ width: pct(p.extras), background: "#b8c2cc", transition: "width .4s" }} />
                    </>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ScoreDisplay;
