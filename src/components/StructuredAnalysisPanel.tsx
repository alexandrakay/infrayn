"use client";

import React, { useState } from "react";
import { Box, Chip, Collapse, Typography, Paper, Stack, Skeleton, Divider, Button } from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";
import BoltIcon from "@mui/icons-material/Bolt";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { ArchitectureReview, ReviewItem, ReviewMode } from "@/lib/types";
import { useResolvedFindings } from "@/lib/useResolvedFindings";
import { formatReviewAsMarkdown } from "@/lib/formatReview";
import FindingCard from "./FindingCard";
import PressureMap from "./PressureMap";
import ReportOutline from "./ReportOutline";
import { trackEvent } from "@/lib/analytics";

function ScoreCard({ review, quickScan }: { review: ArchitectureReview; quickScan?: boolean }) {
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
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}>
          <SpeedIcon sx={{ fontSize: 12, color: "text.secondary" }} />
          <Typography variant="overline" color="text.secondary" sx={{ fontSize: "0.58rem" }}>
            Architecture Score
          </Typography>
          {quickScan && (
            <Chip
              icon={<BoltIcon sx={{ fontSize: "12px !important" }} />}
              label="Quick Scan"
              size="small"
              sx={{
                height: 18,
                fontSize: "0.58rem",
                fontWeight: 700,
                bgcolor: "rgba(245,166,35,0.12)",
                color: "#f5a623",
                border: "1px solid rgba(245,166,35,0.3)",
                "& .MuiChip-icon": { color: "#f5a623", ml: 0.5 },
                "& .MuiChip-label": { px: 0.75 },
              }}
            />
          )}
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

function StreamingState() {
  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            bgcolor: "#2376ff",
            animation: "pulse 1.2s ease-in-out infinite",
            "@keyframes pulse": {
              "0%, 100%": { opacity: 1 },
              "50%": { opacity: 0.3 },
            },
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          Receiving analysis...
        </Typography>
      </Box>
      <Skeleton variant="rounded" height={110} sx={{ borderRadius: 3 }} />
      <Skeleton variant="rounded" height={80} sx={{ borderRadius: 3 }} />
      <Skeleton variant="rounded" height={80} sx={{ borderRadius: 3 }} />
    </Stack>
  );
}

interface FindingGroup { title: string; category: string; items: ArchitectureReview["bottlenecks"] }

function CollapsibleSection({ title, count, color, resolvedCount = 0, children }: {
  title: string;
  count: number;
  color?: string;
  resolvedCount?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <Box>
      <Box
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => e.key === "Enter" && setOpen((v) => !v)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          userSelect: "none",
          mb: open ? 1.5 : 0,
        }}
      >
        <Typography
          variant="overline"
          sx={{ color: color ?? "text.secondary", fontSize: "inherit" }}
        >
          {title}{!open ? ` (${count})` : ""}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {resolvedCount > 0 && (
            <Typography sx={{ fontSize: "0.62rem", fontWeight: 700, color: "#14a88a" }}>
              {resolvedCount}/{count} resolved
            </Typography>
          )}
          {open
            ? <ExpandLessIcon sx={{ fontSize: 16, color: color ?? "text.secondary" }} aria-hidden />
            : <ExpandMoreIcon sx={{ fontSize: 16, color: color ?? "text.secondary" }} aria-hidden />
          }
        </Box>
      </Box>
      <Collapse in={open} unmountOnExit timeout={0}>
        {children}
      </Collapse>
    </Box>
  );
}

