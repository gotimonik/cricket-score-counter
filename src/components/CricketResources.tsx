import React from "react";
import { Box, Card, CardActionArea, CardContent, Divider, Paper, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";

const resourceCards = [
  {
    title: "Cricket Rules Guide",
    description:
      "Complete rules for local cricket matches — batting, bowling, extras, dismissals, fielding restrictions, and innings structure. The essential reference before every match.",
    path: "/cricket-rules-guide",
    emoji: "📋",
    tag: "Rules",
  },
  {
    title: "Cricket Match Formats",
    description:
      "T20, 50-over, Test, box cricket, tennis ball, gully cricket, pairs cricket, and school formats — each format explained with duration, overs, and best use.",
    path: "/cricket-match-formats",
    emoji: "🏟️",
    tag: "Formats",
  },
  {
    title: "Cricket Statistics Explained",
    description:
      "Every batting and bowling statistic explained with formulas: batting average, strike rate, economy rate, bowling average, run rate, net run rate, and more.",
    path: "/cricket-statistics-guide",
    emoji: "📊",
    tag: "Statistics",
  },
  {
    title: "Cricket Scoring Guide",
    description:
      "A practical scoring guide for local match scorers — legal balls, overs, extras, wickets, strike rotation, live sharing, and worked examples.",
    path: "/cricket-scoring-guide",
    emoji: "✏️",
    tag: "Scoring",
  },
  {
    title: "Scorekeeping Tips",
    description:
      "Practical tips for keeping an accurate scorecard: scoring rhythm, tracking extras, over checks, wicket handling, and difficult scenarios explained clearly.",
    path: "/scorekeeping-tips",
    emoji: "💡",
    tag: "Tips",
  },
  {
    title: "How It Works",
    description:
      "Step-by-step guide to using Cricket Score Counter — match setup, ball-by-ball scoring, extras and wickets, live sharing links, and match history.",
    path: "/how-it-works",
    emoji: "🚀",
    tag: "App Guide",
  },
  {
    title: "Frequently Asked Questions",
    description:
      "Answers to the most common questions about Cricket Score Counter — scoring, match setup, extras, corrections, account, and more.",
    path: "/faq",
    emoji: "❓",
    tag: "FAQ",
  },
];

const CricketResources: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      <MetaHelmet
        pageTitle="Cricket Resources — Guides, Rules, Formats & Statistics"
        canonical={location.pathname}
        description="All cricket resources in one place — rules guide, match formats, statistics explained, scoring guide, scorekeeping tips, and app help for local and club cricket."
        keywords="cricket resources, cricket guides, cricket rules, cricket formats, cricket statistics, cricket scoring help, local cricket resources"
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
        <Box sx={{ width: "100%", maxWidth: 980, px: { xs: 1.5, sm: 2.5 }, mt: 2 }}>
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
              Cricket Resources
            </PageTitleWithBack>
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 600,
                fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(16px * var(--app-font-scale, 1))" },
                mb: 2,
              }}
            >
              Everything you need to score, understand, and enjoy local cricket — rules, formats, statistics, and step-by-step scorekeeping guides.
            </Typography>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              {resourceCards.map((card) => (
                <Card
                  key={card.path}
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: "1.5px solid rgba(67,206,162,0.35)",
                    background: "rgba(255,255,255,0.7)",
                    transition: "box-shadow 0.18s, border-color 0.18s",
                    "&:hover": {
                      boxShadow: "0 6px 24px rgba(24,90,157,0.14)",
                      borderColor: "var(--app-accent-start, #43cea2)",
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate(card.path)}
                    sx={{ borderRadius: 3, height: "100%" }}
                  >
                    <CardContent sx={{ p: { xs: 1.75, sm: 2 } }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
                        <Typography sx={{ fontSize: "1.5rem" }}>{card.emoji}</Typography>
                        <Typography
                          sx={{
                            fontSize: { xs: "calc(11px * var(--app-font-scale, 1))", sm: "calc(12px * var(--app-font-scale, 1))" },
                            color: "#43cea2",
                            fontWeight: 800,
                            background: "rgba(67,206,162,0.12)",
                            px: 1,
                            py: 0.2,
                            borderRadius: 1,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                          }}
                        >
                          {card.tag}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          color: "var(--app-accent-text, #185a9d)",
                          mb: 0.75,
                          fontSize: { xs: "calc(15px * var(--app-font-scale, 1))", sm: "calc(16px * var(--app-font-scale, 1))" },
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: "var(--app-accent-text, #185a9d)",
                          fontSize: { xs: "calc(13px * var(--app-font-scale, 1))", sm: "calc(14px * var(--app-font-scale, 1))" },
                          lineHeight: 1.6,
                          opacity: 0.85,
                        }}
                      >
                        {card.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>

            <Divider sx={{ my: 3, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography
              sx={{
                fontWeight: 800,
                color: "var(--app-accent-text, #185a9d)",
                mb: 1,
                fontSize: { xs: "calc(16px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))" },
              }}
            >
              About these guides
            </Typography>
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                lineHeight: 1.75,
                fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(15px * var(--app-font-scale, 1))" },
                mb: 2,
              }}
            >
              These resources are written for local scorers, team captains, players, and anyone following a match from the sidelines or from home. The focus is on practical, match-day knowledge — the kind of information that prevents scoring disputes, helps new scorers get started quickly, and gives experienced players the vocabulary to discuss the game accurately.
            </Typography>
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                lineHeight: 1.75,
                fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(15px * var(--app-font-scale, 1))" },
              }}
            >
              Cricket Score Counter is built around real scorer pain points — fast setup, clear controls, and live sharing. These guides complement the app by giving the knowledge needed to make every scoring decision confidently, from the first ball to the last wicket.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default CricketResources;
