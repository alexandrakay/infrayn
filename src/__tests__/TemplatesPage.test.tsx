import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";

jest.mock("@/components/AppShell", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({ useRouter: () => ({ push: mockPush }) }));

const mockUseAuth = jest.fn();
jest.mock("@/components/AuthProvider", () => ({ useAuth: () => mockUseAuth() }));

const mockLoadUserTemplates = jest.fn();
const mockDeleteUserTemplate = jest.fn();
jest.mock("@/lib/userTemplates", () => ({
  loadUserTemplates: (...a: unknown[]) => mockLoadUserTemplates(...a),
  deleteUserTemplate: (...a: unknown[]) => mockDeleteUserTemplate(...a),
}));

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

const authUser = { uid: "u1", displayName: "Alex", email: "a@b.com", photoURL: null };
const authedState = { user: authUser, loading: false, signIn: jest.fn(), signOut: jest.fn() };
const anonState = { user: null, loading: false, signIn: jest.fn(), signOut: jest.fn() };

const userTemplates = [
  { id: "t1", name: "My Monolith", content: "System: monolith with postgres", createdAt: 1000 },
  { id: "t2", name: "My Pipeline", content: "LLM pipeline using Claude", createdAt: 900 },
];

import TemplatesPage from "@/app/templates/page";

beforeEach(() => {
  jest.clearAllMocks();
  sessionStorage.clear();
  mockLoadUserTemplates.mockResolvedValue(userTemplates);
  mockDeleteUserTemplate.mockResolvedValue(undefined);
});

describe("Templates page — built-in templates", () => {
  it("shows built-in templates for unauthenticated users", async () => {
    mockUseAuth.mockReturnValue(anonState);
    wrap(<TemplatesPage />);
    await waitFor(() => expect(screen.getByText(/microservices/i)).toBeInTheDocument());
  });

  it("shows built-in templates for authenticated users too", async () => {
    mockUseAuth.mockReturnValue(authedState);
    wrap(<TemplatesPage />);
    await waitFor(() => expect(screen.getByText(/microservices/i)).toBeInTheDocument());
  });
});

describe("Templates page — user templates (authenticated)", () => {
  beforeEach(() => mockUseAuth.mockReturnValue(authedState));

  it("loads and shows user templates", async () => {
    wrap(<TemplatesPage />);
    await waitFor(() => expect(screen.getByText("My Monolith")).toBeInTheDocument());
    expect(screen.getByText("My Pipeline")).toBeInTheDocument();
  });

  it("calls loadUserTemplates with the uid", async () => {
    wrap(<TemplatesPage />);
    await waitFor(() => expect(mockLoadUserTemplates).toHaveBeenCalledWith("u1"));
  });

  it("calls deleteUserTemplate and removes template when delete clicked", async () => {
    wrap(<TemplatesPage />);
    await waitFor(() => expect(screen.getByText("My Monolith")).toBeInTheDocument());
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await userEvent.click(deleteButtons[0]);
    expect(mockDeleteUserTemplate).toHaveBeenCalledWith("u1", "t1");
    await waitFor(() => expect(screen.queryByText("My Monolith")).not.toBeInTheDocument());
  });
});

describe("Templates page — unauthenticated", () => {
  it("does not show My Templates section for unauthenticated users", async () => {
    mockUseAuth.mockReturnValue(anonState);
    wrap(<TemplatesPage />);
    await waitFor(() => expect(screen.getByText(/microservices/i)).toBeInTheDocument());
    expect(screen.queryByText(/my templates/i)).not.toBeInTheDocument();
    expect(mockLoadUserTemplates).not.toHaveBeenCalled();
  });
});

describe("Templates page — use template navigation", () => {
  it("writes template content to sessionStorage and navigates to /review on Use", async () => {
    mockUseAuth.mockReturnValue(authedState);
    wrap(<TemplatesPage />);
    await waitFor(() => expect(screen.getByText("My Monolith")).toBeInTheDocument());
    const useButtons = screen.getAllByRole("button", { name: /use/i });
    await userEvent.click(useButtons[0]);
    const stored = sessionStorage.getItem("pendingTemplate");
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!)).toMatchObject({ content: "System: monolith with postgres" });
    expect(mockPush).toHaveBeenCalledWith("/review");
  });

  it("navigating to /review via a built-in template also sets sessionStorage", async () => {
    mockUseAuth.mockReturnValue(anonState);
    wrap(<TemplatesPage />);
    await waitFor(() => expect(screen.getByText(/microservices/i)).toBeInTheDocument());
    const useButtons = screen.getAllByRole("button", { name: /use/i });
    await userEvent.click(useButtons[0]);
    const stored = sessionStorage.getItem("pendingTemplate");
    expect(stored).not.toBeNull();
    expect(mockPush).toHaveBeenCalledWith("/review");
  });
});
