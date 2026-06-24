import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { useTranslation } from "react-i18next";

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
        py: 2,
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
      <Typography variant="body2" sx={{ mb: 1, fontFamily: 'inherit', color: '#fff', fontWeight: 500 }}>
        © {new Date().getFullYear()} {t("Cricket Score Counter. All rights reserved.")}
      </Typography>
      <Typography variant="body2" sx={{ fontFamily: 'inherit', color: '#fff', fontWeight: 400 }}>
        <Link component="a" href={"/cricket-resources"} underline="always" sx={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', mx: 0.5, textDecorationColor: "rgba(255,255,255,0.85)" }}>
          {t("Cricket Resources")}
        </Link>
        {" | "}
        <Link component="a" href={"/how-it-works"} underline="always" sx={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', mx: 0.5, textDecorationColor: "rgba(255,255,255,0.85)" }}>
          {t("How It Works")}
        </Link>
        {" | "}
        <Link component="a" href={"/cricket-scoring-guide"} underline="always" sx={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', mx: 0.5, textDecorationColor: "rgba(255,255,255,0.85)" }}>
          {t("Scoring Guide")}
        </Link>
        {" | "}
        <Link component="a" href={"/scorekeeping-tips"} underline="always" sx={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', mx: 0.5, textDecorationColor: "rgba(255,255,255,0.85)" }}>
          {t("Tips")}
        </Link>
        {" | "}
        <Link component="a" href={"/cricket-rules-guide"} underline="always" sx={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', mx: 0.5, textDecorationColor: "rgba(255,255,255,0.85)" }}>
          {t("Cricket Rules")}
        </Link>
        {" | "}
        <Link component="a" href={"/cricket-match-formats"} underline="always" sx={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', mx: 0.5, textDecorationColor: "rgba(255,255,255,0.85)" }}>
          {t("Cricket Formats")}
        </Link>
        {" | "}
        <Link component="a" href={"/cricket-statistics-guide"} underline="always" sx={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', mx: 0.5, textDecorationColor: "rgba(255,255,255,0.85)" }}>
          {t("Cricket Statistics")}
        </Link>
        {" | "}
        <Link component="a" href={"/faq"} underline="always" sx={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', mx: 0.5, textDecorationColor: "rgba(255,255,255,0.85)" }}>
          {t("FAQ")}
        </Link>
        {!isNativeWebView && (
          <>
            {" | "}
            <Link component="a" href={"/download-app"} underline="always" sx={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', mx: 0.5, textDecorationColor: "rgba(255,255,255,0.85)" }}>
              {t("Download App")}
            </Link>
          </>
        )}
        {" | "}
        <Link component="a" href={"/about"} underline="always" sx={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', mx: 0.5, textDecorationColor: "rgba(255,255,255,0.85)" }}>
          {t("About")}
        </Link>
        {" | "}
        <Link component="a" href={"/support"} underline="always" sx={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', mx: 0.5, textDecorationColor: "rgba(255,255,255,0.85)" }}>
          {t("Support")}
        </Link>
        {" | "}
        <Link component="a" href={"/contact"} underline="always" sx={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', mx: 0.5, textDecorationColor: "rgba(255,255,255,0.85)" }}>
          {t("Contact")}
        </Link>
        {" | "}
        <Link component="a" href={"/privacy-policy"} underline="always" sx={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', mx: 0.5, textDecorationColor: "rgba(255,255,255,0.85)" }}>
          {t("Privacy Policy")}
        </Link>
        {" | "}
        <Link component="a" href={"/terms"} underline="always" sx={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', mx: 0.5, textDecorationColor: "rgba(255,255,255,0.85)" }}>
          {t("Terms")}
        </Link>
        {" | "}
        <Link component="a" href={"/disclaimer"} underline="always" sx={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', mx: 0.5, textDecorationColor: "rgba(255,255,255,0.85)" }}>
          {t("Disclaimer")}
        </Link>
        {" | "}
        <Link component="a" href={"/site-map"} underline="always" sx={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', mx: 0.5, textDecorationColor: "rgba(255,255,255,0.85)" }}>
          {t("Sitemaps")}
        </Link>
      </Typography>
      <Typography variant="caption" sx={{ mt: 1, display: 'block', fontFamily: 'inherit', color: '#fff', fontWeight: 300 }}>
        {t("This site uses cookies and may serve ads by Google AdSense. By using this site, you agree to our policies.")}
      </Typography>
    </Box>
  );
};

export default Footer;
