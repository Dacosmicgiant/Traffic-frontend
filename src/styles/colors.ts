// Theme colors for the application
export const colors = {
  light: {
    // Primary colors - Indian theme inspired
    primary: "#1e40af",      // Blue-600
    primaryHover: "#1d4ed8",  // Blue-700
    secondary: "#059669",     // Emerald-600
    accent: "#dc2626",        // Red-600
    
    // Background colors
    background: "#ffffff",     // Pure white
    backgroundSecondary: "#f8fafc", // Slate-50
    backgroundTertiary: "#f1f5f9",  // Slate-100
    
    // Text colors
    textPrimary: "#0f172a",    // Slate-900
    textSecondary: "#475569",   // Slate-600
    textTertiary: "#94a3b8",    // Slate-400
    
    // Border colors
    border: "#e2e8f0",         // Slate-200
    borderHover: "#cbd5e1",     // Slate-300
    
    // Chat specific colors
    userMessage: "#3b82f6",     // Blue-500
    assistantMessage: "#f8fafc", // Slate-50
    chatInput: "#ffffff",       // White
    
    // Status colors
    success: "#10b981",         // Emerald-500
    warning: "#f59e0b",         // Amber-500
    error: "#ef4444",           // Red-500
    info: "#3b82f6",            // Blue-500
  },
  
  dark: {
    // Primary colors - adjusted for dark mode
    primary: "#3b82f6",        // Blue-500
    primaryHover: "#2563eb",    // Blue-600
    secondary: "#10b981",       // Emerald-500
    accent: "#f87171",          // Red-400
    
    // Background colors
    background: "#0f172a",      // Slate-900
    backgroundSecondary: "#1e293b", // Slate-800
    backgroundTertiary: "#334155",  // Slate-700
    
    // Text colors
    textPrimary: "#f8fafc",     // Slate-50
    textSecondary: "#cbd5e1",    // Slate-300
    textTertiary: "#64748b",     // Slate-500
    
    // Border colors
    border: "#334155",          // Slate-700
    borderHover: "#475569",      // Slate-600
    
    // Chat specific colors
    userMessage: "#3b82f6",     // Blue-500
    assistantMessage: "#1e293b", // Slate-800
    chatInput: "#1e293b",       // Slate-800
    
    // Status colors
    success: "#22c55e",         // Green-500
    warning: "#fbbf24",         // Amber-400
    error: "#f87171",           // Red-400
    info: "#60a5fa",            // Blue-400
  }
} as const;

// Export type for TypeScript
export type Theme = "light" | "dark";
export type ThemeColors = typeof colors.light | typeof colors.dark;

// Helper function to get current theme colors
export const getThemeColors = (theme: Theme): ThemeColors => {
  return colors[theme];
};