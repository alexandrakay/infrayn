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
import SignInPage from "@/app/sign-in/page";

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("SignInPage", () => {
  it("renders the Infrayn brand name", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, signIn: jest.fn() });
    wrap(<SignInPage />);
    expect(screen.getByText(/infrayn/i)).toBeInTheDocument();
  });

  it("renders a Sign in with Google button", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, signIn: jest.fn() });
    wrap(<SignInPage />);
    expect(screen.getByRole("button", { name: /sign in with google/i })).toBeInTheDocument();
  });

  it("calls signIn when the button is clicked", async () => {
    const signIn = jest.fn();
    (useAuth as jest.Mock).mockReturnValue({ user: null, signIn });
    wrap(<SignInPage />);
    await userEvent.click(screen.getByRole("button", { name: /sign in with google/i }));
    expect(signIn).toHaveBeenCalledTimes(1);
  });

  it("redirects authenticated users to /review", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { uid: "abc" }, signIn: jest.fn() });
    wrap(<SignInPage />);
    expect(mockPush).toHaveBeenCalledWith("/review");
  });
});
