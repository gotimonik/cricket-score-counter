import React from "react";
import { Box, Typography } from "@mui/material";
import MetaHelmet from "./MetaHelmet";

const Disclaimer: React.FC = () => (
  <>
    <MetaHelmet pageTitle="Disclaimer" canonical="/disclaimer" description="Disclaimer for Cricket Score Counter." />
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3, background: "#fff", borderRadius: 4, boxShadow: 2, mt: 4 }}>
      <Typography variant="h3" sx={{ mb: 2, color: "#185a9d", fontWeight: 700 }}>Disclaimer</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Cricket Score Counter is provided for informational and entertainment purposes only. We do not guarantee the accuracy or completeness of scores or match data.
      </Typography>
      <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>Ads and Third-Party Content</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        This site may display ads served by Google AdSense. We are not responsible for the content of third-party ads or external links.
      </Typography>
      <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>Limitation of Liability</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        We are not liable for any damages resulting from the use of this site.
      </Typography>
      <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>Contact</Typography>
      <Typography variant="body1">
        If you have questions, contact us at <a href="mailto:support@cricketscorecounter.com">support@cricketscorecounter.com</a>.
      </Typography>
    </Box>
  </>
);

export default Disclaimer;
