import { ReviewMode } from "./types";

export function buildSystemPrompt(mode: ReviewMode): string {
  const base = `You are an expert software architect. Analyze the provided system architecture and return a structured JSON review.

Your response must be valid JSON matching this exact shape:
{
  "summary": "string — 2-3 sentence overview",
  "overall_score": number (0–10),
  "strengths": ["string"],
  "bottlenecks": [{ "description": "string", "severity": "high" | "medium" | "low" }],
  "single_points_of_failure": [{ "description": "string", "severity": "high" | "medium" | "low" }],
  "scaling_concerns": [{ "description": "string", "severity": "high" | "medium" | "low" }],
  "security_gaps": [{ "description": "string", "severity": "high" | "medium" | "low" }],
  "quick_wins": ["string"]${mode !== "system" ? `,
  "llm_specific": {
    "model_recommendations": ["string"],
    "hallucination_risks": [{ "description": "string", "severity": "high" | "medium" | "low" }],
    "prompt_architecture": ["string"],
    "cost_optimization": ["string"],
    "fallback_strategy": ["string"]
  }` : ""}
}

Be specific, actionable, and prioritize the most impactful issues. Return only the JSON object, no markdown or prose.`;

  return base;
}
