"use client";

import { useState } from "react";
import { Box, Button, Checkbox, FormControlLabel, Stack, TextField, Typography, Alert } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import ModeSelector from "./ModeSelector";
import TemplatePicker from "./TemplatePicker";
import FocusSelector from "./FocusSelector";
import { ArchitectureTemplate } from "@/lib/templates";
import { ReviewMode, ReviewSection } from "@/lib/types";

const BLUEPRINT = `
  linear-gradient(rgba(35, 118, 255, 0.045) 1px, transparent 1px),
  linear-gradient(90deg, rgba(35, 118, 255, 0.045) 1px, transparent 1px)
`;

interface Props {
  input: string;
  mode: ReviewMode;
  sections: ReviewSection[];
  loading: boolean;
  error: string;
  systemName: string;
  quickScan: boolean;
  onInputChange: (v: string) => void;
  onModeChange: (m: ReviewMode) => void;
  onSectionsChange: (s: ReviewSection[]) => void;
  onSystemNameChange: (v: string) => void;
  onQuickScanChange: (v: boolean) => void;
  onSubmit: () => void;
}

export default function ArchitectureInputPanel({
  input, mode, sections, loading, error, systemName, quickScan, onInputChange, onModeChange, onSectionsChange, onSystemNameChange, onQuickScanChange, onSubmit,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleTemplateSelect = (template: ArchitectureTemplate) => {
    onInputChange(template.content);
    setPickerOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRight: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        p: 3,
        gap: 2.5,
      }}
    >
      {/* Headline */}
      <Box sx={{ flexShrink: 0 }}>
        <Typography variant="h1" sx={{ mb: 1, color: "text.primary" }}>
          Pressure-test your system before production does.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Paste a description, ADR, Terraform summary, or LLM pipeline design.
        </Typography>
      </Box>

      {/* System name + Mode toggle */}
      <Box sx={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="System name (optional, e.g. auth service)"
          value={systemName}
          onChange={(e) => onSystemNameChange(e.target.value)}
          sx={{ "& .MuiOutlinedInput-root": { fontSize: "0.83rem" } }}
        />
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Review lens
          </Typography>
          <ModeSelector value={mode} onChange={onModeChange} />
        </Box>
        <FocusSelector sections={sections} onChange={onSectionsChange} />
      </Box>

      {/* Template picker trigger */}
      <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="overline" color="text.secondary">
          Architecture description
        </Typography>
        <Button
          size="small"
          variant="text"
          startIcon={<DashboardCustomizeIcon sx={{ fontSize: 14 }} />}
          onClick={() => setPickerOpen(true)}
          sx={{ fontSize: "0.7rem", color: "text.secondary", textTransform: "none", minWidth: 0 }}
        >
          Start from a template
        </Button>
      </Box>

      {/* Blueprint textarea — fills remaining space, scrolls internally */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          borderRadius: 3,
          backgroundImage: BLUEPRINT,
          backgroundSize: "28px 28px",
          backgroundColor: "#eef4fc",
          boxShadow:
            "inset 7px 7px 14px rgba(77,91,124,0.16), inset -7px -7px 14px rgba(255,255,255,0.7)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TextField
          multiline
          fullWidth
          placeholder="Paste an architecture description, ADR, Terraform summary, diagram notes, or LLM pipeline design."
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          variant="standard"
          slotProps={{
            input: {
              disableUnderline: true,
              sx: {
                p: 2,
                fontSize: "0.83rem",
                fontFamily: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
                color: "text.primary",
                alignItems: "flex-start",
                bgcolor: "transparent",
                boxShadow: "none",
                height: "100%",
                overflow: "auto",
              },
            },
          }}
          sx={{
            flex: 1,
            "& .MuiInputBase-root": {
              bgcolor: "transparent",
              boxShadow: "none",
              height: "100%",
            },
            "& .MuiInputBase-input": {
              height: "100% !important",
              overflowY: "auto !important",
              boxSizing: "border-box",
            },
          }}
        />
      </Box>

      {error && <Alert severity="error" sx={{ flexShrink: 0 }}>{error}</Alert>}

      <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={quickScan}
              onChange={(e) => onQuickScanChange(e.target.checked)}
              sx={{ color: quickScan ? "#f5a623" : undefined, "&.Mui-checked": { color: "#f5a623" } }}
            />
          }
          label={
            <Typography
              variant="body2"
              title="Faster, lower-cost review using Claude Haiku. Less detailed than a full review."
              sx={{ fontSize: "0.8rem", color: quickScan ? "#f5a623" : "text.secondary", fontWeight: quickScan ? 600 : 400 }}
            >
              Quick Scan
            </Typography>
          }
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        onClick={onSubmit}
        disabled={loading || !input.trim()}
        startIcon={<PlayArrowIcon />}
        sx={{ flexShrink: 0 }}
      >
        {loading ? "Analyzing..." : "Run architecture review"}
      </Button>

      <TemplatePicker
        open={pickerOpen}
        mode={mode}
        onSelect={handleTemplateSelect}
        onClose={() => setPickerOpen(false)}
      />
    </Box>
  );
}
