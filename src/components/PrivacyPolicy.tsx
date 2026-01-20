import React from "react";
import { Box, Typography } from "@mui/material";
import MetaHelmet from "./MetaHelmet";

const PrivacyPolicy: React.FC = () => (
  <>
    <MetaHelmet pageTitle="Privacy Policy" canonical="/privacy-policy" description="Privacy Policy for Cricket Score Counter." />
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3, pb: 8, background: "#fff", borderRadius: 4, boxShadow: 2, mt: 4 }}>
      <Typography variant="h3" sx={{ mb: 2, color: "#185a9d", fontWeight: 700 }}>Privacy Policy</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        This Privacy Policy explains how Cricket Score Counter collects, uses, and protects your information.
      </Typography>
      <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>Information Collection</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        We may collect non-personal information such as browser type, device, and usage statistics. We do not collect personal information unless you provide it voluntarily.
      </Typography>
      <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>Cookies and Ads</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        We use cookies to improve your experience. We may serve ads by Google AdSense, which may use cookies to personalize ads.
      </Typography>
      <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>Third-Party Services</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        We may use third-party services such as Google Analytics and AdSense. These services may collect and use information according to their own policies.
      </Typography>
      <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>Your Consent</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        By using our site, you consent to our privacy policy.
      </Typography>
      <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>Contact</Typography>
      <Typography variant="body1">
        If you have questions, contact us at <a href="mailto:support@cricketscorecounter.com">support@cricketscorecounter.com</a>.
      </Typography>
    </Box>
  </>
);

export default PrivacyPolicy;
