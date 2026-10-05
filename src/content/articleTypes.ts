export type ArticleCategory =
  | "Scoring"
  | "Local Cricket"
  | "Strategy & Skills"
  | "Laws Explained";

export interface ArticleTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface ArticleSection {
  /** Section heading rendered as an h2. */
  heading: string;
  /** One or more plain-text paragraphs. */
  paragraphs: string[];
  /** Optional bullet list shown after the paragraphs. */
  bullets?: string[];
  /** Optional numbered steps shown after the paragraphs. */
  steps?: string[];
  /** Optional data table. */
  table?: ArticleTable;
  /** Optional highlighted tip / worked example box. */
  callout?: { title: string; text: string };
}

export interface ArticleFaq {
  question: string;
  answer: string;
}

export interface Article {
  slug: string; // kebab-case, used at /learn/:slug
  title: string; // h1, 40-70 chars
  metaDescription: string; // 130-160 chars
  keywords: string;
  category: ArticleCategory;
  datePublished: string; // YYYY-MM-DD
  /** 2-3 sentence plain-language summary shown under the title. */
  summary: string;
  /** "Key takeaways" bullets (3-5). */
  keyTakeaways: string[];
  sections: ArticleSection[];
  faqs: ArticleFaq[];
  /** Slugs of other articles (from the full list) to link at the end. */
  related: string[];
}
