import { Box, Chip, Typography, Paper } from "@mui/material";
import { ReviewItem } from "@/lib/types";

const severity = {
  high: { bg: "rgba(239,90,76,0.08)", color: "#ef5a4c", border: "rgba(239,90,76,0.2)", label: "Critical" },
  medium: { bg: "rgba(35,118,255,0.08)", color: "#2376ff", border: "rgba(35,118,255,0.2)", label: "Warning" },
  low: { bg: "rgba(20,168,138,0.08)", color: "#14a88a", border: "rgba(20,168,138,0.2)", label: "Low" },
};

interface Props {
  item: ReviewItem;
  showRemediation?: boolean;
}

export default function FindingCard({ item, showRemediation = false }: Props) {
  const s = severity[item.severity] ?? severity.low;
  return (
    <Paper sx={{ p: 2, gap: 1, display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Chip
          label={s.label}
          size="small"
          sx={{
            bgcolor: s.bg,
            color: s.color,
            border: `1px solid ${s.border}`,
            height: 20,
            fontSize: "0.6rem",
            "& .MuiChip-label": { px: 1 },
          }}
        />
      </Box>
      <Typography variant="body2" sx={{ lineHeight: 1.55, color: "text.primary" }}>
        {item.description}
      </Typography>
      {showRemediation && (
        <Typography
          variant="caption"
          sx={{ color: "#2376ff", fontWeight: 700, cursor: "pointer", "&:hover": { opacity: 0.75 } }}
        >
          View remediation →
        </Typography>
      )}
    </Paper>
  );
}
