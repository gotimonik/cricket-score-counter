import React from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet";
import { Link as RouterLink, useParams } from "react-router-dom";
import MetaHelmet from "./MetaHelmet";
import ContentPageShell, {
  contentHeading,
  contentSubheading,
  contentText,
} from "./ContentPageShell";
import RelatedGuideLinks from "./RelatedGuideLinks";
import NotFound from "./NotFound";
import {
  articlePath,
  formatArticleDate,
  getArticleBySlug,
  getArticlesByCategory,
  getReadingMinutes,
} from "../content/articles";
import { ArticleSection, ArticleTable } from "../content/articleTypes";

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const ArticleTableView: React.FC<{ table: ArticleTable }> = ({ table }) => (
  <TableContainer
    sx={{
      my: 2,
      borderRadius: 2.5,
      border: "1px solid rgba(24,90,157,0.18)",
      background: "rgba(255,255,255,0.85)",
      overflowX: "auto",
    }}
  >
    <Table size="small" aria-label={table.caption || "Table"}>
      {table.caption ? (
        <caption
          style={{
            captionSide: "top",
            textAlign: "left",
            padding: "10px 14px 4px",
            color: "#185a9d",
            fontWeight: 700,
          }}
        >
          {table.caption}
        </caption>
      ) : null}
      <TableHead>
        <TableRow>
          {table.headers.map((header) => (
            <TableCell
              key={header}
              sx={{
                fontWeight: 800,
                color: "#0f3f66",
                background: "rgba(67,206,162,0.16)",
                whiteSpace: "nowrap",
              }}
            >
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {table.rows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <TableCell
                key={cellIndex}
                sx={{
                  color: "#1b3a57",
                  verticalAlign: "top",
                  minWidth: cellIndex === 0 ? 110 : 90,
                }}
              >
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const SectionView: React.FC<{ section: ArticleSection; id: string }> = ({
  section,
  id,
}) => (
  <Box component="section" sx={{ mb: 3.5 }}>
    <Typography component="h2" id={id} sx={contentHeading}>
      {section.heading}
    </Typography>
    {section.paragraphs.map((paragraph, index) => (
      <Typography key={index} sx={{ ...contentText, mb: 1.5 }}>
        {paragraph}
      </Typography>
    ))}
    {section.bullets && section.bullets.length > 0 ? (
      <Box component="ul" sx={{ ...contentText, pl: 3, my: 1.5 }}>
        {section.bullets.map((bullet, index) => (
          <li key={index} style={{ marginBottom: 6 }}>
            {bullet}
          </li>
        ))}
      </Box>
    ) : null}
    {section.steps && section.steps.length > 0 ? (
      <Box component="ol" sx={{ ...contentText, pl: 3, my: 1.5 }}>
        {section.steps.map((step, index) => (
          <li key={index} style={{ marginBottom: 6 }}>
            {step}
          </li>
        ))}
      </Box>
    ) : null}
    {section.table ? <ArticleTableView table={section.table} /> : null}
    {section.callout ? (
      <Box
        component="aside"
        sx={{
          my: 2,
          p: { xs: 1.75, sm: 2.25 },
          borderRadius: 3,
          borderLeft: "5px solid var(--app-accent-start, #43cea2)",
          background: "rgba(67,206,162,0.12)",
        }}
      >
        <Typography sx={{ ...contentSubheading, mb: 0.5 }}>
          {section.callout.title}
        </Typography>
        <Typography sx={{ ...contentText }}>{section.callout.text}</Typography>
      </Box>
    ) : null}
  </Box>
);

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticleBySlug(slug);

  if (!article) {
    return <NotFound />;
  }

  const path = articlePath(article.slug);
  const readingMinutes = getReadingMinutes(article);
  const sectionIds = article.sections.map(
    (section, index) => `${slugify(section.heading) || "section"}-${index + 1}`,
  );

  // Fill "related" from the article's own list first, then top up with
  // other articles in the same category so every page links onward.
  const relatedSlugs = new Set(article.related);
  const relatedArticles = [
    ...article.related
      .map((relatedSlug) => getArticleBySlug(relatedSlug))
      .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    ...getArticlesByCategory(article.category).filter(
      (item) => item.slug !== article.slug && !relatedSlugs.has(item.slug),
    ),
  ].slice(0, 6);

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <MetaHelmet
        pageTitle={article.title}
        canonical={path}
        description={article.metaDescription}
        keywords={article.keywords}
        ogType="article"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Learn Cricket", path: "/learn" },
          { name: article.title, path },
        ]}
        article={{
          headline: article.title,
          description: article.metaDescription,
          datePublished: article.datePublished,
          dateModified: article.datePublished,
          authorName: "Cricket Score Counter Editorial Team",
        }}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqStructuredData)}
        </script>
      </Helmet>
      <ContentPageShell
        title={article.title}
        eyebrow={
          <Box
            component="nav"
            aria-label="Breadcrumb"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 0.75,
              fontSize: "calc(13px * var(--app-font-scale, 1))",
              color: "var(--app-accent-text, #185a9d)",
            }}
          >
            <RouterLink to="/" style={{ color: "inherit" }}>
              Home
            </RouterLink>
            <span aria-hidden="true">/</span>
            <RouterLink to="/learn" style={{ color: "inherit" }}>
              Learn Cricket
            </RouterLink>
            <span aria-hidden="true">/</span>
            <Chip
              size="small"
              label={article.category}
              sx={{
                fontWeight: 700,
                background: "rgba(67,206,162,0.2)",
                color: "#0f3f66",
              }}
            />
          </Box>
        }
      >
        <Typography
          sx={{
            ...contentText,
            fontSize: "calc(13px * var(--app-font-scale, 1))",
            opacity: 0.85,
            mb: 2,
          }}
        >
          By the Cricket Score Counter Editorial Team · Updated{" "}
          <time dateTime={article.datePublished}>
            {formatArticleDate(article.datePublished)}
          </time>{" "}
          · {readingMinutes} min read
        </Typography>

        <Typography sx={{ ...contentText, fontWeight: 600, mb: 2.5 }}>
          {article.summary}
        </Typography>

        <Box
          sx={{
            p: { xs: 1.75, sm: 2.25 },
            mb: 3,
            borderRadius: 3,
            background: "rgba(255,255,255,0.8)",
            border: "1.5px solid rgba(67,206,162,0.45)",
          }}
        >
          <Typography component="h2" sx={{ ...contentSubheading }}>
            Key takeaways
          </Typography>
          <Box component="ul" sx={{ ...contentText, pl: 3, m: 0 }}>
            {article.keyTakeaways.map((item, index) => (
              <li key={index} style={{ marginBottom: 4 }}>
                {item}
              </li>
            ))}
          </Box>
        </Box>

        <Box
          component="nav"
          aria-label="On this page"
          sx={{
            p: { xs: 1.75, sm: 2.25 },
            mb: 3,
            borderRadius: 3,
            background: "rgba(24,90,157,0.06)",
          }}
        >
          <Typography sx={{ ...contentSubheading }}>On this page</Typography>
          <Box component="ol" sx={{ ...contentText, pl: 3, m: 0 }}>
            {article.sections.map((section, index) => (
              <li key={sectionIds[index]}>
                <a href={`#${sectionIds[index]}`} style={{ color: "#185a9d" }}>
                  {section.heading}
                </a>
              </li>
            ))}
            <li>
              <a href="#faq" style={{ color: "#185a9d" }}>
                Frequently asked questions
              </a>
            </li>
          </Box>
        </Box>

        {article.sections.map((section, index) => (
          <SectionView
            key={sectionIds[index]}
            section={section}
            id={sectionIds[index]}
          />
        ))}

        <Box
          sx={{
            my: 3,
            p: { xs: 2, sm: 2.5 },
            borderRadius: 3,
            background:
              "linear-gradient(135deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
            color: "#fff",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 800, fontSize: "calc(18px * var(--app-font-scale, 1))" }}>
              Put it into practice
            </Typography>
            <Typography sx={{ opacity: 0.95, lineHeight: 1.6 }}>
              Score your next match ball by ball for free and share a live
              scorecard link with everyone watching. No sign-up needed.
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/create-game"
            variant="contained"
            sx={{
              background: "#fff",
              color: "#185a9d",
              fontWeight: 800,
              borderRadius: 999,
              px: 3,
              "&:hover": { background: "#f0f7ff" },
            }}
          >
            Start scoring
          </Button>
        </Box>

        <Box component="section" sx={{ mb: 3 }}>
          <Typography component="h2" id="faq" sx={contentHeading}>
            Frequently asked questions
          </Typography>
          {article.faqs.map((faq, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography component="h3" sx={contentSubheading}>
                {faq.question}
              </Typography>
              <Typography sx={contentText}>{faq.answer}</Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 3, background: "var(--app-accent-start, #43cea2)" }} />

        <RelatedGuideLinks
          heading="Keep reading"
          links={relatedArticles.map((item) => ({
            title: item.title,
            path: articlePath(item.slug),
            description: item.summary.split(". ")[0].replace(/\.$/, "") + ".",
          }))}
        />

        <Typography
          sx={{
            ...contentText,
            mt: 3,
            fontSize: "calc(13px * var(--app-font-scale, 1))",
            fontStyle: "italic",
            opacity: 0.85,
          }}
        >
          This guide follows the MCC Laws of Cricket and common competition
          playing conditions. Local leagues and friendly matches often use
          their own rules, so always agree them before the toss. Spotted
          something we should correct? <RouterLink to="/contact">Contact us</RouterLink>.
        </Typography>
      </ContentPageShell>
    </>
  );
};

export default ArticlePage;
