import React from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";

const steps = [
  {
    number: "1",
    title: "Create a match",
    body: "Tap 'Create Game' on the home screen. Enter both team names, set the number of overs per side, and add player names if you want full batting and bowling scorecards. Player names are optional — you can score without them — but adding them before the first ball means every run, wicket, and extra is credited to the correct player from the start. If your team plays together regularly, you can save player lists and reload them for future matches without retyping every name.",
  },
  {
    number: "2",
    title: "Set up opening players",
    body: "After the match is created, select the two opening batters and the first bowler. This is the most important setup step. Choosing the wrong striker means run credits and balls faced will be allocated to the wrong player, and correcting this mid-innings is difficult. Take fifteen seconds to confirm names with the captain or opening players before pressing the first scoring button. In local cricket, the opening bowler sometimes isn't known until after the toss — just select any placeholder name and correct it before the ball is bowled.",
  },
  {
    number: "3",
    title: "Score ball by ball",
    body: "The scoring keypad shows buttons for runs (0 through 6), extras (Wide, No Ball, Bye, Leg Bye), and wickets. After each delivery, tap the correct button. For a dot ball, tap 0. For a four, tap 4. For a wide, tap WD. The score, over count, run rate, and player stats all update instantly after every tap. There is an undo button if you make a mistake — it removes the last delivery and restores the scorecard to its previous state. Try to stay one ball ahead by mentally preparing the next entry before the bowler starts their run-up.",
  },
  {
    number: "4",
    title: "Handle extras correctly",
    body: "Extras are one of the most common sources of scoring errors. A wide adds one run and is not a legal delivery — the over continues. A no-ball adds one run and is also not a legal delivery. Byes (ball passes the bat and wicketkeeper without touching either) are legal deliveries and add runs to the team total but not the batter's score. Leg-byes work the same way as byes. In Cricket Score Counter, long pressing the WD or NB button lets you record additional runs scored off the same delivery — for example, a wide that goes to the boundary for four extra runs (WD + 4 = 5 extras total).",
  },
  {
    number: "5",
    title: "Record wickets",
    body: "When a wicket falls, tap the wicket button and select the dismissal type: Bowled, Caught, Run Out, LBW, Stumped, or Hit Wicket. For caught dismissals, you can record the fielder who took the catch, which updates bowling and fielding figures. For run outs, select the batter who is out. After recording the wicket, you will be prompted to select the new batter. Choose the incoming player before scoring the next delivery. If you accidentally record the wrong batter as out, use the undo button immediately — it is the fastest way to correct a wicket entry.",
  },
  {
    number: "6",
    title: "Manage bowling changes",
    body: "At the end of each over, Cricket Score Counter prompts you to select the next bowler. The previous bowler's name is shown for reference but cannot be selected for the next consecutive over (no bowler can bowl two consecutive overs in cricket). Selecting the correct bowler at the start of every over is critical because all runs, wides, and no-balls on those deliveries are credited to the active bowler. In local matches with frequent bowling changes, ask the captain or fielding side captain which bowler is coming on before dismissing the prompt.",
  },
  {
    number: "7",
    title: "Share live updates",
    body: "Cricket Score Counter generates a unique live match link for every game. Tap the share button to copy the link or send it directly via WhatsApp, SMS, or any messaging app. Anyone with the link can open the live scorecard on their phone or computer without creating an account. The scorecard updates every time you enter a delivery, so family members, teammates on the bench, and fans at home can follow the match ball by ball in real time. Share the link after setting up the match and before the first ball — viewers can then follow from the opening delivery.",
  },
  {
    number: "8",
    title: "Second innings and target",
    body: "After the first innings ends, the second team begins batting with a target. Cricket Score Counter automatically calculates the target (first innings total + 1) and displays the required run rate throughout the chase. As the innings progresses, the app shows how many runs are needed from how many balls at every delivery. This live target tracking is one of the most useful features for chasing teams, captains, and viewers. If the chasing team reaches the target, the match result is declared instantly.",
  },
  {
    number: "9",
    title: "Save and review match history",
    body: "After the match ends, log in or create a free account to save the completed scorecard. Saved matches are stored in match history, where you can review batting scorecards, bowling figures, over-by-over run flow, and key events from the match. This is useful for tournaments where you want to track player performance across multiple matches, and for coaches who want to review batting and bowling stats after training games. Matches saved to history are accessible from any device where you are logged in.",
  },
];

const beforeYouStart = [
  "Confirm the number of overs per side with both captains before the toss.",
  "Add player names before the first ball if you want complete scorecards.",
  "Check the batting team and opening batters after the toss result.",
  "Confirm the first bowler with the fielding captain before Ball 1.",
  "Test the share link by sending it to yourself before sharing it with viewers.",
  "Keep the phone brightness high enough to read the keypad comfortably.",
  "Turn off auto-lock or set a long screen timeout so the phone doesn't lock during an over.",
];

