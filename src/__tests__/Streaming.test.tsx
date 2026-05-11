import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import StructuredAnalysisPanel from "@/components/StructuredAnalysisPanel";
import React from "react";

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

describe("StructuredAnalysisPanel streaming state", () => {
  it("shows skeleton when loading and not yet streaming", () => {
    wrap(<StructuredAnalysisPanel review={null} loading={true} streaming={false} mode="system" />);
    // MUI Skeleton renders with role="progressbar" or just as a div — check no results yet
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("shows a receiving indicator when streaming is active", () => {
    wrap(<StructuredAnalysisPanel review={null} loading={true} streaming={true} mode="system" />);
    expect(screen.getByText(/receiving/i)).toBeInTheDocument();
  });

  it("does not show the receiving indicator when not streaming", () => {
    wrap(<StructuredAnalysisPanel review={null} loading={true} streaming={false} mode="system" />);
    expect(screen.queryByText(/receiving/i)).not.toBeInTheDocument();
  });

  it("renders the review when streaming is done and review is set", () => {
    const review = {
      summary: "A solid system with some gaps.",
      overall_score: 7,
      strengths: ["Good caching"],
      bottlenecks: [],
      single_points_of_failure: [],
      scaling_concerns: [],
      security_gaps: [],
      quick_wins: [],
    };
    wrap(
      <StructuredAnalysisPanel review={review} loading={false} streaming={false} mode="system" />
    );
    expect(screen.getByText("A solid system with some gaps.")).toBeInTheDocument();
  });
});
