import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import StructuredAnalysisPanel from "@/components/StructuredAnalysisPanel";
import { ArchitectureReview } from "@/lib/types";
import React from "react";

const mockReview: ArchitectureReview = {
  summary: "A reasonable microservices setup with some gaps.",
  overall_score: 7,
  strengths: ["Good separation of concerns", "Stateless API layer"],
  bottlenecks: [{ description: "Database is a single node", severity: "high" }],
  single_points_of_failure: [{ description: "No fallback for auth service", severity: "high" }],
  scaling_concerns: [{ description: "Session store not distributed", severity: "medium" }],
  security_gaps: [{ description: "API keys stored in env vars without rotation", severity: "low" }],
  quick_wins: ["Add a read replica", "Enable connection pooling"],
};

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

beforeEach(() => {
  Object.assign(navigator, {
    clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
  });
});

describe("Copy report button", () => {
  it("renders a Copy report button when a review is present", () => {
    wrap(<StructuredAnalysisPanel review={mockReview} loading={false} mode="system" />);
    expect(screen.getByRole("button", { name: /copy report/i })).toBeInTheDocument();
  });

  it("does not render the copy button when there is no review", () => {
    wrap(<StructuredAnalysisPanel review={null} loading={false} mode="system" />);
    expect(screen.queryByRole("button", { name: /copy report/i })).not.toBeInTheDocument();
  });

  it("copies human-readable text (not raw JSON) to the clipboard", async () => {
    wrap(<StructuredAnalysisPanel review={mockReview} loading={false} mode="system" />);
    await userEvent.click(screen.getByRole("button", { name: /copy report/i }));
    const copied = (navigator.clipboard.writeText as jest.Mock).mock.calls[0][0] as string;
    expect(copied).toContain("Architecture Score: 7/10");
    expect(copied).toContain("A reasonable microservices setup with some gaps.");
    expect(copied).not.toContain('"overall_score"');
  });

  it("includes severity labels in the copied text", async () => {
    wrap(<StructuredAnalysisPanel review={mockReview} loading={false} mode="system" />);
    await userEvent.click(screen.getByRole("button", { name: /copy report/i }));
    const copied = (navigator.clipboard.writeText as jest.Mock).mock.calls[0][0] as string;
    expect(copied).toMatch(/\[HIGH\]/i);
    expect(copied).toMatch(/\[MEDIUM\]/i);
    expect(copied).toMatch(/\[LOW\]/i);
  });

  it("includes all sections in the copied text", async () => {
    wrap(<StructuredAnalysisPanel review={mockReview} loading={false} mode="system" />);
    await userEvent.click(screen.getByRole("button", { name: /copy report/i }));
    const copied = (navigator.clipboard.writeText as jest.Mock).mock.calls[0][0] as string;
    expect(copied).toContain("Bottlenecks");
    expect(copied).toContain("Single Points of Failure");
    expect(copied).toContain("Scaling Concerns");
    expect(copied).toContain("Security Gaps");
    expect(copied).toContain("Strengths");
  });

  it("shows Copied! confirmation state after clicking", async () => {
    wrap(<StructuredAnalysisPanel review={mockReview} loading={false} mode="system" />);
    await userEvent.click(screen.getByRole("button", { name: /copy report/i }));
    expect(await screen.findByRole("button", { name: /copied/i })).toBeInTheDocument();
  });

  it("reverts button text back to Copy report after confirmation", async () => {
    wrap(<StructuredAnalysisPanel review={mockReview} loading={false} mode="system" />);
    await userEvent.click(screen.getByRole("button", { name: /copy report/i }));
    expect(await screen.findByRole("button", { name: /copied/i })).toBeInTheDocument();
    await waitFor(
      () => expect(screen.getByRole("button", { name: /copy report/i })).toBeInTheDocument(),
      { timeout: 3000 }
    );
  }, 8000);
});
