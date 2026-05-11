export type ReviewMode = "system" | "llm" | "both";

export type Severity = "high" | "medium" | "low";

export interface ReviewItem {
  description: string;
  severity: Severity;
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
  output: ArchitectureReview;
  createdAt: number;
}

export interface RateLimitEntry {
  count: number;
  windowStart: number;
}
