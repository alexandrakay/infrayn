import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { infraynTheme } from "@/lib/theme";

jest.mock("@/components/AppShell", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/components/AuthProvider", () => ({
  useAuth: () => ({ user: { uid: "user-1" }, loading: false }),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));

jest.mock("@/lib/firebase", () => ({
  getClientDb: jest.fn(() => ({})),
}));

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={infraynTheme}>{ui}</ThemeProvider>);

import HistoryPage from "@/app/history/page";

describe("Empty history state", () => {
  it("shows a CTA button to run first review when history is empty", async () => {
    wrap(<HistoryPage />);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /run your first review/i })).toBeInTheDocument()
    );
  });

  it("navigates to /review when the CTA button is clicked", async () => {
    const { getByRole } = wrap(<HistoryPage />);
    const btn = await screen.findByRole("button", { name: /run your first review/i });
    btn.click();
    expect(mockPush).toHaveBeenCalledWith("/review");
  });
});
