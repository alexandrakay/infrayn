import { formatReviewAsMarkdown } from "@/lib/formatReview";
import { ArchitectureReview } from "@/lib/types";

const baseReview: ArchitectureReview = {
  summary: "Solid foundation with some gaps.",
  overall_score: 7,
  strengths: ["Good separation of concerns"],
  bottlenecks: [{ description: "DB pool too small", severity: "high" }],
  single_points_of_failure: [{ description: "Single Redis", severity: "medium" }],
  scaling_concerns: [],
  security_gaps: [{ description: "No rate limiting", severity: "high" }],
  quick_wins: ["Enable gzip"],
  llm_specific: {
    model_recommendations: ["Use GPT-4"],
    hallucination_risks: [{ description: "No output validation", severity: "high" }],
    prompt_architecture: ["Add few-shot examples"],
    cost_optimization: [],
    fallback_strategy: [],
  },
};

describe("formatReviewAsMarkdown", () => {
  it("includes the system name as an H1 heading when provided", () => {
    const md = formatReviewAsMarkdown(baseReview, "system", "Payments API");
    expect(md).toContain("# Payments API");
  });

  it("includes the overall score", () => {
    const md = formatReviewAsMarkdown(baseReview, "system");
    expect(md).toContain("7/10");
  });

  it("includes finding descriptions with severity labels", () => {
    const md = formatReviewAsMarkdown(baseReview, "system");
    expect(md).toContain("DB pool too small");
    expect(md).toContain("HIGH");
  });

  it("includes quick wins as bullet points", () => {
    const md = formatReviewAsMarkdown(baseReview, "system");
    expect(md).toContain("- Enable gzip");
  });

  it("omits LLM section when mode is system", () => {
    const md = formatReviewAsMarkdown(baseReview, "system");
    expect(md).not.toContain("LLM");
  });

  it("includes LLM section when mode is llm", () => {
    const md = formatReviewAsMarkdown(baseReview, "llm");
    expect(md).toContain("LLM");
    expect(md).toContain("Use GPT-4");
  });
});
