import React from "react";
import { Box, Typography, Link } from "@mui/material";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box
      component="footer"
      sx={{
        width: "100vw",
        textAlign: "center",
        py: 2,
        background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
        borderTop: "2px solid #e0eafc",
        position: "static",
        boxShadow: '0 -2px 8px rgba(31,38,135,0.08)',
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
        <Link component="a" href="/privacy-policy" underline="always" sx={{ color: '#FFEB3B', fontWeight: 700, textDecoration: 'underline', mx: 0.5 }} target="_blank" rel="noopener">
          {t("Privacy Policy")}
        </Link>
        {" | "}
        <Link component="a" href="/disclaimer" underline="always" sx={{ color: '#FFEB3B', fontWeight: 700, textDecoration: 'underline', mx: 0.5 }} target="_blank" rel="noopener">
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
