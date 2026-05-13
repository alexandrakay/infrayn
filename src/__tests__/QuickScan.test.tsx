import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import ArchitectureInputPanel from "@/components/ArchitectureInputPanel";
import StructuredAnalysisPanel from "@/components/StructuredAnalysisPanel";
import { ALL_SECTIONS } from "@/lib/types";
import { selectModel, ALLOWED_MODELS } from "@/lib/models";

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

const inputPanelProps = {
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

const minimalReview = {
  summary: "Looks good",
  overall_score: 7,
  strengths: [],
  bottlenecks: [],
  single_points_of_failure: [],
  scaling_concerns: [],
  security_gaps: [],
  quick_wins: [],
};

describe("Quick Scan — input panel toggle", () => {
  it("renders a Quick Scan toggle", () => {
    wrap(<ArchitectureInputPanel {...inputPanelProps} />);
    expect(screen.getByRole("checkbox", { name: /quick scan/i })).toBeInTheDocument();
  });

  it("toggle is unchecked by default", () => {
    wrap(<ArchitectureInputPanel {...inputPanelProps} quickScan={false} />);
    expect(screen.getByRole("checkbox", { name: /quick scan/i })).not.toBeChecked();
  });

  it("toggle is checked when quickScan prop is true", () => {
    wrap(<ArchitectureInputPanel {...inputPanelProps} quickScan={true} />);
    expect(screen.getByRole("checkbox", { name: /quick scan/i })).toBeChecked();
  });

  it("calls onQuickScanChange when toggled", async () => {
    const onQuickScanChange = jest.fn();
    wrap(<ArchitectureInputPanel {...inputPanelProps} onQuickScanChange={onQuickScanChange} />);
    await userEvent.click(screen.getByRole("checkbox", { name: /quick scan/i }));
    expect(onQuickScanChange).toHaveBeenCalledWith(true);
  });
});

describe("Quick Scan — results badge", () => {
  it("shows Quick Scan badge when quickScan is true", () => {
    wrap(
      <StructuredAnalysisPanel
        review={minimalReview}
        loading={false}
        mode="system"
        quickScan={true}
      />
    );
    expect(screen.getByText(/quick scan/i)).toBeInTheDocument();
  });

  it("does not show Quick Scan badge when quickScan is false", () => {
    wrap(
      <StructuredAnalysisPanel
        review={minimalReview}
        loading={false}
        mode="system"
        quickScan={false}
      />
    );
    expect(screen.queryByText(/quick scan/i)).not.toBeInTheDocument();
  });
});

describe("Quick Scan — model selection", () => {
  it("selects haiku when quickScan is true", () => {
    expect(selectModel(true)).toBe("claude-haiku-4-5-20251001");
  });

  it("selects sonnet when quickScan is false", () => {
    expect(selectModel(false)).toBe("claude-sonnet-4-6");
  });

  it("allowlist contains both models", () => {
    expect(ALLOWED_MODELS).toContain("claude-haiku-4-5-20251001");
    expect(ALLOWED_MODELS).toContain("claude-sonnet-4-6");
  });
});
