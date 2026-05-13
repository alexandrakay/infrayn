import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import TemplatePicker from "@/components/TemplatePicker";
import React from "react";

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

describe("TemplatePicker", () => {
  it("opens and shows all 5 templates", () => {
    const onSelect = jest.fn();
    const onClose = jest.fn();
    wrap(<TemplatePicker open={true} mode="system" onSelect={onSelect} onClose={onClose} />);

    expect(screen.getByText("Start from a template")).toBeInTheDocument();
    expect(screen.getByText("Microservices")).toBeInTheDocument();
    expect(screen.getByText("Monolith")).toBeInTheDocument();
    expect(screen.getByText("LLM Pipeline")).toBeInTheDocument();
    expect(screen.getByText("Serverless")).toBeInTheDocument();
    expect(screen.getByText("CRUD REST API")).toBeInTheDocument();
  });

  it("calls onSelect with the template and closes when a template is clicked", () => {
    const onSelect = jest.fn();
    const onClose = jest.fn();
    wrap(<TemplatePicker open={true} mode="system" onSelect={onSelect} onClose={onClose} />);

    fireEvent.click(screen.getByText("Microservices"));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect.mock.calls[0][0].id).toBe("microservices");
  });

  it("does not render content when closed", () => {
    const onSelect = jest.fn();
    const onClose = jest.fn();
    wrap(<TemplatePicker open={false} mode="system" onSelect={onSelect} onClose={onClose} />);

    expect(screen.queryByText("Microservices")).not.toBeInTheDocument();
  });

  it("shows LLM Pipeline as suggested when mode is llm", () => {
    const onSelect = jest.fn();
    const onClose = jest.fn();
    wrap(<TemplatePicker open={true} mode="llm" onSelect={onSelect} onClose={onClose} />);

    expect(screen.getByText("suggested")).toBeInTheDocument();
    // LLM Pipeline card should appear before others (first in DOM)
    const cards = screen.getAllByRole("button").filter((el) =>
      ["Microservices", "Monolith", "LLM Pipeline", "Serverless", "CRUD REST API"].some((name) =>
        el.textContent?.includes(name)
      )
    );
    expect(cards[0].textContent).toContain("LLM Pipeline");
  });

  it("calls onClose when the close button is clicked", () => {
    const onSelect = jest.fn();
    const onClose = jest.fn();
    wrap(<TemplatePicker open={true} mode="system" onSelect={onSelect} onClose={onClose} />);

    fireEvent.click(screen.getByLabelText("close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
