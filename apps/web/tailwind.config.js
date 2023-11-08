/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        inherit: "inherit",
      },
      colors: {
        main: {
          200: "var(--color-main-200)",
          300: "var(--color-main-300)",
          400: "var(--color-main-400)",
          500: "rgb(var(--color-main-500) / <alpha-value>)",
          600: "var(--color-main-600)",
          700: "var(--color-main-700)",
          800: "var(--color-main-800)",
          900: "var(--color-main-900)",
          DEFAULT: "rgb(var(--color-main-500) / <alpha-value>)",
          contrast: "rgb(var(--color-main-contrast) / <alpha-value>)",
        },
        accent: {
          200: "var(--color-accent-200)",
          300: "var(--color-accent-300)",
          400: "var(--color-accent-400)",
          500: "var(--color-accent-500)",
          600: "var(--color-accent-600)",
          700: "var(--color-accent-700)",
          800: "var(--color-accent-800)",
          900: "var(--color-accent-900)",
          DEFAULT: "var(--color-accent-500)",
          contrast: "var(--color-accent-contrast)",
        },
        paper: {
          brand: "rgb(var(--color-paper-brand) / <alpha-value>)",
          DEFAULT: "var(--color-paper)",
          contrast: "rgb(var(--color-paper-contrast) / <alpha-value>)",
        },
        error: {
          DEFAULT: "rgb(var(--color-error) / <alpha-value>)",
        },
      },
    },
    screens: {
      "2xl": {
        max: "1480px",
      },
      xl: {
        max: "1200px",
      },
      lg: {
        max: "992px",
      },
      md: {
        max: "768px",
      },
      sm: {
        max: "576px",
      },
    },
    fontFamily: {
      body: '"Inter", sans-serif',
    },
  },
  plugins: [],
};
