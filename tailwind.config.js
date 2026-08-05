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
          DEFAULT: "var(--app-accent, #E4572E)",
          dark: "var(--app-accent-soft, #C2410C)",
          soft: "#F3A07A",
        },
        ochre: {
          DEFAULT: "var(--app-highlight, #D4A017)",
          soft: "#F0D78C",
          deep: "#B8860B",
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
