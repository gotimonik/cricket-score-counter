import React from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";
import RelatedGuideLinks from "./RelatedGuideLinks";

const tips = [
  {
    title: "Keep a steady scoring rhythm",
    body:
      "Enter the delivery only after the umpire signal or the play is clearly complete. Rushing before a run out, overthrow, or extra is resolved can create avoidable corrections.",
  },
  {
    title: "Separate batter runs from extras",
    body:
      "A common local-match mistake is giving every run to the striker. Wides, no-balls, byes, and leg-byes affect the team total, but not always the batter's runs.",
  },
  {
    title: "Check the over after unusual balls",
    body:
      "After wides, no-balls, wicket no-balls, or overthrows, quickly confirm the ball count. This prevents the next over from starting too early or too late.",
  },
  {
    title: "Confirm the new batter before the next delivery",
    body:
      "After a wicket, make sure the incoming batter is selected correctly. This keeps partnerships, balls faced, and dismissal records meaningful after the match.",
  },
  {
    title: "Review the score at natural breaks",
    body:
      "Use over breaks, drinks breaks, innings breaks, and wickets to compare the live scoreboard with players on the ground. Small checks prevent end-of-match disputes.",
  },
];

const scoringScenarios = [
  {
    title: "Wide ball that runs to the boundary",
    body:
      "Record the delivery as a wide with the additional runs scored on that same ball. The team total increases, the bowler is charged, and the legal ball count does not move forward.",
  },
  {
    title: "No-ball with a run taken",
    body:
      "Record the no-ball first, then include the run completed by the batters. The batting side gets the no-ball extra plus the completed run, and the batter may receive the bat run depending on how it was scored.",
  },
  {
    title: "Run out while batters cross",
    body:
      "Confirm which batter is out before entering the next ball. In local matches this is one of the easiest places to lose track of strike, so pause for a few seconds and ask the umpire or players if needed.",
  },
  {
    title: "Overthrow after a completed run",
    body:
      "Add the original run and the overthrow runs to the same delivery. Before continuing, check the striker because odd and even totals can change who faces the next ball.",
  },
];

const scorerHabits = [
  "Say the score quietly after each ball so nearby players can catch mistakes early.",
  "Keep the phone brightness high enough before the innings starts.",
  "Avoid switching apps during an over unless the score has just been saved or shared.",
  "Use short player names or initials when teams are large and time is limited.",
  "Check the bowler name at the start of every over, especially in friendly matches with frequent bowling changes.",
];

const ScorekeepingTips: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <MetaHelmet
        pageTitle="Cricket Scorekeeping Tips"
        canonical={location.pathname}
        description="Practical cricket scorekeeping tips for local matches, including extras, wickets, over checks, strike rotation, and live score accuracy."
        keywords="cricket scorekeeping tips, local cricket scoring tips, cricket scorer guide, cricket score accuracy"
        ogType="article"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Scorekeeping Tips", path: "/scorekeeping-tips" },
        ]}
        article={{
          datePublished: "2026-05-23",
          dateModified: "2026-06-17",
        }}
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
              Cricket Scorekeeping Tips
            </PageTitleWithBack>
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 600,
                fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(16px * var(--app-font-scale, 1))" },
                mb: 2,
              }}
            >
              These tips are written for volunteer scorers who need a clear, reliable scoreboard during fast local matches.
            </Typography>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            {tips.map((tip) => (
              <Box key={tip.title} sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 0.75 }}>
                  {tip.title}
                </Typography>
                <Typography sx={{ color: "var(--app-accent-text, #185a9d)", lineHeight: 1.7 }}>
                  {tip.body}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              A simple end-of-innings review
            </Typography>
            <Box component="ol" sx={{ pl: 2.4, m: 0, color: "var(--app-accent-text, #185a9d)", lineHeight: 1.8 }}>
              <li>Confirm total runs, wickets, and overs.</li>
              <li>Check extras against wides, no-balls, byes, and leg-byes.</li>
              <li>Review batting balls faced and bowling overs.</li>
              <li>Confirm the target before starting the chase.</li>
              <li>Share the final scorecard link with both teams.</li>
            </Box>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              Common local-match scoring situations
            </Typography>
            {scoringScenarios.map((scenario) => (
              <Box key={scenario.title} sx={{ mb: 1.6 }}>
                <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 0.5 }}>
                  {scenario.title}
                </Typography>
                <Typography sx={{ color: "var(--app-accent-text, #185a9d)", lineHeight: 1.7 }}>
                  {scenario.body}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              Habits that make a scorer reliable
            </Typography>
            <Box component="ul" sx={{ pl: 2.4, m: 0, color: "var(--app-accent-text, #185a9d)", lineHeight: 1.8 }}>
              {scorerHabits.map((habit) => (
                <li key={habit}>{habit}</li>
              ))}
            </Box>

            <Divider sx={{ my: 3, background: "var(--app-accent-start, #43cea2)" }} />

            <RelatedGuideLinks
              links={[
                {
                  title: "← Cricket Statistics Explained",
                  path: "/cricket-statistics-guide",
                  description: "Understand the numbers you're keeping accurate while scoring.",
                },
                {
                  title: "Cricket Scoring Guide",
                  path: "/cricket-scoring-guide",
                  description: "A ball-by-ball walkthrough that pairs with these scorekeeping habits.",
                },
                {
                  title: "FAQ",
                  path: "/faq",
                  description: "Quick answers about setup, sharing, and match history.",
                },
                {
                  title: "All Cricket Resources →",
                  path: "/cricket-resources",
                  description: "Browse every guide — rules, formats, statistics, scoring, and scorekeeping tips.",
                },
              ]}
            />
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default ScorekeepingTips;
