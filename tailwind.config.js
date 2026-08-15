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
          DEFAULT: "#C46B4A",
          dark: "#9A4E34",
          soft: "#E8A88A",
        },
        ochre: {
          DEFAULT: "#D4A017",
          soft: "#F0D78C",
          deep: "#B8860B",
        },
        teal: {
          ink: "#0F3D3E",
          deep: "#1A5F61",
          mist: "#D6EDEA",
        },
        parchment: {
          DEFAULT: "#F7F0E4",
          warm: "#EFE4D2",
          ink: "#2C2416",
        },
      },
    },
  },
  plugins: [],
};
