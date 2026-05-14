import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import StructuredAnalysisPanel from "@/components/StructuredAnalysisPanel";
import { ArchitectureReview } from "@/lib/types";

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

const mockReview: ArchitectureReview = {
  summary: "Solid foundation with some gaps.",
  overall_score: 6,
  strengths: ["Good separation of concerns", "Clear ownership"],
  bottlenecks: [
    { description: "DB connection pool too small", severity: "high", remediation: "Increase pool size" },
    { description: "Sync writes in hot path", severity: "medium", remediation: "Queue writes" },
    { description: "No read replicas", severity: "low", remediation: "Add replicas" },
  ],
  single_points_of_failure: [
    { description: "Single Redis instance", severity: "high", remediation: "Add sentinel" },
  ],
  scaling_concerns: [
    { description: "Stateful sessions", severity: "medium", remediation: "Use JWT" },
    { description: "No CDN", severity: "low", remediation: "Add CDN" },
  ],
  security_gaps: [],
  quick_wins: ["Enable gzip", "Add caching headers"],
};

describe("Collapsible sections — collapse/expand", () => {
  it("renders section contents expanded by default", () => {
    wrap(<StructuredAnalysisPanel review={mockReview} loading={false} mode="system" />);
    expect(screen.getByText("DB connection pool too small")).toBeInTheDocument();
  });

  it("collapses a section when its header is clicked", async () => {
    wrap(<StructuredAnalysisPanel review={mockReview} loading={false} mode="system" />);
    const header = screen.getByRole("button", { name: /bottlenecks/i });
    await userEvent.click(header);
    expect(screen.queryByText("DB connection pool too small")).not.toBeInTheDocument();
  });

  it("re-expands a section when its header is clicked again", async () => {
    wrap(<StructuredAnalysisPanel review={mockReview} loading={false} mode="system" />);
    const header = screen.getByRole("button", { name: /bottlenecks/i });
    await userEvent.click(header);
    await userEvent.click(header);
    expect(screen.getByText("DB connection pool too small")).toBeInTheDocument();
  });

  it("collapsing one section does not affect other sections", async () => {
    wrap(<StructuredAnalysisPanel review={mockReview} loading={false} mode="system" />);
    const header = screen.getByRole("button", { name: /bottlenecks/i });
    await userEvent.click(header);
    expect(screen.getByText("Single Redis instance")).toBeInTheDocument();
  });
});

describe("Collapsible sections — item count", () => {
  it("shows item count in section header when collapsed", async () => {
    wrap(<StructuredAnalysisPanel review={mockReview} loading={false} mode="system" />);
    const header = screen.getByRole("button", { name: /bottlenecks/i });
    await userEvent.click(header);
    expect(screen.getByRole("button", { name: /bottlenecks \(3\)/i })).toBeInTheDocument();
  });

  it("does not show item count when section is expanded", () => {
    wrap(<StructuredAnalysisPanel review={mockReview} loading={false} mode="system" />);
    expect(screen.queryByText(/bottlenecks \(3\)/i)).not.toBeInTheDocument();
  });

  it("shows correct count for a section with 1 item", async () => {
    wrap(<StructuredAnalysisPanel review={mockReview} loading={false} mode="system" />);
    const header = screen.getByRole("button", { name: /single points of failure/i });
    await userEvent.click(header);
    expect(screen.getByRole("button", { name: /single points of failure \(1\)/i })).toBeInTheDocument();
  });
});

describe("Collapsible sections — LLM section", () => {
  const llmReview: ArchitectureReview = {
    ...mockReview,
    llm_specific: {
      hallucination_risks: [
        { description: "No output validation", severity: "high", remediation: "Add schema validation" },
        { description: "Unbounded context", severity: "medium", remediation: "Truncate context" },
      ],
      model_recommendations: ["Use GPT-4 for reasoning"],
      prompt_architecture: ["Add few-shot examples"],
    },
  };

  it("LLM Pipeline Analysis section is collapsible", async () => {
    wrap(<StructuredAnalysisPanel review={llmReview} loading={false} mode="llm" />);
    const header = screen.getByRole("button", { name: /llm pipeline analysis/i });
    await userEvent.click(header);
    expect(screen.queryByText("No output validation")).not.toBeInTheDocument();
  });

  it("LLM section shows item count when collapsed", async () => {
    wrap(<StructuredAnalysisPanel review={llmReview} loading={false} mode="llm" />);
    const header = screen.getByRole("button", { name: /llm pipeline analysis/i });
    await userEvent.click(header);
    expect(screen.getByRole("button", { name: /llm pipeline analysis \(2\)/i })).toBeInTheDocument();
  });
});
