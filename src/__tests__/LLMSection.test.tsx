import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import StructuredAnalysisPanel from "@/components/StructuredAnalysisPanel";
import React from "react";

const baseReview = {
  summary: "Decent LLM pipeline.",
  overall_score: 6,
  strengths: [],
  bottlenecks: [],
  single_points_of_failure: [],
  scaling_concerns: [],
  security_gaps: [],
  quick_wins: [],
  llm_specific: {
    hallucination_risks: [],
    model_recommendations: [],
    prompt_architecture: [],
    cost_optimization: [],
    fallback_strategy: [],
  },
};

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

describe("LLM-specific section in StructuredAnalysisPanel", () => {
  it("renders model recommendations when present", () => {
    const review = {
      ...baseReview,
      llm_specific: {
        ...baseReview.llm_specific,
        model_recommendations: ["Switch to GPT-4o for classification", "Use Claude for long context"],
      },
    };
    wrap(<StructuredAnalysisPanel review={review} loading={false} mode="llm" />);
    expect(screen.getByText("Switch to GPT-4o for classification")).toBeInTheDocument();
    expect(screen.getByText("Use Claude for long context")).toBeInTheDocument();
  });

  it("renders prompt architecture notes when present", () => {
    const review = {
      ...baseReview,
      llm_specific: {
        ...baseReview.llm_specific,
        prompt_architecture: ["Add chain-of-thought instructions", "Separate system and user prompts"],
      },
    };
    wrap(<StructuredAnalysisPanel review={review} loading={false} mode="llm" />);
    expect(screen.getByText("Add chain-of-thought instructions")).toBeInTheDocument();
    expect(screen.getByText("Separate system and user prompts")).toBeInTheDocument();
  });

  it("hides model recommendations section when array is empty", () => {
    wrap(<StructuredAnalysisPanel review={baseReview} loading={false} mode="llm" />);
    expect(screen.queryByText("Switch to GPT-4o for classification")).not.toBeInTheDocument();
  });

  it("does not render LLM section in system mode", () => {
    const review = {
      ...baseReview,
      llm_specific: {
        ...baseReview.llm_specific,
        model_recommendations: ["Switch to GPT-4o"],
      },
    };
    wrap(<StructuredAnalysisPanel review={review} loading={false} mode="system" />);
    expect(screen.queryByText("Switch to GPT-4o")).not.toBeInTheDocument();
  });
});
