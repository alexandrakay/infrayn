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
  onInputChange: (v: string) => void;
  onModeChange: (m: ReviewMode) => void;
  onSubmit: () => void;
}

export default function ArchitectureInputPanel({
  input, mode, loading, error, onInputChange, onModeChange, onSubmit,
}: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRight: "1px solid",
        borderColor: "divider",
        overflow: "auto",
        p: 3,
        gap: 2.5,
      }}
    >
      {/* Headline */}
      <Box>
        <Typography variant="h1" sx={{ mb: 1, color: "text.primary" }}>
          Pressure-test your system before production does.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Paste a description, ADR, Terraform summary, or LLM pipeline design.
        </Typography>
      </Box>

      {/* Mode toggle */}
      <Box>
        <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 1 }}>
          Review lens
        </Typography>
        <ModeSelector value={mode} onChange={onModeChange} />
      </Box>

      {/* Blueprint textarea */}
      <Box
        sx={{
          flexGrow: 1,
          borderRadius: 3,
          backgroundImage: BLUEPRINT,
          backgroundSize: "28px 28px",
          backgroundColor: "#eef4fc",
          boxShadow:
            "inset 7px 7px 14px rgba(77,91,124,0.16), inset -7px -7px 14px rgba(255,255,255,0.7)",
          minHeight: 260,
        }}
      >
        <TextField
          multiline
          fullWidth
          minRows={12}
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
              },
            },
          }}
          sx={{ "& .MuiInputBase-root": { bgcolor: "transparent", boxShadow: "none" } }}
        />
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        onClick={onSubmit}
        disabled={loading || !input.trim()}
        startIcon={<PlayArrowIcon />}
      >
        {loading ? "Analyzing..." : "Run architecture review"}
      </Button>
    </Box>
  );
}
