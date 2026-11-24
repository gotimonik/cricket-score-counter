import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import {
  BlockRounded,
  CheckCircleRounded,
  EmojiEventsRounded,
  InsightsRounded,
  ShowChartRounded,
  TimelineRounded,
  WorkspacePremiumRounded,
} from "@mui/icons-material";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";

const NAVY = "#0c3558";
const MUTED = "#526274";

// What is planned to stay free (as decided so far); edit here if plans change.
const STAYS_FREE = [
  "Ball-by-ball live scoring for any match",
  "Shareable live score links anyone can watch",
  "Saved match history and scorecards",
  "Your player profile with basic batting and bowling stats",
  "Partnerships and fall of wickets",
];

const PLANNED = [
  { icon: <BlockRounded />, title: "No ads", body: "Score and browse without any ads on web, Android and iOS." },
  { icon: <InsightsRounded />, title: "Career profile", body: "Every innings and spell you've played, across all tournaments and friendly matches, in one place." },
  { icon: <ShowChartRounded />, title: "Form charts", body: "Runs and wickets from your last 10 innings, to see how you're trending." },
  { icon: <EmojiEventsRounded />, title: "Tournament records", body: "Best innings, best bowling and biggest partnerships for every tournament." },
  { icon: <TimelineRounded />, title: "Advanced stats", body: "Averages, strike rates, economy, dot balls and fifties for every player." },
];

const FAQ = [
  {
    q: "Do I need to pay for anything now?",
    a: "No. Everything in the app is free for everyone today, including the features listed for Premium.",
  },
  {
    q: "When will Premium start, and what will it cost?",
    a: "We haven't set a date or price yet. We're planning monthly and yearly options. We'll announce it in the app and on this page before any feature becomes paid.",
  },
  {
    q: "Will I be charged automatically?",
    a: "No. Premium will be something you choose to subscribe to. Nobody is moved onto a paid plan without signing up for it.",
  },
  {
    q: "What happens to my matches and stats if I don't subscribe?",
    a: "Nothing is deleted. Your matches, scorecards, tournaments and basic stats stay yours and keep working. Only the Premium sections (marked with a Premium badge) would need a subscription to view.",
  },
];

/** Explains the planned (optional) Premium plan while everything is still free. */
const PremiumInfoPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <MetaHelmet
        pageTitle="Premium (coming soon)"
        canonical={location.pathname}
        description="Cricket Score Counter is free. Here's what's planned for the optional Premium plan, and what stays free."
      />
      <AppBar showHomeMenuItem />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          px: { xs: 1.5, sm: 2.5 },
          py: { xs: 2, sm: 3 },
          background: "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))",
        }}
      >
        <Paper elevation={0} sx={{ width: "100%", maxWidth: 900, borderRadius: 4, p: { xs: 2, sm: 3.5 }, alignSelf: "flex-start" }}>
          <PageTitleWithBack titleSx={{ color: NAVY, fontWeight: 900, fontSize: { xs: 26, sm: 34 } }}>
            Premium is coming
          </PageTitleWithBack>
          <Box
            sx={{
              mt: 1,
              mb: 3,
              p: 2,
              borderRadius: 3,
              display: "flex",
              gap: 1.5,
              alignItems: "flex-start",
              background: "linear-gradient(135deg, #fff6dc 0%, #ffeec2 100%)",
              border: "1px solid #f0c04f",
            }}
          >
            <WorkspacePremiumRounded sx={{ color: "#b07d00", mt: 0.25 }} />
            <Typography sx={{ color: "#5b4300", fontWeight: 650 }}>
              <b>Everything is free right now.</b> To keep Cricket Score Counter running and improving, we're planning an
              optional Premium plan. Until it launches, every Premium feature is free for everyone. Sections that will be
              part of Premium are marked <b>PREMIUM · FREE NOW</b> in the app.
            </Typography>
          </Box>

          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
            <Box sx={{ p: 2.25, borderRadius: 3, border: "1px solid rgba(12,53,88,0.12)" }}>
              <Typography component="h2" sx={{ fontWeight: 900, color: NAVY, fontSize: 19, mb: 1.5 }}>
                Planned for Premium
              </Typography>
              <Stack spacing={1.5}>
                {PLANNED.map((item) => (
                  <Stack key={item.title} direction="row" spacing={1.25} alignItems="flex-start">
                    <Box sx={{ flex: "none", width: 34, height: 34, borderRadius: 2, display: "grid", placeItems: "center", color: "#b07d00", background: "#fff3cf", "& svg": { fontSize: 19 } }}>
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 900, color: NAVY }}>{item.title}</Typography>
                      <Typography sx={{ color: MUTED, fontSize: 14 }}>{item.body}</Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Box>
            <Box sx={{ p: 2.25, borderRadius: 3, border: "1px solid rgba(12,53,88,0.12)", background: "#f6fbf9" }}>
              <Typography component="h2" sx={{ fontWeight: 900, color: NAVY, fontSize: 19, mb: 1.5 }}>
                Planned to stay free
              </Typography>
              <Stack spacing={1.1}>
                {STAYS_FREE.map((item) => (
                  <Stack key={item} direction="row" spacing={1} alignItems="flex-start">
                    <CheckCircleRounded sx={{ color: "#0b7f61", fontSize: 20, mt: 0.15 }} />
                    <Typography sx={{ color: NAVY, fontWeight: 650 }}>{item}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Box>

          <Typography component="h2" sx={{ fontWeight: 900, color: NAVY, fontSize: 19, mt: 3.5, mb: 1.5 }}>
            Questions
          </Typography>
          <Stack spacing={2}>
            {FAQ.map((item) => (
              <Box key={item.q}>
                <Typography component="h3" sx={{ fontWeight: 900, color: NAVY }}>{item.q}</Typography>
                <Typography sx={{ color: MUTED, mt: 0.25 }}>{item.a}</Typography>
              </Box>
            ))}
          </Stack>

          <Typography sx={{ color: MUTED, fontSize: 13, mt: 3 }}>
            Plans may change before launch; this page will always show the latest. See also our{" "}
            <a href="/terms">Terms of Use</a> and <a href="/privacy-policy">Privacy Policy</a>.
          </Typography>
          <Button
            onClick={() => navigate("/create-game")}
            sx={{ mt: 2.5, borderRadius: 99, px: 3, py: 1.1, fontWeight: 900, textTransform: "none", color: "#fff", background: "linear-gradient(135deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)" }}
          >
            Score a match
          </Button>
        </Paper>
      </Box>
    </>
  );
};

export default PremiumInfoPage;
