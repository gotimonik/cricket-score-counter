import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import MetaHelmet from "./MetaHelmet";
import AppBar from "./AppBar";
import PageTitleWithBack from "./PageTitleWithBack";

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  return (
    <>
      <MetaHelmet
        pageTitle={t("Privacy Policy")}
        canonical={location.pathname}
        description={t(
          "Read the Cricket Score Counter privacy policy, including cookies, analytics, ads, and data usage details.",
        )}
        keywords="cricket score counter privacy policy, cookies policy, adsense policy, analytics policy"
      />
      <AppBar showHomeMenuItem />
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background:
            "var(--app-page-gradient, linear-gradient(135deg, #43cea2 0%, #185a9d 100%))",
          pb: 4,
        }}
      >
        <Box
          sx={{ width: "100%", maxWidth: 900, px: { xs: 1.5, sm: 2.5 }, mt: 2 }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              background: "linear-gradient(135deg, #f8fffc 0%, #e0eafc 100%)",
              border: "2px solid var(--app-accent-start, #43cea2)",
              boxShadow: "0 10px 30px rgba(8, 26, 56, 0.14)",
              p: { xs: 2, sm: 3 },
            }}
          >
            <PageTitleWithBack
              titleSx={{
                color: "var(--app-accent-text, #185a9d)",
                fontWeight: 900,
                fontSize: {
                  xs: "calc(26px * var(--app-font-scale, 1))",
                  sm: "calc(34px * var(--app-font-scale, 1))",
                },
              }}
            >
              {t("Privacy Policy")}
            </PageTitleWithBack>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "This Privacy Policy explains how Cricket Score Counter collects, uses, and protects your information.",
              )}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t("Last updated: November 24, 2026.")}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Information Collection")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "We collect non-personal information such as browser type, device, and usage statistics. We collect personal information only when you or another user provide it, for example when you create an account or player profile, or when an organizer adds you to a team.",
              )}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "When you create or view a match, the app may process match details such as team names, player names, scores, overs, wickets, and scoring events so the scoreboard and match history can work correctly.",
              )}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("How We Use Information")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "We use information to provide live scoring, improve app reliability, understand page usage, prevent abuse, and respond to support requests.",
              )}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Player Profiles")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "If you create a player profile, we store your name, @username and, if you add them, your photo, playing role, city, batting style and bowling style. We also calculate career statistics from the matches you are named in.",
              )}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "Profiles are public by default: anyone with the link can see your profile and stats, and organizers can find you by name or @username to add you to a team. You can make your profile private at any time from your player profile settings. Your email address and phone number are never shown on your profile.",
              )}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Players Added by Organizers")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "Tournament organizers and scorers can add players to their teams by name, and may add a phone number to reach the player. Organizers should only add someone's phone number with their permission. If you have an account, you can ask to link a record an organizer made for you to your own profile; the organizer who created it approves the request. To have a record about you corrected or removed, contact the organizer or email us.",
              )}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "When you are added to a team, or someone responds to a request you made, we show you a notification in the app.",
              )}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Shared Match Links")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "Every tournament match has a permanent watch link the organizer can share. Anyone with the link can see the tournament name, team names and logos, the score, the scorecard and the result, without logging in. While a match is being scored, the latest score is saved at the end of every over so the link keeps working if the scorer goes offline. Phone numbers and email addresses are not included.",
              )}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Photos and Logos")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "Profile photos, team logos and tournament logos you upload are resized on your device before they are sent. They are stored by our image storage provider (Vercel Blob) and served from a public web address, so anyone with that address can open the image. Do not upload images you do not have the right to share.",
              )}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Cookies and Ads")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "We use cookies to improve your experience. We may serve ads by Google AdSense, which may use cookies to personalize ads.",
              )}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "Google and its partners may use cookies or similar technologies to serve and measure ads. You can manage ad personalization through your Google ad settings and your browser cookie controls.",
              )}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Third-Party Services")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "We use third-party services to run the app: hosting for our servers, a database provider, Vercel Blob for images, an email and SMS provider to send sign-in and verification codes, Google and Apple for sign-in if you choose them, Google Analytics, and Google AdSense and AdMob for ads. These services process information on our behalf or under their own privacy policies.",
              )}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Administrators and Moderation")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "A small number of Cricket Score Counter administrators can view accounts, player profiles, tournaments and matches, including the email addresses and phone numbers linked to them. They use this only to provide support, prevent spam and abuse, and enforce our Terms of Use. Administrators can suspend a player profile (hiding it from public view) or delete tournaments and matches that break the Terms. Every such action is logged.",
              )}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Payments (Planned)")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "Cricket Score Counter is free today. If we introduce the optional Premium plan, payments will be handled by the app stores (Apple App Store, Google Play) or a payment provider on the website. We will not see or store your full card details. We will update this policy before any payments start.",
              )}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Data Retention and Control")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "Some match information may be stored locally on your device or handled by our scoring service while a match is active. You can clear browser storage to remove local match history from your device.",
              )}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Accounts and Deleting Your Data")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "If you create an account, we store your name, email address or phone number, a securely hashed password (if you set one), and the matches, tournaments, teams and players you save, so you can access them on any device. If you sign in with Google or Apple, we receive only your name, email address (with Apple, this may be a private relay address) and an account identifier from that provider.",
              )}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "You can permanently delete your account at any time from Account Settings in the app or website. Deletion is immediate: your account and all data linked to it are erased from our servers and cannot be recovered. This includes your player profile and photo, the tournaments, teams and matches you created, images you uploaded, your notifications and requests. If you had linked a record an organizer created, it goes back to being their record, without the details you added. Matches other people scored that include your name stay in their records. If you can't log in, email us and we will delete it for you.",
              )}{" "}
              <a href="/delete-account">{t("How to delete your account")}</a>.
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Children and Local Matches")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t(
                "Cricket Score Counter is a general scoring utility. Accounts and player profiles are intended for people aged 13 and over. When scoring for junior players, use first names, initials or nicknames, and leave phone numbers and photos out. Avoid entering sensitive personal details for anyone; first names, initials, or team nicknames are usually enough for local scorecards.",
              )}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Your Consent")}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t("By using our site, you consent to our privacy policy.")}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 1 }}>
              {t("Contact")}
            </Typography>
            <Typography variant="body1">
              {t("If you have questions, contact us at")}{" "}
              <a href="mailto:gotimonik1@gmail.com">gotimonik1@gmail.com</a>{" "}
              {t("or")} <a href="tel:+918128313138">+91 8128313138</a>.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default PrivacyPolicy;
