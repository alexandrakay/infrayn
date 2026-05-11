import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import PressureMap from "@/components/PressureMap";
import { ArchitectureReview } from "@/lib/types";
import React from "react";

const emptyReview: ArchitectureReview = {
  summary: "All clear.",
  overall_score: 9,
  strengths: [],
  bottlenecks: [],
  single_points_of_failure: [],
  scaling_concerns: [],
  security_gaps: [],
  quick_wins: [],
};

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

describe("PressureMap", () => {
  it("renders all four pressure zones", () => {
    wrap(<PressureMap review={emptyReview} />);
    expect(screen.getByText(/bottlenecks/i)).toBeInTheDocument();
    expect(screen.getByText(/single points/i)).toBeInTheDocument();
    expect(screen.getByText(/security/i)).toBeInTheDocument();
    expect(screen.getByText(/scaling/i)).toBeInTheDocument();
  });

  it("shows finding count for a zone with findings", () => {
    const review: ArchitectureReview = {
      ...emptyReview,
      bottlenecks: [
        { severity: "high", description: "DB connection pool exhaustion", remediation: "" },
        { severity: "medium", description: "Slow auth middleware", remediation: "" },
      ],
    };
    wrap(<PressureMap review={review} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("does not show the Preview chip", () => {
    wrap(<PressureMap review={emptyReview} />);
    expect(screen.queryByText("Preview")).not.toBeInTheDocument();
  });

  it("shows zero count for empty zones", () => {
    wrap(<PressureMap review={emptyReview} />);
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBe(4);
  });
});
