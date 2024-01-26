/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "even-sm": "0 0 10px rgb(0 0 0 / 0.1)",
        "even-md": "0 0 25px rgb(0 0 0 / 0.1)",
        "even-lg": "0 0 50px rgb(0 0 0 / 0.1)",
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
          DEFAULT: "rgb(var(--color-paper) / <alpha-value>)",
          contrast: "rgb(var(--color-paper-contrast) / <alpha-value>)",
        },
        error: {
          DEFAULT: "rgb(var(--color-error) / <alpha-value>)",
        },
      },
      transitionProperty: {
        width: "width",
      },
      fontSize: {
        inherit: "inherit",
      },
    },
    screens: {
      xl: {
        max: "1170px",
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
      secondary: '"Montserrat", sans-serif',
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
