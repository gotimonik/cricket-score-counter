import React from "react";
import { Box, Typography } from "@mui/material";
import MetaHelmet from "./MetaHelmet";
import { useTranslation } from "react-i18next";

const NotFound: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <MetaHelmet
        pageTitle="Page Not Found"
        canonical="/404"
        description="Sorry, the page you are looking for does not exist."
      />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
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
              color: "#185a9d",
              fontWeight: 900,
              fontSize: { xs: 22, sm: 32, md: 38 },
              mb: 1,
              pt: { xs: 2, sm: 2 },
              maxWidth: { xs: "100vw", sm: "100vw", md: 900 },
            }}
          >
            🏏{t("Cricket Score Counter")}
          </Typography>
          <Typography variant="h4" sx={{ margin: 0, color: "#185a9d" }}>
            {t("Page Not Found")}
          </Typography>
          <Typography sx={{ color: "#333", margin: "16px 0 0" }}>
            {t("Sorry, the page you are looking for does not exist.")}
            <br />
            <span style={{ color: "#185a9d", fontWeight: 500 }}>
              Please check the URL or return to the home page.
            </span>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default NotFound;
