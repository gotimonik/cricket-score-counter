import React from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";

const SupportPage: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <MetaHelmet
        pageTitle="Support and Help"
        canonical={location.pathname}
        description="Get help with Cricket Score Counter, including scoring basics, live link troubleshooting, score corrections, match history, and support contact details."
        keywords="cricket score counter support, cricket scoring help, live score troubleshooting, match scoring FAQ"
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
            <Typography
              variant="h1"
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 900,
                fontSize: { xs: "calc(26px * var(--app-font-scale, 1))", sm: "calc(34px * var(--app-font-scale, 1))" },
                mb: 1,
              }}
            >
              Support and Help
            </Typography>
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 600,
                fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(16px * var(--app-font-scale, 1))" },
                mb: 2,
              }}
            >
              This page explains how to use Cricket Score Counter well, how to correct common scoring problems, and how to contact support when you need help.
            </Typography>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              Common scoring questions
            </Typography>
            <Typography sx={{ mb: 1.4, color: "var(--app-accent-text, #185a9d)" }}>
              <strong>How do I start quickly?</strong> Use Create Game, add team names, select overs, and begin scoring. Player details can be kept simple if you only need a fast scoreboard.
            </Typography>
            <Typography sx={{ mb: 1.4, color: "var(--app-accent-text, #185a9d)" }}>
              <strong>How do I fix a mistake?</strong> If you tap the wrong event, use undo or review the recent events/history area before continuing. Correcting early keeps the scorecard cleaner.
            </Typography>
            <Typography sx={{ mb: 1.4, color: "var(--app-accent-text, #185a9d)" }}>
              <strong>What happens with wides and no-balls?</strong> They count as extras and do not consume a legal ball. Byes and leg-byes add runs but still count as legal deliveries.
            </Typography>
            <Typography sx={{ color: "var(--app-accent-text, #185a9d)" }}>
              <strong>Can others watch live?</strong> Yes. Share the live match link after the match starts so viewers can follow updates in real time.
            </Typography>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              Troubleshooting live links
            </Typography>
            <Box component="ul" sx={{ pl: 2.4, m: 0, color: "var(--app-accent-text, #185a9d)" }}>
              <li>Confirm that the scorer shared the full match link or the correct Game ID.</li>
              <li>Refresh once if the score looks old after a weak network connection.</li>
              <li>Ask the scorer to confirm the match is still active if no new balls appear.</li>
              <li>Use the web page or the Android app, depending on what is easier for the scorer and viewers.</li>
            </Box>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              Match history and saved scorecards
            </Typography>
            <Typography sx={{ mb: 1.4, color: "var(--app-accent-text, #185a9d)" }}>
              Saved matches are useful for reviewing results, batting and bowling numbers, and key innings summaries after the game. If a saved scorecard does not look right, check whether the scorer corrected an event before the match ended.
            </Typography>
            <Typography sx={{ color: "var(--app-accent-text, #185a9d)" }}>
              Match history works best when team names, overs, and scoring events are entered consistently from the first ball.
            </Typography>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              Contact support
            </Typography>
            <Typography sx={{ mb: 1.4, color: "var(--app-accent-text, #185a9d)" }}>
              For questions about score entry, app behavior, download issues, or policy pages, contact:
            </Typography>
            <Typography sx={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 700 }}>
              <a href="mailto:gotimonik1@gmail.com">gotimonik1@gmail.com</a>
            </Typography>
            <Typography sx={{ mt: 1.4, color: "var(--app-accent-text, #185a9d)" }}>
              When you email, include the page you were using, what happened, and whether you were on web or Android. That makes it much easier to reproduce the issue and respond with a useful fix.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default SupportPage;
