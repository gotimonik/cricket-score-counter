import React from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import AdSenseBanner from "./AdSenseBanner";

const HowItWorks: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <>
      <MetaHelmet
        pageTitle="How It Works"
        canonical={location.pathname}
        description="Learn how to set up teams, track every ball, and share live cricket scores with Cricket Score Counter."
        keywords="how to score cricket, live cricket scoring guide, cricket score counter help, ball by ball scoring"
      />
      <AppBar />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background:
            "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))",
          pb: 4,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 900, px: { xs: 1.5, sm: 2.5 }, mt: 2 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              background: "linear-gradient(135deg, #f8fffc 0%, #e0eafc 100%)",
              border: "2px solid var(--app-accent-start, #43cea2)",
              boxShadow: "0 10px 30px rgba(8, 26, 56, 0.14)",
              p: { xs: 2, sm: 3 },
            }}
          >
            <Typography
              variant="h1"
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 900,
                fontSize: { xs: "calc(26px * var(--app-font-scale, 1))", sm: "calc(34px * var(--app-font-scale, 1))" },
                mb: 1,
              }}
            >
              {t("How It Works")}
            </Typography>
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 600,
                fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(16px * var(--app-font-scale, 1))" },
                mb: 2,
              }}
            >
              {t("From team setup to live sharing, here is a simple guide to score matches smoothly.")}
            </Typography>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              {t("1. Create a match")}
            </Typography>
            <Typography sx={{ mb: 2, color: "var(--app-accent-text, #185a9d)" }}>
              {t("Enter team names, overs, and players. You can also load predefined players to save time.")}
            </Typography>

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              {t("2. Score ball by ball")}
            </Typography>
            <Typography sx={{ mb: 2, color: "var(--app-accent-text, #185a9d)" }}>
              {t("Tap runs, extras, wickets, and undo when needed. The score, run rate, and player stats update instantly.")}
            </Typography>

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              {t("3. Share live updates")}
            </Typography>
            <Typography sx={{ mb: 2, color: "var(--app-accent-text, #185a9d)" }}>
              {t("Copy the match link and share it so friends can follow along in real time.")}
            </Typography>

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              {t("4. Save and review")}
            </Typography>
            <Typography sx={{ color: "var(--app-accent-text, #185a9d)" }}>
              {t("After the match, review batting and bowling summaries and keep history for future reference.")}
            </Typography>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              {t("Tips for accurate scoring")}
            </Typography>
            <Box component="ul" sx={{ pl: 2.4, m: 0, color: "var(--app-accent-text, #185a9d)" }}>
              <li>{t("Confirm striker and bowler at the start of each over.")}</li>
              <li>{t("Use the extras menu for wides and no-balls to keep stats correct.")}</li>
              <li>{t("Share the live link only after the match has started to avoid confusion.")}</li>
            </Box>
          </Paper>
        </Box>
        <AdSenseBanner show />
      </Box>
    </>
  );
};

export default HowItWorks;
