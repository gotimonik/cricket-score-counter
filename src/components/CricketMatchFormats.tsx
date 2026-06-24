import React from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";

const formats = [
  {
    title: "T20 cricket (Twenty20)",
    duration: "2–3 hours",
    overs: "20 overs per side",
    body: "T20 is the shortest and most popular professional format. Each side bats for a maximum of 20 overs. The fast pace makes every over count, and teams must balance attack with survival from the first ball. Power hitting, clever variation bowling, and sharp fielding are all premium skills in T20. For local matches, the 20-over format is ideal when teams have an afternoon available. Scoring moves quickly and matches rarely drag. The powerplay in T20 typically covers overs 1–6, during which only two fielders are allowed outside the 30-yard circle. T20 has made cricket more accessible, and it is the format played in the Indian Premier League (IPL), Big Bash League (BBL), The Hundred, and most domestic T20 tournaments worldwide.",
  },
  {
    title: "One Day International format (50 overs)",
    duration: "7–8 hours",
    overs: "50 overs per side",
    body: "The 50-over format was the dominant limited-over format before T20. Each team bats for up to 50 overs, creating a longer strategic battle. There are two powerplay phases in the standard 50-over game: the first runs from overs 1–10 (mandatory, two fielders outside), and the batting team can choose an additional five-over powerplay window later. Tactics evolve across the three phases of a 50-over innings — set-up overs (1–15), consolidation overs (16–35), and death overs (36–50). The 50-over format rewards teams that can bat and bowl through all phases. For local cricket, a 50-over match requires a full day, good light, and often a break for lunch or tea. It is typically played in formal club and district competitions.",
  },
  {
    title: "Test match cricket",
    duration: "Up to 5 days",
    overs: "Unlimited overs, two innings per side",
    body: "Test cricket is the oldest and longest format. Each team plays two innings, and there are no overs limit — a team bats until they are all out or choose to declare. Test matches are played over up to five days with approximately 90 overs per day. The longer format rewards patience, technique, and mental endurance. A team can win by an innings (so dominant that the other team's combined two innings are less than one), by runs, or by wickets. Test cricket is still considered the ultimate format by purists, as it tests every technical and tactical aspect of the game. Draws are common when weather, conditions, or even batting resistance prevent either side from forcing a result.",
  },
  {
    title: "Box cricket",
    duration: "20–40 minutes per match",
    overs: "5–8 overs per side",
    body: "Box cricket is an indoor or small-ground format played in a confined rectangular space (the 'box'). Each team typically consists of six to eight players, with 5–8 overs per side. Boundaries are replaced by fixed scoring zones on the walls or nets. Hitting the ceiling or specific zones may count as a six or result in dismissal depending on local rules. Box cricket is extremely popular in South Asia, especially in India and Pakistan, as a recreational format that can be played year-round regardless of weather. Because the scoring and fielding rules vary widely between venues, always confirm local box rules before the first ball.",
  },
  {
    title: "Tennis ball cricket",
    duration: "1–2 hours",
    overs: "6–15 overs per side",
    body: "Tennis ball cricket replaces the hard leather ball with a softer tennis ball (sometimes taped for swing). This makes the game safer, especially on hard concrete grounds or when played without helmets and proper protective gear. Tennis ball cricket is enormously popular in street and gully cricket across South Asia. Wide rules are usually applied strictly (the ball must pitch on the surface and turn inside the batting zone), and LBW decisions are often excluded. The batting grip and shot-making needed for tennis ball cricket differs from leather-ball cricket, particularly on bouncy or slow surfaces. Cricket Score Counter works well for tennis ball local leagues.",
  },
  {
    title: "Tape ball cricket",
    duration: "1–2 hours",
    overs: "6–12 overs per side",
    body: "Tape ball cricket, popular especially in Pakistan, uses a tennis ball wrapped in electrical or insulation tape. The tape changes the ball's aerodynamics, allowing it to swing significantly in both directions. Tape ball cricket has its own distinct culture, with specialists who can swing the ball at pace. Played on streets, open grounds, and empty car parks, it is often the first form of cricket young players experience. The informal nature means teams often agree on ground-specific rules like 'one hand one bounce' or 'tip and run'. Scoring can be fast and dramatic, making it an ideal format for Cricket Score Counter's quick match setup.",
  },
  {
    title: "Gully cricket and street cricket",
    duration: "Variable",
    overs: "Variable",
    body: "Gully cricket is any informal cricket played in a narrow space — a street, alley, garden, or courtyard. Rules are highly creative and vary by location: one-hand one-bounce catches may be out, hitting the ball over a wall may lose the batter's wicket, and the number of players per team is completely flexible. The spirit of gully cricket is participation and enjoyment. Matches are often played with whatever is available — a tape ball, a plastic bat, a plank of wood, or even a rolled-up newspaper. For slightly more structured gully matches with score tracking, Cricket Score Counter can handle the ball-by-ball input and live sharing.",
  },
  {
    title: "School and under-age cricket",
    duration: "1.5–3 hours",
    overs: "10–30 overs per side",
    body: "School cricket formats vary by age group and governing body. Under-10 matches may use soft balls, shorter pitches, and modified rules like 'pairs cricket' where every pair of batters bats for a set number of overs and the wickets count as run deductions rather than dismissals. Under-12, under-14, and under-17 formats progressively move toward full cricket rules. School cricket emphasises participation, so retired-not-out rules are often used to ensure every player gets time at the crease. Scorers in school cricket need to be attentive to modified rules and should confirm the exact format with coaches before the match begins.",
  },
  {
    title: "Pairs cricket",
    duration: "1–2 hours",
    overs: "Equal overs per pair",
    body: "Pairs cricket is a modified format in which every pair of batters bats for a fixed number of overs regardless of wickets. Instead of being dismissed, a wicket costs the pair a set number of runs (typically 5 runs). At the end of each pair's allocation, the next pair comes in. This format maximises participation because no player sits out after getting out. Pairs cricket is widely used in school, community, and inclusive cricket programmes. Scoring pairs cricket requires tracking pairs separately and applying the wicket-run penalty correctly, which Cricket Score Counter can handle with the custom scoring events feature.",
  },
];

