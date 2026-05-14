import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import { ALL_SECTIONS, ArchitectureReview } from "@/lib/types";

jest.mock("@/components/AppShell", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockArchitectureInputPanel = jest.fn(() => null);
jest.mock("@/components/ArchitectureInputPanel", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => { mockArchitectureInputPanel(props); return null; },
}));

const mockStructuredAnalysisPanel = jest.fn(() => null);
jest.mock("@/components/StructuredAnalysisPanel", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => { mockStructuredAnalysisPanel(props); return null; },
}));

jest.mock("@/components/SignInPrompt", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("@/lib/userPreferences", () => ({
  DEFAULT_PREFERENCES: { mode: "system", sections: ALL_SECTIONS },
  loadUserPreferences: jest.fn().mockResolvedValue({ mode: "system", sections: ALL_SECTIONS }),
  saveUserPreferences: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/lib/userTemplates", () => ({
  loadUserTemplates: jest.fn().mockResolvedValue([]),
  saveUserTemplate: jest.fn(),
  deleteUserTemplate: jest.fn(),
}));

jest.mock("@/components/AuthProvider", () => ({
  useAuth: () => ({ user: null, loading: false, signIn: jest.fn(), signOut: jest.fn() }),
}));

import ReviewWorkbench from "@/app/review/page";

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

const pendingReview: ArchitectureReview = {
  summary: "Loaded from history",
  overall_score: 8,
  strengths: ["Fast"],
  bottlenecks: [],
  single_points_of_failure: [],
  scaling_concerns: [],
  security_gaps: [],
  quick_wins: [],
};

const pendingPayload = {
  review: pendingReview,
  input: "my architecture description from history",
  mode: "llm" as const,
};

beforeEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();
});

describe("Pending review — hydration from sessionStorage", () => {
  it("pre-fills input from pendingReview when present on mount", async () => {
    sessionStorage.setItem("pendingReview", JSON.stringify(pendingPayload));
    wrap(<ReviewWorkbench />);
    await waitFor(() =>
      expect(mockArchitectureInputPanel).toHaveBeenCalledWith(
        expect.objectContaining({ input: "my architecture description from history" })
      )
    );
  });

  it("pre-fills mode from pendingReview when present on mount", async () => {
    sessionStorage.setItem("pendingReview", JSON.stringify(pendingPayload));
    wrap(<ReviewWorkbench />);
    await waitFor(() =>
      expect(mockArchitectureInputPanel).toHaveBeenCalledWith(
        expect.objectContaining({ mode: "llm" })
      )
    );
  });

  it("passes the loaded review to StructuredAnalysisPanel", async () => {
    sessionStorage.setItem("pendingReview", JSON.stringify(pendingPayload));
    wrap(<ReviewWorkbench />);
    await waitFor(() =>
      expect(mockStructuredAnalysisPanel).toHaveBeenCalledWith(
        expect.objectContaining({ review: expect.objectContaining({ summary: "Loaded from history" }) })
      )
    );
  });

  it("clears sessionStorage after reading so a refresh does not re-load the review", async () => {
    sessionStorage.setItem("pendingReview", JSON.stringify(pendingPayload));
    wrap(<ReviewWorkbench />);
    await waitFor(() =>
      expect(mockArchitectureInputPanel).toHaveBeenCalledWith(
        expect.objectContaining({ input: "my architecture description from history" })
      )
    );
    expect(sessionStorage.getItem("pendingReview")).toBeNull();
  });

  it("starts with empty input when no pendingReview in sessionStorage", async () => {
    wrap(<ReviewWorkbench />);
    await waitFor(() => expect(mockArchitectureInputPanel).toHaveBeenCalled());
    expect(mockArchitectureInputPanel).toHaveBeenCalledWith(
      expect.objectContaining({ input: "" })
    );
    expect(mockStructuredAnalysisPanel).toHaveBeenCalledWith(
      expect.objectContaining({ review: null })
    );
  });
});
