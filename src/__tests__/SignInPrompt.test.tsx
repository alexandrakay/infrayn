import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignInPrompt from "@/components/SignInPrompt";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import React from "react";

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

describe("SignInPrompt", () => {
  it("renders a sign-in call to action", () => {
    wrap(<SignInPrompt onSignIn={() => {}} onDismiss={() => {}} />);
    expect(screen.getByRole("button", { name: /sign in with google/i })).toBeInTheDocument();
  });

  it("calls onSignIn when the sign-in button is clicked", async () => {
    const onSignIn = jest.fn();
    wrap(<SignInPrompt onSignIn={onSignIn} onDismiss={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  it("calls onDismiss when dismissed", async () => {
    const onDismiss = jest.fn();
    wrap(<SignInPrompt onSignIn={() => {}} onDismiss={onDismiss} />);
    await userEvent.click(screen.getByRole("button", { name: /maybe later/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("explains that signing in saves review history", () => {
    wrap(<SignInPrompt onSignIn={() => {}} onDismiss={() => {}} />);
    expect(screen.getByText(/history/i)).toBeInTheDocument();
  });
});
