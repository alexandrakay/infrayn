"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { getClientDb } from "@/lib/firebase";
import { Box, Button, Typography } from "@mui/material";
import StructuredAnalysisPanel from "@/components/StructuredAnalysisPanel";
import { SavedReview } from "@/lib/types";
import Link from "next/link";

export default function SharePage() {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<SavedReview | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(getClientDb(), "reviews", id))
      .then((snap) => {
        if (!snap.exists()) { setNotFound(true); return; }
        setReview({ id: snap.id, ...snap.data() } as SavedReview);
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, p: 3 }}>
        <Typography variant="h2">Review not found</Typography>
        <Typography variant="body2" color="text.secondary">This link may have expired or been deleted.</Typography>
        <Button component={Link} href="/" variant="contained">Try Infrayn</Button>
      </Box>
    );
  }

  if (!review) return null;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h2" sx={{ fontWeight: 700 }}>
          {review.systemName?.trim() || "Architecture Review"}
        </Typography>
        <Button component={Link} href="/" variant="outlined" size="small" sx={{ flexShrink: 0 }}>
          Try Infrayn
        </Button>
      </Box>
      <StructuredAnalysisPanel
        review={review.output}
        loading={false}
        mode={review.mode}
        systemName={review.systemName ?? ""}
        isAuthenticated={false}
        reviewId={null}
      />
    </Box>
  );
}
