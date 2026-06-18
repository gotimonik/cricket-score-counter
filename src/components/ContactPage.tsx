import React from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";

const ContactPage: React.FC = () => {
  const location = useLocation();
  const contactStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Cricket Score Counter",
    url: "https://www.cricket-score-counter.com/contact",
    mainEntity: {
      "@type": "Organization",
      name: "Cricket Score Counter",
      founder: {
        "@type": "Person",
        name: "GOTI MONIK ARVINDBHAI",
        jobTitle: "Owner",
      },
      email: "gotimonik@gmail.com",
      telephone: "+91-8128313138",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "v1-50 ARADHANA BANGLOWS, OUTER RING ROAD, MOTA VARACHHA",
        addressCountry: "IN",
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: "gotimonik@gmail.com",
        telephone: "+91-8128313138",
        contactType: "customer support",
        availableLanguage: ["English", "Hindi", "Gujarati"],
      },
    },
  };

  return (
    <>
      <MetaHelmet
        pageTitle="Contact"
        canonical={location.pathname}
        description="Contact Cricket Score Counter support for help with cricket scoring, live match links, app downloads, privacy questions, and site feedback."
        keywords="contact cricket score counter, cricket scoring support, live cricket score help"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(contactStructuredData)}</script>
      </Helmet>
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
        <Box sx={{ width: "100%", maxWidth: 920, px: { xs: 1.5, sm: 2.5 }, mt: 2 }}>
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
              Contact Cricket Score Counter
            </PageTitleWithBack>
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 600,
                fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(16px * var(--app-font-scale, 1))" },
                mb: 2,
              }}
            >
              Use these contact details for support questions, scoring issues, download help, privacy requests, or feedback about the web app.
            </Typography>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              Company details
            </Typography>
            <Box component="dl" sx={{ m: 0, mb: 2, color: "var(--app-accent-text, #185a9d)" }}>
              <Typography component="dt" sx={{ fontWeight: 800 }}>
                Company Name
              </Typography>
              <Typography component="dd" sx={{ m: 0, mb: 1 }}>
                Cricket Score Counter
              </Typography>
              <Typography component="dt" sx={{ fontWeight: 800 }}>
                Owner
              </Typography>
              <Typography component="dd" sx={{ m: 0, mb: 1 }}>
                GOTI MONIK ARVINDBHAI
              </Typography>
              <Typography component="dt" sx={{ fontWeight: 800 }}>
                Role
              </Typography>
              <Typography component="dd" sx={{ m: 0, mb: 1 }}>
                Owner
              </Typography>
              <Typography component="dt" sx={{ fontWeight: 800 }}>
                Address
              </Typography>
              <Typography component="dd" sx={{ m: 0 }}>
                v1-50 ARADHANA BANGLOWS, OUTER RING ROAD, MOTA VARACHHA
              </Typography>
            </Box>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              Support email
            </Typography>
            <Typography sx={{ color: "var(--app-accent-text, #185a9d)", mb: 2 }}>
              <a href="mailto:gotimonik1@gmail.com">gotimonik1@gmail.com</a>
            </Typography>

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              Contact number
            </Typography>
            <Typography sx={{ color: "var(--app-accent-text, #185a9d)", mb: 2 }}>
              <a href="tel:+918128313138">+91 8128313138</a>
            </Typography>

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              What to include
            </Typography>
            <Box component="ul" sx={{ pl: 2.4, m: 0, color: "var(--app-accent-text, #185a9d)", lineHeight: 1.8 }}>
              <li>The page or match screen where you saw the issue.</li>
              <li>Whether you were using the website or Android app.</li>
              <li>The device and browser name if the issue is visual or performance related.</li>
              <li>A short description of the scoring action you expected and what happened instead.</li>
            </Box>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography sx={{ color: "var(--app-accent-text, #185a9d)", lineHeight: 1.7 }}>
              Cricket Score Counter is built for local cricket scoring. We review support messages to improve match setup, live score sharing, scorecard clarity, and policy documentation for users.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default ContactPage;
