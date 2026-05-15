import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import ReportOutline from "@/components/ReportOutline";
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

describe("ReportOutline", () => {
  it("does not show a Remediation Plan row", () => {
    wrap(<ReportOutline review={baseReview} mode="system" />);
    expect(screen.queryByText("Remediation Plan")).not.toBeInTheDocument();
  });

  it("shows sections that exist in the review output", () => {
    wrap(<ReportOutline review={baseReview} mode="system" />);
    expect(screen.getByText("Executive Summary")).toBeInTheDocument();
    expect(screen.getByText("Bottlenecks")).toBeInTheDocument();
  });
});
