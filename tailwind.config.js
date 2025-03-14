/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6C4FF6",
        secondary: "#F14F4F",
      },
      fontFamily: {
        firago: ["FiraGO", "sans-serif"],
        fredoka: ["Fredoka One", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1rem",
      },
    },
  },
  plugins: [],
};