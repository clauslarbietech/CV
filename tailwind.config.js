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
      fontFamily: {
        sans: [
          "Poppins",
          "Poppins_400Regular",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        medium: ["Poppins_500Medium", "Poppins", "sans-serif"],
        semibold: ["Poppins_600SemiBold", "Poppins", "sans-serif"],
        bold: ["Poppins_700Bold", "Poppins", "sans-serif"],
      },
      colors: {
        terracotta: {
          DEFAULT: "var(--app-accent, #E4572E)",
          dark: "var(--app-accent-soft, #C2410C)",
          soft: "var(--app-brand-soft, #F07A4A)",
        },
        /**
         * Brand accent aliases — orange in both day and night (not tan/gold).
         * Legacy `ochre` class names still work; values come from ThemeProvider.
         */
        ochre: {
          DEFAULT: "var(--app-brand, #E4572E)",
          soft: "var(--app-brand-soft, #F07A4A)",
          deep: "var(--app-accent, #E4572E)",
        },
        teal: {
          // Remapped from navy/blue to night gray so legacy bg-teal-* buttons stay on-brand.
          ink: "#2C2C2E",
          deep: "#3A3A3C",
          mist: "#3A3A3C",
        },
        parchment: {
          DEFAULT: "#F7F4EF",
          warm: "#F1EBE2",
          ink: "#1F2430",
        },
        /**
         * App surfaces — values come from ThemeProvider via CSS vars
         * (`--app-*`). Fallbacks keep the classic night charcoal if unset.
         */
        night: {
          bg: "var(--app-bg, #121212)",
          card: "var(--app-card, #1C1C1E)",
          elevated: "var(--app-elevated, #2C2C2E)",
          border: "var(--app-border, #3A3A3C)",
          text: "var(--app-text, #F2F2F7)",
          muted: "var(--app-muted, #AEAEB2)",
          soft: "var(--app-soft, #8E8E93)",
        },
      },
    },
  },
  plugins: [],
};
