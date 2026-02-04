
import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import MetaHelmet from "./MetaHelmet";
import AppBar from "./AppBar";


const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <MetaHelmet pageTitle={t("Privacy Policy")} canonical="/privacy-policy" description={t("Privacy Policy for Cricket Score Counter.")} />
      <AppBar />
      <Box sx={{ maxWidth: 800, mx: "auto", p: 3, background: "#fff", borderRadius: 4, boxShadow: 2, my: 4 }}>
        <Typography variant="h3" sx={{ mb: 2, color: "#185a9d", fontWeight: 700 }}>{t("Privacy Policy")}</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{t("This Privacy Policy explains how Cricket Score Counter collects, uses, and protects your information.")}</Typography>
        <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>{t("Information Collection")}</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{t("We may collect non-personal information such as browser type, device, and usage statistics. We do not collect personal information unless you provide it voluntarily.")}</Typography>
        <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>{t("Cookies and Ads")}</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{t("We use cookies to improve your experience. We may serve ads by Google AdSense, which may use cookies to personalize ads.")}</Typography>
        <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>{t("Third-Party Services")}</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{t("We may use third-party services such as Google Analytics and AdSense. These services may collect and use information according to their own policies.")}</Typography>
        <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>{t("Your Consent")}</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>{t("By using our site, you consent to our privacy policy.")}</Typography>
        <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>{t("Contact")}</Typography>
        <Typography variant="body1">
          {t("If you have questions, contact us at")}
          <a href="mailto:support@cricketscorecounter.com">support@cricketscorecounter.com</a>.
        </Typography>
      </Box>
    </>
  );
};

export default PrivacyPolicy;
