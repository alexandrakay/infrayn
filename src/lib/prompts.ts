import { ReviewMode, ReviewSection, ALL_SECTIONS } from "./types";

export function buildSystemPrompt(mode: ReviewMode, sections: ReviewSection[] = ALL_SECTIONS): string {
  const has = (s: ReviewSection) => sections.includes(s);

  const sectionFields: string[] = [
    has("bottlenecks") ? `  "bottlenecks": [{ "description": "string", "severity": "high" | "medium" | "low", "remediation": "string" }]` : "",
    has("single_points_of_failure") ? `  "single_points_of_failure": [{ "description": "string", "severity": "high" | "medium" | "low", "remediation": "string" }]` : "",
    has("scaling_concerns") ? `  "scaling_concerns": [{ "description": "string", "severity": "high" | "medium" | "low", "remediation": "string" }]` : "",
    has("security_gaps") ? `  "security_gaps": [{ "description": "string", "severity": "high" | "medium" | "low", "remediation": "string" }]` : "",
    has("quick_wins") ? `  "quick_wins": ["string"]` : "",
  ].filter(Boolean);

  const llmBlock = mode !== "system" ? `  "llm_specific": {
    "model_recommendations": ["string"],
    "hallucination_risks": [{ "description": "string", "severity": "high" | "medium" | "low", "remediation": "string" }],
    "prompt_architecture": ["string"],
    "cost_optimization": ["string"],
    "fallback_strategy": ["string"]
  }` : "";

  const allFields = [
    `  "summary": "string — 2-3 sentence overview"`,
    `  "overall_score": number (0–10)`,
    `  "strengths": ["string"]`,
    ...sectionFields,
    ...(llmBlock ? [llmBlock] : []),
  ];

  return `You are an expert software architect. Analyze the provided system architecture and return a structured JSON review.

Your response must be valid JSON matching this exact shape:
{
${allFields.join(",\n")}
}

Be specific, actionable, and prioritize the most impactful issues. Return only the JSON object, no markdown or prose.`;
}
