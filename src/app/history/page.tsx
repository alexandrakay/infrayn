"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { getClientDb } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { SavedReview } from "@/lib/types";
import AppShell from "@/components/AppShell";
import SystemHistory from "@/components/SystemHistory";
import { Box, Typography } from "@mui/material";

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<SavedReview[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/"); return; }

    const fetchReviews = async () => {
      const q = query(
        collection(getClientDb(), "reviews"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() } as SavedReview)));
      setFetching(false);
    };

    fetchReviews();
  }, [user, loading, router]);

  const handleOpen = (r: SavedReview) => {
    sessionStorage.setItem(
      "pendingReview",
      JSON.stringify({ review: r.output, input: r.input, mode: r.mode, reviewId: r.id })
    );
    router.push("/review");
  };

  if (loading || fetching) return null;

  return (
    <AppShell title="Reports">
      <Box sx={{ maxWidth: 680, mx: "auto", p: 3 }}>
        <Typography variant="h2" sx={{ mb: 3 }}>Past reviews</Typography>

        {reviews.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No reviews yet. Run one from the Review workbench.
          </Typography>
        ) : (
          <SystemHistory reviews={reviews} onOpen={handleOpen} />
        )}
      </Box>
    </AppShell>
  );
}
