import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import AppPreferencesSettings from "./AppPreferencesSettings";
import PageTitleWithBack from "./PageTitleWithBack";

const AppPreferencesPage: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <>
      <MetaHelmet
        pageTitle={t("App Preferences")}
        canonical={location.pathname}
        description={t("Customize app version, language, theme, font size, and accessibility settings for Cricket Score Counter.")}
        keywords="app preferences, cricket score counter settings, theme, font size, language"
        robots="noindex,follow"
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
            <PageTitleWithBack
              titleSx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 900,
                fontSize: { xs: "calc(26px * var(--app-font-scale, 1))", sm: "calc(34px * var(--app-font-scale, 1))" },
              }}
            >
              {t("App Preferences")}
            </PageTitleWithBack>
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 600,
                fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(16px * var(--app-font-scale, 1))" },
              }}
            >
              {t("Choose your preferred version, language, theme, and accessibility settings. These options personalize how Cricket Score Counter looks and feels on your device.")}
            </Typography>
            <AppPreferencesSettings />
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default AppPreferencesPage;
