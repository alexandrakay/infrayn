"use client";

import { useState } from "react";
import { Box, Dialog, DialogContent } from "@mui/material";
import AppShell from "@/components/AppShell";
import ArchitectureInputPanel from "@/components/ArchitectureInputPanel";
import StructuredAnalysisPanel from "@/components/StructuredAnalysisPanel";
import SignInPrompt from "@/components/SignInPrompt";
import { useAuth } from "@/components/AuthProvider";
import { ReviewMode, ArchitectureReview } from "@/lib/types";

const TOPBAR_HEIGHT = 56;
const ANON_REVIEW_KEY = "infrayn_anon_used";

export default function ReviewWorkbench() {
  const { user, signIn } = useAuth();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ReviewMode>("system");
  const [systemName, setSystemName] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const [review, setReview] = useState<ArchitectureReview | null>(null);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    // Block anonymous users who've already used their free review
    if (!user && localStorage.getItem(ANON_REVIEW_KEY)) {
      setShowSignInPrompt(true);
      return;
    }

    setLoading(true);
    setStreaming(false);
    setError("");
    setReview(null);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, mode, userId: user?.uid }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong.");
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let firstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        if (firstChunk) {
          setStreaming(true);
          firstChunk = false;
        }
        buffer += text;
      }

      setStreaming(false);

      // Strip sentinel before parsing
      const sentinelIdx = buffer.lastIndexOf("\n__REMAINING__:");
      if (sentinelIdx !== -1) buffer = buffer.slice(0, sentinelIdx);

      const cleaned = buffer
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```\s*$/i, "")
        .trim();

      let parsed: ArchitectureReview;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        setError("Failed to parse review. Please try again.");
        return;
      }

      setReview(parsed);

      if (user) {
        await fetch("/api/save-review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.uid, mode, input, output: parsed, systemName }),
        });
      } else {
        localStorage.setItem(ANON_REVIEW_KEY, "1");
        setTimeout(() => setShowSignInPrompt(true), 1200);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setStreaming(false);
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setShowSignInPrompt(false);
    await signIn();
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
          systemName={systemName}
          onInputChange={setInput}
          onModeChange={setMode}
          onSystemNameChange={setSystemName}
          onSubmit={handleSubmit}
        />
        <StructuredAnalysisPanel review={review} loading={loading} streaming={streaming} mode={mode} />
      </Box>

      <Dialog
        open={showSignInPrompt}
        onClose={() => setShowSignInPrompt(false)}
        slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "transparent", boxShadow: "none" } } }}
      >
        <DialogContent sx={{ p: 0 }}>
          <SignInPrompt
            onSignIn={handleSignIn}
            onDismiss={() => setShowSignInPrompt(false)}
          />
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
