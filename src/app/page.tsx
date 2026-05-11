"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import GoogleIcon from "@mui/icons-material/Google";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SpeedIcon from "@mui/icons-material/Speed";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import { useAuth } from "@/components/AuthProvider";

const FEATURES = [
  {
    icon: <SpeedIcon sx={{ fontSize: 22, color: "#2376ff" }} />,
    title: "Scored findings",
    body: "Every review returns an overall score and findings sorted by severity — high, medium, low.",
  },
  {
    icon: <ShieldOutlinedIcon sx={{ fontSize: 22, color: "#ef5a4c" }} />,
    title: "Five review dimensions",
    body: "Bottlenecks, single points of failure, scaling concerns, security gaps, and strengths.",
  },
  {
    icon: <AccountTreeOutlinedIcon sx={{ fontSize: 22, color: "#14a88a" }} />,
    title: "LLM pipeline lens",
    body: "A dedicated mode for AI-powered systems: hallucination risks, prompt architecture, cost optimization.",
  },
];

const SAMPLE_FINDINGS = [
  { label: "HIGH", color: "#ef5a4c", text: "Single app server — any crash causes 100% downtime with no failover" },
  { label: "HIGH", color: "#ef5a4c", text: "No load balancer means no layer to absorb traffic or perform health checks" },
  { label: "MEDIUM", color: "#2376ff", text: "Redis is single-instance — cache stampedes will hit the database directly" },
  { label: "LOW", color: "#14a88a", text: "No CDN in front of S3 means asset requests consume server bandwidth" },
];

export default function LandingPage() {
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
      }}
    >
      {/* Topbar */}
      <Box
        sx={{
          height: 56,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: "1rem",
            letterSpacing: "0.08em",
            color: "text.primary",
          }}
        >
          INFRAYN
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<GoogleIcon sx={{ fontSize: 16 }} />}
          onClick={signIn}
          sx={{ borderColor: "divider", color: "text.secondary", fontSize: "0.78rem" }}
        >
          Sign in
        </Button>
      </Box>

      <Container maxWidth="md" sx={{ flex: 1, py: { xs: 6, md: 10 } }}>
        {/* Hero */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Chip
            label="AI-powered · Structured · Actionable"
            size="small"
            sx={{
              mb: 3,
              bgcolor: "rgba(35,118,255,0.08)",
              color: "#2376ff",
              fontWeight: 600,
              fontSize: "0.72rem",
              letterSpacing: "0.04em",
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 900,
              lineHeight: 1.1,
              mb: 2.5,
              color: "text.primary",
            }}
          >
            Pressure-test your system
            <br />
            before production does.
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 520, mx: "auto", mb: 4, lineHeight: 1.7 }}
          >
            Paste an architecture description, ADR, Terraform summary, or LLM pipeline design.
            Get a structured review in seconds — scored findings, severity labels, and quick wins.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<PlayArrowIcon />}
              onClick={() => router.push("/review")}
              sx={{ px: 4 }}
            >
              Try it free
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<GoogleIcon />}
              onClick={signIn}
              sx={{ px: 4, borderColor: "divider", color: "text.secondary" }}
            >
              Sign in with Google
            </Button>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5 }}>
            One free review, no sign-in required.
          </Typography>
        </Box>

        {/* Sample output */}
        <Paper
          sx={{
            mb: 8,
            p: 3,
            background: "linear-gradient(135deg, #16213d 0%, #0b1020 60%, #151134 100%)",
            border: "1px solid rgba(35,118,255,0.15)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: "rgba(35,118,255,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <SpeedIcon sx={{ color: "#2376ff", fontSize: 22 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: "0.9rem" }}>
                Single-server Rails app
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.25 }}>
                <Typography
                  sx={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: "#ef5a4c",
                    lineHeight: 1,
                  }}
                >
                  3
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>
                  / 10
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", ml: 0.5 }}>
                  · Multiple single points of failure, no redundancy
                </Typography>
              </Box>
            </Box>
          </Box>

          <Stack spacing={1}>
            {SAMPLE_FINDINGS.map((f, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  alignItems: "flex-start",
                }}
              >
                <Chip
                  label={f.label}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    bgcolor: `${f.color}18`,
                    color: f.color,
                    borderRadius: 1,
                    flexShrink: 0,
                    "& .MuiChip-label": { px: 0.75 },
                  }}
                />
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>
                  {f.text}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>

        {/* Feature highlights */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2,
            mb: 8,
          }}
        >
          {FEATURES.map((f) => (
            <Paper key={f.title} sx={{ p: 2.5 }}>
              <Box sx={{ mb: 1.5 }}>{f.icon}</Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.75 }}>
                {f.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {f.body}
              </Typography>
            </Paper>
          ))}
        </Box>

        {/* Bottom CTA */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h2" sx={{ mb: 1.5, fontWeight: 800 }}>
            Know what to fix before you build it wrong.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={() => router.push("/review")}
            sx={{ px: 5 }}
          >
            Try it free
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          py: 3,
          textAlign: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Infrayn · Week 2 of 12 Apps in 12 Weeks
        </Typography>
      </Box>
    </Box>
  );
}
