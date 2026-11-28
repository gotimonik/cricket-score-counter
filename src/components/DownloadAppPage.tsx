import React from "react";
import { Helmet } from "react-helmet";
import { Box, Button, Stack, Typography } from "@mui/material";
import {
  Android as AndroidIcon,
  Apple as AppleIcon,
  BoltRounded,
  CheckRounded,
  PhoneIphoneRounded,
  QrCode2Rounded,
  SecurityRounded,
  ShareRounded,
  SportsCricketRounded,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import AppBar from "./AppBar";
import MetaHelmet from "./MetaHelmet";
import { ANDROID_APP_URL, APP_URL, IOS_APP_URL } from "../utils/constant";
import { BOARD } from "../utils/brand";
import { GlassChip, darkBoardBackground, goldButtonSx } from "./ui/Pavilion";

const storeButtonBaseSx = {
  minHeight: 54,
  px: 2.6,
  borderRadius: 999,
  fontWeight: 900,
  letterSpacing: 0.3,
  textTransform: "none",
  "& .MuiButton-startIcon > *:nth-of-type(1)": { fontSize: 24 },
} as const;

const glassPanelSx = {
  position: "relative",
  borderRadius: { xs: 4, md: 5 },
  border: "1px solid rgba(217,180,90,0.3)",
  background: "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
  boxShadow: "0 18px 44px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
  backdropFilter: "blur(6px)",
} as const;

const featureCards = [
  {
    icon: <BoltRounded />,
    title: "Fast match setup",
    body: "Start a local cricket game in seconds and keep the scoreboard moving ball by ball.",
  },
  {
    icon: <ShareRounded />,
    title: "Easy live sharing",
    body: "Share score updates quickly with players, friends, and spectators from the ground.",
  },
  {
    icon: <SecurityRounded />,
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
  // Canonical store URLs for structured data: drop campaign/tracking
  // params (e.g. the App Store ?ppid= custom product page) so search
  // engines match them to the real listings.
  const cleanStoreUrl = (url: string) => {
    const absolute = toAbsolute(url);
    try {
      const parsed = new URL(absolute);
      if (parsed.hostname === "apps.apple.com") {
        parsed.search = "";
      } else if (parsed.hostname === "play.google.com") {
        const id = parsed.searchParams.get("id");
        parsed.search = id ? `?id=${id}` : "";
      }
      return parsed.toString();
    } catch {
      return absolute;
    }
  };
  const storeUrls = [
    ...(hasAndroidDownload ? [cleanStoreUrl(ANDROID_APP_URL)] : []),
    ...(hasIosDownload ? [cleanStoreUrl(IOS_APP_URL)] : []),
  ];
  const pageUrl = `${APP_URL}/download-app`;

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Cricket Score Counter",
    applicationCategory: "SportsApplication",
    operatingSystem: "Android, iOS",
    description:
      "Track cricket runs, wickets and overs ball by ball. Share live cricket scores with friends and manage tournaments. Free on Google Play for Android and the App Store for iPhone.",
    image: `${APP_URL}/images/get-app.png`,
    url: pageUrl,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
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
        pageTitle="Free App for Android & iPhone (iOS)"
        canonical={location.pathname}
        description="Download Cricket Score Counter for Android and iPhone. Track runs, wickets, overs and live cricket scores. Share matches with friends and manage tournaments for free."
        includeWebAppSchema={false}
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
      {/* No page background of its own: the app's board-green page (and the
          user's chosen theme) shows through, like Home. */}
      <Box
        sx={{
          flex: "1 0 auto",
          width: "100%",
          px: { xs: 1.5, sm: 2.5, md: 4 },
          py: { xs: 3, sm: 4.5, md: 6 },
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1180,
            display: "grid",
            gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "1.08fr 0.92fr" },
            gap: { xs: 2, md: 3 },
            alignItems: "stretch",
          }}
        >
          <Box
            component="section"
            sx={{
              position: "relative",
              isolation: "isolate",
              overflow: "hidden",
              borderRadius: { xs: 4, md: 5 },
              p: { xs: 2.2, sm: 3.2, md: 4.2 },
              color: "#fff",
              background: darkBoardBackground,
              border: "1px solid rgba(217,180,90,0.4)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <SportsCricketRounded
              aria-hidden
              sx={{
                position: "absolute",
                zIndex: -1,
                right: { xs: -40, md: -20 },
                bottom: { xs: -50, md: -60 },
                fontSize: { xs: 200, md: 280 },
                color: BOARD.goldLight,
                opacity: 0.06,
                transform: "rotate(-14deg)",
              }}
            />
            <Stack direction="row" columnGap={0.75} rowGap={0.75} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
              <GlassChip tone="gold" icon={<PhoneIphoneRounded />}>iPhone &amp; Android</GlassChip>
              <GlassChip>Free forever</GlassChip>
            </Stack>
            <Typography
              sx={{
                fontWeight: 900,
                letterSpacing: 1.6,
                textTransform: "uppercase",
                fontSize: "calc(12px * var(--app-font-scale, 1))",
                color: BOARD.goldLight,
                mb: 0.75,
              }}
            >
              Cricket Score Counter app
            </Typography>
            <Typography
              component="h1"
              sx={{
                color: "#fff",
                fontWeight: 900,
                lineHeight: 1.06,
                letterSpacing: -0.8,
                fontSize: { xs: "calc(32px * var(--app-font-scale, 1))", sm: "calc(44px * var(--app-font-scale, 1))", md: "calc(52px * var(--app-font-scale, 1))" },
                maxWidth: 620,
                mb: 1.5,
                textShadow: "0 2px 16px rgba(0,0,0,0.3)",
              }}
            >
              Download the app and score matches with{" "}
              <Box component="span" sx={{ color: BOARD.goldLight }}>less effort.</Box>
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.8)",
                fontWeight: 600,
                fontSize: { xs: "calc(15.5px * var(--app-font-scale, 1))", sm: "calc(17px * var(--app-font-scale, 1))" },
                lineHeight: 1.6,
                maxWidth: 600,
                mb: 2.5,
              }}
            >
              Built for local cricket, this mobile experience makes live scoring faster,
              clearer, and easier to share from the ground.
            </Typography>
            <Box
              sx={{
                mb: 1.5,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                flexWrap: "wrap",
                gap: 1.25,
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
                  ...storeButtonBaseSx,
                  color: "#fff",
                  background: "#000",
                  border: `1px solid rgba(241,214,138,0.55)`,
                  boxShadow: "0 14px 32px rgba(0,0,0,0.35)",
                  "&:hover": { background: "#16181a", borderColor: BOARD.goldLight },
                  "&.Mui-disabled": { color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.1)" },
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
                sx={{ ...goldButtonSx, ...storeButtonBaseSx }}
              >
                {hasAndroidDownload ? "Get it on Google Play" : "Android app coming soon"}
              </Button>
              <Button
                size="large"
                onClick={() => navigate("/create-game")}
                sx={{
                  ...storeButtonBaseSx,
                  px: 3,
                  fontWeight: 800,
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.32)",
                  background: "rgba(255,255,255,0.07)",
                  "&:hover": { color: "#fff", borderColor: BOARD.goldLight, background: "rgba(255,255,255,0.13)" },
                }}
              >
                Try the web app
              </Button>
            </Box>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.62)",
                fontWeight: 600,
                fontSize: { xs: "calc(13px * var(--app-font-scale, 1))", sm: "calc(14px * var(--app-font-scale, 1))" },
                mb: 3,
              }}
            >
              Free on the App Store for iPhone and on Google Play for Android.
            </Typography>
            <Box
              component="ul"
              sx={{
                listStyle: "none",
                m: 0,
                p: 0,
                pt: 2.5,
                borderTop: "1px dashed rgba(241,214,138,0.3)",
                display: "grid",
                gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(3, minmax(0, 1fr))" },
                gap: 1.25,
              }}
            >
              {featureCards.map((feature) => (
                <Box
                  component="li"
                  key={feature.title}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "row", sm: "column" },
                    gap: 1.1,
                    p: { xs: 1.4, sm: 1.75 },
                    borderRadius: 3,
                    background: "linear-gradient(160deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%)",
                    border: "1px solid rgba(241,214,138,0.2)",
                  }}
                >
                  <Box
                    sx={{
                      flex: "none",
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      color: BOARD.green,
                      background: `linear-gradient(180deg, ${BOARD.goldLight} 0%, ${BOARD.gold} 100%)`,
                      boxShadow: "0 3px 10px rgba(217,180,90,0.3)",
                      "& svg": { fontSize: 21 },
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: "#fff", fontWeight: 900, mb: 0.4 }}>
                      {feature.title}
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "calc(13.5px * var(--app-font-scale, 1))", lineHeight: 1.55 }}>
                      {feature.body}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Scan-to-download QR: points at /get-app, which sends iPhones
                to the App Store and Android phones to Google Play. Hidden on
                phones, where the store buttons above are the quicker path. */}
            <Box
              sx={{
                ...glassPanelSx,
                display: { xs: "none", sm: "flex" },
                flexDirection: { sm: "row", md: "column" },
                alignItems: "center",
                gap: { sm: 2.4, md: 1.8 },
                p: { sm: 2.4, md: 3 },
                textAlign: { sm: "left", md: "center" },
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  p: "3px",
                  borderRadius: 4.5,
                  background: `linear-gradient(145deg, #FBEBBE 0%, ${BOARD.gold} 45%, #8a6a22 100%)`,
                  boxShadow: "0 18px 40px rgba(0,0,0,0.35), 0 0 30px rgba(217,180,90,0.2)",
                }}
              >
                <Box sx={{ p: 1.5, borderRadius: 4, background: "#fff" }}>
                  <Box
                    component="img"
                    src="/images/get-app-qr.svg"
                    alt="QR code to download Cricket Score Counter for iPhone or Android"
                    width={220}
                    height={220}
                    loading="lazy"
                    sx={{
                      display: "block",
                      width: { sm: 170, md: 210 },
                      height: { sm: 170, md: 210 },
                    }}
                  />
                </Box>
              </Box>
              <Box>
                <Stack direction="row" spacing={0.75} alignItems="center" justifyContent={{ sm: "flex-start", md: "center" }} sx={{ mb: 0.5 }}>
                  <QrCode2Rounded sx={{ color: BOARD.goldLight, fontSize: 22 }} />
                  <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: 21 }}>
                    Scan to get the app
                  </Typography>
                </Stack>
                <Typography sx={{ color: "rgba(255,255,255,0.75)", fontWeight: 600, lineHeight: 1.6, maxWidth: 360, mx: { md: "auto" } }}>
                  Point your phone camera at the code. It opens the App Store on
                  iPhone or Google Play on Android automatically.
                </Typography>
              </Box>
            </Box>
            <Box sx={{ ...glassPanelSx, p: { xs: 2.2, sm: 2.6 } }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <Box sx={{ width: 4, height: 22, borderRadius: 99, background: `linear-gradient(180deg, ${BOARD.goldLight}, ${BOARD.gold})` }} />
                <Typography component="h2" sx={{ color: "#fff", fontWeight: 900, fontSize: 21 }}>
                  Why install it?
                </Typography>
              </Stack>
              <Stack component="ul" spacing={1.25} sx={{ listStyle: "none", m: 0, p: 0 }}>
                {[
                  "Cleaner mobile-first layout for match-day scoring",
                  "Faster access from your home screen when the toss begins",
                  "A smoother way to track street, club, and school matches",
                ].map((item) => (
                  <Box component="li" key={item} sx={{ display: "flex", alignItems: "flex-start", gap: 1.2 }}>
                    <Box
                      sx={{
                        mt: 0.2,
                        width: 22,
                        height: 22,
                        flexShrink: 0,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        color: BOARD.green,
                        background: `linear-gradient(180deg, ${BOARD.goldLight} 0%, ${BOARD.gold} 100%)`,
                      }}
                    >
                      <CheckRounded sx={{ fontSize: 15 }} />
                    </Box>
                    <Typography sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 600, lineHeight: 1.6 }}>
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
