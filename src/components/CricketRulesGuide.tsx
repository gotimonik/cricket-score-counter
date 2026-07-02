import React from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";
import RelatedGuideLinks from "./RelatedGuideLinks";

const sections = [
  {
    title: "The objective of cricket",
    body: "Cricket is played between two teams, each usually consisting of eleven players. The objective is simple: score more runs than the opposing team. One team bats while the other fields and bowls. After a set number of overs — or once all wickets fall — the teams switch roles. The team that scores the most runs across their innings wins the match. In local and friendly formats, the match is usually limited to a fixed number of overs per side, making run scoring and wicket taking equally important throughout.",
  },
  {
    title: "The pitch and playing area",
    body: "A cricket match is played on an oval ground with a rectangular strip in the centre called the pitch. The pitch is 22 yards (20.12 metres) long. At each end of the pitch are three wooden stumps topped by two small pieces called bails — this assembly is known as the wicket. The batting crease marks the safe zone for batters, and the bowling crease marks where the bowler must deliver the ball. In local matches the full oval boundary may not be marked precisely, so agreeing on boundary positions before the match avoids disputes.",
  },
  {
    title: "Batting rules",
    body: "Two batters are on the field at all times — one at each end of the pitch. The batter facing the delivery is called the striker, and the batter at the non-striker's end is the non-striker. The striker tries to hit the ball and score runs. A run is scored when both batters run to opposite ends of the pitch and cross safely. If the ball reaches the boundary rope along the ground, four runs are automatically awarded. If the ball clears the boundary rope without bouncing, six runs are awarded. Batters do not have to run every time they hit the ball; they can choose to stay in their crease if running would be risky.",
  },
  {
    title: "Bowling rules",
    body: "The bowler delivers the ball from one end of the pitch, aiming to take wickets and restrict runs. A legal delivery must be bowled with a straight arm action. The bowler must not overstep the bowling crease — doing so results in a no-ball, which adds one extra run to the batting team's total and means the delivery does not count as a legal ball. The bowler bowls six legal deliveries per over. Different bowlers must bowl from alternate ends, and no bowler can bowl two consecutive overs. In limited-over local formats, there is usually a cap on the maximum number of overs any single bowler can deliver.",
  },
  {
    title: "Extras: wides, no-balls, byes, and leg-byes",
    body: "Extras are runs added to the batting team's total that are not credited to any batter. A wide is called when the ball passes too far from the batter for them to play a normal shot. A no-ball is called for foot faults, dangerous deliveries, or throwing. Both wides and no-balls add one run immediately and must be rebowled. Byes are runs scored when the ball passes the batter and the wicketkeeper without touching the bat or the batter's body. Leg-byes are runs scored when the ball hits the batter's pad or body (but not the bat) and the batters run. Wides and no-balls are not counted as legal deliveries, so the over continues until six legal balls are recorded.",
  },
  {
    title: "Dismissals: how a batter gets out",
    body: "There are ten recognised ways a batter can be dismissed in cricket. Bowled: the ball hits the stumps and dislodges a bail. Caught: a fielder catches the ball before it touches the ground after the batter hits it. LBW (Leg Before Wicket): the ball would have hit the stumps but is intercepted by the batter's pad or body. Run out: the stumps are broken while a batter is still running between wickets and has not reached the crease. Stumped: the wicketkeeper breaks the stumps when the batter is out of their crease after missing a delivery. Hit wicket: the batter knocks their own stumps while playing a shot. Handled the ball, obstructed the field, timed out, and hit the ball twice are also dismissals but rare in local matches. In local matches, only the most common dismissals (bowled, caught, run out, LBW, and stumped) are regularly seen.",
  },
  {
    title: "Fielding restrictions and powerplay",
    body: "In many limited-over formats, fielding restrictions apply during the opening overs. During the powerplay, only a certain number of fielders are allowed outside the inner fielding circle. This rule is designed to allow batters more freedom in the early overs and encourage attacking batting. In local matches with fewer than the standard 50 overs per side, the powerplay length is often scaled down proportionally, or teams agree on a shorter powerplay before the match. Understanding the powerplay rules for your format before the toss prevents disputes during the innings.",
  },
  {
    title: "Running between the wickets",
    body: "Running is one of the most important and often misunderstood parts of local cricket. After the ball is hit, both batters communicate and decide whether to run. If both batters cross the halfway point of the pitch, they must complete the run. A batter is run out if their bat or body is not behind the crease when the fielding side breaks the stumps. Good running calls ('yes', 'no', 'wait') prevent most run-out situations. In local cricket, run outs often happen due to poor communication, so calling clearly and backing up at the non-striker's end is critical.",
  },
  {
    title: "The innings structure",
    body: "In a limited-over local match, each team bats for one innings. The innings ends when the agreed number of overs is complete or when ten wickets fall — whichever comes first (one batter must remain as a partner for the striker at all times, so the innings ends on the tenth wicket). After the first team completes its innings, the second team bats and chases the target. The target is one run more than the first team's total. In a two-innings match (common in club and school cricket), each side bats twice and the scores across both innings are combined.",
  },
  {
    title: "The result: win, loss, tie, and no-result",
    body: "The team that scores more runs wins. If the chasing team reaches or passes the target, they win. If the fielding team takes all ten wickets before the target is reached, they win. A tie occurs when both teams score exactly the same number of runs and all wickets have fallen in the chasing innings. A no-result is declared when rain or other conditions prevent enough overs from being completed. In local matches a minimum number of overs per side must be bowled for a result to count, though the exact threshold should be agreed before the match starts.",
  },
  {
    title: "Special rules for local and friendly formats",
    body: "Local and friendly cricket often uses additional rules to make the game fairer and more inclusive. Common variations include: a free hit after every no-ball (the batter cannot be out on the next delivery except for a run out), a maximum number of overs per bowler, retired-not-out rules that allow a set batter to voluntarily leave and let others bat, one-hand one-bounce rules in very informal games, and tape-ball or tennis-ball rules that affect how wides and no-balls are judged. Always confirm which special rules apply before the toss so both captains and the scorer are clear on how the match will be conducted.",
  },
];

