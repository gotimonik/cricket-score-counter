import React from "react";
import { Helmet } from "react-helmet";
import { APP_NAME, APP_URL } from "../utils/constant";

interface MetaHelmetProps {
  pageTitle?: string;
  description?: string;
  canonical?: string;
  image?: string;
  url?: string;
}

const DEFAULT_IMAGE = `${APP_URL}/logo192.png`;

const MetaHelmet: React.FC<MetaHelmetProps> = ({
  pageTitle = "Home",
  description = `Welcome to ${APP_NAME}. Start or join a live cricket match and track scores easily.`,
  canonical = "/",
  image = DEFAULT_IMAGE,
  url,
}) => {
  const pageUrl = url || `${APP_URL}${canonical}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: APP_NAME,
    url: APP_URL,
    description,
    image,
  };
  return (
    <Helmet>
      <title>
        {APP_NAME} | {pageTitle}
      </title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow" />
      <link rel="canonical" href={pageUrl} />
      {/* Open Graph */}
      <meta property="og:title" content={`${APP_NAME} | ${pageTitle}`} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
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
        "logo": `${APP_URL}/cricket.png`,
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
