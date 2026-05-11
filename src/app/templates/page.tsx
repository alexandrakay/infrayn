"use client";

import { Box, Typography } from "@mui/material";
import AppShell from "@/components/AppShell";

export default function TemplatesPage() {
  return (
    <AppShell title="Templates">
      <Box sx={{ p: 3 }}>
        <Typography variant="h2" sx={{ mb: 1 }}>Templates</Typography>
        <Typography variant="body2" color="text.secondary">
          Common review templates — coming soon.
        </Typography>
      </Box>
    </AppShell>
  );
}
