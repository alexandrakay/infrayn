"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Paper, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { useAuth } from "@/components/AuthProvider";

export default function SignInPage() {
  const { user, signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/review");
  }, [user, router]);

  if (user) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: "1.1rem",
            letterSpacing: "0.12em",
            color: "text.primary",
            mb: 0.5,
          }}
        >
          INFRAYN
        </Typography>
        <Typography variant="caption" color="text.secondary">
          AI Architecture Reviewer
        </Typography>
      </Box>

      <Paper sx={{ p: 4, width: "100%", maxWidth: 380, textAlign: "center" }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            bgcolor: "rgba(35,118,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2.5,
          }}
        >
          <ShieldOutlinedIcon sx={{ color: "#2376ff", fontSize: 24 }} />
        </Box>

        <Typography variant="h2" sx={{ mb: 1 }}>
          Sign in to Infrayn
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
          Save your review history and track how your architecture improves over time.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          startIcon={<GoogleIcon />}
          onClick={signIn}
        >
          Sign in with Google
        </Button>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 2, cursor: "pointer", "&:hover": { opacity: 0.7 } }}
          onClick={() => router.push("/")}
        >
          ← Back to home
        </Typography>
      </Paper>
    </Box>
  );
}
