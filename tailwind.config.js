/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#0E2A3A",
        sub: "#5A7A8A",
        line: "#D6E6EE",
        brand: {
          50: "#EAF5FA",
          100: "#D3EAF3",
          200: "#A9D6E8",
          300: "#78BEDA",
          400: "#3E9BC1",
          500: "#1C7DA3",
          600: "#146385",
          700: "#0F4E6A",
          800: "#0C3C53",
          900: "#082A3B",
        },
        sky: {
          50: "#F2F9FC",
          100: "#E4F1F8",
          200: "#CFE7F5",
          300: "#B7DAEE",
        },
        leaf: "#2F9E6E",
        clay: "#C97B3D",
        berry: "#C4536B",
        gold: "#C79A2C",
      },
      boxShadow: {
        soft: "0 8px 24px -8px rgba(14, 42, 58, 0.18)",
        card: "0 2px 10px -2px rgba(14, 42, 58, 0.10)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      backgroundImage: {
        "sky-fade": "linear-gradient(180deg, #E4F1F8 0%, #F2F9FC 55%, #FFFFFF 100%)",
      },
    },
  },
  plugins: [],
};
