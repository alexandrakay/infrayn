export const ALLOWED_MODELS = ["claude-sonnet-4-6", "claude-haiku-4-5-20251001"] as const;
export type AllowedModel = (typeof ALLOWED_MODELS)[number];

export function selectModel(quickScan: boolean): AllowedModel {
  return quickScan ? "claude-haiku-4-5-20251001" : "claude-sonnet-4-6";
}
