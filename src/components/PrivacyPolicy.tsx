import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import MetaHelmet from "./MetaHelmet";
import AppBar from "./AppBar";
import PageTitleWithBack from "./PageTitleWithBack";

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  return (
    <>
      <MetaHelmet
        pageTitle={t("Privacy Policy")}
        canonical={location.pathname}
        description={t(
          "Read the Cricket Score Counter privacy policy, including cookies, analytics, ads, and data usage details.",
        )}
        keywords="cricket score counter privacy policy, cookies policy, adsense policy, analytics policy"
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
            <PageTitleWithBack
              titleSx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 900,
                fontSize: {
                  xs: "calc(26px * var(--app-font-scale, 1))",
                  sm: "calc(34px * var(--app-font-scale, 1))",
                },
              }}
            >
              {t("Privacy Policy")}
            </PageTitleWithBack>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "This Privacy Policy explains how Cricket Score Counter collects, uses, and protects your information.",
              )}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t("Last updated: May 23, 2026.")}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Information Collection")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "We may collect non-personal information such as browser type, device, and usage statistics. We do not collect personal information unless you provide it voluntarily.",
              )}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "When you create or view a match, the app may process match details such as team names, player names, scores, overs, wickets, and scoring events so the scoreboard and match history can work correctly.",
              )}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("How We Use Information")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "We use information to provide live scoring, improve app reliability, understand page usage, prevent abuse, and respond to support requests.",
              )}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Cookies and Ads")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "We use cookies to improve your experience. We may serve ads by Google AdSense, which may use cookies to personalize ads.",
              )}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "Google and its partners may use cookies or similar technologies to serve and measure ads. You can manage ad personalization through your Google ad settings and your browser cookie controls.",
              )}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Third-Party Services")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "We may use third-party services such as Google Analytics and AdSense. These services may collect and use information according to their own policies.",
              )}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Data Retention and Control")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "Some match information may be stored locally on your device or handled by our scoring service while a match is active. You can clear browser storage to remove local match history from your device.",
              )}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Children and Local Matches")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "Cricket Score Counter is a general scoring utility. Avoid entering sensitive personal details for children or players; first names, initials, or team nicknames are usually enough for local scorecards.",
              )}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Your Consent")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t("By using our site, you consent to our privacy policy.")}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Contact")}
            </Typography>
            <Typography variant="body1">
              {t("If you have questions, contact us at")}{" "}
              <a href="mailto:gotimonik1@gmail.com">gotimonik1@gmail.com</a>{" "}
              {t("or")} <a href="tel:+918128313138">+91 8128313138</a>.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default PrivacyPolicy;
