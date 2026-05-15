import { ArchitectureReview, ReviewItem, ReviewMode } from "./types";

function findingLines(items: ReviewItem[]): string[] {
  return items.map((item) => `- **[${item.severity.toUpperCase()}]** ${item.description}`);
}

export function formatReviewAsMarkdown(
  review: ArchitectureReview,
  mode: ReviewMode,
  systemName?: string
): string {
  const lines: string[] = [];

  if (systemName?.trim()) lines.push(`# ${systemName.trim()}`, "");

  lines.push(`## Architecture Review`, "");
  lines.push(`**Score:** ${review.overall_score}/10`, "");
  lines.push(review.summary, "");

  if (review.strengths.length > 0) {
    lines.push("## Strengths", "");
    review.strengths.forEach((s) => lines.push(`- ${s}`));
    lines.push("");
  }

  if (review.bottlenecks.length > 0) {
    lines.push("## Bottlenecks", "");
    lines.push(...findingLines(review.bottlenecks), "");
  }

  if (review.single_points_of_failure.length > 0) {
    lines.push("## Single Points of Failure", "");
    lines.push(...findingLines(review.single_points_of_failure), "");
  }

  if (review.scaling_concerns.length > 0) {
    lines.push("## Scaling Concerns", "");
    lines.push(...findingLines(review.scaling_concerns), "");
  }

  if (review.security_gaps.length > 0) {
    lines.push("## Security Gaps", "");
    lines.push(...findingLines(review.security_gaps), "");
  }

  if (review.quick_wins.length > 0) {
    lines.push("## Quick Wins", "");
    review.quick_wins.forEach((w) => lines.push(`- ${w}`));
    lines.push("");
  }

  if (mode !== "system" && review.llm_specific) {
    const llm = review.llm_specific;
    lines.push("## LLM Pipeline Analysis", "");

    if (llm.hallucination_risks.length > 0) {
      lines.push("### Hallucination Risks", "");
      lines.push(...findingLines(llm.hallucination_risks), "");
    }
    if (llm.model_recommendations.length > 0) {
      lines.push("### Model Recommendations", "");
      llm.model_recommendations.forEach((r) => lines.push(`- ${r}`));
      lines.push("");
    }
    if (llm.prompt_architecture.length > 0) {
      lines.push("### Prompt Architecture", "");
      llm.prompt_architecture.forEach((r) => lines.push(`- ${r}`));
      lines.push("");
    }
    if ((llm.cost_optimization?.length ?? 0) > 0) {
      lines.push("### Cost Optimization", "");
      llm.cost_optimization.forEach((r) => lines.push(`- ${r}`));
      lines.push("");
    }
    if ((llm.fallback_strategy?.length ?? 0) > 0) {
      lines.push("### Fallback Strategy", "");
      llm.fallback_strategy.forEach((r) => lines.push(`- ${r}`));
      lines.push("");
    }
  }

  return lines.join("\n").trim();
}
