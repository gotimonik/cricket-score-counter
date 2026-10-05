import React from "react";
import { Box, Button, Typography } from "@mui/material";
import DeleteForeverRounded from "@mui/icons-material/DeleteForeverRounded";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import MetaHelmet from "./MetaHelmet";
import ContentPageShell, { contentHeading, contentText } from "./ContentPageShell";
import AuthService from "../services/AuthService";
import { DELETED_DATA_ITEMS } from "./DeleteAccountSection";

const SUPPORT_EMAIL = "gotimonik1@gmail.com";

/**
 * Public "how to delete your account" page. Google Play requires a web URL
 * where users can request account and data deletion, and App Review checks
 * that deletion is easy to find - this page is that URL, and it links
 * straight to the in-app delete flow on /account.
 */
const DeleteAccountInfoPage: React.FC = () => {
  const navigate = useNavigate();
  // Read login state after mount: this page is prerendered, so the server
  // HTML must not depend on localStorage (avoids a hydration mismatch).
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  React.useEffect(() => {
    setLoggedIn(AuthService.isLoggedIn());
    return AuthService.subscribe(() => setLoggedIn(AuthService.isLoggedIn()));
  }, []);

  const goToDelete = () => {
    if (isLoggedIn) {
      navigate("/account#delete-account");
    } else {
      navigate("/login", { state: { next_redirect: "/account" } });
    }
  };

  return (
    <>
      <MetaHelmet
        pageTitle="Delete Your Account and Data"
        canonical="/delete-account"
        description="How to permanently delete your Cricket Score Counter account and all associated data from the app or website, what gets deleted, and how to request deletion by email."
        keywords="delete cricket score counter account, delete my data, account deletion, remove account"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Delete Account", path: "/delete-account" },
        ]}
      />
      <ContentPageShell
        maxWidth={760}
        title="Delete your account"
        intro="You can permanently delete your Cricket Score Counter account and all of its data at any time, from the app or this website."
      >
        <Button
          variant="contained"
          onClick={goToDelete}
          startIcon={<DeleteForeverRounded />}
          sx={{
            mb: 3,
            minHeight: 46,
            px: 2.5,
            borderRadius: 2,
            fontWeight: 900,
            textTransform: "none",
            color: "#fff",
            backgroundColor: "#c62828",
            "&:hover": { backgroundColor: "#8e1b1b" },
          }}
        >
          {isLoggedIn ? "Delete my account" : "Log in to delete your account"}
        </Button>

        <Typography component="h2" sx={contentHeading}>
          How to delete your account
        </Typography>
        <Box component="ol" sx={{ ...contentText, pl: 3, mt: 0, mb: 2.5 }}>
          <li>Open the Cricket Score Counter app or website and log in.</li>
          <li>
            Open the menu and choose <strong>Account Settings</strong>.
          </li>
          <li>
            Scroll to <strong>Delete account</strong> and tap{" "}
            <strong>Delete my account</strong>.
          </li>
          <li>
            Enter your password (if your account has one), type{" "}
            <strong>DELETE</strong>, and tap <strong>Delete forever</strong>.
          </li>
        </Box>

        <Typography component="h2" sx={contentHeading}>
          What gets deleted
        </Typography>
        <Typography sx={{ ...contentText, mb: 1 }}>
          Deletion is immediate and permanent. Your data is erased from our
          servers, not just hidden or deactivated, and it cannot be recovered:
        </Typography>
        <Box component="ul" sx={{ ...contentText, pl: 3, mt: 0, mb: 1.5 }}>
          {DELETED_DATA_ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </Box>
        <Typography sx={{ ...contentText, mb: 2.5 }}>
          Match data saved on the device you delete from is cleared at the same
          time. If you used other devices, clear the app's data or uninstall it
          there too.
        </Typography>

        <Typography component="h2" sx={contentHeading}>
          What isn't affected
        </Typography>
        <Box component="ul" sx={{ ...contentText, pl: 3, mt: 0, mb: 2.5 }}>
          <li>
            Matches you scored without logging in are stored only on your
            device. Clear the app's data or browser storage to remove them.
          </li>
          <li>
            Anonymous, aggregated usage statistics that can't identify you.
          </li>
          <li>
            Data held by Google for ads and analytics, which you can manage in
            your Google account settings.
          </li>
        </Box>

        <Typography component="h2" sx={contentHeading}>
          Can't log in?
        </Typography>
        <Typography sx={{ ...contentText, mb: 2.5 }}>
          Email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}?subject=Delete%20my%20account`}>
            {SUPPORT_EMAIL}
          </a>{" "}
          from the email address on your account with the subject "Delete my
          account". We'll delete the account and all of its data and reply to
          confirm. See our{" "}
          <RouterLink to="/privacy-policy">Privacy Policy</RouterLink> for more
          about how we handle data.
        </Typography>
      </ContentPageShell>
    </>
  );
};

export default DeleteAccountInfoPage;
