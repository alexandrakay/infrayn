import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import StructuredAnalysisPanel from "@/components/StructuredAnalysisPanel";
import { ArchitectureReview } from "@/lib/types";

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

const base: ArchitectureReview = {
  summary: "Solid pipeline.",
  overall_score: 7,
  strengths: [],
  bottlenecks: [],
  single_points_of_failure: [],
  scaling_concerns: [],
  security_gaps: [],
  quick_wins: [],
};

const llmReview: ArchitectureReview = {
  ...base,
  llm_specific: {
    hallucination_risks: [],
    model_recommendations: [],
    prompt_architecture: [],
    cost_optimization: ["Use prompt caching for repeated context", "Batch requests where latency allows"],
    fallback_strategy: ["Fall back to GPT-3.5 on timeout", "Cache last successful response"],
  },
};

describe("Cost Optimization section", () => {
  it("renders cost optimization items in LLM mode", () => {
    wrap(<StructuredAnalysisPanel review={llmReview} loading={false} mode="llm" />);
    expect(screen.getByText("Use prompt caching for repeated context")).toBeInTheDocument();
    expect(screen.getByText("Batch requests where latency allows")).toBeInTheDocument();
  });

  it("renders a Cost Optimization section header", () => {
    wrap(<StructuredAnalysisPanel review={llmReview} loading={false} mode="llm" />);
    expect(screen.getByText(/cost optimization/i)).toBeInTheDocument();
  });

  it("does not render cost optimization section in system mode", () => {
    wrap(<StructuredAnalysisPanel review={llmReview} loading={false} mode="system" />);
    expect(screen.queryByText("Use prompt caching for repeated context")).not.toBeInTheDocument();
  });

  it("does not render cost optimization section when array is empty", () => {
    const review: ArchitectureReview = {
      ...base,
      llm_specific: { ...llmReview.llm_specific!, cost_optimization: [] },
    };
    wrap(<StructuredAnalysisPanel review={review} loading={false} mode="llm" />);
    expect(screen.queryByText(/cost optimization/i)).not.toBeInTheDocument();
  });
});

describe("Fallback Strategy section", () => {
  it("renders fallback strategy items in LLM mode", () => {
    wrap(<StructuredAnalysisPanel review={llmReview} loading={false} mode="llm" />);
    expect(screen.getByText("Fall back to GPT-3.5 on timeout")).toBeInTheDocument();
    expect(screen.getByText("Cache last successful response")).toBeInTheDocument();
  });

  it("renders a Fallback Strategy section header", () => {
    wrap(<StructuredAnalysisPanel review={llmReview} loading={false} mode="llm" />);
    expect(screen.getByText(/fallback strategy/i)).toBeInTheDocument();
  });

  it("does not render fallback strategy section in system mode", () => {
    wrap(<StructuredAnalysisPanel review={llmReview} loading={false} mode="system" />);
    expect(screen.queryByText("Fall back to GPT-3.5 on timeout")).not.toBeInTheDocument();
  });

  it("does not render fallback strategy section when array is empty", () => {
    const review: ArchitectureReview = {
      ...base,
      llm_specific: { ...llmReview.llm_specific!, fallback_strategy: [] },
    };
    wrap(<StructuredAnalysisPanel review={review} loading={false} mode="llm" />);
    expect(screen.queryByText(/fallback strategy/i)).not.toBeInTheDocument();
  });
});
