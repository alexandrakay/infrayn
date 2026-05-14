export type ReviewMode = "system" | "llm" | "both";

export type ReviewSection =
  | "bottlenecks"
  | "single_points_of_failure"
  | "scaling_concerns"
  | "security_gaps"
  | "quick_wins";

export const ALL_SECTIONS: ReviewSection[] = [
  "bottlenecks",
  "single_points_of_failure",
  "scaling_concerns",
  "security_gaps",
  "quick_wins",
];

export const SECTION_LABELS: Record<ReviewSection, string> = {
  bottlenecks: "Bottlenecks",
  single_points_of_failure: "Single Points of Failure",
  scaling_concerns: "Scaling Concerns",
  security_gaps: "Security Gaps",
  quick_wins: "Quick Wins",
};

export type Severity = "high" | "medium" | "low";

export interface ReviewItem {
  description: string;
  severity: Severity;
  remediation?: string;
}

export interface LLMSpecific {
  model_recommendations: string[];
  hallucination_risks: ReviewItem[];
  prompt_architecture: string[];
  cost_optimization: string[];
  fallback_strategy: string[];
}

export interface ArchitectureReview {
  summary: string;
  overall_score: number;
  strengths: string[];
  bottlenecks: ReviewItem[];
  single_points_of_failure: ReviewItem[];
  scaling_concerns: ReviewItem[];
  security_gaps: ReviewItem[];
  quick_wins: string[];
  llm_specific?: LLMSpecific;
}

export interface SavedReview {
  id: string;
  userId: string;
  mode: ReviewMode;
  input: string;
  systemName?: string;
  output: ArchitectureReview;
  createdAt: number;
}

export interface UserPreferences {
  mode: ReviewMode;
  sections: ReviewSection[];
}

export interface RateLimitEntry {
  count: number;
  windowStart: number;
}
