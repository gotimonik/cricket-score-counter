import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Box, Collapse, Stack, Typography } from "@mui/material";
import { ChevronRightRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import ExploreService, { type LiveMatchSummary } from "../../services/ExploreService";
import LiveMatchCard, { livePulseDotSx } from "../live/LiveMatchCard";
import { keepLiveMatchOrder } from "../../utils/liveMatchOrder";
import { BOARD } from "../../utils/brand";
import { FadeIn, LiveMatchCardSkeleton, SkeletonBlock, SkeletonGroup } from "../ui/Skeletons";

/** How many matches the Home strip shows. */
const HOME_LIVE_LIMIT = 4;
const REFRESH_MS = 10_000;

// Last result, kept for the session so coming back to Home shows the strip
// straight away instead of a skeleton (it's refreshed in the background).
let cached: { matches: LiveMatchSummary[]; total: number } | null = null;

/**
 * "Live now" on Home: the most recent matches being scored (up to 4), with
 * scores refreshed every 10 s while the page is visible. A card never moves
 * when its score changes; only a newly started match is added on top.
 * While the first fetch is in flight it shows card skeletons in the same
 * space, and collapses smoothly if nothing turns out to be live.
 */
const HomeLiveMatches: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [matches, setMatches] = React.useState<LiveMatchSummary[]>(cached?.matches ?? []);
  const [total, setTotal] = React.useState(cached?.total ?? 0);
  const [loaded, setLoaded] = React.useState(cached !== null);

  const refresh = React.useCallback(() => {
    // Fetch a few extra so the count on "See all" is meaningful.
    return ExploreService.live(20)
      .then((res) => {
        const list = res.matches ?? [];
        setTotal(list.length);
        setMatches((prev) => {
          const next = keepLiveMatchOrder(prev, list).slice(0, HOME_LIVE_LIMIT);
          cached = { matches: next, total: list.length };
          return next;
        });
      })
      .catch(() => undefined)
      .finally(() => setLoaded(true));
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

  const hasMatches = matches.length > 0;
  // Keep the section open while loading (skeleton) or when there's something
  // live; collapse it smoothly once we know nothing is.
  const open = !loaded || hasMatches;

  return (
    <Collapse in={open} appear={false} timeout={280} unmountOnExit sx={{ width: "100%", maxWidth: 1080, mx: "auto" }}>
      <Box
        component="section"
        aria-label={t("Live matches")}
        sx={{ width: "100%", minWidth: 0, boxSizing: "border-box", mb: 2, textAlign: "left" }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1, minHeight: 24 }}>
          <Box sx={livePulseDotSx} />
          <Typography sx={{ flex: 1, fontWeight: 900, color: BOARD.chalk, fontSize: "calc(16px * var(--app-font-scale, 1))" }}>
            {t("Live now")}
          </Typography>
          {hasMatches ? (
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
          ) : (
            <SkeletonBlock tone="dark" width={64} height={12} />
          )}
        </Stack>
        {hasMatches ? (
          <FadeIn>
            <Box sx={gridSx}>
              {matches.map((m) => (
                <LiveMatchCard
                  key={m.code}
                  m={m}
                  onOpen={() => navigate(`/join-game/${m.code}`, { state: { backLabel: "Home" } })}
                />
              ))}
            </Box>
          </FadeIn>
        ) : (
          <SkeletonGroup label={t("Loading live matches")}>
            <Box sx={gridSx}>
              <LiveMatchCardSkeleton />
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <LiveMatchCardSkeleton />
              </Box>
            </Box>
          </SkeletonGroup>
        )}
      </Box>
    </Collapse>
  );
};

const gridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" },
  gap: { xs: 1, sm: 1.5 },
} as const;

export default HomeLiveMatches;
