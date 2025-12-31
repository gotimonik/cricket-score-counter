import * as React from "react";
import AppBarMUI from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";
import {
  HistoryRounded,
  ReplayRounded,
  ShareRounded,
  MoreVert,
  ContentCopy,
} from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { APP_NAME } from "../utils/constant";

export default function AppBar({
  gameId,
  onReset,
  onShare,
  onShowHistory,
}: {
  gameId?: string;
  onReset?: () => void;
  onShare?: () => void;
  onShowHistory: () => void;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const handleCopyGameId = () => {
    if (gameId) {
      navigator.clipboard.writeText(gameId);
      setSnackbarOpen(true);
    }
  };
  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Box>
      <AppBarMUI
        position="static"
        sx={{
          background: "linear-gradient(90deg, #185a9d 0%, #43cea2 100%)",
          boxShadow: "0 4px 24px 0 #185a9d33",
          px: { xs: 0, sm: 0 },
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 1.5, sm: 3 },
            minHeight: { xs: 52, sm: 64 },
            width: "100%",
            maxWidth: 1200,
            mx: "auto",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              gap: { xs: 1, sm: 1 },
            }}
          >
            <Typography
              variant="h4"
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 900,
                color: "#fff",
                letterSpacing: 2,
                textShadow: "0 2px 12px #185a9d55",
                mr: { xs: 1, sm: 2 },
                fontSize: { xs: 17, sm: 28 },
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 1 },
                px: { xs: 0.5, sm: 1 },
                py: { xs: 0.5, sm: 1 },
                borderRadius: 3,
                background: "rgba(255,255,255,0.10)",
                boxShadow: "0 2px 16px 0 #185a9d33",
                backdropFilter: "blur(6px)",
                border: "1.5px solid #43cea2",
                transition: "background 0.3s",
                textDecoration: "none",
                cursor: "pointer",
                '&:hover': {
                  background: "rgba(255,255,255,0.18)",
                },
              }}
            >
              🏏 {APP_NAME}
            </Typography>
            {!isMobile && gameId && (
              <Box
                sx={{
                  px: { xs: 0.5, sm: 0.8 },
                  py: { xs: 0.2, sm: 0.8 },
                  borderRadius: 2.5,
                  background: "rgba(255,255,255,0.18)",
                  color: "#185a9d",
                  fontWeight: 800,
                  fontSize: { xs: 13, sm: 14 },
                  letterSpacing: 1,
                  boxShadow: "0 2px 12px 0 #43cea255",
                  display: "inline-flex",
                  alignItems: "center",
                  ml: 0,
                  border: "1.5px solid #43cea2",
                  backdropFilter: "blur(6px)",
                  transition: "background 0.3s",
                  gap: 0.5,
                }}
              >
                <span
                  style={{
                    opacity: 0.7,
                    fontWeight: 600,
                    marginRight: 4,
                    color: "#185a9d",
                    fontSize: "0.95em",
                  }}
                >
                  Game ID:
                </span>
                <span
                  style={{ fontWeight: 900, color: "#185a9d", fontSize: "1em", marginRight: 4 }}
                >
                  {gameId}
                </span>
                <Tooltip title="Copy Game ID">
                  <IconButton
                    size="small"
                    aria-label="copy-game-id"
                    onClick={handleCopyGameId}
                    sx={{ color: "#185a9d", p: 0.5 }}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {isMobile ? (
              <>
                <IconButton
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
                        "linear-gradient(135deg, #f8fffc 0%, #e0eafc 100%)",
                      boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
                      p: 0.5,
                      mt: 1,
                      "& .MuiMenuItem-root": {
                        borderRadius: 2,
                        mx: 0.5,
                        my: 0.5,
                        fontWeight: 600,
                        color: "#185a9d",
                        transition: "background 0.2s, color 0.2s",
                        "&:hover": {
                          background:
                            "linear-gradient(90deg, #43cea2 0%, #185a9d 100%)",
                          color: "#fff",
                        },
                      },
                    },
                  }}
                >
                  {gameId && (
                    <MenuItem
                      onClick={() => {
                        handleCopyGameId();
                        handleMenuClose();
                      }}
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <ContentCopy sx={{ mr: 1 }} fontSize="small" />
                      <span style={{ fontWeight: 700, color: '#185a9d', fontSize: 15 }}>Copy Game ID</span>
                      <span style={{ fontWeight: 900, color: '#185a9d', fontSize: 15, marginLeft: 8 }}>{gameId}</span>
                    </MenuItem>
                  )}
                  {onShare && (
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        onShare();
                      }}
                    >
                      <ShareRounded sx={{ mr: 1 }} /> Share Game
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      onShowHistory();
                    }}
                  >
                    <HistoryRounded sx={{ mr: 1 }} /> View History
                  </MenuItem>
                  {onReset && (
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        onReset();
                      }}
                    >
                      <ReplayRounded sx={{ mr: 1 }} /> Reset Game
                    </MenuItem>
                  )}
                </Menu>
              </>
            ) : (
              <>
                {onShare && (
                  <IconButton
                    aria-label="share"
                    sx={{ color: "white" }}
                    onClick={onShare}
                  >
                    <ShareRounded fontSize="large" />
                  </IconButton>
                )}
                <IconButton
                  aria-label="history"
                  sx={{ color: "white" }}
                  onClick={onShowHistory}
                >
                  <HistoryRounded fontSize="large" />
                </IconButton>
                {onReset && (
                  <IconButton
                    aria-label="reset"
                    sx={{ color: "white" }}
                    onClick={onReset}
                  >
                    <ReplayRounded fontSize="large" />
                  </IconButton>
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
        message="Game ID copied!"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        ContentProps={{ sx: { fontWeight: 600, fontSize: 16, color: '#185a9d', background: '#e0eafc' } }}
      />
    </Box>
  );
}
