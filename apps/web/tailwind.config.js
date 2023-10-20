/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    screens: {
      "2xl": {
        max: "1280px",
      },
      xl: {
        max: "1024px",
      },
      lg: {
        max: "768px",
      },
      md: {
        max: "480px",
      },
      sm: {
        max: "320px",
      },
    },
    fontFamily: {
      body: '"Inter", sans-serif',
    },
  },
  plugins: [],
};
