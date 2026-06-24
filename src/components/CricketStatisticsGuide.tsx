import React from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";

const battingStats = [
  {
    stat: "Runs",
    formula: "Total runs scored by the batter",
    explanation:
      "The most basic batting statistic. Runs include all runs scored off the bat — singles, twos, threes, fours, and sixes. Extras like wides, no-balls, byes, and leg-byes do not count in the batter's individual run tally, though they do count in the team total.",
  },
  {
    stat: "Balls faced",
    formula: "Number of legal deliveries received",
    explanation:
      "Balls faced counts only legal deliveries. Wide balls do not count as balls faced. No-balls do count as balls faced. This statistic is used to calculate strike rate and shows how long a batter has been at the crease in terms of deliveries rather than time.",
  },
  {
    stat: "Strike rate",
    formula: "(Runs ÷ Balls faced) × 100",
    explanation:
      "Strike rate shows how many runs a batter scores per 100 balls. A strike rate of 100 means one run per ball — the benchmark for aggressive batting in limited-over cricket. In T20 cricket, a strike rate above 130 is typically considered good for a top-order batter. In 50-over cricket, a strike rate of 80–90 in the middle overs is often acceptable, with higher rates expected during death overs. A lower strike rate indicates a slower, more defensive approach.",
  },
  {
    stat: "Batting average",
    formula: "Total runs ÷ Total dismissals",
    explanation:
      "Batting average is calculated by dividing the total runs scored by the number of times a batter has been dismissed. Not-outs (where the innings ends but the batter was not dismissed) are subtracted from the innings count but not the run tally, which can inflate averages for batters who frequently bat at the end. An average above 40 in Test cricket is considered excellent. In limited-over cricket, averages are considered alongside strike rate — a high average at a slow strike rate can actually hurt the team.",
  },
  {
    stat: "Boundaries (fours and sixes)",
    formula: "Count of balls that reached the boundary",
    explanation:
      "Fours and sixes are tracked separately because they show a batter's power hitting. A batter with many boundaries is scoring quickly without relying on running. In local cricket, six counts (over-boundary) are often capped for safety reasons — for example, a max-sixes rule. Tracking boundaries also helps assess the risk approach of a batter during their innings.",
  },
  {
    stat: "Highest score",
    formula: "Best individual innings total",
    explanation:
      "The highest score is the best single-innings total a batter has ever scored. A not-out innings is indicated with an asterisk (e.g., 87*). In local cricket scorecards, the highest score for each player in a tournament or season gives a quick view of who the most dangerous batters are.",
  },
  {
    stat: "Half-centuries and centuries",
    formula: "Innings with 50+ or 100+ runs",
    explanation:
      "A half-century (50 or more runs in one innings) and a century (100 or more runs in one innings) are milestone scores. These are tracked as separate statistics because they demonstrate match-winning innings. In T20 cricket, centuries are rare because innings are short, so half-centuries carry more weight.",
  },
  {
    stat: "Partnership runs",
    formula: "Total runs scored while two specific batters are both at the crease",
    explanation:
      "A partnership is the runs scored between two batters while both are at the crease. Partnerships are a key tactical concept — a large partnership stabilises an innings after early wickets or accelerates the scoring in the closing overs. Tracking partnerships shows which batting pairs are most effective together.",
  },
];

