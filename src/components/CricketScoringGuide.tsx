import React from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";

const guideSections = [
  {
    title: "Before the first ball",
    body:
      "Confirm the match format, total overs, batting team, fielding team, opening batters, and first bowler before scoring starts. A clean setup prevents most local-match scoring mistakes.",
  },
  {
    title: "Legal deliveries and overs",
    body:
      "A standard cricket over has six legal deliveries. Wides and no-balls add runs but do not count as legal balls, so the over continues until six legal deliveries are recorded.",
  },
  {
    title: "Runs and strike rotation",
    body:
      "Singles, threes, and most odd-numbered running scores rotate the strike. Boundaries and even-numbered running scores usually keep the same batter on strike unless the over ends.",
  },
  {
    title: "Extras",
    body:
      "Wides and no-balls are added to the team total as extras. Byes and leg-byes are also extras, but they count as legal deliveries and do not add runs to the batter.",
  },
  {
    title: "Advanced wide and no-ball scoring",
    body:
      "In Cricket Score Counter, you can long press the WD (Wide) button to record additional runs scored on the same delivery. This makes it easy to score situations such as a wide ball that goes for multiple runs or a no-ball that also results in extra runs.",
  },
  {
    title: "Wickets",
    body:
      "Record the wicket type as soon as it happens. Bowled, caught, run out, stumped, hit wicket, and retired out affect the scorecard differently, so choosing the right dismissal keeps batting and bowling figures accurate.",
  },
  {
    title: "Live scoring and sharing",
    body:
      "Once the match setup is complete, you can share the live score link with players, coaches, friends, and family. Every ball update is reflected instantly, allowing everyone to follow the match in real time.",
  },
  {
    title: "Save matches and continue later",
    body:
      "Logged-in users can save matches and access them from any device. This is useful for tournaments, practice matches, or long games where scoring may continue later or be managed by different scorers.",
  },
  {
    title: "Targets and required run rate",
    body:
      "In a chase, the target is one run more than the first innings total. Required run rate changes after every legal ball, so a live scorer should update each event immediately.",
  },
];

const checklistItems = [
  "Keep team names short enough to read on phones.",
  "Use player names when you need batting and bowling scorecards.",
  "Long press WD button when additional runs are scored on the delivery.",
  "Review the recent events after every wicket or expensive over.",
  "Share the live link only after the match setup is complete.",
  "Save important matches to access them later from any device.",
  "Correct mistakes immediately so later stats stay trustworthy.",
];

const workedExamples = [
  {
    title: "Example over: 0, 4, WD+2, W, 1, 2, 6",
    body:
      "This over contains seven entries because the wide is not a legal delivery. The team scores 15 runs from the over: four, three wide-related runs, one, two, and six. The wicket is recorded on the legal delivery where it happened.",
  },
  {
    title: "Chasing 82 in 8 overs",
    body:
      "The target is 83. If the chasing team is 42/2 after 4 overs, they need 41 from 24 legal balls. The required run rate is 10.25 per over, so every dot ball and extra changes the pressure immediately.",
  },
  {
    title: "Retired batter in a practice match",
    body:
      "Many local games allow a batter to retire and return later. Agree on the rule before the toss. If the batter is retired out, record it as a wicket; if retired hurt or retired not out, keep it separate from normal dismissals.",
  },
];

const qualityChecks = [
  "The total score should equal batter runs plus extras.",
  "Bowling overs should match the legal balls delivered.",
  "The striker after an over should be checked against the final run on the previous ball.",
  "A no-ball or wide should not reduce the remaining legal balls in the over.",
  "The target should always be one run more than the first innings total.",
];

const CricketScoringGuide: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <MetaHelmet
        pageTitle="Cricket Scoring Guide"
        canonical={location.pathname}
        description="A practical guide to cricket scoring, including legal balls, extras, wickets, strike rotation, targets, and local match scorekeeping tips."
        keywords="cricket scoring guide, how to score cricket, cricket extras explained, cricket wickets guide, local cricket scorekeeping"
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
              Cricket Scoring Guide
            </PageTitleWithBack>
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 600,
                fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(16px * var(--app-font-scale, 1))" },
                mb: 2,
              }}
            >
              Use this guide when scoring school games, street matches, practice sessions, and club fixtures. It explains the scoring decisions that matter most during a live innings.
            </Typography>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            {guideSections.map((section) => (
              <Box key={section.title} sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 0.75 }}>
                  {section.title}
                </Typography>
                <Typography sx={{ color: "var(--app-accent-text, #185a9d)", lineHeight: 1.7 }}>
                  {section.body}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              Match-day scorer checklist
            </Typography>
            <Box component="ul" sx={{ pl: 2.4, m: 0, color: "var(--app-accent-text, #185a9d)", lineHeight: 1.8 }}>
              {checklistItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </Box>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              Why live scoring helps local cricket
            </Typography>
            <Typography sx={{ color: "var(--app-accent-text, #185a9d)", lineHeight: 1.7 }}>
              A shared live score keeps players, viewers, and organizers aligned. It reduces score disputes, makes targets clear during a chase, and gives teams a useful summary after the match. Cricket Score Counter is built around that simple match-day need: enter each ball quickly, keep the scoreboard readable, and make the final score easy to trust.
            </Typography>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              Worked scoring examples
            </Typography>
            {workedExamples.map((example) => (
              <Box key={example.title} sx={{ mb: 1.6 }}>
                <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 0.5 }}>
                  {example.title}
                </Typography>
                <Typography sx={{ color: "var(--app-accent-text, #185a9d)", lineHeight: 1.7 }}>
                  {example.body}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 1 }}>
              Scorecard quality checks
            </Typography>
            <Box component="ul" sx={{ pl: 2.4, m: 0, color: "var(--app-accent-text, #185a9d)", lineHeight: 1.8 }}>
              {qualityChecks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default CricketScoringGuide;
