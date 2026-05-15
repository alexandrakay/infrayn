import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import StructuredAnalysisPanel from "@/components/StructuredAnalysisPanel";
import { ArchitectureReview } from "@/lib/types";

jest.mock("@/lib/useResolvedFindings", () => ({
  useResolvedFindings: () => ({ resolvedIds: new Set(), toggle: jest.fn() }),
}));

const baseReview: ArchitectureReview = {
  summary: "Solid foundation.",
  overall_score: 7,
  strengths: [],
  bottlenecks: [],
  single_points_of_failure: [],
  scaling_concerns: [],
  security_gaps: [],
  quick_wins: [],
};

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

describe("System name in output panel", () => {
  it("displays the system name when provided", () => {
    wrap(<StructuredAnalysisPanel review={baseReview} loading={false} mode="system" systemName="Payments API" />);
    expect(screen.getByText("Payments API")).toBeInTheDocument();
  });

  it("does not render a name element when systemName is empty", () => {
    wrap(<StructuredAnalysisPanel review={baseReview} loading={false} mode="system" systemName="" />);
    expect(screen.queryByTestId("system-name")).not.toBeInTheDocument();
  });

  it("does not render a name element when systemName is omitted", () => {
    wrap(<StructuredAnalysisPanel review={baseReview} loading={false} mode="system" />);
    expect(screen.queryByTestId("system-name")).not.toBeInTheDocument();
  });
});
