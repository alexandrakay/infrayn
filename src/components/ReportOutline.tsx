import { Box, Typography, Stack, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorIcon from "@mui/icons-material/Error";
import { ArchitectureReview, ReviewMode } from "@/lib/types";

type Status = "ok" | "warn" | "critical";

const icon = {
  ok: <CheckCircleIcon sx={{ fontSize: 13, color: "#14a88a" }} />,
  warn: <WarningAmberIcon sx={{ fontSize: 13, color: "#2376ff" }} />,
  critical: <ErrorIcon sx={{ fontSize: 13, color: "#ef5a4c" }} />,
};

const chipStyle = {
  ok: { bg: "rgba(20,168,138,0.1)", color: "#14a88a" },
  warn: { bg: "rgba(35,118,255,0.1)", color: "#2376ff" },
  critical: { bg: "rgba(239,90,76,0.1)", color: "#ef5a4c" },
};

interface Section { label: string; count?: number; status: Status }

interface Props {
  review: ArchitectureReview;
  mode: ReviewMode;
}

export default function ReportOutline({ review, mode }: Props) {
  const hasHigh = (items: { severity: string }[]) =>
    items.some((i) => i.severity === "high");

  const sections: Section[] = [
    { label: "Executive Summary", status: "ok" },
    {
      label: "Bottlenecks",
      count: review.bottlenecks.length,
      status: hasHigh(review.bottlenecks) ? "critical" : review.bottlenecks.length ? "warn" : "ok",
    },
    {
      label: "Single Points of Failure",
      count: review.single_points_of_failure.length,
      status: hasHigh(review.single_points_of_failure) ? "critical" : review.single_points_of_failure.length ? "warn" : "ok",
    },
    {
      label: "Scaling Concerns",
      count: review.scaling_concerns.length,
      status: review.scaling_concerns.length ? "warn" : "ok",
    },
    {
      label: "Security Gaps",
      count: review.security_gaps.length,
      status: hasHigh(review.security_gaps) ? "critical" : review.security_gaps.length ? "warn" : "ok",
    },
    { label: "Quick Wins", count: review.quick_wins.length, status: "ok" },
    ...(mode !== "system" && review.llm_specific
      ? [{ label: "LLM Pipeline Analysis", status: "ok" as Status }]
      : []),
  ];

  return (
    <Box>
      <Typography variant="overline" color="text.secondary" sx={{ mb: 1.5, display: "block" }}>
        Report Outline
      </Typography>
      <Stack spacing={0.75}>
        {sections.map((s, i) => (
          <Box
            key={s.label}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 1.5,
              py: 1,
              borderRadius: 2,
              bgcolor: "rgba(35,118,255,0.025)",
              border: "1px solid rgba(35,118,255,0.07)",
            }}
          >
            <Typography
              sx={{ color: "text.secondary", fontSize: "0.62rem", fontWeight: 700, minWidth: 18 }}
            >
              {String(i + 1).padStart(2, "0")}
            </Typography>
            {icon[s.status]}
            <Typography variant="caption" sx={{ flexGrow: 1, fontWeight: 600, color: "text.primary" }}>
              {s.label}
            </Typography>
            {s.count !== undefined && s.count > 0 && (
              <Chip
                label={s.count}
                size="small"
                sx={{
                  height: 18,
                  fontSize: "0.6rem",
                  bgcolor: chipStyle[s.status].bg,
                  color: chipStyle[s.status].color,
                  "& .MuiChip-label": { px: 0.75 },
                }}
              />
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
