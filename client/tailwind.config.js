/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#008080",
        secondary: "#EAF4FC",
        layoutBg: "#f1f1f1",
        navColor: "#CCC8AA",
        lightBlack: "#C0C0C0",
        textColor: "#73736E",
        error: "#2f2d2d",
        errorWhite: "#ffffff",
        layoutHeader: "#f4d35e",
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
