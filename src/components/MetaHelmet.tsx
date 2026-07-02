import React from "react";
import { Helmet } from "react-helmet";
import { APP_NAME, APP_URL } from "../utils/constant";

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface ArticleMeta {
  headline?: string;
  description?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
}

interface MetaHelmetProps {
  pageTitle?: string;
  description?: string;
  canonical?: string;
  image?: string;
  url?: string;
  keywords?: string;
  ogType?: "website" | "article";
  robots?: "index,follow" | "noindex,follow" | "noindex,nofollow";
  breadcrumbs?: BreadcrumbItem[];
  article?: ArticleMeta;
}

const DEFAULT_IMAGE = `${APP_URL}/logo.png`;

const MetaHelmet: React.FC<MetaHelmetProps> = ({
  pageTitle = "Home",
  description = `Welcome to ${APP_NAME}. Start or join a live cricket match and track scores easily.`,
  canonical = "/",
  image = DEFAULT_IMAGE,
  url,
  keywords,
  ogType = "website",
  robots = "index,follow",
  breadcrumbs,
  article,
}) => {
  const normalizedCanonicalInput = canonical.startsWith("/") ? canonical : `/${canonical}`;
  const canonicalWithoutQuery = normalizedCanonicalInput.split("?")[0].split("#")[0] || "/";
  const normalizedCanonical =
    canonicalWithoutQuery === "/"
      ? "/"
      : canonicalWithoutQuery.replace(/\/+$/, "");
  const canonicalPath = normalizedCanonical;
  const pageUrl = url || `${APP_URL}${canonicalPath}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: APP_NAME,
    url: pageUrl,
    description,
    image,
    applicationCategory: "SportsApplication",
    operatingSystem: "Web",
  };
  const breadcrumbStructuredData = breadcrumbs && breadcrumbs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: crumb.name,
          item: crumb.path.startsWith("http")
            ? crumb.path
            : `${APP_URL}${crumb.path.startsWith("/") ? crumb.path : `/${crumb.path}`}`,
        })),
      }
    : null;
  const articleStructuredData = article
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.headline || pageTitle,
        description: article.description || description,
        image,
        author: {
          "@type": "Organization",
          name: article.authorName || APP_NAME,
        },
        publisher: {
          "@type": "Organization",
          name: APP_NAME,
          logo: {
            "@type": "ImageObject",
            url: `${APP_URL}/logo.png`,
          },
        },
        datePublished: article.datePublished,
        dateModified: article.dateModified || article.datePublished,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": pageUrl,
        },
      }
    : null;
  return (
    <Helmet>
      <title>
        {APP_NAME} | {pageTitle}
      </title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <link rel="canonical" href={pageUrl} />
      {/* Open Graph */}
      <meta property="og:title" content={`${APP_NAME} | ${pageTitle}`} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={APP_NAME} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={`${APP_NAME} preview`} />
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${APP_NAME} | ${pageTitle}`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={`${APP_NAME} preview`} />
      {/* Structured Data: WebSite */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      {/* Structured Data: Organization */}
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": APP_NAME,
        "url": APP_URL,
        "logo": `${APP_URL}/logo.png`,
        "contactPoint": [{
          "@type": "ContactPoint",
          "email": "gotimonik1@gmail.com",
          "telephone": "+91-8128313138",
          "contactType": "customer support"
        }]
      })}</script>
      {/* Structured Data: Article */}
      {articleStructuredData ? (
        <script type="application/ld+json">{JSON.stringify(articleStructuredData)}</script>
      ) : null}
      {/* Structured Data: BreadcrumbList */}
      {breadcrumbStructuredData ? (
        <script type="application/ld+json">{JSON.stringify(breadcrumbStructuredData)}</script>
      ) : null}
    </Helmet>
  );
};

export default MetaHelmet;
