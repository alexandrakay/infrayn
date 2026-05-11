"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { infraynTheme } from "@/lib/theme";

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={infraynTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
