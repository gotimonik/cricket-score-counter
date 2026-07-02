import React from "react";
import { Box, Divider, Link as MuiLink, Paper, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";
import RelatedGuideLinks from "./RelatedGuideLinks";

const inlineLinkSx = {
  color: "#0b5fa5",
  fontWeight: 800,
  textDecorationColor: "rgba(11,95,165,0.5)",
} as const;

const GuideLink: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => (
  <MuiLink component={RouterLink} to={to} sx={inlineLinkSx}>
    {children}
  </MuiLink>
);

const guideSections = [
  {
    title: "Before the first ball",
    body: (
      <>
        Confirm the match format, total overs, batting team, fielding team,
        opening batters, and first bowler before scoring starts. A clean
        setup prevents most local-match scoring mistakes. If your group is
        unsure which rules apply — overs per bowler, powerplays, or wide
        limits — check the <GuideLink to="/cricket-rules-guide">Cricket Rules Guide</GuideLink>{" "}
        before the toss so the scorer and both captains start from the same
        page.
      </>
    ),
  },
  {
    title: "Legal deliveries and overs",
    body: (
      <>
        A standard cricket over has six legal deliveries. Wides and no-balls
        add runs but do not count as legal balls, so the over continues
        until six legal deliveries are recorded. The diagram below shows why
        an over with one wide still needs six legal balls bowled before the
        bowler changes ends.
      </>
    ),
    image: true,
  },
  {
    title: "Runs and strike rotation",
    body: (
      <>
        Singles, threes, and most odd-numbered running scores rotate the
        strike. Boundaries and even-numbered running scores usually keep
        the same batter on strike unless the over ends. For example, a
        batter who takes a single off the fifth ball faces the strike
        again only if the batters cross back on the sixth ball — otherwise
        the non-striker plays the last ball, and the strike then rotates
        again for the new over regardless of how that final ball is
        scored.
      </>
    ),
  },
  {
    title: "Extras explained",
    body: (
      <>
        Wides and no-balls are added to the team total as extras and do not
        count as legal deliveries, so the bowler must send down another
        ball to complete the over. Byes and leg-byes are also extras, but
        unlike wides and no-balls they do count as legal deliveries because
        the batter had a fair chance to play the delivery. Mixing up this
        distinction is one of the most common sources of over-counting
        mistakes in local scoring, since it throws off both the over count
        and the bowler&apos;s figures at the same time.
      </>
    ),
  },
  {
    title: "Advanced wide and no-ball scoring",
    body: (
      <>
        In Cricket Score Counter, you can long press the WD (Wide) button to
        record additional runs scored on the same delivery. This makes it
        easy to score situations such as a wide ball that goes for multiple
        runs, or a no-ball that also results in extra runs off the bat —
        both amounts are added in one action instead of two separate
        entries.
      </>
    ),
  },
  {
    title: "How the format changes what you watch for",
    body: (
      <>
        T20, 50-over, and Test-length matches all use the same scoring
        rules, but a scorer&apos;s priorities shift with the format. Short
        formats compress pressure into a handful of overs, so current run
        rate and required run rate swing quickly and need updating after
        every ball. Longer local formats leave more room to recover from a
        slow start, but make it easier to lose track of overs bowled per
        bowler if your group enforces a bowler limit. If you are setting up
        a match and are not sure which format fits, the{" "}
        <GuideLink to="/cricket-match-formats">Cricket Match Formats guide</GuideLink>{" "}
        compares overs, bowler limits, and typical scoring patterns across
        formats.
      </>
    ),
  },
  {
    title: "Reading the scorecard while you score",
    body: (
      <>
        A live scorecard is more than a total. Current run rate (CRR) shows
        how quickly the batting team is scoring right now, and required run
        rate (RRR) shows how quickly they need to score to reach the
        target. Strike rate and economy rate show how a specific batter or
        bowler is performing compared with the team average, and the
        extras column separates deliveries the batter did not control from
        runs they scored themselves. Keeping these numbers accurate as you
        score is what makes the post-match scorecard trustworthy — the{" "}
        <GuideLink to="/cricket-statistics-guide">Cricket Statistics Guide</GuideLink>{" "}
        breaks down exactly how each of these numbers is calculated.
      </>
    ),
  },
  {
    title: "Wickets and how each dismissal is scored",
    body: (
      <>
        Record the wicket type as soon as it happens, since each dismissal
        affects the batting and bowling scorecards differently:
      </>
    ),
    list: [
      <>
        <strong>Bowled</strong> — credited to the bowler; the delivery must
        be legal.
      </>,
      <>
        <strong>Caught</strong> — credited to the bowler and the fielder;
        any runs completed before the catch still count.
      </>,
      <>
        <strong>Run out</strong> — not credited to the bowler; check who was
        left short of their crease when the mistimed run happened.
      </>,
      <>
        <strong>Stumped</strong> — credited to the bowler and the
        wicketkeeper, and applies when the batter is out of their crease
        off a delivery rather than while running.
      </>,
      <>
        <strong>Hit wicket</strong> — credited to the bowler; the batter
        dislodges their own stumps while playing a shot or setting off for
        a run.
      </>,
      <>
        <strong>Retired out</strong> — recorded as a wicket in the
        scorecard, unlike a batter who simply retires hurt or retires not
        out.
      </>,
      <>
        <strong>LBW, obstructing the field, and timed out</strong> — rarer
        at local level, but still need a wicket recorded against the
        correct batter so the innings total stays accurate.
      </>,
    ],
  },
  {
    title: "Targets and required run rate",
    body: (
      <>
        In a chase, the target is one run more than the first innings
        total. Required run rate changes after every legal ball, so a live
        scorer should update it immediately rather than waiting until the
        end of an over. If overs are reduced for time or rain in a local
        match, agree on a simple revised target before the next over
        starts — most local games use a proportional adjustment rather than
        a full Duckworth-Lewis-style calculation, so make sure both teams
        agree on the method before continuing.
      </>
    ),
  },
  {
    title: "Live scoring and sharing",
    body: (
      <>
        Once the match setup is complete, you can share the live score link
        with players, coaches, friends, and family. Every ball update is
        reflected instantly, allowing everyone to follow the match in real
        time.
      </>
    ),
  },
  {
    title: "Save matches and continue later",
    body: (
      <>
        Logged-in users can save matches and access them from any device.
        This is useful for tournaments, practice matches, or long games
        where scoring may continue later or be managed by different
        scorers.
      </>
    ),
  },
];

const commonMistakes = [
  "Forgetting to record a wide or no-ball as an extra, which throws off both the team total and the over count.",
  "Losing track of which batter is on strike after an odd number of runs or after the over ends.",
  "Selecting the wrong bowler at the start of an over, which corrupts bowling figures for the rest of the innings.",
  "Waiting until after the next ball to record a wicket, which makes it easy to misattribute the dismissal.",
  "Not confirming the target and required run rate as soon as the second innings starts.",
  "Leaving corrections until after the innings ends, when the sequence of events is harder to remember accurately.",
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
  {
    title: "Correcting a missed wide",
    body:
      "If you realize a wide was recorded as a normal dot ball two deliveries later, fix the team total, the over's legal ball count, and the bowler's figures together. A single missed wide can otherwise make the over count and the run rate disagree for the rest of the innings.",
  },
];

const qualityChecks = [
  "The total score should equal batter runs plus extras.",
  "Bowling overs should match the legal balls delivered.",
  "The striker after an over should be checked against the final run on the previous ball.",
  "A no-ball or wide should not reduce the remaining legal balls in the over.",
  "The target should always be one run more than the first innings total.",
];

const quickAnswers = [
  {
    question: "Do I need to add player names to score a match?",
    answer:
      "No — team totals work without players, but add names if you want batting and bowling scorecards.",
  },
  {
    question: "Can I fix a mistake after the over has moved on?",
    answer:
      "Yes. Use undo or the recent events list as soon as you notice, and adjust the affected batter, bowler, and team totals together.",
  },
  {
    question:
      "What happens if a delivery is both a no-ball and worth extra runs?",
    answer:
      "Record the no-ball and add any runs completed or conceded on the same ball. Long-press the relevant button in Cricket Score Counter to add both at once.",
  },
];

const sectionHeadingSx = {
  fontWeight: 800,
  color: "var(--app-accent-text, #185a9d)",
  mb: 0.75,
} as const;

const sectionBodySx = {
  color: "var(--app-accent-text, #185a9d)",
  lineHeight: 1.7,
} as const;

const CricketScoringGuide: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <MetaHelmet
        pageTitle="Cricket Scoring Guide"
        canonical={location.pathname}
        description="A complete guide to cricket scoring: legal balls, extras, every wicket type, strike rotation, formats, reading a scorecard, targets, common mistakes, and local match scorekeeping tips."
        keywords="cricket scoring guide, how to score cricket, cricket extras explained, cricket wickets guide, local cricket scorekeeping, how to read a cricket scorecard"
        ogType="article"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Cricket Scoring Guide", path: "/cricket-scoring-guide" },
        ]}
        article={{
          datePublished: "2026-05-23",
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
              Use this guide when scoring school games, street matches,
              practice sessions, and club fixtures. It walks through every
              scoring decision that matters during a live innings — from the
              first ball to the final target — and links out to the rules,
              formats, and stats that sit behind those decisions.
            </Typography>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            {guideSections.map((section) => (
              <Box key={section.title} sx={{ mb: 2 }}>
                <Typography component="h2" sx={sectionHeadingSx}>
                  {section.title}
                </Typography>
                <Typography sx={sectionBodySx}>{section.body}</Typography>
                {section.list ? (
                  <Box
                    component="ul"
                    sx={{ pl: 2.4, mt: 1, mb: 0, color: "var(--app-accent-text, #185a9d)", lineHeight: 1.8 }}
                  >
                    {section.list.map((item, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <li key={index}>{item}</li>
                    ))}
                  </Box>
                ) : null}
                {section.image ? (
                  <Box
                    component="img"
                    src="/images/cricket-over-diagram.svg"
                    alt="Diagram of a cricket over showing six numbered legal deliveries in a row, with a wide or no-ball shown separately as an extra ball that does not count toward the six"
                    loading="lazy"
                    width={640}
                    height={240}
                    sx={{
                      display: "block",
                      width: "100%",
                      maxWidth: 560,
                      height: "auto",
                      mx: "auto",
                      mt: 1.5,
                      borderRadius: 2,
                      border: "1px solid rgba(24,90,157,0.15)",
                    }}
                  />
                ) : null}
              </Box>
            ))}

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography component="h2" sx={{ ...sectionHeadingSx, mb: 1 }}>
              Common scoring mistakes and how to avoid them
            </Typography>
            <Typography sx={{ ...sectionBodySx, mb: 1 }}>
              A few small habits cause most of the scoring errors in local
              matches. Watch for these:
            </Typography>
            <Box component="ul" sx={{ pl: 2.4, m: 0, color: "var(--app-accent-text, #185a9d)", lineHeight: 1.8 }}>
              {commonMistakes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </Box>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography component="h2" sx={{ ...sectionHeadingSx, mb: 1 }}>
              Match-day scorer checklist
            </Typography>
            <Box component="ul" sx={{ pl: 2.4, m: 0, color: "var(--app-accent-text, #185a9d)", lineHeight: 1.8 }}>
              {checklistItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </Box>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography component="h2" sx={{ ...sectionHeadingSx, mb: 1 }}>
              Why live scoring helps local cricket
            </Typography>
            <Typography sx={sectionBodySx}>
              A shared live score keeps players, viewers, and organizers
              aligned. It reduces score disputes, makes targets clear during
              a chase, and gives teams a useful summary after the match.
              Cricket Score Counter is built around that simple match-day
              need: enter each ball quickly, keep the scoreboard readable,
              and make the final score easy to trust.
            </Typography>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography component="h2" sx={{ ...sectionHeadingSx, mb: 1 }}>
              Worked scoring examples
            </Typography>
            {workedExamples.map((example) => (
              <Box key={example.title} sx={{ mb: 1.6 }}>
                <Typography component="h3" sx={{ ...sectionHeadingSx, mb: 0.5 }}>
                  {example.title}
                </Typography>
                <Typography sx={sectionBodySx}>{example.body}</Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography component="h2" sx={{ ...sectionHeadingSx, mb: 1 }}>
              Scorecard quality checks
            </Typography>
            <Box component="ul" sx={{ pl: 2.4, m: 0, color: "var(--app-accent-text, #185a9d)", lineHeight: 1.8 }}>
              {qualityChecks.map((check) => (
                <li key={check}>{check}</li>
              ))}
            </Box>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            <Typography component="h2" sx={{ ...sectionHeadingSx, mb: 1 }}>
              Quick answers before you start scoring
            </Typography>
            {quickAnswers.map((qa) => (
              <Box key={qa.question} sx={{ mb: 1.2 }}>
                <Typography sx={{ ...sectionBodySx, fontWeight: 800 }}>
                  {qa.question}
                </Typography>
                <Typography sx={sectionBodySx}>{qa.answer}</Typography>
              </Box>
            ))}
            <Typography sx={sectionBodySx}>
              See the <GuideLink to="/faq">full FAQ</GuideLink> for setup,
              sharing, and match history questions.
            </Typography>

            <Divider sx={{ my: 3, background: "var(--app-accent-start, #43cea2)" }} />

            <RelatedGuideLinks
              links={[
                {
                  title: "← Cricket Rules Guide",
                  path: "/cricket-rules-guide",
                  description: "Brush up on the rules behind every scoring decision.",
                },
                {
                  title: "Cricket Match Formats",
                  path: "/cricket-match-formats",
                  description: "See how overs and bowler limits change what you're scoring.",
                },
                {
                  title: "Cricket Statistics Guide",
                  path: "/cricket-statistics-guide",
                  description: "Understand run rate, strike rate, and economy rate in depth.",
                },
                {
                  title: "Scorekeeping Tips →",
                  path: "/scorekeeping-tips",
                  description: "Practical habits that keep your scorecard accurate all match long.",
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

export default CricketScoringGuide;