const choosingFormat = [
  "Available time: T20 fits an afternoon, 50-over cricket needs a full day, and box or tennis ball formats can be completed in under an hour.",
  "Number of players: most formats need 11 per side, but box, gully, and pairs cricket are more flexible.",
  "Ground and equipment: leather ball cricket needs a proper surface; tennis and tape ball formats work on concrete or turf.",
  "Skill level: pairs and school formats make the game safer and more inclusive for beginners.",
  "Weather: indoor box cricket and short formats are better suited when weather is unpredictable.",
];

const CricketMatchFormats: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <MetaHelmet
        pageTitle="Cricket Match Formats Explained"
        canonical={location.pathname}
        description="A complete guide to cricket match formats — T20, 50-over, Test, box cricket, tennis ball, gully cricket, pairs cricket, and school formats explained."
        keywords="cricket match formats, T20 cricket, 50 over cricket, box cricket, tennis ball cricket, tape ball cricket, gully cricket, school cricket, pairs cricket"
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
              Cricket Match Formats Explained
            </PageTitleWithBack>
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 600,
                fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(16px * var(--app-font-scale, 1))" },
                mb: 2,
              }}
            >
              From T20 to gully cricket — every cricket format explained so you know the rules, duration, and best use for each one.
            </Typography>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            {formats.map((format, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    color: "var(--app-accent-text, #185a9d)",
                    mb: 0.5,
                    fontSize: { xs: "calc(16px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))" },
                  }}
                >
                  {format.title}
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mb: 1, flexWrap: "wrap" }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "calc(12px * var(--app-font-scale, 1))", sm: "calc(13px * var(--app-font-scale, 1))" },
                      color: "#185a9d",
                      background: "rgba(67,206,162,0.18)",
                      borderRadius: 1,
                      px: 1,
                      py: 0.25,
                      fontWeight: 700,
                    }}
                  >
                    ⏱ {format.duration}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "calc(12px * var(--app-font-scale, 1))", sm: "calc(13px * var(--app-font-scale, 1))" },
                      color: "#185a9d",
                      background: "rgba(24,90,157,0.10)",
                      borderRadius: 1,
                      px: 1,
                      py: 0.25,
                      fontWeight: 700,
                    }}
                  >
                    🏏 {format.overs}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: "var(--app-accent-text, #185a9d)",
                    lineHeight: 1.75,
                    fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(15px * var(--app-font-scale, 1))" },
                  }}
                >
                  {format.body}
                </Typography>
                {index < formats.length - 1 && (
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
              How to choose the right format for your match
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
              {choosingFormat.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </Box>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontSize: { xs: "calc(13px * var(--app-font-scale, 1))", sm: "calc(14px * var(--app-font-scale, 1))" },
                fontStyle: "italic",
              }}
            >
              Cricket Score Counter supports all limited-over formats. Enter your overs per side during match setup and the app will track balls, overs, run rate, and target for the format you choose.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default CricketMatchFormats;
