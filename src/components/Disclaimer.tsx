import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import MetaHelmet from "./MetaHelmet";
import AppBar from "./AppBar";

const Disclaimer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <MetaHelmet
        pageTitle={t("Disclaimer")}
        canonical="/disclaimer"
        description={t("Disclaimer for Cricket Score Counter.")}
      />
      <AppBar />
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          p: 3,
          background: "#fff",
          borderRadius: 4,
          boxShadow: 2,
          my: 7,
        }}
      >
        <Typography
          variant="h3"
          sx={{ mb: 2, color: "#185a9d", fontWeight: 700 }}
        >
          {t("Disclaimer")}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {t("Cricket Score Counter is provided for informational and entertainment purposes only. We do not guarantee the accuracy or completeness of scores or match data.")}
        </Typography>
        <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
          {t("Ads and Third-Party Content")}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {t("This site may display ads served by Google AdSense. We are not responsible for the content of third-party ads or external links.")}
        </Typography>
        <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
          {t("Limitation of Liability")}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {t("We are not liable for any damages resulting from the use of this site.")}
        </Typography>
        <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
          {t("Contact")}
        </Typography>
        <Typography variant="body1">
          {t("If you have questions, contact us at")}
          <a href="mailto:support@cricketscorecounter.com">
            support@cricketscorecounter.com
          </a>
          .
        </Typography>
      </Box>
    </>
  );
};

export default Disclaimer;
