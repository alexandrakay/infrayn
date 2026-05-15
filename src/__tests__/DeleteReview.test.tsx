import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import React from "react";
import SystemHistory from "@/components/SystemHistory";
import { SavedReview } from "@/lib/types";

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

const makeReview = (id: string, systemName = "My System"): SavedReview => ({
  id,
  userId: "user1",
  mode: "system",
  input: "some input",
  systemName,
  output: {
    summary: "Summary",
    overall_score: 7,
    strengths: [],
    bottlenecks: [],
    single_points_of_failure: [],
    scaling_concerns: [],
    security_gaps: [],
    quick_wins: [],
  },
  createdAt: Date.now(),
});

describe("Delete review from history", () => {
  it("renders a delete button for each review card", () => {
    const reviews = [makeReview("1"), makeReview("2")];
    wrap(<SystemHistory reviews={reviews} onOpen={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getAllByRole("button", { name: /delete/i })).toHaveLength(2);
  });

  it("calls onDelete with the review id when delete is clicked", async () => {
    const onDelete = jest.fn();
    wrap(<SystemHistory reviews={[makeReview("rev-42")]} onOpen={jest.fn()} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith("rev-42");
  });

  it("does not render delete buttons when onDelete is not provided", () => {
    wrap(<SystemHistory reviews={[makeReview("1")]} onOpen={jest.fn()} />);
    expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
  });
});
