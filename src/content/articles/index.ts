import { Article, ArticleCategory } from "../articleTypes";
import { scoringArticles } from "./scoring";
import { localCricketArticles } from "./localCricket";
import { strategyArticles } from "./strategy";
import { lawsArticles } from "./laws";

export const ARTICLE_CATEGORIES: {
  name: ArticleCategory;
  description: string;
}[] = [
  {
    name: "Scoring",
    description:
      "Ball-by-ball scoring explained: wides, no-balls, byes, run outs, overthrows, strike rotation and reading a scorecard.",
  },
  {
    name: "Local Cricket",
    description:
      "Organising friendly, gully, box and tennis-ball matches: rules to agree, fair teams, the toss and the right equipment.",
  },
  {
    name: "Strategy & Skills",
    description:
      "Net run rate, chasing, rain-shortened targets, powerplays, death bowling and beginner batting and bowling tips.",
  },
  {
    name: "Laws Explained",
    description:
      "The Laws in plain English: LBW, dismissals, fielding positions, umpire signals, DLS, dead balls and tied matches.",
  },
];

export const ARTICLES: Article[] = [
  ...scoringArticles,
  ...localCricketArticles,
  ...strategyArticles,
  ...lawsArticles,
];

const articleBySlug = new Map(ARTICLES.map((article) => [article.slug, article]));

export const getArticleBySlug = (slug?: string): Article | undefined =>
  slug ? articleBySlug.get(slug) : undefined;

export const getArticlesByCategory = (category: ArticleCategory): Article[] =>
  ARTICLES.filter((article) => article.category === category);

export const articlePath = (slug: string): string => `/learn/${slug}`;

const countWords = (text: string): number =>
  text.trim().split(/\s+/).filter(Boolean).length;

/** Rough reading time at ~220 words per minute. */
export const getReadingMinutes = (article: Article): number => {
  let words = countWords(article.summary);
  article.sections.forEach((section) => {
    section.paragraphs.forEach((p) => {
      words += countWords(p);
    });
    (section.bullets || []).forEach((b) => {
      words += countWords(b);
    });
    (section.steps || []).forEach((s) => {
      words += countWords(s);
    });
    if (section.callout) words += countWords(section.callout.text);
  });
  article.faqs.forEach((faq) => {
    words += countWords(faq.question) + countWords(faq.answer);
  });
  return Math.max(3, Math.round(words / 220));
};

export const formatArticleDate = (isoDate: string): string => {
  const [year, month, day] = isoDate.split("-").map(Number);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${day} ${months[(month || 1) - 1]} ${year}`;
};
