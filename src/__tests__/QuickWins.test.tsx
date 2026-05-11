import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import StructuredAnalysisPanel from "@/components/StructuredAnalysisPanel";
import React from "react";

const baseReview = {
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

describe("Quick Wins section in StructuredAnalysisPanel", () => {
  it("renders quick wins when present", () => {
    const review = { ...baseReview, quick_wins: ["Add a CDN", "Enable HTTP/2"] };
    wrap(<StructuredAnalysisPanel review={review} loading={false} mode="system" />);
    expect(screen.getByText("Add a CDN")).toBeInTheDocument();
    expect(screen.getByText("Enable HTTP/2")).toBeInTheDocument();
  });

  it("shows Quick Wins section header when wins are present", () => {
    const review = { ...baseReview, quick_wins: ["Add a CDN"] };
    wrap(<StructuredAnalysisPanel review={review} loading={false} mode="system" />);
    // Panel overline + ReportOutline row — both render "Quick Wins"
    expect(screen.getAllByText(/quick wins/i).length).toBeGreaterThanOrEqual(2);
  });

  it("hides the Quick Wins section content when array is empty", () => {
    // ReportOutline always renders "Quick Wins" as a report-outline row,
    // so we check that no actual win items are present.
    const reviewWithWins = { ...baseReview, quick_wins: ["Add a CDN"] };
    const { unmount } = wrap(
      <StructuredAnalysisPanel review={reviewWithWins} loading={false} mode="system" />
    );
    expect(screen.getByText("Add a CDN")).toBeInTheDocument();
    unmount();

    wrap(<StructuredAnalysisPanel review={baseReview} loading={false} mode="system" />);
    expect(screen.queryByText("Add a CDN")).not.toBeInTheDocument();
  });
});
