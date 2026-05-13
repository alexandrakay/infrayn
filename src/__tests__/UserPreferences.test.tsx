import React from "react";
import { render, waitFor, act } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import { ALL_SECTIONS } from "@/lib/types";

jest.mock("@/components/AppShell", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock("@/components/ArchitectureInputPanel", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/components/StructuredAnalysisPanel", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@/components/SignInPrompt", () => ({
  __esModule: true,
  default: () => null,
}));

const mockLoad = jest.fn();
const mockSave = jest.fn();

jest.mock("@/lib/userPreferences", () => ({
  DEFAULT_PREFERENCES: { mode: "system", sections: ALL_SECTIONS },
  loadUserPreferences: (...args: unknown[]) => mockLoad(...args),
  saveUserPreferences: (...args: unknown[]) => mockSave(...args),
}));

jest.mock("@/lib/userTemplates", () => ({
  loadUserTemplates: jest.fn().mockResolvedValue([]),
  saveUserTemplate: jest.fn(),
  deleteUserTemplate: jest.fn(),
}));

const mockUseAuth = jest.fn();
jest.mock("@/components/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

import ReviewWorkbench from "@/app/review/page";

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

const anonAuth = { user: null, loading: false, signIn: jest.fn(), signOut: jest.fn() };

describe("UserPreferences — load on mount", () => {
  beforeEach(() => jest.clearAllMocks());

  it("calls loadUserPreferences with the uid for authenticated users", async () => {
    mockUseAuth.mockReturnValue({ ...anonAuth, user: { uid: "user-abc" } });
    mockLoad.mockResolvedValue({ mode: "llm", sections: ["bottlenecks"] });

    wrap(<ReviewWorkbench />);

    await waitFor(() => expect(mockLoad).toHaveBeenCalledWith("user-abc"));
  });

  it("does not call loadUserPreferences for anonymous users", async () => {
    mockUseAuth.mockReturnValue(anonAuth);

    wrap(<ReviewWorkbench />);
    await act(async () => { await Promise.resolve(); });

    expect(mockLoad).not.toHaveBeenCalled();
  });

  it("saves preferences (debounced) after load for authenticated users", async () => {
    mockUseAuth.mockReturnValue({ ...anonAuth, user: { uid: "user-xyz" } });
    mockLoad.mockResolvedValue({ mode: "both", sections: ALL_SECTIONS });

    wrap(<ReviewWorkbench />);

    // Wait for the 600ms debounce to fire (real timers)
    await waitFor(
      () => expect(mockSave).toHaveBeenCalledWith("user-xyz", { mode: "both", sections: ALL_SECTIONS }),
      { timeout: 2000 }
    );
  });

  it("does not save preferences for anonymous users", async () => {
    mockUseAuth.mockReturnValue(anonAuth);

    wrap(<ReviewWorkbench />);
    await act(async () => { await Promise.resolve(); });

    expect(mockSave).not.toHaveBeenCalled();
  });
});
