import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import FindingCard from "@/components/FindingCard";
import { ReviewItem } from "@/lib/types";

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

const itemWithRemediation: ReviewItem = {
  description: "Single database with no replicas creates a SPOF",
  severity: "high",
  remediation: "Add read replicas and configure automatic failover with a managed service like RDS Multi-AZ.",
};

const itemNoRemediation: ReviewItem = {
  description: "No rate limiting on public endpoints",
  severity: "medium",
};

describe("FindingCard — remediation toggle", () => {
  it("shows 'View remediation →' button when remediation text is present and showRemediation is true", () => {
    wrap(<FindingCard item={itemWithRemediation} showRemediation />);
    expect(screen.getByRole("button", { name: /view remediation/i })).toBeInTheDocument();
  });

  it("does not show remediation button when item has no remediation text", () => {
    wrap(<FindingCard item={itemNoRemediation} showRemediation />);
    expect(screen.queryByRole("button", { name: /view remediation/i })).not.toBeInTheDocument();
  });

  it("does not show remediation button when showRemediation prop is false", () => {
    wrap(<FindingCard item={itemWithRemediation} showRemediation={false} />);
    expect(screen.queryByRole("button", { name: /view remediation/i })).not.toBeInTheDocument();
  });

  it("remediation text is hidden initially", () => {
    wrap(<FindingCard item={itemWithRemediation} showRemediation />);
    expect(screen.queryByText(itemWithRemediation.remediation!)).not.toBeInTheDocument();
  });

  it("clicking the button reveals the remediation text", async () => {
    wrap(<FindingCard item={itemWithRemediation} showRemediation />);
    await userEvent.click(screen.getByRole("button", { name: /view remediation/i }));
    expect(screen.getByText(itemWithRemediation.remediation!)).toBeInTheDocument();
  });

  it("button label changes to 'Hide remediation' when expanded", async () => {
    wrap(<FindingCard item={itemWithRemediation} showRemediation />);
    await userEvent.click(screen.getByRole("button", { name: /view remediation/i }));
    expect(screen.getByRole("button", { name: /hide remediation/i })).toBeInTheDocument();
  });

  it("clicking again collapses the remediation text", async () => {
    wrap(<FindingCard item={itemWithRemediation} showRemediation />);
    const btn = screen.getByRole("button", { name: /view remediation/i });
    await userEvent.click(btn);
    await userEvent.click(screen.getByRole("button", { name: /hide remediation/i }));
    expect(screen.queryByText(itemWithRemediation.remediation!)).not.toBeInTheDocument();
  });
});
