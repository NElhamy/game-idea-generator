import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        xl: "0 10px 25px -5px rgba(0, 0, 0, 0.25)",
        "2xl": "0 20px 50px -10px rgba(0, 0, 0, 0.3)",
      },
      colors: {
        zinc: {
          950: "#09090b", // optional deeper dark background
        },
      },
    },
  },
  plugins: [],
};

export default config;