const bowlingStats = [
  {
    stat: "Wickets",
    formula: "Total dismissals credited to the bowler",
    explanation:
      "Wickets are the primary measure of a bowler's effectiveness. A bowler is credited with a wicket for bowled, LBW, caught (by any fielder), stumped, and hit wicket dismissals. Run outs are not credited to any bowler. In limited-over cricket, five wickets in a single innings is a major achievement. In Test cricket, a ten-wicket match haul (five per innings) is extremely rare.",
  },
  {
    stat: "Overs bowled",
    formula: "Legal deliveries ÷ 6 (with remainder as balls)",
    explanation:
      "Overs bowled are expressed as a decimal where the digit before the decimal point is complete overs and the digit after represents additional legal deliveries. For example, 4.3 overs means four complete overs and three additional legal balls. Wide balls and no-balls add to the over length but are not legal deliveries, so they do not count toward legal ball totals.",
  },
  {
    stat: "Runs conceded",
    formula: "Total runs given away, including extras attributed to the bowler",
    explanation:
      "Runs conceded includes all runs scored off a bowler's deliveries, plus wides and no-balls (which are attributed to the bowler). Byes and leg-byes are extras attributed to the team but not specifically to the bowler, though they still appear in the team extras column. Keeping runs conceded low is as important as taking wickets in limited-over cricket.",
  },
  {
    stat: "Economy rate",
    formula: "Runs conceded ÷ Overs bowled",
    explanation:
      "Economy rate shows how many runs a bowler concedes per over. In T20 cricket, an economy of 7–8 runs per over is good for a top bowler. In 50-over cricket, an economy below 5 in the middle overs is excellent. Death-over bowlers often have higher economies because batters attack them, so context matters. Economy is the most important bowling statistic in limited-over cricket because every extra run costs the team.",
  },
  {
    stat: "Bowling average",
    formula: "Runs conceded ÷ Wickets taken",
    explanation:
      "Bowling average shows how many runs a bowler concedes per wicket taken. A lower average means the bowler takes wickets cheaply. In Test cricket, an average below 25 is excellent. In T20 cricket, averages are naturally higher because all batters are attacking. Bowling average is most meaningful over a large sample of overs and wickets.",
  },
  {
    stat: "Strike rate (bowling)",
    formula: "Balls bowled ÷ Wickets taken",
    explanation:
      "Bowling strike rate shows how many balls a bowler delivers between wickets. A lower bowling strike rate means the bowler takes wickets frequently. In Test cricket, a strike rate below 50 (one wicket every 50 balls) is considered very good. In T20 cricket, a bowling strike rate of 12–15 is excellent because matches are only 120 balls per innings.",
  },
  {
    stat: "Best bowling figures",
    formula: "Best single-innings wickets-for-runs (e.g., 4/18)",
    explanation:
      "Best bowling figures show the highest wicket count in a single innings along with the runs conceded in that spell. A figure of 4/18 means four wickets for 18 runs. This statistic captures peak bowling performance. In local cricket, three or four wickets in an innings is a strong performance. Five wickets in an innings is exceptional at any level.",
  },
];

const teamStats = [
  {
    stat: "Run rate (current run rate / CRR)",
    explanation:
      "Run rate is the average number of runs a team scores per over at any point in the innings. It is calculated as runs scored divided by overs completed. It helps viewers and players assess whether the batting team is on pace to post or chase a competitive score.",
  },
  {
    stat: "Required run rate (RRR)",
    explanation:
      "Required run rate is the average runs per over the chasing team needs to score from the current point to reach the target. It rises every time a dot ball is bowled or a wicket falls without sufficient runs. Monitoring the required run rate tells the batting team exactly how aggressively they need to play.",
  },
  {
    stat: "Net run rate (NRR)",
    explanation:
      "Net run rate is used in tournaments to separate teams that have equal points. It is calculated as the difference between a team's overall run rate scored across all matches minus their overall run rate conceded. Winning by large margins improves NRR while conceding fewer runs helps too. NRR is only meaningful after at least two or three matches.",
  },
  {
    stat: "Extras",
    explanation:
      "Extras are runs added to the team total that are not credited to any batter: wides, no-balls, byes, and leg-byes. A high extras count from the fielding side indicates bowling and wicketkeeping lapses. In close matches, extras can be the difference between winning and losing. Tracking extras per innings gives a useful discipline measure for bowlers and wicketkeepers.",
  },
];

