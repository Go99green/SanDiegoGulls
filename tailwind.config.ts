import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gulls: {
          orange: "#FC4C02",
          blue: "#0088CE",
          black: "#010101",
          silver: "#BFCED6",
          cyan: "#2DD4FF",
        },
        command: {
          bg: "#050607",
          panel: "#0B0D10",
          panel2: "#11151A",
          stroke: "rgba(191,206,214,0.16)",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        card: "0 18px 60px rgba(0,0,0,.35)",
        orangeGlow: "0 0 30px rgba(252,76,2,.32)",
        blueGlow: "0 0 30px rgba(0,136,206,.25)",
      },
      backgroundImage: {
        "command-grid": "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
