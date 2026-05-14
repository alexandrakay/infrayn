"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Stack,
  Paper,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/components/AuthProvider";
import { ARCHITECTURE_TEMPLATES } from "@/lib/templates";
import { UserTemplate, loadUserTemplates, deleteUserTemplate } from "@/lib/userTemplates";

export default function TemplatesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [userTemplates, setUserTemplates] = useState<UserTemplate[]>([]);

  useEffect(() => {
    if (!user) return;
    loadUserTemplates(user.uid).then(setUserTemplates).catch(() => {});
  }, [user]);

  const handleUse = (content: string) => {
    sessionStorage.setItem("pendingTemplate", JSON.stringify({ content }));
    router.push("/review");
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    await deleteUserTemplate(user.uid, id);
    setUserTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AppShell title="Templates">
      <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        <Typography variant="h2" sx={{ mb: 1 }}>Templates</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Start a review from a pre-built or saved template.
        </Typography>

        {user && userTemplates.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontSize: "0.6rem", letterSpacing: 1 }}>
              My Templates
            </Typography>
            <Stack spacing={1.5} sx={{ mt: 1 }}>
              {userTemplates.map((ut) => (
                <Paper key={ut.id} sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, flex: 1, minWidth: 0 }} noWrap>
                    {ut.name}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                    <Button size="small" variant="outlined" onClick={() => handleUse(ut.content)}>
                      Use
                    </Button>
                    <IconButton size="small" aria-label="delete" onClick={() => handleDelete(ut.id)}>
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </Stack>
            <Divider sx={{ mt: 3 }} />
          </Box>
        )}

        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ fontSize: "0.6rem", letterSpacing: 1 }}>
            Built-in Templates
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            {ARCHITECTURE_TEMPLATES.map((t) => (
              <Paper key={t.id} sx={{ p: 2, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {t.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t.description}
                  </Typography>
                </Box>
                <Button size="small" variant="outlined" sx={{ flexShrink: 0 }} onClick={() => handleUse(t.content)}>
                  Use
                </Button>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Box>
    </AppShell>
  );
}
