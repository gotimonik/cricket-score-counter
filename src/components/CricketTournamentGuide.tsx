import React from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";
import RelatedGuideLinks from "./RelatedGuideLinks";

const sections = [
  {
    title: "What the Tournament Manager does",
    body: "Cricket Score Counter's Tournament Manager lets you run a full local tournament from one place — register the competing teams, generate fixtures, score each match ball by ball using the same live scorer, and watch the points table and player leaderboard update automatically as results come in. It replaces the spreadsheet most local organisers used to keep alongside their scorebook.",
  },
  {
    title: "Choosing a format: League or Knockout",
    body: "When you create a tournament you choose between two formats. League Round Robin has every registered team play every other team, with the points table deciding the standings. Knockout is single elimination — teams play until only one remains, which suits shorter tournaments or a limited number of playing days. Pick the format before adding fixtures, since it decides how many matches are scheduled and how the bracket or table is built.",
  },
  {
    title: "Registering teams",
    body: "Teams can be added in two ways. If you've already built a squad in My Teams, pick it from your saved team library so the player roster comes across automatically. Otherwise you can register a team manually with just a team name, captain name, and contact number, then add players one at a time. Each registered team keeps its own player list for the rest of the tournament, so captains don't need to re-enter their squad before every match.",
  },
  {
    title: "Building fixtures and scoring matches",
    body: "Once your teams are registered, the Tournament Manager lists the matches that need to be played based on the format you chose. Selecting a fixture takes you straight into the same live scorer used for a standalone match, so ball-by-ball scoring, extras, wickets, and live sharing links all work exactly the same way inside a tournament match. You can also start a custom match between two tournament teams outside the predefined fixture list if you need a friendly or a replay.",
  },
  {
    title: "How the points table works",
    body: "The points table tracks Played, Won, Lost, Tied, Points, Runs For, Runs Against, and Net Run Rate (NRR) for every team, and it syncs automatically from completed tournament matches — there's nothing to enter by hand. Standings are sorted by points first, then by net run rate, then by number of wins, so the table updates itself the moment a match is finished and the result is confirmed.",
  },
  {
    title: "Player stats and the leaderboard",
    body: "Every player registered to a tournament team gets an individual stats line: matches played, runs, balls faced, fours, sixes, wickets, balls bowled, and runs conceded. The tournament-wide leaderboard ranks players by runs scored first, then by wickets taken, so you can see the tournament's top run-scorer and leading wicket-taker at a glance, alongside a per-team breakdown for captains who just want their own squad's numbers.",
  },
  {
    title: "Account requirement",
    body: "Creating and managing a tournament requires a free Cricket Score Counter account, since the tournament, its teams, and its results need to be saved between matches rather than tied to a single device session. If you're scoring a one-off friendly with no ongoing table to maintain, the standalone Create Game flow still works without an account.",
  },
];

const organiserTips = [
  "Decide League or Knockout before registering teams — it determines how fixtures are generated.",
  "Use My Teams to save a squad once and reuse it across multiple tournaments.",
  "Confirm each match result promptly — the points table and leaderboard only update after a match is completed.",
  "Net run rate is the first tie-breaker after points, so encourage teams to bat and bowl out their full overs where possible.",
  "Check the player leaderboard after each round to keep award decisions (most runs, most wickets) accurate and disputes-free.",
];

const CricketTournamentGuide: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <MetaHelmet
        pageTitle="Cricket Tournament Guide — Teams, Points Table & Player Stats"
        canonical={location.pathname}
        description="How to run a local cricket tournament with Cricket Score Counter — register teams, choose League or Knockout, and track an automatic points table and player leaderboard."
        keywords="cricket tournament guide, cricket points table, cricket tournament app, cricket league round robin, cricket knockout tournament, cricket player stats leaderboard"
        ogType="article"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Cricket Tournament Guide", path: "/cricket-tournament-guide" },
        ]}
        article={{
          datePublished: "2026-07-02",
          dateModified: "2026-07-02",
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
              Cricket Tournament Guide
            </PageTitleWithBack>
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 600,
                fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(16px * var(--app-font-scale, 1))" },
                mb: 2,
              }}
            >
              How to register teams, run League or Knockout fixtures, and let the points table and player leaderboard update themselves as matches are played.
            </Typography>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            {sections.map((section, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    color: "var(--app-accent-text, #185a9d)",
                    mb: 1,
                    fontSize: { xs: "calc(16px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))" },
                  }}
                >
                  {section.title}
                </Typography>
                <Typography
                  sx={{
                    color: "var(--app-accent-text, #185a9d)",
                    lineHeight: 1.75,
                    fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(15px * var(--app-font-scale, 1))" },
                  }}
                >
                  {section.body}
                </Typography>
                {index < sections.length - 1 && (
                  <Divider sx={{ mt: 3, background: "rgba(67,206,162,0.3)" }} />
                )}
              </Box>
            ))}

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography
              sx={{
                fontWeight: 800,
                color: "var(--app-accent-text, #185a9d)",
                mb: 1.5,
                fontSize: { xs: "calc(16px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))" },
              }}
            >
              Quick tips for tournament organisers
            </Typography>
            <Box
              component="ul"
              sx={{
                pl: 2.4,
                m: 0,
                color: "var(--app-accent-text, #185a9d)",
                lineHeight: 1.9,
                fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(15px * var(--app-font-scale, 1))" },
              }}
            >
              {organiserTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </Box>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontSize: { xs: "calc(13px * var(--app-font-scale, 1))", sm: "calc(14px * var(--app-font-scale, 1))" },
                fontStyle: "italic",
                mb: 3,
              }}
            >
              The Tournament Manager is built for local, school, club, and friendly-league tournaments. Sign in and open Tournaments from the menu to register your first set of teams.
            </Typography>

            <Divider sx={{ my: 3, background: "var(--app-accent-start, #43cea2)" }} />

            <RelatedGuideLinks
              links={[
                {
                  title: "← Cricket Statistics Explained",
                  path: "/cricket-statistics-guide",
                  description: "See how batting average, strike rate, and NRR are calculated.",
                },
                {
                  title: "Cricket Rules Guide",
                  path: "/cricket-rules-guide",
                  description: "Confirm the match rules your tournament fixtures will follow.",
                },
                {
                  title: "All Cricket Resources",
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

export default CricketTournamentGuide;
