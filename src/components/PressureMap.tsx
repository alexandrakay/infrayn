"use client";

import { Box, Typography } from "@mui/material";
import { ArchitectureReview, ReviewItem } from "@/lib/types";

type Severity = "high" | "medium" | "low";

function maxSeverity(items: ReviewItem[]): Severity | null {
  if (items.some((i) => i.severity === "high")) return "high";
  if (items.some((i) => i.severity === "medium")) return "medium";
  if (items.length > 0) return "low";
  return null;
}

const SEVERITY_COLOR: Record<Severity, string> = {
  high: "#ef5a4c",
  medium: "#2376ff",
  low: "#14a88a",
};

const SEVERITY_BG: Record<Severity, string> = {
  high: "rgba(239,90,76,0.08)",
  medium: "rgba(35,118,255,0.06)",
  low: "rgba(20,168,138,0.06)",
};

interface Zone {
  label: string;
  items: ReviewItem[];
}

function ZoneCard({ zone }: { zone: Zone }) {
  const sev = maxSeverity(zone.items);
  const color = sev ? SEVERITY_COLOR[sev] : "rgba(101,112,132,0.4)";
  const bg = sev ? SEVERITY_BG[sev] : "rgba(101,112,132,0.04)";

  return (
    <Box
      sx={{
        flex: "1 1 calc(50% - 6px)",
        minWidth: 0,
        p: 1.5,
        borderRadius: 2,
        bgcolor: bg,
        border: `1px solid ${color}`,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
      }}
    >
      <Typography
        sx={{ fontSize: "1.25rem", fontWeight: 800, color, lineHeight: 1 }}
      >
        {zone.items.length}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.6rem", fontWeight: 600, lineHeight: 1.2 }}>
        {zone.label}
      </Typography>
    </Box>
  );
}

interface Props {
  review: ArchitectureReview;
}

export default function PressureMap({ review }: Props) {
  const zones: Zone[] = [
    { label: "Bottlenecks", items: review.bottlenecks },
    { label: "Single Points of Failure", items: review.single_points_of_failure },
    { label: "Security Gaps", items: review.security_gaps },
    { label: "Scaling Concerns", items: review.scaling_concerns },
  ];

  return (
    <Box>
      <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
        System Pressure Map
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
        {zones.map((zone) => (
          <ZoneCard key={zone.label} zone={zone} />
        ))}
      </Box>
    </Box>
  );
}
