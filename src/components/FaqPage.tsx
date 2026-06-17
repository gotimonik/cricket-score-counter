import React from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import PageTitleWithBack from "./PageTitleWithBack";

const faqs = [
  {
    question: "What is Cricket Score Counter?",
    answer:
      "Cricket Score Counter is a free web app for scoring local cricket matches ball by ball. It tracks runs, wickets, overs, extras, run rate, and live sharing links.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No. You can create a match and begin scoring without an account. This keeps match setup quick for casual games and volunteer scorers.",
  },
  {
    question: "Can viewers follow the score live?",
    answer:
      "Yes. After creating a match, share the live match link so other people can follow the score from their own device.",
  },
  {
    question: "How are wides and no-balls handled?",
    answer:
      "Wides and no-balls add extra runs to the team total and do not count as legal deliveries. The over continues until six legal balls are recorded.",
  },
  {
    question: "Can I fix a scoring mistake?",
    answer:
      "Use the undo or recent events tools as soon as you notice a mistake. Early corrections keep batter, bowler, and team totals consistent.",
  },
  {
    question: "Is this for official tournaments?",
    answer:
      "The app is best for local, school, club, practice, and friendly matches. For official tournaments, always follow the tournament scorer's rules and recordkeeping requirements.",
  },
  {
    question: "Why is match history useful?",
    answer:
      "Match history helps teams review completed games, batting summaries, bowling figures, and key scoring moments after the match ends.",
  },
  {
    question: "What should I check before starting a match?",
    answer:
      "Confirm team names, innings length, batting side, opening batters, and first bowler. A one-minute setup check avoids most scoring corrections later in the innings.",
  },
  {
    question: "How should I score a wide with extra runs?",
    answer:
      "Record it as a wide and include any additional runs completed or conceded on the same delivery. The delivery remains illegal, so it does not count toward the six legal balls in the over.",
  },
  {
    question: "Can I use it for short tennis-ball or box cricket matches?",
    answer:
      "Yes. The app is designed for flexible local formats, including short-over matches, practice games, school cricket, box cricket, and tennis-ball cricket. If your match has special local rules, agree on them before scoring.",
  },
  {
    question: "What happens if the network is weak at the ground?",
    answer:
      "Keep scoring on the scorer device and avoid unnecessary page switches during an over. Viewers may need to refresh when their connection returns, but the scorer should continue entering events carefully.",
  },
  {
    question: "How do I keep bowling figures accurate?",
    answer:
      "Select the correct bowler at the start of each over and check the over summary after wides, no-balls, or wickets. Bowling figures depend on both legal balls and extras being recorded correctly.",
  },
  {
    question: "Why does strike rotation matter?",
    answer:
      "Strike rotation decides which batter faces the next ball. Odd-numbered completed runs usually change the striker, and the striker also changes at the end of an over, so it is worth checking after singles, threes, and overthrows.",
  },
  {
    question: "Is the Android app different from the website?",
    answer:
      "The Android app is built for a smoother mobile match-day experience, while the website remains useful for quick access from any browser. Both focus on fast scoring, readable totals, and live sharing.",
  },
];

const FaqPage: React.FC = () => {
  const location = useLocation();
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <MetaHelmet
        pageTitle="Cricket Score Counter FAQ"
        canonical={location.pathname}
        description="Answers to common Cricket Score Counter questions about live scoring, match setup, wides, no-balls, score corrections, and match history."
        keywords="cricket score counter faq, cricket scoring questions, live cricket score help, cricket score app faq"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqStructuredData)}</script>
      </Helmet>
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
        <Box sx={{ width: "100%", maxWidth: 960, px: { xs: 1.5, sm: 2.5 }, mt: 2 }}>
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
              Frequently Asked Questions
            </PageTitleWithBack>
            <Typography
              sx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 600,
                fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(16px * var(--app-font-scale, 1))" },
                mb: 2,
              }}
            >
              Clear answers for scorers, viewers, teams, and organizers using Cricket Score Counter during real matches.
            </Typography>

            <Divider sx={{ my: 2, background: "var(--app-accent-start, #43cea2)" }} />

            {faqs.map((faq) => (
              <Box key={faq.question} sx={{ mb: 2.2 }}>
                <Typography sx={{ fontWeight: 800, color: "var(--app-accent-text, #185a9d)", mb: 0.75 }}>
                  {faq.question}
                </Typography>
                <Typography sx={{ color: "var(--app-accent-text, #185a9d)", lineHeight: 1.7 }}>
                  {faq.answer}
                </Typography>
              </Box>
            ))}
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default FaqPage;
