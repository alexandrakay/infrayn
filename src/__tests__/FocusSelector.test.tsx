import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import FocusSelector from "@/components/FocusSelector";
import { ALL_SECTIONS, ReviewSection } from "@/lib/types";
import { buildSystemPrompt } from "@/lib/prompts";
import React from "react";

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

describe("FocusSelector", () => {
  it("is collapsed by default and shows no checkboxes", () => {
    const onChange = jest.fn();
    wrap(<FocusSelector sections={ALL_SECTIONS} onChange={onChange} />);
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("expands when clicked and shows all 5 section checkboxes", () => {
    const onChange = jest.fn();
    wrap(<FocusSelector sections={ALL_SECTIONS} onChange={onChange} />);
    fireEvent.click(screen.getByText("Focus"));
    expect(screen.getAllByRole("checkbox")).toHaveLength(5);
  });

  it("calls onChange with section removed when a checked box is unchecked", () => {
    const onChange = jest.fn();
    wrap(<FocusSelector sections={ALL_SECTIONS} onChange={onChange} />);
    fireEvent.click(screen.getByText("Focus"));
    fireEvent.click(screen.getByLabelText("Bottlenecks"));
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining(ALL_SECTIONS.filter((s) => s !== "bottlenecks"))
    );
    expect(onChange.mock.calls[0][0]).not.toContain("bottlenecks");
  });

  it("prevents unchecking the last remaining section", () => {
    const onChange = jest.fn();
    const onlyOne: ReviewSection[] = ["quick_wins"];
    wrap(<FocusSelector sections={onlyOne} onChange={onChange} />);
    fireEvent.click(screen.getByText("Focus"));
    const checkbox = screen.getByLabelText("Quick Wins");
    expect(checkbox).toBeDisabled();
    fireEvent.click(checkbox);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("shows a section count badge when not all sections are selected", () => {
    const onChange = jest.fn();
    const partial: ReviewSection[] = ["bottlenecks", "security_gaps"];
    wrap(<FocusSelector sections={partial} onChange={onChange} />);
    expect(screen.getByText("2/5")).toBeInTheDocument();
  });
});

describe("buildSystemPrompt with sections", () => {
  it("omits a section field when that section is excluded", () => {
    const prompt = buildSystemPrompt("system", ["bottlenecks", "security_gaps", "quick_wins"]);
    expect(prompt).toContain("bottlenecks");
    expect(prompt).not.toContain("single_points_of_failure");
    expect(prompt).not.toContain("scaling_concerns");
  });

  it("includes all fields when all sections provided", () => {
    const prompt = buildSystemPrompt("system", ALL_SECTIONS);
    expect(prompt).toContain("bottlenecks");
    expect(prompt).toContain("single_points_of_failure");
    expect(prompt).toContain("scaling_concerns");
    expect(prompt).toContain("security_gaps");
    expect(prompt).toContain("quick_wins");
  });

  it("defaults to all sections when none provided", () => {
    const prompt = buildSystemPrompt("system");
    expect(prompt).toContain("bottlenecks");
    expect(prompt).toContain("quick_wins");
  });
});
