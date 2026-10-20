import React from "react";
import { Helmet } from "react-helmet";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import {
  Android as AndroidIcon,
  Apple as AppleIcon,
  BoltRounded,
  PhoneIphoneRounded,
  SecurityRounded,
  ShareRounded,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import { ANDROID_APP_URL, APP_URL, IOS_APP_URL } from "../utils/constant";

const featureCards = [
  {
    icon: <BoltRounded sx={{ fontSize: 28 }} />,
    title: "Fast match setup",
    body: "Start a local cricket game in seconds and keep the scoreboard moving ball by ball.",
  },
  {
    icon: <ShareRounded sx={{ fontSize: 28 }} />,
    title: "Easy live sharing",
    body: "Share score updates quickly with players, friends, and spectators from the ground.",
  },
  {
    icon: <SecurityRounded sx={{ fontSize: 28 }} />,
    title: "Made for real grounds",
    body: "A clean mobile experience designed for quick taps, clear visibility, and fewer mistakes.",
  },
];

const DownloadAppPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toAbsolute = (url: string) =>
    url.startsWith("http")
      ? url
      : `${APP_URL}${url.startsWith("/") ? url : `/${url}`}`;
  const hasAndroidDownload = Boolean(ANDROID_APP_URL);
  const hasIosDownload = Boolean(IOS_APP_URL);
  const storeUrls = [
    ...(hasIosDownload ? [toAbsolute(IOS_APP_URL)] : []),
    ...(hasAndroidDownload ? [toAbsolute(ANDROID_APP_URL)] : []),
  ];
  const pageUrl = `${APP_URL}/download-app`;

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Cricket Score Counter",
    applicationCategory: "SportsApplication",
    operatingSystem: "iOS, Android",
    description:
      "Download the Cricket Score Counter app for iPhone or Android for faster local cricket scoring, live match sharing, and a smoother mobile scoreboard experience.",
    image: `${APP_URL}/images/get-app.png`,
    url: pageUrl,
    ...(storeUrls.length
      ? { downloadUrl: storeUrls, installUrl: storeUrls, sameAs: storeUrls }
      : {}),
    publisher: {
      "@type": "Organization",
      name: "Cricket Score Counter",
      url: APP_URL,
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: APP_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Download App",
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <MetaHelmet
        pageTitle="Download Cricket Scoring App for iPhone & Android"
        canonical={location.pathname}
        description="Download the free Cricket Score Counter app on the App Store for iPhone or Google Play for Android: fast local cricket scoring, live score sharing, and an easier match-day experience."
        image={`${APP_URL}/images/get-app.png`}
        keywords="download cricket score counter app, iphone cricket scoring app, cricket score counter ios, android cricket scoring app, cricket score counter apk, cricket scoreboard app, live cricket scoring app download, cricket score counter android"
      />
      <Helmet>
        <meta
          property="og:image:alt"
          content="Cricket Score Counter iPhone and Android app download preview"
        />
        <meta
          name="twitter:image:alt"
          content="Cricket Score Counter iPhone and Android app download preview"
        />
        <script type="application/ld+json">
          {JSON.stringify(softwareApplicationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      <AppBar showHomeMenuItem />
      <Box
        sx={{
          minHeight: "calc(100dvh - 88px)",
          width: "100%",
          position: "relative",
          overflow: "hidden",
          px: { xs: 1.5, sm: 2.5, md: 4 },
          py: { xs: 3, sm: 4.5, md: 6 },
          display: "flex",
          justifyContent: "center",
          background:
            "radial-gradient(110% 90% at 0% 0%, rgba(73, 227, 181, 0.28) 0%, transparent 42%), radial-gradient(90% 80% at 100% 10%, rgba(17, 85, 163, 0.34) 0%, transparent 46%), linear-gradient(145deg, #071a32 0%, #0c3a65 52%, #19a57f 100%)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.22,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <Box
          sx={{
            width: "100%",
            maxWidth: 1180,
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.08fr 0.92fr" },
            gap: { xs: 2.5, md: 3.5 },
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              borderRadius: { xs: 4, md: 5 },
              p: { xs: 2.2, sm: 3.2, md: 4.2 },
              background: "linear-gradient(180deg, rgba(5, 20, 43, 0.84) 0%, rgba(8, 30, 62, 0.72) 100%)",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 24px 80px rgba(0, 0, 0, 0.28)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", rowGap: 1 }}>
              <Chip
                icon={<PhoneIphoneRounded sx={{ color: "#fff !important" }} />}
                label="iPhone & Android"
                sx={{
                  color: "#fff",
                  fontWeight: 800,
                  background: "rgba(63, 226, 170, 0.18)",
                  border: "1px solid rgba(102, 255, 204, 0.32)",
                }}
              />
              <Chip
                label="Fresh mobile experience"
                sx={{
                  color: "#eafcff",
                  fontWeight: 700,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              />
            </Stack>
            <Typography
              component="h1"
              sx={{
                color: "#fff",
                fontWeight: 900,
                lineHeight: 1.04,
                letterSpacing: -0.8,
                fontSize: { xs: "calc(34px * var(--app-font-scale, 1))", sm: "calc(48px * var(--app-font-scale, 1))", md: "calc(58px * var(--app-font-scale, 1))" },
                maxWidth: 620,
                mb: 1.5,
              }}
            >
              Download the app and score matches with less effort.
            </Typography>
            <Typography
              sx={{
                color: "rgba(235, 248, 255, 0.86)",
                fontSize: { xs: "calc(16px * var(--app-font-scale, 1))", sm: "calc(18px * var(--app-font-scale, 1))" },
                lineHeight: 1.7,
                maxWidth: 620,
                mb: 2.2,
              }}
            >
              Built for local cricket, this mobile experience makes live scoring faster,
              clearer, and easier to share from the ground.
            </Typography>
            <Box
              sx={{
                mb: 2.2,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                flexWrap: "wrap",
                gap: 1.4,
                alignItems: { xs: "stretch", sm: "center" },
              }}
            >
              <Button
                component={hasIosDownload ? "a" : "button"}
                href={hasIosDownload ? IOS_APP_URL : undefined}
                target={hasIosDownload ? "_blank" : undefined}
                rel={hasIosDownload ? "noopener noreferrer" : undefined}
                data-ga-click="download_page_ios_app"
                startIcon={<AppleIcon />}
                variant="contained"
                size="large"
                disabled={!hasIosDownload}
                sx={{
                  ...{
                  minHeight: 54,
                  px: 2.6,
                  borderRadius: 999,
                  fontWeight: 900,
                  letterSpacing: 0.3,
                  textTransform: "none",
                  "& .MuiButton-startIcon > *:nth-of-type(1)": { fontSize: 24 },
                  "&.Mui-disabled": {
                    color: "rgba(255,255,255,0.78)",
                    background: "rgba(255,255,255,0.16)",
                  },
                },
                  color: "#fff",
                  background: "#000",
                  border: "1px solid rgba(255,255,255,0.4)",
                  boxShadow: "0 18px 40px rgba(0, 0, 0, 0.3)",
                  "&:hover": { background: "#1c1c1e" },
                }}
              >
                {hasIosDownload ? "Download on the App Store" : "iPhone app coming soon"}
              </Button>
              <Button
                component={hasAndroidDownload ? "a" : "button"}
                href={hasAndroidDownload ? ANDROID_APP_URL : undefined}
                target={hasAndroidDownload ? "_blank" : undefined}
                rel={hasAndroidDownload ? "noopener noreferrer" : undefined}
                data-ga-click="download_page_android_app"
                startIcon={<AndroidIcon />}
                variant="contained"
                size="large"
                disabled={!hasAndroidDownload}
                sx={{
                  ...{
                  minHeight: 54,
                  px: 2.6,
                  borderRadius: 999,
                  fontWeight: 900,
                  letterSpacing: 0.3,
                  textTransform: "none",
                  "& .MuiButton-startIcon > *:nth-of-type(1)": { fontSize: 24 },
                  "&.Mui-disabled": {
                    color: "rgba(255,255,255,0.78)",
                    background: "rgba(255,255,255,0.16)",
                  },
                },
                  color: "#06213d",
                  background: "linear-gradient(135deg, #9dffcc 0%, #56f0c2 48%, #d5fff2 100%)",
                  boxShadow: "0 18px 40px rgba(66, 245, 188, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #b7ffda 0%, #6af4ca 48%, #e4fff6 100%)",
                  },
                }}
              >
                {hasAndroidDownload ? "Get it on Google Play" : "Android app coming soon"}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/create-game")}
                sx={{
                  minHeight: 54,
                  px: 3,
                  borderRadius: 999,
                  fontWeight: 800,
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.34)",
                  background: "rgba(255,255,255,0.06)",
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.6)",
                    background: "rgba(255,255,255,0.12)",
                  },
                }}
              >
                Try the web app
              </Button>
            </Box>
            <Typography
              sx={{
                color: "rgba(233, 250, 255, 0.7)",
                fontSize: { xs: "calc(13px * var(--app-font-scale, 1))", sm: "calc(14px * var(--app-font-scale, 1))" },
                mb: 3,
              }}
            >
              Free on the App Store for iPhone and on Google Play for Android.
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: 1.4,
              }}
            >
              {featureCards.map((feature) => (
                <Box
                  key={feature.title}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)",
                    border: "1px solid rgba(255,255,255,0.14)",
                  }}
                >
                  <Box sx={{ color: "#90ffd6", mb: 1 }}>{feature.icon}</Box>
                  <Typography sx={{ color: "#fff", fontWeight: 800, mb: 0.6 }}>
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: "rgba(232, 246, 255, 0.78)", lineHeight: 1.65 }}>
                    {feature.body}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Scan-to-download QR: points at /get-app, which sends iPhones
                to the App Store and Android phones to Google Play. Hidden on
                phones, where the store buttons above are the quicker path. */}
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                flexDirection: { sm: "row", md: "column" },
                alignItems: "center",
                gap: { sm: 2.4, md: 1.8 },
                borderRadius: { xs: 4, md: 5 },
                p: { sm: 2.4, md: 3 },
                textAlign: { sm: "left", md: "center" },
                background: "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 100%)",
                border: "1px solid rgba(255,255,255,0.16)",
                boxShadow: "0 24px 80px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  p: 1.6,
                  borderRadius: 4,
                  background: "#fff",
                  boxShadow: "0 18px 40px rgba(0, 0, 0, 0.22)",
                }}
              >
                <Box
                  component="img"
                  src="/images/get-app-qr.svg"
                  alt="QR code to download Cricket Score Counter for iPhone or Android"
                  width={220}
                  height={220}
                  loading="lazy"
                  sx={{
                    display: "block",
                    width: { sm: 180, md: 220 },
                    height: { sm: 180, md: 220 },
                  }}
                />
              </Box>
              <Box>
                <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: 22, mb: 0.6 }}>
                  Scan to get the app
                </Typography>
                <Typography sx={{ color: "rgba(236, 248, 255, 0.84)", lineHeight: 1.7, maxWidth: 360 }}>
                  Point your phone camera at the code. It opens the App Store on
                  iPhone or Google Play on Android automatically.
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                borderRadius: { xs: 4, md: 5 },
                p: { xs: 2.2, sm: 2.6 },
                background: "linear-gradient(180deg, rgba(7, 28, 53, 0.78) 0%, rgba(10, 42, 79, 0.62) 100%)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <Typography sx={{ color: "#fff", fontWeight: 900, mb: 1.1, fontSize: 22 }}>
                Why install it?
              </Typography>
              <Stack spacing={1.2}>
                {[
                  "Cleaner mobile-first layout for match-day scoring",
                  "Faster access from your home screen when the toss begins",
                  "A smoother way to track street, club, and school matches",
                ].map((item) => (
                  <Box
                    key={item}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.2,
                    }}
                  >
                    <Box
                      sx={{
                        mt: 0.6,
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#7df8c9",
                        flexShrink: 0,
                      }}
                    />
                    <Typography sx={{ color: "rgba(236, 248, 255, 0.84)", lineHeight: 1.7 }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default DownloadAppPage;
