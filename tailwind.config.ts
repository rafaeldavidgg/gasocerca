/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tinta: {
          DEFAULT: "#141a13",
          suave: "#2a3328",
        },
        papel: {
          DEFAULT: "#faf6ec",
          oscuro: "#10160f",
        },
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
      },
      fontFamily: {
        display: ["var(--font-display)", "Arial Narrow", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        sticker: "2px 2px 0 0 #141a13",
        "sticker-lg": "3px 3px 0 0 #141a13",
        senal: "0 0 0 3px rgb(22 163 74 / 0.3), 0 2px 8px rgb(0 0 0 / 0.4)",
      },
      borderRadius: {
        ticket: "0.875rem",
      },
    },
  },
  plugins: [],
};

export default config;
