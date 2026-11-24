import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Box, Button, IconButton, Popover, Stack, Tooltip, Typography } from "@mui/material";
import {
  NotificationsRounded,
  GroupAddRounded,
  HowToRegRounded,
  PersonSearchRounded,
  DoNotDisturbOnRounded,
  ExitToAppRounded,
} from "@mui/icons-material";
import PlayerAccountService, { type AppNotification } from "../../services/PlayerAccountService";

// Light polling: notifications aren't urgent, and the backend runs on a
// bandwidth-limited plan. Also refreshes when the tab regains focus.
const POLL_MS = 3 * 60 * 1000;

const ICONS: Record<AppNotification["type"], React.ReactNode> = {
  squad_added: <GroupAddRounded />,
  team_added: <GroupAddRounded />,
  claim_requested: <PersonSearchRounded />,
  claim_approved: <HowToRegRounded />,
  claim_rejected: <DoNotDisturbOnRounded />,
  player_left_squad: <ExitToAppRounded />,
};

const timeAgo = (iso: string) => {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
};

const NotificationBell: React.FC = () => {
  const navigate = useNavigate();
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const [items, setItems] = React.useState<AppNotification[]>([]);
  const [unread, setUnread] = React.useState(0);

  const refresh = React.useCallback(() => {
    PlayerAccountService.notifications()
      .then((r) => {
        setItems(r.notifications);
        setUnread(r.unreadCount);
      })
      .catch(() => undefined);
  }, []);

  React.useEffect(() => {
    refresh();
    const timer = window.setInterval(() => document.visibilityState === "visible" && refresh(), POLL_MS);
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  const openItem = (n: AppNotification) => {
    setAnchor(null);
    if (!n.read) {
      setItems((list) => list.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
      setUnread((u) => Math.max(0, u - 1));
      PlayerAccountService.markRead([n.id]).catch(() => undefined);
    }
    if (n.link) navigate(n.link);
  };

  const markAll = () => {
    setItems((list) => list.map((x) => ({ ...x, read: true })));
    setUnread(0);
    PlayerAccountService.markRead().catch(() => undefined);
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          data-ga-click="open_notifications"
          aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
          onClick={(e) => {
            setAnchor(e.currentTarget);
            refresh();
          }}
          sx={{ color: "white", mr: 0.5 }}
        >
          <Badge badgeContent={unread} color="error" max={9}>
            <NotificationsRounded />
          </Badge>
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { width: { xs: "calc(100vw - 24px)", sm: 380 }, maxHeight: 480, borderRadius: 3 } } }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.25, borderBottom: "1px solid #edf1f4" }}>
          <Typography sx={{ fontWeight: 900, color: "#0c3558" }}>Notifications</Typography>
          {unread > 0 && (
            <Button size="small" onClick={markAll} sx={{ textTransform: "none", fontWeight: 800 }}>
              Mark all read
            </Button>
          )}
        </Stack>
        {items.length === 0 ? (
          <Typography sx={{ p: 3, color: "#6b7785", textAlign: "center", fontSize: 14 }}>
            You're all caught up.
          </Typography>
        ) : (
          items.map((n) => (
            <Box
              key={n.id}
              role="button"
              tabIndex={0}
              onClick={() => openItem(n)}
              onKeyDown={(e) => e.key === "Enter" && openItem(n)}
              sx={{
                display: "flex",
                gap: 1.25,
                px: 2,
                py: 1.25,
                cursor: "pointer",
                borderBottom: "1px solid #f1f4f7",
                background: n.read ? "#fff" : "color-mix(in srgb, var(--app-accent-start, #43cea2) 9%, #ffffff 91%)",
                "&:hover": { background: "#f6f9fb" },
              }}
            >
              <Box sx={{ color: "var(--app-accent-text, #185a9d)", mt: 0.25, "& svg": { fontSize: 22 } }}>{ICONS[n.type]}</Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontWeight: n.read ? 700 : 900, fontSize: 14, color: "#0c3558" }}>{n.title}</Typography>
                <Typography sx={{ fontSize: 12.5, color: "#526274", mt: 0.25 }}>{n.body}</Typography>
                <Typography sx={{ fontSize: 11.5, color: "#8a96a3", mt: 0.4 }}>{timeAgo(n.createdAt)}</Typography>
              </Box>
              {!n.read && <Box sx={{ width: 8, height: 8, mt: 0.8, borderRadius: "50%", background: "#e0463c", flex: "none" }} />}
            </Box>
          ))
        )}
      </Popover>
    </>
  );
};

export default NotificationBell;
