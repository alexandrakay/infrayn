import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import React from "react";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/components/AuthProvider", () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from "@/components/AuthProvider";
import LandingPage from "@/app/page";

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("LandingPage", () => {
  it("renders the hero headline for unauthenticated users", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, signIn: jest.fn() });
    wrap(<LandingPage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("shows a Try it free CTA for anonymous users", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, signIn: jest.fn() });
    wrap(<LandingPage />);
    expect(screen.getByRole("button", { name: /try it free/i })).toBeInTheDocument();
  });

  it("shows a Sign in CTA for anonymous users", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, signIn: jest.fn() });
    wrap(<LandingPage />);
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("redirects authenticated users to /review", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { uid: "abc" }, signIn: jest.fn() });
    wrap(<LandingPage />);
    expect(mockPush).toHaveBeenCalledWith("/review");
  });

  it("navigates to /review when Try it free is clicked", async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, signIn: jest.fn() });
    wrap(<LandingPage />);
    await userEvent.click(screen.getByRole("button", { name: /try it free/i }));
    expect(mockPush).toHaveBeenCalledWith("/review");
  });

  it("calls signIn when Sign in button is clicked", async () => {
    const signIn = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({ user: null, signIn });
    wrap(<LandingPage />);
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(signIn).toHaveBeenCalledTimes(1);
  });
});
