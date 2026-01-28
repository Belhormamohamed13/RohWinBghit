/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#3498DB",
          "blue-dark": "#2980B9",
          green: "#2ECC71",
          "green-dark": "#27AE60"
        }
      }
    }
  },
  plugins: []
};

