import { createTheme } from "@mui/material/styles";

// Material Design 3 + Bauhaus Hybrid Theme - Single Color Theme
// Adaptive text colors with proper contrast ratios as per prompt.txt line 7-8, 52-53
export const createMentalHealthTheme = () => createTheme({
  palette: {
    mode: 'light', // Single theme only as per prompt.txt line 47
    primary: {
      main: "#6750A4", // Material Design 3 primary - calming purple for health professional theme
      light: "#E8DEF8",
      dark: "#4F378B",
      contrastText: "#FFFFFF", // High contrast white text
    },
    secondary: {
      main: "#4A9C47", // Material Design 3 secondary - healing green for psychological counseling
      light: "#E8F5E8",
      dark: "#2E7D32",
      contrastText: "#FFFFFF", // High contrast white text
    },
    background: {
      default: "#FEF7FF", // Material Design 3 surface container - health professional theme
      paper: "#FFFFFF", // Material Design 3 surface
    },
    text: {
      primary: "#1C1B1F", // Material Design 3 on-surface - adaptive high contrast
      secondary: "#49454F", // Material Design 3 on-surface-variant - adaptive good contrast
    },
    divider: "#CAC4D0", // Material Design 3 outline
    action: {
      hover: "rgba(103, 80, 164, 0.08)", // Material Design 3 hover
      selected: "rgba(103, 80, 164, 0.12)",
      disabled: "rgba(28, 27, 31, 0.38)", // Material Design 3 disabled
      disabledBackground: "rgba(28, 27, 31, 0.12)", // Material Design 3 disabled background
    },
    // Material Design 3 semantic colors with proper contrast
    success: {
      main: "#4CAF50", // Material Design 3 success
      light: "#C8E6C9",
      dark: "#388E3C",
      contrastText: "#FFFFFF", // High contrast white text
    },
    warning: {
      main: "#FF9800", // Material Design 3 warning
      light: "#FFE0B2",
      dark: "#F57C00",
      contrastText: "#000000", // High contrast black text
    },
    info: {
      main: "#2196F3", // Material Design 3 info
      light: "#BBDEFB",
      dark: "#1976D2",
      contrastText: "#FFFFFF", // High contrast white text
    },
    error: {
      main: "#F44336", // Material Design 3 error
      light: "#FFCDD2",
      dark: "#D32F2F",
      contrastText: "#FFFFFF", // High contrast white text
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 500,
      color: "#1C1B1F", // Material Design 3 on-surface - high contrast
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
      color: "#1C1B1F", // Material Design 3 on-surface - high contrast
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
      color: "#1C1B1F", // Material Design 3 on-surface - high contrast
      lineHeight: 1.3,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 500,
      color: "#1C1B1F", // Material Design 3 on-surface - high contrast
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 500,
      color: "#1C1B1F", // Material Design 3 on-surface - high contrast
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1.125rem",
      fontWeight: 500,
      color: "#1C1B1F", // Material Design 3 on-surface - high contrast
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      color: "#1C1B1F", // Material Design 3 on-surface - high contrast
      fontWeight: 400,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      color: "#49454F", // Material Design 3 on-surface-variant - good contrast
      fontWeight: 400,
    },
    button: {
      fontWeight: 500,
      textTransform: "none",
      color: "#FFFFFF", // High contrast white text on buttons
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
      color: "#49454F", // Material Design 3 on-surface-variant
      fontWeight: 400,
    },
    overline: {
      fontSize: "0.625rem",
      lineHeight: 1.4,
      color: "#49454F", // Material Design 3 on-surface-variant
      fontWeight: 500,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
    },
  },
  shape: {
    borderRadius: 12, // Material Design 3 rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20, // Material Design 3 pill shape
          fontWeight: 500,
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          textTransform: "none",
          color: "#FFFFFF", // High contrast white text
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0px 4px 12px rgba(103, 80, 164, 0.3)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
          "&:disabled": {
            color: "rgba(255, 255, 255, 0.38)", // Material Design 3 disabled text
            backgroundColor: "rgba(28, 27, 31, 0.12)", // Material Design 3 disabled background
          },
        },
        contained: {
          boxShadow: "0px 2px 8px rgba(103, 80, 164, 0.2)",
          "&:hover": {
            boxShadow: "0px 4px 12px rgba(103, 80, 164, 0.4)",
          },
        },
        outlined: {
          borderColor: "#6750A4",
          color: "#6750A4",
          "&:hover": {
            backgroundColor: "rgba(103, 80, 164, 0.08)",
          },
        },
        text: {
          color: "#6750A4",
          "&:hover": {
            backgroundColor: "rgba(103, 80, 164, 0.08)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
          border: "none",
          borderRadius: 16,
          backgroundColor: "#FFFFFF", // Material Design 3 surface
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          color: "#1C1B1F", // Material Design 3 on-surface
          "&:hover": {
            transform: "scale(1.02)",
            backgroundColor: "rgba(103, 80, 164, 0.08)",
          },
          "&:disabled": {
            color: "rgba(28, 27, 31, 0.38)", // Material Design 3 disabled
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "#FFFFFF", // Material Design 3 surface
            "& .MuiOutlinedInput-input": {
              color: "#1C1B1F", // Material Design 3 on-surface
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#CAC4D0", // Material Design 3 outline
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6750A4",
              borderWidth: 2,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6750A4",
              borderWidth: 2,
            },
            "&.Mui-focused .MuiInputLabel-root": {
              color: "#6750A4", // Material Design 3 primary
            },
          },
          "& .MuiInputLabel-root": {
            color: "#49454F", // Material Design 3 on-surface-variant
            "&.Mui-focused": {
              color: "#6750A4", // Material Design 3 primary
            },
          },
          "& .MuiFormHelperText-root": {
            color: "#49454F", // Material Design 3 on-surface-variant
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#FFFFFF", // Material Design 3 surface
          "& .MuiSelect-select": {
            color: "#1C1B1F", // Material Design 3 on-surface
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#CAC4D0", // Material Design 3 outline
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#6750A4",
            borderWidth: 2,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#6750A4",
            borderWidth: 2,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#FFFFFF", // Material Design 3 surface
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.12)",
          backgroundColor: "#FFFFFF", // Material Design 3 surface
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF", // Material Design 3 surface
          color: "#1C1B1F", // Material Design 3 on-surface
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.12)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "#E8DEF8", // Material Design 3 primary light
          color: "#6750A4", // Material Design 3 primary
          fontWeight: 500,
          "&.MuiChip-colorSuccess": {
            backgroundColor: "#E8F5E8", // Material Design 3 success light
            color: "#4A9C47", // Material Design 3 success
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#1C1B1F", // Material Design 3 on-surface - adaptive high contrast
          transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1)", // Smooth color transitions
        },
        // Adaptive text colors for different contexts
        h1: {
          color: "#1C1B1F", // High contrast for headings
          "&:hover": {
            color: "#6750A4", // Primary color on hover
          },
        },
        h2: {
          color: "#1C1B1F",
          "&:hover": {
            color: "#6750A4",
          },
        },
        h3: {
          color: "#1C1B1F",
          "&:hover": {
            color: "#6750A4",
          },
        },
        h4: {
          color: "#1C1B1F",
          "&:hover": {
            color: "#6750A4",
          },
        },
        h5: {
          color: "#1C1B1F",
          "&:hover": {
            color: "#6750A4",
          },
        },
        h6: {
          color: "#1C1B1F",
          "&:hover": {
            color: "#6750A4",
          },
        },
        body1: {
          color: "#1C1B1F",
          "&:hover": {
            color: "#49454F", // Slightly darker on hover
          },
        },
        body2: {
          color: "#49454F",
          "&:hover": {
            color: "#1C1B1F", // Darker on hover for better readability
          },
        },
      },
    },
  },
});

// Export the theme instance for direct use
export const mentalHealthTheme = createMentalHealthTheme(); 