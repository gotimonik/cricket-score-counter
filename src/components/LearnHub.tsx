import React from "react";
import { Box, Chip, InputAdornment, TextField, Typography } from "@mui/material";
import { SearchRounded } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import MetaHelmet from "./MetaHelmet";
import ContentPageShell, {
  contentHeading,
  contentSubheading,
  contentText,
} from "./ContentPageShell";
import {
  ARTICLE_CATEGORIES,
  ARTICLES,
  articlePath,
  getReadingMinutes,
} from "../content/articles";
import { Article } from "../content/articleTypes";

const cardSx = {
  display: "block",
  height: "100%",
  p: 1.75,
  borderRadius: 3,
  textDecoration: "none",
  background: "rgba(255,255,255,0.85)",
  border: "1.5px solid rgba(67,206,162,0.35)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 10px 22px rgba(8,26,56,0.12)",
  },
} as const;

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => (
  <Box component="li" sx={{ listStyle: "none" }}>
    <Box component={RouterLink} to={articlePath(article.slug)} sx={cardSx}>
      <Typography
        component="h3"
        sx={{ ...contentSubheading, color: "#185a9d", mb: 0.5 }}
      >
        {article.title}
      </Typography>
      <Typography
        sx={{
          ...contentText,
          fontSize: "calc(14px * var(--app-font-scale, 1))",
          lineHeight: 1.6,
          mb: 1,
        }}
      >
        {article.metaDescription}
      </Typography>
      <Typography
        sx={{
          fontSize: "calc(12px * var(--app-font-scale, 1))",
          color: "#3b6f8f",
          fontWeight: 700,
        }}
      >
        {getReadingMinutes(article)} min read
      </Typography>
    </Box>
  </Box>
);

const LearnHub: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const matches = (article: Article) =>
    !normalizedQuery ||
    `${article.title} ${article.metaDescription} ${article.keywords}`
      .toLowerCase()
      .includes(normalizedQuery);

  const visibleCount = ARTICLES.filter(matches).length;

  return (
    <>
      <MetaHelmet
        pageTitle="Learn Cricket — Scoring, Rules, Strategy & Local Cricket Guides"
        canonical="/learn"
        description={`${ARTICLES.length} free, in-depth cricket guides: how to score wides and no-balls, LBW and other laws, net run rate, box and tennis-ball cricket rules, and tips for players.`}
        keywords="learn cricket, cricket guides, cricket scoring guide, cricket laws explained, local cricket rules, cricket strategy, cricket tips for beginners"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Learn Cricket", path: "/learn" },
        ]}
      />
      <ContentPageShell
        maxWidth={1040}
        title="Learn Cricket"
        intro={`${ARTICLES.length} practical guides written for people who score, play and organise local cricket.`}
      >
        <Typography sx={{ ...contentText, mb: 1.5 }}>
          Most cricket arguments on a Sunday morning come down to the same
          handful of questions. Was that a wide or a leg bye? Who faces after
          the run out? Does a bowled-out team count all its overs in net run
          rate? How do you set a fair target when rain cuts the match to ten
          overs? This library answers those questions in plain English, with
          worked examples and real numbers rather than vague definitions.
        </Typography>
        <Typography sx={{ ...contentText, mb: 2.5 }}>
          Every guide follows the MCC Laws of Cricket and points out where
          competitions and local matches commonly do things differently. Start
          with the scoring guides if you keep the book for your team, the
          local cricket guides if you organise matches, or the laws section if
          you umpire. Use the search box to jump straight to a topic.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mb: 2.5,
          }}
        >
          {ARTICLE_CATEGORIES.map((category) => (
            <Chip
              key={category.name}
              component="a"
              href={`#${category.name.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              clickable
              label={category.name}
              sx={{
                fontWeight: 700,
                background: "rgba(67,206,162,0.18)",
                color: "#0f3f66",
              }}
            />
          ))}
          <Chip
            component={RouterLink}
            to="/cricket-glossary"
            clickable
            label="Glossary A–Z"
            sx={{ fontWeight: 700, background: "rgba(24,90,157,0.12)", color: "#0f3f66" }}
          />
          <Chip
            component={RouterLink}
            to="/cricket-calculators"
            clickable
            label="Calculators"
            sx={{ fontWeight: 700, background: "rgba(24,90,157,0.12)", color: "#0f3f66" }}
          />
        </Box>

        <TextField
          fullWidth
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search guides, e.g. wide, LBW, net run rate"
          inputProps={{ "aria-label": "Search cricket guides" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 999,
              background: "#fff",
            },
          }}
        />

        {normalizedQuery && visibleCount === 0 ? (
          <Typography sx={{ ...contentText, mb: 3 }}>
            No guides match “{query}”. Try a shorter word, or browse the{" "}
            <RouterLink to="/cricket-glossary">cricket glossary</RouterLink>.
          </Typography>
        ) : null}

        {ARTICLE_CATEGORIES.map((category) => {
          const categoryArticles = ARTICLES.filter(
            (article) => article.category === category.name && matches(article),
          );
          if (categoryArticles.length === 0) return null;
          return (
            <Box component="section" key={category.name} sx={{ mb: 4 }}>
              <Typography
                component="h2"
                id={category.name.toLowerCase().replace(/[^a-z]+/g, "-")}
                sx={contentHeading}
              >
                {category.name}
              </Typography>
              <Typography sx={{ ...contentText, mb: 1.5 }}>
                {category.description}
              </Typography>
              <Box
                component="ul"
                sx={{
                  p: 0,
                  m: 0,
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                {categoryArticles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </Box>
            </Box>
          );
        })}

        <Box
          component="section"
          sx={{
            mt: 2,
            p: { xs: 2, sm: 2.5 },
            borderRadius: 3,
            background: "rgba(24,90,157,0.06)",
          }}
        >
          <Typography component="h2" sx={contentHeading}>
            More cricket references
          </Typography>
          <Box component="ul" sx={{ ...contentText, pl: 3, m: 0 }}>
            <li>
              <RouterLink to="/cricket-rules-guide">Cricket rules guide</RouterLink>{" "}
              — the basics of batting, bowling, extras and dismissals on one page.
            </li>
            <li>
              <RouterLink to="/cricket-scoring-guide">Cricket scoring guide</RouterLink>{" "}
              — a full walkthrough of scoring a limited-overs match.
            </li>
            <li>
              <RouterLink to="/cricket-statistics-guide">Cricket statistics explained</RouterLink>{" "}
              — averages, strike rates, economy and run rates with formulas.
            </li>
            <li>
              <RouterLink to="/cricket-match-formats">Cricket match formats</RouterLink>{" "}
              — T20, ODI, Test, box, tennis-ball and gully formats compared.
            </li>
            <li>
              <RouterLink to="/cricket-glossary">Cricket glossary</RouterLink> —
              150+ cricket terms defined in plain English.
            </li>
            <li>
              <RouterLink to="/cricket-calculators">Cricket calculators</RouterLink>{" "}
              — run rate, net run rate, strike rate, economy and rain targets.
            </li>
          </Box>
        </Box>
      </ContentPageShell>
    </>
  );
};

export default LearnHub;
