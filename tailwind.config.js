/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#007AFF",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F2F2F7",
          foreground: "#000000",
        },
        destructive: {
          DEFAULT: "#FF3B30",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#8E8E93",
          foreground: "#FFFFFF",
        },
        background: "#FFFFFF",
        foreground: "#000000",
        border: "#C7C7CC",
      },
    },
  },
  plugins: [],
};
