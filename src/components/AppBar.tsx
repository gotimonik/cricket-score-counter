import * as React from "react";
import AppBarMUI from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import {
  HistoryRounded,
  ShareRounded,
  MoreVert,
  Home as HomeIcon,
  ContentCopy,
  SportsScore,
  GroupsRounded,
  RestartAlt,
  Leaderboard,
  Settings,
  TimerRounded,
  // SportsCricket,
  // FiberManualRecord,
  DownloadRounded,
  LoginRounded,
  LogoutRounded,
  SaveRounded,
  SportsCricketRounded,
  JoinInner,
  ManageAccountsRounded,
  InsightsRounded,
  CampaignRounded,
  StorageRounded,
  MenuBookRounded,
  TravelExploreRounded,
  SwapVertRounded,
  SportsBaseballRounded,
  EmojiEventsRounded,
  BadgeRounded,
  KeyboardArrowDownRounded,
} from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  ListSubheader,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";
import { useTranslation } from "react-i18next";
import AppLogo from "./AppLogo";
import AuthService from "../services/AuthService";
import { ADMIN_ANALYTICS_EMAIL } from "../utils/constant";
import NotificationBell from "./player/NotificationBell";
import { BOARD } from "../utils/brand";

// Loaded only when someone opens preferences from a game screen, so the
// AppBar (on every page) doesn't carry the whole settings UI.
// Profile menu styling: pavilion green and chalk, like the header.
const profileIconSx = {
  width: 32,
  height: 32,
  flexShrink: 0,
  borderRadius: 2,
  display: "grid",
  placeItems: "center",
  color: BOARD.green,
  background: "rgba(15,46,37,0.07)",
  "& svg": { fontSize: 18 },
} as const;
const profileRowSx = {
  mx: 1.25,
  my: 0.25,
  minHeight: 44,
  gap: 1.25,
  px: 1,
  borderRadius: 2.5,
  fontWeight: 700,
  fontSize: "calc(14.5px * var(--app-font-scale, 1))",
  color: "#1d2b26 !important",
  whiteSpace: "normal",
  "&:hover": { background: "rgba(15,46,37,0.06)" },
  "&.Mui-selected, &.Mui-selected:hover": {
    background: "rgba(15,46,37,0.09)",
    "& .profile-menu-icon": { background: BOARD.green, color: BOARD.chalk },
  },
} as const;
const profileTileSx = {
  my: 0.375,
  minHeight: 78,
  p: 1.25,
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 1,
  borderRadius: 3,
  fontWeight: 800,
  fontSize: "calc(13.5px * var(--app-font-scale, 1))",
  color: `${BOARD.green} !important`,
  background: "#fff",
  border: "1px solid rgba(15,46,37,0.1)",
  whiteSpace: "normal",
  "&:hover": { background: "#fff", borderColor: "rgba(15,46,37,0.3)" },
  "&.Mui-selected, &.Mui-selected:hover": {
    background: "#fff",
    borderColor: BOARD.green,
  },
} as const;
const profileSectionSx = {
  px: 2.25,
  pt: 1.5,
  pb: 0.5,
  lineHeight: 1.4,
  background: "transparent",
  fontWeight: 800,
  fontSize: "calc(12px * var(--app-font-scale, 1))",
  color: "#5f6b66",
} as const;

type AuthUser = {
  name?: string;
  email?: string;
  avatarUrl?: string;
  hasPassword?: boolean;
};

const LOCAL_MATCH_STATE_KEY = "cricket-match-state";

function isLocalMatchInProgress(): boolean {
  try {
    const raw = window.localStorage.getItem(LOCAL_MATCH_STATE_KEY);
    if (!raw) return false;
    const snapshot = JSON.parse(raw) as { winningTeam?: unknown };
    return !snapshot?.winningTeam;
  } catch {
    return false;
  }
}

