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
  Tune,
  // SportsCricket,
  // FiberManualRecord,
  DownloadRounded,
  LoginRounded,
  AccountCircleRounded,
  LogoutRounded,
  SaveRounded,
  MoveUp,
  SportsCricketRounded,
  JoinInner,
} from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Avatar, Button, Link } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";
import { useTranslation } from "react-i18next";
import AppLogo from "./AppLogo";
import AuthService from "../services/AuthService";

type AuthUser = {
  name?: string;
  email?: string;
  avatarUrl?: string;
};

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
  onEndGame,
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
  onEndGame?: () => void;
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
    type: "endInning" | "endGame" | null;
  }>({ open: false, type: null });
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = React.useState(() =>
    AuthService.isLoggedIn(),
  );
  const [authUser, setAuthUser] = React.useState<AuthUser | null>(() =>
    AuthService.getUser(),
  );
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
  const handleAppPreferencesClick = () => {
    navigate("/app-preferences");
  };
  const handleDownloadAppClick = () => {
    navigate("/download-app");
  };
  const handleCreateGameClick = () => {
    handleProfileClose();
    navigate("/create-game");
  };
  const handleTournamentsClick = () => {
    handleProfileClose();
    navigate("/tournaments");
  };
  const handleMyTeamsClick = () => {
    handleProfileClose();
    navigate("/my-teams");
  };
  const handleJoinGameClick = () => {
    handleProfileClose();
    navigate("/join-game");
  };
  const handleHistoryClick = () => {
    handleProfileClose();
    navigate("/match-history");
  };
  const handleLoginClick = () => {
    navigate("/login", { state: { next_redirect: location.pathname } });
  };
  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };
  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };
  const handleLogoutClick = async () => {
    handleProfileClose();
    await AuthService.logout();
    refreshAuthSession();
  };
  const handleWebGames = () => {
    window.location.href = "https://games.playfantacy.com/";
  };

  const profileControl = isLoggedIn ? (
    <>
      <Button
        data-ga-click="open_profile_menu_from_appbar"
        onClick={handleProfileClick}
        variant="contained"
        size="small"
        startIcon={
          authUser?.avatarUrl ? (
            <Avatar
              src={authUser?.avatarUrl}
              alt={userName}
              sx={{
                width: 24,
                height: 24,
              }}
              imgProps={{
                referrerPolicy: "no-referrer",
              }}
            />
          ) : (
            <AccountCircleRounded sx={{ fontSize: { xs: 20, sm: 20 } }} />
          )
        }
        sx={{
          minWidth: { xs: 40, sm: 118 },
          maxWidth: { xs: 118, sm: 180 },
          height: { xs: 40, sm: 40 },
          px: { xs: 1.05, sm: 1.55 },
          fontWeight: 900,
          fontSize: {
            xs: "calc(10px * var(--app-font-scale, 1))",
            sm: "calc(13px * var(--app-font-scale, 1))",
          },
          textTransform: "none",
          color: "#08314d",
          background:
            "linear-gradient(135deg, #ffffff 0%, #d6ffef 42%, #f0fff8 100%)",
          border: "1px solid rgba(216,255,243,0.95)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          "& .MuiButton-startIcon": {
            marginRight: { xs: 0, sm: 0.7 },
            marginLeft: 0,
          },
          "&:hover": {
            background:
              "linear-gradient(135deg, #ffffff 0%, #e5fff4 42%, #f5fffb 100%)",
          },
        }}
      >
        <Box
          component="span"
          sx={{
            display: { xs: "none", sm: "inline" },
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {userName}
        </Box>
      </Button>
      <Menu
        id="profile-menu"
        anchorEl={profileAnchorEl}
        open={profileOpen}
        onClose={handleProfileClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 190,
            mt: 1,
            p: 0.5,
            background:
              "linear-gradient(135deg, #f8fffc 0%, color-mix(in srgb, var(--app-accent-start, #43cea2) 16%, #e0eafc 84%) 100%)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
            "& .MuiMenuItem-root": {
              borderRadius: 2,
              mx: 0.5,
              my: 0.5,
              fontWeight: 700,
              color: "var(--app-accent-text, #185a9d)",
            },
          },
        }}
      >
        <MenuItem disabled sx={{ opacity: "1 !important" }}>
          {authUser?.avatarUrl ? (
            <Avatar
              src={authUser?.avatarUrl}
              alt={userName}
              sx={{
                width: 24,
                height: 24,
                mr: 1,
              }}
            />
          ) : (
            <AccountCircleRounded sx={{ fontSize: { xs: 20, sm: 20 }, mr: 1 }} />
          )}
          <Box sx={{ minWidth: 0 }}>
            <Box
              sx={{
                fontWeight: 900,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {userName}
            </Box>
            {authUser?.email && (
              <Box
                sx={{
                  fontSize: "calc(12px * var(--app-font-scale, 1))",
                  opacity: 0.72,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {authUser.email}
              </Box>
            )}
          </Box>
        </MenuItem>
        <MenuItem
          data-ga-click="open_create_game_from_profile"
          onClick={handleCreateGameClick}
        >
          <SportsCricketRounded sx={{ mr: 1 }} fontSize="small" />
          {t("Create Game")}
        </MenuItem>
        <MenuItem
          data-ga-click="open_tournaments_from_profile"
          onClick={handleTournamentsClick}
        >
          <SportsScore sx={{ mr: 1 }} fontSize="small" />
          {t("Tournaments")}
        </MenuItem>
        <MenuItem
          data-ga-click="open_my_teams_from_profile"
          onClick={handleMyTeamsClick}
        >
          <GroupsRounded sx={{ mr: 1 }} fontSize="small" />
          {t("My Teams")}
        </MenuItem>
        <MenuItem
          data-ga-click="open_join_game_from_profile"
          onClick={handleJoinGameClick}
        >
          <JoinInner sx={{ mr: 1 }} fontSize="small" />
          {t("Join Game")}
        </MenuItem>
        <MenuItem
          data-ga-click="open_match_history_from_profile"
          onClick={handleHistoryClick}
        >
          <HistoryRounded sx={{ mr: 1 }} fontSize="small" />
          {t("History")}
        </MenuItem>
        <MenuItem
          data-ga-click="logout_from_appbar"
          onClick={handleLogoutClick}
        >
          <LogoutRounded sx={{ mr: 1 }} fontSize="small" />
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
                      "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                    color: "#fff",
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
                    data-ga-click="open_app_preferences_menu"
                    onClick={() => {
                      handleMenuClose();
                      handleAppPreferencesClick();
                    }}
                  >
                    <Tune sx={{ mr: 1 }} /> {t("App Preferences")}
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
                      color: "#08314d",
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #d6ffef 42%, #f0fff8 100%)",
                      border: "1px solid rgba(216,255,243,0.95)",
                      whiteSpace: "nowrap",
                      "& .MuiButton-startIcon": {
                        marginRight: { xs: 0, sm: 0.7 },
                        marginLeft: 0,
                      },
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #ffffff 0%, #e5fff4 42%, #f5fffb 100%)",
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
                        color: "#08314d",
                        background:
                          "linear-gradient(135deg, #ffffff 0%, #d6ffef 28%, #8af8d3 68%, #f0fff8 100%)",
                        boxShadow: "0 10px 22px rgba(88, 245, 188, 0.32)",
                        border: "1px solid rgba(216,255,243,0.95)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        "& .MuiButton-startIcon": {
                          marginRight: { xs: 0, sm: 0.8 },
                          marginLeft: 0,
                        },
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #ffffff 0%, #e5fff4 28%, #9afad9 68%, #f5fffb 100%)",
                          boxShadow: "0 12px 24px rgba(88, 245, 188, 0.38)",
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
                    <Button
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
                        color: "#08314d",
                        background:
                          "linear-gradient(135deg, #ffffff 0%, #d6ffef 28%, #8af8d3 68%, #f0fff8 100%)",
                        boxShadow: "0 10px 22px rgba(88, 245, 188, 0.32)",
                        border: "1px solid rgba(216,255,243,0.95)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        "& .MuiButton-startIcon": {
                          marginRight: { xs: 0, sm: 0.8 },
                          marginLeft: 0,
                        },
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #ffffff 0%, #e5fff4 28%, #9afad9 68%, #f5fffb 100%)",
                          boxShadow: "0 12px 24px rgba(88, 245, 188, 0.38)",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      <Box component="span">Web Games</Box>
                    </Button>
                  </>
                )}
                {showHomeMenuItem && (
                  <Tooltip title={t("Home")}>
                    <IconButton
                      data-ga-click="go_home"
                      aria-label="home"
                      sx={{
                        background:
                          "linear-gradient(90deg, var(--app-accent-start, #43cea2) 0%, var(--app-accent-end, #185a9d) 100%)",
                        color: "#fff",
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
                <Tooltip title={t("App Preferences")}>
                  <IconButton
                    data-ga-click="open_app_preferences"
                    aria-label="app-preferences"
                    sx={{ color: "white", p: { xs: 0.8, sm: 1 } }}
                    onClick={handleAppPreferencesClick}
                  >
                    <Tune fontSize="large" />
                  </IconButton>
                </Tooltip>
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
          confirmDialog.type === "endInning" ? t("End Inning?") : t("End Game?")
        }
        content={
          confirmDialog.type === "endInning"
            ? t(
                "Are you sure you want to end the current inning? This action cannot be undone.",
              )
            : t(
                "Are you sure you want to end the game? This will reset all progress.",
              )
        }
        onClose={() => setConfirmDialog({ open: false, type: null })}
        onConfirm={() => {
          setConfirmDialog({ open: false, type: null });
          if (confirmDialog.type === "endInning" && onEndInning) onEndInning();
          if (confirmDialog.type === "endGame" && onEndGame) onEndGame();
        }}
        confirmText={t("Yes")}
        cancelText={t("Cancel")}
      />
    </Box>
  );
}
