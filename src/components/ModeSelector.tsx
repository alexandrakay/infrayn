"use client";

import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ReviewMode } from "@/lib/types";

const modes: { value: ReviewMode; label: string }[] = [
  { value: "system", label: "System" },
  { value: "llm", label: "LLM / AI Pipeline" },
  { value: "both", label: "Both" },
];

interface Props {
  value: ReviewMode;
  onChange: (mode: ReviewMode) => void;
}

export default function ModeSelector({ value, onChange }: Props) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, val) => val && onChange(val)}
      size="small"
    >
      {modes.map((mode) => (
        <ToggleButton key={mode.value} value={mode.value}>
          {mode.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
