import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import React from "react";
import ArchitectureInputPanel from "@/components/ArchitectureInputPanel";
import SystemHistory from "@/components/SystemHistory";
import { SavedReview } from "@/lib/types";

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

const baseProps = {
  input: "",
  mode: "system" as const,
  loading: false,
  error: "",
  systemName: "",
  onInputChange: jest.fn(),
  onModeChange: jest.fn(),
  onSystemNameChange: jest.fn(),
  onSubmit: jest.fn(),
};

const makeReview = (id: string, systemName: string, score: number, createdAt: number): SavedReview => ({
  id,
  userId: "user1",
  mode: "system",
  input: "some input",
  systemName,
  output: {
    summary: "Summary",
    overall_score: score,
    strengths: [],
    bottlenecks: [],
    single_points_of_failure: [],
    scaling_concerns: [],
    security_gaps: [],
    quick_wins: [],
  },
  createdAt,
});

describe("System name field", () => {
  it("renders a system name input on the intake form", () => {
    wrap(<ArchitectureInputPanel {...baseProps} />);
    expect(screen.getByPlaceholderText(/system name/i)).toBeInTheDocument();
  });

  it("calls onSystemNameChange when the system name field changes", async () => {
    const onSystemNameChange = jest.fn();
    wrap(<ArchitectureInputPanel {...baseProps} onSystemNameChange={onSystemNameChange} />);
    await userEvent.type(screen.getByPlaceholderText(/system name/i), "auth");
    expect(onSystemNameChange).toHaveBeenCalled();
  });

  it("system name field is optional — submit is not blocked when empty", () => {
    wrap(<ArchitectureInputPanel {...baseProps} input="some text" />);
    expect(screen.getByRole("button", { name: /run architecture review/i })).not.toBeDisabled();
  });
});

describe("SystemHistory component", () => {
  const reviews = [
    makeReview("1", "auth service", 4, 1000),
    makeReview("2", "auth service", 6, 2000),
    makeReview("3", "auth service", 7, 3000),
    makeReview("4", "e-commerce backend", 5, 4000),
    makeReview("5", "", 8, 5000),
  ];

  it("groups reviews by system name", () => {
    wrap(<SystemHistory reviews={reviews} onOpen={jest.fn()} />);
    expect(screen.getByText("auth service")).toBeInTheDocument();
    expect(screen.getByText("e-commerce backend")).toBeInTheDocument();
  });

  it("shows score trend for grouped systems", () => {
    wrap(<SystemHistory reviews={reviews} onOpen={jest.fn()} />);
    expect(screen.getByText(/4.*6.*7/s)).toBeInTheDocument();
  });

  it("renders ungrouped reviews under an Unnamed fallback", () => {
    wrap(<SystemHistory reviews={reviews} onOpen={jest.fn()} />);
    expect(screen.getByText(/unnamed/i)).toBeInTheDocument();
  });

  it("calls onOpen when a review entry is clicked", async () => {
    const onOpen = jest.fn();
    wrap(<SystemHistory reviews={reviews} onOpen={onOpen} />);
    await userEvent.click(screen.getAllByRole("button")[0]);
    expect(onOpen).toHaveBeenCalled();
  });
});