const workedExample = {
  title: "Worked example: scoring a full over",
  deliveries: [
    {
      ball: "Ball 1",
      event: "Dot ball",
      action: "Tap 0",
      note: "Score stays the same. Legal ball count: 1 of 6.",
    },
    {
      ball: "Ball 2",
      event: "Wide ball",
      action: "Tap WD",
      note: "Team total +1. Legal ball count stays at 1 (wide is not a legal delivery).",
    },
    {
      ball: "Ball 2 (re-bowled)",
      event: "Four runs",
      action: "Tap 4",
      note: "Team total +4, batter +4, strike rate updates. Legal ball count: 2 of 6.",
    },
    {
      ball: "Ball 3",
      event: "Wicket (caught)",
      action: "Tap Wicket → Caught → select fielder → select new batter",
      note: "Batter out, new batter comes in. Legal ball count: 3 of 6.",
    },
    {
      ball: "Ball 4",
      event: "Single",
      action: "Tap 1",
      note: "Team total +1, batter +1, strike rotates. Legal ball count: 4 of 6.",
    },
    {
      ball: "Ball 5",
      event: "No ball + 1 run",
      action: "Long press NB → select extra runs: 1",
      note: "Team total +2. Legal ball count stays at 4.",
    },
    {
      ball: "Ball 5 (re-bowled)",
      event: "Two runs",
      action: "Tap 2",
      note: "Team total +2, batter +2. Legal ball count: 5 of 6.",
    },
    {
      ball: "Ball 6",
      event: "Six",
      action: "Tap 6",
      note: "Team total +6, batter +6. Legal ball count: 6 of 6. Over complete.",
    },
  ],
  summary:
    "End of over: 15 team runs scored (0 + 1 wide + 4 + 1 wicket + 1 single + 2 no-ball extras + 2 + 6), 1 wicket, 6 legal deliveries. Over recorded correctly.",
};

const glossary = [
  { term: "Striker", definition: "The batter currently facing deliveries." },
  {
    term: "Non-striker",
    definition: "The batter at the bowler's end, ready to run.",
  },
  {
    term: "Legal delivery",
    definition:
      "A ball that is not a wide or no-ball. Six legal deliveries complete an over.",
  },
  {
    term: "Extras",
    definition:
      "Runs added to the team total for wides, no-balls, byes, and leg-byes.",
  },
  {
    term: "Run rate (CRR)",
    definition: "Runs scored per over so far in the innings.",
  },
  {
    term: "Required run rate (RRR)",
    definition:
      "Runs per over needed to reach the target from the current point.",
  },
  {
    term: "Partnership",
    definition:
      "Runs scored while two specific batters are at the crease together.",
  },
  {
    term: "Maiden over",
    definition:
      "An over in which no runs are conceded (no runs, no extras, no wides, no no-balls).",
  },
  {
    term: "Free hit",
    definition:
      "The delivery after a no-ball, during which the batter can only be out via a run out.",
  },
  {
    term: "Death overs",
    definition:
      "The final overs of a limited-over innings, usually overs 16–20 in T20 or 41–50 in 50-over cricket.",
  },
];

