import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aguamarina palette
        aqua: {
          50: "var(--aqua-50)",
          100: "var(--aqua-100)",
          200: "var(--aqua-200)",
          300: "var(--aqua-300)",
          400: "var(--aqua-400)",
          500: "var(--aqua-500)",
          600: "var(--aqua-600)",
          700: "var(--aqua-700)",
          800: "var(--aqua-800)",
          900: "var(--aqua-900)",
        },
        terra: {
          50: "var(--terra-50)",
          100: "var(--terra-100)",
          200: "var(--terra-200)",
          300: "var(--terra-300)",
          400: "var(--terra-400)",
          500: "var(--terra-500)",
          600: "var(--terra-600)",
          700: "var(--terra-700)",
          800: "var(--terra-800)",
          900: "var(--terra-900)",
        },
        gold: {
          50: "var(--gold-50)",
          100: "var(--gold-100)",
          200: "var(--gold-200)",
          300: "var(--gold-300)",
          400: "var(--gold-400)",
          500: "var(--gold-500)",
          600: "var(--gold-600)",
          700: "var(--gold-700)",
          800: "var(--gold-800)",
          900: "var(--gold-900)",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
