import React from "react";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import { SearchRounded } from "@mui/icons-material";
import { Helmet } from "react-helmet";
import { Link as RouterLink } from "react-router-dom";
import MetaHelmet from "./MetaHelmet";
import ContentPageShell, { contentHeading, contentText } from "./ContentPageShell";
import RelatedGuideLinks from "./RelatedGuideLinks";
import { GLOSSARY_TERMS } from "../content/glossary";
import { APP_URL } from "../utils/constant";

const firstLetter = (term: string): string => {
  const letter = term.trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(letter) ? letter : "#";
};

const termId = (term: string): string =>
  `term-${term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`;

const CricketGlossary: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredTerms = GLOSSARY_TERMS.filter(
    (item) =>
      !normalizedQuery ||
      item.term.toLowerCase().includes(normalizedQuery) ||
      item.definition.toLowerCase().includes(normalizedQuery),
  );

  const grouped = filteredTerms.reduce<Record<string, typeof GLOSSARY_TERMS>>(
    (acc, item) => {
      const letter = firstLetter(item.term);
      (acc[letter] = acc[letter] || []).push(item);
      return acc;
    },
    {},
  );
  const letters = Object.keys(grouped).sort();
  const allLetters = Array.from(
    new Set(GLOSSARY_TERMS.map((item) => firstLetter(item.term))),
  ).sort();

  const definedTermSet = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Cricket Glossary",
    url: `${APP_URL}/cricket-glossary`,
    hasDefinedTerm: GLOSSARY_TERMS.map((item) => ({
      "@type": "DefinedTerm",
      name: item.term,
      description: item.definition,
      url: `${APP_URL}/cricket-glossary#${termId(item.term)}`,
    })),
  };

  return (
    <>
      <MetaHelmet
        pageTitle="Cricket Glossary — 150+ Cricket Terms Explained A–Z"
        canonical="/cricket-glossary"
        description={`A plain-English cricket glossary with ${GLOSSARY_TERMS.length} terms: extras, dismissals, fielding positions, bowling and batting terms, formats and local cricket slang.`}
        keywords="cricket glossary, cricket terms, cricket terminology, cricket dictionary, what is a leg bye, cricket slang, fielding positions names"
        ogType="article"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Learn Cricket", path: "/learn" },
          { name: "Cricket Glossary", path: "/cricket-glossary" },
        ]}
        article={{ datePublished: "2026-10-02", dateModified: "2026-10-02" }}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(definedTermSet)}</script>
      </Helmet>
      <ContentPageShell
        maxWidth={960}
        title="Cricket Glossary A–Z"
        intro={`${GLOSSARY_TERMS.length} cricket terms explained in plain English, from "all out" to "yorker".`}
      >
        <Typography sx={{ ...contentText, mb: 1.5 }}>
          Cricket has more jargon than almost any other sport. Some of it comes
          straight from the Laws (leg bye, popping crease, dead ball), some
          from competition playing conditions (free hit, powerplay, super
          over), and a lot from dressing rooms and street games (jaffa, one tip
          one hand, last man batting). This glossary explains each term the way
          a scorer or new player actually needs it, and says clearly when
          something is a local custom rather than an official Law.
        </Typography>
        <Typography sx={{ ...contentText, mb: 2.5 }}>
          Tap a letter to jump, or search for a word. Where a term has a full
          guide or calculator on this site, the definition links to it.
        </Typography>

        <Box
          component="nav"
          aria-label="Glossary letters"
          sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 2 }}
        >
          {allLetters.map((letter) => (
            <Box
              key={letter}
              component="a"
              href={`#letter-${letter}`}
              sx={{
                width: 34,
                height: 34,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                fontWeight: 800,
                textDecoration: "none",
                color: "#0f3f66",
                background: grouped[letter]
                  ? "rgba(67,206,162,0.22)"
                  : "rgba(24,90,157,0.06)",
                opacity: grouped[letter] ? 1 : 0.45,
              }}
            >
              {letter}
            </Box>
          ))}
        </Box>

        <TextField
          fullWidth
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search terms, e.g. googly, bye, powerplay"
          inputProps={{ "aria-label": "Search cricket glossary" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": { borderRadius: 999, background: "#fff" },
          }}
        />

        {filteredTerms.length === 0 ? (
          <Typography sx={{ ...contentText, mb: 3 }}>
            No terms match “{query}”.
          </Typography>
        ) : null}

        {letters.map((letter) => (
          <Box component="section" key={letter} sx={{ mb: 3 }}>
            <Typography
              component="h2"
              id={`letter-${letter}`}
              sx={{ ...contentHeading, fontSize: "calc(26px * var(--app-font-scale, 1))" }}
            >
              {letter}
            </Typography>
            <Box component="dl" sx={{ m: 0 }}>
              {grouped[letter].map((item) => (
                <Box
                  key={item.term}
                  id={termId(item.term)}
                  sx={{
                    py: 1.25,
                    borderBottom: "1px solid rgba(24,90,157,0.12)",
                    scrollMarginTop: "90px",
                  }}
                >
                  <Typography
                    component="dt"
                    sx={{
                      fontWeight: 800,
                      color: "#0f3f66",
                      fontSize: "calc(16px * var(--app-font-scale, 1))",
                    }}
                  >
                    {item.term}
                  </Typography>
                  <Typography component="dd" sx={{ ...contentText, m: 0 }}>
                    {item.definition}
                    {item.link ? (
                      <>
                        {" "}
                        <RouterLink to={item.link} style={{ color: "#185a9d", fontWeight: 700 }}>
                          Read more
                        </RouterLink>
                      </>
                    ) : null}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}

        <RelatedGuideLinks
          links={[
            {
              title: "Learn Cricket",
              path: "/learn",
              description: "All our in-depth guides on scoring, laws, strategy and local cricket.",
            },
            {
              title: "Umpire Signals Explained",
              path: "/learn/umpire-signals-explained",
              description: "Every signal a scorer needs to recognise and acknowledge.",
            },
            {
              title: "Cricket Calculators",
              path: "/cricket-calculators",
              description: "Work out run rate, net run rate, strike rate and economy instantly.",
            },
          ]}
        />
      </ContentPageShell>
    </>
  );
};

export default CricketGlossary;
