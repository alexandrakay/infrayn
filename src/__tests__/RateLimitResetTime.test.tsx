import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import ArchitectureInputPanel from "@/components/ArchitectureInputPanel";
import { ALL_SECTIONS } from "@/lib/types";

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

const baseProps = {
  input: "some arch",
  mode: "system" as const,
  sections: ALL_SECTIONS,
  loading: false,
  error: "",
  systemName: "",
  quickScan: false,
  remainingReviews: 0,
  onInputChange: jest.fn(),
  onModeChange: jest.fn(),
  onSectionsChange: jest.fn(),
  onSystemNameChange: jest.fn(),
  onQuickScanChange: jest.fn(),
  onSubmit: jest.fn(),
};

describe("Rate limit reset time display", () => {
  it("shows static fallback when resetInSeconds is not provided", () => {
    wrap(<ArchitectureInputPanel {...baseProps} />);
    expect(screen.getByRole("button", { name: /resets in 1 hour/i })).toBeInTheDocument();
  });

  it("shows minutes when resetInSeconds >= 60", () => {
    wrap(<ArchitectureInputPanel {...baseProps} resetInSeconds={720} />);
    expect(screen.getByRole("button", { name: /resets in 12 min/i })).toBeInTheDocument();
  });

  it("shows '< 1 min' when resetInSeconds < 60", () => {
    wrap(<ArchitectureInputPanel {...baseProps} resetInSeconds={45} />);
    expect(screen.getByRole("button", { name: /resets in < 1 min/i })).toBeInTheDocument();
  });

  it("shows '1 min' (not '1 mins') for exactly 60 seconds", () => {
    wrap(<ArchitectureInputPanel {...baseProps} resetInSeconds={60} />);
    expect(screen.getByRole("button", { name: /resets in 1 min$/i })).toBeInTheDocument();
  });
});
