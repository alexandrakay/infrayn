import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import ArchitectureInputPanel from "@/components/ArchitectureInputPanel";
import { ALL_SECTIONS } from "@/lib/types";

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

const baseProps = {
  mode: "system" as const,
  sections: ALL_SECTIONS,
  loading: false,
  error: "",
  systemName: "",
  quickScan: false,
  onInputChange: jest.fn(),
  onModeChange: jest.fn(),
  onSectionsChange: jest.fn(),
  onSystemNameChange: jest.fn(),
  onQuickScanChange: jest.fn(),
  onSubmit: jest.fn(),
};

describe("Short input warning", () => {
  it("shows warning when input is non-empty but below threshold", () => {
    wrap(<ArchitectureInputPanel {...baseProps} input="short" />);
    expect(screen.getByText(/short descriptions produce shallow reviews/i)).toBeInTheDocument();
  });

  it("does not show warning when input is empty", () => {
    wrap(<ArchitectureInputPanel {...baseProps} input="" />);
    expect(screen.queryByText(/short descriptions produce shallow reviews/i)).not.toBeInTheDocument();
  });

  it("does not show warning when input meets the threshold", () => {
    const longInput = "a".repeat(50);
    wrap(<ArchitectureInputPanel {...baseProps} input={longInput} />);
    expect(screen.queryByText(/short descriptions produce shallow reviews/i)).not.toBeInTheDocument();
  });

  it("shows warning at 49 characters but not at 50", () => {
    const at49 = "a".repeat(49);
    const at50 = "a".repeat(50);
    const { rerender } = wrap(<ArchitectureInputPanel {...baseProps} input={at49} />);
    expect(screen.getByText(/short descriptions produce shallow reviews/i)).toBeInTheDocument();
    rerender(<ThemeProvider theme={infraynTheme}><ArchitectureInputPanel {...baseProps} input={at50} /></ThemeProvider>);
    expect(screen.queryByText(/short descriptions produce shallow reviews/i)).not.toBeInTheDocument();
  });
});
