import React from "react";
import { Helmet } from "react-helmet";
import { APP_NAME, APP_URL } from "../utils/constant";

interface MetaHelmetProps {
  pageTitle?: string;
  description?: string;
  canonical?: string;
  image?: string;
  url?: string;
  keywords?: string;
  ogType?: "website" | "article";
  robots?: "index,follow" | "noindex,follow" | "noindex,nofollow";
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
}) => {
  const normalizedCanonicalInput = canonical.startsWith("/") ? canonical : `/${canonical}`;
  const canonicalWithoutQuery = normalizedCanonicalInput.split("?")[0].split("#")[0] || "/";
  const normalizedCanonical =
    canonicalWithoutQuery === "/"
      ? "/"
      : canonicalWithoutQuery.replace(/\/+$/, "");
  const isV1Path =
    typeof window !== "undefined" &&
    (window.location.pathname === "/v1" || window.location.pathname.startsWith("/v1/"));
  const canonicalPath =
    normalizedCanonical.startsWith("/v1")
      ? normalizedCanonical.replace(/^\/v1/, "") || "/"
      : normalizedCanonical;
  const effectiveRobots =
    isV1Path && robots === "index,follow" ? "noindex,follow" : robots;
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
  return (
    <Helmet>
      <title>
        {APP_NAME} | {pageTitle}
      </title>
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <meta name="robots" content={effectiveRobots} />
      <link rel="canonical" href={pageUrl} />
      {/* Open Graph */}
      <meta property="og:title" content={`${APP_NAME} | ${pageTitle}`} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={APP_NAME} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={image} />
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${APP_NAME} | ${pageTitle}`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
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
          "email": "support@cricketscorecounter.com",
          "contactType": "customer support"
        }]
      })}</script>
    </Helmet>
  );
};

export default MetaHelmet;
