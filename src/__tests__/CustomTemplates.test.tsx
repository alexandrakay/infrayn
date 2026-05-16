import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";
import TemplatePicker from "@/components/TemplatePicker";
import ArchitectureInputPanel from "@/components/ArchitectureInputPanel";
import { ALL_SECTIONS } from "@/lib/types";
import { UserTemplate } from "@/lib/userTemplates";

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

const userTemplates: UserTemplate[] = [
  { id: "ut1", name: "My Auth Service", content: "auth service desc", createdAt: 1000 },
  { id: "ut2", name: "My Gateway", content: "gateway desc", createdAt: 2000 },
];

// ── TemplatePicker: My Templates section ─────────────────────────────────────

describe("TemplatePicker — custom templates", () => {
  it("shows a My Templates section when user templates are provided", () => {
    wrap(
      <TemplatePicker
        open={true}
        mode="system"
        onSelect={jest.fn()}
        onClose={jest.fn()}
        userTemplates={userTemplates}
        onDeleteTemplate={jest.fn()}
      />
    );
    expect(screen.getByText("My Templates")).toBeInTheDocument();
  });

  it("renders user template names", () => {
    wrap(
      <TemplatePicker
        open={true}
        mode="system"
        onSelect={jest.fn()}
        onClose={jest.fn()}
        userTemplates={userTemplates}
        onDeleteTemplate={jest.fn()}
      />
    );
    expect(screen.getByText("My Auth Service")).toBeInTheDocument();
    expect(screen.getByText("My Gateway")).toBeInTheDocument();
  });

  it("does not show My Templates section when user templates are empty", () => {
    wrap(
      <TemplatePicker
        open={true}
        mode="system"
        onSelect={jest.fn()}
        onClose={jest.fn()}
        userTemplates={[]}
        onDeleteTemplate={jest.fn()}
      />
    );
    expect(screen.queryByText("My Templates")).not.toBeInTheDocument();
  });

  it("calls onSelect with the user template content when clicked", () => {
    const onSelect = jest.fn();
    wrap(
      <TemplatePicker
        open={true}
        mode="system"
        onSelect={onSelect}
        onClose={jest.fn()}
        userTemplates={userTemplates}
        onDeleteTemplate={jest.fn()}
      />
    );
    fireEvent.click(screen.getByText("My Auth Service"));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ content: "auth service desc" })
    );
  });

  it("renders delete buttons for user templates", () => {
    wrap(
      <TemplatePicker
        open={true}
        mode="system"
        onSelect={jest.fn()}
        onClose={jest.fn()}
        userTemplates={userTemplates}
        onDeleteTemplate={jest.fn()}
      />
    );
    expect(screen.getAllByLabelText(/delete template/i)).toHaveLength(2);
  });

  it("calls onDeleteTemplate with the template id when delete is clicked", () => {
    const onDeleteTemplate = jest.fn();
    wrap(
      <TemplatePicker
        open={true}
        mode="system"
        onSelect={jest.fn()}
        onClose={jest.fn()}
        userTemplates={userTemplates}
        onDeleteTemplate={onDeleteTemplate}
      />
    );
    const deleteButtons = screen.getAllByLabelText(/delete template/i);
    fireEvent.click(deleteButtons[0]);
    expect(onDeleteTemplate).toHaveBeenCalledWith("ut1");
  });
});

// ── ArchitectureInputPanel: Save as template button ──────────────────────────

const baseProps = {
  input: "some architecture",
  mode: "system" as const,
  sections: ALL_SECTIONS,
  loading: false,
  error: "",
  systemName: "",
  onInputChange: jest.fn(),
  onModeChange: jest.fn(),
  onSectionsChange: jest.fn(),
  onSystemNameChange: jest.fn(),
  onSaveTemplate: jest.fn(),
  onSubmit: jest.fn(),
  quickScan: false,
  onQuickScanChange: jest.fn(),
};

describe("ArchitectureInputPanel — save as template", () => {
  it("shows Save as template button when authenticated and input is non-empty", () => {
    wrap(<ArchitectureInputPanel {...baseProps} isAuthenticated={true} />);
    expect(screen.getByRole("button", { name: /save as template/i })).toBeInTheDocument();
  });

  it("hides Save as template button for anonymous users", () => {
    wrap(<ArchitectureInputPanel {...baseProps} isAuthenticated={false} />);
    expect(screen.queryByRole("button", { name: /save as template/i })).not.toBeInTheDocument();
  });

  it("hides Save as template button when input is empty", () => {
    wrap(<ArchitectureInputPanel {...baseProps} isAuthenticated={true} input="" />);
    expect(screen.queryByRole("button", { name: /save as template/i })).not.toBeInTheDocument();
  });

  it("shows name prompt when Save as template is clicked", async () => {
    wrap(<ArchitectureInputPanel {...baseProps} isAuthenticated={true} />);
    await userEvent.click(screen.getByRole("button", { name: /save as template/i }));
    expect(screen.getByPlaceholderText(/template name/i)).toBeInTheDocument();
  });

  it("calls onSaveTemplate with the name when confirmed", async () => {
    const onSaveTemplate = jest.fn();
    wrap(<ArchitectureInputPanel {...baseProps} isAuthenticated={true} onSaveTemplate={onSaveTemplate} />);
    await userEvent.click(screen.getByRole("button", { name: /save as template/i }));
    await userEvent.type(screen.getByPlaceholderText(/template name/i), "My Custom Template");
    await userEvent.click(screen.getByRole("button", { name: /^save$/i }));
    expect(onSaveTemplate).toHaveBeenCalledWith("My Custom Template");
  });
});
