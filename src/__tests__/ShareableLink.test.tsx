import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import StructuredAnalysisPanel from "@/components/StructuredAnalysisPanel";
import { ArchitectureReview } from "@/lib/types";

jest.mock("@/lib/useResolvedFindings", () => ({
  useResolvedFindings: () => ({ resolvedIds: new Set(), toggle: jest.fn() }),
}));

const baseReview: ArchitectureReview = {
  summary: "Solid architecture.",
  overall_score: 8,
  strengths: ["Good separation of concerns"],
  bottlenecks: [],
  single_points_of_failure: [],
  scaling_concerns: [],
  security_gaps: [],
  quick_wins: [],
};

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

describe("Copy link button", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
    });
  });

  it("shows Copy link button when reviewId is provided", () => {
    wrap(<StructuredAnalysisPanel review={baseReview} loading={false} mode="system" reviewId="abc123" />);
    expect(screen.getByRole("button", { name: /copy link/i })).toBeInTheDocument();
  });

  it("does not show Copy link button when reviewId is null", () => {
    wrap(<StructuredAnalysisPanel review={baseReview} loading={false} mode="system" reviewId={null} />);
    expect(screen.queryByRole("button", { name: /copy link/i })).not.toBeInTheDocument();
  });

  it("copies the correct shareable URL to clipboard when clicked", async () => {
    wrap(<StructuredAnalysisPanel review={baseReview} loading={false} mode="system" reviewId="abc123" />);
    await userEvent.click(screen.getByRole("button", { name: /copy link/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining("/r/abc123"));
  });
});
