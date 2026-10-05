import React from "react";
import { Box, Link, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";
import { ARTICLE_CATEGORIES, ARTICLES, articlePath } from "../content/articles";
import { CALCULATORS } from "./CricketCalculators";

const publicLinks = [
  {
    href: "/",
    title: "Home",
    description: "Start a match, join a live game, or explore the main cricket scoring experience.",
  },
  {
    href: "/create-game",
    title: "Create Game",
    description: "Set up a new cricket match and begin scoring ball by ball.",
  },
  {
    href: "/join-game",
    title: "Join Game",
    description: "Enter a match code to follow a live scoreboard.",
  },
  {
    href: "/download-app",
    title: "Download App",
    description: "Download the Android app for faster match-day scoring.",
  },
  {
    href: "/how-it-works",
    title: "How It Works",
    description: "Learn how to create matches, score overs, and share live updates.",
  },
  {
    href: "/learn",
    title: "Learn Cricket",
    description: "In-depth guides on scoring, the Laws, strategy and local cricket, with worked examples.",
  },
  {
    href: "/cricket-glossary",
    title: "Cricket Glossary",
    description: "150+ cricket terms explained in plain English, from all out to yorker.",
  },
  {
    href: "/cricket-calculators",
    title: "Cricket Calculators",
    description: "Run rate, net run rate, strike rate, economy, overs and rain-target calculators.",
  },
  {
    href: "/cricket-resources",
    title: "Cricket Resources",
    description: "Every guide on the site in one place.",
  },
  {
    href: "/cricket-rules-guide",
    title: "Cricket Rules Guide",
    description: "Batting, bowling, extras, dismissals and innings structure for local matches.",
  },
  {
    href: "/cricket-match-formats",
    title: "Cricket Match Formats",
    description: "T20, ODI, Test, box, tennis-ball and gully cricket formats compared.",
  },
  {
    href: "/cricket-statistics-guide",
    title: "Cricket Statistics Guide",
    description: "Averages, strike rates, economy and run rates explained with formulas.",
  },
  {
    href: "/cricket-tournament-guide",
    title: "Cricket Tournament Guide",
    description: "Run a league or knockout with an automatic points table.",
  },
  {
    href: "/cricket-scoring-guide",
    title: "Cricket Scoring Guide",
    description: "Read practical scoring guidance for overs, extras, wickets, strike rotation, and match-day checks.",
  },
  {
    href: "/scorekeeping-tips",
    title: "Cricket Scorekeeping Tips",
    description: "Improve local-match scoring accuracy with practical habits for extras, wickets, and innings review.",
  },
  {
    href: "/faq",
    title: "FAQ",
    description: "Find answers to common questions about live scoring, score corrections, and match history.",
  },
  {
    href: "/match-history",
    title: "Match History",
    description: "Review saved local matches and scorecards.",
  },
  {
    href: "/app-preferences",
    title: "App Preferences",
    description: "Adjust theme, text size, and accessibility options.",
  },
  {
    href: "/about",
    title: "About",
    description: "Read about Cricket Score Counter and what the app is built for.",
  },
  {
    href: "/support",
    title: "Support and Help",
    description: "Find troubleshooting help, scoring basics, and support contact details.",
  },
  {
    href: "/contact",
    title: "Contact",
    description: "Contact Cricket Score Counter support by email or phone.",
  },
  {
    href: "/privacy-policy",
    title: "Privacy Policy",
    description: "See how analytics, cookies, ads, and related data are handled.",
  },
  {
    href: "/terms",
    title: "Terms of Use",
    description: "Review acceptable use, user-entered match data, availability, and support terms.",
  },
  {
    href: "/disclaimer",
    title: "Disclaimer",
    description: "Review the site disclaimer and usage limitations.",
  },
];

const SiteMapPage: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <MetaHelmet
        pageTitle="Site Map"
        canonical={location.pathname}
        description="Browse all public pages on Cricket Score Counter, including match setup, live scoring help, downloads, and policy pages."
        keywords="cricket score counter Sitemaps, cricket scoring pages, cricket score counter links"
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
        <Box sx={{ width: "100%", maxWidth: 960, px: { xs: 1.5, sm: 2.5 }, mt: 2 }}>
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
              Site Map
            </PageTitleWithBack>
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 600,
                fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(16px * var(--app-font-scale, 1))" },
                mb: 2.5,
              }}
            >
              Browse all public pages on Cricket Score Counter.
            </Typography>

            <Box
              component="ul"
              sx={{
                listStyle: "none",
                p: 0,
                m: 0,
                display: "grid",
                gap: 1.25,
              }}
            >
              {publicLinks.map((item) => (
                <Box
                  component="li"
                  key={item.href}
                  sx={{
                    p: 1.5,
                    borderRadius: 2.5,
                    background: "rgba(255,255,255,0.78)",
                    border: "1px solid rgba(24,90,157,0.14)",
                  }}
                >
                  <Link
                    href={item.href}
                    underline="hover"
                    sx={{
                      color: "var(--app-accent-text, #185a9d)",
                      fontWeight: 800,
                      fontSize: { xs: "calc(16px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))" },
                    }}
                  >
                    {item.title}
                  </Link>
                  <Typography
                    sx={{
                      mt: 0.5,
                      color: "var(--app-accent-text, #185a9d)",
                      fontSize: { xs: "calc(13px * var(--app-font-scale, 1))", sm: "calc(14px * var(--app-font-scale, 1))" },
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              ))}
            </Box>

            {ARTICLE_CATEGORIES.map((category) => (
              <Box key={category.name} component="section" sx={{ mt: 3 }}>
                <Typography
                  component="h2"
                  sx={{
                    color: "var(--app-accent-text, #185a9d)",
                    fontWeight: 900,
                    fontSize: { xs: "calc(19px * var(--app-font-scale, 1))", sm: "calc(22px * var(--app-font-scale, 1))" },
                    mb: 1,
                  }}
                >
                  Learn Cricket: {category.name}
                </Typography>
                <Box component="ul" sx={{ pl: 2.5, m: 0, color: "var(--app-accent-text, #185a9d)", lineHeight: 1.9 }}>
                  {ARTICLES.filter((a) => a.category === category.name).map((article) => (
                    <li key={article.slug}>
                      <Link href={articlePath(article.slug)} underline="hover" sx={{ color: "#185a9d", fontWeight: 600 }}>
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </Box>
              </Box>
            ))}

            <Box component="section" sx={{ mt: 3 }}>
              <Typography
                component="h2"
                sx={{
                  color: "var(--app-accent-text, #185a9d)",
                  fontWeight: 900,
                  fontSize: { xs: "calc(19px * var(--app-font-scale, 1))", sm: "calc(22px * var(--app-font-scale, 1))" },
                  mb: 1,
                }}
              >
                Cricket Calculators
              </Typography>
              <Box component="ul" sx={{ pl: 2.5, m: 0, color: "var(--app-accent-text, #185a9d)", lineHeight: 1.9 }}>
                {CALCULATORS.map((calc) => (
                  <li key={calc.slug}>
                    <Link href={`/cricket-calculators/${calc.slug}`} underline="hover" sx={{ color: "#185a9d", fontWeight: 600 }}>
                      {calc.shortTitle}
                    </Link>
                  </li>
                ))}
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default SiteMapPage;
