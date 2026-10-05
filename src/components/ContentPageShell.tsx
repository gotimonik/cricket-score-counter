import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import AppBar from "./AppBar";
import PageTitleWithBack from "./PageTitleWithBack";

/**
 * Shared layout for long-form content pages (Learn articles, glossary,
 * calculators). Keeps the look identical to the existing guide pages while
 * avoiding copy-pasting the same 40 lines of layout into every new page.
 */

export const contentText = {
  color: "var(--app-accent-text, #185a9d)",
  lineHeight: 1.75,
  fontSize: {
    xs: "calc(15px * var(--app-font-scale, 1))",
    sm: "calc(16px * var(--app-font-scale, 1))",
  },
} as const;

export const contentHeading = {
  fontWeight: 800,
  color: "var(--app-accent-text, #185a9d)",
  mb: 1,
  mt: 1,
  fontSize: {
    xs: "calc(19px * var(--app-font-scale, 1))",
    sm: "calc(22px * var(--app-font-scale, 1))",
  },
  scrollMarginTop: "90px",
} as const;

export const contentSubheading = {
  fontWeight: 800,
  color: "var(--app-accent-text, #185a9d)",
  mb: 0.75,
  fontSize: {
    xs: "calc(16px * var(--app-font-scale, 1))",
    sm: "calc(18px * var(--app-font-scale, 1))",
  },
} as const;

interface ContentPageShellProps {
  title: React.ReactNode;
  intro?: React.ReactNode;
  eyebrow?: React.ReactNode;
  maxWidth?: number;
  children: React.ReactNode;
  paperSx?: SxProps<Theme>;
}

const ContentPageShell: React.FC<ContentPageShellProps> = ({
  title,
  intro,
  eyebrow,
  maxWidth = 900,
  children,
  paperSx,
}) => (
  <>
    <AppBar showHomeMenuItem />
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        background:
          "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))",
        pb: 4,
      }}
    >
      <Box sx={{ width: "100%", maxWidth, px: { xs: 1.5, sm: 2.5 }, mt: 2 }}>
        <Paper
          component="article"
          elevation={0}
          sx={[
            {
              borderRadius: 4,
              background: "linear-gradient(135deg, #f8fffc 0%, #eef4fd 100%)",
              border: "2px solid var(--app-accent-start, #43cea2)",
              boxShadow: "0 10px 30px rgba(8, 26, 56, 0.14)",
              p: { xs: 2, sm: 3.5 },
            },
            ...(Array.isArray(paperSx) ? paperSx : paperSx ? [paperSx] : []),
          ]}
        >
          {eyebrow ? <Box sx={{ mb: 1 }}>{eyebrow}</Box> : null}
          <PageTitleWithBack
            titleSx={{
              color: "var(--app-accent-text, #185a9d)",
              fontWeight: 900,
              lineHeight: 1.2,
              fontSize: {
                xs: "calc(25px * var(--app-font-scale, 1))",
                sm: "calc(34px * var(--app-font-scale, 1))",
              },
            }}
          >
            {title}
          </PageTitleWithBack>
          {intro ? (
            <Typography
              component="div"
              sx={{
                ...contentText,
                fontWeight: 600,
                mb: 2,
              }}
            >
              {intro}
            </Typography>
          ) : null}
          {children}
        </Paper>
      </Box>
    </Box>
  </>
);

export default ContentPageShell;
