"use client";

import { Box, Typography, Paper, Stack, Skeleton, Divider, Button } from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ArchitectureReview, ReviewMode } from "@/lib/types";
import FindingCard from "./FindingCard";
import PressureMap from "./PressureMap";
import ReportOutline from "./ReportOutline";

function ScoreCard({ review }: { review: ArchitectureReview }) {
  const score = review.overall_score;
  const color = score >= 7 ? "#14a88a" : score >= 4 ? "#2376ff" : "#ef5a4c";

  return (
    <Paper sx={{ p: 3, display: "flex", gap: 3, alignItems: "center" }}>
      <Box sx={{ textAlign: "center", minWidth: 72, flexShrink: 0 }}>
        <Typography sx={{ fontWeight: 900, color, lineHeight: 1, fontSize: "3rem" }}>
          {score}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
          / 10
        </Typography>
      </Box>
      <Divider orientation="vertical" sx={{ alignSelf: "stretch", height: "auto" }} />
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}>
          <SpeedIcon sx={{ fontSize: 12, color: "text.secondary" }} />
          <Typography variant="overline" color="text.secondary" sx={{ fontSize: "0.58rem" }}>
            Architecture Score
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
          {review.summary}
        </Typography>
      </Box>
    </Paper>
  );
}

function EmptyState() {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        p: 4,
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #16213d 0%, #0b1020 52%, #151134 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 32px rgba(11,16,32,0.22)",
          opacity: 0.5,
        }}
      >
        <SpeedIcon sx={{ color: "rgba(255,255,255,0.55)", fontSize: 30 }} />
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center", maxWidth: 220, opacity: 0.6 }}
      >
        Paste your architecture on the left and run a review to see structured findings here.
      </Typography>
    </Box>
  );
}

function LoadingState() {
  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      <Skeleton variant="rounded" height={110} sx={{ borderRadius: 3 }} />
      <Skeleton variant="rounded" height={80} sx={{ borderRadius: 3 }} />
      <Skeleton variant="rounded" height={80} sx={{ borderRadius: 3 }} />
      <Skeleton variant="rounded" height={80} sx={{ borderRadius: 3 }} />
      <Skeleton variant="rounded" height={140} sx={{ borderRadius: 3 }} />
    </Stack>
  );
}

interface FindingGroup { title: string; items: ArchitectureReview["bottlenecks"] }

interface Props {
  review: ArchitectureReview | null;
  loading: boolean;
  mode: ReviewMode;
}

export default function StructuredAnalysisPanel({ review, loading, mode }: Props) {
  const handleCopy = async () => {
    if (!review) return;
    await navigator.clipboard.writeText(JSON.stringify(review, null, 2));
  };

  const findingGroups: FindingGroup[] = review
    ? [
        { title: "Bottlenecks", items: review.bottlenecks },
        { title: "Single Points of Failure", items: review.single_points_of_failure },
        { title: "Security Gaps", items: review.security_gaps },
        { title: "Scaling Concerns", items: review.scaling_concerns },
      ].filter((g) => g.items.length > 0)
    : [];

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "auto",
        bgcolor: "rgba(237,243,251,0.4)",
        pb: { xs: 10, md: 0 },
      }}
    >
      {loading ? (
        <LoadingState />
      ) : !review ? (
        <EmptyState />
      ) : (
        <Stack spacing={3} sx={{ p: 3 }}>
          <ScoreCard review={review} />

          {/* Finding groups — high severity first within each */}
          {findingGroups.map(({ title, items }) => (
            <Box key={title}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ display: "block", mb: 1.5 }}
              >
                {title}
              </Typography>
              <Stack spacing={1.5}>
                {[...items]
                  .sort((a, b) => {
                    const order = { high: 0, medium: 1, low: 2 };
                    return order[a.severity] - order[b.severity];
                  })
                  .map((item, i) => (
                    <FindingCard key={i} item={item} showRemediation />
                  ))}
              </Stack>
            </Box>
          ))}

          {/* Strengths */}
          {review.strengths.length > 0 && (
            <Box>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ display: "block", mb: 1.5 }}
              >
                Strengths
              </Typography>
              <Stack spacing={1}>
                {review.strengths.map((s, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "rgba(20,168,138,0.06)",
                      border: "1px solid rgba(20,168,138,0.15)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "#14a88a",
                        mt: 0.75,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {s}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* LLM-specific */}
          {mode !== "system" && review.llm_specific && (
            <Box>
              <Typography
                variant="overline"
                sx={{ display: "block", mb: 1.5, color: "#7257ff" }}
              >
                LLM Pipeline Analysis
              </Typography>
              <Stack spacing={1.5}>
                {review.llm_specific.hallucination_risks.map((item, i) => (
                  <FindingCard key={i} item={item} />
                ))}
              </Stack>
            </Box>
          )}

          <PressureMap />
          <ReportOutline review={review} mode={mode} />

          <Button
            variant="outlined"
            fullWidth
            startIcon={<ContentCopyIcon />}
            onClick={handleCopy}
            sx={{ color: "text.secondary", borderColor: "divider" }}
          >
            Copy report JSON
          </Button>
        </Stack>
      )}
    </Box>
  );
}
