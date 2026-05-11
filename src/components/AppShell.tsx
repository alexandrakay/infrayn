"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Chip,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import GridViewIcon from "@mui/icons-material/GridView";
import TuneIcon from "@mui/icons-material/Tune";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useAuth } from "./AuthProvider";

const RAIL_WIDTH = 220;
const TOPBAR_HEIGHT = 56;

const navItems = [
  { label: "Review", icon: <PlayCircleIcon fontSize="small" />, href: "/" },
  { label: "Reports", icon: <ListAltIcon fontSize="small" />, href: "/history" },
  { label: "Templates", icon: <GridViewIcon fontSize="small" />, href: "/templates" },
  { label: "Settings", icon: <TuneIcon fontSize="small" />, href: "/settings" },
];

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function AppShell({ title, children }: Props) {
  const { user, signIn, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const mobileNavIndex = navItems.findIndex((n) => n.href === pathname);

  const Rail = (
    <Box
      sx={{
        width: RAIL_WIDTH,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #0b1020 0%, #111827 100%)",
      }}
    >
      {/* Brand */}
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Typography
          sx={{
            color: "rgba(255,255,255,0.95)",
            letterSpacing: "0.22em",
            fontSize: "0.68rem",
            fontWeight: 900,
            fontFamily: "inherit",
          }}
        >
          INFRAYN
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.75 }}>
          <FiberManualRecordIcon sx={{ fontSize: 7, color: "#14a88a" }} />
          <Typography sx={{ color: "rgba(255,255,255,0.3)", fontSize: "0.62rem" }}>
            System online
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.07)" }} />

      {/* Nav */}
      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => router.push(item.href)}
                sx={{
                  borderRadius: 3,
                  py: 1,
                  color: active ? "#fff" : "rgba(255,255,255,0.4)",
                  bgcolor: active ? "rgba(35,118,255,0.15)" : "transparent",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.75)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 34 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: { fontSize: "0.83rem", fontWeight: active ? 700 : 500 },
                    },
                  }}
                />
                {active && (
                  <Box
                    sx={{
                      width: 3,
                      height: 18,
                      borderRadius: 4,
                      bgcolor: "#2376ff",
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User */}
      <Box sx={{ px: 2, py: 2.5, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        {user ? (
          <Box
            onClick={() => signOut()}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              "&:hover": { opacity: 0.75 },
            }}
          >
            <Avatar src={user.photoURL ?? ""} sx={{ width: 30, height: 30 }} />
            <Box>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                {user.displayName?.split(" ")[0] ?? "User"}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.3)", fontSize: "0.62rem" }}>
                Sign out
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            onClick={signIn}
            sx={{ cursor: "pointer", "&:hover": { opacity: 0.8 } }}
          >
            <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
              Sign in
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Desktop rail */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: RAIL_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: RAIL_WIDTH,
            boxSizing: "border-box",
            border: "none",
            backgroundImage: "none",
            boxShadow: "none",
            overflow: "hidden",
          },
        }}
      >
        {Rail}
      </Drawer>

      {/* Main */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Topbar */}
        <Box
          sx={{
            height: TOPBAR_HEIGHT,
            display: "flex",
            alignItems: "center",
            px: { xs: 2, md: 3 },
            gap: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "rgba(248,251,255,0.85)",
            backdropFilter: "blur(12px)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Typography
            sx={{
              display: { xs: "block", md: "none" },
              fontWeight: 900,
              letterSpacing: "0.2em",
              fontSize: "0.68rem",
            }}
          >
            INFRAYN
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, display: { xs: "none", md: "block" } }}
          >
            {title}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Chip
            label="claude-sonnet-4-6"
            size="small"
            sx={{
              bgcolor: "rgba(114,87,255,0.08)",
              color: "#7257ff",
              border: "1px solid rgba(114,87,255,0.2)",
              height: 24,
              fontSize: "0.65rem",
              "& .MuiChip-label": { px: 1.25 },
            }}
          />

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            {user ? (
              <Avatar
                src={user.photoURL ?? ""}
                sx={{ width: 28, height: 28, cursor: "pointer" }}
                onClick={() => signOut()}
              />
            ) : (
              <Typography
                variant="caption"
                onClick={signIn}
                sx={{ cursor: "pointer", color: "text.secondary" }}
              >
                Sign in
              </Typography>
            )}
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ flexGrow: 1, overflow: "hidden" }}>{children}</Box>

        {/* Mobile bottom nav */}
        <Paper
          elevation={0}
          sx={{
            display: { xs: "block", md: "none" },
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 20,
            backgroundImage: "none",
            boxShadow: "0 -1px 0 rgba(0,0,0,0.08)",
          }}
        >
          <BottomNavigation
            value={mobileNavIndex}
            onChange={(_, val) => router.push(navItems[val].href)}
            sx={{ bgcolor: "background.paper" }}
          >
            {navItems.map((item) => (
              <BottomNavigationAction
                key={item.href}
                label={item.label}
                icon={item.icon}
                sx={{ minWidth: 0, fontSize: "0.65rem" }}
              />
            ))}
          </BottomNavigation>
        </Paper>
      </Box>
    </Box>
  );
}
