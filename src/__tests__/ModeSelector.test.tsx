import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModeSelector from "@/components/ModeSelector";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import React from "react";

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

describe("ModeSelector", () => {
  it("renders all three mode options", () => {
    wrap(<ModeSelector value="system" onChange={() => {}} />);
    expect(screen.getByText("System")).toBeInTheDocument();
    expect(screen.getByText("LLM / AI Pipeline")).toBeInTheDocument();
    expect(screen.getByText("Both")).toBeInTheDocument();
  });

  it("calls onChange with the selected mode when a button is clicked", async () => {
    const onChange = jest.fn();
    wrap(<ModeSelector value="system" onChange={onChange} />);
    await userEvent.click(screen.getByText("LLM / AI Pipeline"));
    expect(onChange).toHaveBeenCalledWith("llm");
  });

  it("does not call onChange when the already-selected mode is clicked", async () => {
    const onChange = jest.fn();
    wrap(<ModeSelector value="system" onChange={onChange} />);
    await userEvent.click(screen.getByText("System"));
    expect(onChange).not.toHaveBeenCalled();
  });
});
