import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import StructuredAnalysisPanel from "@/components/StructuredAnalysisPanel";
import { ArchitectureReview } from "@/lib/types";

jest.mock("@/lib/useResolvedFindings", () => ({
  useResolvedFindings: jest.fn(),
}));

import { useResolvedFindings } from "@/lib/useResolvedFindings";
const mockUseResolvedFindings = useResolvedFindings as jest.Mock;

const mockReview: ArchitectureReview = {
  summary: "Test summary.",
  overall_score: 6,
  strengths: [],
  bottlenecks: [
    { description: "DB too slow", severity: "high" },
    { description: "No caching", severity: "medium" },
    { description: "Sync writes", severity: "low" },
  ],
  single_points_of_failure: [],
  scaling_concerns: [],
  security_gaps: [],
  quick_wins: [],
};

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

describe("Resolved progress in section headers", () => {
  it("shows resolved count when at least one finding is resolved", () => {
    mockUseResolvedFindings.mockReturnValue({
      resolvedIds: new Set(["bottlenecks:0"]),
      toggle: jest.fn(),
    });
    wrap(<StructuredAnalysisPanel review={mockReview} loading={false} mode="system" reviewId="abc" isAuthenticated />);
    expect(screen.getByText("1/3 resolved")).toBeInTheDocument();
  });

  it("does not show resolved count when nothing is resolved", () => {
    mockUseResolvedFindings.mockReturnValue({
      resolvedIds: new Set(),
      toggle: jest.fn(),
    });
    wrap(<StructuredAnalysisPanel review={mockReview} loading={false} mode="system" reviewId="abc" isAuthenticated />);
    expect(screen.queryByText(/resolved/i)).not.toBeInTheDocument();
  });

  it("shows correct count when multiple findings are resolved", () => {
    mockUseResolvedFindings.mockReturnValue({
      resolvedIds: new Set(["bottlenecks:0", "bottlenecks:2"]),
      toggle: jest.fn(),
    });
    wrap(<StructuredAnalysisPanel review={mockReview} loading={false} mode="system" reviewId="abc" isAuthenticated />);
    expect(screen.getByText("2/3 resolved")).toBeInTheDocument();
  });
});
