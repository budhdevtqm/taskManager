/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4B2A63",
        secondary: "#1A202C",
        layoutBg: "#f1f1f1",
        navColor: "#CCC8AA",
        lightBlack: "#7D7C7C",
        textColor: "#73736E",
        error: "#2f2d2d",
      },
      gridTemplateRows: {
        7: "repeat(7, minmax(0, 1fr))",
        8: "repeat(8, minmax(0, 1fr))",
        9: "repeat(9, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
};