function formatReviewAsText(review: ArchitectureReview, mode: ReviewMode): string {
  const lines: string[] = [];
  const section = (title: string) => {
    lines.push("", `== ${title} ==`, "");
  };
  const findings = (items: ReviewItem[]) => {
    items.forEach((item) => {
      lines.push(`[${item.severity.toUpperCase()}] ${item.description}`);
    });
  };

  lines.push(`ARCHITECTURE REVIEW REPORT`);
  lines.push(`Architecture Score: ${review.overall_score}/10`);
  lines.push(review.summary);

  section("Bottlenecks");
  findings(review.bottlenecks);

  section("Single Points of Failure");
  findings(review.single_points_of_failure);

  section("Scaling Concerns");
  findings(review.scaling_concerns);

  section("Security Gaps");
  findings(review.security_gaps);

  if (review.strengths.length > 0) {
    section("Strengths");
    review.strengths.forEach((s) => lines.push(`• ${s}`));
  }

  if (review.quick_wins.length > 0) {
    section("Quick Wins");
    review.quick_wins.forEach((w) => lines.push(`• ${w}`));
  }

  if (mode !== "system" && review.llm_specific) {
    const llm = review.llm_specific;
    section("LLM Pipeline Analysis");
    if (llm.hallucination_risks.length > 0) {
      lines.push("Hallucination Risks:");
      findings(llm.hallucination_risks);
    }
    if (llm.model_recommendations.length > 0) {
      lines.push("", "Model Recommendations:");
      llm.model_recommendations.forEach((r) => lines.push(`• ${r}`));
    }
    if (llm.prompt_architecture.length > 0) {
      lines.push("", "Prompt Architecture:");
      llm.prompt_architecture.forEach((r) => lines.push(`• ${r}`));
    }
    if (llm.cost_optimization?.length > 0) {
      lines.push("", "Cost Optimization:");
      llm.cost_optimization.forEach((r) => lines.push(`• ${r}`));
    }
    if (llm.fallback_strategy?.length > 0) {
      lines.push("", "Fallback Strategy:");
      llm.fallback_strategy.forEach((r) => lines.push(`• ${r}`));
    }
  }

  return lines.join("\n").trim();
}

interface Props {
  review: ArchitectureReview | null;
  loading: boolean;
  streaming?: boolean;
  mode: ReviewMode;
  quickScan?: boolean;
  reviewId?: string | null;
  isAuthenticated?: boolean;
  systemName?: string;
}

