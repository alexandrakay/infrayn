"use client";

import { useState } from "react";
import {
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { ReviewSection, ALL_SECTIONS, SECTION_LABELS } from "@/lib/types";

interface Props {
  sections: ReviewSection[];
  onChange: (sections: ReviewSection[]) => void;
}

export default function FocusSelector({ sections, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const toggle = (section: ReviewSection) => {
    if (sections.includes(section)) {
      if (sections.length === 1) return; // guard: at least one must remain
      onChange(sections.filter((s) => s !== section));
    } else {
      onChange([...sections, section]);
    }
  };

  const allOn = sections.length === ALL_SECTIONS.length;

  return (
    <Box sx={{ flexShrink: 0 }}>
      <Box
        role="button"
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => e.key === "Enter" && setOpen((v) => !v)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Typography variant="overline" color="text.secondary">
            Focus
          </Typography>
          {!allOn && (
            <Box
              sx={{
                px: 0.75,
                py: 0.1,
                borderRadius: 1,
                bgcolor: "rgba(35,118,255,0.1)",
              }}
            >
              <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: "#2376ff" }}>
                {sections.length}/{ALL_SECTIONS.length}
              </Typography>
            </Box>
          )}
        </Box>
        {open ? (
          <ExpandLessIcon sx={{ fontSize: 16, color: "text.disabled" }} />
        ) : (
          <ExpandMoreIcon sx={{ fontSize: 16, color: "text.disabled" }} />
        )}
      </Box>

      <Collapse in={open}>
        <Box sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 0.25 }}>
          {ALL_SECTIONS.map((section) => {
            const checked = sections.includes(section);
            const isLast = checked && sections.length === 1;
            return (
              <FormControlLabel
                key={section}
                control={
                  <Checkbox
                    size="small"
                    checked={checked}
                    disabled={isLast}
                    onChange={() => toggle(section)}
                    sx={{ py: 0.25 }}
                  />
                }
                label={
                  <Typography variant="body2" color={isLast ? "text.disabled" : "text.secondary"} sx={{ fontSize: "0.8rem" }}>
                    {SECTION_LABELS[section]}
                  </Typography>
                }
              />
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
}
