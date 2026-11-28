import React from "react";
import { Box, ButtonBase, Typography } from "@mui/material";
import { BadgeRounded, EmojiEventsRounded, SportsCricketRounded, TravelExploreRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BOARD } from "../../utils/brand";

export interface HomeBenefitsProps {
  onCreateGame: () => void;
  onCreateProfile: () => void;
  /** @deprecated No longer shown as a tile; kept so callers don't break. */
  onCreateTournament?: () => void;
}

/**
 * Four quick reasons to start, shown right under the Home hero buttons so
 * they're visible on first load. Each tile is a shortcut to that action.
 */
const HomeBenefits: React.FC<HomeBenefitsProps> = ({ onCreateGame, onCreateProfile }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const items = [
    { icon: <SportsCricketRounded />, title: t("Score free in seconds"), body: t("No sign-up, any phone"), onClick: onCreateGame, ga: "home_benefit_score" },
    { icon: <BadgeRounded />, title: t("Your player card"), body: t("Career runs & wickets, built for you"), onClick: onCreateProfile, ga: "home_benefit_profile" },
    { icon: <TravelExploreRounded />, title: t("Browse"), body: t("Live matches, players and tournaments"), onClick: () => navigate("/explore"), ga: "open_explore_browse" },
    { icon: <EmojiEventsRounded />, title: t("Tournaments"), body: t("Run leagues and knockouts"), onClick: () => navigate("/tournaments"), ga: "open_tournaments" },
  ];
  return (
    <Box
      component="ul"
      aria-label={t("Why Cricket Score Counter")}
      sx={{
        listStyle: "none",
        p: 0,
        m: 0,
        mt: { xs: 2.25, sm: 2.75 },
        display: "grid",
        gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
        gap: { xs: 1, sm: 1.25 },
        textAlign: "left",
      }}
    >
      {items.map((it) => (
        <Box component="li" key={it.title} sx={{ minWidth: 0, display: "flex" }}>
          <ButtonBase
            onClick={it.onClick}
            data-ga-click={it.ga}
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              gap: 1.1,
              p: { xs: 1.1, sm: 1.4 },
              borderRadius: 3,
              textAlign: "left",
              color: "#fff",
              background: "linear-gradient(160deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)",
              border: "1px solid rgba(241,214,138,0.2)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              transition: "transform 150ms ease, border-color 150ms ease, background 150ms ease",
              "&:hover, &:focus-visible": {
                transform: "translateY(-2px)",
                borderColor: "rgba(241,214,138,0.55)",
                background: "linear-gradient(160deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.05) 100%)",
              },
              "&:focus-visible": { outline: `2px solid ${BOARD.goldLight}`, outlineOffset: 2 },
            }}
          >
            <Box
              sx={{
                flex: "none",
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                color: BOARD.green,
                background: `linear-gradient(180deg, ${BOARD.goldLight} 0%, ${BOARD.gold} 100%)`,
                boxShadow: "0 3px 10px rgba(217,180,90,0.3)",
                "& svg": { fontSize: { xs: 18, sm: 20 } },
              }}
            >
              {it.icon}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 900, lineHeight: 1.2, fontSize: { xs: "calc(13.5px * var(--app-font-scale, 1))", sm: "calc(15px * var(--app-font-scale, 1))" } }}>
                {it.title}
              </Typography>
              <Typography sx={{ mt: 0.3, fontWeight: 600, lineHeight: 1.3, color: "rgba(255,255,255,0.7)", fontSize: { xs: "calc(12px * var(--app-font-scale, 1))", sm: "calc(13px * var(--app-font-scale, 1))" } }}>
                {it.body}
              </Typography>
            </Box>
          </ButtonBase>
        </Box>
      ))}
    </Box>
  );
};

export default HomeBenefits;
