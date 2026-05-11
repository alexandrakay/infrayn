import { createTheme } from "@mui/material/styles";

export const infraynTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0b1020",
      light: "#172033",
      dark: "#070b18",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#2376ff",
      light: "#16b9d4",
      dark: "#7257ff",
      contrastText: "#ffffff",
    },
    success: { main: "#14a88a" },
    warning: { main: "#2376ff" },
    error: { main: "#ef5a4c" },
    info: { main: "#7257ff" },
    background: {
      default: "#edf3fb",
      paper: "#f8fbff",
    },
    text: {
      primary: "#111827",
      secondary: "#657084",
    },
    divider: "rgba(17, 24, 39, 0.1)",
  },
  shape: { borderRadius: 18 },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Segoe UI", sans-serif',
    h1: {
      fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)",
      lineHeight: 1.08,
      fontWeight: 850,
      letterSpacing: "-0.02em",
    },
    h2: { fontSize: "1.35rem", fontWeight: 850, letterSpacing: 0 },
    button: { textTransform: "none" as const, fontWeight: 700 },
    overline: { fontWeight: 850, letterSpacing: "0.12em" },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage:
            "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(226,234,246,0.82))",
          border: "1px solid rgba(255,255,255,0.46)",
          boxShadow:
            "10px 10px 24px rgba(78,91,120,0.2), -10px -10px 24px rgba(255,255,255,0.92)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          borderRadius: 16,
          minHeight: 44,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
          ...(ownerState.variant === "contained" &&
            ownerState.color === "primary" && {
              backgroundImage:
                "linear-gradient(135deg, #16213d 0%, #0b1020 52%, #151134 100%)",
            }),
        }),
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          padding: 6,
          borderRadius: 16,
          backgroundColor: "#e2e9f4",
          boxShadow:
            "inset 4px 4px 8px rgba(75,91,124,0.16), inset -4px -4px 8px rgba(255,255,255,0.66)",
          border: "none",
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: "0 !important",
          borderRadius: "12px !important",
          fontWeight: 700,
          fontSize: "0.8rem",
          px: 2,
          color: "#657084",
          "&.Mui-selected": {
            backgroundColor: "#f8fbff",
            color: "#111827",
            boxShadow:
              "4px 4px 9px rgba(78,91,120,0.18), -4px -4px 9px rgba(255,255,255,0.72)",
            "&:hover": { backgroundColor: "#f8fbff" },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          backgroundColor: "#eef4fc",
          boxShadow:
            "inset 7px 7px 14px rgba(77,91,124,0.16), inset -7px -7px 14px rgba(255,255,255,0.7)",
          "& fieldset": { border: "none" },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700 },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundImage:
            "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(226,234,246,0.82))",
          border: "1px solid rgba(255,255,255,0.46)",
          boxShadow:
            "10px 10px 24px rgba(78,91,120,0.2), -10px -10px 24px rgba(255,255,255,0.92)",
          borderRadius: "18px !important",
          "&:before": { display: "none" },
        },
      },
    },
  },
});
