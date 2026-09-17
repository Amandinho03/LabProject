module.exports = {
  content: ["./public/**/*.html"],
  theme: {
    extend: {
      colors: {
        primary: "#3333b1",
        primaryDark: "#24247e",
        primarySoft: "#ececfb",
        ink: "#1f2021",
        inkMuted: "#55565c",
        bgSoft: "#f7f7fb",
        border: "#e3e3f0",
        errorBg: "#fbeaec", errorText: "#8a1f26", errorBorder: "#f2c3c8",
        successBg: "#e9f5ec", successText: "#1e6b3c", successBorder: "#bfe3cb",
      },
      fontFamily: {
        serif: ["Newsreader", "Georgia", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: { sm: "6px", md: "10px", lg: "18px" },
    },
  },
};