"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { ARCHITECTURE_TEMPLATES, ArchitectureTemplate } from "@/lib/templates";
import { ReviewMode } from "@/lib/types";

interface Props {
  open: boolean;
  mode: ReviewMode;
  onSelect: (template: ArchitectureTemplate) => void;
  onClose: () => void;
}

export default function TemplatePicker({ open, mode, onSelect, onClose }: Props) {
  const suggested = mode === "llm" || mode === "both" ? "llm-pipeline" : null;

  const sorted = suggested
    ? [
        ...ARCHITECTURE_TEMPLATES.filter((t) => t.id === suggested),
        ...ARCHITECTURE_TEMPLATES.filter((t) => t.id !== suggested),
      ]
    : ARCHITECTURE_TEMPLATES;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
        <Typography component="span" variant="h6" sx={{ fontWeight: 700, fontSize: "1rem" }}>
          Start from a template
        </Typography>
        <IconButton size="small" onClick={onClose} aria-label="close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Stack spacing={1.5} sx={{ pb: 1 }}>
          {sorted.map((template) => {
            const isSuggested = template.id === suggested;
            return (
              <Box
                key={template.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelect(template)}
                onKeyDown={(e) => e.key === "Enter" && onSelect(template)}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: isSuggested ? "rgba(35,118,255,0.4)" : "divider",
                  bgcolor: isSuggested ? "rgba(35,118,255,0.04)" : "background.paper",
                  cursor: "pointer",
                  transition: "border-color 0.15s, background-color 0.15s",
                  "&:hover": {
                    borderColor: "rgba(35,118,255,0.5)",
                    bgcolor: "rgba(35,118,255,0.06)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {template.name}
                  </Typography>
                  {isSuggested && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        px: 0.75,
                        py: 0.25,
                        borderRadius: 1,
                        bgcolor: "rgba(35,118,255,0.1)",
                      }}
                    >
                      <AutoAwesomeIcon sx={{ fontSize: 10, color: "#2376ff" }} />
                      <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#2376ff" }}>
                        suggested
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {template.description}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