const CricketStatisticsGuide: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <MetaHelmet
        pageTitle="Cricket Statistics Explained — Batting, Bowling & Team Stats"
        canonical={location.pathname}
        description="Understand every cricket statistic — batting average, strike rate, economy rate, bowling average, run rate, and more. Clear explanations and formulas for local and club cricket."
        keywords="cricket statistics, cricket batting average, cricket strike rate, bowling economy rate, cricket run rate, cricket stats explained, cricket scorecard stats"
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
              Cricket Statistics Explained
            </PageTitleWithBack>
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 600,
                fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(16px * var(--app-font-scale, 1))" },
                mb: 2,
              }}
            >
              Every batting, bowling, and team statistic you will see on a cricket scorecard — with clear formulas and practical explanations.
            </Typography>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            {/* Batting */}
            <Typography
              sx={{
                fontWeight: 900,
                color: "var(--app-accent-text, #185a9d)",
                mb: 2,
                fontSize: { xs: "calc(18px * var(--app-font-scale, 1))", sm: "calc(22px * var(--app-font-scale, 1))" },
              }}
            >
              Batting statistics
            </Typography>
            {battingStats.map((item, index) => (
              <Box key={index} sx={{ mb: 2.5 }}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    color: "var(--app-accent-text, #185a9d)",
                    fontSize: { xs: "calc(15px * var(--app-font-scale, 1))", sm: "calc(17px * var(--app-font-scale, 1))" },
                  }}
                >
                  {item.stat}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "calc(12px * var(--app-font-scale, 1))", sm: "calc(13px * var(--app-font-scale, 1))" },
                    color: "#185a9d",
                    background: "rgba(67,206,162,0.15)",
                    borderRadius: 1,
                    px: 1,
                    py: 0.25,
                    display: "inline-block",
                    fontWeight: 700,
                    mb: 0.75,
                    fontFamily: "monospace",
                  }}
                >
                  Formula: {item.formula}
                </Typography>
                <Typography
                  sx={{
                    color: "var(--app-accent-text, #185a9d)",
                    lineHeight: 1.75,
                    fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(15px * var(--app-font-scale, 1))" },
                  }}
                >
                  {item.explanation}
                </Typography>
                {index < battingStats.length - 1 && (
                  <Divider sx={{ mt: 2.5, background: "rgba(67,206,162,0.25)" }} />
                )}
              </Box>
            ))}

            <Divider sx={{ my: 3, background: "var(--app-accent-start, #43cea2)" }} />

            {/* Bowling */}
            <Typography
              sx={{
                fontWeight: 900,
                color: "var(--app-accent-text, #185a9d)",
                mb: 2,
                fontSize: { xs: "calc(18px * var(--app-font-scale, 1))", sm: "calc(22px * var(--app-font-scale, 1))" },
              }}
            >
              Bowling statistics
            </Typography>
            {bowlingStats.map((item, index) => (
              <Box key={index} sx={{ mb: 2.5 }}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    color: "var(--app-accent-text, #185a9d)",
                    fontSize: { xs: "calc(15px * var(--app-font-scale, 1))", sm: "calc(17px * var(--app-font-scale, 1))" },
                  }}
                >
                  {item.stat}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "calc(12px * var(--app-font-scale, 1))", sm: "calc(13px * var(--app-font-scale, 1))" },
                    color: "#185a9d",
                    background: "rgba(24,90,157,0.10)",
                    borderRadius: 1,
                    px: 1,
                    py: 0.25,
                    display: "inline-block",
                    fontWeight: 700,
                    mb: 0.75,
                    fontFamily: "monospace",
                  }}
                >
                  Formula: {item.formula}
                </Typography>
                <Typography
                  sx={{
                    color: "var(--app-accent-text, #185a9d)",
                    lineHeight: 1.75,
                    fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(15px * var(--app-font-scale, 1))" },
                  }}
                >
                  {item.explanation}
                </Typography>
                {index < bowlingStats.length - 1 && (
                  <Divider sx={{ mt: 2.5, background: "rgba(67,206,162,0.25)" }} />
                )}
              </Box>
            ))}

            <Divider sx={{ my: 3, background: "var(--app-accent-start, #43cea2)" }} />

            {/* Team */}
            <Typography
              sx={{
                fontWeight: 900,
                color: "var(--app-accent-text, #185a9d)",
                mb: 2,
                fontSize: { xs: "calc(18px * var(--app-font-scale, 1))", sm: "calc(22px * var(--app-font-scale, 1))" },
              }}
            >
              Team and match statistics
            </Typography>
            {teamStats.map((item, index) => (
              <Box key={index} sx={{ mb: 2.5 }}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    color: "var(--app-accent-text, #185a9d)",
                    fontSize: { xs: "calc(15px * var(--app-font-scale, 1))", sm: "calc(17px * var(--app-font-scale, 1))" },
                    mb: 0.75,
                  }}
                >
                  {item.stat}
                </Typography>
                <Typography
                  sx={{
                    color: "var(--app-accent-text, #185a9d)",
                    lineHeight: 1.75,
                    fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(15px * var(--app-font-scale, 1))" },
                  }}
                >
                  {item.explanation}
                </Typography>
                {index < teamStats.length - 1 && (
                  <Divider sx={{ mt: 2.5, background: "rgba(67,206,162,0.25)" }} />
                )}
              </Box>
            ))}

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontSize: { xs: "calc(13px * var(--app-font-scale, 1))", sm: "calc(14px * var(--app-font-scale, 1))" },
                fontStyle: "italic",
              }}
            >
              Cricket Score Counter tracks runs, wickets, balls faced, extras, run rate, and required run rate live during your match. Individual batting and bowling scorecards are available after each innings.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default CricketStatisticsGuide;
