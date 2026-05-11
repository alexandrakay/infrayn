"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Stack, Button, Typography } from "@mui/material";
import AppShell from "@/components/AppShell";
import StructuredAnalysisPanel from "@/components/StructuredAnalysisPanel";
import { ArchitectureReview, ReviewMode } from "@/lib/types";

interface PendingReview {
  review: ArchitectureReview;
  input: string;
  mode: ReviewMode;
}

export default function ReviewPage() {
  const router = useRouter();
  const [data, setData] = useState<PendingReview | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("pendingReview");
    if (!raw) { router.push("/"); return; }
    setData(JSON.parse(raw));
  }, [router]);

  if (!data) return null;

  return (
    <AppShell title="Review Report">
      <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        <Stack direction="row" sx={{ alignItems: "center", mb: 2 }}>
          <Button variant="text" color="inherit" onClick={() => router.push("/")}>
            ← Back to workbench
          </Button>
        </Stack>
        <Box sx={{ height: "calc(100vh - 160px)", overflow: "auto" }}>
          <StructuredAnalysisPanel
            review={data.review}
            loading={false}
            mode={data.mode}
          />
        </Box>
      </Box>
    </AppShell>
  );
}
