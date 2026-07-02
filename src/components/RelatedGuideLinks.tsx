import React from "react";
import { Box, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export interface RelatedGuideLink {
  title: string;
  path: string;
  description?: string;
}

interface RelatedGuideLinksProps {
  heading?: string;
  links: RelatedGuideLink[];
}

const RelatedGuideLinks: React.FC<RelatedGuideLinksProps> = ({
  heading = "Related guides",
  links,
}) => {
  if (!links.length) return null;

  return (
    <Box component="nav" aria-label={heading} sx={{ mt: 1 }}>
      <Typography
        sx={{
          fontWeight: 800,
          color: "var(--app-accent-text, #185a9d)",
          mb: 1.5,
          fontSize: { xs: "calc(16px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))" },
        }}
      >
        {heading}
      </Typography>
      <Box
        component="ul"
        sx={{
          listStyle: "none",
          p: 0,
          m: 0,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: `repeat(${Math.min(links.length, 3)}, 1fr)` },
          gap: 1.5,
        }}
      >
        {links.map((link) => (
          <Box
            component="li"
            key={link.path}
            sx={{
              border: "1.5px solid rgba(67,206,162,0.35)",
              borderRadius: 3,
              background: "rgba(255,255,255,0.6)",
              p: 1.5,
            }}
          >
            <Typography
              component={RouterLink}
              to={link.path}
              sx={{
                display: "inline-block",
                color: "#185a9d",
                fontWeight: 800,
                textDecoration: "underline",
                fontSize: { xs: "calc(14px * var(--app-font-scale, 1))", sm: "calc(15px * var(--app-font-scale, 1))" },
                mb: link.description ? 0.5 : 0,
              }}
            >
              {link.title}
            </Typography>
            {link.description ? (
              <Typography
                sx={{
                  color: "var(--app-accent-text, #185a9d)",
                  opacity: 0.85,
                  lineHeight: 1.6,
                  fontSize: { xs: "calc(13px * var(--app-font-scale, 1))", sm: "calc(14px * var(--app-font-scale, 1))" },
                }}
              >
                {link.description}
              </Typography>
            ) : null}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RelatedGuideLinks;
