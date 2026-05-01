/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F172A",
          foreground: "#FFFFFF",
        },
        brand: {
          DEFAULT: "#2563EB",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#64748B",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#10B981",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#94A3B8",
          foreground: "#F8FAFC",
        },
        border: "#E2E8F0",
        background: "#F8FAFC",
        foreground: "#0F172A",
        destructive: "#EF4444",
      },
      fontFamily: {
        poppins: ["Poppins"],
      },
    },
  },
  plugins: [],
};