export default function AppBar({
  gameId,
  showHomeMenuItem,
  onHomeNavigate,
  onReset,
  onShare,
  onShowHistory,
  onShowPlayerScorecard,
  onShowPlayerPreferences,
  onSaveMatch,
  onEndInning,
  onChangeOvers,
  onChangeBatters,
  onChangeBowler,
  onEndGame,
  confirmBeforeLeave = false,
  onLeaveGame,
}: {
  gameId?: string;
  showHomeMenuItem?: boolean;
  onHomeNavigate?: () => void;
  onReset?: () => void;
  onShare?: () => void;
  onShowHistory?: () => void;
  onShowPlayerScorecard?: () => void;
  onShowPlayerPreferences?: () => void;
  onSaveMatch?: () => void;
  onEndInning?: () => void;
  /** Only passed while the first innings is in progress. */
  onChangeOvers?: () => void;
  /** In-game: fix who is on strike / which batters are in. */
  onChangeBatters?: () => void;
  /** In-game: change the bowler (wrong pick, or can't finish the over). */
  onChangeBowler?: () => void;
  onEndGame?: () => void;
  /** True while a match is being scored: leaving the page would lose it,
   *  so any AppBar navigation asks first. */
  confirmBeforeLeave?: boolean;
  /** Called right before navigating away after the user confirms. */
  onLeaveGame?: () => void;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const profileOpen = Boolean(profileAnchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const { t } = useTranslation();
  const location = useLocation();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [confirmDialog, setConfirmDialog] = React.useState<{
    open: boolean;
    type: "endInning" | "endGame" | "logout" | null;
  }>({ open: false, type: null });
  const navigate = useNavigate();
  const [pendingNav, setPendingNav] = React.useState<{
    path: string;
    state?: unknown;
  } | null>(null);
  // All AppBar navigation goes through here so a live match is never lost
  // by accident (e.g. opening the Learn guides mid-game).
  const go = React.useCallback(
    (path: string, options?: { state?: unknown }) => {
      if (confirmBeforeLeave && path !== location.pathname) {
        setPendingNav({ path, state: options?.state });
        return;
      }
      navigate(path, options);
    },
    [confirmBeforeLeave, location.pathname, navigate],
  );
  const confirmPendingNav = () => {
    if (!pendingNav) return;
    const { path, state } = pendingNav;
    setPendingNav(null);
    onLeaveGame?.();
    navigate(path, state === undefined ? undefined : { state });
  };
  // Deterministic on first render (never read AuthService here) so it
  // matches the always-logged-out prerendered HTML exactly -- the effect
  // below (which already runs unconditionally on mount via
  // refreshAuthSession()) fills in the real, possibly-logged-in state right
  // after hydration. Reading AuthService synchronously in the initializer
  // used to make an already-logged-in user's very first render diverge from
  // the static markup (different AppBar buttons/menu), which is exactly
  // what triggers React hydration errors #418/#423 on page load.
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [authUser, setAuthUser] = React.useState<AuthUser | null>(null);
  const refreshAuthSession = React.useCallback(() => {
    setIsLoggedIn(AuthService.isLoggedIn());
    setAuthUser(AuthService.getUser());
  }, []);

  React.useEffect(() => {
    refreshAuthSession();
    return AuthService.subscribe(refreshAuthSession);
  }, [refreshAuthSession]);

  const userName =
    authUser?.name?.trim() ||
    authUser?.email?.trim().split("@")[0] ||
    t("Profile");
  // const isHomePage = location.pathname === "/";
  const isNativeWebView = React.useMemo(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return false;
    }
    const ua =
      navigator.userAgent || navigator.vendor || (window as any).opera || "";
    return (
      /wv|WebView|; wv\)|capacitor/i.test(ua) ||
      "ReactNativeWebView" in window ||
      "cordova" in window ||
      window.location.protocol === "capacitor:" ||
      ((window as any).Capacitor?.isNativePlatform?.() ?? false)
    );
  }, []);

  const handleCopyGameId = () => {
    if (gameId) {
      navigator.clipboard.writeText(gameId);
      setSnackbarOpen(true);
    }
  };
  const handleSnackbarClose = () => setSnackbarOpen(false);
  const handleHomeClick = () => {
    if (onHomeNavigate) {
      onHomeNavigate();
      return;
    }
    window.location.replace("/");
  };
  const handleDownloadAppClick = () => {
    go("/download-app");
  };
  const handleCreateGameClick = () => {
    handleProfileClose();
    go("/create-game");
  };
  const handleTournamentsClick = () => {
    handleProfileClose();
    go("/tournaments");
  };
  const handleMyPlayerClick = () => {
    handleProfileClose();
    go("/me");
  };
  const handleMyTeamsClick = () => {
    handleProfileClose();
    go("/my-teams");
  };
  const handleJoinGameClick = () => {
    handleProfileClose();
    go("/join-game");
  };
  const handleHistoryClick = () => {
    handleProfileClose();
    go("/match-history");
  };
  const isAnalyticsAdmin =
    isLoggedIn &&
    authUser?.email?.trim().toLowerCase() === ADMIN_ANALYTICS_EMAIL;
  const handleAnalyticsClick = () => {
    handleProfileClose();
    go("/admin/analytics");
  };
  const handleAdminDataClick = () => {
    handleProfileClose();
    go("/admin/data");
  };
  const handlePromoBannerClick = () => {
    handleProfileClose();
    go("/admin/promo-banner");
  };
  const handleAccountSettingsClick = () => {
    handleProfileClose();
    go("/account");
  };
  const handleLoginClick = () => {
    go("/login", { state: { next_redirect: location.pathname } });
  };
  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };
  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };
  const performLogout = React.useCallback(async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      // The local session is cleared even if the server call fails.
      console.error("Logout error", error);
    } finally {
      refreshAuthSession();
      // Always land on Home after logging out, from any screen. Uses
      // navigate directly (not `go`): an in-progress match was already
      // confirmed via the logout dialog.
      navigate("/", { replace: true });
    }
  }, [navigate, refreshAuthSession]);
  const handleLogoutClick = () => {
    handleProfileClose();
    if (isLocalMatchInProgress()) {
      setConfirmDialog({ open: true, type: "logout" });
      return;
    }
    void performLogout();
  };
  // const handleWebGames = () => {
  //   window.location.href = "https://games.playfantacy.com/";
  // };

  const profileControl = isLoggedIn ? (
    <>
      <NotificationBell />
      <Button
        data-ga-click="open_profile_menu_from_appbar"
        onClick={handleProfileClick}
        aria-haspopup="menu"
        aria-expanded={profileOpen}
        aria-controls={profileOpen ? "profile-menu" : undefined}
        aria-label={t("Account menu for {{name}}", { name: userName })}
        sx={{
          height: 40,
          minWidth: 0,
          p: { xs: 0, sm: "0 10px 0 4px" },
          width: { xs: 40, sm: "auto" },
          maxWidth: { xs: 40, sm: 200 },
          gap: 0.75,
          borderRadius: 999,
          textTransform: "none",
          fontWeight: 800,
          fontSize: "calc(13.5px * var(--app-font-scale, 1))",
          whiteSpace: "nowrap",
          color: "var(--app-header-icon-color, #fff)",
          background:
            "var(--app-header-icon-bg, linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%))",
          border: "var(--app-header-icon-border, 1px solid rgba(255,255,255,0.35))",
          boxShadow: profileOpen ? "0 0 0 3px rgba(217,180,90,0.28)" : "none",
          transition: "box-shadow 0.15s",
          "&:hover": {
            background:
              "var(--app-header-icon-bg, linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%))",
            boxShadow: "0 0 0 3px rgba(217,180,90,0.22)",
          },
          "&:focus-visible": { boxShadow: "0 0 0 3px rgba(217,180,90,0.5)" },
        }}
      >
        <Avatar
          src={authUser?.avatarUrl || undefined}
          alt={userName}
          imgProps={{ referrerPolicy: "no-referrer" }}
          sx={{
            width: { xs: 34, sm: 32 },
            height: { xs: 34, sm: 32 },
            flexShrink: 0,
            fontWeight: 900,
            fontSize: "calc(14px * var(--app-font-scale, 1))",
            color: BOARD.green,
            background: `linear-gradient(180deg, ${BOARD.goldLight} 0%, ${BOARD.gold} 100%)`,
            border: `2px solid ${BOARD.gold}`,
            boxSizing: "border-box",
          }}
        >
          {(userName || "?").trim().charAt(0).toUpperCase()}
        </Avatar>
        <Box
          component="span"
          sx={{
            display: { xs: "none", sm: "inline" },
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {userName}
        </Box>
        <KeyboardArrowDownRounded
          sx={{
            display: { xs: "none", sm: "block" },
            fontSize: 18,
            ml: -0.25,
            opacity: 0.8,
            transition: "transform 0.2s",
            transform: profileOpen ? "rotate(180deg)" : "none",
          }}
        />
      </Button>
      <Menu
        id="profile-menu"
        anchorEl={profileAnchorEl}
        open={profileOpen}
        onClose={handleProfileClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          className: "app-profile-menu",
          sx: {
            mt: 1,
            width: 300,
            maxWidth: "calc(100vw - 16px)",
            borderRadius: 4,
          },
        }}
        MenuListProps={{
          sx: {
            p: 0,
            pb: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 0.75,
            "& > *": { gridColumn: "1 / -1" },
            "& > .profile-menu-tile": { gridColumn: "auto" },
          },
        }}
      >
        <ListSubheader
          disableSticky
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            px: 2,
            py: 1.75,
            mb: 1,
            lineHeight: 1.3,
            color: BOARD.chalk,
            background: `radial-gradient(120% 160% at 0% 0%, #1a4638 0%, ${BOARD.green} 55%, ${BOARD.greenDeep} 100%)`,
            borderBottom: `3px solid ${BOARD.gold}`,
          }}
        >
          <Avatar
            src={authUser?.avatarUrl || undefined}
            alt={userName}
            imgProps={{ referrerPolicy: "no-referrer" }}
            sx={{
              width: 44,
              height: 44,
              fontWeight: 900,
              color: BOARD.green,
              background: `linear-gradient(180deg, ${BOARD.goldLight} 0%, ${BOARD.gold} 100%)`,
              boxShadow: `0 0 0 2px ${BOARD.gold}`,
            }}
          >
            {(userName || "?").trim().charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Box
              sx={{
                fontWeight: 900,
                fontSize: "calc(15px * var(--app-font-scale, 1))",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userName}
            </Box>
            {authUser?.email && (
              <Box
                sx={{
                  fontWeight: 600,
                  fontSize: "calc(12px * var(--app-font-scale, 1))",
                  color: "rgba(237,233,220,0.7)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {authUser.email}
              </Box>
            )}
          </Box>
        </ListSubheader>

        {/* Quick actions: the four things people open most, as tiles. */}
        {[
          { key: "create", ga: "open_create_game_from_profile", path: "/create-game", icon: <SportsCricketRounded />, label: t("Create Game"), onClick: handleCreateGameClick, featured: true },
          { key: "join", ga: "open_join_game_from_profile", path: "/join-game", icon: <JoinInner />, label: t("Join Game"), onClick: handleJoinGameClick },
          { key: "tournaments", ga: "open_tournaments_from_profile", path: "/tournaments", icon: <EmojiEventsRounded />, label: t("Tournaments"), onClick: handleTournamentsClick },
          { key: "history", ga: "open_match_history_from_profile", path: "/match-history", icon: <HistoryRounded />, label: t("History"), onClick: handleHistoryClick },
        ].map((tile, index) => (
          <MenuItem
            key={tile.key}
            className="profile-menu-tile"
            data-ga-click={tile.ga}
            selected={location.pathname.startsWith(tile.path)}
            onClick={tile.onClick}
            sx={{
              ...profileTileSx,
              ml: index % 2 === 0 ? 1.25 : 0,
              mr: index % 2 === 0 ? 0 : 1.25,
              ...(tile.featured
                ? {
                    background: `linear-gradient(180deg, ${BOARD.goldLight} 0%, ${BOARD.gold} 100%) !important`,
                    borderColor: "transparent",
                    "& .profile-menu-icon": { background: "rgba(255,255,255,0.55)" },
                  }
                : {}),
            }}
          >
            <Box className="profile-menu-icon" sx={profileIconSx}>
              {tile.icon}
            </Box>
            {tile.label}
          </MenuItem>
        ))}

        <ListSubheader disableSticky sx={profileSectionSx}>
          {t("You")}
        </ListSubheader>
        <MenuItem
          data-ga-click="open_my_player_from_profile"
          selected={location.pathname === "/me"}
          onClick={handleMyPlayerClick}
          sx={profileRowSx}
        >
          <Box className="profile-menu-icon" sx={profileIconSx}><BadgeRounded /></Box>
          {t("My player profile")}
        </MenuItem>
        <MenuItem
          data-ga-click="open_my_teams_from_profile"
          selected={location.pathname.startsWith("/my-teams")}
          onClick={handleMyTeamsClick}
          sx={profileRowSx}
        >
          <Box className="profile-menu-icon" sx={profileIconSx}><GroupsRounded /></Box>
          {t("My Teams")}
        </MenuItem>
        <MenuItem
          data-ga-click="open_explore_from_profile"
          selected={location.pathname.startsWith("/explore")}
          onClick={() => {
            handleProfileClose();
            go("/explore");
          }}
          sx={profileRowSx}
        >
          <Box className="profile-menu-icon" sx={profileIconSx}><TravelExploreRounded /></Box>
          {t("Explore players & tournaments")}
        </MenuItem>

        <ListSubheader disableSticky sx={profileSectionSx}>
          {t("More")}
        </ListSubheader>
        <MenuItem
          data-ga-click="open_learn_from_profile"
          selected={location.pathname.startsWith("/learn")}
          onClick={() => {
            handleProfileClose();
            go("/learn");
          }}
          sx={profileRowSx}
        >
          <Box className="profile-menu-icon" sx={profileIconSx}><MenuBookRounded /></Box>
          {t("Learn Cricket")}
        </MenuItem>
        <MenuItem
          data-ga-click="go_home_from_profile"
          onClick={() => {
            handleProfileClose();
            handleHomeClick();
          }}
          sx={profileRowSx}
        >
          <Box className="profile-menu-icon" sx={profileIconSx}><HomeIcon /></Box>
          {t("Home")}
        </MenuItem>

        {isAnalyticsAdmin && (
          <ListSubheader disableSticky sx={profileSectionSx}>
            {t("Admin")}
          </ListSubheader>
        )}
        {isAnalyticsAdmin && (
          <MenuItem
            data-ga-click="open_admin_analytics_from_profile"
            selected={location.pathname.startsWith("/admin/analytics")}
            onClick={handleAnalyticsClick}
            sx={profileRowSx}
          >
            <Box className="profile-menu-icon" sx={profileIconSx}><InsightsRounded /></Box>
            {t("Analytics")}
          </MenuItem>
        )}
        {isAnalyticsAdmin && (
          <MenuItem
            data-ga-click="open_admin_data_from_profile"
            selected={location.pathname.startsWith("/admin/data")}
            onClick={handleAdminDataClick}
            sx={profileRowSx}
          >
            <Box className="profile-menu-icon" sx={profileIconSx}><StorageRounded /></Box>
            {t("Platform data")}
          </MenuItem>
        )}
        {isAnalyticsAdmin && (
          <MenuItem
            data-ga-click="open_admin_promo_banner_from_profile"
            selected={location.pathname.startsWith("/admin/promo-banner")}
            onClick={handlePromoBannerClick}
            sx={profileRowSx}
          >
            <Box className="profile-menu-icon" sx={profileIconSx}><CampaignRounded /></Box>
            {t("Home Banner")}
          </MenuItem>
        )}

        <ListSubheader
          disableSticky
          aria-hidden
          sx={{ mx: 2, my: 1, height: "1px", lineHeight: 0, p: 0, background: "rgba(15,46,37,0.12)" }}
        />
        <MenuItem
          data-ga-click="open_account_settings_from_profile"
          selected={location.pathname.startsWith("/account")}
          onClick={handleAccountSettingsClick}
          sx={profileRowSx}
        >
          <Box className="profile-menu-icon" sx={profileIconSx}><ManageAccountsRounded /></Box>
          {t("Account Settings")}
        </MenuItem>
        <MenuItem
          data-ga-click="logout_from_appbar"
          onClick={handleLogoutClick}
          sx={{
            ...profileRowSx,
            color: "#9b2c22 !important",
            "& .profile-menu-icon": { background: "#fbecea", color: "#9b2c22" },
            "&:hover": { background: "#fbecea" },
          }}
        >
          <Box className="profile-menu-icon" sx={profileIconSx}><LogoutRounded /></Box>
          {t("Logout")}
        </MenuItem>
      </Menu>
    </>
  ) : null;

  return (
    <Box>
      <AppBarMUI
        position="static"
        sx={{
          pt: "var(--app-safe-top, env(safe-area-inset-top, 0px))",
          background:
            "var(--app-appbar-gradient, linear-gradient(90deg, var(--app-accent-end, #185a9d) 0%, var(--app-accent-start, #43cea2) 100%))",
          boxShadow:
            "0 4px 24px 0 color-mix(in srgb, var(--app-accent-end, #185a9d) 30%, transparent 70%)",
          borderBottom: "var(--app-appbar-border, none)",
          px: { xs: 0, sm: 0 },
          width: "100%",
          left: 0,
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 1.25, sm: 3 },
            minHeight: { xs: 64, sm: 72 },
            width: "100%",
            mx: 0,
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              gap: { xs: 1, sm: 1 },
              minWidth: 0,
            }}
          >
            {/* Use MUI Link and useNavigate for redirection */}
            <Link
              underline="none"
              sx={{
                fontSize: {
                  xs: "calc(17px * var(--app-font-scale, 1))",
                  sm: "calc(28px * var(--app-font-scale, 1))",
                },
                display: "flex",
                alignItems: "center",
                width: "auto",
                minWidth: 0,
                mr: 0,
                textDecoration: "none",
                backgroundColor: "transparent",
                boxShadow: "none",
              }}
            >
              <AppLogo size="clamp(44px, 9vw, 54px)" />
            </Link>
          </Box>
          {/* {!gameId && (
            <Box
              role="button"
              tabIndex={0}
              data-ga-click="open_create_game_from_appbar"
              onClick={handleCreateGameClick}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleCreateGameClick();
                }
              }}
              sx={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 0.7,
                px: { xs: 0.9, sm: 1.2 },
                py: 0.45,
                borderRadius: 99,
                border: "1px solid rgba(255,255,255,0.28)",
                background:
                  "linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
                whiteSpace: "nowrap",
                animation: "homeTickerCentered 0.55s ease-out",
                maxWidth: { sm: "calc(100% - 260px)", md: 280 },
                overflow: "hidden",
                cursor: "pointer",
                transition:
                  "transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
                zIndex: 1,
                "&:hover": {
                  transform: "translateX(-50%) translateY(-1px)",
                  background:
                    "linear-gradient(120deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.12) 100%)",
                  boxShadow:
                    "0 8px 20px rgba(8, 26, 56, 0.24), inset 0 1px 0 rgba(255,255,255,0.2)",
                },
                "&:focus-visible": {
                  outline: "2px solid rgba(255,255,255,0.85)",
                  outlineOffset: "2px",
                },
              }}
            >
              <FiberManualRecord
                sx={{
                  fontSize: 10,
                  color: "#ff4d4f",
                  animation: "homePing 1.6s infinite",
                }}
              />
              <SportsCricket
                sx={{ fontSize: 17, color: "#fff", opacity: 0.95 }}
              />
              <Box
                component="span"
                sx={{
                  color: "#fff",
                  fontWeight: 800,
                  letterSpacing: 0.2,
                  fontSize: {
                    xs: "calc(10.5px * var(--app-font-scale, 1))",
                    sm: "calc(12px * var(--app-font-scale, 1))",
                  },
                  textShadow: "0 1px 2px rgba(0,0,0,0.22)",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {t("Live Local Matches")}
              </Box>
            </Box>
          )} */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.75, sm: 1.5 },
              ml: "auto",
              flexShrink: 0,
            }}
          >
            {profileControl}
            {gameId ? (
              <>
                <IconButton
                  data-ga-click="go_home_from_game"
                  color="inherit"
                  onClick={handleHomeClick}
                  sx={{
                    background:
                      "var(--app-header-icon-bg, linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%))",
                    border: "var(--app-header-icon-border, none)",
                    color: "var(--app-header-icon-color, #fff)",
                    borderRadius: 2,
                  }}
                >
                  <HomeIcon fontSize="medium" />
                </IconButton>
                <IconButton
                  data-ga-click="open_appbar_menu"
                  aria-label="actions"
                  aria-controls={open ? "appbar-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleMenuClick}
                  sx={{ color: "white" }}
                >
                  <MoreVert fontSize="large" />
                </IconButton>
                <Menu
                  id="appbar-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    sx: {
                      borderRadius: 3,
                      minWidth: 180,
                      background:
                        "linear-gradient(135deg, #f8fffc 0%, color-mix(in srgb, var(--app-accent-start, #43cea2) 16%, #e0eafc 84%) 100%)",
                      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
                      p: 0.5,
                      mt: 1,
                      "& .MuiMenuItem-root": {
                        borderRadius: 2,
                        mx: 0.5,
                        my: 0.5,
                        fontWeight: 600,
                        color: "var(--app-accent-text, #185a9d)",
                        transition: "background 0.2s, color 0.2s",
                        "&:hover": {
                          background:
                            "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                          color: "#fff",
                        },
                      },
                    },
                  }}
                >
                  {gameId && (
                    <MenuItem
                      data-ga-click="copy_game_id"
                      onClick={() => {
                        handleCopyGameId();
                        handleMenuClose();
                      }}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <ContentCopy sx={{ mr: 1 }} fontSize="small" />
                      <span
                        style={{
                          fontWeight: 700,
                          color: "var(--app-accent-text, #185a9d)",
                          fontSize: "calc(15px * var(--app-font-scale, 1))",
                        }}
                      >
                        {t("Copy Game ID")}
                      </span>
                      <span
                        style={{
                          fontWeight: 900,
                          color: "var(--app-accent-text, #185a9d)",
                          fontSize: "calc(15px * var(--app-font-scale, 1))",
                          marginLeft: 8,
                        }}
                      >
                        {gameId}
                      </span>
                    </MenuItem>
                  )}
                  {onShare && (
                    <MenuItem
                      data-ga-click="share_game_menu"
                      onClick={() => {
                        handleMenuClose();
                        onShare();
                      }}
                    >
                      <ShareRounded sx={{ mr: 1 }} /> {t("Share Game")}
                    </MenuItem>
                  )}
                  {onChangeBatters && (
                    <MenuItem
                      data-ga-click="change_batters_menu"
                      onClick={() => {
                        handleMenuClose();
                        onChangeBatters();
                      }}
                    >
                      <SwapVertRounded sx={{ mr: 1 }} /> {t("Change batters")}
                    </MenuItem>
                  )}
                  {onChangeBowler && (
                    <MenuItem
                      data-ga-click="change_bowler_menu"
                      onClick={() => {
                        handleMenuClose();
                        onChangeBowler();
                      }}
                    >
                      <SportsBaseballRounded sx={{ mr: 1 }} /> {t("Change bowler")}
                    </MenuItem>
                  )}
                  {onChangeOvers && (
                    <MenuItem
                      data-ga-click="change_overs_menu"
                      onClick={() => {
                        handleMenuClose();
                        onChangeOvers();
                      }}
                    >
                      <TimerRounded sx={{ mr: 1 }} /> {t("Change Overs")}
                    </MenuItem>
                  )}
                  {onEndInning && (
                    <MenuItem
                      data-ga-click="end_inning_menu"
                      onClick={() => {
                        handleMenuClose();
                        setConfirmDialog({ open: true, type: "endInning" });
                      }}
                    >
                      <SportsScore sx={{ mr: 1 }} /> {t("End Inning")}
                    </MenuItem>
                  )}
                  {onEndGame && (
                    <MenuItem
                      data-ga-click="end_game_menu"
                      onClick={() => {
                        handleMenuClose();
                        setConfirmDialog({ open: true, type: "endGame" });
                      }}
                    >
                      <SportsScore sx={{ mr: 1 }} /> {t("End Game")}
                    </MenuItem>
                  )}
                  {onShowHistory && (
                    <MenuItem
                      data-ga-click="view_history_menu"
                      onClick={() => {
                        handleMenuClose();
                        onShowHistory();
                      }}
                    >
                      <HistoryRounded sx={{ mr: 1 }} /> {t("View History")}
                    </MenuItem>
                  )}
                  {onSaveMatch && (
                    <MenuItem
                      data-ga-click="save_match_menu"
                      onClick={() => {
                        handleMenuClose();
                        onSaveMatch();
                      }}
                    >
                      <SaveRounded sx={{ mr: 1 }} /> {t("Save Match")}
                    </MenuItem>
                  )}
                  {onShowPlayerScorecard && (
                    <MenuItem
                      data-ga-click="player_scorecard_menu"
                      onClick={() => {
                        handleMenuClose();
                        onShowPlayerScorecard();
                      }}
                    >
                      <Leaderboard sx={{ mr: 1 }} /> {t("Scorecard")}
                    </MenuItem>
                  )}
                  {onShowPlayerPreferences && (
                    <MenuItem
                      data-ga-click="player_preferences_menu"
                      onClick={() => {
                        handleMenuClose();
                        onShowPlayerPreferences();
                      }}
                    >
                      <Settings sx={{ mr: 1 }} /> {t("Player Preferences")}
                    </MenuItem>
                  )}
                  {onReset && (
                    <MenuItem
                      data-ga-click="reset_game_menu"
                      onClick={() => {
                        handleMenuClose();
                        onReset();
                      }}
                    >
                      <RestartAlt sx={{ mr: 1 }} /> {t("Reset Game")}
                    </MenuItem>
                  )}
                  <MenuItem
                    data-ga-click="open_learn_menu"
                    onClick={() => {
                      handleMenuClose();
                      go("/learn");
                    }}
                  >
                    <MenuBookRounded sx={{ mr: 1 }} /> {t("Learn Cricket")}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                {!isLoggedIn && (
                  <Button
                    data-ga-click="open_login_from_appbar"
                    onClick={handleLoginClick}
                    variant="contained"
                    size="small"
                    startIcon={
                      <LoginRounded sx={{ fontSize: { xs: 16, sm: 18 } }} />
                    }
                    sx={{
                      minWidth: { xs: 0, sm: 98 },
                      height: { xs: 34, sm: 42 },
                      px: { xs: 1.05, sm: 1.6 },
                      borderRadius: 99,
                      fontWeight: 900,
                      fontSize: {
                        xs: "calc(10px * var(--app-font-scale, 1))",
                        sm: "calc(13px * var(--app-font-scale, 1))",
                      },
                      textTransform: "none",
                      color: "var(--app-chip-text, #08314d)",
                      background:
                        "var(--app-chip-bg, linear-gradient(135deg, #ffffff 0%, #d6ffef 42%, #f0fff8 100%))",
                      border: "var(--app-chip-border, 1px solid rgba(216,255,243,0.95))",
                      whiteSpace: "nowrap",
                      "& .MuiButton-startIcon": {
                        marginRight: { xs: 0, sm: 0.7 },
                        marginLeft: 0,
                      },
                      // Keep the text colour on hover: the theme's default
                      // button hover turns it grey.
                      "&:hover": {
                        background:
                          "var(--app-chip-bg-hover, linear-gradient(135deg, #ffffff 0%, #e5fff4 42%, #f5fffb 100%))",
                        color: "var(--app-chip-text, #08314d)",
                        boxShadow: "0 0 0 3px rgba(217,180,90,0.25)",
                      },
                    }}
                  >
                    <Box component="span">Login</Box>
                  </Button>
                )}
                {!isNativeWebView && (
                  <>
                    <Button
                      data-ga-click="open_download_app_from_appbar"
                      onClick={handleDownloadAppClick}
                      variant="contained"
                      size="small"
                      startIcon={
                        <DownloadRounded
                          sx={{ fontSize: { xs: 16, sm: 18 } }}
                        />
                      }
                      sx={{
                        minWidth: { xs: 0, sm: 156 },
                        height: { xs: 34, sm: 42 },
                        px: { xs: 1.05, sm: 1.9 },
                        borderRadius: 99,
                        fontWeight: 900,
                        fontSize: {
                          xs: "calc(10px * var(--app-font-scale, 1))",
                          sm: "calc(13px * var(--app-font-scale, 1))",
                        },
                        letterSpacing: 0.2,
                        textTransform: "none",
                        color: "var(--app-cta-text, #08314d)",
                        background:
                          "var(--app-cta-bg, linear-gradient(135deg, #ffffff 0%, #d6ffef 28%, #8af8d3 68%, #f0fff8 100%))",
                        boxShadow: "var(--app-cta-shadow, 0 10px 22px rgba(88, 245, 188, 0.32))",
                        border: "var(--app-chip-border, 1px solid rgba(216,255,243,0.95))",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        "& .MuiButton-startIcon": {
                          marginRight: { xs: 0, sm: 0.8 },
                          marginLeft: 0,
                        },
                        "&:hover": {
                          background:
                            "var(--app-cta-bg-hover, linear-gradient(135deg, #ffffff 0%, #e5fff4 28%, #9afad9 68%, #f5fffb 100%))",
                          boxShadow: "var(--app-cta-shadow-hover, 0 12px 24px rgba(88, 245, 188, 0.38))",
                          color: "var(--app-cta-text, #08314d)",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      <Box
                        component="span"
                        sx={{ display: { xs: "inline", sm: "none" } }}
                      >
                        Get App
                      </Box>
                      <Box
                        component="span"
                        sx={{ display: { xs: "none", sm: "inline" } }}
                      >
                        Download App
                      </Box>
                    </Button>
                    {/* <Button
                      data-ga-click="open_web_games_from_appbar"
                      onClick={handleWebGames}
                      variant="contained"
                      size="small"
                      startIcon={
                        <MoveUp sx={{ fontSize: { xs: 16, sm: 18 } }} />
                      }
                      sx={{
                        minWidth: { xs: 0, sm: 156 },
                        height: { xs: 34, sm: 42 },
                        px: { xs: 1.05, sm: 1.9 },
                        borderRadius: 99,
                        fontWeight: 900,
                        fontSize: {
                          xs: "calc(10px * var(--app-font-scale, 1))",
                          sm: "calc(13px * var(--app-font-scale, 1))",
                        },
                        letterSpacing: 0.2,
                        textTransform: "none",
                        color: "var(--app-cta-text, #08314d)",
                        background:
                          "var(--app-cta-bg, linear-gradient(135deg, #ffffff 0%, #d6ffef 28%, #8af8d3 68%, #f0fff8 100%))",
                        boxShadow: "var(--app-cta-shadow, 0 10px 22px rgba(88, 245, 188, 0.32))",
                        border: "var(--app-chip-border, 1px solid rgba(216,255,243,0.95))",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        "& .MuiButton-startIcon": {
                          marginRight: { xs: 0, sm: 0.8 },
                          marginLeft: 0,
                        },
                        "&:hover": {
                          background:
                            "var(--app-cta-bg-hover, linear-gradient(135deg, #ffffff 0%, #e5fff4 28%, #9afad9 68%, #f5fffb 100%))",
                          boxShadow: "var(--app-cta-shadow-hover, 0 12px 24px rgba(88, 245, 188, 0.38))",
                          color: "var(--app-cta-text, #08314d)",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      <Box component="span">Web Games</Box>
                    </Button> */}
                  </>
                )}
                {showHomeMenuItem && (
                  <Tooltip title={t("Home")}>
                    <IconButton
                      data-ga-click="go_home"
                      aria-label="home"
                      sx={{
                        background:
                          "var(--app-header-icon-bg, linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%))",
                        border: "var(--app-header-icon-border, none)",
                        color: "var(--app-header-icon-color, #fff)",
                        borderRadius: 2,
                      }}
                      onClick={() => handleHomeClick()}
                    >
                      <HomeIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                )}
                {onShare && (
                  <Tooltip title={t("Share Game")}>
                    <IconButton
                      data-ga-click="share_game"
                      aria-label="share"
                      sx={{ color: "white" }}
                      onClick={onShare}
                    >
                      <ShareRounded fontSize="large" />
                    </IconButton>
                  </Tooltip>
                )}
                {gameId && (
                  <Tooltip title={t("View History")}>
                    <IconButton
                      data-ga-click="view_history"
                      aria-label="history"
                      sx={{ color: "white" }}
                      onClick={onShowHistory}
                    >
                      <HistoryRounded fontSize="large" />
                    </IconButton>
                  </Tooltip>
                )}
                {onReset && (
                  <Tooltip title={t("Reset Game")}>
                    <IconButton
                      data-ga-click="reset_game"
                      aria-label="reset"
                      sx={{ color: "white" }}
                      onClick={onReset}
                    >
                      <RestartAlt fontSize="large" />
                    </IconButton>
                  </Tooltip>
                )}
                {onSaveMatch && (
                  <Tooltip title={t("Save Match")}>
                    <IconButton
                      data-ga-click="save_match"
                      aria-label="save-match"
                      sx={{ color: "white" }}
                      onClick={onSaveMatch}
                    >
                      <SaveRounded fontSize="large" />
                    </IconButton>
                  </Tooltip>
                )}
                {onShowPlayerScorecard && (
                  <Tooltip title={t("Scorecard")}>
                    <IconButton
                      data-ga-click="player_scorecard"
                      aria-label="player-scorecard"
                      sx={{ color: "white" }}
                      onClick={onShowPlayerScorecard}
                    >
                      <Leaderboard fontSize="large" />
                    </IconButton>
                  </Tooltip>
                )}
                {onShowPlayerPreferences && (
                  <Tooltip title={t("Player Preferences")}>
                    <IconButton
                      data-ga-click="player_preferences"
                      aria-label="player-preferences"
                      sx={{ color: "white" }}
                      onClick={onShowPlayerPreferences}
                    >
                      <Settings fontSize="large" />
                    </IconButton>
                  </Tooltip>
                )}
                {onChangeOvers && (
                  <Tooltip title={t("Change Overs")}>
                    <IconButton
                      data-ga-click="change_overs"
                      aria-label="change-overs"
                      sx={{ color: "white" }}
                      onClick={onChangeOvers}
                    >
                      <TimerRounded fontSize="large" />
                    </IconButton>
                  </Tooltip>
                )}
                {onEndInning && (
                  <Tooltip title={t("End Inning")}>
                    <IconButton
                      data-ga-click="end_inning"
                      aria-label="end-inning"
                      sx={{ color: "white" }}
                      onClick={() =>
                        setConfirmDialog({ open: true, type: "endInning" })
                      }
                    >
                      <SportsScore fontSize="large" />
                    </IconButton>
                  </Tooltip>
                )}
                {onEndGame && (
                  <Tooltip title={t("End Game")}>
                    <IconButton
                      data-ga-click="end_game"
                      aria-label="end-game"
                      sx={{ color: "white" }}
                      onClick={() =>
                        setConfirmDialog({ open: true, type: "endGame" })
                      }
                    >
                      <SportsScore fontSize="large" />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            )}
          </Box>
        </Toolbar>
      </AppBarMUI>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1800}
        onClose={handleSnackbarClose}
        message={t("Game ID copied!")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        ContentProps={{
          sx: {
            fontWeight: 600,
            fontSize: "calc(16px * var(--app-font-scale, 1))",
            color: "var(--app-accent-text, #185a9d)",
            background:
              "color-mix(in srgb, var(--app-accent-start, #43cea2) 18%, #e0eafc 82%)",
          },
        }}
      />
      <ConfirmDialog
        open={confirmDialog.open}
        title={
          confirmDialog.type === "endInning"
            ? t("End Inning?")
            : confirmDialog.type === "logout"
              ? t("Match In Progress")
              : t("End Game?")
        }
        content={
          confirmDialog.type === "endInning"
            ? t(
                "Are you sure you want to end the current inning? This action cannot be undone.",
              )
            : confirmDialog.type === "logout"
              ? t(
                  "You have a match currently in progress. Logging out now will not end or lose your match, but you'll need to log back in to save or resume it. Do you want to log out anyway?",
                )
              : t(
                  "Are you sure you want to end the game? This will reset all progress.",
                )
        }
        onClose={() => setConfirmDialog({ open: false, type: null })}
        onConfirm={() => {
          const type = confirmDialog.type;
          setConfirmDialog({ open: false, type: null });
          if (type === "endInning" && onEndInning) onEndInning();
          if (type === "endGame" && onEndGame) onEndGame();
          if (type === "logout") void performLogout();
        }}
        confirmText={confirmDialog.type === "logout" ? t("Logout") : t("Yes")}
        cancelText={t("Cancel")}
      />

      {/* Leaving a live match from the AppBar menu */}
      <Dialog
        open={Boolean(pendingNav)}
        onClose={() => setPendingNav(null)}
        disableScrollLock
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "linear-gradient(135deg, #f8fffc 0%, #e0eafc 100%)",
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: 900, color: "var(--app-accent-text, #185a9d)" }}
        >
          {t("Leave the current game?")}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "var(--app-accent-text, #185a9d)", lineHeight: 1.6 }}>
            {t(
              "Your match is still in progress. If you leave this screen, the live game ends and the score here can't be continued.",
            )}
          </Typography>
          {pendingNav?.path.startsWith("/learn") && !isNativeWebView ? (
            <Typography
              sx={{
                mt: 1.5,
                color: "var(--app-accent-text, #185a9d)",
                opacity: 0.85,
                fontSize: "calc(14px * var(--app-font-scale, 1))",
              }}
            >
              {t("Tip: open the guides in a new tab to keep scoring here.")}
            </Typography>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1, flexWrap: "wrap" }}>
          {pendingNav?.path.startsWith("/learn") && !isNativeWebView ? (
            <Button
              data-ga-click="open_learn_new_tab_during_game"
              onClick={() => {
                window.open(pendingNav.path, "_blank", "noopener");
                setPendingNav(null);
              }}
              sx={{ textTransform: "none", fontWeight: 700, mr: "auto" }}
            >
              {t("Open in new tab")}
            </Button>
          ) : null}
          <Button
            data-ga-click="stay_in_game"
            variant="contained"
            onClick={() => setPendingNav(null)}
            sx={{
              textTransform: "none",
              fontWeight: 800,
              borderRadius: 999,
              color: "#fff",
              background:
                "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
            }}
          >
            {t("Stay in game")}
          </Button>
          <Button
            data-ga-click="leave_game_confirmed"
            onClick={confirmPendingNav}
            sx={{ textTransform: "none", fontWeight: 700, color: "#c62828" }}
          >
            {t("Leave game")}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
