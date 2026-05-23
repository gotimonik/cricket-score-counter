import React from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";

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

const ScorekeepingTips: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <MetaHelmet
        pageTitle="Cricket Scorekeeping Tips"
        canonical={location.pathname}
        description="Practical cricket scorekeeping tips for local matches, including extras, wickets, over checks, strike rotation, and live score accuracy."
        keywords="cricket scorekeeping tips, local cricket scoring tips, cricket scorer guide, cricket score accuracy"
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
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default ScorekeepingTips;
