"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Box, Button, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/components/AuthProvider";

interface UsageData {
  used: number;
  limit: number;
  windowStart: number;
}

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [usage, setUsage] = useState<UsageData | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    fetch(`/api/usage?userId=${user.uid}`, { cache: "no-store" })
      .then((r) => r.json())
      .then(setUsage)
      .catch(() => {});
  }, [user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (!user) return null;

  const pct = usage ? Math.min(100, (usage.used / usage.limit) * 100) : 0;

  return (
    <AppShell title="Settings">
      <Box sx={{ p: 3, maxWidth: 560 }}>
        <Typography variant="h2" sx={{ mb: 3 }}>Settings</Typography>

        {/* Account */}
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 2 }}>
            Account
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Avatar
              src={user.photoURL ?? undefined}
              alt={user.displayName ?? "User"}
              sx={{ width: 48, height: 48 }}
            />
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {user.displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </Stack>
          <Button
            variant="outlined"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={handleSignOut}
            sx={{ color: "text.secondary", borderColor: "divider" }}
          >
            Sign out
          </Button>
        </Paper>

        {/* Usage */}
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 2 }}>
            Usage this hour
          </Typography>
          {usage ? (
            <>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {usage.used} of {usage.limit} reviews used
              </Typography>
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "rgba(35,118,255,0.1)",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: pct >= 90 ? "#ef5a4c" : "#2376ff",
                    borderRadius: 3,
                  },
                }}
              />
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">Loading...</Typography>
          )}
        </Paper>

        {/* Preferences link */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Preferences
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Review lens and focus sections are saved automatically while you work.
          </Typography>
          <Button
            variant="text"
            size="small"
            onClick={() => router.push("/review")}
            sx={{ color: "#2376ff", textTransform: "none", p: 0, minWidth: 0 }}
          >
            Go to Review Workbench →
          </Button>
        </Paper>
      </Box>
    </AppShell>
  );
}