const quickReferenceRules = [
  "An over consists of six legal deliveries. Wides and no-balls are not legal deliveries.",
  "Wides and no-balls each add one run automatically to the team total.",
  "Four runs for a ground boundary; six runs for a ball that clears the boundary without bouncing.",
  "A batter is safe as long as their bat or body is behind the batting crease.",
  "The innings ends at ten wickets down (the eleventh batter has no partner) or at the end of the overs.",
  "The target for the chasing team is always one run more than the first innings total.",
  "No bowler can bowl two consecutive overs.",
  "Fielding restrictions during powerplay limit the number of fielders outside the inner circle.",
];

const CricketRulesGuide: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <MetaHelmet
        pageTitle="Cricket Rules Guide for Local Matches"
        canonical={location.pathname}
        description="A complete cricket rules guide covering batting, bowling, fielding, extras, dismissals, innings structure, and local match variations."
        keywords="cricket rules, cricket rules for local matches, how to play cricket, cricket batting rules, cricket bowling rules, cricket dismissals, cricket extras"
        ogType="article"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Cricket Rules Guide", path: "/cricket-rules-guide" },
        ]}
        article={{
          datePublished: "2026-06-24",
          dateModified: "2026-06-24",
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
              Cricket Rules Guide for Local Matches
            </PageTitleWithBack>
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 600,
                fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(16px * var(--app-font-scale, 1))" },
                mb: 2,
              }}
            >
              Everything you need to know about cricket rules — from the basics of batting and bowling to dismissals, extras, and local match variations.
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
              Quick reference: rules to confirm before every match
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
              {quickReferenceRules.map((rule, i) => (
                <li key={i}>{rule}</li>
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
              These rules reflect standard limited-over cricket as played in local, school, club, and friendly formats. Official tournaments may follow additional ICC or board regulations. Always confirm match-specific rules with both captains before the toss.
            </Typography>

            <Divider sx={{ my: 3, background: "var(--app-accent-start, #43cea2)" }} />

            <RelatedGuideLinks
              links={[
                {
                  title: "Cricket Match Formats →",
                  path: "/cricket-match-formats",
                  description: "See how these rules apply differently across T20, 50-over, Test, and local formats.",
                },
                {
                  title: "Cricket Scoring Guide",
                  path: "/cricket-scoring-guide",
                  description: "Turn these rules into practice with a ball-by-ball scoring walkthrough.",
                },
                {
                  title: "FAQ",
                  path: "/faq",
                  description: "Quick answers about setup, sharing, and match history.",
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

export default CricketRulesGuide;
