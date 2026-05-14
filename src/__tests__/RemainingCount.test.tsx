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
  onInputChange: jest.fn(),
  onModeChange: jest.fn(),
  onSectionsChange: jest.fn(),
  onSystemNameChange: jest.fn(),
  onQuickScanChange: jest.fn(),
  onSubmit: jest.fn(),
};

describe("Remaining count — indicator display", () => {
  it("shows no remaining indicator when remainingReviews is null (before first review)", () => {
    wrap(<ArchitectureInputPanel {...baseProps} remainingReviews={null} />);
    expect(screen.queryByText(/reviews left/i)).not.toBeInTheDocument();
  });

  it("shows no remaining indicator when remainingReviews is undefined", () => {
    wrap(<ArchitectureInputPanel {...baseProps} />);
    expect(screen.queryByText(/reviews left/i)).not.toBeInTheDocument();
  });

  it("shows remaining count after first review completes", () => {
    wrap(<ArchitectureInputPanel {...baseProps} remainingReviews={18} />);
    expect(screen.getByText(/18 reviews left/i)).toBeInTheDocument();
  });

  it("shows '1 review left' (singular) when 1 remaining", () => {
    wrap(<ArchitectureInputPanel {...baseProps} remainingReviews={1} />);
    expect(screen.getByText(/1 review left/i)).toBeInTheDocument();
  });

  it("shows '0 reviews left' when limit reached", () => {
    wrap(<ArchitectureInputPanel {...baseProps} remainingReviews={0} />);
    expect(screen.getByText(/0 reviews left/i)).toBeInTheDocument();
  });
});

describe("Remaining count — submit button state", () => {
  it("submit button is enabled when remainingReviews is null", () => {
    wrap(<ArchitectureInputPanel {...baseProps} remainingReviews={null} />);
    expect(screen.getByRole("button", { name: /run architecture review/i })).not.toBeDisabled();
  });

  it("submit button is enabled when remainingReviews > 0", () => {
    wrap(<ArchitectureInputPanel {...baseProps} remainingReviews={5} />);
    expect(screen.getByRole("button", { name: /run architecture review/i })).not.toBeDisabled();
  });

  it("submit button is disabled when remainingReviews === 0", () => {
    wrap(<ArchitectureInputPanel {...baseProps} remainingReviews={0} />);
    expect(screen.getByRole("button", { name: /limit reached/i })).toBeDisabled();
  });
});
