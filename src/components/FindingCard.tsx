import { useState } from "react";
import { Box, Button, Chip, Collapse, Typography, Paper } from "@mui/material";
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
  const [open, setOpen] = useState(false);
  const s = severity[item.severity] ?? severity.low;
  const hasRemediation = showRemediation && !!item.remediation;

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
      {hasRemediation && (
        <>
          <Button
            size="small"
            variant="text"
            onClick={() => setOpen((v) => !v)}
            sx={{
              alignSelf: "flex-start",
              p: 0,
              minWidth: 0,
              color: "#2376ff",
              fontWeight: 700,
              fontSize: "0.75rem",
              textTransform: "none",
              "&:hover": { bgcolor: "transparent", opacity: 0.75 },
            }}
          >
            {open ? "Hide remediation →" : "View remediation →"}
          </Button>
          <Collapse in={open} timeout={0} unmountOnExit>
            <Box
              sx={{
                mt: 0.5,
                pl: 1.5,
                borderLeft: "2px solid rgba(35,118,255,0.3)",
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {item.remediation}
              </Typography>
            </Box>
          </Collapse>
        </>
      )}
    </Paper>
  );
}
