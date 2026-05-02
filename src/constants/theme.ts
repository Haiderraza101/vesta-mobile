/**
 * ServiceHub Design System Tokens
 * Centralized theme values for use in StyleSheet and dynamic styles
 */

export const Colors = {
  // Core surfaces
  background: "#fcf8fa",
  surface: "#fcf8fa",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f6f3f5",
  surfaceContainer: "#f0edef",
  surfaceContainerHigh: "#eae7e9",
  surfaceContainerHighest: "#e4e2e4",
  surfaceVariant: "#e4e2e4",
  surfaceDim: "#dcd9db",

  // On-surface
  onSurface: "#1b1b1d",
  onSurfaceVariant: "#45464d",
  onBackground: "#1b1b1d",

  // Primary
  primary: "#000000",
  onPrimary: "#ffffff",
  primaryContainer: "#131b2e",
  onPrimaryContainer: "#7c839b",
  primaryFixed: "#dae2fd",
  onPrimaryFixed: "#131b2e",
  onPrimaryFixedVariant: "#3f465c",

  // Secondary
  secondary: "#0051d5",
  onSecondary: "#ffffff",
  secondaryContainer: "#316bf3",
  onSecondaryContainer: "#fefcff",
  secondaryFixed: "#dbe1ff",
  secondaryFixedDim: "#b4c5ff",
  onSecondaryFixed: "#00174b",

  // Tertiary
  tertiary: "#000000",
  onTertiary: "#ffffff",
  tertiaryContainer: "#271901",
  onTertiaryContainer: "#98805d",
  tertiaryFixed: "#fcdeb5",
  tertiaryFixedDim: "#dec29a",
  onTertiaryFixed: "#271901",

  // Error
  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",

  // Outline
  outline: "#76777d",
  outlineVariant: "#c6c6cd",

  // Inverse
  inverseSurface: "#303032",
  inverseOnSurface: "#f3f0f2",
  inversePrimary: "#bec6e0",

  // Utility
  blue600: "#2563EB",
  blue500: "#3B82F6",
  emerald500: "#10B981",
  emerald600: "#059669",
} as const;

export const Shadows = {
  sm: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
} as const;

export const Spacing = {
  unit: 4,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  gutter: 16,
  marginMobile: 16,
  marginDesktop: 48,
} as const;

export const Typography = {
  h1: { fontFamily: "Manrope-Bold", fontSize: 32, lineHeight: 38.4, letterSpacing: -0.64 },
  h2: { fontFamily: "Manrope-SemiBold", fontSize: 24, lineHeight: 31.2, letterSpacing: -0.24 },
  h3: { fontFamily: "Manrope-SemiBold", fontSize: 20, lineHeight: 28 },
  bodyLg: { fontFamily: "Inter", fontSize: 18, lineHeight: 28.8 },
  bodyMd: { fontFamily: "Inter", fontSize: 16, lineHeight: 24 },
  bodySm: { fontFamily: "Inter", fontSize: 14, lineHeight: 21 },
  labelMd: { fontFamily: "Inter-SemiBold", fontSize: 14, lineHeight: 14, letterSpacing: 0.28 },
  labelSm: { fontFamily: "Inter-Medium", fontSize: 12, lineHeight: 12, letterSpacing: 0.48 },
} as const;
