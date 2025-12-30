import * as React from "react";
import AppBarMUI from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  HistoryRounded,
  ReplayRounded,
  ShareRounded,
} from "@mui/icons-material";
import { APP_NAME } from "../utils/constant";

export default function AppBar({
  onReset,
  onShare,
  onShowHistory,
}: {
  onReset?: () => void;
  onShare?: () => void;
  onShowHistory: () => void;
}) {
  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const open = Boolean(anchorEl);
  // const handleClick = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  return (
    <Box>
      <AppBarMUI position="static" style={{ backgroundColor: "#646464" }}>
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            id="fade-button"
            aria-controls={open ? "fade-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Typography variant="h5">{APP_NAME}</Typography>
            {/* <Menu
              id="fade-menu"
              MenuListProps={{
                "aria-labelledby": "fade-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              TransitionComponent={Fade}
            >
              <MenuItem onClick={handleClose}>Home</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu> */}
          </Typography>
          {onShare && (
            <ShareRounded
              fontSize="large"
              sx={{ color: "white", cursor: "pointer", mr: 1 }}
              titleAccess="Share this game"
              onClick={onShare}
            />
          )}
          <HistoryRounded
            fontSize="large"
            style={{ marginRight: 4 }}
            sx={{ color: "white", cursor: "pointer" }}
            onClick={onShowHistory}
          />
          {onReset && (
            <ReplayRounded
              fontSize="large"
              sx={{ color: "white", cursor: "pointer" }}
              onClick={onReset}
            />
          )}
        </Toolbar>
      </AppBarMUI>
    </Box>
  );
}
