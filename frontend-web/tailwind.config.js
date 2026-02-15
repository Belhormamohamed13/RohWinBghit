/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#e8b84b", // Gold
        teal: "#0ddba8",
        "background-light": "#f8f9fa",
        "background-dark": "#060709",
        accent: "#1a1c20",
      },
      fontFamily: {
        display: ["Bebas Neue", "sans-serif"],
        sans: ["Almarai", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "12px",
        'xl': '24px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(232, 184, 75, 0.2)',
      }
    },
  },
  plugins: [],
}
