import React from "react";
import { Box, Typography, Link } from "@mui/material";

const Footer: React.FC = () => (
  <Box
    component="footer"
    sx={{
      width: "100vw",
      textAlign: "center",
      py: 2,
      background: "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
      borderTop: "2px solid #e0eafc",
      position: "fixed",
      bottom: 0,
      left: 0,
      zIndex: 1300,
      boxShadow: '0 -2px 8px rgba(31,38,135,0.08)',
      fontFamily: 'Roboto, Segoe UI, Helvetica Neue, Arial, sans-serif',
      color: '#fff',
      fontWeight: 400,
      letterSpacing: 0.5,
    }}
  >
    <Typography variant="body2" sx={{ mb: 1, fontFamily: 'inherit', color: '#fff', fontWeight: 500 }}>
      © {new Date().getFullYear()} Cricket Score Counter. All rights reserved.
    </Typography>
    <Typography variant="body2" sx={{ fontFamily: 'inherit', color: '#fff', fontWeight: 400 }}>
      <Link component="a" href="/privacy-policy" underline="always" sx={{ color: '#FFEB3B', fontWeight: 700, textDecoration: 'underline', mx: 0.5 }} target="_blank" rel="noopener">
        Privacy Policy
      </Link>
      {" | "}
      <Link component="a" href="/disclaimer" underline="always" sx={{ color: '#FFEB3B', fontWeight: 700, textDecoration: 'underline', mx: 0.5 }} target="_blank" rel="noopener">
        Disclaimer
      </Link>
    </Typography>
    <Typography variant="caption" sx={{ mt: 1, display: 'block', fontFamily: 'inherit', color: '#fff', fontWeight: 300 }}>
      This site uses cookies and may serve ads by Google AdSense. By using this site, you agree to our policies.
    </Typography>
  </Box>
);

export default Footer;
