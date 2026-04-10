import React from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";

const About: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <>
      <MetaHelmet
        pageTitle="About Cricket Score Counter"
        canonical={location.pathname}
        description="About Cricket Score Counter: a simple, reliable way to score local matches and share live updates."
        keywords="about cricket score counter, cricket scoring app, live cricket score tracker"
      />
      <AppBar showHomeMenuItem />
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
              {t("About Cricket Score Counter")}
            </Typography>
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 600,
                fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(16px * var(--app-font-scale, 1))" },
                mb: 2,
              }}
            >
              {t("Cricket Score Counter helps local teams score matches ball-by-ball, track player stats, and share live updates in seconds.")}
            </Typography>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              {t("Why we built this")}
            </Typography>
            <Typography sx={{ mb: 2, color: "var(--app-accent-text, #185a9d)" }}>
              {t("Scoring local cricket should be fast and reliable. We built this app so any scorer can track runs, wickets, and overs without confusion, even on a phone in bright sunlight.")}
            </Typography>
            <Typography sx={{ mb: 2, color: "var(--app-accent-text, #185a9d)" }}>
              {t("The focus is on clarity: big, readable controls, simple prompts, and a clean layout that stays usable throughout the innings.")}
            </Typography>

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              {t("What you can do")}
            </Typography>
            <Box component="ul" sx={{ pl: 2.4, m: 0, color: "var(--app-accent-text, #185a9d)" }}>
              <li>{t("Create matches and set overs in seconds.")}</li>
              <li>{t("Score every ball with runs, extras, and wickets.")}</li>
              <li>{t("Track batting and bowling stats instantly.")}</li>
              <li>{t("Share a live link so friends can follow along.")}</li>
              <li>{t("Review match history after the game ends.")}</li>
            </Box>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              {t("Who this is for")}
            </Typography>
            <Typography sx={{ mb: 2, color: "var(--app-accent-text, #185a9d)" }}>
              {t("Cricket Score Counter is built for local leagues, school games, friendly matches, and training sessions. It works for any level where a simple, reliable scorecard is needed.")}
            </Typography>

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              {t("Accuracy first")}
            </Typography>
            <Typography sx={{ mb: 2, color: "var(--app-accent-text, #185a9d)" }}>
              {t("We prioritize correct scoring logic for extras, wickets, and overs so your results remain trustworthy. If something goes wrong, you can quickly adjust events and keep the match accurate.")}
            </Typography>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              {t("Our commitment")}
            </Typography>
            <Typography sx={{ color: "var(--app-accent-text, #185a9d)" }}>
              {t("We focus on clarity, accuracy, and speed. The app is designed to work smoothly during real matches with minimal steps and clear visuals.")}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default About;
