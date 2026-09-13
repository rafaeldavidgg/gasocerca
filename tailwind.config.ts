/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        energia: {
          50: "#f2fbf0",
          100: "#e1f6dc",
          200: "#c4ecbc",
          300: "#9bdd92",
          400: "#6cc962",
          500: "#3daa34",
          600: "#2c8826",
          700: "#256d22",
          800: "#21581f",
          900: "#1d4a1d",
        },
        sol: {
          400: "#ffd23f",
          500: "#f5b800",
        },
      },
    },
  },
  plugins: [],
};

export default config;
