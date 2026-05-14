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
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockUseAuth = jest.fn();
jest.mock("@/components/AuthProvider", () => ({
  useAuth: () => mockUseAuth(),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

const fakeUser = {
  uid: "user-123",
  displayName: "Alex Myers",
  email: "alex@example.com",
  photoURL: "https://example.com/photo.jpg",
};

const mockSignOut = jest.fn();

import SettingsPage from "@/app/settings/page";

beforeEach(() => {
  jest.clearAllMocks();
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ used: 5, limit: 20, windowStart: Date.now() - 1000 }),
  });
});

describe("Settings page — unauthenticated redirect", () => {
  it("redirects to /sign-in when user is not authenticated", async () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false, signIn: jest.fn(), signOut: jest.fn() });
    wrap(<SettingsPage />);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/sign-in"));
  });

  it("does not redirect when user is authenticated", async () => {
    mockUseAuth.mockReturnValue({ user: fakeUser, loading: false, signIn: jest.fn(), signOut: mockSignOut });
    wrap(<SettingsPage />);
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(mockPush).not.toHaveBeenCalledWith("/sign-in");
  });
});

describe("Settings page — account info", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: fakeUser, loading: false, signIn: jest.fn(), signOut: mockSignOut });
  });

  it("shows the user's display name", async () => {
    wrap(<SettingsPage />);
    await waitFor(() => expect(screen.getByText("Alex Myers")).toBeInTheDocument());
  });

  it("shows the user's email", async () => {
    wrap(<SettingsPage />);
    await waitFor(() => expect(screen.getByText("alex@example.com")).toBeInTheDocument());
  });

  it("has a sign-out button", () => {
    wrap(<SettingsPage />);
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
  });

  it("calls signOut and redirects to / when sign-out is clicked", async () => {
    mockSignOut.mockResolvedValue(undefined);
    wrap(<SettingsPage />);
    await userEvent.click(screen.getByRole("button", { name: /sign out/i }));
    expect(mockSignOut).toHaveBeenCalled();
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/"));
  });
});

describe("Settings page — usage display", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: fakeUser, loading: false, signIn: jest.fn(), signOut: mockSignOut });
  });

  it("fetches usage data on mount", async () => {
    wrap(<SettingsPage />);
    await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/usage"),
      expect.anything()
    ));
  });

  it("shows reviews used and limit", async () => {
    wrap(<SettingsPage />);
    await waitFor(() => expect(screen.getByText(/5.*of.*20/i)).toBeInTheDocument());
  });
});