export default function StructuredAnalysisPanel({ review, loading, streaming = false, mode, quickScan = false, reviewId = null, isAuthenticated = false, systemName = "" }: Props) {
  const [copied, setCopied] = useState(false);
  const { resolvedIds, toggle } = useResolvedFindings(reviewId);

  const handleCopy = async () => {
    if (!review) return;
    await navigator.clipboard.writeText(formatReviewAsText(review, mode));
    trackEvent("report_copied", { mode });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!review) return;
    trackEvent("report_downloaded", { mode, hasSystemName: !!systemName.trim() });
    const md = formatReviewAsMarkdown(review, mode, systemName);
    const slug = systemName.trim()
      ? systemName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : "architecture-review";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([md], { type: "text/markdown" }));
    a.download = `${slug}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const findingGroups: FindingGroup[] = review
    ? [
        { title: "Bottlenecks", category: "bottlenecks", items: review.bottlenecks },
        { title: "Single Points of Failure", category: "single_points_of_failure", items: review.single_points_of_failure },
        { title: "Security Gaps", category: "security_gaps", items: review.security_gaps },
        { title: "Scaling Concerns", category: "scaling_concerns", items: review.scaling_concerns },
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
      {loading && streaming ? (
        <StreamingState />
      ) : loading ? (
        <LoadingState />
      ) : !review ? (
        <EmptyState />
      ) : (
        <Stack spacing={3} sx={{ p: 3 }}>
          {systemName.trim() && (
            <Typography
              data-testid="system-name"
              variant="h6"
              sx={{ fontWeight: 700, lineHeight: 1.2 }}
            >
              {systemName.trim()}
            </Typography>
          )}
          <ScoreCard review={review} quickScan={quickScan} />

          {/* Finding groups — high severity first within each */}
          {findingGroups.map(({ title, category, items }) => {
            const resolvedCount = items.filter((_, i) => resolvedIds.has(`${category}:${i}`)).length;
            return (
            <CollapsibleSection key={title} title={title} count={items.length} resolvedCount={resolvedCount}>
              <Stack spacing={1.5}>
                {items
                  .map((item, i) => ({ item, originalIndex: i }))
                  .sort((a, b) => {
                    const order = { high: 0, medium: 1, low: 2 };
                    return order[a.item.severity] - order[b.item.severity];
                  })
                  .map(({ item, originalIndex }) => {
                    const findingId = `${category}:${originalIndex}`;
                    return (
                      <FindingCard
                        key={originalIndex}
                        item={item}
                        showRemediation
                        resolved={resolvedIds.has(findingId)}
                        onToggle={() => toggle(findingId)}
                        isAuthenticated={isAuthenticated}
                      />
                    );
                  })}
              </Stack>
            </CollapsibleSection>
            );
          })}

          {/* Strengths */}
          {review.strengths.length > 0 && (
            <CollapsibleSection title="Strengths" count={review.strengths.length}>
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
            </CollapsibleSection>
          )}

          {/* Quick wins */}
          {review.quick_wins.length > 0 && (
            <CollapsibleSection title="Quick Wins" count={review.quick_wins.length}>
              <Stack spacing={1}>
                {review.quick_wins.map((w, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "rgba(35,118,255,0.04)",
                      border: "1px solid rgba(35,118,255,0.12)",
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "#2376ff",
                        mt: 0.75,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {w}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CollapsibleSection>
          )}

          {/* LLM-specific */}
          {mode !== "system" && review.llm_specific && (
            <CollapsibleSection
              title="LLM Pipeline Analysis"
              count={review.llm_specific.hallucination_risks.length}
              color="#7257ff"
            >
              <Stack spacing={1.5}>
                {review.llm_specific.hallucination_risks.map((item, i) => {
                  const findingId = `llm_hallucination_risks:${i}`;
                  return (
                    <FindingCard
                      key={i}
                      item={item}
                      resolved={resolvedIds.has(findingId)}
                      onToggle={() => toggle(findingId)}
                      isAuthenticated={isAuthenticated}
                    />
                  );
                })}
              </Stack>

              {review.llm_specific.model_recommendations.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#7257ff", display: "block", mb: 1 }}>
                    Model Recommendations
                  </Typography>
                  <Stack spacing={1}>
                    {review.llm_specific.model_recommendations.map((r, i) => (
                      <Box key={i} sx={{ display: "flex", gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: "rgba(114,87,255,0.04)", border: "1px solid rgba(114,87,255,0.12)" }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#7257ff", mt: 0.75, flexShrink: 0 }} />
                        <Typography variant="body2" color="text.secondary">{r}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              {review.llm_specific.prompt_architecture.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#7257ff", display: "block", mb: 1 }}>
                    Prompt Architecture
                  </Typography>
                  <Stack spacing={1}>
                    {review.llm_specific.prompt_architecture.map((r, i) => (
                      <Box key={i} sx={{ display: "flex", gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: "rgba(114,87,255,0.04)", border: "1px solid rgba(114,87,255,0.12)" }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#7257ff", mt: 0.75, flexShrink: 0 }} />
                        <Typography variant="body2" color="text.secondary">{r}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              {(review.llm_specific.cost_optimization?.length ?? 0) > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#7257ff", display: "block", mb: 1 }}>
                    Cost Optimization
                  </Typography>
                  <Stack spacing={1}>
                    {review.llm_specific.cost_optimization.map((r, i) => (
                      <Box key={i} sx={{ display: "flex", gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: "rgba(114,87,255,0.04)", border: "1px solid rgba(114,87,255,0.12)" }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#7257ff", mt: 0.75, flexShrink: 0 }} />
                        <Typography variant="body2" color="text.secondary">{r}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              {(review.llm_specific.fallback_strategy?.length ?? 0) > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#7257ff", display: "block", mb: 1 }}>
                    Fallback Strategy
                  </Typography>
                  <Stack spacing={1}>
                    {review.llm_specific.fallback_strategy.map((r, i) => (
                      <Box key={i} sx={{ display: "flex", gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: "rgba(114,87,255,0.04)", border: "1px solid rgba(114,87,255,0.12)" }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#7257ff", mt: 0.75, flexShrink: 0 }} />
                        <Typography variant="body2" color="text.secondary">{r}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </CollapsibleSection>
          )}

          <PressureMap review={review} />
          <ReportOutline review={review} mode={mode} />

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
              onClick={handleCopy}
              sx={{ color: copied ? "#14a88a" : "text.secondary", borderColor: "divider" }}
            >
              {copied ? "Copied!" : "Copy report"}
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleDownloadMarkdown}
              sx={{ color: "text.secondary", borderColor: "divider" }}
            >
              Download .md
            </Button>
          </Stack>
        </Stack>
      )}
    </Box>
  );
}
