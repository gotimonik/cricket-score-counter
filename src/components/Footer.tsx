import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { toCurrentVersionPath } from "../utils/routes";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  return (
    <Box
      component="footer"
      className="app-footer"
      sx={{
        width: "100%",
        textAlign: "center",
        mt: "auto",
        py: 2,
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
        <Link component="a" href={toCurrentVersionPath(location.pathname, "/privacy-policy")} underline="always" sx={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', mx: 0.5, textDecorationColor: "rgba(255,255,255,0.85)" }} target="_blank" rel="noopener">
          {t("Privacy Policy")}
        </Link>
        {" | "}
        <Link component="a" href={toCurrentVersionPath(location.pathname, "/disclaimer")} underline="always" sx={{ color: '#fff', fontWeight: 700, textDecoration: 'underline', mx: 0.5, textDecorationColor: "rgba(255,255,255,0.85)" }} target="_blank" rel="noopener">
          {t("Disclaimer")}
        </Link>
      </Typography>
      <Typography variant="caption" sx={{ mt: 1, display: 'block', fontFamily: 'inherit', color: '#fff', fontWeight: 300 }}>
        {t("This site uses cookies and may serve ads by Google AdSense. By using this site, you agree to our policies.")}
      </Typography>
    </Box>
  );
};

export default Footer;
