// Theme configuration for ResumeDoctor AI dashboard
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6', // Blue primary color from the design
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#8b5cf6', // Purple secondary color for gradients
      light: '#a78bfa',
      dark: '#7c3aed',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f1f5f9', // Light gray background
      paper: '#ffffff'
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280'
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#1f2937'
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#1f2937'
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1f2937'
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#1f2937'
    },
    body1: {
      fontSize: '1rem',
      color: '#374151'
    },
    body2: {
      fontSize: '0.875rem',
      color: '#6b7280'
    }
  },
  shape: {
    borderRadius: 12
  }
});

export default theme;