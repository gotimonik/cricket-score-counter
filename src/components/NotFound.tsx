import React from "react";
import { Box, Typography, Button } from "@mui/material";
import MetaHelmet from "./MetaHelmet";
import { useTranslation } from "react-i18next";

import { useLocation, useNavigate } from "react-router-dom";
import { toCurrentVersionPath } from "../utils/routes";

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      <MetaHelmet
        pageTitle={t("Page Not Found")}
        canonical="/404"
        description={t("Sorry, the page you are looking for does not exist.")}
        robots="noindex,nofollow"
      />
      <Box
        sx={{
          minHeight: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))",
          position: "relative",
          overflowX: "hidden",
          px: 2,
        }}
      >
        <Box
          sx={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 4,
            boxShadow: 3,
            p: { xs: 3, sm: 5 },
            maxWidth: 520,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: "var(--app-accent-text, #185a9d)",
              fontWeight: 900,
              fontSize: { xs: "calc(22px * var(--app-font-scale, 1))", sm: "calc(32px * var(--app-font-scale, 1))", md: "calc(38px * var(--app-font-scale, 1))" },
              mb: 1,
              pt: { xs: 2, sm: 2 },
              maxWidth: { xs: "100vw", sm: "100vw", md: 900 },
            }}
          >
            🏏{t("Cricket Score Counter")}
          </Typography>
          <Typography variant="h4" sx={{ margin: 0, color: "var(--app-accent-text, #185a9d)" }}>
            {t("Page Not Found")}
          </Typography>
          <Typography sx={{ color: "#333", margin: "16px 0 0" }}>
            {t("Sorry, the page you are looking for does not exist.")}
            <br />
            <span style={{ color: "var(--app-accent-text, #185a9d)", fontWeight: 500 }}>
              {t("Please check the URL or return to the home page.")}
            </span>
          </Typography>
          <Box sx={{ mt: 3, mb: 2, background: '#fff', borderRadius: 2, boxShadow: '0 1px 4px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 13%, transparent 87%)', p: 2 }}>
            <strong>{t("About Cricket Score Counter:")}</strong>
            <ul style={{ margin: '8px 0 0 16px', padding: 0, fontSize: "calc(15px * var(--app-font-scale, 1))", textAlign: 'left' }}>
              <li>{t("Track live cricket scores for any match, anywhere.")}</li>
              <li>{t("Set up your own match, invite friends, and keep score ball-by-ball.")}</li>
              <li>{t("Perfect for street, club, or school games.")}</li>
              <li>{t("Learn more in our")} <a href={toCurrentVersionPath(location.pathname, "/disclaimer")} style={{ color: 'var(--app-accent-text, #185a9d)', textDecoration: 'underline' }}>{t("Disclaimer")}</a> {t("and")} <a href={toCurrentVersionPath(location.pathname, "/privacy-policy")} style={{ color: 'var(--app-accent-text, #185a9d)', textDecoration: 'underline' }}>{t("Privacy Policy")}</a>.</li>
            </ul>
            <Box sx={{ mt: 2, color: 'var(--app-accent-text, #185a9d)', fontWeight: 500, fontSize: "calc(15px * var(--app-font-scale, 1))" }}>
              {t("Need help?")} <a href="mailto:support@cricketscorecounter.com">{t("Contact Support")}</a> {t("or")} <a href={toCurrentVersionPath(location.pathname, "/")} style={{ color: 'var(--app-accent-start, #43cea2)', textDecoration: 'underline' }}>{t("return to the home page")}</a>.
            </Box>
          </Box>
          <Button
            data-ga-click="not_found_go_home"
            variant="contained"
            color="success"
            onClick={() => navigate(toCurrentVersionPath(location.pathname, "/"))}
            size="large"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "calc(15px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))" },
              borderRadius: 99,
              boxShadow: "0 6px 24px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 33%, transparent 67%)",
              py: 1.2,
              minWidth: { xs: 120, sm: 150 },
              maxWidth: { xs: "100%", sm: 260 },
              background: "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
              color: "#fff",
              letterSpacing: 1,
              textTransform: "none",
              mt: 2,
              whiteSpace: "normal",
              wordBreak: "break-word",
              px: 2,
              "&:hover, &:focus": {
                background: "linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%)",
                color: "#fff",
                boxShadow: "0 8px 32px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 47%, transparent 53%)",
                transform: "scale(1.04)",
              },
            }}
          >
            🏠 {t("Home")}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default NotFound;
