import React from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";

const TermsOfUse: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <MetaHelmet
        pageTitle="Terms of Use"
        canonical={location.pathname}
        description="Read the Cricket Score Counter terms of use for local match scoring, user-entered data, acceptable use, support, and third-party services."
        keywords="cricket score counter terms, terms of use, cricket scoring app terms"
      />
      <AppBar showHomeMenuItem />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          background:
            "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))",
          pb: 4,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 940, px: { xs: 1.5, sm: 2.5 }, mt: 2 }}>
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
                fontSize: { xs: "calc(26px * var(--app-font-scale, 1))", sm: "calc(36px * var(--app-font-scale, 1))" },
              }}
            >
              Terms of Use
            </PageTitleWithBack>
            <Typography sx={{ color: "var(--app-accent-text, #185a9d)", mb: 2 }}>
              Last updated: May 23, 2026.
            </Typography>
            <Typography sx={{ color: "var(--app-accent-text, #185a9d)", lineHeight: 1.7, mb: 2 }}>
              By using Cricket Score Counter, you agree to use the website and app responsibly for cricket scoring, score viewing, match history, and related support purposes.
            </Typography>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              Acceptable use
            </Typography>
            <Typography sx={{ color: "var(--app-accent-text, #185a9d)", lineHeight: 1.7, mb: 2 }}>
              Do not use the service to publish unlawful, abusive, misleading, or sensitive personal information. For local cricket, initials, first names, or team nicknames are usually enough for useful scorecards.
            </Typography>

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              User-entered match data
            </Typography>
            <Typography sx={{ color: "var(--app-accent-text, #185a9d)", lineHeight: 1.7, mb: 2 }}>
              Team names, player names, scores, wickets, overs, and events are entered by users. The scorer is responsible for checking accuracy during the match and correcting mistakes promptly.
            </Typography>

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              Availability
            </Typography>
            <Typography sx={{ color: "var(--app-accent-text, #185a9d)", lineHeight: 1.7, mb: 2 }}>
              We aim to keep the site simple and reliable, but we cannot guarantee uninterrupted access. Network issues, browser settings, hosting changes, and third-party services may affect live score updates.
            </Typography>

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              Third-party services
            </Typography>
            <Typography sx={{ color: "var(--app-accent-text, #185a9d)", lineHeight: 1.7, mb: 2 }}>
              The site may use third-party tools for analytics, ads, hosting, and app distribution. These services operate under their own terms and privacy policies.
            </Typography>

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              Contact
            </Typography>
            <Typography sx={{ color: "var(--app-accent-text, #185a9d)", lineHeight: 1.7 }}>
              Questions about these terms can be sent to <a href="mailto:gotimonik1@gmail.com">gotimonik1@gmail.com</a> or <a href="tel:+918128313138">+91 8128313138</a>.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default TermsOfUse;
