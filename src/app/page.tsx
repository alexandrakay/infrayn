"use client";

import { useState } from "react";
import { Box } from "@mui/material";
import AppShell from "@/components/AppShell";
import ArchitectureInputPanel from "@/components/ArchitectureInputPanel";
import StructuredAnalysisPanel from "@/components/StructuredAnalysisPanel";
import { useAuth } from "@/components/AuthProvider";
import { ReviewMode, ArchitectureReview } from "@/lib/types";

const TOPBAR_HEIGHT = 56;

export default function ReviewWorkbench() {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ReviewMode>("system");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [review, setReview] = useState<ArchitectureReview | null>(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setReview(null);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, mode, userId: user?.uid }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setReview(data.review);

      if (user) {
        await fetch("/api/save-review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.uid, mode, input, output: data.review }),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Review Workbench">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 3fr" },
          height: { md: `calc(100vh - ${TOPBAR_HEIGHT}px)` },
          overflow: { md: "hidden" },
        }}
      >
        <ArchitectureInputPanel
          input={input}
          mode={mode}
          loading={loading}
          error={error}
          onInputChange={setInput}
          onModeChange={setMode}
          onSubmit={handleSubmit}
        />
        <StructuredAnalysisPanel review={review} loading={loading} mode={mode} />
      </Box>
    </AppShell>
  );
}
