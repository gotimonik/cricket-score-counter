import React from "react";
import { Box } from "@mui/material";
import AdSenseBanner from "./AdSenseBanner";

/**
 * One in-flow banner ad at the end of every content page (Learn, guides,
 * FAQ, How It Works, Support, About, calculators...), just above the footer.
 *
 * Only real content pages are listed. Utility and legal pages (privacy,
 * terms, disclaimer, contact, delete account, site map, login, admin) are
 * left out on purpose: AdSense treats ads on low-content pages as a policy
 * risk, and they earn very little. Home has its own in-content slots, and
 * scoring screens stay ad-free.
 */
const AD_ROUTES = [
  "/learn",
  "/cricket-rules-guide",
  "/cricket-scoring-guide",
  "/scorekeeping-tips",
  "/cricket-glossary",
  "/cricket-calculators",
  "/cricket-resources",
  "/cricket-match-formats",
  "/cricket-statistics-guide",
  "/cricket-tournament-guide",
  "/how-it-works",
  "/faq",
  "/support",
  "/about",
];

const isAdRoute = (pathname: string) => {
  const path = pathname.replace(/\/+$/, "") || "/";
  return AD_ROUTES.some((route) => path === route || path.startsWith(`${route}/`));
};

function PageBottomAd({ pathname }: { pathname: string }) {
  if (!isAdRoute(pathname)) return null;
  return (
    <Box sx={{ width: "100%", px: { xs: 1.5, sm: 2.5 }, pb: 3, boxSizing: "border-box" }}>
      {/* Keyed so each page view gets a fresh ad request. The route list
          already guarantees real content, so skip the text-length check
          (it can run before a lazy-loaded page has rendered its text). */}
      <AdSenseBanner key={pathname} show minContentLength={0} />
    </Box>
  );
}

export default PageBottomAd;
