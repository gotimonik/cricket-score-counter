import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import MetaHelmet from "./MetaHelmet";
import AppBar from "./AppBar";

const Disclaimer: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  return (
    <>
      <MetaHelmet
        pageTitle={t("Disclaimer")}
        canonical={location.pathname}
        description={t(
          "Read the Cricket Score Counter disclaimer about score accuracy, third-party ads, and liability limits.",
        )}
        keywords="cricket score counter disclaimer, score accuracy disclaimer, ads disclaimer, liability notice"
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
        <Box
          sx={{ width: "100%", maxWidth: 900, px: { xs: 1.5, sm: 2.5 }, mt: 2 }}
        >
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
              variant="h3"
              sx={{
                mb: 2,
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 700,
              }}
            >
              {t("Disclaimer")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "Cricket Score Counter is provided for informational and entertainment purposes only. We do not guarantee the accuracy or completeness of scores or match data.",
              )}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Ads and Third-Party Content")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "This site may display ads served by Google AdSense. We are not responsible for the content of third-party ads or external links.",
              )}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Limitation of Liability")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "We are not liable for any damages resulting from the use of this site.",
              )}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Contact")}
            </Typography>
            <Typography variant="body1">
              {t("If you have questions, contact us at")}{" "}
              <a href="mailto:gotimonik1@gmail.com">
                gotimonik1@gmail.com
              </a>
              .
            </Typography>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default Disclaimer;
