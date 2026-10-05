import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { useTranslation } from "react-i18next";

const footerGroups: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Play",
    links: [
      { href: "/create-game", label: "Start a Match" },
      { href: "/join-game", label: "Join a Match" },
      { href: "/tournaments", label: "Tournaments" },
      { href: "/download-app", label: "Download App" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/learn", label: "Learn Cricket" },
      { href: "/cricket-rules-guide", label: "Cricket Rules" },
      { href: "/cricket-scoring-guide", label: "Scoring Guide" },
      { href: "/cricket-glossary", label: "Cricket Glossary" },
      { href: "/cricket-calculators", label: "Cricket Calculators" },
      { href: "/cricket-resources", label: "All Resources" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/how-it-works", label: "How It Works" },
      { href: "/faq", label: "FAQ" },
      { href: "/support", label: "Support" },
      { href: "/contact", label: "Contact" },
      { href: "/about", label: "About" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms" },
      { href: "/disclaimer", label: "Disclaimer" },
      { href: "/site-map", label: "Site Map" },
    ],
  },
];

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const isNativeWebView = React.useMemo(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return false;
    }
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera || "";
    return (
      /wv|WebView|; wv\)|capacitor/i.test(ua) ||
      "ReactNativeWebView" in window ||
      "cordova" in window ||
      window.location.protocol === "capacitor:" ||
      ((window as any).Capacitor?.isNativePlatform?.() ?? false)
    );
  }, []);

  return (
    <Box
      component="footer"
      className="app-footer"
      sx={{
        width: "100%",
        textAlign: "center",
        mt: "auto",
        pt: 2,
        pb: 12,
        minHeight: { xs: 120, sm: 104 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background:
          "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
        borderTop:
          "2px solid color-mix(in srgb, var(--app-accent-start, #43cea2) 22%, #e0eafc 78%)",
        position: "static",
        boxShadow:
          "0 -2px 10px color-mix(in srgb, var(--app-accent-end, #185a9d) 18%, transparent 82%)",
        fontFamily: 'Roboto, Segoe UI, Helvetica Neue, Arial, sans-serif',
        color: '#fff',
        fontWeight: 400,
        letterSpacing: 0.5,
      }}
    >
      <Box
        component="nav"
        aria-label={t("Footer")}
        sx={{
          width: "100%",
          maxWidth: 1000,
          mx: "auto",
          px: 2,
          py: 1,
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
          gap: { xs: 2, sm: 3 },
          textAlign: "left",
        }}
      >
        {footerGroups
          .map((group) => ({
            ...group,
            links: group.links.filter(
              (link) => !(isNativeWebView && link.href === "/download-app"),
            ),
          }))
          .map((group) => (
            <Box key={group.title}>
              <Typography
                component="h2"
                sx={{
                  fontFamily: "inherit",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 14,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  mb: 0.75,
                }}
              >
                {t(group.title)}
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                {group.links.map((link) => (
                  <Box component="li" key={link.href} sx={{ mb: 0.5 }}>
                    <Link
                      href={link.href}
                      underline="hover"
                      sx={{
                        color: "#fff",
                        fontWeight: 500,
                        fontSize: 14,
                        opacity: 0.95,
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      {t(link.label)}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
      </Box>
      <Typography variant="body2" sx={{ mt: 1.5, fontFamily: 'inherit', color: '#fff', fontWeight: 500 }}>
        © {new Date().getFullYear()} {t("Cricket Score Counter. All rights reserved.")}
      </Typography>
      <Typography variant="caption" sx={{ mt: 1, display: 'block', fontFamily: 'inherit', color: '#fff', fontWeight: 300 }}>
        {t("This site uses cookies and may serve ads by Google AdSense. By using this site, you agree to our policies.")}
      </Typography>
    </Box>
  );
};

export default Footer;
