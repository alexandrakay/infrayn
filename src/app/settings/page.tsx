"use client";

import { Box, Typography } from "@mui/material";
import AppShell from "@/components/AppShell";

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <Box sx={{ p: 3 }}>
        <Typography variant="h2" sx={{ mb: 1 }}>Settings</Typography>
        <Typography variant="body2" color="text.secondary">
          Model, security, and organization controls — coming soon.
        </Typography>
      </Box>
    </AppShell>
  );
}
