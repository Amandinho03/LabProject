/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
    
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
        serif: ['"Newsreader"', "Georgia", "serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#115E28",
          dark: "#0a3a18",
          soft: "#dcfce7",
          vibrant: "#3BB54A",
        },
        ink: {
          DEFAULT: "#000000",
          muted: "#4b5563",
        },
        base: {
          DEFAULT: "#ffffff",
          soft: "#f5faf6",
        },
        border: "#dfe9e1",
        success: {
          bg: "#dcfce7",
          text: "#115E28",
          border: "#86efac",
        },
        error: {
          bg: "#fee2e2",
          text: "#991b1b",
          border: "#fca5a5",
        },
        danger: {
          DEFAULT: "#dc2626",
          dark: "#991b1b",
        },
      },
    },
  },
  plugins: [],
};
