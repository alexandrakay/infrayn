"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getClientDb } from "./firebase";

export function useResolvedFindings(reviewId: string | null) {
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!reviewId) { setResolvedIds(new Set()); return; }
    const ref = doc(getClientDb(), "reviews", reviewId);
    getDoc(ref)
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data.resolvedFindings)) {
            setResolvedIds(new Set(data.resolvedFindings as string[]));
          }
        }
      })
      .catch(() => {});
  }, [reviewId]);

  const toggle = async (findingId: string) => {
    if (!reviewId) return;
    const isResolved = resolvedIds.has(findingId);
    const ref = doc(getClientDb(), "reviews", reviewId);

    setResolvedIds((prev) => {
      const next = new Set(prev);
      if (isResolved) next.delete(findingId); else next.add(findingId);
      return next;
    });

    try {
      await updateDoc(ref, {
        resolvedFindings: isResolved ? arrayRemove(findingId) : arrayUnion(findingId),
      });
    } catch {
      setResolvedIds((prev) => {
        const next = new Set(prev);
        if (isResolved) next.add(findingId); else next.delete(findingId);
        return next;
      });
    }
  };

  return { resolvedIds, toggle };
}
