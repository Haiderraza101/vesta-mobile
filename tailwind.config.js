/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#fcf8fa",
        surface: "#fcf8fa",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f6f3f5",
        "surface-container": "#f0edef",
        "surface-container-high": "#eae7e9",
        "surface-container-highest": "#e4e2e4",
        "surface-variant": "#e4e2e4",
        "surface-dim": "#dcd9db",

        "on-surface": "#1b1b1d",
        "on-surface-variant": "#45464d",
        "on-background": "#1b1b1d",

        primary: "#000000",
        "on-primary": "#ffffff",
        "primary-container": "#131b2e",
        "on-primary-container": "#7c839b",
        "primary-fixed": "#dae2fd",
        "primary-fixed-dim": "#bec6e0",
        "on-primary-fixed": "#131b2e",
        "on-primary-fixed-variant": "#3f465c",

        secondary: "#0051d5",
        "on-secondary": "#ffffff",
        "secondary-container": "#316bf3",
        "on-secondary-container": "#fefcff",
        "secondary-fixed": "#dbe1ff",
        "secondary-fixed-dim": "#b4c5ff",
        "on-secondary-fixed": "#00174b",
        "on-secondary-fixed-variant": "#003ea8",

        tertiary: "#000000",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#271901",
        "on-tertiary-container": "#98805d",
        "tertiary-fixed": "#fcdeb5",
        "tertiary-fixed-dim": "#dec29a",
        "on-tertiary-fixed": "#271901",
        "on-tertiary-fixed-variant": "#574425",

        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        outline: "#76777d",
        "outline-variant": "#c6c6cd",

        "inverse-surface": "#303032",
        "inverse-on-surface": "#f3f0f2",
        "inverse-primary": "#bec6e0",

        "surface-bright": "#fcf8fa",
        "surface-tint": "#565e74",

        "blue-600": "#2563EB",
        "blue-500": "#3B82F6",
        "emerald-600": "#059669",
        "emerald-500": "#10B981",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        xl: 32,
        "margin-mobile": 16,
        unit: 4,
        sm: 8,
        "margin-desktop": 48,
        md: 16,
        gutter: 16,
        xs: 4,
        lg: 24,
      },
      fontFamily: {
        inter: ["Inter"],
        manrope: ["Manrope"],
      },
    },
  },
  plugins: [],
};