const HowItWorks: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <>
      <MetaHelmet
        pageTitle="How Cricket Score Counter Works — Step-by-Step Guide"
        canonical={location.pathname}
        description="Step-by-step guide to using Cricket Score Counter — match setup, ball-by-ball scoring, extras, wickets, bowling changes, live sharing, and match history."
        keywords="how to score cricket, cricket score counter guide, live cricket scoring, ball by ball scoring app, cricket scorer tutorial, how to use cricket score counter"
      />
      <AppBar showHomeMenuItem />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background:
            "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))",
          pb: 4,
        }}
      >
        <Box
          sx={{ width: "100%", maxWidth: 900, px: { xs: 1.5, sm: 2.5 }, mt: 2 }}
        >
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
                fontSize: {
                  xs: "calc(26px * var(--app-font-scale, 1))",
                  sm: "calc(34px * var(--app-font-scale, 1))",
                },
              }}
            >
              {t("How Cricket Score Counter Works")}
            </PageTitleWithBack>
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 600,
                fontSize: {
                  xs: "calc(14px * var(--app-font-scale, 1))",
                  sm: "calc(16px * var(--app-font-scale, 1))",
                },
                mb: 2,
              }}
            >
              {t(
                "From team setup to live sharing — a complete step-by-step guide to scoring your cricket match accurately and without stress.",
              )}
            </Typography>

            <Divider
              sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }}
            />

            {/* Steps */}
            {steps.map((step, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    mb: 0.75,
                  }}
                >
                  <Box
                    sx={{
                      minWidth: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "var(--app-accent-start, #43cea2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: "0.9rem",
                      color: "#fff",
                      mt: 0.2,
                      flexShrink: 0,
                    }}
                  >
                    {step.number}
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: "var(--app-accent-text, #185a9d)",
                      fontSize: {
                        xs: "calc(16px * var(--app-font-scale, 1))",
                        sm: "calc(18px * var(--app-font-scale, 1))",
                      },
                    }}
                  >
                    {step.title}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: "var(--app-accent-text, #185a9d)",
                    lineHeight: 1.75,
                    fontSize: {
                      xs: "calc(14px * var(--app-font-scale, 1))",
                      sm: "calc(15px * var(--app-font-scale, 1))",
                    },
                    pl: { xs: 0, sm: 5.5 },
                  }}
                >
                  {step.body}
                </Typography>
                {index < steps.length - 1 && (
                  <Divider sx={{ mt: 3, background: "rgba(67,206,162,0.3)" }} />
                )}
              </Box>
            ))}

            <Divider
              sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }}
            />

            {/* Before you start checklist */}
            <Typography
              sx={{
                fontWeight: 800,
                color: "var(--app-accent-text, #185a9d)",
                mb: 1.5,
                fontSize: {
                  xs: "calc(16px * var(--app-font-scale, 1))",
                  sm: "calc(18px * var(--app-font-scale, 1))",
                },
              }}
            >
              Before the first ball: pre-match checklist
            </Typography>
            <Box
              component="ul"
              sx={{
                pl: 2.4,
                m: 0,
                mb: 2,
                color: "var(--app-accent-text, #185a9d)",
                lineHeight: 1.9,
                fontSize: {
                  xs: "calc(14px * var(--app-font-scale, 1))",
                  sm: "calc(15px * var(--app-font-scale, 1))",
                },
              }}
            >
              {beforeYouStart.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </Box>

            <Divider
              sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }}
            />

            {/* Worked example */}
            <Typography
              sx={{
                fontWeight: 800,
                color: "var(--app-accent-text, #185a9d)",
                mb: 1.5,
                fontSize: {
                  xs: "calc(16px * var(--app-font-scale, 1))",
                  sm: "calc(18px * var(--app-font-scale, 1))",
                },
              }}
            >
              {workedExample.title}
            </Typography>
            <Box sx={{ overflowX: "auto", mb: 1.5 }}>
              <Box
                component="table"
                sx={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: {
                    xs: "calc(12px * var(--app-font-scale, 1))",
                    sm: "calc(14px * var(--app-font-scale, 1))",
                  },
                  color: "var(--app-accent-text, #185a9d)",
                }}
              >
                <Box component="thead">
                  <Box component="tr">
                    {["Ball", "Event", "Tap", "Notes"].map((h) => (
                      <Box
                        key={h}
                        component="th"
                        sx={{
                          textAlign: "left",
                          p: { xs: 0.75, sm: 1 },
                          fontWeight: 800,
                          borderBottom:
                            "2px solid var(--app-accent-start, #43cea2)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box component="tbody">
                  {workedExample.deliveries.map((d, i) => (
                    <Box
                      key={i}
                      component="tr"
                      sx={{
                        background:
                          i % 2 === 0 ? "rgba(67,206,162,0.07)" : "transparent",
                      }}
                    >
                      <Box
                        component="td"
                        sx={{
                          p: { xs: 0.75, sm: 1 },
                          whiteSpace: "nowrap",
                          fontWeight: 700,
                        }}
                      >
                        {d.ball}
                      </Box>
                      <Box component="td" sx={{ p: { xs: 0.75, sm: 1 } }}>
                        {d.event}
                      </Box>
                      <Box
                        component="td"
                        sx={{
                          p: { xs: 0.75, sm: 1 },
                          fontFamily: "monospace",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {d.action}
                      </Box>
                      <Box
                        component="td"
                        sx={{ p: { xs: 0.75, sm: 1 }, opacity: 0.8 }}
                      >
                        {d.note}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                lineHeight: 1.7,
                fontSize: {
                  xs: "calc(13px * var(--app-font-scale, 1))",
                  sm: "calc(14px * var(--app-font-scale, 1))",
                },
                fontWeight: 700,
                background: "rgba(67,206,162,0.12)",
                borderRadius: 2,
                p: 1.5,
              }}
            >
              {workedExample.summary}
            </Typography>

            <Divider
              sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }}
            />

            {/* Glossary */}
            <Typography
              sx={{
                fontWeight: 800,
                color: "var(--app-accent-text, #185a9d)",
                mb: 1.5,
                fontSize: {
                  xs: "calc(16px * var(--app-font-scale, 1))",
                  sm: "calc(18px * var(--app-font-scale, 1))",
                },
              }}
            >
              Scorer's glossary
            </Typography>
            <Box
              component="dl"
              sx={{
                m: 0,
                color: "var(--app-accent-text, #185a9d)",
                fontSize: {
                  xs: "calc(14px * var(--app-font-scale, 1))",
                  sm: "calc(15px * var(--app-font-scale, 1))",
                },
              }}
            >
              {glossary.map((entry, i) => (
                <Box key={i} sx={{ mb: 1.25 }}>
                  <Typography
                    component="dt"
                    sx={{ fontWeight: 800, display: "inline" }}
                  >
                    {entry.term}:{" "}
                  </Typography>
                  <Typography component="dd" sx={{ display: "inline", m: 0 }}>
                    {entry.definition}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default HowItWorks;
