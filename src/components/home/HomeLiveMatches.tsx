import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Stack, Typography } from "@mui/material";
import { ChevronRightRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import ExploreService, { type LiveMatchSummary } from "../../services/ExploreService";
import LiveMatchCard, { livePulseDotSx } from "../live/LiveMatchCard";
import { keepLiveMatchOrder } from "../../utils/liveMatchOrder";
import { BOARD } from "../../utils/brand";

/** How many matches the Home strip shows. */
const HOME_LIVE_LIMIT = 4;
const REFRESH_MS = 10_000;

/**
 * "Live now" on Home: the most recent matches being scored (up to 4), with
 * scores refreshed every 10 s while the page is visible. A card never moves
 * when its score changes; only a newly started match is added on top.
 * Renders nothing when no match is live.
 */
const HomeLiveMatches: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [matches, setMatches] = React.useState<LiveMatchSummary[]>([]);
  const [total, setTotal] = React.useState(0);

  const refresh = React.useCallback(() => {
    // Fetch a few extra so the count on "See all" is meaningful.
    return ExploreService.live(20)
      .then((res) => {
        const list = res.matches ?? [];
        setTotal(list.length);
        setMatches((prev) => keepLiveMatchOrder(prev, list).slice(0, HOME_LIVE_LIMIT));
      })
      .catch(() => undefined);
  }, []);

  React.useEffect(() => {
    refresh();
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [refresh]);

  if (matches.length === 0) return null;

  return (
    <Box
      component="section"
      aria-label={t("Live matches")}
      sx={{ width: "100%", maxWidth: 1080, minWidth: 0, boxSizing: "border-box", mx: "auto", mb: 2, textAlign: "left" }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Box sx={livePulseDotSx} />
        <Typography sx={{ flex: 1, fontWeight: 900, color: BOARD.chalk, fontSize: "calc(16px * var(--app-font-scale, 1))" }}>
          {t("Live now")}
        </Typography>
        <Box
          component={RouterLink}
          to="/explore/live"
          data-ga-click="home_live_see_all"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            fontWeight: 800,
            fontSize: "calc(13px * var(--app-font-scale, 1))",
            color: BOARD.goldLight,
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          {total > matches.length ? `${t("See all")} (${total})` : t("See all")}
          <ChevronRightRounded sx={{ fontSize: 18 }} />
        </Box>
      </Stack>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" },
          gap: { xs: 1, sm: 1.5 },
        }}
      >
        {matches.map((m) => (
          <LiveMatchCard
            key={m.code}
            m={m}
            onOpen={() => navigate(`/join-game/${m.code}`, { state: { backLabel: "Home" } })}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HomeLiveMatches;
