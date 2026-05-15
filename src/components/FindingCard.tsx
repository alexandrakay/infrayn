import { useState } from "react";
import { Box, Button, Chip, Collapse, IconButton, Tooltip, Typography, Paper } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { ReviewItem } from "@/lib/types";

const severity = {
  high: { bg: "rgba(239,90,76,0.08)", color: "#ef5a4c", border: "rgba(239,90,76,0.2)", label: "Critical" },
  medium: { bg: "rgba(35,118,255,0.08)", color: "#2376ff", border: "rgba(35,118,255,0.2)", label: "Warning" },
  low: { bg: "rgba(20,168,138,0.08)", color: "#14a88a", border: "rgba(20,168,138,0.2)", label: "Low" },
};

interface Props {
  item: ReviewItem;
  showRemediation?: boolean;
  resolved?: boolean;
  onToggle?: () => void;
  isAuthenticated?: boolean;
}

export default function FindingCard({ item, showRemediation = false, resolved = false, onToggle, isAuthenticated = false }: Props) {
  const [open, setOpen] = useState(false);
  const s = severity[item.severity] ?? severity.low;
  const hasRemediation = showRemediation && !!item.remediation;

  const resolveButton = (
    <IconButton
      size="small"
      onClick={isAuthenticated ? onToggle : undefined}
      disabled={!isAuthenticated}
      aria-label={resolved ? "Mark unresolved" : "Mark resolved"}
      sx={{ p: 0.5, ml: "auto", flexShrink: 0 }}
    >
      {resolved
        ? <CheckCircleIcon sx={{ fontSize: 17, color: "#14a88a" }} />
        : <CheckCircleOutlineIcon sx={{ fontSize: 17, color: "text.disabled" }} />
      }
    </IconButton>
  );

  return (
    <Paper
      sx={{
        p: 2,
        gap: 1,
        display: "flex",
        flexDirection: "column",
        opacity: resolved ? 0.42 : 1,
        transition: "opacity 0.2s",
      }}
    >
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
        {isAuthenticated
          ? resolveButton
          : (
            <Tooltip title="Sign in to track progress" placement="top" arrow>
              <span style={{ marginLeft: "auto" }}>{resolveButton}</span>
            </Tooltip>
          )
        }
      </Box>
      <Typography
        variant="body2"
        sx={{
          lineHeight: 1.55,
          color: "text.primary",
          textDecoration: resolved ? "line-through" : "none",
        }}
      >
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
