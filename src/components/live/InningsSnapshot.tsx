import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { InsightsRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { computeInnings, type OversMap } from "../../utils/matchStats";
import { BOARD } from "../../utils/brand";

const SCOREBOARD_FONT = 'ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace';
/** Most overs drawn in the runs-per-over chart (the latest ones). */
const MAX_BARS = 20;

interface InningsSnapshotProps {
  overs: OversMap | undefined;
  battingTeam: string;
  bowlingTeam: string;
  ballsPerOver: number;
  /** Balls in the innings (0 when the match has no fixed length). */
  totalBalls: number;
  /** Runs to win when this is a chase, else 0. */
  targetScore: number;
  score: number;
  ballsBowled: number;
}

/**
 * At-a-glance innings numbers for the live viewer, on the dark board:
 * projected score (or the chase equation), extras, boundaries, last wicket,
 * and a runs-per-over chart with wickets marked. Everything is derived from
 * the ball-by-ball log the screen already has.
 */
const InningsSnapshot: React.FC<InningsSnapshotProps> = ({
  overs,
  battingTeam,
  bowlingTeam,
  ballsPerOver,
  totalBalls,
  targetScore,
  score,
  ballsBowled,
}) => {
  const { t } = useTranslation();
  const innings = React.useMemo(
    () => computeInnings(overs ?? {}, battingTeam, bowlingTeam, ballsPerOver),
    [overs, battingTeam, bowlingTeam, ballsPerOver],
  );

  if (!battingTeam || ballsBowled === 0 || innings.overs.length === 0) return null;

  const fours = innings.batting.reduce((sum, b) => sum + b.fours, 0);
  const sixes = innings.batting.reduce((sum, b) => sum + b.sixes, 0);
  const lastWicket = innings.fallOfWickets[innings.fallOfWickets.length - 1];
  const ballsLeft = totalBalls > 0 ? Math.max(totalBalls - ballsBowled, 0) : 0;
  const crr = ballsBowled ? (score * ballsPerOver) / ballsBowled : 0;

  const tiles: { label: string; value: string; hint?: string }[] = [];
  if (targetScore > 0) {
    const need = Math.max(targetScore - score, 0);
    tiles.push({
      label: t("Need"),
      value: String(need),
      hint: ballsLeft > 0 ? t("{{n}} balls · RRR {{rrr}}", { n: ballsLeft, rrr: ((need * ballsPerOver) / ballsLeft).toFixed(2) }) : undefined,
    });
  } else if (totalBalls > 0) {
    tiles.push({
      label: t("Projected"),
      value: String(Math.round(score + (crr * ballsLeft) / ballsPerOver)),
      hint: t("at CRR {{crr}}", { crr: crr.toFixed(2) }),
    });
  }
  tiles.push({ label: t("Extras"), value: String(innings.extras) });
  tiles.push({ label: t("4s / 6s"), value: `${fours} / ${sixes}` });
  tiles.push({
    label: t("Last wicket"),
    value: lastWicket ? `${lastWicket.score}/${lastWicket.wicket}` : "–",
    hint: lastWicket ? `${lastWicket.batter} · ${lastWicket.overs} ${t("ov")}` : t("No wickets yet"),
  });

  const bars = innings.overs.slice(-MAX_BARS);
  const maxRuns = Math.max(6, ...bars.map((o) => o.runs));

  return (
    <Box
      component="section"
      aria-label={t("Innings snapshot")}
      sx={{
        width: "100%",
        p: { xs: 1.5, sm: 2 },
        borderRadius: 3,
        color: "#fff",
        background: "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
        border: "1px solid rgba(241,214,138,0.22)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 1.25 }}>
        <InsightsRounded sx={{ fontSize: 18, color: BOARD.goldLight }} />
        <Typography sx={{ fontWeight: 900, letterSpacing: 1.2, textTransform: "uppercase", fontSize: "calc(11px * var(--app-font-scale, 1))", color: BOARD.goldLight }}>
          {t("Innings snapshot")}
        </Typography>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: `repeat(${tiles.length}, minmax(0, 1fr))` },
          gap: 1,
        }}
      >
        {tiles.map((tile) => (
          <Box key={tile.label} sx={{ minWidth: 0, p: 1.1, borderRadius: 2, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(241,214,138,0.14)" }}>
            <Typography sx={{ fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", fontSize: "calc(9.5px * var(--app-font-scale, 1))", color: "rgba(255,255,255,0.6)" }}>
              {tile.label}
            </Typography>
            <Typography
              sx={{
                mt: 0.25,
                fontFamily: SCOREBOARD_FONT,
                fontVariantNumeric: "tabular-nums",
                fontWeight: 800,
                lineHeight: 1.15,
                fontSize: "calc(20px * var(--app-font-scale, 1))",
                color: BOARD.goldLight,
                textShadow: "0 0 10px rgba(241,214,138,0.3)",
              }}
            >
              {tile.value}
            </Typography>
            {tile.hint && (
              <Typography sx={{ mt: 0.2, fontWeight: 700, fontSize: "calc(11px * var(--app-font-scale, 1))", color: "rgba(255,255,255,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {tile.hint}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 1.75 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 0.75 }}>
          <Typography sx={{ fontWeight: 800, fontSize: "calc(12px * var(--app-font-scale, 1))", color: "rgba(255,255,255,0.8)" }}>
            {t("Runs per over")}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#ff6b5a" }} />
            <Typography sx={{ fontWeight: 700, fontSize: "calc(11px * var(--app-font-scale, 1))", color: "rgba(255,255,255,0.6)" }}>
              {t("Wicket")}
            </Typography>
          </Stack>
        </Stack>
        <Box
          role="img"
          aria-label={bars.map((o) => `${t("Over")} ${o.over}: ${o.runs}${o.wickets ? `, ${o.wickets} wkt` : ""}`).join("; ")}
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.max(bars.length, 6)}, minmax(0, 1fr))`,
            alignItems: "end",
            gap: { xs: "4px", sm: "6px" },
            height: 96,
            pt: 1.5,
            borderBottom: "1px solid rgba(241,214,138,0.25)",
          }}
        >
          {bars.map((o, i) => {
            const latest = i === bars.length - 1;
            return (
              <Box key={o.over} sx={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", minWidth: 0 }}>
                <Typography
                  component="span"
                  sx={{ fontFamily: SCOREBOARD_FONT, fontWeight: 800, fontSize: 10, lineHeight: 1, mb: 0.3, color: latest ? BOARD.goldLight : "rgba(255,255,255,0.7)" }}
                >
                  {o.runs}
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 22,
                    height: `${Math.max((o.runs / maxRuns) * 100, 3)}%`,
                    maxHeight: "calc(100% - 14px)",
                    borderRadius: "4px 4px 0 0",
                    background: latest
                      ? `linear-gradient(180deg, ${BOARD.goldLight} 0%, ${BOARD.gold} 100%)`
                      : "linear-gradient(180deg, rgba(241,214,138,0.6) 0%, rgba(217,180,90,0.35) 100%)",
                    transition: "height 400ms ease",
                  }}
                >
                  {o.wickets > 0 && (
                    <Stack spacing="2px" alignItems="center" sx={{ position: "absolute", top: 3, left: 0, right: 0 }}>
                      {Array.from({ length: Math.min(o.wickets, 3) }, (_, w) => (
                        <Box key={w} sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#ff6b5a", boxShadow: "0 0 6px rgba(255,90,70,0.8)" }} />
                      ))}
                    </Stack>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.max(bars.length, 6)}, minmax(0, 1fr))`,
            gap: { xs: "4px", sm: "6px" },
            mt: 0.4,
          }}
        >
          {bars.map((o) => (
            <Typography key={o.over} component="span" sx={{ textAlign: "center", fontWeight: 700, fontSize: 9.5, color: "rgba(255,255,255,0.5)" }}>
              {o.over}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default InningsSnapshot;
