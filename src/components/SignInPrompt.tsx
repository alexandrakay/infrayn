"use client";

import { Box, Button, Paper, Typography, Stack } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

interface Props {
  onSignIn: () => void;
  onDismiss: () => void;
}

export default function SignInPrompt({ onSignIn, onDismiss }: Props) {
  return (
    <Paper
      sx={{
        p: 3,
        textAlign: "center",
        maxWidth: 360,
        mx: "auto",
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          bgcolor: "rgba(35,118,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
        }}
      >
        <LockOutlinedIcon sx={{ color: "#2376ff", fontSize: 22 }} />
      </Box>

      <Typography variant="h2" sx={{ mb: 1 }}>
        Save your review history
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Sign in to track how your architecture improves over time. Your free
        review is ready — sign in to save it and run unlimited reviews.
      </Typography>

      <Stack spacing={1.5}>
        <Button variant="contained" color="primary" fullWidth onClick={onSignIn}>
          Sign in with Google
        </Button>
        <Button variant="text" color="inherit" fullWidth onClick={onDismiss}>
          Maybe later
        </Button>
      </Stack>
    </Paper>
  );
}
