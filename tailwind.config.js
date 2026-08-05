/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: "#E4572E",
          dark: "#C2410C",
          soft: "#F3A07A",
        },
        ochre: {
          DEFAULT: "#D4A017",
          soft: "#F0D78C",
          deep: "#B8860B",
        },
        teal: {
          ink: "#15233F",
          deep: "#1E3A6E",
          mist: "#E7EEF8",
        },
        parchment: {
          DEFAULT: "#F7F4EF",
          warm: "#F1EBE2",
          ink: "#1F2430",
        },
        /** App-wide night / dark mode — WCAG-friendlier charcoal, not pure black */
        night: {
          bg: "#121212",
          card: "#1C1C1E",
          elevated: "#2C2C2E",
          border: "#3A3A3C",
          text: "#F2F2F7",
          muted: "#AEAEB2",
          soft: "#8E8E93",
        },
      },
    },
  },
  plugins: [],
};
