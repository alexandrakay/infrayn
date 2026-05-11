"use client";

import { Box, Button, Stack, TextField, Typography, Alert } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ModeSelector from "./ModeSelector";
import { ReviewMode } from "@/lib/types";

const BLUEPRINT = `
  linear-gradient(rgba(35, 118, 255, 0.045) 1px, transparent 1px),
  linear-gradient(90deg, rgba(35, 118, 255, 0.045) 1px, transparent 1px)
`;

interface Props {
  input: string;
  mode: ReviewMode;
  loading: boolean;
  error: string;
  systemName: string;
  onInputChange: (v: string) => void;
  onModeChange: (m: ReviewMode) => void;
  onSystemNameChange: (v: string) => void;
  onSubmit: () => void;
}

export default function ArchitectureInputPanel({
  input, mode, loading, error, systemName, onInputChange, onModeChange, onSystemNameChange, onSubmit,
}: Props) {
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
    </Box>
  );
}
