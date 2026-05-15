"use client";

import { useState, useEffect, useRef } from "react";
import { Box, Dialog, DialogContent } from "@mui/material";
import AppShell from "@/components/AppShell";
import ArchitectureInputPanel from "@/components/ArchitectureInputPanel";
import StructuredAnalysisPanel from "@/components/StructuredAnalysisPanel";
import SignInPrompt from "@/components/SignInPrompt";
import { useAuth } from "@/components/AuthProvider";
import { ReviewMode, ReviewSection, ALL_SECTIONS, ArchitectureReview } from "@/lib/types";
import { loadUserPreferences, saveUserPreferences } from "@/lib/userPreferences";
import { UserTemplate, loadUserTemplates, saveUserTemplate, deleteUserTemplate } from "@/lib/userTemplates";
import { trackEvent } from "@/lib/analytics";

const TOPBAR_HEIGHT = 56;
const ANON_REVIEW_KEY = "infrayn_anon_used";

export default function ReviewWorkbench() {
  const { user, signIn } = useAuth();
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ReviewMode>("system");
  const [sections, setSections] = useState<ReviewSection[]>(ALL_SECTIONS);
  const [systemName, setSystemName] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const [review, setReview] = useState<ArchitectureReview | null>(null);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [quickScan, setQuickScan] = useState(false);
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  const [userTemplates, setUserTemplates] = useState<UserTemplate[]>([]);
  const [remainingReviews, setRemainingReviews] = useState<number | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const rawReview = sessionStorage.getItem("pendingReview");
    if (rawReview) {
      sessionStorage.removeItem("pendingReview");
      try {
        const { review: r, input: i, mode: m, reviewId: rid, systemName: sn } = JSON.parse(rawReview);
        if (r) setReview(r);
        if (i) setInput(i);
        if (m) setMode(m);
        if (rid) setReviewId(rid);
        if (sn) setSystemName(sn);
      } catch { /* malformed — ignore */ }
    }

    const rawTemplate = sessionStorage.getItem("pendingTemplate");
    if (rawTemplate) {
      sessionStorage.removeItem("pendingTemplate");
      try {
        const { content } = JSON.parse(rawTemplate);
        if (content) setInput(content);
      } catch { /* malformed — ignore */ }
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setPrefsLoaded(true);
      return;
    }
    loadUserPreferences(user.uid)
      .then((prefs) => {
        setMode(prefs.mode);
        setSections(prefs.sections);
        setPrefsLoaded(true);
      })
      .catch(() => setPrefsLoaded(true));
    loadUserTemplates(user.uid).then(setUserTemplates).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user || !prefsLoaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveUserPreferences(user.uid, { mode, sections }).catch(() => {});
    }, 600);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [mode, sections, user, prefsLoaded]);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    // Block anonymous users who've already used their free review
    if (!user && localStorage.getItem(ANON_REVIEW_KEY)) {
      trackEvent("sign_in_prompt_shown", { trigger: "blocked_anon" });
      setShowSignInPrompt(true);
      return;
    }

    trackEvent("review_submitted", { mode, quickScan, inputLength: input.trim().length, hasSystemName: !!systemName.trim() });
    setLoading(true);
    setStreaming(false);
    setError("");
    setReview(null);
    setReviewId(null);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, mode, userId: user?.uid, sections, quickScan }),
      });

      if (!res.ok) {
        const data = await res.json();
        trackEvent("review_error", { error: data.error ?? "unknown" });
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

      // Strip sentinel and capture remaining count
      const sentinelIdx = buffer.lastIndexOf("\n__REMAINING__:");
      if (sentinelIdx !== -1) {
        const sentinelStr = buffer.slice(sentinelIdx + "\n__REMAINING__:".length);
        const parsed = parseInt(sentinelStr, 10);
        if (!isNaN(parsed)) setRemainingReviews(parsed);
        buffer = buffer.slice(0, sentinelIdx);
      }

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
      trackEvent("review_completed", { mode, quickScan, score: parsed.overall_score });

      if (user) {
        const saveRes = await fetch("/api/save-review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.uid, mode, input, output: parsed, systemName }),
        });
        const { id } = await saveRes.json();
        if (id) setReviewId(id);
      } else {
        localStorage.setItem(ANON_REVIEW_KEY, "1");
        setTimeout(() => {
          trackEvent("sign_in_prompt_shown", { trigger: "post_review" });
          setShowSignInPrompt(true);
        }, 1200);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setStreaming(false);
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    trackEvent("sign_in_prompt_accepted");
    setShowSignInPrompt(false);
    await signIn();
  };

  const handleSaveTemplate = async (name: string) => {
    if (!user) return;
    const saved = await saveUserTemplate(user.uid, name, input);
    setUserTemplates((prev) => [saved, ...prev]);
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!user) return;
    await deleteUserTemplate(user.uid, templateId);
    setUserTemplates((prev) => prev.filter((t) => t.id !== templateId));
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
          sections={sections}
          loading={loading}
          error={error}
          systemName={systemName}
          isAuthenticated={!!user}
          onInputChange={setInput}
          onModeChange={setMode}
          onSectionsChange={setSections}
          onSystemNameChange={setSystemName}
          quickScan={quickScan}
          onQuickScanChange={setQuickScan}
          remainingReviews={remainingReviews}
          onSaveTemplate={handleSaveTemplate}
          onDeleteTemplate={handleDeleteTemplate}
          userTemplates={userTemplates}
          onSubmit={handleSubmit}
        />
        <StructuredAnalysisPanel review={review} loading={loading} streaming={streaming} mode={mode} quickScan={quickScan} reviewId={reviewId} isAuthenticated={!!user} systemName={systemName} />
      </Box>

      <Dialog
        open={showSignInPrompt}
        onClose={() => setShowSignInPrompt(false)}
        slotProps={{ paper: { sx: { borderRadius: 4, bgcolor: "transparent", boxShadow: "none" } } }}
      >
        <DialogContent sx={{ p: 0 }}>
          <SignInPrompt
            onSignIn={handleSignIn}
            onDismiss={() => { trackEvent("sign_in_prompt_dismissed"); setShowSignInPrompt(false); }}
          />
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
